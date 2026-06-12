/**
 * Tests E2E — Espace Locataire
 * Couvre : mes-locations, mes demandes, navigation mobile (burger),
 *          catalogue public, accès sans token
 */
import { test, expect } from '@playwright/test'

async function loginAsLocataire(page) {
  await page.context().addInitScript(() => {
    window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.LOCATAIRE')
    window.sessionStorage.setItem(
      'nekaso_user',
      JSON.stringify({ id: 1, nom: 'Diop', prenom: 'Aminata', role: 'LOCATAIRE' }),
    )
  })
}

// ══════════════════════════════════════════════════════════════════════════
test.describe('Locataire — Mes locations', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsLocataire(page)
  })

  test('la page mes-locations charge correctement', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await expect(page.locator('h1, .page-title').first()).toBeVisible({ timeout: 8000 })
    await expect(page.locator('h1, .page-title').first()).toContainText(/location/i)
  })

  test('le header locataire est visible', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await expect(page.locator('.header-locataire')).toBeVisible()
  })

  test('le logo NEKASO est dans le header', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    const logo = page.locator('.logo-icon')
    await expect(logo).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Locataire — Mes demandes de visite', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsLocataire(page)
  })

  test('la page mes-demandes-visites charge', async ({ page }) => {
    await page.goto('/locataire/mes-demandes-visites')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1, h2, .page-title').first()).toBeVisible({ timeout: 8000 })
  })

  test('le contenu mentionne "visite"', async ({ page }) => {
    await page.goto('/locataire/mes-demandes-visites')
    await page.waitForLoadState('networkidle')
    const pageText = await page.textContent('body')
    expect(pageText.toLowerCase()).toContain('visite')
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Locataire — Mes demandes de location', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsLocataire(page)
  })

  test('la page mes-demandes-locations charge', async ({ page }) => {
    await page.goto('/locataire/mes-demandes-locations')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1, h2, .page-title').first()).toBeVisible({ timeout: 8000 })
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Locataire — Navigation desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    await loginAsLocataire(page)
  })

  test('les liens de navigation desktop sont visibles', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    const nav = page.locator('.nav')
    await expect(nav).toBeVisible()
    await expect(nav.getByText('Mes locations')).toBeVisible()
    await expect(nav.getByText(/demandes de visite/i)).toBeVisible()
    await expect(nav.getByText(/demandes de location/i)).toBeVisible()
  })

  test('naviguer vers mes-demandes-visites depuis le header', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await page.locator('.nav').getByText(/demandes de visite/i).click()
    await expect(page.url()).toContain('/locataire/mes-demandes-visites')
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Locataire — Navigation mobile (burger menu)', () => {
  test.use({ viewport: { width: 390, height: 844 } }) // iPhone 14

  test.beforeEach(async ({ page }) => {
    await loginAsLocataire(page)
  })

  test('le bouton hamburger est visible sur mobile', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    const toggle = page.locator('.mobile-toggle')
    await expect(toggle).toBeVisible()
  })

  test('le menu desktop est masqué sur mobile', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    const desktopNav = page.locator('.nav')
    await expect(desktopNav).toBeHidden()
  })

  test('cliquer le hamburger ouvre le menu mobile', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await page.locator('.mobile-toggle').click()
    const mobileMenu = page.locator('.mobile-menu')
    await expect(mobileMenu).toBeVisible()
  })

  test('le menu mobile contient les liens de navigation', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await page.locator('.mobile-toggle').click()

    const mobileMenu = page.locator('.mobile-menu')
    await expect(mobileMenu.getByText('Mes locations')).toBeVisible()
    await expect(mobileMenu.getByText(/demandes de visite/i)).toBeVisible()
    await expect(mobileMenu.getByText(/déconnecter/i)).toBeVisible()
  })

  test('cliquer un lien mobile ferme le menu et navigue', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await page.locator('.mobile-toggle').click()

    await page.locator('.mobile-menu').getByText(/demandes de visite/i).click()

    await expect(page.locator('.mobile-menu')).not.toBeVisible({ timeout: 3000 })
    await expect(page.url()).toContain('/locataire/mes-demandes-visites')
  })

  test('déconnexion mobile via le menu burger', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await page.locator('.mobile-toggle').click()
    await page.locator('.mobile-menu .mobile-logout').click()
    await expect(page.url()).toContain('/login')
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Locataire — Catalogue public (sans auth)', () => {
  test('le catalogue est accessible sans être connecté', async ({ page }) => {
    await page.goto('/catalogue')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).not.toContain('/login')
  })

  test('la landing page est accessible sans auth', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).not.toContain('/login')
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Locataire — Accès sans token (sécurité)', () => {
  test('accès direct à /locataire/mes-locations sans auth redirige vers /login', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await expect(page.url()).toContain('/login')
  })

  test('accès direct à /locataire/mes-demandes-visites sans auth → /login', async ({ page }) => {
    await page.goto('/locataire/mes-demandes-visites')
    await expect(page.url()).toContain('/login')
  })
})
