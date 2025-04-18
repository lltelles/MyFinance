class TransactionForm extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "transaction-form.css")

    this.shadowRoot.appendChild(linkElem)

    this.render()
  }

  render() {
    const form = document.createElement("div")
    form.className = "form-card"

    form.innerHTML = `
     <link rel="stylesheet" href="/css/components/transactionForm.css">
      <div class="form-header">
        <h2 class="form-title">Adicionar transação</h2>
        <p class="form-subtitle">Adicione uma nova transação à sua conta</p>
      </div>
      
      <div class="form-content">
        <div class="form-type">
          <p class="type-label">Tipo de transação</p>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="transaction-type" value="expense" checked>
              <span class="radio-text">Despesa</span>
            </label>
            <label class="radio-label">
              <input type="radio" name="transaction-type" value="income">
              <span class="radio-text">Receita</span>
            </label>
          </div>
        </div>
        
        <form id="transaction-form">
          <div class="form-group">
            <label for="description">Descrição</label>
            <input type="text" id="description" name="description" required>
          </div>
          
          <div class="form-group">
            <label for="amount">Valor</label>
            <input type="number" id="amount" name="amount" step="0.01" min="0.01" required>
          </div>
          
          <div class="form-group">
            <label for="category">Categoria</label>
            <select id="category" name="category" required>
              <option value="" disabled selected>Selecione uma categoria</option>
              <option value="alimentacao">Alimentação</option>
              <option value="transporte">Transporte</option>
              <option value="moradia">Moradia</option>
              <option value="lazer">Lazer</option>
              <option value="saude">Saúde</option>
              <option value="educacao">Educação</option>
              <option value="salario">Salário</option>
              <option value="investimentos">Investimentos</option>
              <option value="freelance">Freelance</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="date">Data</label>
            <input type="date" id="date" name="date" required>
          </div>
          
          <button type="submit" class="submit-button">Adicionar</button>
        </form>
      </div>
    `

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild)
    }

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "transaction-form.css")

    this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(form)

    this.addEventListeners()
  }

  addEventListeners() {
    const form = this.shadowRoot.querySelector("#transaction-form")

    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const type = this.shadowRoot.querySelector('input[name="transaction-type"]:checked').value
      const description = this.shadowRoot.querySelector("#description").value
      const amount = Number.parseFloat(this.shadowRoot.querySelector("#amount").value)
      const category = this.shadowRoot.querySelector("#category").value
      const date = this.shadowRoot.querySelector("#date").value

      const transaction = {
        id: Date.now().toString(),
        description,
        amount,
        type: type === "income" ? "income" : "expense",
        category,
        date,
      }

      const event = new CustomEvent("transaction-added", {
        detail: transaction,
        bubbles: true,
        composed: true, 
      })

      this.dispatchEvent(event)

      form.reset()
    })
  }

  connectedCallback() {
    this.render()
  }
}

customElements.define("transaction-form", TransactionForm)

