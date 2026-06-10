import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import { biensService } from '@/services/biens.service' // Commenté en attendant l'API
import { mockBiens } from '@/services/mockData'

export const useBiensStore = defineStore('biens', () => {
  const biens = ref([])
  const chargement = ref(false)
  const erreur = ref(null)

  // ─── Statistiques calculées côté frontend ─────────────────────────────────
  const totalBiens = computed(() => biens.value.length)

  const biensDisponibles = computed(() => biens.value.filter((b) => b.statutBien === 'DISPONIBLE'))
  const biensLoues = computed(() => biens.value.filter((b) => b.statutBien === 'LOUE'))
  const biensReserves = computed(() => biens.value.filter((b) => b.statutBien === 'RESERVE'))

  // ─── GET /api/biens/gestionnaire (MOCK) ──────────────────────────────────
  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      // Simulation API : délai de 500ms
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Si on n'a pas encore chargé les biens, on prend les mockData
      // Sinon on garde ce qu'on a en mémoire (pour conserver les ajouts/modifs)
      if (biens.value.length === 0) {
        // Deep copy pour éviter de muter le mock original accidentellement
        biens.value = JSON.parse(JSON.stringify(mockBiens))
      }
    } catch (e) {
      erreur.value = 'Impossible de charger les biens. Réessayez.'
      console.error('Erreur chargement biens:', e)
    } finally {
      chargement.value = false
    }
  }

  // ─── POST /api/biens (MOCK) ──────────────────────────────────────────────
  async function creer(donnees) {
    chargement.value = true
    erreur.value = null
    try {
      // Construction du FormData juste pour simuler le futur comportement
      const formData = buildFormData(donnees)
      if (import.meta.env.DEV) console.log('Mock API - POST /biens avec FormData:', formData)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulation de création côté client
      const nouveauBien = {
        id: Date.now(), // ID généré temporairement
        intitule: donnees.intitule,
        typeBien: donnees.typeBien,
        adresse: donnees.adresse,
        surface: donnees.surface,
        nombrePieces: donnees.nombrePieces,
        loyer: donnees.loyer,
        charges: donnees.charges || 0,
        statutBien: 'DISPONIBLE',
        description: donnees.description,
        dateAjout: new Date().toISOString().split('T')[0],
        photos: [],
      }

      // Simulation d'upload de photos
      if (donnees.photos && donnees.photos.length > 0) {
        donnees.photos.forEach((file, index) => {
          // En vrai, l'API renverrait une URL. Ici on utilise createObjectURL
          nouveauBien.photos.push({
            id: Date.now() + index,
            urlPhoto: URL.createObjectURL(file),
            dateUpload: new Date().toISOString().split('T')[0],
          })
        })
      }

      // Ajout au début de la liste
      biens.value.unshift(nouveauBien)
    } catch (e) {
      erreur.value = 'Impossible de créer le bien.'
      console.error('Erreur création bien:', e)
      throw e
    } finally {
      chargement.value = false
    }
  }

  // ─── PUT /api/biens/{id} (MOCK) ──────────────────────────────────────────
  async function modifier(id, donnees) {
    chargement.value = true
    erreur.value = null
    try {
      // Construction du FormData pour le mock
      const formData = buildFormData(donnees)
      if (import.meta.env.DEV) console.log(`Mock API - PUT /biens/${id} avec FormData:`, formData)

      await new Promise((resolve) => setTimeout(resolve, 500))

      const index = biens.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        // Mise à jour des champs texte
        biens.value[index] = {
          ...biens.value[index],
          intitule: donnees.intitule,
          typeBien: donnees.typeBien,
          adresse: donnees.adresse,
          surface: donnees.surface,
          nombrePieces: donnees.nombrePieces,
          loyer: donnees.loyer,
          charges: donnees.charges || 0,
          description: donnees.description,
        }

        // Simulation d'ajout de nouvelles photos
        if (donnees.photos && donnees.photos.length > 0) {
          donnees.photos.forEach((file, i) => {
            biens.value[index].photos.push({
              id: Date.now() + i,
              urlPhoto: URL.createObjectURL(file),
              dateUpload: new Date().toISOString().split('T')[0],
            })
          })
        }
      }
    } catch (e) {
      erreur.value = 'Impossible de modifier le bien.'
      console.error('Erreur modification bien:', e)
      throw e
    } finally {
      chargement.value = false
    }
  }

  // ─── PATCH /api/biens/{id}/archiver (MOCK) ───────────────────────────────
  async function archiver(id) {
    try {
      if (import.meta.env.DEV) console.log(`Mock API - PATCH /biens/${id}/archiver`)
      await new Promise((resolve) => setTimeout(resolve, 300))

      const bien = biens.value.find((b) => b.id === id)
      if (bien) bien.statutBien = 'ARCHIVE'
    } catch (e) {
      erreur.value = "Impossible d'archiver le bien."
      console.error('Erreur archivage bien:', e)
      throw e
    }
  }

  // ─── DELETE /api/biens/{bienId}/photos/{photoId} (MOCK) ──────────────────
  async function supprimerPhoto(bienId, photoId) {
    try {
      if (import.meta.env.DEV) console.log(`Mock API - DELETE /biens/${bienId}/photos/${photoId}`)
      await new Promise((resolve) => setTimeout(resolve, 300))

      const bien = biens.value.find((b) => b.id === bienId)
      if (bien) {
        bien.photos = bien.photos.filter((p) => p.id !== photoId)
      }
    } catch (e) {
      console.error('Erreur suppression photo:', e)
      throw e
    }
  }

  // ─── Utilitaire : construit le FormData pour POST et PUT ──────────────────
  function buildFormData(donnees) {
    const fd = new FormData()
    if (donnees.typeBien) fd.append('typeBien', donnees.typeBien)
    if (donnees.adresse) fd.append('adresse', donnees.adresse)
    if (donnees.surface) fd.append('surface', donnees.surface)
    if (donnees.nombrePieces) fd.append('nombrePieces', donnees.nombrePieces)
    if (donnees.loyer) fd.append('loyer', donnees.loyer)
    if (donnees.description) fd.append('description', donnees.description)

    if (donnees.photos && donnees.photos.length > 0) {
      donnees.photos.forEach((fichier) => {
        fd.append('photos[]', fichier)
      })
    }
    return fd
  }

  return {
    biens,
    chargement,
    erreur,
    totalBiens,
    biensDisponibles,
    biensLoues,
    biensReserves,
    charger,
    creer,
    modifier,
    archiver,
    supprimerPhoto,
  }
})
