import Cache from "../cache/cache.js"

class FinancialSummaryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._totalIncome = 0;
    this._totalExpanse = 0;
    this._balance = 0;
    this.cache = new Cache();

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "financial-summary-card.css")

    this.shadowRoot.appendChild(linkElem)
    this.render();
  }

  CalculateBalance() {
      this.cache.loadFromLocalStorage();
      const profile = this.cache.data.totals;
      this._balance = profile.balance
      this._totalExpanse = profile.expense
      this._totalIncome = profile.income
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
        value:  0,
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
        <link rel="stylesheet" href="/css/components/cards.css">
        <div class="card-content">
          <div class="card-title skeleton-title"></div>
          <div class="card-value skeleton-value"></div>
        </div>
        <div class="card-icon skeleton-icon"></div>
      `
    } else {
      card.innerHTML = `
        <link rel="stylesheet" href="/css/components/cards.css">
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

  connectedCallback() {
    this.CalculateBalance();
    this.render();
  }

}

customElements.define("financial-summary-card", FinancialSummaryCard)

