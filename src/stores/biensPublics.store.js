import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { biensPublicsService } from '@/services/biens-publics.service'

export const useBiensPublicsStore = defineStore('biensPublics', () => {
  // State
  const biens = ref([])
  const bienCourant = ref(null)
  const chargement = ref(false)
  const erreur = ref(null)

  // Getters
  const biensDisponibles = computed(() =>
    biens.value.filter(b => b.statut === 'disponible')
  )

  const biensEnVedette = computed(() =>
    biens.value.filter(b => b.statut === 'disponible').slice(0, 3)
  )

  const totalBiens = computed(() => biens.value.length)

  // Actions
  async function chargerBiens() {
    chargement.value = true
    erreur.value = null
    try {
      biens.value = await biensPublicsService.getAll()
    } catch (e) {
      erreur.value = 'Impossible de charger les biens.'
      console.error('[biensPublics.store] chargerBiens:', e)
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
      erreur.value = 'Impossible de charger ce bien.'
      console.error('[biensPublics.store] chargerBienParId:', e)
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
      erreur.value = 'Erreur lors de la recherche.'
      console.error('[biensPublics.store] rechercher:', e)
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
