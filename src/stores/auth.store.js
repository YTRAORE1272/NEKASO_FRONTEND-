import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { mockUser } from '@/services/mockData'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('nekaso_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('nekaso_user') || 'null'))
  const isLoading = ref(false)
  const error = ref(null)
  
  // Contexte pour la reprise d'action post-authentification (ex: visite ou location)
  const pendingAction = ref(JSON.parse(localStorage.getItem('nekaso_pending_action') || 'null'))

  const utilisateurCourant = computed(() => user.value ?? mockUser)
  const isAuthenticated = computed(() => !!token.value)
  const nomComplet = computed(() => (user.value ? `${user.value.prenom} ${user.value.nom}` : ''))
  const isGestionnaire = computed(() => user.value?.role === 'GESTIONNAIRE')

  /**
   * Connecter un gestionnaire avec son téléphone et mot de passe.
   * Appelle le backend NEKASO via authService.
   *
   * @param {string} telephone - Numéro de téléphone (ex: "771234567")
   * @param {string} motDePasse - Mot de passe
   *
   * Selon le contrat API :
   * - Réponse 200 : stocke le token et les infos utilisateur
   * - Réponse 401 : authentification échouée
   * - Réponse 400 : champs obligatoires manquants
   */
  async function login(telephone, motDePasse) {
    isLoading.value = true
    error.value = null

    try {
      // Appel au backend NEKASO
      const response = await authService.login(telephone, motDePasse)

      // Réponse 200 : extraction du token et user
      const { token: newToken, user: newUser } = response

      // Stockage en mémoire (ref Pinia)
      token.value = newToken
      user.value = newUser

      // Stockage persistant (localStorage)
      localStorage.setItem('nekaso_token', newToken)
      localStorage.setItem('nekaso_user', JSON.stringify(newUser))

      return { success: true, user: newUser }
    } catch (err) {
      // Gestion des erreurs selon le contrat API
      let errorMessage = "Une erreur inconnue s'est produite"

      if (err.response?.status === 401) {
        errorMessage = 'Téléphone ou mot de passe incorrect'
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Champs obligatoires manquants'
      } else if (err.response?.status === 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.'
      } else if (!err.response) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
      }

      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Inscription d'un nouveau locataire.
   */
  async function register(nom, telephone, motDePasse) {
    isLoading.value = true
    error.value = null

    try {
      // Mock d'inscription
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            id: Date.now(),
            nom: nom,
            prenom: '',
            role: 'LOCATAIRE',
            telephone: telephone,
            statut: 'ACTIF',
          }
          const newToken = 'fake-jwt-token-new-locataire'
          
          token.value = newToken
          user.value = newUser
          localStorage.setItem('nekaso_token', newToken)
          localStorage.setItem('nekaso_user', JSON.stringify(newUser))
          
          isLoading.value = false
          resolve({ success: true, user: newUser })
        }, 1500)
      })
    } catch (err) {
      isLoading.value = false
      return { success: false, error: 'Erreur lors de l\'inscription' }
    }
  }

  /**
   * Déconnecter l'utilisateur actuel.
   * Supprime le token et les infos utilisateur du localStorage et de la mémoire.
   */
  function logout() {
    token.value = null
    user.value = null
    error.value = null
    localStorage.removeItem('nekaso_token')
    localStorage.removeItem('nekaso_user')
    clearPendingAction()
  }

  function setPendingAction(action) {
    pendingAction.value = action
    localStorage.setItem('nekaso_pending_action', JSON.stringify(action))
  }

  function clearPendingAction() {
    pendingAction.value = null
    localStorage.removeItem('nekaso_pending_action')
  }

  return {
    token,
    user,
    utilisateurCourant,
    isAuthenticated,
    nomComplet,
    isGestionnaire,
    isLoading,
    error,
    login,
    register,
    logout,
    pendingAction,
    setPendingAction,
    clearPendingAction
  }
})
