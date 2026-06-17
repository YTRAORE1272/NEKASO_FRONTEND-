import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demandesLocationService } from '@/services/demandes-location.service'

export const useDemandesLocationStore = defineStore('demandesLocation', () => {
  const demandes = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  const enAttente = computed(() => demandes.value.filter((d) => d.statut === 'EN_ATTENTE'))
  const validees = computed(() =>
    demandes.value.filter((d) => ['VALIDEE', 'ACCEPTEE'].includes(d.statut)),
  )
  const refusees = computed(() =>
    demandes.value.filter((d) => ['REFUSEE', 'REFUSE'].includes(d.statut)),
  )

  // GET /api/demandes/gestionnaire
  async function charger(params = {}) {
    chargement.value = true
    erreur.value = null
    try {
      const res = await demandesLocationService.getListe(params)
      const data = res?.data
      // Debug : log la réponse brute pour aider le diagnostic en dev
      // eslint-disable-next-line no-console
      console.debug('demandesLocation - réponse API:', data)

      // Supporte plusieurs formes de payloads : array | { data: [...] } | { content: [...] } | { items: [...] }
      let liste = []
      if (Array.isArray(data)) {
        liste = data
      } else if (Array.isArray(data?.data)) {
        liste = data.data
      } else if (Array.isArray(data?.content)) {
        liste = data.content
      } else if (Array.isArray(data?.items)) {
        liste = data.items
      } else if (Array.isArray(data?.results)) {
        liste = data.results
      } else if (data && typeof data === 'object') {
        // Cherche quelques clés courantes supplémentaires
        const candidates = ['demandes', 'requests', 'rows']
        for (const k of candidates) {
          if (Array.isArray(data[k])) {
            liste = data[k]
            break
          }
        }
      }

      demandes.value = liste
    } catch (e) {
      const status = e.response?.status
      const data = e.response?.data
      erreur.value =
        data?.message ||
        `Impossible de charger les demandes de location (status ${status || 'réseau'})`
      // eslint-disable-next-line no-console
      console.error('Erreur chargement demandes:', { status, data, message: e.message })
    } finally {
      chargement.value = false
    }
  }

  // PATCH /api/demandes/demande/{id}/accepter
  async function valider(id) {
    try {
      await demandesLocationService.valider(id)
    } catch (e) {
      console.warn('Erreur API valider demande, mise à jour locale', e)
    }
    demandes.value = demandes.value.map((d) => (d.id === id ? { ...d, statut: 'ACCEPTEE' } : d))
  }

  // PATCH /api/demandes/demande/{id}/refuser
  async function refuser(id) {
    try {
      await demandesLocationService.refuser(id)
    } catch (e) {
      console.warn('Erreur API refuser demande, mise à jour locale', e)
    }
    demandes.value = demandes.value.map((d) => (d.id === id ? { ...d, statut: 'REFUSEE' } : d))
  }

  return { demandes, chargement, erreur, enAttente, validees, refusees, charger, valider, refuser }
})
