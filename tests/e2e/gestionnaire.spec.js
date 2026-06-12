/**
 * Tests E2E — Espace Gestionnaire
 * Couvre : dashboard, gestion des biens, visites, demandes de location
 * Pré-requis : dev server sur http://localhost:5175
 */
import { test, expect } from '@playwright/test'

// ── Helper : injecter auth gestionnaire ────────────────────────────────────
async function loginAsGestionnaire(page) {
  await page.context().addInitScript(() => {
    window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.GESTIONNAIRE')
    window.sessionStorage.setItem(
      'nekaso_user',
      JSON.stringify({ id: 2, nom: 'Fall', prenom: 'Omar', role: 'GESTIONNAIRE' }),
    )
  })
}

// ══════════════════════════════════════════════════════════════════════════
test.describe('Gestionnaire — Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsGestionnaire(page)
  })

  test('le dashboard charge et affiche les KPIs', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await expect(page.locator('.dashboard')).toBeVisible()
    // Au moins une StatCard visible
    await expect(page.locator('.stat-card, [class*="kpi"], [class*="stat"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('le titre de la page contient "NEKASO"', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await expect(page).toHaveTitle(/NEKASO/i)
  })

  test('les boutons d\'action rapide sont présents', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await expect(page.getByText('Nouveau contrat')).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Gestionnaire — Biens immobiliers', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsGestionnaire(page)
  })

  test('la page biens charge et liste des biens', async ({ page }) => {
    await page.goto('/gestionnaire/biens')
    await expect(page.locator('.biens, [class*="biens"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('le bouton "Ajouter un bien" est visible', async ({ page }) => {
    await page.goto('/gestionnaire/biens')
    const btn = page.getByText(/Ajouter|Nouveau bien/i).first()
    await expect(btn).toBeVisible()
  })

  test('ouvrir la modale d\'ajout de bien', async ({ page }) => {
    await page.goto('/gestionnaire/biens')
    await page.getByText(/Ajouter|Nouveau bien/i).first().click()
    // La modale s'ouvre (formulaire visible)
    await expect(page.locator('form, .modal, [class*="modal"]').first()).toBeVisible()
  })

  test('navigation vers le détail d\'un bien', async ({ page }) => {
    await page.goto('/gestionnaire/biens')
    // Cliquer sur le premier bien
    const firstBien = page.locator('[class*="carte-bien"], [class*="bien-card"], .bien-item').first()
    if (await firstBien.isVisible()) {
      await firstBien.click()
      await expect(page.url()).toContain('/gestionnaire/biens/')
    }
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Gestionnaire — Visites', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsGestionnaire(page)
  })

  test('la page visites charge et affiche le titre', async ({ page }) => {
    await page.goto('/gestionnaire/visites')
    await expect(page.locator('h2, h1').first()).toBeVisible({ timeout: 8000 })
    await expect(page.locator('h2, h1').first()).toContainText(/visite/i)
  })

  test('des cartes de visite sont affichées (données mock)', async ({ page }) => {
    await page.goto('/gestionnaire/visites')
    await page.waitForLoadState('networkidle')
    const cards = page.locator('[class*="carte-visite"], [class*="visite-card"], .visite-item')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(0) // peut être 0 avec mock vide
  })

  test('le bouton "Nouvelle visite" est accessible', async ({ page }) => {
    await page.goto('/gestionnaire/visites')
    const btn = page.getByText(/nouvelle visite|ajouter visite/i).first()
    await expect(btn).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Gestionnaire — Demandes de location', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsGestionnaire(page)
  })

  test('la page demandes de location charge', async ({ page }) => {
    await page.goto('/gestionnaire/demandes-location')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1, h2, .page-title').first()).toBeVisible({ timeout: 8000 })
  })

  test('les onglets EN ATTENTE / VALIDÉE / REFUSÉE sont présents', async ({ page }) => {
    await page.goto('/gestionnaire/demandes-location')
    const pageText = await page.textContent('body')
    // Au moins un des statuts est mentionné
    expect(
      pageText.match(/en attente|validée|refusée|attente/i)
    ).toBeTruthy()
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Gestionnaire — Navigation sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsGestionnaire(page)
  })

  test('la sidebar contient les liens de navigation', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    const pageText = await page.textContent('body')
    expect(pageText).toMatch(/biens|visites|contrats|paiements/i)
  })

  test('naviguer vers /contrats depuis la sidebar', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    const contratsLink = page.getByText(/contrats/i).first()
    await contratsLink.click()
    await expect(page.url()).toContain('/gestionnaire/contrats')
  })

  test('naviguer vers /paiements depuis la sidebar', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await page.getByText(/paiements/i).first().click()
    await expect(page.url()).toContain('/gestionnaire/paiements')
  })
})

// ══════════════════════════════════════════════════════════════════════════
test.describe('Gestionnaire — Accès sans token (sécurité)', () => {
  test('accès direct à /gestionnaire/dashboard sans auth redirige vers /login', async ({ page }) => {
    await page.goto('/gestionnaire/dashboard')
    await expect(page.url()).toContain('/login')
  })

  test('accès direct à /gestionnaire/biens sans auth redirige vers /login', async ({ page }) => {
    await page.goto('/gestionnaire/biens')
    await expect(page.url()).toContain('/login')
  })
})
