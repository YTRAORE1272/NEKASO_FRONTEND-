import api from './api'

/**
 * Service des contrats de bail côté locataire.
 * Renvoie la réponse Axios brute ; le déballage (pageMeta) et le mapping (mapContrats)
 * sont faits dans le store. Endpoint : contrat-bail-controller.
 */
export const contratsLocataireService = {
  /**
   * Liste paginée des contrats du locataire connecté.
   * GET /api/contrats/locataire/mes-contrats
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<ContratBailResponseDTO>
   */
  getContrats: (params) => api.get('/contrats/locataire/mes-contrats', { params }),
}
