import api from './api'

export const contratsLocataireService = {
  async getContratsActifs(params) {
    try {
      const res = await api.get('/contrats/mes-contrats', { params })
      return res.data
    } catch (e) {
      throw e
    }
  },
}
