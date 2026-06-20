import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { visitesService } from '@/services/visites.service'
import { unwrapList, listeOuVide } from '@/utils/apiResponse'

/*
  Store visites côté GESTIONNAIRE — branché sur le VRAI backend.
  Endpoints :
    GET   /api/visites/gestionnaire/demande                          (statut?, page, size)
    PATCH /api/visites/gestionnaire/demande/{id}/statut/{statut}
    PATCH /api/visites/gestionnaire/demande/{id}/confirmer/bien/{idBien}/agent/{idAgent}
*/
export const useVisitesGestionnaireStore = defineStore('visitesGestionnaire', () => {
  const visites = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  // Filtres côté client en attendant la pagination serveur complète.
  const enAttente  = computed(() => visites.value.filter((v) => v.statut === 'EN_ATTENTE'))
  const validees   = computed(() => visites.value.filter((v) => ['VALIDEE', 'CONFIRMEE'].includes(v.statut)))
  const confirmees = computed(() => visites.value.filter((v) => v.statut === 'CONFIRMEE'))
  const cloturees  = computed(() =>
    visites.value.filter((v) =>
      ['CLOTUREE_AVEC_CONTRAT', 'CLOTUREE_SANS_CONTRAT'].includes(v.statut),
    ),
  )

  /**
   * Charge toutes les visites (toutes pages) depuis le backend.
   * On pagine côté serveur avec size=50 par défaut pour récupérer l'essentiel.
   */
  async function charger(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      visites.value = await listeOuVide(visitesService.getListe({ page: 0, size: 50, ...params }))
    } catch (e) {
      erreur.value = 'Impossible de charger les visites.'
      console.error('Erreur chargement visites gestionnaire:', e?.response?.status, e?.response?.data)
    } finally {
      chargement.value = false
    }
  }

  /** Changer le statut d'une visite (ex : REFUSEE). */
  async function changerStatut(id, statut) {
    await visitesService.changerStatut(id, statut)
    await charger()
  }

  /** Raccourci : refuser une visite. */
  async function refuser(id) {
    await visitesService.refuser(id)
    await charger()
  }

  /** Confirmer une visite (affecter créneau + agent). */
  async function confirmer(id, idBien, idAgent) {
    await visitesService.confirmer(id, idBien, idAgent)
    await charger()
  }

  return {
    visites,
    chargement,
    erreur,
    enAttente,
    validees,
    confirmees,
    cloturees,
    charger,
    changerStatut,
    refuser,
    confirmer,
  }
})
