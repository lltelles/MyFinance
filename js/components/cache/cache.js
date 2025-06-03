import { db, auth } from "../../app.js";
import { collection, query, getDocs, or, where, doc, getDoc, orderBy, limit }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export default class Cache {
    constructor() {
        this._colorPalette = [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
            "#FF9F40", "#8AC24A", "#F06292", "#7986CB", "#4DB6AC",
            "#FF8A65", "#A1887F"
        ];
        this.data = {
            profileDataCache: {
                name: "",
                last_name: "",
                full_name: "",
                email: "",
                location: "",
            },
            budget: {
                category: "",
                budget: 0,
                spent: 0,
            },
            transactions: [],
            transaction_categories: {
                name: "",
                value: "",
            },
            totals: {
                income: 0,
                expense: 0,
                balance: 0,
            }
        };
        this.initAuthListener();
    }

    async getTransactions(userId) {
        try {
            const transactionsRef = collection(db, "user", userId, "user_transactions");
            const q = query(
                transactionsRef,
                orderBy("date", "desc"),
                limit(10)
            );

            const querySnapshot = await getDocs(q);

            const transactions = [];
            querySnapshot.forEach((doc) => {
                transactions.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            // Atualiza os dados antes de salvar
            this.data.transactions = transactions;
            this.saveToLocalStorage();

            return transactions; // Retorna o array criado

        } catch (error) {
            console.error("Erro ao carregar transações:", error);
            this.data.transactions = [];
            this.saveToLocalStorage();
            return [];
        }
    }


    async loadProfileData(userId) {
        try {
            const userDocRef = doc(db, "user", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                this.data.profileDataCache = {
                    ...this.data.profileDataCache,
                    ...userData,
                    full_name: `${userData.name || ''} ${userData.last_name || ''}`.trim(),
                    email: userData.email || auth.currentUser?.email || ""
                };
            } else {
                console.log("Documento não encontrado! Usando dados padrão.");
                this.data.profileData.email = auth.currentUser?.email || "";
            }

            this.saveToLocalStorage();
            return this.data.profileDataCache;
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            this.data.profileData.email = "Erro ao carregar perfil";
            throw error;
        }
    }

    async calculateBalance(userId) {
        try {
            const transactionsRef = collection(db, "user", userId, "user_transactions");
            const q = query(
                transactionsRef,
                or(
                    where("transaction_type", "==", "expense"),
                    where("transaction_type", "==", "income")
                )
            );

            const querySnapshot = await getDocs(q);

            let totalIncome = 0;
            let totalExpense = 0;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const amount = Number(data.value) || 0;

                if (data.transaction_type === "income") {
                    totalIncome += amount;
                } else if (data.transaction_type === "expense") {
                    totalExpense += amount;
                }
            });

            const balance = totalIncome - totalExpense;

            this.data.totals = {
                income: totalIncome,
                expense: totalExpense,
                balance: balance
            };

            this.saveToLocalStorage();
            return this.data.totals;
        } catch (error) {
            console.error("Erro ao calcular saldo:", error);
            throw error;
        }
    }

    async CalculateBudget(userId) {
        try {
            const transactionsRef = collection(db, "user", userId, "user_transactions");
            const budgetsRef = collection(db, "user", userId, "user_budgets");

            // Busca transações e orçamentos em paralelo
            const [transactionsSnapshot, budgetsSnapshot] = await Promise.all([
                getDocs(query(transactionsRef)),
                getDocs(query(budgetsRef))
            ]);

            let spendingByCategory = {};
            let budgetsByCategory = {};

            // Orçamentos padrão (serão usados apenas como fallback)
            const defaultBudgets = {
                'alimentacao': 800,
                'transporte': 500,
                'moradia': 3000,
                'lazer': 300,
                'saude': 400,
                'educacao': 600,
                'outros': 200
            };

            // Processa transações
            transactionsSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.transaction_type === 'expense') {
                    spendingByCategory[data.category] =
                        (spendingByCategory[data.category] || 0) + data.value;
                }
            });

            // Processa orçamentos personalizados
            budgetsSnapshot.forEach((doc) => {
                const data = doc.data();
                budgetsByCategory[data.category] = data.amount;
            });

            this.data.budget = Object.keys(spendingByCategory).map(category => ({
                category: category,
                spent: spendingByCategory[category],
                budget: budgetsByCategory[category] || defaultBudgets[category] || 1200
            }));

            this.saveToLocalStorage();
            return this.data.budget;

        } catch (error) {
            console.error("Erro ao calcular orçamentos:", error);
            this.data.budget = [];
            this.saveToLocalStorage();
            return [];
        }
    }

    async saveUserBudget(userId, category, amount) {
        try {
            const budgetsRef = collection(db, "user", userId, "user_budgets");

            // Verifica se já existe um orçamento para esta categoria
            const q = query(budgetsRef, where("category", "==", category));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Atualiza o existente
                const docId = querySnapshot.docs[0].id;
                await updateDoc(doc(budgetsRef, docId), { amount });
            } else {
                // Cria novo
                await addDoc(budgetsRef, {
                    category,
                    amount,
                    createdAt: new Date()
                });
            }

            // Atualiza o cache
            await this.CalculateBudget(userId);
            return true;
        } catch (error) {
            console.error("Erro ao salvar orçamento:", error);
            return false;
        }
    }

    async transactionCategory(userId) {
        try {
            const transactionsRef = collection(db, "user", userId, "user_transactions");
            const q = query(transactionsRef);
            const querySnapshot = await getDocs(q);

            const spendingByCategory = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.transaction_type === 'expense' && data.category) {
                    const value = Number(data.value) || 0;
                    spendingByCategory[data.category] =
                        (spendingByCategory[data.category] || 0) + value;
                }
            });

            // Transforma em array com name, value e color
            this.data.transaction_categories = Object.entries(spendingByCategory)
                .map(([name, value], index) => ({
                    name,
                    value,
                    color: this._colorPalette[index % this._colorPalette.length]
                }));

            this.saveToLocalStorage();
            return this.data.transaction_categories;

        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            this.data.transaction_categories = [];
            this.saveToLocalStorage();
            return [];
        }
    }

    initAuthListener() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    await this.CalculateBudget(user.uid);
                    await this.calculateBalance(user.uid);
                    await this.loadProfileData(user.uid);
                    await this.transactionCategory(user.uid);
                    await this.getTransactions(user.uid);
                    console.log("Dados atualizados para o usuário:", user.uid);
                } catch (error) {
                    console.error("Erro ao atualizar dados:", error);
                }
            } else {
                console.log("Usuário não autenticado");
                this.clearCache();
            }
        });
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem("cache", JSON.stringify(this.data));
        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
        }
    }

    loadFromLocalStorage() {
        try {
            const cachedData = localStorage.getItem("cache");
            if (cachedData) {
                this.data = JSON.parse(cachedData);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao carregar do localStorage:", error);
            return false;
        }
    }

    clearCache() {
        this.data = {
            transactions: [],
            profileData: {
                name: "",
                last_name: "",
                full_name: "",
                email: "",
                location: "",
            },
            totals: {
                income: 0,
                expense: 0,
                balance: 0
            }
        };
        localStorage.removeItem("cache");
    }
}