import { db, auth } from "../../../app.js";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class RecentTransactions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._transactions = [];

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "transaction-card.css");
    this.shadowRoot.appendChild(linkElem);

    this.render();
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }


  async getTransactions(userId) {
    try {
      // 1. Referência à subcoleção de transações do usuário
      const transactionsRef = collection(db, "user", userId, "user_transactions");
      
      // 2. Criar query para buscar as transações
      const q = query(
        transactionsRef,
        orderBy("date", "desc"), // Ordena por data (mais recente primeiro)
        limit(10)               // Limita a 10 resultados
      );
  
      // 3. Executar a query
      const querySnapshot = await getDocs(q);
      
      // 4. Processar os resultados
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id, // Inclui o ID do documento
          ...doc.data() // Inclui todos os campos do documento
        });
      });
  
      this.transactions = transactions;
      return transactions;
  
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      this.transactions = [];
      return [];
    }
  }

  createTransactionItem(transaction) {
    const item = document.createElement("div");

    const iconClass = transaction.transaction_type === "income" ? "icon-income" : "icon-expense";
    const amountClass = transaction.transaction_type === "income" ? "amount-income" : "amount-expense";
    const iconSymbol = transaction.transaction_type === "income" ? "↗" : "↘";
    const amountPrefix = transaction.transaction_type === "income" ? "+" : "-";
    const leftBorderColor = transaction.transaction_type === "income" ? 'green-border' : 'red-border';

    item.className = `transaction-item ${leftBorderColor}`;

    item.innerHTML = `
      <link rel="stylesheet" href="/css/components/recentTransactions.css">
      <div class="transaction-info">
        <div class="${iconClass}">
          <span class="icon">${iconSymbol}</span>
        </div>
        <div class="description">
          <p>${transaction.category || "Sem categoria"}</p>
          <p class="date">${transaction.date || "Data desconhecida"}</p>
        </div>
      </div>
      <div class="${amountClass}">
        ${amountPrefix} ${this.formatCurrency(transaction.value || 0)}
      </div>
    `;

    return item;
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

    // Verifica se _transactions é um array
    if (Array.isArray(this._transactions)) {
      this._transactions.forEach((transaction) => {
        content.appendChild(this.createTransactionItem(transaction));
      });
    }

    card.appendChild(header);
    card.appendChild(content);

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
    // Garante que value seja sempre um array
    if (Array.isArray(value)) {
      this._transactions = value;
    } else if (value) {
      this._transactions = [value]; // Converte objeto único em array
    } else {
      this._transactions = []; // Valor padrão para array vazio
    }
    this.render();
  }

  get transactions() {
    return this._transactions;
  }

  async connectedCallback() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.getTransactions(user.uid);
        this.renderLogoutButton();
      } else {
        console.log("Usuário não autenticado");
      }
      this.render();
    });
    this.render();
  }
}

customElements.define("recent-transactions", RecentTransactions);