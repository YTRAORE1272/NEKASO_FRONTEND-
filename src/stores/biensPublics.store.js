import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { biensPublicsService } from '@/services/biens-publics.service'
import { mockBiensPublics } from '@/services/mockData'

export const useBiensPublicsStore = defineStore('biensPublics', () => {
  // State
  const biens = ref([])
  const bienCourant = ref(null)
  const chargement = ref(false)
  const erreur = ref(null)

  // Getters
  const biensDisponibles = computed(() => biens.value.filter((b) => b.statut === 'disponible'))

  const biensEnVedette = computed(() =>
    biens.value.filter((b) => b.statut === 'disponible').slice(0, 3),
  )

  const totalBiens = computed(() => biens.value.length)

  // Actions
  async function chargerBiens(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      biens.value = await biensPublicsService.getAll(params)
    } catch (e) {
      console.warn('[biensPublics.store] erreur chargement, utilisation des mocks', e)
      // Fallback sur les données mock pour le locataire quand le backend est indisponible
      await new Promise((r) => setTimeout(r, 200))
      biens.value = mockBiensPublics
      erreur.value = 'Impossible de charger les biens depuis le serveur. Données locales affichées.'
    } finally {
      chargement.value = false
    }
  }

  async function chargerBienParId(id) {
    chargement.value = true
    erreur.value = null
    try {
      bienCourant.value = await biensPublicsService.getById(id)
    } catch (e) {
      console.warn('[biensPublics.store] erreur chargerBienParId, utilisation mock', e)
      await new Promise((r) => setTimeout(r, 120))
      bienCourant.value = mockBiensPublics.find((b) => String(b.id) === String(id)) || null
      if (!bienCourant.value) {
        erreur.value = 'Impossible de charger ce bien.'
      }
    } finally {
      chargement.value = false
    }
  }

  async function rechercher(filtres) {
    chargement.value = true
    erreur.value = null
    try {
      biens.value = await biensPublicsService.rechercher(filtres)
    } catch (e) {
      console.warn('[biensPublics.store] erreur recherche, utilisation mocks', e)
      // Retourne les mocks si le backend n'est pas disponible
      await new Promise((r) => setTimeout(r, 150))
      biens.value = mockBiensPublics
      erreur.value = 'Erreur lors de la recherche. Résultats locaux affichés.'
    } finally {
      chargement.value = false
    }
  }

  return {
    // State
    biens,
    bienCourant,
    chargement,
    erreur,
    // Getters
    biensDisponibles,
    biensEnVedette,
    totalBiens,
    // Actions
    chargerBiens,
    chargerBienParId,
    rechercher,
  }
})
