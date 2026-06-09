export const paiementsLocataireService = {
  async getHistorique() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 401,
            montant: 450000,
            datePaiement: '2026-05-02',
            mois: 'Mai 2026',
            methode: 'ORANGE_MONEY',
            statut: 'PAYE',
            bien: { titre: 'Appartement moderne - Vue sur mer' }
          }
        ])
      }, 500)
    })
  }
}
