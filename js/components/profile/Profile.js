import { db, auth } from "../../app.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class ProfileDashboard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "profile-dashboard.css")

    this.shadowRoot.appendChild(linkElem)

    this._profileData = {
      name: "",
      role: "",
      avatar: ``,
      email: "",
      location: "",
      company: "",
      education: "",
      skills: [
        { name: "Desenvolvimento Frontend", value: 85, max: 100 },
        { name: "Desenvolvimento Backend", value: 75, max: 100 },
        { name: "DevOps", value: 60, max: 100 },
        { name: "UX/UI Design", value: 40, max: 100 },
      ],
      projects: [
        { name: "Projeto 1", progress: 75, lastUpdate: "3 dias atrás" },
        { name: "Projeto 2", progress: 50, lastUpdate: "1 semana atrás" },
        { name: "Projeto 3", progress: 30, lastUpdate: "2 semanas atrás" },
      ],
    }

    this._activeTab = "info"

    this.render()
  }

  async connectedCallback() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.loadProfileData(user.uid);
        this.renderLogoutButton(); 
      } else {
        console.log("Usuário não autenticado");
        this._profileData.email = "Faça login para ver seu perfil";
      }
      this.render();
    });
  }

  async loadProfileData(userId) {
    try {
      const userDocRef = doc(db, "user", userId); 
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        this._profileData = {
          ...this._profileData, 
          ...userData,         
          email: userData.email || auth.currentUser?.email || "" 
        };
      } else {
        console.log("Documento não encontrado! Usando dados padrão.");
        this._profileData.email = auth.currentUser?.email || "";
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      this._profileData.email = "Erro ao carregar perfil";
      console.log(userId)
    }
    this.render
  }

  

  render() {

    const container = document.createElement("div")
    container.className = "profile-dashboard"

    const headerContainer = document.createElement("div");
    headerContainer.className = "profile-header";


    const tabsNav = document.createElement("div")
    tabsNav.className = "tabs-nav"

    container.appendChild(headerContainer);

    const tabs = [
      { id: "info", label: "Informações", icon: "user" },
      { id: "skills", label: "Habilidades", icon: "award" },
      { id: "projects", label: "Projetos", icon: "briefcase" },
    ]

    tabs.forEach((tab) => {
      const tabButton = document.createElement("button")
      tabButton.className = `tab-button ${tab.id === this._activeTab ? "active" : ""}`
      tabButton.dataset.tab = tab.id

      tabButton.innerHTML = `
        <span class="tab-icon ${tab.icon}"></span>
        <span class="tab-label">${tab.label}</span>
      `

      tabButton.addEventListener("click", () => this.switchTab(tab.id))
      tabsNav.appendChild(tabButton)
    })

    const profileContainer = document.createElement("div")
    profileContainer.className = "profile-container"

    const infoTab = document.createElement("div")
    infoTab.className = "tabs-content"
    infoTab.id = "info-tab"
    infoTab.style.display = this._activeTab === "info" ? "block" : "none"

    infoTab.innerHTML = `
    <link rel="stylesheet" href="/css/views/profile.css">
      <div class="card">
        <div class="card-content">
          <div class="profile-info">
            <div class="profile-avatar">
              <img src="${this._profileData.avatar}" alt="${this._profileData.name}">
            </div>
            <div class="profile-details">
              <h2 class="profile-name">${this._profileData.name}</h2>
              <p class="profile-role">${this._profileData.role}</p>
              <div class="profile-meta">
                <div class="meta-item">
                  <span class="meta-icon mail"></span>
                  <span>${this._profileData.email}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon map-pin"></span>
                  <span>${this._profileData.location}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon briefcase"></span>
                  <span>${this._profileData.company}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon book"></span>
                  <span>${this._profileData.education}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    const skillsTab = document.createElement("div")
    skillsTab.className = "tabs-content"
    skillsTab.id = "skills-tab"
    skillsTab.style.display = this._activeTab === "skills" ? "block" : "none"

    let skillsHTML = `
      <div class="card">
        <div class="card-content">
          <h3 class="skills-title">Desenvolvimento de Habilidades</h3>
          <p class="skills-description">Acompanhe seu progresso em diferentes áreas</p>
    `

    this._profileData.skills.forEach((skill) => {
      const percentage = (skill.value / skill.max) * 100
      skillsHTML += `
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-value">${skill.value}/${skill.max}</span>
          </div>
          <div class="progress">
            <div class="progress-bar" style="width: ${percentage}%"></div>
          </div>
        </div>
      `
    })

    skillsHTML += `
        </div>
      </div>
    `

    skillsTab.innerHTML = skillsHTML

    const projectsTab = document.createElement("div")
    projectsTab.className = "tabs-content"
    projectsTab.id = "projects-tab"
    projectsTab.style.display = this._activeTab === "projects" ? "block" : "none"

    let projectsHTML = `
      <div class="card">
        <div class="card-content">
          <h3 class="projects-title">Projetos Recentes</h3>
    `

    this._profileData.projects.forEach((project) => {
      projectsHTML += `
        <div class="project-item">
          <div class="project-info">
            <h4>${project.name}</h4>
            <p class="project-meta">Última atualização: ${project.lastUpdate}</p>
          </div>
          <div class="project-progress">
            <span class="project-percent">${project.progress}%</span>
            <div class="project-track">
              <div class="project-bar" style="width: ${project.progress}%"></div>
            </div>
          </div>
        </div>
      `
    })

    projectsHTML += `
        </div>
      </div>
    `

    projectsTab.innerHTML = projectsHTML

    profileContainer.appendChild(infoTab)
    profileContainer.appendChild(skillsTab)
    profileContainer.appendChild(projectsTab)

    container.appendChild(tabsNav)
    container.appendChild(profileContainer)

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild)
    }

    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "profile-dashboard.css")

    this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(container)
  }

  switchTab(tabId) {
    this._activeTab = tabId
    this.render()
  }

  set profileData(data) {
    this._profileData = {
      ...this._profileData,
      ...data,
    }
    this.render()
  }

  get profileData() {
    return this._profileData
  }

  set activeTab(tabId) {
    this._activeTab = tabId
    this.render()
  }

  get activeTab() {
    return this._activeTab
  }

  
}

customElements.define("profile-dashboard", ProfileDashboard)

