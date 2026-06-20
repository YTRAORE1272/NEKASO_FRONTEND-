import api from './api'

/**
 * Service des paiements côté locataire.
 * Renvoie la réponse Axios brute ; le déballage (pageMeta) et le mapping (mapPaiements)
 * sont faits dans le store. Endpoints : paiement-controller.
 */
export const paiementsLocataireService = {
  /**
   * Historique paginé des paiements d'un contrat du locataire connecté.
   * GET /api/paiements/locataire/historiques-paiements/contrat/{contratId}
   * @param {number|string} contratId Identifiant du contrat
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<PaiementDTO>
   */
  getHistorique: (contratId, params) =>
    api.get(`/paiements/locataire/historiques-paiements/contrat/${contratId}`, { params }),
}
