class Cards extends HTMLElement {
  connectedCallback() {
    console.log("Cards component loaded ✅");
    const title = this.getAttribute("title");
    const content = this.getAttribute("content") || "";
    const color = this.getAttribute("color") || "inherit";
    const icon = this.getAttribute("icon");

    this.innerHTML = `
        <div class="card">
        <div class='title-container'>
          <div class="title">${title}</div>
          <div class="icon">${icon}</div>
        </div>
          <div class="value" style="color: ${color}">${content}</div>
        </div>
      `;
  }
}

customElements.define("finance-cards", Cards);
