<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <img src="/logo-nekaso.png" alt="NEKASO" class="sidebar-logo-img" />
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <!-- MENU Section -->
      <div class="sidebar-section">
        <span class="sidebar-section-title">MENU</span>
        <RouterLink
          to="/gestionnaire/dashboard"
          class="sidebar-link"
          active-class="sidebar-link--active"
        >
          <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Tableau de bord</span>
        </RouterLink>
        <RouterLink
          to="/gestionnaire/biens"
          class="sidebar-link"
          active-class="sidebar-link--active"
        >
          <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Biens</span>
        </RouterLink>
        <RouterLink
          to="/gestionnaire/visites"
          class="sidebar-link"
          active-class="sidebar-link--active"
        >
          <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Visites</span>
        </RouterLink>
      </div>

      <!-- GESTION Section -->
      <div class="sidebar-section">
        <span class="sidebar-section-title">GESTION</span>
        <RouterLink
          to="/gestionnaire/contrats"
          class="sidebar-link"
          active-class="sidebar-link--active"
        >
          <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Contrats</span>
        </RouterLink>
        <RouterLink
          to="/gestionnaire/paiements"
          class="sidebar-link"
          active-class="sidebar-link--active"
        >
          <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span>Paiements</span>
        </RouterLink>
      </div>

      <!-- OUTILS Section -->
      <div class="sidebar-section">
        <span class="sidebar-section-title">OUTILS</span>
        <RouterLink
          to="/gestionnaire/parametres"
          class="sidebar-link"
          active-class="sidebar-link--active"
        >
          <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>Paramètres</span>
        </RouterLink>
        <button @click="seDeconnecter" class="sidebar-link sidebar-link--button">
          <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

function seDeconnecter() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-largeur);
  height: 100vh;
  background-color: var(--fond-sidebar);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--bordure);
  z-index: 100;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 20px 40px 20px;
}

.sidebar-logo-img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.sidebar-nav {
  flex: 1;
  padding: 0 32px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-section-title {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding-left: 16px;
  margin-bottom: 8px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-radius: 16px;
  color: #475569;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
}

.sidebar-link:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.sidebar-link--active {
  background-color: #222b45;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.sidebar-link--active:hover {
  background-color: #1a233a;
  color: white;
}

.sidebar-link--button {
  background: none;
  text-align: left;
}

.sidebar-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
</style>
