import { db, auth } from "../../../app.js";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class RecentTransactions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._transactions = [];
    this.loading = false;

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "transaction-card.css");
    this.shadowRoot.appendChild(linkElem);
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  async getTransactions(userId) {
    try {
      this.loading = true;
      this.render(); // Show skeletons while loading
      // 1. Referência à subcoleção de transações do usuário
      const transactionsRef = collection(
        db,
        "user",
        userId,
        "user_transactions"
      );

      // 2. Criar query para buscar as transações
      const q = query(
        transactionsRef,
        orderBy("date", "desc"), // Ordena por data (mais recente primeiro)
        limit(10) // Limita a 10 resultados
      );

      // 3. Executar a query
      const querySnapshot = await getDocs(q);

      // 4. Processar os resultados
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id, // Inclui o ID do documento
          ...doc.data(), // Inclui todos os campos do documento
        });
      });

      this.transactions = transactions;
      this.loading = false;
      this.render();

      return transactions;
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      this.transactions = [];
      return [];
    }
  }

  createTransactionItem(transaction) {
    const item = document.createElement("div");

    // Helper to format date as dd/mm/yyyy
    const formatDate = (dateStr) => {
      try {
        // Adiciona o horário e ajusta para o fuso horário local
        const date = new Date(dateStr);

        // Ajusta para o fuso horário local sem mudar o valor absoluto
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

        return adjustedDate.toLocaleDateString('pt-BR');
      } catch {
        return "Data inválida";
      }
    };
    // Helper to capitalize first letter
    const capitalize = (str) =>
      typeof str === "string" && str.length > 0
        ? str.charAt(0).toUpperCase() + str.slice(1)
        : str;

    const iconClass =
      transaction.transaction_type === "income"
        ? "icon-income"
        : "icon-expense";
    const amountClass =
      transaction.transaction_type === "income"
        ? "amount-income"
        : "amount-expense";
    const iconSymbol = transaction.transaction_type === "income" ? "↗" : "↘";
    const amountPrefix = transaction.transaction_type === "income" ? "+" : "-";
    const leftBorderColor =
      transaction.transaction_type === "income" ? "green-border" : "red-border";

    item.className = `transaction-item ${leftBorderColor}`;

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Excluir transação";
    deleteBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("Tem certeza que deseja excluir esta transação?")) return;
      const user = auth.currentUser;
      if (!user) return alert("Usuário não autenticado");
      try {
        await deleteDoc(doc(db, "user", user.uid, "user_transactions", transaction.id));
        // Remove from local array and re-render
        this._transactions = this._transactions.filter(t => t.id !== transaction.id);
        this.render();
      } catch (err) {
        alert("Erro ao excluir transação");
        console.error(err);
      }
    });

    item.innerHTML = `
      <link rel="stylesheet" href="./css/components/recentTransactions.css">
      <div class="transaction-info">
        <div class="${iconClass}">
          <span class="icon">${iconSymbol}</span>
        </div>
        <div class="description">
          <p>${capitalize(transaction.description) || "Sem descrição"}</p>
          <p class="category">${capitalize(transaction.category) || "Sem categoria"}</p>
        </div>
      </div>
      <div class="transaction-amount">
        <div class="${amountClass}">
          ${amountPrefix} ${this.formatCurrency(transaction.value || 0)}
        </div>
        <div class="transaction-date">
          <p class="date">${formatDate(transaction.date)}</p>
        </div>
      </div>
      <div class="delete-hover"></div>
    `;
    // Place delete button inside the delete-hover div
    item.querySelector('.delete-hover').appendChild(deleteBtn);
    return item;
  }

  renderSkeleton() {
    const skeleton = document.createElement("div");
    skeleton.className = "card";
    skeleton.innerHTML = `
      <link rel="stylesheet" href="./css/components/recentTransactions.css">
      <div class="card-header">
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
      </div>
      <div class="card-content">
        <div class="transaction-skeleton">
          <div class="skeleton-info">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text"></div>
          </div>
          <div class="skeleton-amount"></div>
        </div>
      </div>
    `;
    return skeleton;
  }

  render() {
    const card = document.createElement("div");
    card.className = "card";
    const header = document.createElement("div");
    header.className = "card-header";
    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = "Transações recentes";
    const subtitle = document.createElement("p");
    subtitle.className = "card-subtitle";
    subtitle.textContent = "Veja aqui suas transações mais recentes";
    header.appendChild(title);
    header.appendChild(subtitle);
    const content = document.createElement("div");
    content.className = "card-content";
    if (this.loading) {
      // Show skeleton for title, subtitle, and 5 transaction rows
      card.innerHTML = `
        <link rel="stylesheet" href="../../../public/css/components/recentTransactions.css">
        <div class="card-header">
          <div class="skeleton-title"></div>
          <div class="skeleton-subtitle"></div>
        </div>
        <div class="card-content">
          ${Array(5)
          .fill()
          .map(
            () => `
            <div class="transaction-skeleton">
              <div class="skeleton-info">
                <div class="skeleton-icon"></div>
                <div class="skeleton-text"></div>
              </div>
              <div class="skeleton-amount"></div>
            </div>
          `
          )
          .join("")}
        </div>
      `;
    } else if (Array.isArray(this._transactions)) {
      this._transactions.forEach((transaction) => {
        content.appendChild(this.createTransactionItem(transaction));
      });
      card.appendChild(header);
      card.appendChild(content);
    }
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "transaction-card.css");
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(card);
  }

  set transactions(value) {
    // Sort by timestamp descending if available, otherwise by date
    if (Array.isArray(value)) {
      value.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }
        // fallback to date
        return new Date(b.date) - new Date(a.date);
      });
      this._transactions = value;
    } else if (value) {
      this._transactions = [value];
    } else {
      this._transactions = [];
    }
    this.render();
  }

  get transactions() {
    return this._transactions;
  }

  async connectedCallback() {
    // Keep loading skeleton, but do not load from localStorage
    this.loading = true;
    this.render();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.getTransactions(user.uid);
      } else {
        this.loading = false;
        this.transactions = [];
        this.render();
        console.log("Usuário não autenticado");
      }
    });
  }
}
customElements.define("recent-transactions", RecentTransactions);
