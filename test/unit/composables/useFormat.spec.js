/**
 * Tests unitaires — composables/useFormat.js
 * Couvre : formatMontant, formatDate, formatMois
 */
import { describe, it, expect } from 'vitest'
import { useFormat } from '@/composables/useFormat'

const { formatMontant, formatDate, formatMois } = useFormat()

// ══════════════════════════════════════════════════════════════════════════
describe('formatMontant()', () => {
  it('formate 350000 en "350 000" (espace milliers fr-FR)', () => {
    const result = formatMontant(350000)
    // L'espace fr-FR peut être un espace normal ou un espace insécable
    expect(result.replace(/\s/g, ' ').trim()).toBe('350 000')
  })

  it('formate 1050000 en "1 050 000"', () => {
    const result = formatMontant(1050000)
    expect(result.replace(/\s/g, ' ').trim()).toBe('1 050 000')
  })

  it('retourne "0" pour null', () => {
    expect(formatMontant(null)).toBe('0')
  })

  it('retourne "0" pour undefined', () => {
    expect(formatMontant(undefined)).toBe('0')
  })

  it('formate 0 correctement', () => {
    expect(formatMontant(0)).toBe('0')
  })

  it('accepte une string numérique', () => {
    const result = formatMontant('500000')
    expect(result.replace(/\s/g, ' ').trim()).toBe('500 000')
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('formatDate()', () => {
  it('convertit "2024-05-15" en date fr-FR', () => {
    const result = formatDate('2024-05-15')
    expect(result).toMatch(/15\/05\/2024|15 mai 2024/i)
  })

  it('retourne "-" pour null', () => {
    expect(formatDate(null)).toBe('-')
  })

  it('retourne "-" pour undefined', () => {
    expect(formatDate(undefined)).toBe('-')
  })

  it('retourne "-" pour chaîne vide', () => {
    expect(formatDate('')).toBe('-')
  })

  it('convertit "2026-01-31"', () => {
    const result = formatDate('2026-01-31')
    expect(result).toMatch(/31/)
  })
})

// ══════════════════════════════════════════════════════════════════════════
describe('formatMois()', () => {
  it('convertit "2024-05" en "Mai 2024"', () => {
    expect(formatMois('2024-05')).toBe('Mai 2024')
  })

  it('convertit "2024-01" en "Janvier 2024"', () => {
    expect(formatMois('2024-01')).toBe('Janvier 2024')
  })

  it('convertit "2024-12" en "Décembre 2024"', () => {
    expect(formatMois('2024-12')).toBe('Décembre 2024')
  })

  it('retourne "-" pour null', () => {
    expect(formatMois(null)).toBe('-')
  })

  it('retourne "-" pour undefined', () => {
    expect(formatMois(undefined)).toBe('-')
  })

  it('tous les 12 mois sont couverts', () => {
    const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
    mois.forEach((nom, index) => {
      const num = String(index + 1).padStart(2, '0')
      expect(formatMois(`2025-${num}`)).toBe(`${nom} 2025`)
    })
  })
})
