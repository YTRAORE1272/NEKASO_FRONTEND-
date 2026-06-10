import api from './api'

export const contratsLocataireService = {
  async getContratsActifs() {
    try {
      const res = await api.get('/contrats/mes-contrats')
      return res.data
    } catch (e) {
      throw e
    }
  },
}
