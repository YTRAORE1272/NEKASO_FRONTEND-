<template>
  <div class="auth-layout">
    <HeaderPublic />
    
    <div class="auth-content">
      <!-- BANNER (Contextual) -->
      <div v-if="authStore.pendingAction" class="alert-banner">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        Inscription rapide (< 1 min) — votre demande sera traitée juste après.
      </div>

      <div class="auth-card">
        <!-- TABS -->
        <div class="tabs">
          <button class="tab" :class="{ 'tab-active': activeTab === 'login' }" @click="switchTab('login')">Connexion</button>
          <button class="tab" :class="{ 'tab-active': activeTab === 'register' }" @click="switchTab('register')">Inscription</button>
        </div>

        <div class="auth-body">
          <!-- ================= LOGIN TAB ================= -->
          <div v-if="activeTab === 'login'">
            <h1 class="auth-title">Bon retour !</h1>
            <p class="auth-subtitle">Connectez-vous à votre compte NEKASO</p>

            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label>Téléphone</label>
                <div class="input-wrapper">
                  <span class="input-prefix">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>+221</span>
                  </span>
                  <input type="tel" v-model="loginForm.telephone" placeholder="77 123 45 67" required />
                </div>
              </div>

              <div class="form-group">
                <label>Mot de passe</label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input :type="showPassword ? 'text' : 'password'" v-model="loginForm.motDePasse" placeholder="••••••••" required />
                </div>
              </div>

              <button type="submit" class="btn-submit" :disabled="authStore.isLoading">
                {{ authStore.isLoading ? 'Connexion...' : 'Se connecter' }}
                <svg v-if="!authStore.isLoading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>

          <!-- ================= REGISTER TAB ================= -->
          <div v-if="activeTab === 'register'">
            <!-- STEPS INDICATOR -->
            <div class="step-indicator">
              <div class="step" :class="{ 'step-active': currentStep === 1, 'step-completed': currentStep > 1 }">
                <span class="step-circle">
                  <svg v-if="currentStep > 1" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span v-else>1</span>
                </span>
              </div>
              <div class="step-line" :class="{ 'line-completed': currentStep > 1 }"></div>
              
              <div class="step" :class="{ 'step-active': currentStep === 2, 'step-completed': currentStep > 2 }">
                <span class="step-circle">
                  <svg v-if="currentStep > 2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span v-else>2</span>
                </span>
              </div>
              <div class="step-line" :class="{ 'line-completed': currentStep > 2 }"></div>
              
              <div class="step" :class="{ 'step-active': currentStep === 3 }">
                <span class="step-circle">3</span>
              </div>
            </div>

            <!-- CONTENT STEP 1 -->
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="auth-title">Votre identité</h2>
              
              <form @submit.prevent="submitStep1" class="auth-form">
                <div class="form-group">
                  <label>Nom complet</label>
                  <div class="input-wrapper">
                    <span class="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </span>
                    <input type="text" v-model="registerForm.nom" placeholder="Aminata Diop" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Téléphone WhatsApp</label>
                  <div class="input-wrapper">
                    <span class="input-prefix">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      <span>+221</span>
                    </span>
                    <input type="tel" v-model="registerForm.telephone" placeholder="77 123 45 67" required />
                  </div>
                </div>

                <button type="submit" class="btn-submit" :disabled="authStore.isLoading">
                  {{ authStore.isLoading ? 'Envoi...' : 'Recevoir le code WhatsApp' }}
                  <svg v-if="!authStore.isLoading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>
            </div>

            <!-- CONTENT STEP 2 -->
            <div v-if="currentStep === 2" class="step-content text-center">
              <div class="whatsapp-bubble">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              
              <h2 class="auth-title">Vérification WhatsApp</h2>
              <p class="auth-subtitle">Code envoyé au +221 {{ registerForm.telephone }}</p>

              <div class="code-inputs">
                <input v-for="(digit, index) in 4" :key="index" type="text" maxlength="1" class="code-input" 
                  v-model="registerForm.code[index]" @input="handleCodeInput(index, $event)" 
                  @keydown="handleCodeKeydown(index, $event)" :ref="el => { if (el) codeInputRefs[index] = el }" />
              </div>

              <button class="btn-submit" @click="submitStep2" :disabled="!isCodeComplete || authStore.isLoading">
                Vérifier
              </button>

              <div class="resend-link">
                Pas reçu ? <a href="#" @click.prevent="resendCode" class="link-bold">Renvoyer</a>
              </div>
            </div>

            <!-- CONTENT STEP 3 -->
            <div v-if="currentStep === 3" class="step-content">
              <h2 class="auth-title">Créez votre mot de passe</h2>

              <form @submit.prevent="submitStep3" class="auth-form">
                <div class="form-group">
                  <label>Mot de passe</label>
                  <div class="input-wrapper">
                    <span class="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input :type="showPassword ? 'text' : 'password'" v-model="registerForm.motDePasse" placeholder="Minimum 8 caractères" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Confirmer le mot de passe</label>
                  <div class="input-wrapper">
                    <span class="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input :type="showPassword ? 'text' : 'password'" v-model="registerForm.confirmPassword" placeholder="••••••••" required />
                  </div>
                </div>

                <button type="submit" class="btn-submit btn-success" :disabled="!canSubmit || authStore.isLoading">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Créer mon compte
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'
import HeaderPublic from '@/components/layout/HeaderPublic.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const activeTab = ref('login')
const showPassword = ref(false)

// Login state
const loginForm = reactive({
  telephone: '',
  motDePasse: '',
})

// Register state
const currentStep = ref(1)
const codeInputRefs = ref([])
const registerForm = reactive({
  nom: '',
  telephone: '',
  code: ['', '', '', ''],
  motDePasse: '',
  confirmPassword: ''
})

const isCodeComplete = computed(() => registerForm.code.every(digit => digit.length === 1))
const canSubmit = computed(() => registerForm.motDePasse.length >= 8 && registerForm.motDePasse === registerForm.confirmPassword)

onMounted(() => {
  // Si une action est en attente (demande visite/location), on ouvre directement l'inscription
  // pour respecter le parcours stepper en 3 étapes.
  if (authStore.pendingAction) {
    activeTab.value = 'register'
  }
})

const switchTab = (tab) => {
  activeTab.value = tab
}

const handlePostAuthRedirect = (userRole) => {
  if (authStore.pendingAction) {
    // Si une demande de visite ou location était en attente, retourner sur la fiche bien
    router.push(`/biens/${authStore.pendingAction.bienId}`)
  } else {
    // Redirection classique
    if (userRole === 'GESTIONNAIRE') {
      router.push('/gestionnaire/dashboard')
    } else {
      router.push('/locataire/mes-locations')
    }
  }
}

const handleLogin = async () => {
  if (!loginForm.telephone || !loginForm.motDePasse) {
    toast.error('Veuillez remplir tous les champs')
    return
  }

  const result = await authStore.login(loginForm.telephone, loginForm.motDePasse)

  if (result.success) {
    toast.success('Connexion réussie')
    handlePostAuthRedirect(result.user.role)
  } else {
    toast.error(result.error || 'Erreur de connexion')
  }
}

// Register methods
const submitStep1 = async () => {
  if (!registerForm.nom || !registerForm.telephone) {
    toast.error('Veuillez remplir tous les champs')
    return
  }
  toast.info('Code envoyé au ' + registerForm.telephone)
  currentStep.value = 2
  setTimeout(() => {
    if (codeInputRefs.value[0]) codeInputRefs.value[0].focus()
  }, 100)
}

const submitStep2 = async () => {
  if (!isCodeComplete.value) return
  toast.success('Code vérifié')
  currentStep.value = 3
}

const submitStep3 = async () => {
  if (!canSubmit.value) return
  if (registerForm.motDePasse !== registerForm.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }
  const result = await authStore.register(registerForm.nom, registerForm.telephone, registerForm.motDePasse)
  if (result.success) {
    toast.success('Compte créé avec succès')
    handlePostAuthRedirect('LOCATAIRE')
  } else {
    toast.error(result.error || 'Erreur lors de la création du compte')
  }
}

const resendCode = () => {
  toast.info('Code renvoyé par WhatsApp')
}

const handleCodeInput = (index, event) => {
  const value = event.target.value
  registerForm.code[index] = value.replace(/\D/g, '').slice(0, 1)
  if (registerForm.code[index] && index < 3) {
    codeInputRefs.value[index + 1].focus()
  }
}

const handleCodeKeydown = (index, event) => {
  if (event.key === 'Backspace' && !registerForm.code[index] && index > 0) {
    codeInputRefs.value[index - 1].focus()
  }
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.auth-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* BANNER */
.alert-banner {
  background-color: #fff7ed;
  border: 1px solid #fdba74;
  color: #c2410c;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  width: 100%;
  max-width: 480px;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

/* TABS */
.tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-active {
  color: #1e293b;
  border-bottom-color: #22c55e;
}

.tab:hover:not(.tab-active) {
  color: #475569;
}

/* BODY */
.auth-body {
  padding: 32px 40px 40px;
}

.auth-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.auth-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

/* FORM */
.auth-form {
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
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  border-color: #22c55e;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.input-prefix {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  border-right: 1px solid #e2e8f0;
}

.input-icon {
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #94a3b8;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  width: 100%;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

/* BUTTON */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #1e293b;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #0f172a;
}

.btn-submit.btn-success {
  background-color: #22c55e;
}

.btn-submit.btn-success:hover:not(:disabled) {
  background-color: #16a34a;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* STEPS INDICATOR */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.step-active .step-circle {
  background-color: #eff6ff;
  color: #3b82f6;
  border-color: #3b82f6;
}

.step-completed .step-circle {
  background-color: #22c55e;
  color: #ffffff;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e2e8f0;
  margin: 0 12px;
  margin-bottom: 16px;
  max-width: 60px;
  transition: background-color 0.3s;
}

.step-line.line-completed {
  background-color: #22c55e;
}

.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-center {
  text-align: center;
}

/* WHATSAPP VERIFICATION */
.whatsapp-bubble {
  width: 56px;
  height: 56px;
  background-color: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.whatsapp-bubble svg {
  color: #22c55e;
}

.code-inputs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 32px 0;
}

.code-input {
  width: 48px;
  height: 56px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: #0f172a;
  background-color: #f8fafc;
  transition: all 0.2s;
}

.code-input:focus {
  border-color: #22c55e;
  background-color: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.resend-link {
  margin-top: 24px;
  font-size: 13px;
  color: #64748b;
}

.link-bold {
  color: #1e293b;
  font-weight: 700;
  text-decoration: none;
}

.link-bold:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-body {
    padding: 24px 20px 32px;
  }
}
</style>
