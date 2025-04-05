class RecentTransactions extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <style>
  .recent-transactions {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    max-width: 400px;
    margin: 0 auto;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    background-color: white;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .recent-transactions h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #1e293b;
  }

  .transaction-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .transaction-list div {
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 0.875rem;
    display: flex;
    justify-content: space-between;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .transaction-list div:hover {
    background-color: #f1f5f9;
  }

  .income {
    color: #15803d;
  }

  .income::before {
    content: "+";
    margin-right: 4px;
  }

  .expense {
    color: #b91c1c;
  }

  .expense::before {
    content: "-";
    margin-right: 4px;
  }
</style>

<div class="recent-transactions">
  <h3>Transações Recentes</h3>
   <div class="transaction-list">
    <div class="income">Salário - R$ 3500,00</div>
    <div class="expense">Aluguel - R$ 1200,00</div>
    <div class="expense">Supermercado - R$ 450,00</div>
    <div class="income">Freelance - R$ 1050,00</div>
    <div class="income">Conta de luz - R$ 180,00</div>
  </div>
</div>`;
  }
}

customElements.define("recent-transactions", RecentTransactions);
