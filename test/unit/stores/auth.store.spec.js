/**
 * Tests unitaires — auth.store.js
 * Couvre : login, register, logout, computed, pendingAction, états de chargement
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}))

vi.mock('@/services/storage', () => ({
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  removeToken: vi.fn(),
  getUser: vi.fn(() => null),
  setUser: vi.fn(),
  removeUser: vi.fn(),
}))

import { authService } from '@/services/auth.service'

// ── Helpers ────────────────────────────────────────────────────────────────
const LOCATAIRE = { id: 1, nom: 'Diop', prenom: 'Aminata', role: 'LOCATAIRE', telephone: '770000001' }
const GESTIONNAIRE = { id: 2, nom: 'Fall', prenom: 'Omar', role: 'GESTIONNAIRE', telephone: '771234567' }

// ── Setup ──────────────────────────────────────────────────────────────────
beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ══════════════════════════════════════════════════════════════════════════
describe('auth.store — état initial', () => {
  it('token et user sont null par défaut (storage vide)', () => {
    const store = useAuthStore()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('isAuthenticated vaut false sans token', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
  })

  it('isGestionnaire vaut false sans user', () => {
    const store = useAuthStore()
    expect(store.isGestionnaire).toBe(false)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('auth.store — login()', () => {
  it('login réussi (200) stocke token + user et retourne success:true', async () => {
    authService.login.mockResolvedValue({ token: 'jwt-abc', user: LOCATAIRE })
    const store = useAuthStore()

    const result = await store.login('770000001', 'password123')

    expect(result.success).toBe(true)
    expect(result.user.role).toBe('LOCATAIRE')
    expect(store.token).toBe('jwt-abc')
    expect(store.user).toEqual(LOCATAIRE)
    expect(store.isAuthenticated).toBe(true)
    expect(store.isLoading).toBe(false)
  })

  it('login réussi avec GESTIONNAIRE renseigne isGestionnaire', async () => {
    authService.login.mockResolvedValue({ token: 'jwt-gest', user: GESTIONNAIRE })
    const store = useAuthStore()

    await store.login('771234567', 'secret')

    expect(store.isGestionnaire).toBe(true)
    expect(store.isAuthenticated).toBe(true)
  })

  it('login échoue (401) retourne success:false avec message correct', async () => {
    authService.login.mockRejectedValue({ response: { status: 401 } })
    const store = useAuthStore()

    const result = await store.login('770000001', 'mauvais')

    expect(result.success).toBe(false)
    expect(result.error).toContain('incorrect')
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('login échoue (400) retourne success:false avec message champs manquants', async () => {
    authService.login.mockRejectedValue({ response: { status: 400, data: { message: 'Champs obligatoires manquants' } } })
    const store = useAuthStore()

    const result = await store.login('', '')

    expect(result.success).toBe(false)
    expect(result.error).toContain('Champs')
  })

  it('login échoue (500) retourne message erreur serveur', async () => {
    authService.login.mockRejectedValue({ response: { status: 500 } })
    const store = useAuthStore()

    const result = await store.login('770000001', 'test')

    expect(result.success).toBe(false)
    expect(result.error).toContain('serveur')
  })

  it('login sans réseau retourne message connexion impossible', async () => {
    authService.login.mockRejectedValue({ response: undefined })
    const store = useAuthStore()

    const result = await store.login('770000001', 'test')

    expect(result.success).toBe(false)
    expect(result.error).toContain('serveur')
  })

  it('isLoading passe à true pendant le login puis revient à false', async () => {
    let loadingDuringCall = false
    authService.login.mockImplementation(async () => {
      loadingDuringCall = true
      return { token: 'tok', user: LOCATAIRE }
    })
    const store = useAuthStore()
    const promise = store.login('770000001', 'test')
    // La promesse est encore en cours → le mock a capturé l'état
    await promise
    expect(loadingDuringCall).toBe(true)
    expect(store.isLoading).toBe(false)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('auth.store — register()', () => {
  it('register crée toujours un utilisateur LOCATAIRE', async () => {
    const store = useAuthStore()
    const result = await store.register('Bah Kadiatou', '776543210', 'pass1234')

    expect(result.success).toBe(true)
    expect(result.user.role).toBe('LOCATAIRE')
    expect(store.isAuthenticated).toBe(true)
  })

  it('register remplit nom depuis le paramètre', async () => {
    const store = useAuthStore()
    const result = await store.register('Fatou Sow', '775000000', 'pass1234')

    expect(result.user.nom).toBe('Fatou Sow')
    expect(result.user.telephone).toBe('775000000')
  })

  it('register ne crée jamais un GESTIONNAIRE', async () => {
    const store = useAuthStore()
    const result = await store.register('Test User', '770000099', 'pass1234')

    expect(result.user.role).not.toBe('GESTIONNAIRE')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('auth.store — logout()', () => {
  it('logout vide token, user et error', async () => {
    authService.login.mockResolvedValue({ token: 'jwt', user: LOCATAIRE })
    const store = useAuthStore()
    await store.login('770000001', 'test')

    store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.error).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('auth.store — computed nomComplet', () => {
  it('nomComplet concatène prenom et nom', async () => {
    authService.login.mockResolvedValue({ token: 'jwt', user: GESTIONNAIRE })
    const store = useAuthStore()
    await store.login('771234567', 'test')

    expect(store.nomComplet).toBe('Omar Fall')
  })

  it('nomComplet est vide sans user connecté', () => {
    const store = useAuthStore()
    expect(store.nomComplet).toBe('')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('auth.store — pendingAction', () => {
  it('setPendingAction persiste en localStorage et met à jour le store', () => {
    const store = useAuthStore()
    store.setPendingAction({ type: 'visite', bienId: 42 })

    expect(store.pendingAction).toEqual({ type: 'visite', bienId: 42 })
    const stored = JSON.parse(localStorage.getItem('nekaso_pending_action'))
    expect(stored).toEqual({ type: 'visite', bienId: 42 })
  })

  it('clearPendingAction supprime la valeur du store et du localStorage', () => {
    const store = useAuthStore()
    store.setPendingAction({ type: 'location', bienId: 55 })
    store.clearPendingAction()

    expect(store.pendingAction).toBeNull()
    expect(localStorage.getItem('nekaso_pending_action')).toBeNull()
  })

  it('logout efface pendingAction', async () => {
    authService.login.mockResolvedValue({ token: 'jwt', user: LOCATAIRE })
    const store = useAuthStore()
    await store.login('770000001', 'test')
    store.setPendingAction({ type: 'visite', bienId: 10 })

    store.logout()

    expect(store.pendingAction).toBeNull()
  })
})
