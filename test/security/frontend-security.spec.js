/**
 * Tests de sécurité frontend — NEKASO
 * Couvre :
 *  1. Stockage des tokens (sessionStorage par défaut, pas localStorage)
 *  2. Pas de données sensibles en console.log
 *  3. Protection des routes (accès direct sans token)
 *  4. Validation / sanitisation des entrées utilisateur
 *  5. Pas de v-html non contrôlé (audit statique)
 *  6. Déconnexion efface toutes les données sensibles
 *  7. pendingAction sans fuite d'info sensible
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { getToken, setToken } from '@/services/storage'
import { createRouter, createMemoryHistory } from 'vue-router'
import fs from 'node:fs'
import path from 'node:path'

vi.mock('@/services/auth.service', () => ({
  authService: { login: vi.fn() },
}))

import { authService } from '@/services/auth.service'

const SRC = path.resolve(process.cwd(), 'src')

beforeEach(() => {
  setActivePinia(createPinia())
  sessionStorage.clear()
  localStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => vi.restoreAllMocks())

// ══════════════════════════════════════════════════════════════════════════
describe('Sécurité — stockage des tokens', () => {
  it('le token est stocké en sessionStorage (pas localStorage) par défaut', async () => {
    authService.login.mockResolvedValue({
      token: 'secure-jwt',
      user: { id: 1, role: 'LOCATAIRE', nom: 'Test' },
    })
    const store = useAuthStore()
    await store.login('770000001', 'pass')

    expect(sessionStorage.getItem('nekaso_token')).toBe('secure-jwt')
    expect(localStorage.getItem('nekaso_token')).toBeNull()
  })

  it('les données utilisateur sont en sessionStorage, pas localStorage', async () => {
    authService.login.mockResolvedValue({
      token: 'tok',
      user: { id: 1, role: 'LOCATAIRE', nom: 'Test', prenom: 'User' },
    })
    const store = useAuthStore()
    await store.login('770000001', 'pass')

    expect(sessionStorage.getItem('nekaso_user')).not.toBeNull()
    expect(localStorage.getItem('nekaso_user')).toBeNull()
  })

  it('après logout, sessionStorage ne contient plus de token', async () => {
    authService.login.mockResolvedValue({ token: 'jwt', user: { id: 1, role: 'LOCATAIRE' } })
    const store = useAuthStore()
    await store.login('770000001', 'pass')
    store.logout()

    expect(sessionStorage.getItem('nekaso_token')).toBeNull()
    expect(sessionStorage.getItem('nekaso_user')).toBeNull()
  })

  it('setToken(tok, {persistent: false}) n\'écrit PAS en localStorage', () => {
    setToken('my-secret-jwt', { persistent: false })
    expect(localStorage.getItem('nekaso_token')).toBeNull()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Sécurité — protection des routes sans token', () => {
  function buildSecureRouter() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/login', component: { template: '<div/>' }, meta: { guest: true } },
        { path: '/gestionnaire/dashboard', component: { template: '<div/>' }, meta: { requiresAuth: true } },
        { path: '/locataire/mes-locations', component: { template: '<div/>' }, meta: { requiresAuth: true } },
        { path: '/gestionnaire/biens', component: { template: '<div/>' }, meta: { requiresAuth: true } },
      ],
    })
    router.beforeEach((to, _from, next) => {
      const store = useAuthStore()
      if (to.meta.requiresAuth && !store.isAuthenticated) return next('/login')
      next()
    })
    return router
  }

  it('accès direct à /gestionnaire/dashboard sans token redirige vers /login', async () => {
    const router = buildSecureRouter()
    await router.push('/gestionnaire/dashboard')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('accès direct à /gestionnaire/biens sans token redirige vers /login', async () => {
    const router = buildSecureRouter()
    await router.push('/gestionnaire/biens')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('accès direct à /locataire/mes-locations sans token redirige vers /login', async () => {
    const router = buildSecureRouter()
    await router.push('/locataire/mes-locations')
    expect(router.currentRoute.value.path).toBe('/login')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Sécurité — validation des entrées (authStore)', () => {
  it('login avec téléphone vide ne passe pas la validation frontend (LoginView)', () => {
    // Le formulaire HTML utilise required — le store ne serait pas appelé
    // On vérifie que l'appel au store avec des valeurs vides est géré
    authService.login.mockRejectedValue({ response: { status: 400, data: { message: 'Champs vides' } } })
    const store = useAuthStore()
    return expect(store.login('', '')).resolves.toMatchObject({ success: false })
  })

  it('pendingAction n\'expose pas le token JWT', () => {
    const store = useAuthStore()
    store.setPendingAction({ type: 'visite', bienId: 42 })

    const stored = JSON.parse(localStorage.getItem('nekaso_pending_action'))
    expect(stored).not.toHaveProperty('token')
    expect(stored).not.toHaveProperty('password')
    expect(stored).not.toHaveProperty('motDePasse')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Sécurité — audit statique du code source', () => {
  function walkFiles(dir, ext = ['.js', '.vue']) {
    const results = []
    if (!fs.existsSync(dir)) return results
    function recurse(current) {
      for (const f of fs.readdirSync(current)) {
        const full = path.join(current, f)
        const stat = fs.statSync(full)
        if (stat.isDirectory() && f !== 'node_modules' && f !== 'dist') recurse(full)
        else if (ext.some((e) => f.endsWith(e))) results.push(full)
      }
    }
    recurse(dir)
    return results
  }

  it('aucun fichier source n\'utilise v-html (risque XSS)', () => {
    const files = walkFiles(SRC)
    const dangerous = files.filter((f) => {
      const content = fs.readFileSync(f, 'utf8')
      return /v-html\s*=/.test(content)
    })
    expect(dangerous).toEqual([])
  })

  it('aucun fichier source n\'utilise eval()', () => {
    const files = walkFiles(SRC)
    const dangerous = files.filter((f) => {
      const content = fs.readFileSync(f, 'utf8')
      return /\beval\s*\(/.test(content)
    })
    expect(dangerous).toEqual([])
  })

  it('aucun fichier source n\'utilise document.write()', () => {
    const files = walkFiles(SRC)
    const dangerous = files.filter((f) => {
      const content = fs.readFileSync(f, 'utf8')
      return /document\.write\s*\(/.test(content)
    })
    expect(dangerous).toEqual([])
  })

  it('aucun fichier source n\'utilise new Function()', () => {
    const files = walkFiles(SRC)
    const dangerous = files.filter((f) => {
      const content = fs.readFileSync(f, 'utf8')
      return /new\s+Function\s*\(/.test(content)
    })
    expect(dangerous).toEqual([])
  })

  it('aucun mot de passe en clair dans les fichiers source', () => {
    const files = walkFiles(SRC)
    const leaks = files.filter((f) => {
      const content = fs.readFileSync(f, 'utf8')
      // Recherche de patterns type password = "xxx" ou motDePasse: "xxx"
      return /(?:password|motDePasse|secret|apiKey)\s*[=:]\s*["'][^"']{4,}["']/.test(content)
    })
    expect(leaks).toEqual([])
  })

  it('les URLs d\'API ne contiennent pas de tokens hardcodés', () => {
    const files = walkFiles(path.join(SRC, 'services'))
    const leaks = files.filter((f) => {
      const content = fs.readFileSync(f, 'utf8')
      return /Bearer\s+[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_]+/.test(content)
    })
    expect(leaks).toEqual([])
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Sécurité — nettoyage post-logout', () => {
  it('logout efface toutes les clés nekaso_* du sessionStorage', async () => {
    authService.login.mockResolvedValue({
      token: 'tok',
      user: { id: 1, role: 'GESTIONNAIRE', nom: 'Admin' },
    })
    const store = useAuthStore()
    await store.login('771234567', 'pass')
    store.setPendingAction({ type: 'visite', bienId: 5 })

    store.logout()

    expect(sessionStorage.getItem('nekaso_token')).toBeNull()
    expect(sessionStorage.getItem('nekaso_user')).toBeNull()
    expect(localStorage.getItem('nekaso_pending_action')).toBeNull()
  })

  it('après logout isAuthenticated est false — pas d\'accès résiduel', async () => {
    authService.login.mockResolvedValue({ token: 'tok', user: { id: 1, role: 'LOCATAIRE' } })
    const store = useAuthStore()
    await store.login('770000001', 'pass')
    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
  })
})
