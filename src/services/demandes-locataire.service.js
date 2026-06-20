import api from './api'

/**
 * Service des demandes de location côté locataire.
 * Renvoie la réponse Axios brute ; le déballage et le mapping (mapDemandesLocation)
 * sont faits dans le store. Endpoints : demande-location-controller.
 */
export const demandesLocataireService = {
  /**
   * Liste paginée des demandes de location du locataire connecté.
   * GET /api/demandes/locataire
   * @param {{ statut?: string, page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<DemandeLocationDTO>
   */
  getDemandes: (params) => api.get('/demandes/locataire', { params }),

  /**
   * Crée une demande de location pour un bien donné.
   * POST /api/demandes/locataire/bien/{idBien}
   * @param {number|string} idBien Identifiant du bien
   * @returns {Promise<import('axios').AxiosResponse>} DemandeLocationDTO
   */
  creer: (idBien) => api.post(`/demandes/locataire/bien/${idBien}`),

  /**
   * Met à jour le statut d'une demande de location (ex. annulation par le locataire).
   * PATCH /api/demandes/locataire/demande/{idDemande}/statut/{statut}
   * @param {number|string} idDemande Identifiant de la demande
   * @param {string} statut Nouveau statut
   * @returns {Promise<import('axios').AxiosResponse>} DemandeLocationDTO
   */
  changerStatut: (idDemande, statut) =>
    api.patch(`/demandes/locataire/demande/${idDemande}/statut/${statut}`),
}
