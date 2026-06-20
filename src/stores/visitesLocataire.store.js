import { defineStore } from 'pinia'
import { ref } from 'vue'
import { visitesLocataireService } from '@/services/visites-locataire.service'
import { listeOuVide } from '@/utils/apiResponse'

export const useVisitesLocataireStore = defineStore('visitesLocataire', () => {
  const visites = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  /**
   * GET /api/visites/locataire/mes_demandes
   * Retourne une liste vide si 404 (aucune demande).
   */
  async function chargerVisites(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      visites.value = await listeOuVide(visitesLocataireService.getVisites(params))
    } catch (e) {
      erreur.value = 'Impossible de charger les visites.'
      console.error('Erreur chargement visites locataire:', e?.response?.status, e?.response?.data)
    } finally {
      chargement.value = false
    }
  }

  /**
   * POST /api/visites/locataire/bien/{idBien}
   * Lance une demande de visite pour le bien indiqué et recharge la liste.
   */
  async function demander(idBien) {
    const res = await visitesLocataireService.demander(idBien)
    await chargerVisites()
    return res
  }

  return { visites, chargement, erreur, chargerVisites, demander }
})
