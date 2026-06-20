<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-head">
        <div>
          <h3>Valider la visite</h3>
          <p class="sub">
            {{ nomClient }} — {{ bien?.intitule }}
          </p>
        </div>
        <button class="x" @click="$emit('close')" aria-label="Fermer">✕</button>
      </header>

      <div class="modal-body">
        <section>
          <h4 class="label">1. Date et heure de la visite</h4>
          <div class="dh-inputs">
            <input type="date" v-model="dateVisite" class="dh-input" />
            <input type="time" v-model="heureVisite" class="dh-input" />
          </div>
        </section>

        <section>
          <h4 class="label">2. Affecter un agent</h4>
          <div v-if="!agents.length" class="vide">
            Aucun agent sélectionnable. Créez un agent dans « Agents » (les agents créés dans cette session sont utilisables pour la validation).
          </div>
          <div v-else class="agents">
            <label
              v-for="a in agents"
              :key="a.id"
              class="agent"
              :class="{ actif: agentChoisi === a.idAgent }"
            >
              <input type="radio" :value="a.idAgent" v-model="agentChoisi" />
              <span class="agent-nom">{{ a.prenom }} {{ a.nom }}</span>
              <span class="agent-tel">{{ a.telephone }}</span>
            </label>
          </div>
        </section>
      </div>

      <footer class="modal-foot">
        <button class="btn-secondaire" @click="$emit('close')">Annuler</button>
        <button class="btn-valider" :disabled="!peutValider" @click="confirmer">
          Valider la visite
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAgentsStore } from '@/stores/agents.store'
import { nomComplet } from '@/utils/constants'

const props = defineProps({
  visite: { type: Object, required: true },
})
const emit = defineEmits(['close', 'valider'])

const agentsStore = useAgentsStore()

const bien = computed(() => props.visite.bien || {})
const nomClient = computed(() => nomComplet(props.visite.client || props.visite.locataire))

const agents = computed(() => agentsStore.agents.filter((a) => a.idAgent != null))
const dateVisite = ref('')
const heureVisite = ref('')
const agentChoisi = ref(null)

const peutValider = computed(() => dateVisite.value && heureVisite.value && agentChoisi.value)

function confirmer() {
  if (!peutValider.value) return
  emit('valider', {
    date: dateVisite.value,
    heure: heureVisite.value,
    agentId: agentChoisi.value,
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
.dh-inputs {
  display: flex;
  gap: 12px;
}
.dh-input {
  flex: 1;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.creneaux {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}
.creneau {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.creneau:hover {
  border-color: #cbd5e1;
}
.creneau.actif {
  border-color: #00d15a;
  background: #f0fdf4;
}
.creneau-date {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}
.creneau-heure {
  font-size: 16px;
  font-weight: 700;
  color: #212d4d;
}
.creneau-agents {
  font-size: 11px;
  color: #64748b;
}
.agents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.agent {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}
.agent.actif {
  border-color: #212d4d;
  background: #f8fafc;
}
.agent-nom {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}
.agent-tel {
  margin-left: auto;
  font-size: 13px;
  color: #64748b;
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
