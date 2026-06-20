<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-head">
        <div>
          <h3>Valider la visite</h3>
          <p class="sub">{{ bien.intitule || bien.libelle || 'Bien' }}</p>
        </div>
        <button class="x" @click="$emit('close')" aria-label="Fermer">✕</button>
      </header>

      <div class="modal-body">
        <section>
          <h4 class="label">Quelle suite donner à cette visite ?</h4>
          <div class="choix">
            <button
              type="button"
              class="choix-carte"
              :class="{ actif: choix === 'AVEC_CONTRAT' }"
              @click="choix = 'AVEC_CONTRAT'"
            >
              <strong>Avec contrat</strong>
              <span>Le bien m'intéresse — générer un pré-contrat</span>
            </button>
            <button
              type="button"
              class="choix-carte"
              :class="{ actif: choix === 'SANS_CONTRAT' }"
              @click="choix = 'SANS_CONTRAT'"
            >
              <strong>Sans contrat</strong>
              <span>Visite effectuée, sans suite</span>
            </button>
          </div>
        </section>

        <section v-if="choix === 'AVEC_CONTRAT'">
          <h4 class="label">Conditions du pré-contrat</h4>
          <div class="grille-2">
            <div class="champ">
              <label>Date de début prévue *</label>
              <input v-model="form.dateDebutPrevu" type="date" />
            </div>
            <div class="champ">
              <label>Jour d'échéance (1-28) *</label>
              <input v-model.number="form.jourEcheancePaiement" type="number" min="1" max="28" />
            </div>
          </div>
          <div class="champ">
            <label>Conditions particulières *</label>
            <textarea
              v-model="form.conditions"
              rows="4"
              placeholder="Décrivez les conditions du bail..."
            ></textarea>
          </div>
          <p class="avertissement">⚠️ Action irréversible : un pré-contrat sera créé pour ce bien.</p>
        </section>
      </div>

      <footer class="modal-foot">
        <button class="btn-secondaire" @click="$emit('close')">Annuler</button>
        <button class="btn-valider" :disabled="!peutValider || enCours" @click="confirmer">
          {{ enCours ? 'Envoi...' : libelleValider }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  visite: { type: Object, required: true },
  enCours: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'valider'])

const bien = computed(() => props.visite.bien || {})

const choix = ref('')
const form = reactive({
  dateDebutPrevu: new Date().toISOString().split('T')[0],
  jourEcheancePaiement: 5,
  conditions: '',
})

const peutValider = computed(() => {
  if (choix.value === 'SANS_CONTRAT') return true
  if (choix.value === 'AVEC_CONTRAT') {
    return (
      form.dateDebutPrevu &&
      form.jourEcheancePaiement >= 1 &&
      form.jourEcheancePaiement <= 28 &&
      form.conditions.trim().length > 0
    )
  }
  return false
})

const libelleValider = computed(() =>
  choix.value === 'AVEC_CONTRAT' ? 'Valider et créer le pré-contrat' : 'Valider la visite',
)

function confirmer() {
  if (!peutValider.value) return
  const payload =
    choix.value === 'AVEC_CONTRAT'
      ? {
          dateDebutPrevu: form.dateDebutPrevu,
          jourEcheancePaiement: form.jourEcheancePaiement,
          conditions: form.conditions.trim(),
        }
      : {}
  emit('valider', { choix: choix.value, payload })
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}
.modal {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px 12px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-head h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}
.sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}
.x {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
}
.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}
.choix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.choix-carte {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  padding: 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}
.choix-carte:hover {
  border-color: #cbd5e1;
}
.choix-carte.actif {
  border-color: #00d15a;
  background: #f0fdf4;
}
.choix-carte strong {
  font-size: 14px;
  color: #1e293b;
}
.choix-carte span {
  font-size: 12px;
  color: #64748b;
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
.champ textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.avertissement {
  font-size: 13px;
  color: #b45309;
  background: #fffbeb;
  border-radius: 8px;
  padding: 10px 12px;
}
.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid #f1f5f9;
}
.btn-secondaire {
  padding: 10px 18px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: #475569;
}
.btn-valider {
  padding: 10px 20px;
  border: none;
  background: #00d15a;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-valider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
