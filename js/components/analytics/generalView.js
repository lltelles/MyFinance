class ExpenseAnalytics extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="analytics-card">
          <h3>Visão Geral de Despesas</h3>
          <p>Distribuição de gastos por categoria</p>
          <div class="content">
          <canvas id="expenseChart" width="300" height="300"></canvas>
          </div>
        </div>
      `;
  
      const ctx = this.querySelector("#expenseChart").getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Moradia", "Alimentação", "Transporte", "Lazer", "Saúde", "Outros"],
          datasets: [{
            data: [1200, 1000, 800, 600, 400, 220],
            backgroundColor: [
              "#a6ce39", "#ff8c42", "#1e90ff", "#ffcc00", "#00b894", "#ff7043"
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }
  
  customElements.define("expense-analytics", ExpenseAnalytics);
  
//   <div class="legend">
//   <span style="color:#a6ce39">Moradia</span>
//   <span style="color:#ff8c42">Alimentação</span>
//   <span style="color:#1e90ff">Transporte</span>
//   <span style="color:#ffcc00">Lazer</span>
//   <span style="color:#00b894">Saúde</span>
//   <span style="color:#ff7043">Outros</span>
// </div>