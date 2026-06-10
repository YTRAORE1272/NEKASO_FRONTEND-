import api from './api'

export const notificationsService = {
  getListe: (params) => api.get('/notifications', { params }),
  marquerLue: (id) => api.patch(`/notifications/${id}/lire`),
  toutLire: () => api.patch('/notifications/tout-lire'),
}
