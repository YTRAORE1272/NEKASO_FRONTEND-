import api from './api'

/**
 * Service des agents immobiliers (interface gestionnaire).
 * Renvoie la réponse Axios brute ; le déballage est fait dans le store.
 * Endpoint : agent-controller.
 */
export const agentsService = {
  /**
   * Création d'un agent rattaché au gestionnaire connecté (déduit du token).
   * POST /api/agents/gestionnaire/create
   * @param {{ nom: string, prenom: string, telephone: string }} payload AgentImmoCreateRequestDto
   * @returns {Promise<import('axios').AxiosResponse>} AgentImmocreateResponseDto { id, nom, prenom, telephone }
   */
  creer: (payload) => api.post('/agents/gestionnaire/create', payload),

  /**
   * Liste paginée des agents du gestionnaire connecté.
   * GET /api/agents/gestionnaire/mes_agents
   * @param {{ page?: number, size?: number }} [params]
   * @returns {Promise<import('axios').AxiosResponse>} PageResponse<AgentListDto { nom, prenom, telephone }>
   */
  getListe: (params) => api.get('/agents/gestionnaire/mes_agents', { params }),
}
