import api from './api'

export const visitesService = {
  getListe: (params) => api.get('/visites/gestionnaire', { params }),
  approuver: (id) => api.patch(`/visites/${id}/approuver`),
  refuser: (id) => api.patch(`/visites/${id}/refuser`),
}
