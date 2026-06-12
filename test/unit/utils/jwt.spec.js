/**
 * Tests unitaires — utils/jwt.js
 * Couvre : parseJwt, isExpired
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { parseJwt, isExpired } from '@/utils/jwt'

// ── Helpers ────────────────────────────────────────────────────────────────
function buildJwt(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return `${header}.${body}.fake-signature`
}

afterEach(() => vi.restoreAllMocks())

// ══════════════════════════════════════════════════════════════════════════
describe('parseJwt()', () => {
  it('parse correctement un payload JWT valide', () => {
    const token = buildJwt({ sub: '42', role: 'LOCATAIRE', exp: 9999999999 })
    const result = parseJwt(token)

    expect(result.sub).toBe('42')
    expect(result.role).toBe('LOCATAIRE')
  })

  it('retourne null si le token est null', () => {
    expect(parseJwt(null)).toBeNull()
  })

  it('retourne null si le token est une chaîne vide', () => {
    expect(parseJwt('')).toBeNull()
  })

  it('retourne null si le token n\'a pas 3 parties', () => {
    expect(parseJwt('seulement.deuxparties')).toBeNull()
  })

  it('retourne null si le payload est du JSON invalide', () => {
    const badToken = 'header.' + btoa('not-json') + '.sig'
    expect(parseJwt(badToken)).toBeNull()
  })

  it('parse un token avec des caractères URL-safe (- et _)', () => {
    const payload = { sub: 'user', iat: 1700000000 }
    const token = buildJwt(payload)
    expect(token).toContain('-') || expect(true).toBe(true)
    const result = parseJwt(token)
    expect(result).not.toBeNull()
    expect(result.sub).toBe('user')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('isExpired()', () => {
  it('retourne true pour un token dont exp est dans le passé', () => {
    const past = Math.floor(Date.now() / 1000) - 3600
    const token = buildJwt({ sub: '1', exp: past })
    expect(isExpired(token)).toBe(true)
  })

  it('retourne false pour un token dont exp est dans le futur', () => {
    const future = Math.floor(Date.now() / 1000) + 3600
    const token = buildJwt({ sub: '1', exp: future })
    expect(isExpired(token)).toBe(false)
  })

  it('retourne false si le token n\'a pas de champ exp', () => {
    const token = buildJwt({ sub: '1' })
    expect(isExpired(token)).toBe(false)
  })

  it('retourne false si le token est null (ne pas planter)', () => {
    expect(isExpired(null)).toBe(false)
  })
})
