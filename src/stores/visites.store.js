/**
 * Store Pinia pour la gestion des visites.
 *
 * Responsabilités :
 * - Charger la liste des visites (mock → API)
 * - Filtrer par statut (en attente, confirmées, refusées)
 * - Actions : confirmer, refuser, reprogrammer, créer
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { visitesService } from '@/services/visites.service'
import { mockVisites } from '@/services/mockData'

export const useVisitesStore = defineStore('visites', () => {
  const visites = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  /* ───── Computed : filtres par statut ───── */
  const enAttente = computed(() => visites.value.filter((v) => v.statut === 'EN_ATTENTE'))
  const confirmees = computed(() => visites.value.filter((v) => v.statut === 'CONFIRMEE'))
  const refusees = computed(() => visites.value.filter((v) => v.statut === 'REFUSEE'))

  /* ───── Chargement des visites ───── */
  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      const res = await visitesService.getListe()
      visites.value = res.data
    } catch (e) {
      console.warn('Erreur chargement visites, utilisation des données mock', e)
      // Fallback sur les données mock pour permettre le fonctionnement hors-backend
      await new Promise((r) => setTimeout(r, 400))
      visites.value = mockVisites
      erreur.value =
        'Impossible de charger les visites depuis le serveur. Données locales affichées.'
    } finally {
      chargement.value = false
    }
  }

  /* ───── Confirmer une visite (EN_ATTENTE → CONFIRMEE) ───── */
  async function confirmer(id) {
    try {
      await visitesService.approuver(id)
      visites.value = visites.value.map((v) => (v.id === id ? { ...v, statut: 'CONFIRMEE' } : v))
    } catch (e) {
      console.error('Erreur confirmation visite:', e)
      throw e
    }
  }

  /* ───── Refuser une visite (EN_ATTENTE → REFUSEE) ───── */
  async function refuser(id) {
    try {
      await visitesService.refuser(id)
      visites.value = visites.value.map((v) => (v.id === id ? { ...v, statut: 'REFUSEE' } : v))
    } catch (e) {
      console.error('Erreur refus visite:', e)
      throw e
    }
  }

  /* ───── Reprogrammer une visite (met à jour date + heure) ───── */
  async function reprogrammer(id, nouvelleDate, nouvelleHeure) {
    // TODO : await visitesService.reprogrammer(id, { date, heure })
    visites.value = visites.value.map((v) =>
      v.id === id
        ? { ...v, dateVisite: nouvelleDate, heureVisite: nouvelleHeure, statut: 'EN_ATTENTE' }
        : v,
    )
  }

  /* ───── Créer une nouvelle visite ───── */
  async function creer(nouvelleVisite) {
    // TODO : await visitesService.creer(nouvelleVisite)
    const id = visites.value.length > 0 ? Math.max(...visites.value.map((v) => v.id)) + 1 : 1

    visites.value.push({
      id,
      statut: 'EN_ATTENTE',
      dateCreation: new Date().toISOString().split('T')[0],
      ...nouvelleVisite,
    })
  }

  return {
    visites,
    chargement,
    erreur,
    enAttente,
    confirmees,
    refusees,
    charger,
    confirmer,
    refuser,
    reprogrammer,
    creer,
  }
})
