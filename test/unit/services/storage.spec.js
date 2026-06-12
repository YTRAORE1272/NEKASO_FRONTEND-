/**
 * Tests unitaires — services/storage.js
 * Couvre : getToken, setToken, removeToken, getUser, setUser, removeUser
 * Vérifie le comportement sessionStorage vs localStorage (persistent flag)
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/services/storage'

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
})

// ══════════════════════════════════════════════════════════════════════════
describe('setToken() / getToken()', () => {
  it('stocke le token en sessionStorage par défaut (non persistant)', () => {
    setToken('jwt-session-abc')
    expect(sessionStorage.getItem('nekaso_token')).toBe('jwt-session-abc')
    expect(localStorage.getItem('nekaso_token')).toBeNull()
  })

  it('stocke le token en localStorage quand persistent:true', () => {
    setToken('jwt-local-xyz', { persistent: true })
    expect(localStorage.getItem('nekaso_token')).toBe('jwt-local-xyz')
    expect(sessionStorage.getItem('nekaso_token')).toBeNull()
  })

  it('getToken lit depuis sessionStorage en priorité', () => {
    sessionStorage.setItem('nekaso_token', 'session-tok')
    localStorage.setItem('nekaso_token', 'local-tok')
    expect(getToken()).toBe('session-tok')
  })

  it('getToken lit depuis localStorage si sessionStorage vide', () => {
    localStorage.setItem('nekaso_token', 'local-tok')
    expect(getToken()).toBe('local-tok')
  })

  it('getToken retourne null si les deux storages sont vides', () => {
    expect(getToken()).toBeNull()
  })

  it('setToken efface l\'ancien emplacement avant d\'écrire le nouveau', () => {
    localStorage.setItem('nekaso_token', 'old-local')
    setToken('new-session')
    expect(localStorage.getItem('nekaso_token')).toBeNull()
    expect(sessionStorage.getItem('nekaso_token')).toBe('new-session')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('removeToken()', () => {
  it('supprime le token des deux storages', () => {
    sessionStorage.setItem('nekaso_token', 'tok-s')
    localStorage.setItem('nekaso_token', 'tok-l')
    removeToken()
    expect(sessionStorage.getItem('nekaso_token')).toBeNull()
    expect(localStorage.getItem('nekaso_token')).toBeNull()
  })

  it('ne plante pas si les storages sont déjà vides', () => {
    expect(() => removeToken()).not.toThrow()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('setUser() / getUser()', () => {
  const user = { id: 1, nom: 'Diop', role: 'LOCATAIRE' }

  it('stocke l\'objet sérialisé en sessionStorage par défaut', () => {
    setUser(user)
    const raw = sessionStorage.getItem('nekaso_user')
    expect(JSON.parse(raw)).toEqual(user)
    expect(localStorage.getItem('nekaso_user')).toBeNull()
  })

  it('stocke en localStorage quand persistent:true', () => {
    setUser(user, { persistent: true })
    expect(JSON.parse(localStorage.getItem('nekaso_user'))).toEqual(user)
    expect(sessionStorage.getItem('nekaso_user')).toBeNull()
  })

  it('getUser désérialise correctement', () => {
    setUser(user)
    expect(getUser()).toEqual(user)
  })

  it('getUser retourne null si vide', () => {
    expect(getUser()).toBeNull()
  })

  it('getUser retourne null si le JSON est corrompu', () => {
    sessionStorage.setItem('nekaso_user', '{invalid-json}')
    expect(getUser()).toBeNull()
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('removeUser()', () => {
  it('supprime l\'utilisateur des deux storages', () => {
    sessionStorage.setItem('nekaso_user', '{}')
    localStorage.setItem('nekaso_user', '{}')
    removeUser()
    expect(sessionStorage.getItem('nekaso_user')).toBeNull()
    expect(localStorage.getItem('nekaso_user')).toBeNull()
  })
})
