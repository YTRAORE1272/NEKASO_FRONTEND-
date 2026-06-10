<template>
  <div class="catalogue">
    <HeaderLocataire v-if="authStore.isAuthenticated && authStore.user?.role === 'LOCATAIRE'" />
    <HeaderPublic v-else />

    <div class="catalogue-content">
      <div class="container">
        <!-- HEADER -->
        <div class="catalogue-header">
          <h1 class="page-title">Biens à louer à Dakar</h1>
          <p class="page-subtitle">{{ filteredBiens.length }} logements trouvés</p>
        </div>

        <!-- FILTRES -->
        <FiltreCatalogue
          v-model:recherche="searchQuery"
          v-model:type-actif="selectedType"
        />

        <!-- GRILLE DE BIENS -->
        <div class="biens-grid" v-if="!biensStore.chargement && filteredBiens.length > 0">
          <CarteBienPublic
            v-for="bien in filteredBiens"
            :key="bien.id"
            :bien="bien"
          />
        </div>

        <!-- LOADING -->
        <div v-else-if="biensStore.chargement" class="empty-state">
          <ChargementSpinner message="Chargement des biens..." />
        </div>

        <!-- VIDE -->
        <div v-else class="empty-state">
          <MessageVide
            icone="🏠"
            titre="Aucun bien trouvé"
            message="Essayez de modifier vos critères de recherche."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBiensPublicsStore } from '@/stores/biensPublics.store'
import { useAuthStore } from '@/stores/auth.store'
import HeaderPublic from '@/components/layout/HeaderPublic.vue'
import HeaderLocataire from '@/components/layout/HeaderLocataire.vue'
import CarteBienPublic from '@/components/locataire/CarteBienPublic.vue'
import FiltreCatalogue from '@/components/locataire/FiltreCatalogue.vue'
import MessageVide from '@/components/common/MessageVide.vue'
import ChargementSpinner from '@/components/common/ChargementSpinner.vue'

const route = useRoute()
const biensStore = useBiensPublicsStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedType = ref(null)

onMounted(async () => {
  await biensStore.chargerBiens()

  // Pre-fill from query params
  if (route.query.q) {
    searchQuery.value = route.query.q
  }
  if (route.query.quartier) {
    searchQuery.value = route.query.quartier
  }
})

const filteredBiens = computed(() => {
  let result = [...biensStore.biens]

  // Filter by type
  if (selectedType.value) {
    result = result.filter(b =>
      b.type?.toLowerCase() === selectedType.value.toLowerCase()
    )
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b =>
      b.titre?.toLowerCase().includes(query) ||
      b.adresse?.quartier?.toLowerCase().includes(query) ||
      b.adresse?.ville?.toLowerCase().includes(query) ||
      b.type?.toLowerCase().includes(query)
    )
  }

  return result
})
</script>

<style scoped>
.catalogue {
  min-height: 100vh;
  background-color: #f9fafb;
}

.catalogue-content {
  padding: 40px 0 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── HEADER ── */
.catalogue-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 4px;
  letter-spacing: -0.3px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

/* ── GRILLE ── */
.biens-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
}

@media (max-width: 1024px) {
  .biens-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page-title {
    font-size: 24px;
  }

  .biens-grid {
    grid-template-columns: 1fr;
  }
}
</style>
