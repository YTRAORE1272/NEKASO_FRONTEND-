import { defineStore } from 'pinia'
import { ref } from 'vue'
import { demandesLocataireService } from '@/services/demandes-locataire.service'

export const useDemandesLocataireStore = defineStore('demandesLocataire', () => {
  const demandes = ref([])
  const chargement = ref(false)

  async function chargerDemandes(params = {}) {
    chargement.value = true
    try {
      demandes.value = await demandesLocataireService.getDemandes(params)
    } catch (e) {
      console.error(e)
    } finally {
      chargement.value = false
    }
  }

  return { demandes, chargement, chargerDemandes }
})
