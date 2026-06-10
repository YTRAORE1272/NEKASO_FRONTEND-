import api from './api'

export const demandesLocataireService = {
  async getDemandes(params) {
    try {
      const res = await api.get('/demandes-location/mes-demandes', { params })
      return res.data
    } catch (e) {
      throw e
    }
  },
}
