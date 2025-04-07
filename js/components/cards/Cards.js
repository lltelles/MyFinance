class FinancialSummaryCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "financial-summary-card.css")

    this.shadowRoot.appendChild(linkElem)

    this.render()
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
        value: 12580.0,
        color: "#000",
        icon: "💰",
      },
      income: {
        title: "Receitas",
        value: 4550.0,
        color: "#22c55e",
        icon: "✓",
      },
      expenses: {
        title: "Despesas",
        value: 2180.0,
        color: "#ef4444",
        icon: "📄",
      },
      savings: {
        title: "Economias",
        value: 2180.0,
        color: "#22c55e",
        icon: "🐖",
      },
    }

    return data[type] || data.balance
  }

  render() {
    const type = this.getAttribute("type") || "balance"
    const data = this.getCardData(type)

    const card = document.createElement("div")
    card.className = "summary-card"

    card.innerHTML = `
    <link rel="stylesheet" href="/css/components/cards.css">
      <div class="card-content">
        <div class="card-title">${data.title}</div>
        <div class="card-value" style="color: ${data.color}">${this.formatCurrency(data.value)}</div>
      </div>
      <div class="card-icon" style="color: ${data.color}">${data.icon}</div>
    `

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
    this.render()
  }
}

customElements.define("financial-summary-card", FinancialSummaryCard)

