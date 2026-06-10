import api from './api'

export const demandesLocataireService = {
  async getDemandes() {
    try {
      const res = await api.get('/demandes-location/mes-demandes')
      return res.data
    } catch (e) {
      throw e
    }
  },
}
