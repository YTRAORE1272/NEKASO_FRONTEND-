import api from './api'
import { visitesService } from './visites.service'
import { mapDashboardDTO } from '@/utils/dashboard.mapper'
import { unwrap, pageMeta } from '@/utils/apiResponse'

/**
 * Service du tableau de bord gestionnaire.
 * Agrège le DTO analytique backend et la liste des visites en attente,
 * puis renvoie un objet déjà mis en forme pour le store (via mapDashboardDTO).
 * Endpoints : Dashboard Management + demande-visite-controller.
 */
export const dashboardService = {
  /**
   * Charge l'ensemble des KPIs du tableau de bord d'un gestionnaire.
   * GET /api/v1/dashboard/gestionnaire/{gestionnaireId}
   * @param {number|string} gestionnaireId Identifiant du gestionnaire connecté
   * @returns {Promise<object>} Statistiques prêtes pour le store
   */
  async load(gestionnaireId) {
    if (gestionnaireId == null) {
      throw new Error('gestionnaireId manquant pour charger le tableau de bord')
    }
    const dashboardRes = await api.get(`/v1/dashboard/gestionnaire/${gestionnaireId}`)
    let visites = []
    try {
      const visitesRes = await visitesService.getListe({ page: 0, size: 100 })
      visites = pageMeta(visitesRes).items
    } catch {
      visites = []
    }
    return mapDashboardDTO(unwrap(dashboardRes), visites)
  },
}
