class AppSidebar extends HTMLElement {
    constructor() {
      super();
      
      this.menuItems = [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
          active: true,
          url: 'dashboard.html'
        },
        { 
          id: 'analytics', 
          label: 'Análise', 
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
          url: 'analytics.html'
        },
        { 
          id: 'budget', 
          label: 'Orçamento', 
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
          url: 'budget.html'
        },
        { 
          id: 'profile', 
          label: 'Perfil', 
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
          url: 'profile.html'
        }
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
      `;
    }
  
    setupEventListeners() {
      const menuItems = this.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
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