/**
 * Tests de compatibilité navigateur — NEKASO
 * Ces tests s'exécutent sur tous les projects Playwright définis dans
 * playwright.config.cjs : Chrome, Firefox, WebKit, Mobile Chrome, Mobile Safari.
 *
 * Chaque test vérifie qu'un comportement essentiel fonctionne sur tous les navigateurs.
 * Les tests de viewport spécifiquement mobiles utilisent test.use({ viewport }).
 */
import { test, expect } from '@playwright/test'

async function injectLocataire(page) {
  await page.context().addInitScript(() => {
    window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.LOCATAIRE')
    window.sessionStorage.setItem(
      'nekaso_user',
      JSON.stringify({ id: 1, nom: 'Diop', prenom: 'Aminata', role: 'LOCATAIRE' }),
    )
  })
}

async function injectGestionnaire(page) {
  await page.context().addInitScript(() => {
    window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.GESTIONNAIRE')
    window.sessionStorage.setItem(
      'nekaso_user',
      JSON.stringify({ id: 2, nom: 'Fall', prenom: 'Omar', role: 'GESTIONNAIRE' }),
    )
  })
}

// ══════════════════════════════════════════════════════════════════════════
test.describe('Compat — Page de connexion', () => {
  test('COMPAT-01 : la page de login s\'affiche correctement', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('.auth-card')).toBeVisible({ timeout: 8000 })
    await expect(page.locator('input[type="tel"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByText(/Se connecter/i)).toBeVisible()
  })

  test('COMPAT-02 : les tabs Connexion/Inscription fonctionnent', async ({ page }) => {
    await page.goto('/login')
    await page.getByText('Inscription').click()
    await expect(page.getByText('Votre identité')).toBeVisible({ timeout: 3000 })

    await page.getByText('Connexion').click()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('COMPAT-03 : toggle "eye" sur le mot de passe fonctionne', async ({ page }) => {
    await page.goto('/login')
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()

    await page.locator('.eye-toggle').first().click()
    await expect(page.locator('input[type="text"]').first()).toBeVisible()
  })

  test('COMPAT-04 : la modale mot de passe oublié s\'ouvre et se ferme', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/oublié/i).click()
    await expect(page.locator('.mdp-overlay')).toBeVisible({ timeout: 3000 })

    await page.locator('.mdp-close').click()
    await expect(page.locator('.mdp-overlay')).not.toBeVisible({ timeout: 3000 })
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Compat — Espace locataire (desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => await injectLocataire(page))

  test('COMPAT-05 : la page mes-locations s\'affiche', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await expect(page.locator('.header-locataire')).toBeVisible({ timeout: 8000 })
    await expect(page.locator('h1, .page-title').first()).toBeVisible()
  })

  test('COMPAT-06 : la navigation desktop est visible', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await expect(page.locator('.nav')).toBeVisible()
  })

  test('COMPAT-07 : le bouton déconnexion desktop est visible', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await expect(page.locator('.btn-logout')).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Compat — Espace locataire (mobile)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => await injectLocataire(page))

  test('COMPAT-08 : le header mobile est visible avec hamburger', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await expect(page.locator('.header-locataire')).toBeVisible()
    await expect(page.locator('.mobile-toggle')).toBeVisible()
  })

  test('COMPAT-09 : le menu burger s\'ouvre sur mobile', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await page.locator('.mobile-toggle').click()
    await expect(page.locator('.mobile-menu')).toBeVisible({ timeout: 3000 })
  })

  test('COMPAT-10 : pas de scroll horizontal sur mobile', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const innerWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 5)
  })

  test('COMPAT-11 : la page login est lisible sur mobile sans overflow', async ({ page }) => {
    await page.goto('/login')
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const innerWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 5)
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Compat — Espace gestionnaire (desktop)', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test.beforeEach(async ({ page }) => await injectGestionnaire(page))

  test('COMPAT-12 : le dashboard gestionnaire charge', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).toContain('/gestionnaire/dashboard')
  })

  test('COMPAT-13 : la page biens gestionnaire charge', async ({ page }) => {
    await page.goto('/gestionnaire/biens')
    await page.waitForLoadState('networkidle')
    await expect(page.url()).toContain('/gestionnaire/biens')
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Compat — Catalogue public', () => {
  test('COMPAT-14 : le catalogue est accessible sur tous les navigateurs', async ({ page }) => {
    await page.goto('/catalogue')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).not.toContain('/login')
  })

  test('COMPAT-15 : la landing page charge sur tous les navigateurs', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Compat — Gardes de route cross-browser', () => {
  test('COMPAT-16 : redirect /login → /locataire/mes-locations (LOCATAIRE connecté)', async ({ page }) => {
    await injectLocataire(page)
    await page.goto('/login')
    await expect(page.url()).toContain('/locataire/mes-locations')
  })

  test('COMPAT-17 : redirect /login → /gestionnaire/dashboard (GESTIONNAIRE connecté)', async ({ page }) => {
    await injectGestionnaire(page)
    await page.goto('/login')
    await expect(page.url()).toContain('/gestionnaire/dashboard')
  })

  test('COMPAT-18 : accès protégé sans auth → /login', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await expect(page.url()).toContain('/login')
  })
})
