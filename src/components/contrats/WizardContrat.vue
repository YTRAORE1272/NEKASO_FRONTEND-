<!--
  WizardContrat — Assistant de création de contrat en 4 étapes.
  Étape 1 : Sélection du candidat + informations de base
  Étape 2 : Conditions particulières
  Étape 3 : Aperçu du contrat
  Étape 4 : Confirmation
-->
<template>
  <div class="carte wizard">
    <!-- Titre et barre de progression -->
    <div class="wizard-header">
      <h3 class="wizard-titre">Génération de contrat — Étape {{ etape }}/4</h3>
      <div class="wizard-progress">
        <div
          v-for="i in 4" :key="i"
          :class="['progress-segment', { 'progress-segment--actif': i <= etape }]"
        ></div>
      </div>
    </div>

    <!-- ═══════════ ÉTAPE 1 : Informations de base ═══════════ -->
    <div v-if="etape === 1" class="wizard-body">
      <!-- Sélection du candidat -->
      <div class="champ">
        <label>Candidat (visite confirmée)</label>
        <select v-model="candidatSelectionne" @change="remplirDepuisCandidat">
          <option value="" disabled>Sélectionner un candidat...</option>
          <option
            v-for="c in candidats" :key="c.id"
            :value="c.id"
          >
            {{ c.locataire.prenom }} {{ c.locataire.nom }} — {{ c.bien.typeBien }} {{ c.bien.adresse }}
          </option>
        </select>
      </div>

      <div class="grille-2">
        <div class="champ">
          <label>Nom *</label>
          <input
            v-model="form.nom"
            type="text"
            placeholder="Nom du locataire"
            readonly
            class="input-readonly"
          />
        </div>
        <div class="champ">
          <label>Prénom *</label>
          <input
            v-model="form.prenom"
            type="text"
            placeholder="Prénom du locataire"
            readonly
            class="input-readonly"
          />
        </div>
      </div>

      <div class="grille-2">
        <div class="champ">
          <label>Bien *</label>
          <select v-model="form.bienId">
            <option value="" disabled>Choisir un bien</option>
            <option
              v-for="b in biens" :key="b.id"
              :value="b.id"
            >
              {{ b.typeBien }} — {{ b.adresse }}
            </option>
          </select>
        </div>
        <div class="champ">
          <label>Date début *</label>
          <input v-model="form.dateDebut" type="date" />
        </div>
      </div>

      <div class="grille-2">
        <div class="champ">
          <label>Loyer mensuel *</label>
          <input v-model.number="form.montantLoyer" type="number" min="0" placeholder="0" />
        </div>
        <div class="champ">
          <label>Caution</label>
          <input v-model.number="form.montantCaution" type="number" min="0" placeholder="0" />
        </div>
      </div>
    </div>

    <!-- ═══════════ ÉTAPE 2 : Conditions ═══════════ -->
    <div v-if="etape === 2" class="wizard-body">
      <div class="champ champ-conditions">
        <label>Conditions particulières</label>
        <textarea
          v-model="form.conditionsParticulieres"
          rows="12"
          placeholder="Décrivez les conditions spécifiques au contrat..."
        ></textarea>
      </div>
    </div>

    <!-- ═══════════ ÉTAPE 3 : Aperçu ═══════════ -->
    <div v-if="etape === 3" class="wizard-body">
      <h4 class="section-label">Aperçu du contrat</h4>

      <div class="apercu-contrat">
        <h4 class="apercu-titre">CONTRAT DE BAIL — RÉPUBLIQUE DU SÉNÉGAL</h4>

        <p class="apercu-ligne">
          Entre le bailleur représenté par NEKASO et
          <strong>{{ form.prenom }} {{ form.nom }}</strong>, locataire :
        </p>

        <p class="apercu-ligne">
          Bien : <strong>{{ bienSelectionneNom }}</strong>
        </p>
        <p class="apercu-ligne">
          Adresse : {{ bienSelectionneAdresse }}
        </p>
        <p class="apercu-ligne">
          Date de début : {{ form.dateDebut }}
        </p>
        <p class="apercu-ligne">
          Loyer mensuel : {{ formatMontant(form.montantLoyer) }} FCFA
          — Caution : {{ formatMontant(form.montantCaution) }} FCFA
        </p>
        <p class="apercu-ligne">
          Conditions particulières :
          <span v-if="!form.conditionsParticulieres.trim()" class="texte-secondaire">Aucune condition définie</span>
        </p>
        <p v-if="form.conditionsParticulieres.trim()" class="apercu-conditions">{{ form.conditionsParticulieres }}</p>
      </div>
    </div>

    <!-- ═══════════ ÉTAPE 4 : Confirmation ═══════════ -->
    <div v-if="etape === 4" class="wizard-body wizard-body--centrer">
      <div class="confirmation-icone">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="#22c55e" stroke-width="2"/>
          <path d="M17 28.5L24.5 36L39 21" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="confirmation-texte">Prêt à confirmer le contrat</p>
    </div>

    <!-- ═══════════ Navigation ═══════════ -->
    <div class="wizard-footer">
      <button
        v-if="etape > 1"
        class="btn-secondaire"
        @click="etapePrecedente"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Précédent
      </button>
      <span v-else></span>

      <button
        v-if="etape < 4"
        class="btn-primaire"
        :disabled="!etapeValide"
        @click="etapeSuivante"
      >
        Suivant
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <button
        v-else
        class="btn-confirmer"
        @click="confirmerContrat"
        :disabled="enCoursCreation"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        {{ enCoursCreation ? 'Création...' : 'Confirmer le contrat' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  candidats: { type: Array, default: () => [] },
  biens:     { type: Array, default: () => [] },
  demandePreselectionnee: { type: Object, default: null }
})

const emit = defineEmits(['contrat-cree'])

/* ───── État du wizard ───── */
const etape = ref(1)
const enCoursCreation = ref(false)
const candidatSelectionne = ref('')

const form = ref({
  nom: '',
  prenom: '',
  locataireId: null,
  demandeLocationId: null,
  bienId: '',
  dateDebut: '',
  montantLoyer: 0,
  montantCaution: 0,
  conditionsParticulieres: ''
})

/* ───── Computed ───── */
const bienSelectionne = computed(() =>
  props.biens.find(b => b.id === form.value.bienId)
)

const bienSelectionneNom = computed(() => {
  const b = bienSelectionne.value
  if (!b) return '—'
  const type = b.typeBien ? b.typeBien.charAt(0) + b.typeBien.slice(1).toLowerCase() : ''
  const quartier = b.adresse ? b.adresse.split(',')[0].trim() : ''
  return `${type} ${quartier}`
})

const bienSelectionneAdresse = computed(() =>
  bienSelectionne.value?.adresse ?? '—'
)

const etapeValide = computed(() => {
  if (etape.value === 1) {
    return form.value.nom && form.value.prenom && form.value.bienId && form.value.dateDebut && form.value.montantLoyer > 0
  }
  return true // Étapes 2, 3, 4 sont toujours valides
})

/* ───── Méthodes ───── */
function remplirDepuisCandidat() {
  const candidat = props.candidats.find(c => c.id === Number(candidatSelectionne.value))
  if (!candidat) return
  form.value.nom = candidat.locataire.nom
  form.value.prenom = candidat.locataire.prenom
  form.value.locataireId = candidat.locataire.id
  form.value.bienId = candidat.bien.id
  form.value.montantLoyer = candidat.bien.loyer
  form.value.montantCaution = candidat.bien.loyer * 2
}

/* ───── Préremplissage depuis une demande de location confirmée ───── */
function preremplirDepuisDemande(demande) {
  if (!demande) return
  form.value.demandeLocationId = demande.id ?? null

  const candidatCorrespondant = props.candidats.find(
    (c) => c.locataire?.id === (demande.locataire?.id ?? demande.locataireId)
  )
  if (candidatCorrespondant) {
    candidatSelectionne.value = candidatCorrespondant.id
    remplirDepuisCandidat()
    return
  }

  // Candidat pas encore chargé / introuvable : préremplissage direct depuis la demande
  const loc = demande.locataire || {}
  const bien = demande.bien || {}
  form.value.nom = loc.nom || ''
  form.value.prenom = loc.prenom || ''
  form.value.locataireId = loc.id ?? demande.locataireId ?? null
  form.value.bienId = bien.id ?? demande.bienId ?? ''
  form.value.montantLoyer = bien.loyer ?? 0
  form.value.montantCaution = (bien.loyer ?? 0) * 2
}

watch(
  () => props.candidats,
  () => {
    if (!props.demandePreselectionnee || candidatSelectionne.value) return
    preremplirDepuisDemande(props.demandePreselectionnee)
  },
  { immediate: true }
)

function etapeSuivante() {
  if (etape.value < 4 && etapeValide.value) etape.value++
}

function etapePrecedente() {
  if (etape.value > 1) etape.value--
}

function formatMontant(montant) {
  if (!montant) return '0'
  return Number(montant).toLocaleString('fr-FR')
}

async function confirmerContrat() {
  enCoursCreation.value = true
  try {
    const bienObj = bienSelectionne.value
    const contratData = {
      demandeLocationId: form.value.demandeLocationId,
      dateDebut: String(form.value.dateDebut),
      dateFin: calculerDateFin(form.value.dateDebut, 12),
      montantLoyer: form.value.montantLoyer,
      montantCaution: form.value.montantCaution,
      conditions: form.value.conditionsParticulieres.trim(),
      locataire: {
        id: form.value.locataireId,
        nom: form.value.nom,
        prenom: form.value.prenom
      },
      bien: bienObj ? {
        id: bienObj.id,
        adresse: bienObj.adresse,
        typeBien: bienObj.typeBien,
        loyer: bienObj.loyer
      } : null
    }
    emit('contrat-cree', contratData)
  } finally {
    enCoursCreation.value = false
  }
}

function calculerDateFin(dateDebut, mois) {
  if (!dateDebut) return ''
  const d = new Date(dateDebut)
  d.setMonth(d.getMonth() + mois)
  return d.toISOString().split('T')[0]
}
</script>

<style scoped>
/* ===== En-tête du wizard ===== */
.wizard {
  padding: 0;
}

.wizard-header {
  padding: 24px 24px 0;
}

.wizard-titre {
  font-size: 16px;
  font-weight: 700;
  color: var(--texte-principal);
  margin-bottom: 16px;
}

/* ===== Barre de progression ===== */
.wizard-progress {
  display: flex;
  gap: 8px;
}

.progress-segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: var(--bordure);
  transition: background-color 0.3s ease;
}

.progress-segment--actif {
  background-color: var(--couleur-succes);
}

/* ===== Corps des étapes ===== */
.wizard-body {
  padding: 24px;
}

.wizard-body--centrer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--texte-principal);
  margin-bottom: 16px;
}

/* ===== Étape 2 : Conditions ===== */
.champ-conditions textarea {
  resize: vertical;
}

/* ===== Étape 3 : Aperçu ===== */
.apercu-contrat {
  background: var(--fond-general);
  border: 1px solid var(--bordure);
  border-radius: var(--bordure-radius);
  padding: 24px;
}

.apercu-titre {
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: var(--texte-principal);
  margin-bottom: 20px;
}

.apercu-ligne {
  font-size: 14px;
  color: var(--texte-principal);
  margin-bottom: 6px;
  line-height: 1.7;
}

.apercu-conditions {
  font-size: 13px;
  color: var(--texte-secondaire);
  white-space: pre-wrap;
  margin-top: 4px;
}

.texte-secondaire {
  color: var(--texte-secondaire);
  font-style: italic;
}

/* ===== Étape 4 : Confirmation ===== */
.confirmation-icone {
  margin-bottom: 16px;
}

.confirmation-texte {
  font-size: 16px;
  font-weight: 600;
  color: var(--texte-principal);
  margin-bottom: 24px;
}

/* ===== Footer du wizard ===== */
.wizard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid var(--bordure);
}

.btn-confirmer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--couleur-succes);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--bordure-radius-petit);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-confirmer:hover {
  opacity: 0.9;
}

.btn-confirmer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== Input readonly ===== */
.input-readonly {
  background-color: var(--fond-general) !important;
  color: var(--texte-secondaire) !important;
  cursor: default;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .grille-2 {
    grid-template-columns: 1fr;
  }
}
</style>
