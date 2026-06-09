export const contratsLocataireService = {
  async getContratsActifs() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 101,
            bien: {
              titre: 'Appartement moderne - Vue sur mer',
              adresse: { quartier: 'Almadies', ville: 'Dakar' },
              photos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop']
            },
            loyer: 450000,
            dateFin: '2027-01-15'
          }
        ])
      }, 500)
    })
  }
}
