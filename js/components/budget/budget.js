import { db, auth } from "../../app.js";
import { collection, query, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class Budget extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "budget-view.css")

    this.shadowRoot.appendChild(linkElem)

    this._budgetItems = [
      { category: "", budget: 1, spent: 0 },
    ]

    this.render()
  }

  async CalculateBudget(userId) {
    try {
      const transactionsRef = collection(db, "user", userId, "user_transactions");
      const q = query(transactionsRef);
      const querySnapshot = await getDocs(q);

      // Objeto para acumular gastos por categoria
      let spendingByCategory = {};

      // Objeto para armazenar orçamentos definidos
      let budgetsByCategory = {};

      const defaultBudgets = {
        'alimentacao': 800,
        'transporte': 500,
        'moradia': 3000,
        'lazer': 300,
        'saude': 400,
        'educacao': 600,
        'outros': 200
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.transaction_type === 'expense') {
          // Acumula gastos por categoria
          spendingByCategory[data.category] =
            (spendingByCategory[data.category] || 0) + data.value;
        }

        if (data.budget) {
          budgetsByCategory[data.category] = data.budget;
        }
      });

      // Transforma em array no formato esperado pelo componente
      this._budgetItems = Object.keys(spendingByCategory).map(category => ({
        category: category,
        spent: spendingByCategory[category],
        budget: budgetsByCategory[category] || defaultBudgets[category] || 1200 // Assume 1200 se não tiver orçamento definido
      }));

    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  getProgressColor(spent, budget) {
    const percentage = (spent / budget) * 100

    if (percentage < 70) {
      return "#22c55e"
    } else if (percentage < 100) {
      return "#f59e0b"
    } else {
      return "#ef4444"
    }
  }

  renderBudgetItem(item) {
    const percentage = Math.min(100, (item.spent / item.budget) * 100)
    const color = this.getProgressColor(item.spent, item.budget)

    const budgetElement = document.createElement("div")
    budgetElement.className = "budget-row"

    budgetElement.innerHTML = `
     <link rel="stylesheet" href="/css/components/budget.css">
      <div class="budget-header">
        <span class="category-name">${item.category}</span>
        <div class="budget-values">
          <span class="spent-value">${this.formatCurrency(item.spent)}</span>
          <span class="separator">/</span>
          <span class="budget-value">${this.formatCurrency(item.budget)}</span>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="fill" style="width:${percentage}%; background-color: ${color};"></div>
        </div>
        <span class="percentage" style="color: ${color};">${Math.round(percentage)}%</span>
      </div>
    `

    return budgetElement
  }

  render() {
    const container = document.createElement("div")
    container.className = "budget-card"

    const header = document.createElement("div")
    header.className = "card-header"
    header.innerHTML = `
      <h3>Orçamento mensal</h3>
      <p>Acompanhe seus limites de gastos</p>
    `

    const content = document.createElement("div")
    content.className = "card-content"

    const sortedItems = [...this._budgetItems].sort((a, b) => b.spent / b.budget - a.spent / a.budget)

    sortedItems.forEach((item) => {
      content.appendChild(this.renderBudgetItem(item))
    })

    const totalBudget = this._budgetItems.reduce((sum, item) => sum + item.budget, 0)
    const totalSpent = this._budgetItems.reduce((sum, item) => sum + item.spent, 0)
    const totalPercentage = Math.min(100, (totalSpent / totalBudget) * 100)
    const totalColor = this.getProgressColor(totalSpent, totalBudget)

    const totalElement = document.createElement("div")
    totalElement.className = "budget-total"
    totalElement.innerHTML = `
      <div class="total-header">
        <span class="total-label">Total</span>
        <div class="budget-values">
          <span class="spent-value">${this.formatCurrency(totalSpent)}</span>
          <span class="separator">/</span>
          <span class="budget-value">${this.formatCurrency(totalBudget)}</span>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="fill" style="width:${totalPercentage}%; background-color: ${totalColor};"></div>
        </div>
        <span class="percentage" style="color: ${totalColor};">${Math.round(totalPercentage)}%</span>
      </div>
    `

    content.appendChild(totalElement)

    container.appendChild(header)
    container.appendChild(content)

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild)
    }

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "budget-view.css")

    this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(container)
  }

  set budgetItems(data) {
    if (Array.isArray(data) && data.length > 0) {
      this._budgetItems = data.map((item) => ({
        category: item.category || "Categoria",
        budget: item.budget || 0,
        spent: item.spent || 0,
      }))

      this.render()
    }
  }

  get budgetItems() {
    return this._budgetItems
  }

  updateSpending(category, amount) {
    const item = this._budgetItems.find((item) => item.category === category)
    if (item) {
      item.spent = amount
      this.render()
      return true
    }
    return false
  }

  async connectedCallback() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.CalculateBudget(user.uid);
      } else {
        console.log("Usuário não autenticado");
      }
      this.render();
    });
  }
}

customElements.define("budget-view", Budget)

