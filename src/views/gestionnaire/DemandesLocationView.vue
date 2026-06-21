<template>
  <div class="demandes-page">
    <div class="page-header">
      <h1 class="page-title">Demandes de location</h1>
      <p class="page-subtitle">
        Biens ayant reçu des demandes de réservation. Validez une demande par bien :
        les autres seront automatiquement annulées.
      </p>
    </div>

    <template v-if="groupes.length">
      <div class="tabs-container">
        <div class="tabs">
          <button
            v-for="section in sectionsParType"
            :key="section.type"
            class="tab"
            :class="{ active: typeActif === section.type }"
            @click="typeActif = section.type"
          >
            {{ section.libelle }}
            <span class="tab-badge">{{ section.items.length }}</span>
          </button>
        </div>
      </div>

      <div v-if="sectionActive" class="biens-grid">
        <button
          v-for="g in itemsPage"
          :key="g.bien.id"
          class="carte bien-carte"
          @click="ouvrir(g.bien.id)"
        >
          <div class="bien-photo">
            <img :src="photo(g.bien)" :alt="g.bien.intitule" />
            <span v-if="g.validee" class="badge badge--ok">Attribué</span>
            <span v-else class="badge badge--attente">{{ g.nbEnAttente }} demande(s)</span>
          </div>
          <div class="bien-info">
            <h3 class="bien-titre">{{ g.bien.intitule }}</h3>
            <p class="bien-adresse">{{ g.bien.adresse }}</p>
            <p class="bien-loyer">{{ formatMontant(g.bien.loyer) }} FCFA / mois</p>
          </div>
          <div class="bien-foot">
            <span v-if="g.prioritaireId" class="prio">
              Prioritaire (FIFO) : {{ nomPrioritaire(g) }}
            </span>
            <span class="voir">Voir les demandes →</span>
          </div>
        </button>
      </div>

      <Pagination v-model="page" :total-pages="totalPages" />
    </template>
    <div v-else class="carte vide">Aucune demande de location pour le moment.</div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'
import { useBiensStore } from '@/stores/biens.store'
import { useFormat } from '@/composables/useFormat'
import { usePagination } from '@/composables/usePagination'
import { nomComplet } from '@/utils/constants'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()
const store = useDemandesLocationStore()
const biensStore = useBiensStore()
const { formatMontant } = useFormat()

onMounted(() => {
  store.chargerDemandesBackend()
  if (!biensStore.biens.length) biensStore.charger()
})

const biensParId = computed(() => {
  const m = new Map()
  for (const b of biensStore.biens) m.set(Number(b.id), b)
  return m
})

const groupes = computed(() =>
  store.biensAvecDemandes
    .filter((g) => g.bien && (g.nbEnAttente > 0 || g.validee))
    .map((g) => {
      const reel = biensParId.value.get(Number(g.bien.id))
      return reel ? { ...g, bien: { ...g.bien, ...reel } } : g
    }),
)

const LIBELLES_TYPE = {
  APPARTEMENT: 'Appartements',
  STUDIO: 'Studios',
  CHAMBRE: 'Chambres',
  VILLA: 'Villas',
  MAISON: 'Maisons',
  LOCAL: 'Locaux commerciaux',
  MAGASIN: 'Magasins',
  BUREAU: 'Bureaux',
}

const sectionsParType = computed(() => {
  const parType = new Map()
  for (const g of groupes.value) {
    const type = (g.bien.typeBien || g.bien.type || 'AUTRE').toUpperCase()
    if (!parType.has(type)) parType.set(type, [])
    parType.get(type).push(g)
  }
  return Array.from(parType.entries())
    .map(([type, items]) => ({
      type,
      libelle: LIBELLES_TYPE[type] || (type === 'AUTRE' ? 'Autres' : type),
      items,
    }))
    .sort((a, b) => a.libelle.localeCompare(b.libelle, 'fr'))
})

const typeActif = ref(null)
const sectionActive = computed(
  () =>
    sectionsParType.value.find((s) => s.type === typeActif.value) ||
    sectionsParType.value[0] ||
    null,
)
watch(
  sectionsParType,
  (sections) => {
    if (!sections.some((s) => s.type === typeActif.value)) {
      typeActif.value = sections[0]?.type ?? null
    }
  },
  { immediate: true },
)

const itemsActifs = computed(() => sectionActive.value?.items || [])
const { page, totalPages, itemsPage } = usePagination(itemsActifs, 9)
watch(typeActif, () => {
  page.value = 1
})

function photo(bien) {
  return bien.photos?.[0]?.urlPhoto || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
}
function nomPrioritaire(g) {
  const d = g.demandesEnAttente[0]
  return d ? nomComplet(d.client) : '—'
}
function ouvrir(bienId) {
  router.push(`/gestionnaire/demandes-location/bien/${bienId}`)
}
</script>

<style scoped>
.demandes-page {
  padding: 0;
}
.tabs-container {
  margin-bottom: 20px;
}
.tabs {
  display: inline-flex;
  background: #fff;
  padding: 4px;
  border-radius: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  flex-wrap: wrap;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab.active {
  background: #1e293b;
  color: #fff;
}
.tab-badge {
  background: #e2e8f0;
  color: #475569;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}
.tab.active .tab-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.biens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.bien-carte {
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  border: none;
  font-family: inherit;
  transition: transform 0.15s, box-shadow 0.15s;
}
.bien-carte:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}
.bien-photo {
  position: relative;
  height: 150px;
}
.bien-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}
.badge--attente {
  background: #212d4d;
  color: #fff;
}
.badge--ok {
  background: #00d15a;
  color: #fff;
}
.bien-info {
  padding: 16px 18px 8px;
}
.bien-titre {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}
.bien-adresse {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
}
.bien-loyer {
  font-size: 14px;
  font-weight: 600;
  color: #212d4d;
}
.bien-foot {
  padding: 10px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.prio {
  font-size: 12px;
  color: #b45309;
  background: #fef3c7;
  border-radius: 6px;
  padding: 4px 8px;
  font-weight: 600;
  width: fit-content;
}
.voir {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.vide {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
}
</style>
