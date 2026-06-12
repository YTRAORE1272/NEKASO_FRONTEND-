/**
 * Tests unitaires — ForgotPasswordModal.vue
 * Couvre : ouverture/fermeture, étapes 1→2→3, validations, retour arrière
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal.vue'

vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}))

function mountModal(modelValue = true) {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(ForgotPasswordModal, {
    props: { modelValue },
    global: {
      plugins: [pinia],
      stubs: { Teleport: false },
    },
    attachTo: document.body,
  })
}

beforeEach(() => vi.clearAllMocks())

// ══════════════════════════════════════════════════════════════════════════
describe('ForgotPasswordModal — affichage', () => {
  it('n\'est pas visible quand modelValue vaut false', () => {
    const wrapper = mountModal(false)
    expect(wrapper.find('.mdp-overlay').exists()).toBe(false)
    wrapper.unmount()
  })

  it('est visible quand modelValue vaut true', () => {
    const wrapper = mountModal(true)
    expect(wrapper.find('.mdp-overlay').exists()).toBe(true)
    wrapper.unmount()
  })

  it('affiche le titre "Mot de passe oublié"', () => {
    const wrapper = mountModal()
    expect(wrapper.text()).toContain('Mot de passe oublié')
    wrapper.unmount()
  })

  it('affiche les 3 étapes dans le header (Numéro, Vérification, Nouveau MDP)', () => {
    const wrapper = mountModal()
    const pills = wrapper.findAll('.mdp-pill')
    expect(pills.length).toBe(3)
    expect(pills[0].text()).toContain('Numéro')
    expect(pills[1].text()).toContain('Vérification')
    expect(pills[2].text()).toContain('MDP')
    wrapper.unmount()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('ForgotPasswordModal — fermeture', () => {
  it('émet update:modelValue false au clic sur le bouton fermer', async () => {
    const wrapper = mountModal()
    await wrapper.find('.mdp-close').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
    wrapper.unmount()
  })

  it('émet update:modelValue false au clic sur le fond (overlay)', async () => {
    const wrapper = mountModal()
    await wrapper.find('.mdp-overlay').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
    wrapper.unmount()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('ForgotPasswordModal — étape 1 (numéro)', () => {
  it('l\'étape 1 est active par défaut (pill-active)', () => {
    const wrapper = mountModal()
    const pills = wrapper.findAll('.mdp-pill')
    expect(pills[0].classes()).toContain('pill-active')
    wrapper.unmount()
  })

  it('le bouton "Envoyer le code" est désactivé sans numéro', () => {
    const wrapper = mountModal()
    const btn = wrapper.find('.btn-submit')
    expect(btn.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('le bouton "Envoyer le code" est actif après saisie d\'un numéro', async () => {
    const wrapper = mountModal()
    await wrapper.find('input[type="tel"]').setValue('+221770000000')
    const btn = wrapper.find('.btn-submit')
    expect(btn.attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })

  it('cliquer "Envoyer le code" passe à l\'étape 2', async () => {
    const wrapper = mountModal()
    await wrapper.find('input[type="tel"]').setValue('+221770000000')
    await wrapper.find('.btn-submit').trigger('click')
    expect(wrapper.vm.mdpStep).toBe(2)
    wrapper.unmount()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('ForgotPasswordModal — étape 2 (code OTP)', () => {
  async function goToStep2(wrapper) {
    await wrapper.find('input[type="tel"]').setValue('+221770000000')
    await wrapper.find('.btn-submit').trigger('click')
  }

  it('affiche 6 champs de code OTP', async () => {
    const wrapper = mountModal()
    await goToStep2(wrapper)
    expect(wrapper.findAll('.code-input').length).toBe(6)
    wrapper.unmount()
  })

  it('étape 1 est marquée "pill-done" (verte) à l\'étape 2', async () => {
    const wrapper = mountModal()
    await goToStep2(wrapper)
    const pills = wrapper.findAll('.mdp-pill')
    expect(pills[0].classes()).toContain('pill-done')
    expect(pills[1].classes()).toContain('pill-active')
    wrapper.unmount()
  })

  it('le bouton "Vérifier" est désactivé si le code est incomplet', async () => {
    const wrapper = mountModal()
    await goToStep2(wrapper)
    const btn = wrapper.find('.btn-submit')
    expect(btn.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('"← Changer de numéro" ramène à l\'étape 1', async () => {
    const wrapper = mountModal()
    await goToStep2(wrapper)
    await wrapper.find('.lien-retour').trigger('click')
    expect(wrapper.vm.mdpStep).toBe(1)
    wrapper.unmount()
  })

  it('code complet active le bouton "Vérifier"', async () => {
    const wrapper = mountModal()
    await goToStep2(wrapper)

    const inputs = wrapper.findAll('.code-input')
    for (const inp of inputs) {
      await inp.setValue('1')
    }
    // Force le modèle
    wrapper.vm.mdpForm.code = ['1', '2', '3', '4', '5', '6']
    await wrapper.vm.$nextTick()

    const btn = wrapper.find('.btn-submit')
    expect(btn.attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('ForgotPasswordModal — étape 3 (nouveau mot de passe)', () => {
  async function goToStep3(wrapper) {
    await wrapper.find('input[type="tel"]').setValue('+221770000000')
    await wrapper.find('.btn-submit').trigger('click')
    wrapper.vm.mdpForm.code = ['1', '2', '3', '4', '5', '6']
    await wrapper.vm.$nextTick()
    await wrapper.find('.btn-submit').trigger('click')
  }

  it('affiche 2 champs mot de passe à l\'étape 3', async () => {
    const wrapper = mountModal()
    await goToStep3(wrapper)
    const inputs = wrapper.findAll('input[type="password"]')
    expect(inputs.length).toBeGreaterThanOrEqual(2)
    wrapper.unmount()
  })

  it('étapes 1 et 2 sont vertes (pill-done) à l\'étape 3', async () => {
    const wrapper = mountModal()
    await goToStep3(wrapper)
    const pills = wrapper.findAll('.mdp-pill')
    expect(pills[0].classes()).toContain('pill-done')
    expect(pills[1].classes()).toContain('pill-done')
    expect(pills[2].classes()).toContain('pill-active')
    wrapper.unmount()
  })

  it('bouton "Réinitialiser" désactivé si mots de passe différents', async () => {
    const wrapper = mountModal()
    await goToStep3(wrapper)
    wrapper.vm.mdpForm.newPassword = 'pass1234'
    wrapper.vm.mdpForm.confirmPassword = 'autre'
    await wrapper.vm.$nextTick()

    const btn = wrapper.find('.btn-submit')
    expect(btn.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('bouton "Réinitialiser" actif si mots de passe identiques (≥8 car.)', async () => {
    const wrapper = mountModal()
    await goToStep3(wrapper)
    wrapper.vm.mdpForm.newPassword = 'newpass123'
    wrapper.vm.mdpForm.confirmPassword = 'newpass123'
    await wrapper.vm.$nextTick()

    const btn = wrapper.find('.btn-submit')
    expect(btn.attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })

  it('réinitialisation réussie ferme la modale', async () => {
    const wrapper = mountModal()
    await goToStep3(wrapper)
    wrapper.vm.mdpForm.newPassword = 'newpass123'
    wrapper.vm.mdpForm.confirmPassword = 'newpass123'
    await wrapper.vm.$nextTick()
    await wrapper.find('.btn-submit').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false])
    wrapper.unmount()
  })
})
