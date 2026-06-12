/**
 * Tests unitaires — LoginView.vue
 * Couvre : rendu initial, switch tabs, soumission login/register,
 *          validation, modale mot de passe oublié
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock('@/services/auth.service', () => ({
  authService: { login: vi.fn() },
}))
vi.mock('@/services/storage', () => ({
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  removeToken: vi.fn(),
  getUser: vi.fn(() => null),
  setUser: vi.fn(),
  removeUser: vi.fn(),
}))
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}))

import { authService } from '@/services/auth.service'

// ── Factory ────────────────────────────────────────────────────────────────
function mountLoginView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div/>' } },
      { path: '/login', component: LoginView },
      { path: '/locataire/mes-locations', component: { template: '<div/>' } },
      { path: '/gestionnaire/dashboard', component: { template: '<div/>' } },
    ],
  })
  return mount(LoginView, {
    global: {
      plugins: [pinia, router],
      stubs: {
        HeaderPublic: true,
        ForgotPasswordModal: true,
        Teleport: true,
      },
    },
  })
}

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
  vi.clearAllMocks()
})

// ══════════════════════════════════════════════════════════════════════════
describe('LoginView — rendu initial', () => {
  it('affiche l\'onglet "Connexion" actif par défaut', () => {
    const wrapper = mountLoginView()
    const activeTab = wrapper.find('.tab-active')
    expect(activeTab.text()).toContain('Connexion')
  })

  it('affiche le formulaire de connexion par défaut', () => {
    const wrapper = mountLoginView()
    expect(wrapper.find('input[type="tel"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('affiche le lien "Mot de passe oublié ?"', () => {
    const wrapper = mountLoginView()
    expect(wrapper.find('.lien-mdp').exists()).toBe(true)
    expect(wrapper.find('.lien-mdp').text()).toContain('oublié')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('LoginView — switch tabs', () => {
  it('cliquer sur "Inscription" affiche le formulaire d\'inscription', async () => {
    const wrapper = mountLoginView()
    const tabs = wrapper.findAll('.tab')
    const inscriptionTab = tabs.find((t) => t.text().includes('Inscription'))
    await inscriptionTab.trigger('click')

    expect(wrapper.find('.step-indicator').exists()).toBe(true)
    expect(wrapper.text()).toContain('Votre identité')
  })

  it('cliquer sur "Connexion" revient au formulaire login', async () => {
    const wrapper = mountLoginView()
    const tabs = wrapper.findAll('.tab')
    await tabs.find((t) => t.text().includes('Inscription')).trigger('click')
    await tabs.find((t) => t.text().includes('Connexion')).trigger('click')

    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('LoginView — formulaire connexion', () => {
  it('bouton "Se connecter" appelle authStore.login avec les bons arguments', async () => {
    authService.login.mockResolvedValue({
      token: 'jwt-tok',
      user: { id: 1, role: 'LOCATAIRE', nom: 'Diop', prenom: 'Aminata' },
    })
    const wrapper = mountLoginView()

    await wrapper.find('input[type="tel"]').setValue('770000001')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('button[type="submit"]').trigger('click')

    expect(authService.login).toHaveBeenCalledWith('770000001', 'password123')
  })

  it('bouton toggle eye change le type du champ mot de passe', async () => {
    const wrapper = mountLoginView()
    const passwordInput = wrapper.find('input[type="password"]')
    expect(passwordInput.exists()).toBe(true)

    await wrapper.find('.eye-toggle').trigger('click')

    const afterToggle = wrapper.find('input[type="text"]')
    expect(afterToggle.exists()).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('LoginView — formulaire inscription (étapes)', () => {
  async function goToRegister(wrapper) {
    const tabs = wrapper.findAll('.tab')
    await tabs.find((t) => t.text().includes('Inscription')).trigger('click')
  }

  it('étape 1 : affiche les champs nom et téléphone', async () => {
    const wrapper = mountLoginView()
    await goToRegister(wrapper)

    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(2)
  })

  it('étape 1 → 2 : progression après soumission valide', async () => {
    const wrapper = mountLoginView()
    await goToRegister(wrapper)

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Fatou Sow')
    await inputs[1].setValue('776543210')

    await wrapper.find('button[type="submit"]').trigger('click')

    // Étape 2 : code WhatsApp
    expect(wrapper.text()).toContain('Vérification')
  })

  it('étape 2 : les 4 champs de code sont présents', async () => {
    const wrapper = mountLoginView()
    await goToRegister(wrapper)

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Fatou Sow')
    await inputs[1].setValue('776543210')
    await wrapper.find('button[type="submit"]').trigger('click')

    const codeInputs = wrapper.findAll('.code-input')
    expect(codeInputs.length).toBe(4)
  })

  it('inscription crée toujours un rôle LOCATAIRE (pas de choix de rôle visible)', async () => {
    const wrapper = mountLoginView()
    await goToRegister(wrapper)

    // Aucun sélecteur de rôle ne doit être présent
    expect(wrapper.text()).not.toContain('GESTIONNAIRE')
    expect(wrapper.find('select').exists()).toBe(false)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('LoginView — modale mot de passe oublié', () => {
  it('cliquer "Mot de passe oublié ?" ouvre la modale', async () => {
    const wrapper = mountLoginView()
    await wrapper.find('.lien-mdp').trigger('click')

    const modal = wrapper.findComponent({ name: 'ForgotPasswordModal' })
      || wrapper.find('[data-testid="forgot-modal"]')

    // showMdpModal passe à true
    expect(wrapper.vm.showMdpModal).toBe(true)
  })
})
