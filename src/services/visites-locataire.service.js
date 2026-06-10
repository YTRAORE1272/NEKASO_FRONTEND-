import api from './api'

export const visitesLocataireService = {
  async getVisites() {
    try {
      const res = await api.get('/visites/mes-demandes')
      return res.data
    } catch (e) {
      throw e
    }
  },

  // Créer une demande de visite (locataire)
  // Corps attendu : { idBien: number, idLocataire: number }
  demander: (data) => api.post('/visites/demander', data),
}
