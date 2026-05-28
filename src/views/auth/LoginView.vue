<template>
  <div class="login-container">
    <!-- LEFT PANEL -->
    <div class="login-left">
      <div class="left-content">
        <h1 class="brand-title">
          Gérez votre patrimoine <span class="text-green">immobilier</span> en toute simplicité.
        </h1>
        <p class="brand-subtitle">
          Suivi des biens, contrats, paiements Mobile Money — tout centralisé dans une seule plateforme.
        </p>

        <div class="stats-container">
          <div class="stat-item">
            <span class="stat-value text-green">500+</span>
            <span class="stat-label">Biens gérés</span>
          </div>
          <div class="stat-item">
            <span class="stat-value text-green">98%</span>
            <span class="stat-label">Taux de recouvrement</span>
          </div>
          <div class="stat-item">
            <span class="stat-value text-green">3x</span>
            <span class="stat-label">Gain de productivité</span>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="login-right">
      <div class="login-box">
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="NEKASO Logo" class="app-logo" />
        </div>

        <h2 class="login-title">Connexion</h2>
        <p class="login-subtitle">Entrez vos identifiants pour accéder à votre espace.</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Numéro de téléphone</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
              <input type="tel" v-model="loginForm.telephone" placeholder="+221 77 000 00 00" required />
            </div>
          </div>

          <div class="form-group">
            <div class="password-header">
              <label>Mot de passe</label>
              <a href="#" @click.prevent="openForgotPasswordModal" class="forgot-link text-green">Mot de passe oublié ?</a>
            </div>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input :type="showPassword ? 'text' : 'password'" v-model="loginForm.motDePasse" placeholder="••••••••" required />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>

    <!-- FORGOT PASSWORD MODAL -->
    <div v-if="isModalOpen" class="modal-overlay-custom">
      <div class="forgot-modal">
        <div class="modal-header-custom">
          <div>
            <span class="modal-supertitle">RÉINITIALISATION</span>
            <h3 class="modal-title-custom">Mot de passe oublié</h3>
          </div>
          <button class="btn-close-custom" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-steps">
          <!-- Step 1 Indicator -->
          <div class="step" :class="{ 'step-completed': currentStep > 1, 'step-current': currentStep === 1 }">
            <span class="step-icon">
              <svg v-if="currentStep > 1" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </span>
            Numéro
          </div>
          <div class="step-line" :class="{ 'line-active': currentStep > 1 }"></div>
          
          <!-- Step 2 Indicator -->
          <div class="step" :class="{ 'step-completed': currentStep > 2, 'step-current': currentStep === 2, 'step-pending': currentStep < 2 }">
             <span class="step-icon">
              <svg v-if="currentStep > 2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </span>
            Vérification
          </div>
          <div class="step-line" :class="{ 'line-active': currentStep > 2 }"></div>
          
          <!-- Step 3 Indicator -->
          <div class="step" :class="{ 'step-current': currentStep === 3, 'step-pending': currentStep < 3 }">
             <span class="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
            </span>
            Nouveau MDP
          </div>
        </div>

        <div class="modal-body-custom">
          <!-- STEP 1 -->
          <div v-if="currentStep === 1" class="step-content">
            <p class="step-desc">Entrez votre numéro de téléphone. Vous recevrez un code à 6 chiffres par WhatsApp.</p>
            <div class="form-group mt-6">
              <label>Numéro de téléphone</label>
              <div class="input-wrapper">
                <input type="tel" v-model="forgotForm.telephone" class="input-reset" placeholder="+221 77 000 00 00" />
              </div>
            </div>
            <button class="btn-modal-submit mt-6" @click="nextStep">Envoyer le code</button>
          </div>

          <!-- STEP 2 -->
          <div v-if="currentStep === 2" class="step-content">
            <p class="step-desc">Un code à 6 chiffres a été envoyé par WhatsApp au <strong>{{ forgotForm.telephone }}</strong>.</p>
            <div class="code-inputs mt-6">
              <input 
                v-for="(digit, index) in 6" 
                :key="index" 
                type="text" 
                maxlength="1" 
                class="code-input" 
                v-model="forgotForm.code[index]" 
                @input="handleCodeInput(index, $event)" 
                @keydown="handleCodeKeydown(index, $event)" 
                :ref="el => { if (el) codeInputRefs[index] = el }" 
              />
            </div>
            <button class="btn-modal-submit mt-6" :class="{'btn-disabled': !isCodeComplete}" @click="nextStep" :disabled="!isCodeComplete">Vérifier le code</button>
            <div class="text-center mt-4">
               <a href="#" @click.prevent="currentStep = 1" class="link-back">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Changer de numéro
               </a>
            </div>
          </div>

          <!-- STEP 3 -->
          <div v-if="currentStep === 3" class="step-content">
             <p class="step-desc">Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>
             <div class="form-group mt-6">
                <label>Nouveau mot de passe</label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input :type="showNewPassword ? 'text' : 'password'" class="input-reset" v-model="forgotForm.newPassword" placeholder="••••••••" />
                  <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword">
                    <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label>Confirmer le mot de passe</label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input :type="showConfirmPassword ? 'text' : 'password'" class="input-reset" v-model="forgotForm.confirmPassword" placeholder="••••••••" />
                  <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                    <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  </button>
                </div>
              </div>
               <button class="btn-modal-submit mt-6" :class="{'btn-disabled': !canSubmitNewPassword}" @click="submitNewPassword" :disabled="!canSubmitNewPassword">Réinitialiser le mot de passe</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Login State
const loginForm = reactive({
  telephone: '',
  motDePasse: ''
})
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  if (!loginForm.telephone || !loginForm.motDePasse) {
    toast.error('Veuillez remplir tous les champs')
    return
  }
  
  isLoading.value = true
  try {
    await authStore.login(loginForm.telephone, loginForm.motDePasse)
    toast.success('Connexion réussie')
    router.push('/gestionnaire/dashboard')
  } catch (error) {
    toast.error('Identifiants incorrects')
  } finally {
    isLoading.value = false
  }
}

// Forgot Password Modal State
const isModalOpen = ref(false)
const currentStep = ref(1)
const forgotForm = reactive({
  telephone: '',
  code: ['', '', '', '', '', ''],
  newPassword: '',
  confirmPassword: ''
})
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const codeInputRefs = ref([])

const openForgotPasswordModal = () => {
  isModalOpen.value = true
  currentStep.value = 1
  forgotForm.telephone = loginForm.telephone // Pre-fill if already typed
  forgotForm.code = ['', '', '', '', '', '']
  forgotForm.newPassword = ''
  forgotForm.confirmPassword = ''
}

const closeModal = () => {
  isModalOpen.value = false
}

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!forgotForm.telephone) {
      toast.error('Veuillez entrer un numéro de téléphone')
      return
    }
    // TODO: Appel API pour envoyer le code WhatsApp
    toast.info('Code WhatsApp envoyé au ' + forgotForm.telephone)
    currentStep.value = 2
    // Focus first input automatically
    setTimeout(() => {
      if (codeInputRefs.value[0]) codeInputRefs.value[0].focus()
    }, 100)
  } else if (currentStep.value === 2) {
    if (!isCodeComplete.value) return
    // TODO: Appel API pour vérifier le code
    currentStep.value = 3
  }
}

const submitNewPassword = () => {
  if (!canSubmitNewPassword.value) return
  if (forgotForm.newPassword !== forgotForm.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }
  // TODO: Appel API pour réinitialiser le mot de passe
  toast.success('Mot de passe réinitialisé avec succès')
  closeModal()
}

// Code Input Logic
const isCodeComplete = computed(() => {
  return forgotForm.code.every(digit => digit.length === 1)
})

const canSubmitNewPassword = computed(() => {
  return forgotForm.newPassword.length >= 6 && 
         forgotForm.newPassword === forgotForm.confirmPassword
})

const handleCodeInput = (index, event) => {
  const value = event.target.value
  // Keep only digits
  forgotForm.code[index] = value.replace(/\D/g, '').slice(0, 1)
  
  if (forgotForm.code[index] && index < 5) {
    // Focus next input
    codeInputRefs.value[index + 1].focus()
  }
}

const handleCodeKeydown = (index, event) => {
  if (event.key === 'Backspace' && !forgotForm.code[index] && index > 0) {
    // Focus previous input on backspace if current is empty
    codeInputRefs.value[index - 1].focus()
  }
}

</script>

<style scoped>
/* Reset and base styles for this component to not conflict with global */
.login-container {
  display: flex;
  height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

/* --- LEFT PANEL --- */
.login-left {
  flex: 1;
  background-color: var(--couleur-primaire, #1A2234);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.left-content {
  max-width: 480px;
}

.brand-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
}

.text-green {
  color: var(--couleur-succes, #22C55E);
}

.brand-subtitle {
  font-size: 16px;
  color: #9CA3AF;
  line-height: 1.6;
  margin-bottom: 60px;
}

.stats-container {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #9CA3AF;
}

/* --- RIGHT PANEL --- */
.login-right {
  flex: 1;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-box {
  width: 100%;
  max-width: 400px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.app-logo {
  width: 200px;
  height: auto;
  object-fit: contain;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrapper:focus-within {
  border-color: var(--couleur-succes, #22C55E);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  background-color: #FFFFFF;
}

.input-icon {
  padding: 0 12px;
  color: #9CA3AF;
  display: flex;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 12px 12px 0;
  font-size: 14px;
  color: #111827;
  outline: none;
}

.input-reset {
  /* Override global styles that might interfere */
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  margin: 0 !important;
  width: 100% !important;
}

.toggle-password {
  background: none;
  border: none;
  padding: 0 12px;
  color: #9CA3AF;
  cursor: pointer;
  display: flex;
}

.toggle-password:hover {
  color: #4B5563;
}

.btn-submit {
  background-color: var(--couleur-primaire, #1A2234);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* --- FORGOT PASSWORD MODAL --- */
.modal-overlay-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.forgot-modal {
  background-color: var(--couleur-primaire, #1A2234);
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header-custom {
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-supertitle {
  font-size: 10px;
  font-weight: 600;
  color: #9CA3AF;
  letter-spacing: 1px;
  margin-bottom: 4px;
  display: block;
}

.modal-title-custom {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.btn-close-custom {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.btn-close-custom:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-steps {
  display: flex;
  align-items: center;
  padding: 0 32px 24px;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
}

.step-completed, .step-current {
  color: white;
}

.step-pending {
  color: #6B7280;
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
}

.step-completed .step-icon {
  background-color: var(--couleur-succes, #22C55E);
  color: white;
}

.step-current .step-icon {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.step-pending .step-icon {
  background-color: transparent;
  border: 1px solid #4B5563;
  color: #6B7280;
}

.step-line {
  flex: 1;
  height: 1px;
  background-color: #374151;
  margin: 0 12px;
}

.line-active {
  background-color: var(--couleur-succes, #22C55E);
}

.modal-body-custom {
  background-color: white;
  padding: 32px;
  border-radius: 16px;
}

.step-desc {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.5;
  margin: 0;
}

.mt-6 {
  margin-top: 24px;
}

.btn-modal-submit {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-modal-submit {
  background-color: #9CA3AF;
  color: white;
}

.btn-modal-submit.btn-active,
.step-content > .btn-modal-submit:not(.btn-disabled) {
  background-color: #9CA3AF; /* Fallback */
}

/* Active states for buttons in steps */
.step-content:nth-child(1) .btn-modal-submit,
.btn-modal-submit.btn-active {
  background-color: #9CA3AF;
}

.step-content:nth-child(1) .btn-modal-submit {
   background-color: #9CA3AF; /* We want a grey button like in design until conditions are met, wait no, screenshot shows it greyish purple, let's use a standard grey/purple */
   background-color: #8CA3AF; 
}

/* Looking at the screenshots, the "Vérifier le code", "Envoyer le code", "Réinitialiser" buttons in the modal are a muted grayish blue (#8892a3 or similar) */
.btn-modal-submit {
  background-color: #949eb0;
  color: white;
}

.btn-modal-submit:hover:not(:disabled) {
  opacity: 0.9;
  background-color: #7b8599;
}

.code-inputs {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.code-input {
  width: 48px;
  height: 56px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  outline: none;
  transition: all 0.2s;
}

.code-input:focus {
  border-color: var(--couleur-succes, #22C55E);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 16px;
}

.link-back {
  font-size: 14px;
  color: #6B7280;
  text-decoration: none;
  font-weight: 500;
}

.link-back:hover {
  color: #111827;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-left {
    display: none; /* Hide left panel on mobile */
  }
  
  .login-right {
    padding: 24px;
  }
}
</style>
