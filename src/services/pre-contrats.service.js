import api from './api'

/**
 * Service des pré-contrats (interfaces gestionnaire + locataire).
 * Renvoie la réponse Axios brute ; le déballage et le mapping (mapPreContrats)
 * sont faits dans le store. Endpoints : pre-contrat-controller.
 */
export const preContratsService = {
  /**
   * Création d'un pré-contrat par le gestionnaire.
   * POST /api/pre-contrats/gestionnaire/create
   * @param {object} payload PreContratRequestDTO { dateDebutPrevu, jourEcheancePaiement, conditions, demandeLocationId, demandeVisiteId }
   * @returns {Promise<import('axios').AxiosResponse>} PreContratResponseDTO
   */
  creer: (payload) => api.post('/pre-contrats/gestionnaire/create', payload),

  /**
   * Validation du pré-contrat par le locataire.
   * PATCH /api/pre-contrats/locataire/statut/{id}/valider
   * @param {number|string} id Identifiant du pré-contrat
   * @returns {Promise<import('axios').AxiosResponse>} PreContratResponseDTO
   */
  valider: (id) => api.patch(`/pre-contrats/locataire/statut/${id}/valider`),

  /**
   * Invalidation (refus) du pré-contrat par le locataire.
   * PATCH /api/pre-contrats/locataire/statut/{id}/invalider
   * @param {number|string} id Identifiant du pré-contrat
   * @returns {Promise<import('axios').AxiosResponse>} PreContratResponseDTO
   */
  invalider: (id) => api.patch(`/pre-contrats/locataire/statut/${id}/invalider`),

  /**
   * Modification du pré-contrat par le gestionnaire.
   * PATCH /api/pre-contrats/gestionnaire/statut/{id}/modifier
   * @param {number|string} id Identifiant du pré-contrat
   * @param {object} [payload] PreContratUpdateRequestDTO { conditions, jourEcheancePaiement, dateDebutPrevu }
   * @returns {Promise<import('axios').AxiosResponse>} PreContratResponseDTO
   */
  modifier: (id, payload = {}) =>
    api.patch(`/pre-contrats/gestionnaire/statut/${id}/modifier`, payload),

  /**
   * Liste paginée des pré-contrats du locataire connecté.
   * GET /api/pre-contrats/locataire
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<PreContratResponseDTO>
   */
  getParLocataire: (params) => api.get('/pre-contrats/locataire', { params }),

  /**
   * Liste paginée des pré-contrats du gestionnaire connecté.
   * GET /api/pre-contrats/gestionnaire
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<PreContratResponseDTO>
   */
  getParGestionnaire: (params) => api.get('/pre-contrats/gestionnaire', { params }),
}
