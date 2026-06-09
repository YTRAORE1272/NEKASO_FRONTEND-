<template>
  <header class="header-locataire">
    <div class="container">
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
            <path d="M9 9h6"></path>
            <path d="M9 15h6"></path>
            <path d="M9 12h6"></path>
          </svg>
        </div>
        <span class="logo-text">NEKASO</span>
      </router-link>

      <nav class="nav">
        <router-link to="/catalogue" class="nav-link">Liste des biens</router-link>
        <router-link to="/locataire/mes-locations" class="nav-link">Mes locations</router-link>
        <router-link to="/locataire/contrat-paiements" class="nav-link">Contrat & Paiements</router-link>
      </nav>

      <div class="actions">
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
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const logout = async () => {
  await authStore.logout()
  toast.success('Déconnexion réussie')
  router.push('/login')
}
</script>

<style scoped>
.header-locataire {
  background-color: #1e293b; /* Dark navy matching the image */
  color: white;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
}

.logo-text {
  font-weight: 700;
  letter-spacing: -0.5px;
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
</style>
