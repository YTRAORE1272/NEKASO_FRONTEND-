import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { mockUser } from '@/services/mockData'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('nekaso_token') || null)
  const storedUser = JSON.parse(localStorage.getItem('nekaso_user') || 'null')
  const user = ref(storedUser)

  const utilisateurCourant = computed(() => user.value ?? mockUser)
  const isAuthenticated = computed(() => !!token.value)
  const nomComplet = computed(() => {
    const u = utilisateurCourant.value
    return u ? `${u.prenom} ${u.nom}` : ''
  })
  const isGestionnaire = computed(() => utilisateurCourant.value?.role === 'GESTIONNAIRE')

  async function login(telephone, motDePasse) {
    const res = await authService.login({ telephone, motDePasse })
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('nekaso_token', token.value)
    localStorage.setItem('nekaso_user', JSON.stringify(user.value))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('nekaso_token')
    localStorage.removeItem('nekaso_user')
  }

  return {
    token,
    user,
    utilisateurCourant,
    isAuthenticated,
    nomComplet,
    isGestionnaire,
    login,
    logout,
  }
})
