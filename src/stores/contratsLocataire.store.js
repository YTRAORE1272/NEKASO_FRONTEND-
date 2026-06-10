import { defineStore } from 'pinia'
import { ref } from 'vue'
import { contratsLocataireService } from '@/services/contrats-locataire.service'

export const useContratsLocataireStore = defineStore('contratsLocataire', () => {
  const contratsActifs = ref([])
  const chargement = ref(false)

  async function chargerContratsActifs(params = {}) {
    chargement.value = true
    try {
      contratsActifs.value = await contratsLocataireService.getContratsActifs(params)
    } catch (e) {
      console.error(e)
    } finally {
      chargement.value = false
    }
  }

  return { contratsActifs, chargement, chargerContratsActifs }
})
