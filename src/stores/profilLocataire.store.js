import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profilLocataireService } from '@/services/profil-locataire.service'

export const useProfilLocataireStore = defineStore('profilLocataire', () => {
  const profil = ref(null)
  const chargement = ref(false)

  async function chargerProfil() {
    chargement.value = true
    try {
      profil.value = await profilLocataireService.getProfil()
    } catch (e) {
      console.error(e)
    } finally {
      chargement.value = false
    }
  }

  async function updateProfil(data) {
    chargement.value = true
    try {
      const res = await profilLocataireService.updateProfil(data)
      if (res.success) {
        profil.value = { ...profil.value, ...data }
      }
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      chargement.value = false
    }
  }

  return { profil, chargement, chargerProfil, updateProfil }
})
