import api from './api'

export const profilLocataireService = {
  async getProfil() {
    try {
      const res = await api.get('/locataire/profil')
      return res.data
    } catch (e) {
      throw e
    }
  },

  async updateProfil(data) {
    try {
      const res = await api.put('/locataire/profil', data)
      return { success: true, data: res.data }
    } catch (e) {
      throw e
    }
  },
}
