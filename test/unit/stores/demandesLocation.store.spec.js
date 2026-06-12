/**
 * Tests unitaires — demandesLocation.store.js
 * Couvre : charger (API + fallback mock), valider, refuser, computed filters
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDemandesLocationStore } from '@/stores/demandesLocation.store'

vi.mock('@/services/demandes-location.service', () => ({
  demandesLocationService: {
    getListe: vi.fn(),
    valider: vi.fn(),
    refuser: vi.fn(),
  },
}))

import { demandesLocationService } from '@/services/demandes-location.service'

const makeDemande = (overrides = {}) => ({
  id: 1,
  idBien: 10,
  idLocataire: 5,
  statut: 'EN_ATTENTE',
  dateCreation: '2026-06-01',
  ...overrides,
})

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

// ══════════════════════════════════════════════════════════════════════════
describe('demandesLocation.store — charger()', () => {
  it('charge la liste depuis l\'API quand elle répond', async () => {
    const data = [makeDemande({ id: 1 }), makeDemande({ id: 2 })]
    demandesLocationService.getListe.mockResolvedValue({ data })
    const store = useDemandesLocationStore()

    await store.charger()

    expect(store.demandes.length).toBe(2)
    expect(store.chargement).toBe(false)
    expect(store.erreur).toBeTruthy() // message d'info fallback ou null
  })

  it('utilise les données mock si l\'API échoue (fallback)', async () => {
    demandesLocationService.getListe.mockRejectedValue(new Error('Network Error'))
    const store = useDemandesLocationStore()

    await store.charger()

    expect(store.demandes.length).toBeGreaterThan(0)
    expect(store.erreur).toContain('serveur')
    expect(store.chargement).toBe(false)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('demandesLocation.store — valider()', () => {
  it('change le statut en VALIDEE', async () => {
    demandesLocationService.valider.mockResolvedValue({})
    const store = useDemandesLocationStore()
    store.demandes = [makeDemande({ id: 10, statut: 'EN_ATTENTE' })]

    await store.valider(10)

    expect(store.demandes[0].statut).toBe('VALIDEE')
  })

  it('met à jour localement même si l\'API échoue', async () => {
    demandesLocationService.valider.mockRejectedValue(new Error('fail'))
    const store = useDemandesLocationStore()
    store.demandes = [makeDemande({ id: 11 })]

    await store.valider(11)

    expect(store.demandes[0].statut).toBe('VALIDEE')
  })

  it('ne modifie pas les autres demandes', async () => {
    demandesLocationService.valider.mockResolvedValue({})
    const store = useDemandesLocationStore()
    store.demandes = [makeDemande({ id: 1 }), makeDemande({ id: 2 })]

    await store.valider(1)

    expect(store.demandes[1].statut).toBe('EN_ATTENTE')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('demandesLocation.store — refuser()', () => {
  it('change le statut en REFUSEE', async () => {
    demandesLocationService.refuser.mockResolvedValue({})
    const store = useDemandesLocationStore()
    store.demandes = [makeDemande({ id: 20 })]

    await store.refuser(20)

    expect(store.demandes[0].statut).toBe('REFUSEE')
  })

  it('met à jour localement même si l\'API échoue', async () => {
    demandesLocationService.refuser.mockRejectedValue(new Error('fail'))
    const store = useDemandesLocationStore()
    store.demandes = [makeDemande({ id: 21 })]

    await store.refuser(21)

    expect(store.demandes[0].statut).toBe('REFUSEE')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('demandesLocation.store — computed filters', () => {
  it('enAttente ne retourne que les demandes EN_ATTENTE', () => {
    const store = useDemandesLocationStore()
    store.demandes = [
      makeDemande({ id: 1, statut: 'EN_ATTENTE' }),
      makeDemande({ id: 2, statut: 'VALIDEE' }),
      makeDemande({ id: 3, statut: 'REFUSEE' }),
    ]
    expect(store.enAttente.length).toBe(1)
    expect(store.enAttente[0].id).toBe(1)
  })

  it('validees retourne uniquement les VALIDEE', () => {
    const store = useDemandesLocationStore()
    store.demandes = [
      makeDemande({ id: 1, statut: 'EN_ATTENTE' }),
      makeDemande({ id: 2, statut: 'VALIDEE' }),
      makeDemande({ id: 3, statut: 'VALIDEE' }),
    ]
    expect(store.validees.length).toBe(2)
  })

  it('refusees retourne uniquement les REFUSEE', () => {
    const store = useDemandesLocationStore()
    store.demandes = [makeDemande({ id: 1, statut: 'REFUSEE' }), makeDemande({ id: 2, statut: 'EN_ATTENTE' })]
    expect(store.refusees.length).toBe(1)
  })

  it('retourne des listes vides quand demandes est vide', () => {
    const store = useDemandesLocationStore()
    store.demandes = []
    expect(store.enAttente.length).toBe(0)
    expect(store.validees.length).toBe(0)
    expect(store.refusees.length).toBe(0)
  })
})
