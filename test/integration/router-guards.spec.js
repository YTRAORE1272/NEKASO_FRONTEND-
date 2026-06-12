/**
 * Tests d'intégration — Gardes de route (router/index.js)
 * Couvre : requiresAuth (redirect → /login), guest (redirect → dashboard),
 *          routes publiques accessibles sans auth, rôles GESTIONNAIRE / LOCATAIRE
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

vi.mock('@/services/storage', () => ({
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  removeToken: vi.fn(),
  getUser: vi.fn(() => null),
  setUser: vi.fn(),
  removeUser: vi.fn(),
}))

// ── Router minimaliste reproduisant les gardes réelles ─────────────────────
function buildRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'landing', component: { template: '<div/>' }, meta: { public: true } },
      { path: '/catalogue', name: 'catalogue', component: { template: '<div/>' }, meta: { public: true } },
      { path: '/login', name: 'login', component: { template: '<div/>' }, meta: { guest: true } },
      {
        path: '/gestionnaire/dashboard',
        name: 'dashboard',
        component: { template: '<div/>' },
        meta: { requiresAuth: true },
      },
      {
        path: '/gestionnaire/biens',
        name: 'biens',
        component: { template: '<div/>' },
        meta: { requiresAuth: true },
      },
      {
        path: '/locataire/mes-locations',
        name: 'mes-locations',
        component: { template: '<div/>' },
        meta: { requiresAuth: true },
      },
    ],
  })

  router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.isAuthenticated) return next('/login')
    if (to.meta.guest && authStore.isAuthenticated) {
      if (authStore.user?.role === 'GESTIONNAIRE') return next('/gestionnaire/dashboard')
      if (authStore.user?.role === 'LOCATAIRE') return next('/locataire/mes-locations')
      return next('/')
    }
    next()
  })

  return router
}

beforeEach(() => {
  setActivePinia(createPinia())
  sessionStorage.clear()
  localStorage.clear()
  vi.clearAllMocks()
})

// ══════════════════════════════════════════════════════════════════════════
describe('Router guards — utilisateur NON connecté', () => {
  it('accès à /gestionnaire/dashboard redirige vers /login', async () => {
    const router = buildRouter()
    await router.push('/gestionnaire/dashboard')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('accès à /locataire/mes-locations redirige vers /login', async () => {
    const router = buildRouter()
    await router.push('/locataire/mes-locations')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('accès à / est autorisé (route publique)', async () => {
    const router = buildRouter()
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('accès à /catalogue est autorisé (route publique)', async () => {
    const router = buildRouter()
    await router.push('/catalogue')
    expect(router.currentRoute.value.path).toBe('/catalogue')
  })

  it('accès à /login est autorisé (route guest)', async () => {
    const router = buildRouter()
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/login')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Router guards — LOCATAIRE connecté', () => {
  function loginAs(role) {
    const store = useAuthStore()
    store.token = 'fake-token'
    store.user = { id: 1, role, nom: 'Test' }
  }

  it('accès à /locataire/mes-locations est autorisé', async () => {
    const router = buildRouter()
    loginAs('LOCATAIRE')
    await router.push('/locataire/mes-locations')
    expect(router.currentRoute.value.path).toBe('/locataire/mes-locations')
  })

  it('accès à /gestionnaire/dashboard est autorisé (guard ne filtre pas les rôles)', async () => {
    // Le guard requiresAuth ne vérifie que l'authentification, pas le rôle
    const router = buildRouter()
    loginAs('LOCATAIRE')
    await router.push('/gestionnaire/dashboard')
    expect(router.currentRoute.value.path).toBe('/gestionnaire/dashboard')
  })

  it('/login redirige vers /locataire/mes-locations (déjà connecté LOCATAIRE)', async () => {
    const router = buildRouter()
    loginAs('LOCATAIRE')
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/locataire/mes-locations')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Router guards — GESTIONNAIRE connecté', () => {
  function loginAsGestionnaire() {
    const store = useAuthStore()
    store.token = 'fake-gest-token'
    store.user = { id: 2, role: 'GESTIONNAIRE', nom: 'Admin' }
  }

  it('/login redirige vers /gestionnaire/dashboard (déjà connecté GESTIONNAIRE)', async () => {
    const router = buildRouter()
    loginAsGestionnaire()
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/gestionnaire/dashboard')
  })

  it('accès à /gestionnaire/dashboard est autorisé', async () => {
    const router = buildRouter()
    loginAsGestionnaire()
    await router.push('/gestionnaire/dashboard')
    expect(router.currentRoute.value.path).toBe('/gestionnaire/dashboard')
  })
})
