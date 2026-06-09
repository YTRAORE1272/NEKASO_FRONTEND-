/**
 * Service pour les biens publics (catalogue, landing, détail).
 * Utilise les données mock en attendant le backend Spring Boot.
 */
import { mockBiensPublics } from './mockData'

const simulerDelai = (ms = 400) => new Promise(r => setTimeout(r, ms))

export const biensPublicsService = {
  /**
   * Récupère tous les biens publics.
   * @returns {Promise<Array>} Liste des biens
   */
  async getAll() {
    await simulerDelai()
    return [...mockBiensPublics]
  },

  /**
   * Récupère un bien par son ID.
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    await simulerDelai(200)
    return mockBiensPublics.find(b => b.id === Number(id)) || null
  },

  /**
   * Recherche de biens avec filtres.
   * @param {Object} filtres - { type, quartier, recherche }
   * @returns {Promise<Array>}
   */
  async rechercher(filtres = {}) {
    await simulerDelai(300)
    let result = [...mockBiensPublics]

    if (filtres.type) {
      result = result.filter(b => b.type.toLowerCase() === filtres.type.toLowerCase())
    }
    if (filtres.quartier) {
      result = result.filter(b =>
        b.adresse?.quartier?.toLowerCase().includes(filtres.quartier.toLowerCase())
      )
    }
    if (filtres.recherche) {
      const q = filtres.recherche.toLowerCase()
      result = result.filter(b =>
        b.titre?.toLowerCase().includes(q) ||
        b.adresse?.quartier?.toLowerCase().includes(q) ||
        b.adresse?.ville?.toLowerCase().includes(q) ||
        b.type?.toLowerCase().includes(q)
      )
    }

    return result
  }
}
