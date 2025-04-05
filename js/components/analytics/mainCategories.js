class MainCategories extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="categories-card">
          <h3>Principais Categorias</h3>
          <p>Suas maiores despesas</p>
          ${this.renderCategory("Moradia", 1200)}
          ${this.renderCategory("Alimentação", 1000)}
          ${this.renderCategory("Transporte", 800)}
          ${this.renderCategory("Lazer", 600)}
          ${this.renderCategory("Saúde", 400)}
        </div>
      `;
    }
  
    renderCategory(name, value) {
      const max = 1200;
      const percentage = (value / max) * 100;
      return `
        <div class="category-row">
          <div class="label">
            <span>${name}</span>
            <span>R$ ${value.toFixed(2)}</span>
          </div>
          <div class="progress-bar">
            <div class="fill" style="width:${percentage}%; background-color: #a6ce39;"></div>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define("main-categories", MainCategories);
  