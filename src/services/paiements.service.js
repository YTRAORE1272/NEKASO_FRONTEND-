import api from './api'

export const paiementsService = {
  getListe: (params) => api.get('/paiements/gestionnaire', { params }),
  enregistrer: (data) => api.post('/paiements', data),

  telechargerQuittance: (id) =>
    api.get(`/paiements/${id}/quittance`, {
      responseType: 'blob',
    }),
}
