import Cache from "../cache/cache.js"

class ExpenseAnalytics extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    this._colorPalette = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
      "#FF9F40", "#8AC24A", "#F06292", "#7986CB", "#4DB6AC",
      "#FF8A65", "#A1887F"
    ];
    this.cache = new Cache();

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "expense-analytics.css")

    this.shadowRoot.appendChild(linkElem)

    this._categories = [
      { name: "", value: 0, color: "#a6ce39" },
    ]

    this._chart = null
    this.loading = false;

    this.loadChartJS()
  }

  CalculateAnalytics() {
    this.cache.loadFromLocalStorage();
    const profile = this.cache.data.transaction_categories;
    console.log(profile)
    this._categories = [
      ...profile,
    ] || [...this._categories];

  }

  loadChartJS() {
    if (window.Chart) {
      this.render()
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/chart.js"
    script.onload = () => this.render()
    script.onerror = () => this.renderError("Failed to load Chart.js")
    document.head.appendChild(script)
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  calculatePercentages() {
    const total = this._categories.reduce((sum, category) => sum + category.value, 0)
    return this._categories.map((category) => ({
      ...category,
      percentage: Math.round((category.value / total) * 100),
    }))
  }

  renderError(message) {
    const container = document.createElement("div")
    container.className = "analytics-card"
    container.innerHTML = `
      <h3>Visão Geral de Despesas</h3>
      <p>Distribuição de gastos por categoria</p>
      <div class="error-message">
        <p>${message}</p>
      </div>
    `

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild)
    }

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "expense-analytics.css")

    this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(container)
  }

  render() {
    if (!window.Chart) {
      this.renderError("Chart.js is required for this component")
      return
    }
    if (this.loading) {
      // Skeleton loader for analytics
      const container = document.createElement("div")
      container.className = "analytics-card"
      container.innerHTML = `
        <link rel="stylesheet" href="/css/components/expanseAnalytics.css">
        <div class="card-header">
          <h3 class="skeleton-analytics-title"></h3>
          <p class="skeleton-analytics-subtitle"></p>
        </div>
        <div class="card-content">
          <div class="chart-container">
            <div class="skeleton-analytics-chart"></div>
          </div>
          <div class="legend-container">
            <div class="skeleton-analytics-legend"></div>
            <div class="skeleton-analytics-legend"></div>
            <div class="skeleton-analytics-legend"></div>
          </div>
        </div>
      `
      while (this.shadowRoot.firstChild) {
        this.shadowRoot.removeChild(this.shadowRoot.firstChild)
      }
      const linkElem = document.createElement("link")
      linkElem.setAttribute("rel", "stylesheet")
      linkElem.setAttribute("href", "expense-analytics.css")
      this.shadowRoot.appendChild(linkElem)
      this.shadowRoot.appendChild(container)
      return
    }

    const container = document.createElement("div")
    container.className = "analytics-card"

    container.innerHTML = `
    <link rel="stylesheet" href="/css/components/expanseAnalytics.css">
      <div class="card-header">
        <h3>Visão Geral de Despesas</h3>
        <p>Distribuição de gastos por categoria</p>
      </div>
      <div class="card-content">
        <div class="chart-container">
          <canvas id="expenseChart"></canvas>
        </div>
        <div class="legend-container">
          ${this.calculatePercentages()
        .map(
          (category) => `
            <div class="legend-item">
              <div class="color-indicator" style="background-color: ${category.color}"></div>
              <div class="legend-text">
                <span class="category-name">${category.name}</span>
                <span class="category-value">${this.formatCurrency(category.value)}</span>
              </div>
              <div class="percentage">${category.percentage}%</div>
            </div>
          `,
        )
        .join("")}
        </div>
      </div>
    `

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild)
    }

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "expense-analytics.css")

    this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(container)

    setTimeout(() => this.initializeChart(), 0)
  }

  initializeChart() {
    const canvas = this.shadowRoot.querySelector("#expenseChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    if (this._chart) {
      this._chart.destroy()
    }

    this._chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: this._categories.map((c) => c.name),
        datasets: [
          {
            data: this._categories.map((c) => c.value),
            backgroundColor: this._categories.map((c) => c.color),
            borderWidth: 1,
            hoverOffset: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${this.formatCurrency(value)} (${percentage}%)`
              },
            },
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    })
  }

  set categories(data) {
    if (Array.isArray(data) && data.length > 0) {
      // Ensure each category has a color
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

  connectedCallback() {
    this.CalculateAnalytics()
    this.render();
  }

  disconnectedCallback() {
    if (this._chart) {
      this._chart.destroy()
      this._chart = null
    }
  }
}

customElements.define("expense-analytics", ExpenseAnalytics)

