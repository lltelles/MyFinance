class RecentTransactions  extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "transaction-card.css")

    this.shadowRoot.appendChild(linkElem)

    this.render()
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  getTransactions() {
    return [
      {
        id: "1",
        description: "Salário",
        amount: 3500,
        type: "income",
        date:"01/05/2025"
      },
      {
        id: "2",
        description: "Freelance",
        amount: 1050,
        type: "income",
        date:"01/05/2025"
      },
      {
        id: "3",
        description: "Aluguel",
        amount: 1200,
        type: "expense",
        date:"01/05/2025"
      },
      {
        id: "4",
        description: "Supermercado",
        amount: 450,
        type: "expense",
        date:"01/05/2025"
      },
    ]
  }

  createTransactionItem(transaction) {
    const item = document.createElement("div")

    const iconClass = transaction.type === "income" ? "icon-income" : "icon-expense"
    const amountClass = transaction.type === "income" ? "amount-income" : "amount-expense"
    const iconSymbol = transaction.type === "income" ? "↗" : "↘"
    const amountPrefix = transaction.type === "income" ? "+" : "-"
    const leftBorderColor = transaction.type === "income" ? 'green-border' : 'red-border'

    item.className =  `transaction-item ${leftBorderColor}`


    item.innerHTML = `
      <link rel="stylesheet" href="/css/components/recentTransactions.css">
      <div class="transaction-info">
        <div class="${iconClass}">
          <span class="icon">${iconSymbol}</span>
        </div>
        <div class="description">
          <p>${transaction.description}</p>
          <p class="date">${transaction.date}</p>
        </div>
      </div>
      <div class="${amountClass}">
        ${amountPrefix} ${this.formatCurrency(transaction.amount)}
      </div>
    `

    return item
  }

  render() {
    const card = document.createElement("div")
    card.className = "card"

    const header = document.createElement("div")
    header.className = "card-header"

    const title = document.createElement("h2")
    title.className = "card-title"
    title.textContent = "Transações recentes"

    const subtitle = document.createElement("p")
    subtitle.className = "card-subtitle"
    subtitle.textContent = "Veja aqui suas transações mais recentes"

    header.appendChild(title)
    header.appendChild(subtitle)

    const content = document.createElement("div")
    content.className = "card-content"

    const transactions = this.getTransactions()

    transactions.forEach((transaction) => {
      content.appendChild(this.createTransactionItem(transaction))
    })

    card.appendChild(header)
    card.appendChild(content)

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild)
    }

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "transaction-card.css")

    this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(card)
  }

  set transactions(value) {
    this._transactions = value
    this.render()
  }

  get transactions() {
    return this._transactions || this.getTransactions()
  }

  connectedCallback() {
    this.render()
  }
}

customElements.define("recent-transactions", RecentTransactions )

