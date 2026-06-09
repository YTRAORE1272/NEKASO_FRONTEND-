import { defineStore } from 'pinia'
import { ref } from 'vue'
import { contratsLocataireService } from '@/services/contrats-locataire.service'

export const useContratsLocataireStore = defineStore('contratsLocataire', () => {
  const contratsActifs = ref([])
  const chargement = ref(false)

  async function chargerContratsActifs() {
    chargement.value = true
    try {
      contratsActifs.value = await contratsLocataireService.getContratsActifs()
    } catch (e) {
      console.error(e)
    } finally {
      chargement.value = false
    }
  }

  return { contratsActifs, chargement, chargerContratsActifs }
})
