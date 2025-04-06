class ProfileDashboard extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="profile-dashboard">
          <div class="profile-container">
              <div class="tabs-content" id="info-tab">
                <div class="card">
                  <div class="card-content">
                    <div class="profile-info">
                      <div class="profile-avatar">
                        <img src="https://via.placeholder.com/128" >
                      </div>
                      <div class="profile-details">
                        <h2 class="profile-name">Ana Silva</h2>
                        <p class="profile-role">Desenvolvedora Full Stack</p>
                        <div class="profile-meta">
                          <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span>ana.silva@email.com</span>
                          </div>
                          <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>São Paulo, Brasil</span>
                          </div>
                          <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                            <span>TechCorp Brasil</span>
                          </div>
                          <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>Universidade de São Paulo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="tabs-content" id="skills-tab" style="display: none;">
                <div class="card">
                  <div class="card-content">
                    <h3 class="skills-title">Desenvolvimento de Habilidades</h3>
                    <p class="skills-description">Acompanhe seu progresso em diferentes áreas</p>
  
                    <div class="skill-item">
                      <div class="skill-header">
                        <span class="skill-name">Desenvolvimento Frontend</span>
                        <span class="skill-value">85/100</span>
                      </div>
                      <div class="progress">
                        <div class="progress-bar" style="width: 85%"></div>
                      </div>
                    </div>
  
                    <div class="skill-item">
                      <div class="skill-header">
                        <span class="skill-name">Desenvolvimento Backend</span>
                        <span class="skill-value">75/100</span>
                      </div>
                      <div class="progress">
                        <div class="progress-bar" style="width: 75%"></div>
                      </div>
                    </div>
  
                    <div class="skill-item">
                      <div class="skill-header">
                        <span class="skill-name">DevOps</span>
                        <span class="skill-value">60/100</span>
                      </div>
                      <div class="progress">
                        <div class="progress-bar" style="width: 60%"></div>
                      </div>
                    </div>
  
                    <div class="skill-item">
                      <div class="skill-header">
                        <span class="skill-name">UX/UI Design</span>
                        <span class="skill-value">40/100</span>
                      </div>
                      <div class="progress">
                        <div class="progress-bar" style="width: 40%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="tabs-content" id="projects-tab" style="display: none;">
                <div class="card">
                  <div class="card-content">
                    <h3 class="projects-title">Projetos Recentes</h3>
                    <div class="project-item">
                      <div class="project-info">
                        <h4>Projeto 1</h4>
                        <p class="project-meta">Última atualização: 3 dias atrás</p>
                      </div>
                      <div class="project-progress">
                        <span class="project-percent">75%</span>
                        <div class="project-track">
                          <div class="project-bar" style="width: 75%"></div>
                        </div>
                      </div>
                    </div>
                    <div class="project-item">
                      <div class="project-info">
                        <h4>Projeto 2</h4>
                        <p class="project-meta">Última atualização: 1 semana atrás</p>
                      </div>
                      <div class="project-progress">
                        <span class="project-percent">50%</span>
                        <div class="project-track">
                          <div class="project-bar" style="width: 50%"></div>
                        </div>
                      </div>
                    </div>
                    <div class="project-item">
                      <div class="project-info">
                        <h4>Projeto 3</h4>
                        <p class="project-meta">Última atualização: 2 semanas atrás</p>
                      </div>
                      <div class="project-progress">
                        <span class="project-percent">30%</span>
                        <div class="project-track">
                          <div class="project-bar" style="width: 30%"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  
    }
  }
  
  customElements.define('profile-dashboard', ProfileDashboard);