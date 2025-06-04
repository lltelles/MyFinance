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
    this.classList.add('sidebar');
    if (this._isOpen) {
      this.classList.add('open');
    }

    this.innerHTML = `
      <div class="sidebar-header">MyFinance</div>
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

  setupLogoutButton() {
    const logoutBtn = this.querySelector(".logout-button");
    if (auth.currentUser && logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = 'index.html';
      });
    } else if (!auth.currentUser && logoutBtn) {
      logoutBtn.style.display = 'none';
    }
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
