import { defineStore } from 'pinia'
import { ref } from 'vue'
import { visitesLocataireService } from '@/services/visites-locataire.service'

export const useVisitesLocataireStore = defineStore('visitesLocataire', () => {
  const visites = ref([])
  const chargement = ref(false)

  async function chargerVisites() {
    chargement.value = true
    try {
      visites.value = await visitesLocataireService.getVisites()
    } catch (e) {
      console.error(e)
    } finally {
      chargement.value = false
    }
  }

  return { visites, chargement, chargerVisites }
})
