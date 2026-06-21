<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-head">
        <div>
          <h3>Enregistrer un paiement</h3>
          <p class="sub">Sélectionnez le locataire puis saisissez le paiement.</p>
        </div>
        <button class="x" @click="$emit('close')" aria-label="Fermer">✕</button>
      </header>

      <div class="modal-body">
        <section>
          <h4 class="label">1. Sélectionner un locataire</h4>
          <div v-if="!contrats.length" class="vide">
            Aucun locataire avec un contrat actif.
          </div>
          <div v-else class="search-container">
            <input
              type="text"
              v-model="recherche"
              placeholder="Rechercher un locataire (nom ou téléphone)..."
              class="champ search-input"
            />
            <div class="dropdown">
              <div
                v-for="c in contratsFiltres"
                :key="c.id"
                class="option"
                :class="{ actif: contratChoisi === c.id }"
                @click="contratChoisi = c.id"
              >
                <div class="option-info">
                  <span class="option-nom">{{ nom(c.locataire) }}</span>
                  <span class="option-tel">{{ c.locataire?.telephone || '—' }} · {{ c.bien?.intitule || '' }}</span>
                </div>
                <div v-if="contratChoisi === c.id" class="check-icon">✓</div>
              </div>
              <div v-if="contratsFiltres.length === 0" class="option-vide">
                Aucun locataire ne correspond à votre recherche.
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 class="label">2. Détails du paiement</h4>
          <div class="grille-2">
            <div class="champ-bloc">
              <label>Mois concerné *</label>
              <input v-model="form.mois" type="month" class="champ" />
            </div>
            <div class="champ-bloc">
              <label>Montant *</label>
              <input v-model.number="form.montant" type="number" min="0" placeholder="0" class="champ" />
            </div>
          </div>
          <div class="grille-2">
            <div class="champ-bloc">
              <label>Méthode</label>
              <select v-model="form.methodePaiement" class="champ">
                <option v-for="m in METHODES" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div class="champ-bloc">
              <label>Référence</label>
              <input v-model="form.reference" type="text" placeholder="Auto-générée si vide" class="champ" />
            </div>
          </div>
        </section>
      </div>

      <footer class="modal-foot">
        <button class="btn-secondaire" @click="$emit('close')">Annuler</button>
        <button class="btn-valider" :disabled="!peutValider || enCours" @click="confirmer">
          {{ enCours ? 'Enregistrement...' : 'Enregistrer le paiement' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { nomComplet } from '@/utils/constants'

const props = defineProps({
  contrats: { type: Array, default: () => [] },
  enCours: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'enregistrer'])

const METHODES = [
  { value: 'ORANGE_MONEY', label: 'Orange Money' },
  { value: 'WAVE', label: 'Wave' },
  { value: 'ESPECES', label: 'Espèces' },
  { value: 'VIREMENT', label: 'Virement' },
]

const recherche = ref('')
const contratChoisi = ref(null)

const nom = (p) => nomComplet(p)

const contratsFiltres = computed(() => {
  if (!recherche.value) return props.contrats
  const q = recherche.value.toLowerCase()
  return props.contrats.filter((c) => {
    const n = `${c.locataire?.prenom || ''} ${c.locataire?.nom || ''}`.toLowerCase()
    const tel = (c.locataire?.telephone || '').toLowerCase()
    return n.includes(q) || tel.includes(q)
  })
})

const moisCourant = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
})()

const form = reactive({
  mois: moisCourant,
  montant: null,
  methodePaiement: 'ORANGE_MONEY',
  reference: '',
})

const peutValider = computed(() => contratChoisi.value && form.mois && form.montant > 0)

function confirmer() {
  if (!peutValider.value) return
  emit('enregistrer', {
    contratId: contratChoisi.value,
    mois: form.mois,
    montant: form.montant,
    methodePaiement: form.methodePaiement,
    reference: form.reference.trim() || undefined,
  })
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
.vide {
  font-size: 13px;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
.search-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.champ {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.dropdown {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.15s;
}
.option:last-child {
  border-bottom: none;
}
.option:hover {
  background: #f8fafc;
}
.option.actif {
  background: #f0fdf4;
}
.option-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.option-nom {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}
.option-tel {
  font-size: 13px;
  color: #64748b;
}
.check-icon {
  color: #00d15a;
  font-weight: bold;
  font-size: 16px;
}
.option-vide {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}
.grille-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}
.grille-2:last-child {
  margin-bottom: 0;
}
.champ-bloc {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.champ-bloc label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
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
