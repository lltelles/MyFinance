import { auth } from "../../app.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

class AppSidebar extends HTMLElement {
  constructor() {
    super();

    this.menuItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" ...></svg>',
        url: 'dashboard.html'
      },
      {
        id: 'analytics',
        label: 'Análise',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" ...></svg>',
        url: 'analytics.html'
      },
      {
        id: 'budget',
        label: 'Orçamento',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" ...></svg>',
        url: 'budget.html'
      },
      
    ];

    this._isOpen = true;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this._checkIfMobile();
    window.addEventListener('resize', () => this._checkIfMobile());
  }

  _checkIfMobile() {
    if (window.innerWidth <= 768) {
      this._isOpen = false;
      this.classList.remove('open');
    } else {
      this._isOpen = true;
      this.classList.add('open');
    }
  }

  toggle() {
    this._isOpen = !this._isOpen;
    this._isOpen ? this.classList.add('open') : this.classList.remove('open');
    return this._isOpen;
  }

  render() {
    // Detect current page to set active menu item
    const currentPage = window.location.pathname.split('/').pop();
    this.menuItems.forEach(item => {
      item.active = (item.url === currentPage);
    });

    this.classList.add('sidebar');
    if (this._isOpen) {
      this.classList.add('open');
    }

    this.innerHTML = `
      <div class="sidebar-header">MYFINANCE</div>
      <div class="sidebar-content">
        ${this.menuItems.map(item => `
          <a href="${item.url}" class="menu-item ${item.active ? 'active' : ''}" data-id="${item.id}">
            ${item.icon}
            <span>${item.label}</span>
          </a>
        `).join('')}
      </div>
      <div class="sidebar-footer">
        <button class="logout-button" ">Sair</button>
      </div>
    `;

    this.setupLogoutButton(); // garante o evento no botão já renderizado
  }
  clearCache() {
    this.data = {
      transactions: [],
      profileData: {
        name: "",
        last_name: "",
        full_name: "",
        email: "",
        location: "",
      },
      totals: {
        income: 0,
        expense: 0,
        balance: 0
      }
    };
    localStorage.removeItem("cache");
  }
  setupLogoutButton() {
    const logoutBtn = this.querySelector(".logout-button");
    if (!logoutBtn) return;

    // Remove qualquer listener anterior para evitar duplicação
    logoutBtn.replaceWith(logoutBtn.cloneNode(true));
    const freshLogoutBtn = this.querySelector(".logout-button");

    // Atualiza a visibilidade do botão e configura o listener
    const updateButton = () => {
      if (auth.currentUser) {
        freshLogoutBtn.style.display = 'block';
      } else {
        freshLogoutBtn.style.display = 'none';
      }
    };

    // Configura o listener para logout
    freshLogoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        this.clearCache?.(); // Usando operador opcional caso clearCache não exista
        window.location.href = 'index.html';
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Não foi possível fazer logout. Tente novamente.");
      }
    });

    // Atualiza inicialmente e observa mudanças no estado de autenticação
    updateButton();
    auth.onAuthStateChanged(updateButton);
  }

  setupEventListeners() {
    const menuItems = this.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (window.innerWidth <= 768) {
          this.toggle();
          document.body.classList.remove('sidebar-open');
        }
      });
    });
  }
}

customElements.define('app-sidebar', AppSidebar);