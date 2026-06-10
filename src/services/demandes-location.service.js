import api from './api'

export const demandesLocationService = {
  getListe: (params) => api.get('/demandes-location/gestionnaire', { params }),
  valider: (id, data) => api.patch(`/demandes-location/${id}/valider`, data),
  refuser: (id) => api.patch(`/demandes-location/${id}/refuser`),

  // Créer une demande de location (locataire)
  // On n'envoie que les champs autorisés par le contrat : { idBien, idLocataire }
  creer: async (data) => {
    const payload = {
      idBien: Number(data.idBien),
      idLocataire: Number(data.idLocataire),
    }
    try {
      const res = await api.post('/demandes-location/creer', payload)
      return res.data
    } catch (e) {
      throw e
    }
  },
}
