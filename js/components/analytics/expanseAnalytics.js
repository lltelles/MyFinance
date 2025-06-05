import { db, auth } from "../../app.js";
import { collection, query, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class ExpenseAnalytics extends HTMLElement {
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
    linkElem.setAttribute("href", "expense-analytics.css")

    this.shadowRoot.appendChild(linkElem)

    this._categories = [
      { name: "", value: 0, color: "#a6ce39" },
    ]

    this._chart = null
    this.loading = false;

    this.loadChartJS()
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

      // Transforma em array no formato esperado pelo componente
      this._categories = Object.keys(spendingByCategory).map((category, index) => ({
        name: category,
        value: spendingByCategory[category],
        color: this._colorPalette[index % this._colorPalette.length]
      }));

      // Salva no cache
      localStorage.setItem("expenseAnalyticsCategories", JSON.stringify(this._categories));
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
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

  async connectedCallback() {
    // Carrega do cache primeiro, se disponível
    const cached = localStorage.getItem("expenseAnalyticsCategories");
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (Array.isArray(data)) {
          this._categories = data;
          console.log("[ExpenseAnalytics] Loaded categories from cache:", data);
        }
      } catch (e) {
        // Se falhar, ignora e segue normalmente
      }
    }
    this.loading = true;
    this.render();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.CalculateAnalytics(user.uid);
      } else {
        console.log("Usuário não autenticado");
      }
      this.loading = false;
      this.render();
    });
  }

  disconnectedCallback() {
    if (this._chart) {
      this._chart.destroy()
      this._chart = null
    }
  }
}

customElements.define("expense-analytics", ExpenseAnalytics)

