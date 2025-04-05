    class CustomCard extends HTMLElement {
      connectedCallback() {
        const title = this.getAttribute("title");
        const content = this.getAttribute("content");

        this.innerHTML = `
          <div style="border: 1px solid #ccc; padding: 10px; border-radius: 8px;">
            <h2>${title}</h2>
            <p>${content}</p>
          </div>
        `;
      }
    }

    customElements.define("custom-card", CustomCard);