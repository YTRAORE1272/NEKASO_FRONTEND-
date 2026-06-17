import api from './api'

// Endpoints réels disponibles côté backend :
// GET    /api/demandes/gestionnaire
// POST   /api/demandes/locataire/{id_Locataire}/bien/{id_Bien}
// GET    /api/demandes/locataire/{id_Locataire}
// PATCH  /api/demandes/demande/{id_Demande}/accepter
// PATCH  /api/demandes/demande/{id_Demande}/refuser
// PATCH  /api/demandes/demande/{id_Demande}/annuler

export const demandesLocationService = {
  getListe: (params = {}) => {
    // Le backend attend des statuts. On envoie par défaut la liste complète
    const defaultStatuts = ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'ANNULEE']

    // Normalise et extrait les valeurs de statut si l'appelant en fournit
    const requestParams = { ...params }
    let statutValues = null
    if (requestParams.statut != null) {
      const v = requestParams.statut
      if (Array.isArray(v)) statutValues = v
      else if (typeof v === 'string' && v.includes(','))
        statutValues = v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      else statutValues = [String(v)]
      delete requestParams.statut
    } else if (requestParams.statuts != null) {
      const v = requestParams.statuts
      if (Array.isArray(v)) statutValues = v
      else if (typeof v === 'string' && v.includes(','))
        statutValues = v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      else statutValues = [String(v)]
      delete requestParams.statuts
    } else if (requestParams.status != null) {
      const v = requestParams.status
      if (Array.isArray(v)) statutValues = v
      else if (typeof v === 'string' && v.includes(','))
        statutValues = v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      else statutValues = [String(v)]
      delete requestParams.status
    } else {
      statutValues = defaultStatuts
    }

    // Construit la query string en répétant la clé `statut` pour chaque valeur
    const parts = []
    Object.entries(requestParams).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      if (Array.isArray(v)) {
        v.forEach((item) => parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(item)}`))
      } else {
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      }
    })

    statutValues.forEach((s) => parts.push(`statut=${encodeURIComponent(s)}`))

    const qs = parts.length ? `?${parts.join('&')}` : ''
    return api.get(`/demandes/gestionnaire${qs}`)
  },
  valider: (id) => api.patch(`/demandes/demande/${id}/accepter`),
  refuser: (id) => api.patch(`/demandes/demande/${id}/refuser`),
  annuler: (id) => api.patch(`/demandes/demande/${id}/annuler`),
  creer: (idLocataire, idBien) => api.post(`/demandes/locataire/${idLocataire}/bien/${idBien}`),
}
