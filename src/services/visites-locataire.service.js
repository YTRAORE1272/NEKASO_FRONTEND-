import api from './api'

/**
 * Service des demandes de visite côté locataire.
 * Renvoie la réponse Axios brute ; le déballage et le mapping (mapVisites)
 * sont faits dans le store. Endpoints : demande-visite-controller.
 */
export const visitesLocataireService = {
  /**
   * Liste paginée des demandes de visite du locataire connecté.
   * GET /api/visites/locataire/mes_demandes
   * @param {{ statut?: string, page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<DemandeVisiteDTOList>
   */
  getVisites: (params) => api.get('/visites/locataire/mes_demandes', { params }),

  /**
   * Crée une demande de visite pour un bien donné.
   * POST /api/visites/locataire/bien/{idBien}
   * @param {number|string} idBien Identifiant du bien
   * @returns {Promise<import('axios').AxiosResponse>} CreationRequestResponse
   */
  demander: (idBien) => api.post(`/visites/locataire/bien/${idBien}`),

  /**
   * Clôture d'une visite par le locataire après la visite (statut → TERMINEE).
   * PATCH /api/visites/locataire/demande/{idDemande}/cloturer?choix=AVEC_CONTRAT|SANS_CONTRAT
   * Pour AVEC_CONTRAT, le corps PreContratRequestDTO est requis : le backend crée le pré-contrat.
   * Pour SANS_CONTRAT, un corps vide suffit.
   * @param {number|string} idDemande Identifiant de la demande de visite
   * @param {'AVEC_CONTRAT'|'SANS_CONTRAT'} choix
   * @param {object} [payload] PreContratRequestDTO { dateDebutPrevu, jourEcheancePaiement, conditions }
   * @returns {Promise<import('axios').AxiosResponse>} CreationRequestResponse
   */
  cloturer: (idDemande, choix, payload = {}) =>
    api.patch(`/visites/locataire/demande/${idDemande}/cloturer`, payload, { params: { choix } }),
}
