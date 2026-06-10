import api from './api'

export const paiementsLocataireService = {
  async getHistorique() {
    try {
      const res = await api.get('/paiements/mes-paiements')
      return res.data
    } catch (e) {
      throw e
    }
  },

  telechargerQuittance: (id) => api.get(`/paiements/${id}/quittance`, { responseType: 'blob' }),
}
