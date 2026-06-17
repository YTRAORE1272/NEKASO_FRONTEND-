<!--
  ContratsView — Page principale de gestion des contrats.
  Affiche le tableau des contrats existants (ListeContrats).
  La création d'un contrat se lance depuis la page « Demandes de location »
  (section « Demandes confirmées » → bouton « Créer contrat »).
-->
<template>
  <div>
    <!-- ═══════════ En-tête ═══════════ -->
    <div class="page-header">
      <h1 class="page-title">Contrats</h1>
      <p class="page-subtitle">Consultez et téléchargez les contrats de bail en cours</p>
    </div>

    <!-- ═══════════ Contenu ═══════════ -->
    <ChargementSpinner v-if="contratsStore.chargement" message="Chargement des contrats..." />

    <MessageVide
      v-else-if="contratsStore.contrats.length === 0"
      icone="📄"
      texte="Aucun contrat pour le moment"
    />

    <template v-else>
      <ListeContrats :contrats="contratsPagines" />
      <div v-if="totalPagesContrats > 1" class="pagination-bar">
        <button class="pagination-btn" :disabled="pageCourante === 1" @click="pageCourante--">
          Précédent
        </button>
        <button
          v-for="p in totalPagesContrats"
          :key="p"
          class="pagination-btn"
          :class="{ 'pagination-btn--active': p === pageCourante }"
          @click="pageCourante = p"
        >
          {{ p }}
        </button>
        <button
          class="pagination-btn"
          :disabled="pageCourante === totalPagesContrats"
          @click="pageCourante++"
        >
          Suivant
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContratsStore } from '@/stores/contrats.store'
import ChargementSpinner from '@/components/biens/common/ChargementSpinner.vue'
import MessageVide from '@/components/biens/common/MessageVide.vue'
import ListeContrats from '@/components/contrats/ListeContrats.vue'

const contratsStore = useContratsStore()

const pageCourante = ref(1)
const parPageContrats = 6
const totalPagesContrats = computed(() =>
  Math.max(1, Math.ceil(contratsStore.contrats.length / parPageContrats)),
)
const contratsPagines = computed(() => {
  const debut = (pageCourante.value - 1) * parPageContrats
  return contratsStore.contrats.slice(debut, debut + parPageContrats)
})

/* ───── Chargement initial ───── */
onMounted(() => contratsStore.charger())
</script>

<style scoped>
.pagination-bar {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  padding: 12px 0 4px;
  margin-top: 8px;
}

.pagination-btn {
  padding: 5px 11px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}
.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  color: #1e293b;
}
.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination-btn--active {
  font-weight: 700;
  color: #1e293b;
  border-color: #cbd5e1;
}
</style>
