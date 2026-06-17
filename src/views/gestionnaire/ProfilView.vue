<template>
  <div class="page-profil">
    <div class="page-header">
      <h1 class="page-title">Mon profil</h1>
      <p class="page-subtitle">Informations de votre compte gestionnaire</p>
    </div>

    <div class="carte profil-entete">
      <div class="profil-avatar">{{ initiales }}</div>
      <div>
        <h2 class="profil-nom">{{ nomComplet }}</h2>
        <span class="role-badge">Gestionnaire</span>
      </div>
    </div>

    <div class="carte">
      <h3 class="profil-section-label">Informations personnelles</h3>
      <div class="grille-2 profil-grille">
        <div class="champ-lecture">
          <span class="champ-lecture-label">Nom</span>
          <span class="champ-lecture-valeur">{{ utilisateur.nom || '—' }}</span>
        </div>
        <div class="champ-lecture">
          <span class="champ-lecture-label">Prénom</span>
          <span class="champ-lecture-valeur">{{ utilisateur.prenom || '—' }}</span>
        </div>
        <div class="champ-lecture">
          <span class="champ-lecture-label">Téléphone</span>
          <span class="champ-lecture-valeur">{{ utilisateur.telephone || '—' }}</span>
        </div>
        <div class="champ-lecture">
          <span class="champ-lecture-label">Statut</span>
          <span class="champ-lecture-valeur">{{ utilisateur.statut || 'Actif' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const utilisateur = computed(() => authStore.utilisateurCourant)

const nomComplet = computed(() => {
  const complet = `${utilisateur.value.prenom || ''} ${utilisateur.value.nom || ''}`.trim()
  return complet || 'Gestionnaire'
})

const initiales = computed(() => {
  const p = utilisateur.value.prenom?.[0] || ''
  const n = utilisateur.value.nom?.[0] || ''
  return (p + n).toUpperCase() || 'G'
})
</script>

<style scoped>
.profil-entete {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}

.profil-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--couleur-primaire);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profil-nom {
  font-size: 18px;
  font-weight: 700;
  color: var(--texte-principal);
  margin-bottom: 6px;
}

.role-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: #dbeafe;
  color: #1d4ed8;
}

.profil-section-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--texte-secondaire);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 16px;
}

.champ-lecture {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.champ-lecture-label {
  font-size: 12px;
  color: var(--texte-secondaire);
}

.champ-lecture-valeur {
  font-size: 15px;
  font-weight: 600;
  color: var(--texte-principal);
}
</style>
