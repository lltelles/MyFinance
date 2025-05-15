import { db, auth } from "../../app.js";
import { collection, query, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class MainCategories extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    this._colorPalette = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
      "#FF9F40", "#8AC24A", "#F06292", "#7986CB", "#4DB6AC",
      "#FF8A65", "#A1887F"
    ];

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "main-categories.css")

    this.shadowRoot.appendChild(linkElem)

    this._categories = []

    this.render()
  }

  async CalculateAnalytics(userId) {
    try {
      const transactionsRef = collection(db, "user", userId, "user_transactions");
      const q = query(transactionsRef);
      const querySnapshot = await getDocs(q);

      // Objeto para acumular gastos por categoria
      let spendingByCategory = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.transaction_type === 'expense') {
          // Acumula gastos por categoria
          spendingByCategory[data.category] =
            (spendingByCategory[data.category] || 0) + data.value;
        }

      });

      this._categories = Object.keys(spendingByCategory).map((category, index) => ({
        name: category,
        value: spendingByCategory[category],
        color: this._colorPalette[index % this._colorPalette.length]
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

  renderCategory(category, maxValue) {
    const percentage = (category.value / maxValue) * 100

    const categoryElement = document.createElement("div")
    categoryElement.className = "category-row"

    categoryElement.innerHTML = `
      <div class="label">
        <span class="category-name">${category.name}</span>
        <span class="category-value">${this.formatCurrency(category.value)}</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="fill" style="width:${percentage}%; background-color: ${category.color};"></div>
        </div>
        <span class="percentage">${Math.round(percentage)}%</span>
      </div>
    `

    return categoryElement
  }

  render() {
    const container = document.createElement("div")
    container.className = "categories-card"

    const header = document.createElement("div")
    header.className = "card-header"
    header.innerHTML = `
     <link rel="stylesheet" href="/css/components/mainCategories.css">
      <h3>Principais Categorias</h3>
      <p>Suas maiores despesas</p>
    `

    const content = document.createElement("div")
    content.className = "card-content"

    const sortedCategories = [...this._categories].sort((a, b) => b.value - a.value)

    const maxValue = Math.max(...sortedCategories.map((c) => c.value))

    sortedCategories.forEach((category) => {
      content.appendChild(this.renderCategory(category, maxValue))
    })

    container.appendChild(header)
    container.appendChild(content)

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild)
    }

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "main-categories.css")

    this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(container)
  }

  set categories(data) {
    if (Array.isArray(data) && data.length > 0) {
      this._categories = data.map((category, index) => {
        const defaultColors = [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
            "#FF9F40", "#8AC24A", "#F06292", "#7986CB", "#4DB6AC",
            "#FF8A65", "#A1887F"
          ]

        return {
          name: category.name || `Category ${index + 1}`,
          value: category.value || 0,
          color: category.color || defaultColors[index % defaultColors.length],
        }
      })

      this.render()
    }
  }

  get categories() {
    return this._categories
  }

  async connectedCallback() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.CalculateAnalytics(user.uid);
      } else {
        console.log("Usuário não autenticado");
      }
      this.render();
    });
  }

}

customElements.define("main-categories", MainCategories)

