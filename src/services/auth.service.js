import api from './api'

/*
  SERVICE D'AUTHENTIFICATION
  
  Ce service gère la communication avec les endpoints /auth
  du backend Spring Boot NEKASO.
  
  Contrat API :
  - POST /api/auth/login
  - Authentification requise : NON
  - Réponse 200 : { token, user: { id, nom, prenom, role, telephone, statut, dateCreation } }
  - Réponse 401 : { message: "Téléphone ou mot de passe incorrect" }
  - Réponse 400 : { message: "Les champs téléphone et motDePasse sont obligatoires" }
*/

export const authService = {
  /**
   * Connecter un gestionnaire avec son téléphone et mot de passe.
   *
   * @param {string} telephone - Numéro de téléphone du gestionnaire (ex: "771234567")
   * @param {string} motDePasse - Mot de passe du gestionnaire
   *
   * @returns {Promise<Object>} Réponse du serveur contenant le token et les infos utilisateur
   *   - token: string (JWT token à stocker)
   *   - user: Object (id, nom, prenom, role, telephone, statut, dateCreation)
   *
   * @throws {Error} Erreur 400 si champs manquants
   * @throws {Error} Erreur 401 si identifiants incorrects
   * @throws {Error} Erreur réseau si serveur injoignable
   */
  login: (telephone, motDePasse) => {
    // Validation minimale côté client
    if (!telephone || !motDePasse) {
      return Promise.reject(new Error('Le téléphone et le mot de passe sont obligatoires'))
    }

    // --- MOCK CONNEXION POUR LE DÉVELOPPEMENT ---
    // Si on utilise le numéro de test, on simule un succès sans appeler le backend
    if (telephone === '771234567') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: 'fake-jwt-token-pour-le-developpement-ui',
            user: {
              id: 1,
              nom: 'Sarr',
              prenom: 'Awa',
              role: 'GESTIONNAIRE',
              telephone: '771234567',
              statut: 'ACTIF',
            }
          })
        }, 1000) // 1 seconde de faux chargement pour voir le loader
      })
    }
    // --------------------------------------------

    // Appel API au backend (si ce n'est pas le compte de test)
    return api
      .post('/auth/login', {
        telephone,
        motDePasse,
      })
      .then((response) => response.data)
  },
}
