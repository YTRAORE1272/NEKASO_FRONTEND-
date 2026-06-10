<template>
    <div class="mes-locations">
      <div class="container">
        <!-- HEADER -->
        <div class="page-header">
          <h1 class="page-title">Mes locations</h1>
          <p class="page-subtitle">Vue d'ensemble de vos biens et demandes de visite</p>
        </div>

        <!-- STATS CARDS -->
        <div class="stats-grid">
          <!-- Visites en attente -->
          <div class="stat-card">
            <div class="stat-icon-wrapper orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Visites en attente</div>
              <div class="stat-value">2</div>
            </div>
          </div>

          <!-- Demandes de location -->
          <div class="stat-card">
            <div class="stat-icon-wrapper blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Demandes de location</div>
              <div class="stat-value">1</div>
            </div>
          </div>

          <!-- Location active -->
          <div class="stat-card">
            <div class="stat-icon-wrapper green">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Location active</div>
              <div class="stat-value">1</div>
            </div>
          </div>
        </div>

        <!-- MES LOCATIONS ACTIVES -->
        <div class="section-container">
          <h2 class="section-title">Mes locations actives</h2>
          
          <div class="list-card active-location-card">
            <div class="card-left">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop" alt="Appartement familial" class="item-img" />
              <div class="item-details">
                <h3 class="item-titre">Appartement familial</h3>
                <p class="item-loc">Sacré-Cœur, Dakar</p>
                <div class="item-status-row">
                  <span class="badge-pill bg-green">Actif</span>
                  <span class="status-date">Jusqu'au 31/08/2026</span>
                </div>
              </div>
            </div>
            <div class="card-right">
              <div class="item-price">350 000 FCFA<span>/mois</span></div>
              <router-link to="/locataire/contrat-paiements" class="link-action">
                Voir contrat <span class="arrow">→</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- MES DEMANDES DE LOCATION -->
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Mes demandes de location</h2>
            <router-link to="/catalogue" class="btn-text-action">+ Nouvelle demande</router-link>
          </div>
          
          <div class="list-card request-card">
            <div class="card-top">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=300&fit=crop" alt="Appartement moderne - Vue sur mer" class="item-img" />
              <div class="item-details">
                <h3 class="item-titre">Appartement moderne - Vue sur mer</h3>
                <p class="item-loc">Almadies · Entrée 2026-07-01 · 6 mois</p>
                <p class="item-sub-loc">Envoyée le 01/06/2026</p>
              </div>
            </div>
            
            <div class="progress-bar-container">
              <div class="progress-track">
                <div class="progress-fill" style="width: 0%"></div>
                <div class="dot active" style="left: 0%"></div>
                <div class="dot" style="left: 50%"></div>
                <div class="dot" style="left: 100%"></div>
              </div>
              <div class="progress-status-text">En attente</div>
            </div>
          </div>
        </div>

        <!-- MES DEMANDES DE VISITE -->
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Mes demandes de visite</h2>
            <router-link to="/catalogue" class="btn-text-action">+ Nouvelle visite</router-link>
          </div>
          
          <div class="visites-grid">
            <!-- Visite 1 -->
            <div class="list-card request-card">
              <div class="card-top">
                <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=300&fit=crop" alt="Studio meublé centre-ville" class="item-img" />
                <div class="item-details">
                  <h3 class="item-titre">Studio meublé centre-ville</h3>
                  <p class="item-loc">Plateau · 2026-04-25 · Matin</p>
                </div>
              </div>
              
              <div class="progress-bar-container">
                <div class="progress-track">
                  <div class="progress-fill" style="width: 33%"></div>
                  <div class="dot active" style="left: 0%"></div>
                  <div class="dot active" style="left: 33%"></div>
                  <div class="dot" style="left: 66%"></div>
                  <div class="dot" style="left: 100%"></div>
                </div>
                <div class="progress-status-text">Vue</div>
              </div>
            </div>

            <!-- Visite 2 -->
            <div class="list-card request-card">
              <div class="card-top">
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=300&fit=crop" alt="Appartement 2 pièces" class="item-img" />
                <div class="item-details">
                  <h3 class="item-titre">Appartement 2 pièces</h3>
                  <p class="item-loc">Yoff · 2026-04-28 · Soir</p>
                </div>
              </div>
              
              <div class="progress-bar-container">
                <div class="progress-track">
                  <div class="progress-fill" style="width: 66%"></div>
                  <div class="dot active" style="left: 0%"></div>
                  <div class="dot active" style="left: 33%"></div>
                  <div class="dot active" style="left: 66%"></div>
                  <div class="dot" style="left: 100%"></div>
                </div>
                <div class="progress-status-text">Confirmée</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.mes-locations {
  padding: 40px 0 80px;
  background-color: #f8fafc;
  min-height: calc(100vh - 64px);
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}

/* HEADER */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  margin-top: 0;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.orange { background-color: #fef3c7; }
.stat-icon-wrapper.blue { background-color: #e0f2fe; }
.stat-icon-wrapper.green { background-color: #dcfce7; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

/* SECTIONS */
.section-container {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-text-action {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}

.btn-text-action:hover {
  color: #0f172a;
}

/* CARDS */
.list-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-top, .card-left {
  display: flex;
  gap: 20px;
}

.item-img {
  width: 100px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #f1f5f9;
  flex-shrink: 0;
}

.item-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-titre {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.item-loc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 4px 0;
}

.item-sub-loc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

/* ACTIVE LOCATION CARD SPECIFICS */
.active-location-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-status-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.badge-pill {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.bg-green {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-date {
  font-size: 13px;
  color: #64748b;
}

.card-right {
  text-align: right;
}

.item-price {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.item-price span {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.link-action {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.link-action:hover {
  color: #0f172a;
}

.arrow {
  margin-left: 4px;
}

/* REQUEST & VISITES CARDS SPECIFICS */
.request-card {
  display: flex;
  flex-direction: column;
}

.visites-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* SIMPLE PROGRESS BAR */
.progress-bar-container {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.progress-track {
  flex: 1;
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 2px;
  position: relative;
  display: flex;
  align-items: center;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #22c55e;
  border-radius: 2px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e2e8f0;
  position: absolute;
  transform: translateX(-50%);
  border: 2px solid white;
}

.dot.active {
  background-color: #22c55e;
}

.progress-status-text {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

/* MEDIA QUERIES */
@media (max-width: 1024px) {
  .visites-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .active-location-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .card-right {
    text-align: left;
    width: 100%;
    border-top: 1px solid #f1f5f9;
    padding-top: 16px;
  }

  .card-top, .card-left {
    flex-direction: column;
    gap: 12px;
  }

  .item-img {
    width: 100%;
    height: 160px;
  }
}
</style>
