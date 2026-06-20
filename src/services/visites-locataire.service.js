import api from './api'

/*
  demande-visite-controller (côté locataire)
  Le backend identifie le locataire via le token JWT (sub) — aucun id dans l'URL.
  - POST  /api/visites/locataire/bien/{idBien}       → créer une demande de visite
  - GET   /api/visites/locataire/mes_demandes        (statut?, page, size)
*/
export const visitesLocataireService = {
  // Demandes de visite du locataire connecté.
  getVisites: (params) => api.get('/visites/locataire/mes_demandes', { params }),

  // Le locataire demande une visite pour un bien.
  demander: (idBien) => api.post(`/visites/locataire/bien/${idBien}`),
}
