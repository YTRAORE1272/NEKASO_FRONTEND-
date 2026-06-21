import api from './api'

/**
 * Service des contrats de bail (interfaces gestionnaire & locataire).
 * Renvoie la réponse Axios brute ; déballage/mapping faits dans le store.
 * Endpoints : contrat-bail-controller.
 */
export const contratsService = {
  /**
   * Crée un contrat définitif à partir d'un pré-contrat validé.
   * POST /api/contrats/gestionnaire/creer
   * @param {number|string} preContratId Identifiant du pré-contrat
   * @returns {Promise<import('axios').AxiosResponse>} ContratBailResponseDTO
   */
  creer: (preContratId) => api.post('/contrats/gestionnaire/creer', { preContratId }),

  /**
   * Liste paginée des contrats du locataire connecté.
   * GET /api/contrats/locataire/mes-contrats
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<ContratBailResponseDTO>
   */
  getParLocataire: (params) =>
    api.get('/contrats/locataire/mes-contrats', { params }),

  /**
   * Liste paginée des contrats du gestionnaire connecté.
   * GET /api/contrats/gestionnaire/mes-contrats
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<ContratBailResponseDTO>
   */
  getParGestionnaire: (params) =>
    api.get('/contrats/gestionnaire/mes-contrats', { params }),

  /**
   * Le gestionnaire demande la rupture d'un contrat actif (passe en attente de réponse du locataire).
   * PATCH /api/contrats/gestionnaire/{id}/demander-rupture
   * @param {number|string} id Identifiant du contrat
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  demanderRupture: (id) => api.patch(`/contrats/gestionnaire/${id}/demander-rupture`),

  /**
   * Le locataire accepte la rupture demandée par le gestionnaire.
   * PATCH /api/contrats/locataire/{id}/accepter-rupture
   * @param {number|string} id Identifiant du contrat
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  accepterRupture: (id) => api.patch(`/contrats/locataire/${id}/accepter-rupture`),

  /**
   * Le locataire refuse la rupture demandée par le gestionnaire.
   * PATCH /api/contrats/locataire/{id}/refuser-rupture
   * @param {number|string} id Identifiant du contrat
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  refuserRupture: (id) => api.patch(`/contrats/locataire/${id}/refuser-rupture`),
}

