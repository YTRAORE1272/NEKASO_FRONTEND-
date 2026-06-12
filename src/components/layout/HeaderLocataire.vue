<template>
  <header class="header-locataire">
    <div class="container">
      <router-link to="/locataire/mes-locations" class="logo">
        <img src="/logo-nekaso.png?v=2" alt="NEKASO" class="logo-icon" />
      </router-link>

      <nav class="nav">
        <router-link to="/" class="nav-link">Accueil</router-link>
        <router-link to="/locataire/mes-locations" class="nav-link">Mes locations</router-link>
        <router-link to="/locataire/mes-demandes-visites" class="nav-link">Mes demandes de visite</router-link>
        <router-link to="/locataire/mes-demandes-locations" class="nav-link">Mes demandes de location</router-link>
      </nav>

      <div class="actions">
        <!-- mobile toggle -->
        <button class="mobile-toggle" @click="mobileOpen = !mobileOpen" aria-label="Menu" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line v-if="!mobileOpen" x1="3" y1="6" x2="21" y2="6" />
            <line v-if="!mobileOpen" x1="3" y1="12" x2="21" y2="12" />
            <line v-if="!mobileOpen" x1="3" y1="18" x2="21" y2="18" />
            <path v-if="mobileOpen" d="M18 6 6 18" />
            <path v-if="mobileOpen" d="m6 6 12 12" />
          </svg>
        </button>
        <button @click="logout" class="btn-logout" title="Se déconnecter">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
    <Transition name="slide">
      <div v-if="mobileOpen" class="mobile-menu">
        <router-link to="/" class="mobile-link" @click="mobileOpen = false">Accueil</router-link>
        <router-link to="/locataire/mes-locations" class="mobile-link" @click="mobileOpen = false">Mes locations</router-link>
        <router-link to="/locataire/mes-demandes-visites" class="mobile-link" @click="mobileOpen = false">Mes demandes de visite</router-link>
        <router-link to="/locataire/mes-demandes-locations" class="mobile-link" @click="mobileOpen = false">Mes demandes de location</router-link>
        <button class="mobile-link mobile-logout" @click="mobileOpen = false; logout()">Se déconnecter</button>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const logout = () => {
  authStore.logout()
  toast.success('Déconnexion réussie')
  router.push('/login')
}

const mobileOpen = ref(false)

// Close mobile menu on route change
router.afterEach(() => { mobileOpen.value = false })
</script>

<style scoped>
.header-locataire {
  background-color: #1e293b;
  color: white;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 82px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  min-width: 96px;
}

.logo-icon {
  width: 78px;
  height: 78px;
  object-fit: contain;
  display: block;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: white;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.actions {
  display: flex;
  align-items: center;
}

.btn-logout {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.btn-logout:hover {
  color: white;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
}

/* Mobile styles */
.mobile-toggle { display: none; background: none; border: none; color: #ffffff; cursor: pointer; padding: 4px; margin-right: 8px }
.mobile-menu { display: none }
.mobile-link { display: block; color: #ffffff; text-decoration: none; padding: 12px 24px; border-top: 1px solid rgba(255,255,255,0.06); font-weight:500 }
.mobile-link.mobile-logout { background: transparent; border: none; text-align: left; width:100%; cursor:pointer }

.slide-enter-active, .slide-leave-active { transition: all 0.25s ease }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px) }

@media (max-width: 768px) {
  .container { height: 68px }
  .logo-icon { width: 56px; height: 56px }
  .mobile-toggle { display: flex }
  .btn-logout { display: none }
  .mobile-menu { display: flex; flex-direction: column; background: #1e293b; border-top: 1px solid rgba(255,255,255,0.06) }
}
</style>
