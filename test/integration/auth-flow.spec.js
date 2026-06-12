/**
 * Tests d'intégration — Flux d'authentification complet
 * Couvre : login → état Pinia → stockage, register → LOCATAIRE,
 *          logout → nettoyage complet, pendingAction preservation
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

// Laisse le vrai sessionStorage agir — permet de vérifier la persistance réelle
vi.mock('@/services/auth.service', () => ({
  authService: { login: vi.fn() },
}))

import { authService } from '@/services/auth.service'

const USER_LOCATAIRE = { id: 1, nom: 'Bah', prenom: 'Kadiatou', role: 'LOCATAIRE', telephone: '770000001' }
const USER_GESTIONNAIRE = { id: 2, nom: 'Fall', prenom: 'Omar', role: 'GESTIONNAIRE', telephone: '771234567' }

beforeEach(() => {
  setActivePinia(createPinia())
  sessionStorage.clear()
  localStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => vi.restoreAllMocks())

// ══════════════════════════════════════════════════════════════════════════
describe('Flux login complet', () => {
  it('après login réussi le token est dans sessionStorage', async () => {
    authService.login.mockResolvedValue({ token: 'jwt-real', user: USER_LOCATAIRE })
    const store = useAuthStore()
    await store.login('770000001', 'pass')

    expect(sessionStorage.getItem('nekaso_token')).toBe('jwt-real')
    expect(localStorage.getItem('nekaso_token')).toBeNull()
  })

  it('après login réussi l\'utilisateur est dans sessionStorage', async () => {
    authService.login.mockResolvedValue({ token: 'jwt-real', user: USER_LOCATAIRE })
    const store = useAuthStore()
    await store.login('770000001', 'pass')

    const storedUser = JSON.parse(sessionStorage.getItem('nekaso_user'))
    expect(storedUser.role).toBe('LOCATAIRE')
    expect(storedUser.id).toBe(1)
  })

  it('après login échoué rien n\'est stocké dans sessionStorage', async () => {
    authService.login.mockRejectedValue({ response: { status: 401 } })
    const store = useAuthStore()
    await store.login('770000001', 'wrong')

    expect(sessionStorage.getItem('nekaso_token')).toBeNull()
    expect(sessionStorage.getItem('nekaso_user')).toBeNull()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Flux register complet', () => {
  it('après register le token et user LOCATAIRE sont dans sessionStorage', async () => {
    const store = useAuthStore()
    await store.register('Aminata Diop', '776000000', 'secure123')

    expect(sessionStorage.getItem('nekaso_token')).toBeTruthy()
    const storedUser = JSON.parse(sessionStorage.getItem('nekaso_user'))
    expect(storedUser.role).toBe('LOCATAIRE')
  })

  it('register : isAuthenticated vaut true immédiatement après', async () => {
    const store = useAuthStore()
    await store.register('Test User', '775111111', 'pass8chars')
    expect(store.isAuthenticated).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Flux logout complet', () => {
  it('logout vide sessionStorage et localStorage', async () => {
    authService.login.mockResolvedValue({ token: 'jwt', user: USER_GESTIONNAIRE })
    const store = useAuthStore()
    await store.login('771234567', 'pass')
    expect(sessionStorage.getItem('nekaso_token')).toBeTruthy()

    store.logout()

    expect(sessionStorage.getItem('nekaso_token')).toBeNull()
    expect(sessionStorage.getItem('nekaso_user')).toBeNull()
    expect(localStorage.getItem('nekaso_token')).toBeNull()
    expect(localStorage.getItem('nekaso_user')).toBeNull()
  })

  it('logout met isAuthenticated à false', async () => {
    authService.login.mockResolvedValue({ token: 'jwt', user: USER_LOCATAIRE })
    const store = useAuthStore()
    await store.login('770000001', 'pass')
    store.logout()
    expect(store.isAuthenticated).toBe(false)
  })

  it('logout efface la pendingAction du localStorage', async () => {
    const store = useAuthStore()
    store.setPendingAction({ type: 'visite', bienId: 7 })
    store.logout()

    expect(localStorage.getItem('nekaso_pending_action')).toBeNull()
    expect(store.pendingAction).toBeNull()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('PendingAction — préservation entre sessions', () => {
  it('pendingAction est restaurée depuis localStorage au démarrage du store', () => {
    localStorage.setItem('nekaso_pending_action', JSON.stringify({ type: 'location', bienId: 33 }))

    // Nouveau store → lit localStorage
    const store = useAuthStore()
    expect(store.pendingAction).toEqual({ type: 'location', bienId: 33 })
  })

  it('setPendingAction → clearPendingAction efface tout proprement', () => {
    const store = useAuthStore()
    store.setPendingAction({ type: 'visite', bienId: 42 })
    expect(store.pendingAction).not.toBeNull()

    store.clearPendingAction()
    expect(store.pendingAction).toBeNull()
    expect(localStorage.getItem('nekaso_pending_action')).toBeNull()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Store interaction — biens + auth', () => {
  it('isGestionnaire est cohérent avec le rôle stocké dans user', async () => {
    authService.login.mockResolvedValue({ token: 'jwt', user: USER_GESTIONNAIRE })
    const store = useAuthStore()
    await store.login('771234567', 'pass')

    expect(store.isGestionnaire).toBe(true)
    expect(store.user.role).toBe('GESTIONNAIRE')
  })

  it('un LOCATAIRE n\'est jamais isGestionnaire', async () => {
    authService.login.mockResolvedValue({ token: 'jwt', user: USER_LOCATAIRE })
    const store = useAuthStore()
    await store.login('770000001', 'pass')

    expect(store.isGestionnaire).toBe(false)
  })
})
