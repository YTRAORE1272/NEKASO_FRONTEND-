/**
 * Tests d'acceptation utilisateur (UAT) — NEKASO
 * Scénarios métier réels vus du côté utilisateur final.
 *
 * Format : "En tant que [rôle], je veux [action] afin de [bénéfice]"
 */
import { test, expect } from '@playwright/test'

// ── Auth helpers ───────────────────────────────────────────────────────────
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
// UAT-1 : Scénarios Locataire
// ══════════════════════════════════════════════════════════════════════════

test.describe('UAT — Locataire : Connexion et accueil', () => {
  test('UAT-L01 : Je peux me connecter avec mon téléphone et mot de passe', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('.auth-card')).toBeVisible()
    await expect(page.getByText('Connexion')).toBeVisible()
    await expect(page.locator('input[type="tel"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByText(/Se connecter/i)).toBeVisible()
  })

  test('UAT-L02 : Je vois mes locations actives après connexion', async ({ page }) => {
    await injectLocataire(page)
    await page.goto('/locataire/mes-locations')

    await expect(page.locator('h1, .page-title').first()).toContainText(/location/i, { timeout: 5000 })
    await expect(page.locator('.header-locataire')).toBeVisible()
  })

  test('UAT-L03 : Je peux naviguer vers le catalogue de biens', async ({ page }) => {
    await page.goto('/catalogue')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).not.toContain('/login')
  })
})

test.describe('UAT — Locataire : Inscription', () => {
  test('UAT-L04 : Je peux m\'inscrire en 3 étapes simples', async ({ page }) => {
    await page.goto('/login')
    await page.getByText('Inscription').click()

    // Étape 1 : identité
    await expect(page.getByText('Votre identité')).toBeVisible()
    await expect(page.locator('input[placeholder*="Aminata"]')).toBeVisible()

    // Saisir les infos
    await page.locator('input').first().fill('Fatou Sow')
    await page.locator('input[type="tel"]').fill('776543210')
    await page.getByText(/recevoir le code/i).click()

    // Étape 2 : code
    await expect(page.locator('.code-input').first()).toBeVisible({ timeout: 3000 })
    await expect(page.getByText(/WhatsApp/i)).toBeVisible()
  })

  test('UAT-L05 : En m\'inscrivant je suis automatiquement locataire', async ({ page }) => {
    await page.goto('/login')
    await page.getByText('Inscription').click()

    // Aucun choix de rôle proposé
    const pageText = await page.locator('.auth-body').textContent()
    expect(pageText).not.toContain('Gestionnaire')
    expect(pageText).not.toContain('GESTIONNAIRE')
  })

  test('UAT-L06 : Je peux réinitialiser mon mot de passe en 3 étapes', async ({ page }) => {
    await page.goto('/login')

    // Étape 1
    await page.getByText(/mot de passe oublié/i).click()
    await expect(page.locator('.mdp-overlay')).toBeVisible()
    await expect(page.locator('.mdp-pill').first()).toHaveClass(/pill-active/)

    // Saisie numéro
    await page.locator('.mdp-body input[type="tel"]').fill('+221770000000')
    await page.locator('.mdp-body .btn-submit').click()

    // Étape 2
    await expect(page.locator('.code-input')).toHaveCount(6)

    // Saisie code
    const codeInputs = page.locator('.code-input')
    for (let i = 0; i < 6; i++) {
      await codeInputs.nth(i).fill(String(i + 1))
    }
    await page.locator('.mdp-body .btn-submit').click()

    // Étape 3
    await expect(page.getByText(/nouveau mot de passe/i)).toBeVisible({ timeout: 3000 })
  })
})

test.describe('UAT — Locataire : Navigation mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('UAT-L07 : Sur mobile j\'accède aux pages via le menu hamburger', async ({ page }) => {
    await injectLocataire(page)
    await page.goto('/locataire/mes-locations')

    // Hamburger visible
    await expect(page.locator('.mobile-toggle')).toBeVisible()

    // Ouvrir le menu
    await page.locator('.mobile-toggle').click()
    await expect(page.locator('.mobile-menu')).toBeVisible()

    // Naviguer vers demandes de visite
    await page.locator('.mobile-menu').getByText(/demandes de visite/i).click()
    await expect(page.url()).toContain('/locataire/mes-demandes-visites')
  })

  test('UAT-L08 : Sur mobile je peux me déconnecter via le menu', async ({ page }) => {
    await injectLocataire(page)
    await page.goto('/locataire/mes-locations')
    await page.locator('.mobile-toggle').click()
    await page.locator('.mobile-logout').click()

    await expect(page.url()).toContain('/login')
  })
})

// ══════════════════════════════════════════════════════════════════════════
// UAT-2 : Scénarios Gestionnaire
// ══════════════════════════════════════════════════════════════════════════

test.describe('UAT — Gestionnaire : Tableau de bord', () => {
  test.beforeEach(async ({ page }) => await injectGestionnaire(page))

  test('UAT-G01 : Je vois un tableau de bord avec les métriques clés', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await page.waitForLoadState('networkidle')

    // Métriques visibles
    const body = await page.textContent('body')
    // Au moins l'un des KPIs est mentionné
    const hasMetrics = /revenu|occupation|loyer|taux|bien/i.test(body)
    expect(hasMetrics).toBe(true)
  })

  test('UAT-G02 : Je peux accéder à la liste de mes biens', async ({ page }) => {
    await page.goto('/gestionnaire/biens')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).toContain('/gestionnaire/biens')
  })

  test('UAT-G03 : Je peux accéder à la gestion des visites', async ({ page }) => {
    await page.goto('/gestionnaire/visites')
    await page.waitForLoadState('networkidle')
    await expect(page.url()).toContain('/gestionnaire/visites')
  })

  test('UAT-G04 : Je peux accéder aux demandes de location', async ({ page }) => {
    await page.goto('/gestionnaire/demandes-location')
    await page.waitForLoadState('networkidle')
    await expect(page.url()).toContain('/gestionnaire/demandes-location')
  })

  test('UAT-G05 : Je peux accéder aux contrats', async ({ page }) => {
    await page.goto('/gestionnaire/contrats')
    await page.waitForLoadState('networkidle')
    await expect(page.url()).toContain('/gestionnaire/contrats')
  })
})

// ══════════════════════════════════════════════════════════════════════════
// UAT-3 : Scénarios Public
// ══════════════════════════════════════════════════════════════════════════

test.describe('UAT — Visiteur public', () => {
  test('UAT-P01 : Je peux consulter le catalogue sans être connecté', async ({ page }) => {
    await page.goto('/catalogue')
    await expect(page.url()).not.toContain('/login')
    await expect(page.locator('body')).toBeVisible()
  })

  test('UAT-P02 : J\'arrive sur la landing page par défaut', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).not.toContain('/login')
  })

  test('UAT-P03 : La page de connexion est accessible à /login', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('.auth-card')).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// UAT-4 : Sécurité utilisateur
// ══════════════════════════════════════════════════════════════════════════

test.describe('UAT — Sécurité accès', () => {
  test('UAT-S01 : Un utilisateur non connecté est redirigé vers login', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await expect(page.url()).toContain('/login')
    await expect(page.locator('.auth-card')).toBeVisible()
  })

  test('UAT-S02 : Un utilisateur connecté ne voit pas le formulaire de login', async ({ page }) => {
    await injectLocataire(page)
    await page.goto('/login')
    // Doit être redirigé vers mes-locations
    await expect(page.url()).toContain('/locataire/mes-locations')
  })

  test('UAT-S03 : Après déconnexion l\'accès aux pages protégées est refusé', async ({ page }) => {
    await injectLocataire(page)
    await page.goto('/locataire/mes-locations')

    // Simuler la déconnexion en vidant le storage
    await page.evaluate(() => {
      sessionStorage.removeItem('nekaso_token')
      sessionStorage.removeItem('nekaso_user')
    })

    // Essayer d'accéder de nouveau → redirect
    await page.goto('/locataire/mes-locations')
    await expect(page.url()).toContain('/login')
  })
})
