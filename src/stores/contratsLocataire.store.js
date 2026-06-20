import { defineStore } from 'pinia'
import { ref } from 'vue'
import { contratsLocataireService } from '@/services/contrats-locataire.service'
import { pageMeta } from '@/utils/apiResponse'
import { mapContrats } from '@/services/mappers'

export const useContratsLocataireStore = defineStore('contratsLocataire', () => {
  const contratsActifs = ref([])
  const chargement = ref(false)

  async function chargerContratsActifs(params = {}) {
    chargement.value = true
    try {
      const res = await contratsLocataireService.getContrats(params)
      contratsActifs.value = mapContrats(pageMeta(res).items)
    } catch (e) {
      if (e?.response?.status === 404) contratsActifs.value = []
      else console.error(e)
    } finally {
      chargement.value = false
    }
  }

  return { contratsActifs, chargement, chargerContratsActifs }
})
