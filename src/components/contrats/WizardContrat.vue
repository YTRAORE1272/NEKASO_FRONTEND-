<template>
  <div class="carte wizard">
    <div class="wizard-header">
      <h3 class="wizard-titre">Création de pré-contrat — Étape {{ etape }}/3</h3>
      <div class="wizard-progress">
        <div
          v-for="i in 3"
          :key="i"
          :class="['progress-segment', { 'progress-segment--actif': i <= etape }]"
        ></div>
      </div>
    </div>

    <div v-if="etape === 1" class="wizard-body">
      <p v-if="!demandes.length" class="gris ta-center">
        Aucune demande de location acceptée. Validez d'abord une demande côté « Demandes de location ».
      </p>
      <template v-else>
        <div class="champ">
          <label>Demande de location acceptée *</label>
          <select v-model="form.demandeId" @change="majMontants">
            <option value="" disabled>Sélectionner une demande...</option>
            <option v-for="d in demandes" :key="d.id" :value="d.id">
              {{ libelleDemande(d) }}
            </option>
          </select>
        </div>
        <div v-if="demandeChoisie" class="recap-client">
          <span>{{ demandeChoisie.bien?.intitule || 'Bien #' + demandeChoisie.bienId }}</span>
          <span class="gris">{{ demandeChoisie.bien?.adresse }}</span>
          <span class="gris">Loyer : {{ formatMontant(demandeChoisie.bien?.loyer || 0) }} FCFA</span>
        </div>
      </template>
    </div>

    <div v-if="etape === 2" class="wizard-body">
      <div class="grille-2">
        <div class="champ">
          <label>Date de début prévue *</label>
          <input v-model="form.dateDebut" type="date" />
        </div>
        <div class="champ">
          <label>Jour d'échéance du loyer (1-28) *</label>
          <input v-model.number="form.jourEcheance" type="number" min="1" max="28" />
        </div>
      </div>
      <div class="champ">
        <label>Conditions particulières</label>
        <textarea
          v-model="form.conditions"
          rows="6"
          placeholder="Décrivez les conditions spécifiques au pré-contrat..."
        ></textarea>
      </div>
    </div>

    <div v-if="etape === 3" class="wizard-body">
      <h4 class="section-label">Résumé du pré-contrat</h4>
      <div class="apercu">
        <h4 class="apercu-titre">PRÉ-CONTRAT DE BAIL — RÉPUBLIQUE DU SÉNÉGAL</h4>
        <p>Bien : <strong>{{ demandeChoisie?.bien?.intitule || 'Bien #' + demandeChoisie?.bienId }}</strong> — {{ demandeChoisie?.bien?.adresse }}</p>
        <p>Loyer de référence : <strong>{{ formatMontant(demandeChoisie?.bien?.loyer || 0) }} FCFA</strong></p>
        <p>Début prévu : {{ form.dateDebut }} — échéance le {{ form.jourEcheance }} de chaque mois</p>
        <p v-if="form.conditions.trim()" class="conditions">{{ form.conditions }}</p>
        <p v-else class="gris">Aucune condition particulière.</p>
      </div>
    </div>

    <div class="wizard-footer">
      <button v-if="etape > 1" class="btn-secondaire" @click="etape--">Précédent</button>
      <span v-else></span>
      <button v-if="etape < 3" class="btn-primaire" :disabled="!etapeValide" @click="etape++">
        Suivant
      </button>
      <button v-else class="btn-confirmer" :disabled="enCours" @click="confirmer">
        {{ enCours ? 'Création...' : 'Créer le pré-contrat' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFormat } from '@/composables/useFormat'

const props = defineProps({
  demandes: { type: Array, default: () => [] },
})
const emit = defineEmits(['cree'])
const { formatMontant } = useFormat()

const etape = ref(1)
const enCours = ref(false)

const form = reactive({
  demandeId: '',
  dateDebut: new Date().toISOString().split('T')[0],
  jourEcheance: 5,
  conditions: '',
})

const demandeChoisie = computed(() => props.demandes.find((d) => d.id === form.demandeId))

function libelleDemande(d) {
  const bien = d.bien?.intitule || 'Bien #' + d.bienId
  const lieu = d.bien?.adresse ? ' — ' + d.bien.adresse : ''
  return bien + lieu
}

function majMontants() {}

const etapeValide = computed(() => {
  if (etape.value === 1) return !!form.demandeId
  if (etape.value === 2) return form.dateDebut && form.jourEcheance >= 1 && form.jourEcheance <= 28
  return true
})

async function confirmer() {
  enCours.value = true
  try {
    emit('cree', {
      demandeLocationId: form.demandeId,
      dateDebutPrevu: form.dateDebut,
      jourEcheancePaiement: form.jourEcheance,
      conditions: form.conditions.trim(),
    })
  } finally {
    enCours.value = false
  }
}
</script>

<style scoped>
.wizard {
  padding: 0;
}
.wizard-header {
  padding: 24px 24px 0;
}
.wizard-titre {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}
.wizard-progress {
  display: flex;
  gap: 8px;
}
.progress-segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  transition: background 0.3s;
}
.progress-segment--actif {
  background: #00d15a;
}
.wizard-body {
  padding: 24px;
}
.grille-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.champ {
  margin-bottom: 16px;
}
.champ label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}
.champ input,
.champ select,
.champ textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.recap-client {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}
.section-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}
.apercu {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  font-size: 14px;
  line-height: 1.9;
  color: #374151;
}
.apercu-titre {
  text-align: center;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}
.conditions {
  white-space: pre-wrap;
  margin-top: 8px;
}
.gris {
  color: #94a3b8;
}
.ta-center {
  text-align: center;
}
.wizard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}
.btn-primaire,
.btn-confirmer {
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-primaire {
  background: #212d4d;
}
.btn-confirmer {
  background: #00d15a;
}
.btn-primaire:disabled,
.btn-confirmer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-secondaire {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
</style>
