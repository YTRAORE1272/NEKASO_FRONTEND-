import { defineStore } from 'pinia'
import { ref } from 'vue'
import { paiementsLocataireService } from '@/services/paiements-locataire.service'

export const usePaiementsLocataireStore = defineStore('paiementsLocataire', () => {
  const paiements = ref([])
  const chargement = ref(false)

  async function chargerHistorique(params = {}) {
    chargement.value = true
    try {
      paiements.value = await paiementsLocataireService.getHistorique(params)
    } catch (e) {
      console.error(e)
    } finally {
      chargement.value = false
    }
  }

  return { paiements, chargement, chargerHistorique }
})
