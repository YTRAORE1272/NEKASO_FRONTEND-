/**
 * Tests unitaires — biens.store.js
 * Couvre : charger, creer, modifier, archiver, louer, remettreDispo,
 *          supprimerPhoto, computeds (totalBiens, disponibles, loués, réservés)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBiensStore } from '@/stores/biens.store'

// ── Fixtures ───────────────────────────────────────────────────────────────
const makeBien = (overrides = {}) => ({
  id: 1,
  intitule: 'Appartement T3',
  typeBien: 'APPARTEMENT',
  adresse: 'Plateau, Dakar',
  surface: 80,
  nombrePieces: 3,
  loyer: 350000,
  charges: 15000,
  statutBien: 'DISPONIBLE',
  description: 'Beau logement',
  dateAjout: '2026-01-01',
  photos: [],
  ...overrides,
})

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  // Reset URL.createObjectURL stub
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
})

// ══════════════════════════════════════════════════════════════════════════
describe('biens.store — charger()', () => {
  it('charge les biens depuis mockData si la liste est vide', async () => {
    const store = useBiensStore()
    await store.charger()
    expect(store.biens.length).toBeGreaterThan(0)
    expect(store.chargement).toBe(false)
  })

  it('ne recharge pas si les biens sont déjà en mémoire', async () => {
    const store = useBiensStore()
    store.biens = [makeBien()]
    const countAvant = store.biens.length
    await store.charger()
    expect(store.biens.length).toBe(countAvant)
  })

  it('passe chargement à true pendant le chargement', async () => {
    const store = useBiensStore()
    const promise = store.charger()
    // pas encore résolu : chargement est true
    expect(store.chargement).toBe(true)
    await promise
    expect(store.chargement).toBe(false)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('biens.store — creer()', () => {
  it('ajoute un nouveau bien avec statutBien DISPONIBLE', async () => {
    const store = useBiensStore()
    store.biens = []

    await store.creer({
      intitule: 'Villa Almadies',
      typeBien: 'VILLA',
      adresse: 'Almadies, Dakar',
      surface: 200,
      nombrePieces: 5,
      loyer: 800000,
      description: 'Grande villa',
    })

    expect(store.biens.length).toBe(1)
    expect(store.biens[0].statutBien).toBe('DISPONIBLE')
    expect(store.biens[0].intitule).toBe('Villa Almadies')
  })

  it('ajoute en tête de liste (unshift)', async () => {
    const store = useBiensStore()
    store.biens = [makeBien({ id: 99, intitule: 'Ancien' })]

    await store.creer({ intitule: 'Nouveau', typeBien: 'STUDIO', adresse: 'Dakar', surface: 30, nombrePieces: 1, loyer: 150000 })

    expect(store.biens[0].intitule).toBe('Nouveau')
    expect(store.biens[1].intitule).toBe('Ancien')
  })

  it('génère un id temporaire unique (Date.now)', async () => {
    const store = useBiensStore()
    store.biens = []
    await store.creer({ intitule: 'A', typeBien: 'STUDIO', adresse: 'X', surface: 20, nombrePieces: 1, loyer: 100000 })
    expect(store.biens[0].id).toBeTypeOf('number')
    expect(store.biens[0].id).toBeGreaterThan(0)
  })

  it('associe les URLs de photos lors de la création', async () => {
    const store = useBiensStore()
    store.biens = []
    const fakeFile = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })

    await store.creer({
      intitule: 'Avec photo',
      typeBien: 'APPARTEMENT',
      adresse: 'Dakar',
      surface: 60,
      nombrePieces: 2,
      loyer: 200000,
      photos: [fakeFile],
    })

    expect(store.biens[0].photos.length).toBe(1)
    expect(store.biens[0].photos[0].urlPhoto).toBe('blob:mock-url')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('biens.store — modifier()', () => {
  it('met à jour les champs texte du bien existant', async () => {
    const store = useBiensStore()
    store.biens = [makeBien({ id: 5 })]

    await store.modifier(5, {
      intitule: 'Appartement Rénové',
      typeBien: 'APPARTEMENT',
      adresse: 'Mermoz, Dakar',
      surface: 90,
      nombrePieces: 4,
      loyer: 400000,
      charges: 20000,
      description: 'Rénové',
    })

    const bien = store.biens.find((b) => b.id === 5)
    expect(bien.intitule).toBe('Appartement Rénové')
    expect(bien.loyer).toBe(400000)
    expect(bien.surface).toBe(90)
  })

  it('ne modifie pas le statutBien lors d\'une modification', async () => {
    const store = useBiensStore()
    store.biens = [makeBien({ id: 5, statutBien: 'LOUE' })]

    await store.modifier(5, {
      intitule: 'Modifié',
      typeBien: 'APPARTEMENT',
      adresse: 'Dakar',
      surface: 80,
      nombrePieces: 3,
      loyer: 350000,
      description: '',
    })

    expect(store.biens[0].statutBien).toBe('LOUE')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('biens.store — archiver(), louer(), remettreDispo()', () => {
  it('archiver change statutBien en ARCHIVE', async () => {
    const store = useBiensStore()
    store.biens = [makeBien({ id: 10 })]
    await store.archiver(10)
    expect(store.biens[0].statutBien).toBe('ARCHIVE')
  })

  it('louer change statutBien en LOUE', () => {
    const store = useBiensStore()
    store.biens = [makeBien({ id: 20 })]
    store.louer(20)
    expect(store.biens[0].statutBien).toBe('LOUE')
  })

  it('remettreDispo change statutBien en DISPONIBLE depuis LOUE', () => {
    const store = useBiensStore()
    store.biens = [makeBien({ id: 30, statutBien: 'LOUE' })]
    store.remettreDispo(30)
    expect(store.biens[0].statutBien).toBe('DISPONIBLE')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('biens.store — supprimerPhoto()', () => {
  it('supprime la photo du bien par son id', async () => {
    const store = useBiensStore()
    store.biens = [
      makeBien({ id: 7, photos: [{ id: 101, urlPhoto: '/img/a.jpg' }, { id: 102, urlPhoto: '/img/b.jpg' }] }),
    ]

    await store.supprimerPhoto(7, 101)

    const bien = store.biens[0]
    expect(bien.photos.length).toBe(1)
    expect(bien.photos[0].id).toBe(102)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('biens.store — computed', () => {
  it('totalBiens retourne le nombre total de biens', () => {
    const store = useBiensStore()
    store.biens = [makeBien({ id: 1 }), makeBien({ id: 2 }), makeBien({ id: 3 })]
    expect(store.totalBiens).toBe(3)
  })

  it('biensDisponibles filtre uniquement DISPONIBLE', () => {
    const store = useBiensStore()
    store.biens = [
      makeBien({ id: 1, statutBien: 'DISPONIBLE' }),
      makeBien({ id: 2, statutBien: 'LOUE' }),
      makeBien({ id: 3, statutBien: 'DISPONIBLE' }),
    ]
    expect(store.biensDisponibles.length).toBe(2)
  })

  it('biensLoues filtre uniquement LOUE', () => {
    const store = useBiensStore()
    store.biens = [
      makeBien({ id: 1, statutBien: 'DISPONIBLE' }),
      makeBien({ id: 2, statutBien: 'LOUE' }),
      makeBien({ id: 3, statutBien: 'LOUE' }),
    ]
    expect(store.biensLoues.length).toBe(2)
  })

  it('biensReserves filtre uniquement RESERVE', () => {
    const store = useBiensStore()
    store.biens = [
      makeBien({ id: 1, statutBien: 'DISPONIBLE' }),
      makeBien({ id: 2, statutBien: 'RESERVE' }),
    ]
    expect(store.biensReserves.length).toBe(1)
  })

  it('totalBiens est 0 quand la liste est vide', () => {
    const store = useBiensStore()
    store.biens = []
    expect(store.totalBiens).toBe(0)
    expect(store.biensDisponibles.length).toBe(0)
  })
})
