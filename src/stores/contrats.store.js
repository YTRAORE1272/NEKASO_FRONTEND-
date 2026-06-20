import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STATUT_CONTRAT, STATUTS_PRE_CONTRAT, STATUT_ECHEANCE } from '@/utils/constants'
import { usePreContratsStore } from '@/stores/preContrats.store'
import { contratsService } from '@/services/contrats.service'
import { mapContrat, mapBien } from '@/services/mappers'
import { useAuthStore } from '@/stores/auth.store'

export const useContratsStore = defineStore('contrats', () => {
  const preContratsStore = usePreContratsStore()
  const authStore = useAuthStore()

  const contratsDefinitifs = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  function normaliser(c) {
    const m = mapContrat(c)
    return {
      ...m,
      statut: m.statut ?? STATUT_CONTRAT.ACTIF,
      dateCreation: c.dateCreation ?? m.dateDebut ?? new Date().toISOString(),
      locataire: c.locataire ?? c.client ?? null,
      bien: c.bien ? mapBien(c.bien) : null,
    }
  }

  function _extraire(res) {
    const body = res?.data ?? res
    if (Array.isArray(body?.items)) return body.items
    if (Array.isArray(body?.content)) return body.content
    if (Array.isArray(body?.data)) return body.data
    if (Array.isArray(body)) return body
    return []
  }

  async function chargerGestionnaire() {
    chargement.value = true
    erreur.value = null
    try {
      await preContratsStore.chargerGestionnaire({ size: 100 })
      const res = await contratsService.getParGestionnaire({ size: 100 })
      contratsDefinitifs.value = _extraire(res).map(normaliser)
    } catch (e) {
      console.error('Erreur chargerGestionnaire contrats:', e)
      erreur.value = 'Erreur lors du chargement des contrats'
    } finally {
      chargement.value = false
    }
  }

  async function chargerLocataire() {
    chargement.value = true
    erreur.value = null
    try {
      await preContratsStore.chargerLocataire({ size: 100 })
      const res = await contratsService.getParLocataire({ size: 100 })
      contratsDefinitifs.value = _extraire(res).map(normaliser)
    } catch (e) {
      console.error('Erreur chargerLocataire contrats:', e)
      erreur.value = 'Erreur lors du chargement des contrats'
    } finally {
      chargement.value = false
    }
  }


  async function creerContratDefinitif(preContratId) {
    chargement.value = true
    try {
      const res = await contratsService.creer(preContratId)
      if (authStore.isGestionnaire) await chargerGestionnaire()
      else await chargerLocataire()
      return res?.data ?? null
    } catch (e) {
      console.error('Erreur création contrat définitif:', e)
      throw e
    } finally {
      chargement.value = false
    }
  }

  const contrats = computed(() => [...preContratsStore.preContrats, ...contratsDefinitifs.value])
  
  const preContrats = computed(() => preContratsStore.preContrats)
  const actifs = computed(() => contratsDefinitifs.value)

  function filtrer(query = '') {
    const q = query.trim().toLowerCase()
    if (!q) return contrats.value
    return contrats.value.filter(c => {
      const tel = (c.locataire?.telephone || c.client?.telephone || '').toLowerCase()
      const nom = `${c.locataire?.prenom || c.client?.prenom || ''} ${c.locataire?.nom || c.client?.nom || ''}`.toLowerCase()
      const num = (c.numero || c.reference || '').toLowerCase()
      return tel.includes(q) || nom.includes(q) || num.includes(q)
    })
  }

  const mesContrats = computed(() => contrats.value)
  const mesPreContratsAValider = computed(() =>
    preContratsStore.preContrats.filter(c =>
      [STATUT_CONTRAT.PRE_CONTRAT_ENVOYE, STATUT_CONTRAT.PRE_CONTRAT_CORRIGE].includes(c.statut),
    ),
  )
  const mesContratsActifs = computed(() => contratsDefinitifs.value)

  function getContratHydrate(id) {
    return contrats.value.find(c => Number(c.id) === Number(id)) ?? null
  }

  function genererEcheances(contrat) {
    if (!contrat) return []
    const debut = new Date(contrat.dateDebut || contrat.dateDebutPrevu || Date.now())
    const jour = contrat.jourEcheance || contrat.jourEcheanceLoyer || contrat.jourEcheancePaiement || 5
    const montant = Number(contrat.montantLoyer) || 0
    const maintenant = new Date()
    const echeances = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(debut.getFullYear(), debut.getMonth() + i, Math.min(jour, 28))
      echeances.push({
        id: i + 1,
        dateEcheance: d.toISOString().split('T')[0],
        montant,
        statut: d < maintenant ? STATUT_ECHEANCE.EN_RETARD : STATUT_ECHEANCE.A_PAYER,
      })
    }
    return echeances
  }

  function definirEcheances(id, echeances) {
    const cible =
      preContratsStore.preContrats.find(c => Number(c.id) === Number(id)) ||
      contratsDefinitifs.value.find(c => Number(c.id) === Number(id))
    if (cible) cible.echeances = echeances
  }

  async function envoyerRetours(id, message) {
    await preContratsStore.invalider(id)
    return message
  }

  return {
    contratsDefinitifs,
    chargement,
    erreur,
    contrats,
    preContrats,
    actifs,
    mesContrats,
    mesPreContratsAValider,
    mesContratsActifs,
    chargerGestionnaire,
    chargerLocataire,
    creerContratDefinitif,
    filtrer,
    getContratHydrate,
    genererEcheances,
    definirEcheances,
    envoyerRetours,
  }
})
