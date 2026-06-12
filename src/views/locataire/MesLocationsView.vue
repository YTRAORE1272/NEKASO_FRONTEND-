<template>
  <div class="mes-locations">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Mes locations</h1>
        <p class="page-subtitle">Vos biens en location active</p>
      </div>

      <!-- MES LOCATIONS ACTIVES -->
      <div class="section-container">
        <h2 class="section-title">Mes locations actives</h2>

        <div class="list-card active-location-card">
          <div class="card-left">
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop"
              alt="Appartement familial"
              class="item-img"
            />
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

        <div v-if="false" class="etat-vide">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <p>Aucune location active pour le moment</p>
          <router-link to="/catalogue" class="btn-catalogue">Parcourir les biens disponibles</router-link>
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
  min-height: calc(100vh - 82px);
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header { margin-bottom: 32px; }

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

.section-container { margin-bottom: 40px; }

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 20px;
}

.list-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.active-location-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-left { display: flex; gap: 20px; }

.item-img {
  width: 100px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
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
  margin: 0 0 6px;
}

.item-loc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 8px;
}

.item-status-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge-pill {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.bg-green { background-color: #dcfce7; color: #16a34a; }

.status-date { font-size: 13px; color: #64748b; }

.card-right { text-align: right; }

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
.link-action:hover { color: #0f172a; }

.arrow { margin-left: 4px; }

.etat-vide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 15px;
}

.btn-catalogue {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

@media (max-width: 768px) {
  .active-location-card { flex-direction: column; align-items: flex-start; gap: 20px; }
  .card-right { text-align: left; width: 100%; border-top: 1px solid #f1f5f9; padding-top: 16px; }
  .card-left { flex-direction: column; gap: 12px; }
  .item-img { width: 100%; height: 160px; }
}
</style>
