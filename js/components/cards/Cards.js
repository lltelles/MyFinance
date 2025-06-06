import { db, auth } from "../../app.js";
import { collection, query, getDocs, or, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class FinancialSummaryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._totalIncome = 0;
    this._totalExpanse = 0;
    this._balance = 0;
    this.loading = true;

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "financial-summary-card.css")

    this.shadowRoot.appendChild(linkElem)
    this.render();
  }

  async CalculateBalance(userId) {
    try {
      // 1. Referência à subcoleção de transações do usuário
      const transactionsRef = collection(db, "user", userId, "user_transactions");
      // 2. Criar query para buscar as transações
      const q = query(transactionsRef,
        or(
          where("transaction_type", "==", "expense"),
          where("transaction_type", "==", "income")
        )
      );
      const querySnapshot = await getDocs(q);
      this._totalIncome = 0;
      this._totalExpanse = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const amount = Number(data.value) || 0;
        if (data.transaction_type == "income") {
          this._totalIncome += amount;
        } else if (data.transaction_type == "expense") {
          this._totalExpanse += amount;
        }
      });
      this._balance = this._totalIncome - this._totalExpanse;
      const cacheData = {
        totalIncome: this._totalIncome,
        totalExpanse: this._totalExpanse,
        balance: this._balance
      };
      localStorage.setItem("financialSummaryCard", JSON.stringify(cacheData));
      return this._balance;
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      return 0;
    }
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  getCardData(type) {
    const data = {
      balance: {
        title: "Saldo total",
        value: this._balance,
        color: "#000",
        icon: "💰",
      },
      income: {
        title: "Receitas",
        value: this._totalIncome,
        color: "#22c55e",
        icon: "📈",
      },
      expenses: {
        title: "Despesas",
        value: this._totalExpanse,
        color: "#ef4444",
        icon: "📉",
      },
      savings: {
        title: "Economias",
        value: 0,
        color: "#22c55e",
        icon: "💸",
      },
    }

    return data[type] || data.balance
  }

  render() {
    const type = this.getAttribute("type") || "balance"
    const data = this.getCardData(type)

    const card = document.createElement("div")
    card.className = "summary-card"

    if (this.loading) {
      // Skeleton loader
      card.innerHTML = `
        <link rel="stylesheet" href="../../../public/css/components/cards.css">
        <div class="card-content">
          <div class="card-title skeleton-title"></div>
          <div class="card-value skeleton-value"></div>
        </div>
        <div class="card-icon skeleton-icon"></div>
      `
    } else {
      card.innerHTML = `
        <link rel="stylesheet" href="../../../public/css/components/cards.css">
        <div class="card-content">
          <div class="card-title">${data.title}</div>
          <div class="card-value" style="color: ${data.color}">${this.formatCurrency(data.value)}</div>
        </div>
        <div class="card-icon" style="color: ${data.color}">${data.icon}</div>
      `
    }

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild)
    }

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "financial-summary-card.css")

    this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(card)
  }

  static get observedAttributes() {
    return ["type", "value", "title"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
  }

  set value(newValue) {
    if (newValue) {
      this._value = newValue
      this.render()
    }
  }

  get value() {
    return this._value
  }

  async connectedCallback() {
    // Carrega do cache primeiro, se disponível
    const cached = localStorage.getItem("financialSummaryCard");
    if (cached) {
      try {
        const data = JSON.parse(cached);
        this._totalIncome = data.totalIncome || 0;
        this._totalExpanse = data.totalExpanse || 0;
        this._balance = data.balance || 0;
        console.log("[FinancialSummaryCard] Loaded card data from cache:", data);
      } catch (e) {
        // Se falhar, ignora e segue normalmente
      }
    }
    this.loading = true;
    this.render();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.CalculateBalance(user.uid);
      } else {
        console.log("Usuário não autenticado");
      }
      this.loading = false;
      this.render();
    });
  }

}

customElements.define("financial-summary-card", FinancialSummaryCard)

