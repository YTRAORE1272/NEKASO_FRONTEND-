import api from './api'

export const demandesLocationService = {
  getListe: () => api.get('/demandes-location/gestionnaire'),
  valider: (id, data) => api.patch(`/demandes-location/${id}/valider`, data),
  refuser: (id) => api.patch(`/demandes-location/${id}/refuser`),

  // Créer une demande de location (locataire)
  // Corps attendu : { idBien: number, idLocataire: number }
  creer: (data) => api.post('/demandes-location/creer', data),
}
