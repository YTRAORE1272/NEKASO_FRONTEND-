import api from './api'

export const visitesLocataireService = {
  async getVisites() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 301,
            bien: {
              titre: 'Appartement familial',
              adresse: { quartier: 'Sacré-Cœur', ville: 'Dakar' },
              photos: [
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
              ],
            },
            dateVisite: '2026-06-15T14:30:00Z',
            statut: 'confirmee',
          },
        ])
      }, 500)
    })
  },

  // Créer une demande de visite (locataire)
  // Corps attendu : { idBien: number, idLocataire: number }
  demander: (data) => api.post('/visites/demander', data),
}
