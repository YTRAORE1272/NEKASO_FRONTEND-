export const demandesLocataireService = {
  async getDemandes() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 201,
            bien: {
              titre: 'Studio meublé centre-ville',
              adresse: { quartier: 'Plateau', ville: 'Dakar' },
              photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop']
            },
            dateEntree: '2026-07-01',
            duree: 12,
            dateCreation: '2026-06-05',
            statut: 'en_attente'
          }
        ])
      }, 500)
    })
  }
}
