class AddTransaction extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Default state
    this.transactionType = "expense";
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --background: #ffffff;
          --foreground: #09090b;
          --card: #ffffff;
          --card-foreground: #09090b;
          --border: #e2e8f0;
          --input: #e2e8f0;
          --primary: #09090b;
          --primary-foreground: #ffffff;
          --ring: #94a3b8;
          --radius: 10px;
          
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: var(--foreground);
        }

        .card {
          background-color: var(--card);
          border-radius: var(--radius);
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          width: 100%;
        }

        .card-header {
          padding: 1.5rem 1.5rem 0 1.5rem;
        }

        .card-content {
          padding: 1.5rem;
        }

        h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--card-foreground);
        }

        p {
          margin: 0.5rem 0 0 0;
          font-size: 0.875rem;
          color: var(--foreground);
        }
      

        .space-y-4 > * + * {
          margin-top: 1rem;
        }

        .space-y-2 > * + * {
          margin-top: 0.5rem;
        }

        .space-x-4 > * + * {
          margin-left: 1rem;
        }

        .space-x-2 > * + * {
          margin-left: 0.5rem;
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .w-full {
          width: 100%;
        }

        /* Form elements */
        label {
          font-size: 0.875rem;
          font-weight: 500;
          display: block;
          color: var(--foreground);
        }

        input[type="text"],
        input[type="number"],
        input[type="date"],
        select {
          width: 100%;
          padding: 0.5rem;
          border-radius: var(--radius);
          border: 1px solid var(--input);
          background-color: transparent;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="date"]:focus,
        select:focus {
          border-color: var(--ring);
          box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.2);
        }

        /* Radio buttons */
        .radio-group {
          display: flex;
        }

        input[type="radio"] {
          appearance: none;
          width: 1rem;
          height: 1rem;
          border: 1px solid var(--input);
          border-radius: 50%;
          margin: 0;
          display: grid;
          place-content: center;
        }

        input[type="radio"]::before {
          content: "";
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.1s;
          background-color: var(--primary);
        }

        input[type="radio"]:checked::before {
          transform: scale(1);
        }

        input[type="radio"]:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.2);
        }

        /* Button */
        button {
          width: 100%;
          background-color: var(--primary);
          color: var(--primary-foreground);
          border: none;
          border-radius: var(--radius);
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        button:hover {
          opacity: 0.9;
        }

        button:focus {
          outline: none;
          box-shadow: 0 0 0 2px var(--ring);
        }
      </style>
      <div class="card">
        <div class="card-header">
          <h2>Adicionar Transação</h2>
          <p>Adicione uma nova transação à sua conta</p>
        </div>
        <div class="card-content space-y-4">
          <div class="radio-group flex space-x-4">
            <div class="flex items-center space-x-2">
              <input type="radio" value="expense" id="expense" name="transaction-type" ${
                this.transactionType === "expense" ? "checked" : ""
              }>
              <label for="expense">Despesa</label>
            </div>
            <div class="flex items-center space-x-2">
              <input type="radio" value="income" id="income" name="transaction-type" ${
                this.transactionType === "income" ? "checked" : ""
              }>
              <label for="income">Receita</label>
            </div>
          </div>

          <div class="space-y-2">
            <label for="description">Descrição</label>
            <input type="text" id="description" placeholder="Descrição">
          </div>

          <div class="space-y-2">
            <label for="amount">Valor</label>
            <input type="number" id="amount" placeholder="Valor (R$)">
          </div>

          <div class="space-y-2">
            <label for="category">Categoria</label>
            <select id="category">
              <option value="default">Selecione uma categoria</option>
              <!-- Add your categories here -->
            </select>
          </div>

          <div class="space-y-2">
            <label for="date">Data</label>
            <input type="date" id="date">
          </div>

          <button>Adicionar</button>
        </div>
      </div>
    `;

    // Bind event listeners
    this._bindEvents();
  }

  _bindEvents() {
    // Handle radio button changes
    const radioButtons = this.shadowRoot.querySelectorAll(
      'input[type="radio"]'
    );
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.transactionType = e.target.value;
      });
    });
  }
}

// Define the custom element
customElements.define("add-transaction", AddTransaction);
