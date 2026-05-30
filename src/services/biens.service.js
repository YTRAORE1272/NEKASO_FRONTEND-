import api from './api'

export const biensService = {
  /**
   * GET /api/biens/gestionnaire
   * Récupère tous les biens du gestionnaire connecté.
   */
  getMesBiens: () => api.get('/biens/gestionnaire'),

  /**
   * POST /api/biens
   * Crée un nouveau bien avec photos (multipart/form-data).
   * @param {FormData} formData - Les données du bien + photos[]
   */
  creer: (formData) =>
    api.post('/biens', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * PUT /api/biens/{id}
   * Modifie un bien existant (multipart/form-data pour les nouvelles photos).
   * @param {number} id - Identifiant du bien
   * @param {FormData} formData - Champs à modifier + nouvelles photos
   */
  modifier: (id, formData) =>
    api.put(`/biens/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * PATCH /api/biens/{id}/archiver
   * Archive un bien (le rend invisible, l'historique est conservé).
   * @param {number} id - Identifiant du bien
   */
  archiver: (id) => api.patch(`/biens/${id}/archiver`),

  /**
   * DELETE /api/biens/{id}/photos/{photoId}
   * Supprime une photo spécifique d'un bien.
   * @param {number} bienId - Identifiant du bien
   * @param {number} photoId - Identifiant de la photo
   */
  supprimerPhoto: (bienId, photoId) =>
    api.delete(`/biens/${bienId}/photos/${photoId}`),
}