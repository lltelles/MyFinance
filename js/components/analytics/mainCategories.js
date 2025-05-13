import { db, auth } from "../../app.js";
import { collection, query, getDocs, or, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class MainCategories extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "main-categories.css")

    this.shadowRoot.appendChild(linkElem)

    this._categories = [
      { name: "Moradia", value: 1200, color: "#a6ce39" },
      { name: "Alimentação", value: 1000, color: "#ff8c42" },
      { name: "Transporte", value: 800, color: "#1e90ff" },
      { name: "Lazer", value: 600, color: "#ffcc00" },
      { name: "Saúde", value: 400, color: "#00b894" },
    ]

    this.render()
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
          "#a6ce39",
          "#ff8c42",
          "#1e90ff",
          "#ffcc00",
          "#00b894",
          "#ff7043",
          "#9b59b6",
          "#3498db",
          "#e74c3c",
          "#2ecc71",
          "#f1c40f",
          "#1abc9c",
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
    this.render();
  }

}

customElements.define("main-categories", MainCategories)

