import api from './api'
import { unwrapList } from '@/utils/apiResponse'
import { mapBien, mapBiens } from './mappers'

/**
 * Service du catalogue public des biens (interface locataire / visiteur).
 * Exception au pattern « réponse brute » : ce service déballe et mappe directement
 * (catalogue lu de plusieurs vues publiques). Endpoint : bien-immobilier-controller.
 */
export const biensPublicsService = {
  /**
   * Récupère les biens disponibles à la location (déjà mappés).
   * GET /api/biens/locataire/biens_disponibles
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<Array>} Liste de biens mappés
   */
  async getAll(params = {}) {
    const res = await api.get('/biens/locataire/biens_disponibles', { params })
    return mapBiens(unwrapList(res))
  },

  /**
   * Récupère un bien par son id en filtrant le catalogue disponible
   * (aucun endpoint « bien par id » n'existe dans la spec).
   * @param {number|string} id Identifiant du bien
   * @returns {Promise<object|null>} Bien mappé ou null
   */
  async getById(id) {
    const liste = await this.getAll({ page: 0, size: 200 })
    return liste.find((b) => String(b.id) === String(id)) || null
  },

  /**
   * Alias de getAll pour la recherche/filtrage du catalogue.
   * @param {object} [params]
   * @returns {Promise<Array>} Liste de biens mappés
   */
  async rechercher(params = {}) {
    return this.getAll(params)
  },

  mapBien,
}
