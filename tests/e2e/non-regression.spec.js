/**
 * Tests de non-régression — NEKASO
 * Vérifie que les corrections récentes n'ont pas cassé l'existant.
 *
 * Corrections ciblées :
 *  1. HeaderLocataire — burger menu visible et fonctionnel sur mobile
 *  2. ForgotPasswordModal — icônes dans les étapes, flèche retour
 *  3. Inscription = toujours LOCATAIRE (pas de sélection de rôle)
 *  4. Page de login — fluide sur mobile
 *  5. Routes protégées toujours actives
 */
import { test, expect } from '@playwright/test'

// ══════════════════════════════════════════════════════════════════════════
test.describe('NR-01 — HeaderLocataire burger menu', () => {
  test.use({ viewport: { width: 375, height: 812 } }) // iPhone X

  test.beforeEach(async ({ page }) => {
    await page.context().addInitScript(() => {
      window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.LOCATAIRE')
      window.sessionStorage.setItem(
        'nekaso_user',
        JSON.stringify({ id: 1, nom: 'Test', prenom: 'User', role: 'LOCATAIRE' }),
      )
    })
  })

  test('NR-01-A : le bouton hamburger est visible sur mobile', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    const toggle = page.locator('.mobile-toggle')
    await expect(toggle).toBeVisible({ timeout: 5000 })
  })

  test('NR-01-B : cliquer hamburger affiche le menu mobile sous le header', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await page.locator('.mobile-toggle').click()

    const menu = page.locator('.mobile-menu')
    await expect(menu).toBeVisible()

    // Le menu doit apparaître EN DESSOUS du header, pas à côté
    const headerBox = await page.locator('.header-locataire').boundingBox()
    const menuBox = await menu.boundingBox()
    expect(menuBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 5)
  })

  test('NR-01-C : le menu mobile contient au moins 4 liens', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await page.locator('.mobile-toggle').click()

    const links = page.locator('.mobile-link')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('NR-01-D : le bouton déconnexion desktop est masqué sur mobile', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    const logoutBtn = page.locator('.btn-logout')
    await expect(logoutBtn).toBeHidden()
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('NR-02 — ForgotPasswordModal design & étapes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('NR-02-A : le lien "Mot de passe oublié ?" ouvre la modale', async ({ page }) => {
    await page.getByText(/mot de passe oublié/i).first().click()
    await expect(page.locator('.mdp-overlay')).toBeVisible({ timeout: 3000 })
  })

  test('NR-02-B : la modale affiche 3 étapes (pills)', async ({ page }) => {
    await page.getByText(/mot de passe oublié/i).first().click()
    const pills = page.locator('.mdp-pill')
    await expect(pills).toHaveCount(3)
  })

  test('NR-02-C : les pills contiennent des icônes SVG', async ({ page }) => {
    await page.getByText(/mot de passe oublié/i).first().click()
    const pills = page.locator('.mdp-pill')
    // Chaque pill doit avoir un SVG (icône)
    const firstPillSvg = pills.first().locator('svg')
    await expect(firstPillSvg).toBeVisible()
  })

  test('NR-02-D : étape 1 → 2 avec numéro valide', async ({ page }) => {
    await page.getByText(/mot de passe oublié/i).first().click()
    await page.locator('.mdp-body input[type="tel"]').fill('+221770000000')
    await page.locator('.mdp-body .btn-submit').click()

    // Étape 2 : 6 champs code
    await expect(page.locator('.code-input')).toHaveCount(6)
    await expect(page.getByText(/changer de numéro/i)).toBeVisible()
  })

  test('NR-02-E : le bouton "← Changer de numéro" contient une flèche', async ({ page }) => {
    await page.getByText(/mot de passe oublié/i).first().click()
    await page.locator('.mdp-body input[type="tel"]').fill('+221770000000')
    await page.locator('.mdp-body .btn-submit').click()

    const retourBtn = page.locator('.lien-retour')
    await expect(retourBtn).toBeVisible()
    // Contient une flèche (SVG ou texte ←)
    const svgOrArrow = retourBtn.locator('svg')
    await expect(svgOrArrow).toBeVisible()
  })

  test('NR-02-F : étape 1 pill devient verte (pill-done) à l\'étape 2', async ({ page }) => {
    await page.getByText(/mot de passe oublié/i).first().click()
    await page.locator('.mdp-body input[type="tel"]').fill('+221770000000')
    await page.locator('.mdp-body .btn-submit').click()

    const firstPill = page.locator('.mdp-pill').first()
    await expect(firstPill).toHaveClass(/pill-done/)
  })

  test('NR-02-G : fermer la modale fonctionne (bouton X)', async ({ page }) => {
    await page.getByText(/mot de passe oublié/i).first().click()
    await expect(page.locator('.mdp-overlay')).toBeVisible()

    await page.locator('.mdp-close').click()
    await expect(page.locator('.mdp-overlay')).not.toBeVisible({ timeout: 3000 })
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('NR-03 — Inscription = toujours LOCATAIRE', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByText('Inscription').click()
  })

  test('NR-03-A : aucun sélecteur de rôle dans le formulaire d\'inscription', async ({ page }) => {
    const roleSelect = page.locator('select[name*="role"], select[id*="role"]')
    await expect(roleSelect).not.toBeVisible()
  })

  test('NR-03-B : le texte "GESTIONNAIRE" n\'apparaît pas dans l\'inscription', async ({ page }) => {
    const pageText = await page.textContent('.auth-body')
    expect(pageText).not.toContain('GESTIONNAIRE')
  })

  test('NR-03-C : le formulaire d\'inscription demande nom + téléphone uniquement', async ({ page }) => {
    const inputs = page.locator('input')
    const count = await inputs.count()
    expect(count).toBe(2) // Nom complet + Téléphone
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('NR-04 — Page de login responsive', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('NR-04-A : la carte auth est visible sur mobile sans overflow horizontal', async ({ page }) => {
    await page.goto('/login')
    const card = page.locator('.auth-card')
    await expect(card).toBeVisible()

    // Vérifier qu'il n'y a pas de scroll horizontal
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const innerWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 5) // tolérance de 5px
  })

  test('NR-04-B : les tabs Connexion/Inscription sont visibles sur mobile', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Connexion')).toBeVisible()
    await expect(page.getByText('Inscription')).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('NR-05 — Routes protégées toujours actives', () => {
  test('NR-05-A : /gestionnaire/dashboard sans auth → /login', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await expect(page.url()).toContain('/login')
  })

  test('NR-05-B : /locataire/mes-locations sans auth → /login', async ({ page }) => {
    await page.goto('/locataire/mes-locations')
    await expect(page.url()).toContain('/login')
  })

  test('NR-05-C : /gestionnaire/biens sans auth → /login', async ({ page }) => {
    await page.goto('/gestionnaire/biens')
    await expect(page.url()).toContain('/login')
  })
})
