<template>
  <div class="mes-demandes">
    <div class="container">
      <div class="page-header">
        <div class="header-row">
          <div>
            <h1 class="page-title">Mes demandes de visite</h1>
            <p class="page-subtitle">Suivez l'avancement de vos demandes de visite</p>
          </div>
          <router-link to="/catalogue" class="btn-nouvelle">+ Nouvelle visite</router-link>
        </div>
      </div>

      <div v-if="demandes.length === 0" class="etat-vide">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p>Aucune demande de visite pour le moment</p>
        <router-link to="/catalogue" class="btn-catalogue">Parcourir les biens</router-link>
      </div>

      <div v-else class="visites-grid">
        <div v-for="visite in demandes" :key="visite.id" class="list-card request-card">
          <div class="card-top">
            <img :src="visite.photo" :alt="visite.titre" class="item-img" />
            <div class="item-details">
              <h3 class="item-titre">{{ visite.titre }}</h3>
              <p class="item-loc">{{ visite.lieu }} · {{ visite.date }} · {{ visite.creneau }}</p>
            </div>
          </div>

          <div class="card-actions" v-if="visite.statut !== 'Confirmée'">
            <button class="btn-annuler" @click="annuler(visite.id)">Annuler la demande</button>
          </div>

          <div class="progress-bar-container">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: visite.progression + '%' }"></div>
              <div
                v-for="(etape, i) in visite.etapes"
                :key="i"
                class="dot"
                :class="{ active: etape }"
                :style="{ left: (i / (visite.etapes.length - 1)) * 100 + '%' }"
              ></div>
            </div>
            <div class="progress-status-text">{{ visite.statut }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const demandes = ref([
  {
    id: 1,
    titre: 'Studio meublé centre-ville',
    photo: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=300&fit=crop',
    lieu: 'Plateau',
    date: '2026-04-25',
    creneau: 'Matin',
    progression: 33,
    etapes: [true, true, false, false],
    statut: 'Vue',
  },
  {
    id: 2,
    titre: 'Appartement 2 pièces',
    photo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=300&fit=crop',
    lieu: 'Yoff',
    date: '2026-04-28',
    creneau: 'Soir',
    progression: 66,
    etapes: [true, true, true, false],
    statut: 'Confirmée',
  },
])

function annuler(id) {
  demandes.value = demandes.value.filter((d) => d.id !== id)
}
</script>

<style scoped>
.mes-demandes {
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

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.btn-nouvelle {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-nouvelle:hover { background: #f8fafc; }

.visites-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.list-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.card-top {
  display: flex;
  gap: 20px;
}

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
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}

.item-loc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.progress-bar-container {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.progress-track {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
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
  background: #22c55e;
  border-radius: 2px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e2e8f0;
  position: absolute;
  transform: translateX(-50%);
  border: 2px solid #fff;
}

.dot.active { background: #22c55e; }

.card-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.btn-annuler {
  font-size: 13px;
  font-weight: 500;
  color: #dc2626;
  background: none;
  border: 1px solid #fecaca;
  border-radius: 7px;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-annuler:hover { background: #fef2f2; }

.progress-status-text {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.etat-vide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
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
  .visites-grid { grid-template-columns: 1fr; }
  .header-row { flex-direction: column; gap: 16px; }
}
</style>
