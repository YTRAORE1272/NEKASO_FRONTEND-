<!--
  VisitesView — Demandes de visites (maquette GestNEKASO).

  - Tableau filtrable avec actions contextuelles
  - Modale création / reprogrammation
  - Lien vers demandes de location (badge)
-->
<template>
  <div class="visites-page">
    <!-- En-tête page -->
    <div class="visites-header">
      <div>
        <h2 class="visites-titre">Demandes de visites</h2>
        <p class="visites-sous-titre">Demandes et planification</p>
      </div>
      <div class="visites-header-actions">
        <button
          type="button"
          class="btn-demandes-location"
          @click="$router.push('/gestionnaire/demandes-location')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 3h-8l-2 4h12l-2-4z"/>
          </svg>
          Demandes de location
          <span v-if="nbDemandesLocation > 0" class="badge-compteur">{{ nbDemandesLocation }}</span>
        </button>
        <button type="button" class="btn-visites-primaire" @click="ouvrirModaleCreation">
          + Nouvelle visite
        </button>
      </div>
    </div>

    <ChargementSpinner v-if="visitesStore.chargement" message="Chargement des visites..." />

    <div v-else class="carte visites-carte">
      <!-- Contrôles dans la carte (maquette) -->
      <div class="carte-toolbar">
        <select v-model="filtreStatut" class="filtre-select" aria-label="Filtrer par statut">
          <option value="">Tous statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="CONFIRMEE">Confirmée</option>
          <option value="REFUSEE">Refusée</option>
        </select>
        <button type="button" class="btn-export" @click="exporterCalendrier">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Exporter calendrier
        </button>
      </div>

      <div v-if="visitesFiltrees.length > 0" class="tableau-wrapper">
        <table class="tableau">
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Contact</th>
              <th>Bien</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Statut</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="visite in visitesFiltrees" :key="visite.id">
              <td><strong>{{ visite.candidat?.nom || '—' }}</strong></td>
              <td>{{ visite.candidat?.telephone || '—' }}</td>
              <td>{{ visite.bien?.adresse || '—' }}</td>
              <td>{{ visite.dateVisite || '—' }}</td>
              <td>{{ visite.heureVisite || '—' }}</td>
              <td><BadgeStatut :statut="visite.statut" /></td>
              <td class="cellule-actions">
                <template v-if="visite.statut === 'EN_ATTENTE'">
                  <button type="button" class="btn-action btn-action--confirmer" @click="confirmer(visite.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Confirmer
                  </button>
                  <button type="button" class="btn-action btn-action--refuser" @click="refuser(visite.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Refuser
                  </button>
                </template>

                <template v-else-if="visite.statut === 'CONFIRMEE'">
                  <button
                    type="button"
                    class="btn-action btn-action--attribuer"
                    @click="$router.push('/gestionnaire/demandes-location')"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    Attribuer
                  </button>
                  <button type="button" class="btn-action btn-action--texte" @click="ouvrirModaleReprogrammation(visite)">
                    Reprogrammer
                  </button>
                </template>

                <template v-else-if="visite.statut === 'REFUSEE'">
                  <button type="button" class="btn-action btn-action--texte" @click="ouvrirModaleReprogrammation(visite)">
                    Reprogrammer
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <MessageVide
        v-else
        icone="📅"
        texte="Aucune demande de visite"
        class="visites-vide"
      />
    </div>

    <ModalNouvelleVisite
      :visible="modaleVisible"
      :modele="formulaire"
      :biens="biensDisponibles"
      :mode-edition="!!visiteEnEdition"
      @fermer="fermerModale"
      @soumettre="enregistrer"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVisitesStore } from '@/stores/visites.store'
import { mockBiens, mockDemandesLocation } from '@/services/mockData'
import BadgeStatut from '@/components/common/BadgeStatut.vue'
import ChargementSpinner from '@/components/common/ChargementSpinner.vue'
import MessageVide from '@/components/common/MessageVide.vue'
import ModalNouvelleVisite from '@/components/visites/ModalNouvelleVisite.vue'

const visitesStore = useVisitesStore()

const filtreStatut = ref('')
const modaleVisible = ref(false)
const visiteEnEdition = ref(null)
const biensDisponibles = ref(mockBiens)

const formulaireVide = () => ({
  candidat: '',
  contact: '',
  bienId: mockBiens[0]?.id ?? '',
  date: '',
  heure: ''
})

const formulaire = ref(formulaireVide())

const nbDemandesLocation = computed(() =>
  mockDemandesLocation.filter(d => d.statut === 'EN_ATTENTE').length
)

const visitesFiltrees = computed(() => {
  if (!filtreStatut.value) return visitesStore.visites
  return visitesStore.visites.filter(v => v.statut === filtreStatut.value)
})

function confirmer(id) {
  visitesStore.confirmer(id)
}

function refuser(id) {
  visitesStore.refuser(id)
}

function ouvrirModaleCreation() {
  visiteEnEdition.value = null
  formulaire.value = formulaireVide()
  modaleVisible.value = true
}

function ouvrirModaleReprogrammation(visite) {
  visiteEnEdition.value = visite.id
  formulaire.value = {
    candidat: visite.candidat?.nom || '',
    contact: visite.candidat?.telephone || '',
    bienId: visite.bien?.id ?? '',
    date: visite.dateVisite || '',
    heure: visite.heureVisite || ''
  }
  modaleVisible.value = true
}

function fermerModale() {
  modaleVisible.value = false
  visiteEnEdition.value = null
}

async function enregistrer() {
  const bienChoisi = biensDisponibles.value.find(b => b.id === Number(formulaire.value.bienId))
  const bienPayload = bienChoisi
    ? { id: bienChoisi.id, adresse: bienChoisi.adresse.split(',')[0].trim(), typeBien: bienChoisi.typeBien, loyer: bienChoisi.loyer }
    : null

  if (visiteEnEdition.value) {
    await visitesStore.reprogrammer(
      visiteEnEdition.value,
      formulaire.value.date,
      formulaire.value.heure
    )
  } else {
    await visitesStore.creer({
      dateVisite: formulaire.value.date,
      heureVisite: formulaire.value.heure,
      candidat: {
        nom: formulaire.value.candidat,
        telephone: formulaire.value.contact
      },
      bien: bienPayload
    })
  }

  fermerModale()
}

function exporterCalendrier() {
  const evenements = visitesFiltrees.value.map(v => {
    const date = (v.dateVisite || '').replace(/-/g, '')
    const heure = (v.heureVisite || '09:00').replace(':', '') + '00'
    return [
      'BEGIN:VEVENT',
      `UID:visite-${v.id}@nekaso`,
      `DTSTART:${date}T${heure}`,
      `SUMMARY:Visite - ${v.candidat?.nom || 'Candidat'}`,
      `DESCRIPTION:${v.bien?.adresse || ''}`,
      'END:VEVENT'
    ].join('\r\n')
  })
  const contenu = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NEKASO//FR', ...evenements, 'END:VCALENDAR'].join('\r\n')
  const blob = new Blob([contenu], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const lien = document.createElement('a')
  lien.href = url
  lien.download = 'visites-nekaso.ics'
  lien.click()
  URL.revokeObjectURL(url)
}

onMounted(() => visitesStore.charger())
</script>

<style scoped>
.visites-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.visites-titre {
  font-size: 22px;
  font-weight: 700;
  color: var(--couleur-primaire);
  margin: 0;
}

.visites-sous-titre {
  font-size: 13px;
  color: var(--texte-secondaire);
  margin: 4px 0 0;
}

.visites-header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}

.btn-visites-primaire {
  background-color: var(--couleur-primaire);
  color: var(--texte-blanc);
  border: none;
  padding: 10px 18px;
  border-radius: var(--bordure-radius-petit);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.btn-visites-primaire:hover {
  opacity: 0.9;
}

.btn-demandes-location {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: white;
  color: var(--texte-principal);
  border: 1px solid var(--bordure);
  border-radius: var(--bordure-radius-petit);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-demandes-location:hover {
  background-color: var(--fond-general);
}

.badge-compteur {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background-color: var(--couleur-danger);
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
}

.visites-carte {
  padding-top: 20px;
}

.carte-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filtre-select {
  padding: 8px 14px;
  border: 1px solid var(--bordure);
  border-radius: var(--bordure-radius-petit);
  font-size: 13px;
  color: var(--texte-principal);
  background-color: white;
  cursor: pointer;
  outline: none;
}

.filtre-select:focus {
  border-color: var(--couleur-primaire);
}

.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background-color: white;
  color: var(--texte-principal);
  border: 1px solid var(--bordure);
  border-radius: var(--bordure-radius-petit);
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-export:hover {
  background-color: var(--fond-general);
}

.tableau-wrapper {
  overflow-x: auto;
}

.visites-carte :deep(.tableau th) {
  background-color: transparent;
}

.th-actions {
  text-align: right;
}

.cellule-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s, background-color 0.2s, color 0.2s;
}

.btn-action--confirmer,
.btn-action--attribuer {
  background-color: #16a34a;
  color: white;
  border: none;
}

.btn-action--confirmer:hover,
.btn-action--attribuer:hover {
  opacity: 0.9;
}

.btn-action--refuser {
  background-color: white;
  color: var(--texte-principal);
  border: 1px solid var(--bordure);
}

.btn-action--refuser:hover {
  color: var(--couleur-danger);
  border-color: #fecaca;
}

.btn-action--texte {
  background: transparent;
  border: none;
  color: var(--texte-principal);
  padding: 6px 8px;
  font-weight: 500;
}

.btn-action--texte:hover {
  color: var(--couleur-primaire);
}

.visites-vide {
  padding: 40px 20px;
}

@media (max-width: 768px) {
  .visites-header {
    flex-direction: column;
    gap: 12px;
  }

  .visites-header-actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .cellule-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
