import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contratsService } from '@/services/contrats.service'
import { mockContrats, mockCandidats, mockBiens } from '@/services/mockData'

export const useContratsStore = defineStore('contrats', () => {
  /* ───── État principal ───── */
  const contrats = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  /* ───── Candidats (visites confirmées) et biens disponibles ───── */
  const candidats = ref([])
  const biensDisponibles = ref([])

  /* ───── Filtres par statut ───── */
  const enCours = computed(() => contrats.value.filter((c) => c.statut === 'EN_COURS'))
  const expires = computed(() => contrats.value.filter((c) => c.statut === 'EXPIRE'))
  const archives = computed(() => contrats.value.filter((c) => c.statut === 'ARCHIVE'))

  /* ───── Chargement des contrats ───── */
  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      // TODO : const res = await contratsService.getListe()
      // contrats.value = res.data
      await new Promise((r) => setTimeout(r, 400))
      contrats.value = mockContrats
    } catch (e) {
      erreur.value = 'Impossible de charger les contrats.'
    } finally {
      chargement.value = false
    }
  }

  /* ───── Chargement des candidats pour le wizard ───── */
  async function chargerCandidats() {
    try {
      // TODO : const res = await contratsService.getCandidats()
      // candidats.value = res.data
      await new Promise((r) => setTimeout(r, 200))
      candidats.value = mockCandidats
    } catch (e) {
      console.error('Erreur chargement candidats:', e)
    }
  }

  /* ───── Chargement des biens disponibles ───── */
  async function chargerBiens(params = {}) {
    try {
      // TODO : const res = await biensService.getMesBiens()
      await new Promise((r) => setTimeout(r, 200))
      biensDisponibles.value = mockBiens
    } catch (e) {
      console.error('Erreur chargement biens:', e)
    }
  }

  /* ───── Création d'un nouveau contrat ───── */
  async function creer(contratData) {
    try {
      const res = await contratsService.creer(contratData)
      const nouveauContrat = res.data
      contrats.value.push(nouveauContrat)
      return nouveauContrat
    } catch (e) {
      if ([401, 403, 500].includes(e.response?.status)) {
        // Backend non authentifié : simulation locale pour les tests
        console.warn('[DEV] Création de contrat simulée localement (pas de token)')
        const nouveauContrat = {
          id: contrats.value.length + 1,
          ...contratData,
          statut: 'EN_COURS',
          dateSignature: new Date().toISOString().split('T')[0],
          cheminPDF: 'https://res.cloudinary.com/dx2imkeka/raw/upload/v1781570714/contrats/contrat_bail_15.pdf',
        }
        contrats.value.push(nouveauContrat)
        return nouveauContrat
      }
      throw new Error('Impossible de créer le contrat.')
    }
  }

  /* ───── Téléchargement PDF ───── */
  async function telechargerPDF(id) {
    try {
      const res = await contratsService.telechargerPDF(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const lien = document.createElement('a')
      lien.href = url
      lien.setAttribute('download', `contrat_${id}.pdf`)
      document.body.appendChild(lien)
      lien.click()
      lien.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Erreur téléchargement PDF:', e)
      // En mode mock, on simule juste un clic
      if (import.meta.env.DEV) console.log(`Téléchargement simulé du contrat #${id}`)
    }
  }

  return {
    contrats,
    chargement,
    erreur,
    candidats,
    biensDisponibles,
    enCours,
    expires,
    archives,
    charger,
    chargerCandidats,
    chargerBiens,
    creer,
    telechargerPDF,
  }
})
