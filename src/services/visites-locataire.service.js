import api from './api'

export const visitesLocataireService = {
  async getVisites(params) {
    try {
      const res = await api.get('/visites/mes-demandes', { params })
      return res.data
    } catch (e) {
      throw e
    }
  },

  // Créer une demande de visite (locataire)
  // On n'envoie que les champs autorisés par le contrat : { idBien, idLocataire }
  demander: async (data) => {
    const payload = {
      idBien: Number(data.idBien),
      idLocataire: Number(data.idLocataire),
    }
    try {
      const res = await api.post('/visites/demander', payload)
      return res.data
    } catch (e) {
      throw e
    }
  },
}
