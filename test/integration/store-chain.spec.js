/**
 * Tests d'intégration — Interactions entre stores
 * Couvre : biens → visites (creer visite pour un bien),
 *          biens → demandesLocation (valider demande met bien en LOUE),
 *          visites → confirmer/refuser cohérence
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBiensStore } from '@/stores/biens.store'
import { useVisitesStore } from '@/stores/visites.store'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'

vi.mock('@/services/visites.service', () => ({
  visitesService: {
    getListe: vi.fn().mockResolvedValue({ data: [] }),
    approuver: vi.fn().mockResolvedValue({}),
    refuser: vi.fn().mockResolvedValue({}),
  },
}))
vi.mock('@/services/demandes-location.service', () => ({
  demandesLocationService: {
    getListe: vi.fn().mockResolvedValue({ data: [] }),
    valider: vi.fn().mockResolvedValue({}),
    refuser: vi.fn().mockResolvedValue({}),
  },
}))

const makeBien = (id, statut = 'DISPONIBLE') => ({
  id, intitule: `Bien ${id}`, statutBien: statut,
  typeBien: 'APPARTEMENT', adresse: 'Dakar',
  surface: 60, nombrePieces: 2, loyer: 200000, photos: [],
})

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

// ══════════════════════════════════════════════════════════════════════════
describe('Biens + Visites — chaîne de création', () => {
  it('créer une visite pour un bien disponible fonctionne', async () => {
    const biensStore = useBiensStore()
    const visitesStore = useVisitesStore()

    biensStore.biens = [makeBien(10)]
    visitesStore.visites = []

    await visitesStore.creer({
      idBien: 10,
      candidat: { nom: 'Diop', telephone: '770000001' },
      dateVisite: '2026-07-15',
      heureVisite: '10:00',
    })

    expect(visitesStore.visites.length).toBe(1)
    expect(visitesStore.visites[0].idBien).toBe(10)
    expect(visitesStore.visites[0].statut).toBe('EN_ATTENTE')
  })

  it('un bien LOUE peut toujours recevoir des demandes de visite', async () => {
    const biensStore = useBiensStore()
    const visitesStore = useVisitesStore()

    biensStore.biens = [makeBien(20, 'LOUE')]
    visitesStore.visites = []

    await visitesStore.creer({ idBien: 20, dateVisite: '2026-07-20', heureVisite: '14:00' })
    expect(visitesStore.visites.length).toBe(1)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Biens + DemandesLocation — validation met le bien en LOUE', () => {
  it('valider une demande puis appeler louer() change le statut du bien', async () => {
    const biensStore = useBiensStore()
    const demandesStore = useDemandesLocationStore()

    biensStore.biens = [makeBien(15)]
    demandesStore.demandes = [{ id: 100, idBien: 15, statut: 'EN_ATTENTE' }]

    // L'action métier : valider la demande puis marquer le bien comme loué
    await demandesStore.valider(100)
    biensStore.louer(15)

    expect(demandesStore.demandes[0].statut).toBe('VALIDEE')
    expect(biensStore.biens[0].statutBien).toBe('LOUE')
  })

  it('refuser une demande ne change pas le statut du bien', async () => {
    const biensStore = useBiensStore()
    const demandesStore = useDemandesLocationStore()

    biensStore.biens = [makeBien(16)]
    demandesStore.demandes = [{ id: 101, idBien: 16, statut: 'EN_ATTENTE' }]

    await demandesStore.refuser(101)

    expect(biensStore.biens[0].statutBien).toBe('DISPONIBLE')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Visites — confirmer/refuser cohérence', () => {
  it('confirmer une visite la sort de enAttente et la place dans confirmees', async () => {
    const store = useVisitesStore()
    store.visites = [
      { id: 1, statut: 'EN_ATTENTE' },
      { id: 2, statut: 'EN_ATTENTE' },
    ]

    await store.confirmer(1)

    expect(store.enAttente.length).toBe(1)
    expect(store.confirmees.length).toBe(1)
    expect(store.confirmees[0].id).toBe(1)
  })

  it('refuser une visite ne la met pas dans confirmees', async () => {
    const store = useVisitesStore()
    store.visites = [{ id: 5, statut: 'EN_ATTENTE' }]

    await store.refuser(5)

    expect(store.confirmees.length).toBe(0)
    expect(store.refusees.length).toBe(1)
    expect(store.enAttente.length).toBe(0)
  })

  it('reprogrammer remet une visite CONFIRMEE en EN_ATTENTE', async () => {
    const store = useVisitesStore()
    store.visites = [{ id: 8, statut: 'CONFIRMEE', dateVisite: '2026-06-01', heureVisite: '09:00' }]

    await store.reprogrammer(8, '2026-06-25', '11:00')

    expect(store.visites[0].statut).toBe('EN_ATTENTE')
    expect(store.enAttente.length).toBe(1)
    expect(store.confirmees.length).toBe(0)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('Biens — cycle de vie complet', () => {
  it('DISPONIBLE → LOUE → DISPONIBLE', () => {
    const store = useBiensStore()
    store.biens = [makeBien(50)]

    store.louer(50)
    expect(store.biens[0].statutBien).toBe('LOUE')
    expect(store.biensLoues.length).toBe(1)

    store.remettreDispo(50)
    expect(store.biens[0].statutBien).toBe('DISPONIBLE')
    expect(store.biensDisponibles.length).toBe(1)
    expect(store.biensLoues.length).toBe(0)
  })

  it('DISPONIBLE → ARCHIVE (irréversible via store)', async () => {
    const store = useBiensStore()
    store.biens = [makeBien(60)]

    await store.archiver(60)
    expect(store.biens[0].statutBien).toBe('ARCHIVE')
    expect(store.biensDisponibles.length).toBe(0)
    expect(store.biensLoues.length).toBe(0)
  })
})
