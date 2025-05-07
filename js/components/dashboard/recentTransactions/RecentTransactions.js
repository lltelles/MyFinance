import { db } from "../../../app.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

  async getTransactions() {
    try {
      const userDocRef = doc(db, "user_transactions", "k6FiJnchr2qRkIPV5RGV");
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Verifica se existe um campo de transações e formata corretamente
        if (userData.transactions && Array.isArray(userData.transactions)) {
          this.transactions = userData.transactions;
        } else {
          // Se não houver array de transações, cria um array com os dados principais
          this.transactions = [{
            category: userData.category || "Sem categoria",
            value: userData.value || 0,
            transaction_type: userData.transaction_type || "expense",
            date: userData.date || new Date().toLocaleDateString()
          }];
        }
        return this._transactions;
      } else {
        console.log("Documento não encontrado!");
        this.transactions = [];
        return [];
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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
    await this.getTransactions();
    this.render();
  }
}

customElements.define("recent-transactions", RecentTransactions);