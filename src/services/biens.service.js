import api from './api'

/**
 * Service des biens immobiliers (interface gestionnaire + catalogue locataire).
 * Chaque méthode renvoie la réponse Axios brute ; le déballage (pageMeta/unwrapList)
 * et le mapping (mapBiens) sont faits dans le store appelant.
 * Endpoints : bien-immobilier-controller (OpenAPI Gesimmo Nekaso).
 */
export const biensService = {
  /**
   * Liste paginée de TOUS les biens du système (vue gestionnaire), filtrable.
   * GET /api/biens/gestionnaire
   * @param {{ statut?: string, type?: string, page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<BienImmobilierResponseDTOGes>
   */
  getGestionnaireBiens: (params) => api.get('/biens/gestionnaire', { params }),

  /**
   * Liste paginée des biens du gestionnaire connecté.
   * GET /api/biens/gestionnaire/mes-biens
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<BienImmobilierResponseDTOGes>
   */
  getMesBiens: (params) => api.get('/biens/gestionnaire/mes-biens', { params }),

  /**
   * Catalogue public : biens disponibles à la location.
   * GET /api/biens/locataire/biens_disponibles
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<BienImmobilierResponseDTOGes>
   */
  getDisponibles: (params) => api.get('/biens/locataire/biens_disponibles', { params }),

  /**
   * Création d'un bien (multipart). Champs attendus : typeBien, libelle, adresse,
   * surface, nombrePieces, loyer, description, photos (append 'photos' sans crochets).
   * POST /api/biens/gestionnaire/create
   * @param {FormData} formData BienImmobilierForm
   * @returns {Promise<import('axios').AxiosResponse>} BienImmobilierCreateDTO
   */
  creer: (formData) => api.post('/biens/gestionnaire/create', formData),

  /**
   * Mise à jour d'un bien (multipart). Accepte en plus statutBien et jusqu'à 5 photos.
   * PATCH /api/biens/gestionnaire/update-bien/{id}
   * @param {number|string} id Identifiant du bien
   * @param {FormData} formData BienImmobilierUpdateForm
   * @returns {Promise<import('axios').AxiosResponse>} BienImmobilierCreateDTO
   */
  modifier: (id, formData) => api.patch(`/biens/gestionnaire/update-bien/${id}`, formData),
}
