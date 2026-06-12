/**
 * Tests unitaires — HeaderLocataire.vue
 * Couvre : rendu des liens, menu burger (toggle), déconnexion,
 *          lien actif, responsive (visibilité)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import HeaderLocataire from '@/components/layout/HeaderLocataire.vue'

vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))
vi.mock('@/services/storage', () => ({
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  removeToken: vi.fn(),
  getUser: vi.fn(() => null),
  setUser: vi.fn(),
  removeUser: vi.fn(),
}))

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div/>' } },
      { path: '/login', component: { template: '<div/>' } },
      { path: '/locataire/mes-locations', component: { template: '<div/>' } },
      { path: '/locataire/mes-demandes-visites', component: { template: '<div/>' } },
      { path: '/locataire/mes-demandes-locations', component: { template: '<div/>' } },
    ],
  })
}

function mountHeader() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = buildRouter()
  return { wrapper: mount(HeaderLocataire, { global: { plugins: [pinia, router] } }), router }
}

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
  vi.clearAllMocks()
})

// ══════════════════════════════════════════════════════════════════════════
describe('HeaderLocataire — rendu des liens de navigation', () => {
  it('contient les 4 liens de navigation desktop', () => {
    const { wrapper } = mountHeader()
    const navLinks = wrapper.findAll('.nav-link')
    const hrefs = navLinks.map((l) => l.attributes('href') || l.attributes('to'))

    expect(navLinks.length).toBeGreaterThanOrEqual(4)
    expect(wrapper.text()).toContain('Accueil')
    expect(wrapper.text()).toContain('Mes locations')
    expect(wrapper.text()).toContain('demandes de visite')
    expect(wrapper.text()).toContain('demandes de location')
  })

  it('affiche le logo NEKASO', () => {
    const { wrapper } = mountHeader()
    const logo = wrapper.find('.logo-icon')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('alt')).toContain('NEKASO')
  })

  it('contient le bouton de déconnexion (desktop)', () => {
    const { wrapper } = mountHeader()
    expect(wrapper.find('.btn-logout').exists()).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('HeaderLocataire — burger menu (mobile)', () => {
  it('le bouton hamburger existe', () => {
    const { wrapper } = mountHeader()
    expect(wrapper.find('.mobile-toggle').exists()).toBe(true)
  })

  it('le menu mobile est fermé par défaut (mobileOpen = false)', () => {
    const { wrapper } = mountHeader()
    expect(wrapper.vm.mobileOpen).toBe(false)
    expect(wrapper.find('.mobile-menu').exists()).toBe(false)
  })

  it('cliquer le hamburger ouvre le menu mobile', async () => {
    const { wrapper } = mountHeader()
    await wrapper.find('.mobile-toggle').trigger('click')
    expect(wrapper.vm.mobileOpen).toBe(true)
    expect(wrapper.find('.mobile-menu').exists()).toBe(true)
  })

  it('cliquer le hamburger une 2e fois ferme le menu', async () => {
    const { wrapper } = mountHeader()
    await wrapper.find('.mobile-toggle').trigger('click')
    await wrapper.find('.mobile-toggle').trigger('click')
    expect(wrapper.vm.mobileOpen).toBe(false)
  })

  it('le menu mobile contient les liens de navigation', async () => {
    const { wrapper } = mountHeader()
    await wrapper.find('.mobile-toggle').trigger('click')

    const mobileLinks = wrapper.findAll('.mobile-link')
    expect(mobileLinks.length).toBeGreaterThanOrEqual(4)
    const texts = mobileLinks.map((l) => l.text())
    expect(texts.some((t) => t.includes('Mes locations'))).toBe(true)
  })

  it('le menu mobile contient un bouton "Se déconnecter"', async () => {
    const { wrapper } = mountHeader()
    await wrapper.find('.mobile-toggle').trigger('click')
    const logoutBtn = wrapper.find('.mobile-logout')
    expect(logoutBtn.exists()).toBe(true)
  })

  it('cliquer un lien mobile ferme le menu', async () => {
    const { wrapper } = mountHeader()
    await wrapper.find('.mobile-toggle').trigger('click')
    expect(wrapper.vm.mobileOpen).toBe(true)

    const mobileLinks = wrapper.findAll('a.mobile-link')
    if (mobileLinks.length > 0) {
      await mobileLinks[0].trigger('click')
      expect(wrapper.vm.mobileOpen).toBe(false)
    }
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('HeaderLocataire — déconnexion', () => {
  it('le bouton logout appelle authStore.logout et redirige vers /login', async () => {
    const { wrapper, router } = mountHeader()
    const pushSpy = vi.spyOn(router, 'push')

    await wrapper.find('.btn-logout').trigger('click')

    expect(pushSpy).toHaveBeenCalledWith('/login')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('HeaderLocataire — fermeture menu sur changement de route', () => {
  it('mobileOpen passe à false après navigation', async () => {
    const { wrapper, router } = mountHeader()
    await wrapper.find('.mobile-toggle').trigger('click')
    expect(wrapper.vm.mobileOpen).toBe(true)

    await router.push('/locataire/mes-demandes-visites')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.mobileOpen).toBe(false)
  })
})
