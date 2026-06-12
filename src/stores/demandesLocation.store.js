import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demandesLocationService } from '@/services/demandes-location.service'
import { mockDemandesLocation } from '@/services/mockData'

export const useDemandesLocationStore = defineStore('demandesLocation', () => {
  const demandes = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  const enAttente = computed(() => demandes.value.filter((d) => d.statut === 'EN_ATTENTE'))
  const validees = computed(() => demandes.value.filter((d) => d.statut === 'VALIDEE'))
  const refusees = computed(() => demandes.value.filter((d) => d.statut === 'REFUSEE'))

  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      const res = await demandesLocationService.getListe()
      demandes.value = res.data
    } catch (e) {
      console.warn('Erreur chargement demandes-location, utilisation des mocks', e)
      // Fallback mock
      await new Promise((r) => setTimeout(r, 400))
      demandes.value = mockDemandesLocation
      erreur.value =
        'Impossible de charger les demandes de location depuis le serveur. Données locales affichées.'
    } finally {
      chargement.value = false
    }
  }

  async function valider(id, data) {
    try {
      await demandesLocationService.valider(id, data || {})
    } catch (e) {
      console.warn('Erreur API valider demande, mise à jour locale', e)
    }
    demandes.value = demandes.value.map((d) => (d.id === id ? { ...d, statut: 'VALIDEE' } : d))
  }

  async function refuser(id) {
    try {
      await demandesLocationService.refuser(id)
    } catch (e) {
      console.warn('Erreur API refuser demande, mise à jour locale', e)
    }
    demandes.value = demandes.value.map((d) => (d.id === id ? { ...d, statut: 'REFUSEE' } : d))
  }

  return { demandes, chargement, erreur, enAttente, validees, refusees, charger, valider, refuser }
})
