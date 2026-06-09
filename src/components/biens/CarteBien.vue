<template>
  <div class="carte-bien-gestionnaire">
    <!-- IMAGE + BADGE -->
    <div class="bien-image">
      <img :src="bien.photos?.[0]?.urlPhoto || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'" :alt="bien.intitule" loading="lazy" />
      <div class="badges">
        <span class="badge-statut" :class="statutClass">{{ formatStatut(bien.statutBien) }}</span>
      </div>
    </div>

    <!-- CONTENU -->
    <div class="bien-content">
      <div class="bien-header">
        <h3 class="bien-titre">{{ bien.intitule || `${formatTypeBien(bien.typeBien)} - ${bien.adresse}` }}</h3>
        <span class="bien-type">{{ formatTypeBien(bien.typeBien) }}</span>
      </div>

      <div class="bien-localisation">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        {{ bien.adresse }}
      </div>

      <div class="bien-prix">
        <span class="prix">{{ formatMontant(bien.loyer) }} FCFA</span>
        <span class="periode">/mois</span>
      </div>

      <!-- ACTIONS -->
      <div class="bien-actions">
        <button class="btn-action btn-view" title="Voir les détails" @click="$emit('view', bien.id)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Détails
        </button>
        <button class="btn-action btn-edit" title="Modifier" @click="$emit('edit', bien)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Modifier
        </button>
        <button class="btn-action btn-archive" title="Archiver" @click="$emit('archive', bien)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bien: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'archive'])

const formatMontant = (montant) => {
  if (!montant) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(montant)
}

const formatTypeBien = (type) => {
  const types = {
    APPARTEMENT: 'Appartement',
    STUDIO: 'Studio',
    CHAMBRE: 'Chambre',
    LOCAL: 'Local',
    VILLA: 'Villa',
    BUREAU: 'Bureau'
  }
  return types[type] || type
}

const formatStatut = (statut) => {
  const statuts = {
    LOUE: 'Loué',
    DISPONIBLE: 'Disponible',
    RESERVE: 'Réservé',
    ARCHIVE: 'Archivé',
  }
  return statuts[statut] || statut
}

const statutClass = computed(() => {
  const classes = {
    LOUE: 'statut-loue',
    DISPONIBLE: 'statut-disponible',
    RESERVE: 'statut-reserve',
    ARCHIVE: 'statut-archive',
  }
  return classes[props.bien.statutBien] || ''
})
</script>

<style scoped>
.carte-bien-gestionnaire {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
}

/* ── IMAGE ── */
.bien-image {
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #e5e7eb;
}

.bien-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badges {
  position: absolute;
  top: 12px;
  left: 12px;
}

.badge-statut {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.statut-disponible { background-color: #22c55e; color: #ffffff; }
.statut-loue { background-color: #ef4444; color: #ffffff; }
.statut-reserve { background-color: #f59e0b; color: #ffffff; }
.statut-archive { background-color: #9ca3af; color: #ffffff; }

/* ── CONTENU ── */
.bien-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.bien-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
}

.bien-titre {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.bien-type {
  font-size: 12px;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.bien-localisation {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}

.bien-prix {
  margin-top: auto;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.prix {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.periode {
  font-size: 13px;
  color: #64748b;
}

/* ── ACTIONS ── */
.bien-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view {
  flex: 1;
}

.btn-edit {
  flex: 1;
}

.btn-archive {
  width: 36px;
  padding: 0;
  color: #ef4444;
}

.btn-action:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.btn-archive:hover {
  background-color: #fef2f2;
  border-color: #fca5a5;
}
</style>
