import api from './api'

/**
 * Service des paiements (interface gestionnaire).
 * Renvoie la réponse Axios brute ; le déballage (pageMeta) et le mapping (mapPaiements)
 * sont faits dans le store. Endpoints : paiement-controller.
 */
export const paiementsService = {
  /**
   * Enregistre un paiement pour un contrat, un mois et un mode de paiement donnés.
   * POST /api/paiements/gestionnaire/create/{idContrat}/{mois}/{methodePaiement}
   * @param {number|string} idContrat Identifiant du contrat
   * @param {string} mois Mois concerné
   * @param {string} methodePaiement ORANGE_MONEY | WAVE | ESPECES | VIREMENT...
   * @param {object} [paiement] Corps PaiementDTO optionnel (montant, reference, datePaiement...)
   * @returns {Promise<import('axios').AxiosResponse>} PaiementDTO
   */
  enregistrer: (idContrat, mois, methodePaiement, paiement = {}) =>
    api.post(
      `/paiements/gestionnaire/create/${idContrat}/${encodeURIComponent(mois)}/${encodeURIComponent(methodePaiement)}`,
      paiement,
    ),

  /**
   * Historique paginé des paiements d'un contrat (gestionnaire).
   * GET /api/paiements/gestionnaire/historiques-paiements/contrat/{contratId}
   * @param {number|string} contratId Identifiant du contrat
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<PaiementDTO>
   */
  getHistorique: (contratId, params) =>
    api.get(`/paiements/gestionnaire/historiques-paiements/contrat/${contratId}`, { params }),
}
