const TYPE_LABELS = {
  APPARTEMENT: 'Appartement',
  STUDIO: 'Studio',
  CHAMBRE: 'Chambre',
  LOCAL: 'Bureau',
}

const PORTEFEUILLE_COLORS = ['#1a2234', '#22c55e', '#4ade80', '#166534', '#86efac']

export function labelTypeBien(type) {
  return TYPE_LABELS[type] || type
}

export function buildPortefeuille(biens = []) {
  const counts = {}
  biens.forEach((b) => {
    const label = labelTypeBien(b.typeBien)
    counts[label] = (counts[label] || 0) + 1
  })
  const total = biens.length
  if (!total) return []
  return Object.entries(counts).map(([type, count], i) => ({
    type,
    count,
    percent: Math.round((count / total) * 100),
    color: PORTEFEUILLE_COLORS[i % PORTEFEUILLE_COLORS.length],
  }))
}

export function mapPaiementsEnRetard(paiements = []) {
  return paiements
    .filter((p) => p.statut === 'EN_RETARD')
    .map((p) => ({
      id: p.id,
      locataire: formatNom(p.locataire),
      echeance: p.mois,
      montant: p.montant,
    }))
}

export function mapVisitesEnAttente(visites = []) {
  return visites
    .filter((v) => v.statut === 'EN_ATTENTE')
    .map((v) => ({
      id: v.id,
      nom: formatNom(v.locataire),
      bien: formatBienCourt(v.bien),
      dateHeure: v.dateCreation,
      statut: v.statut,
    }))
}

function formatNom(personne) {
  if (!personne) return '—'
  return `${personne.prenom ?? ''} ${personne.nom ?? ''}`.trim()
}

function formatBienCourt(bien) {
  if (!bien) return '—'
  const type = labelTypeBien(bien.typeBien)
  const lieu = bien.adresse?.split(',')[0]?.trim() || bien.adresse || ''
  return [type, lieu].filter(Boolean).join(' ')
}

export function computeVariationPourcent(mois = []) {
  if (mois.length < 2) return 0
  const dernier = mois[mois.length - 1].montant ?? 0
  const precedent = mois[mois.length - 2].montant ?? 0
  if (!precedent) return 0
  return Math.round(((dernier - precedent) / precedent) * 1000) / 10
}

export function mapRevenusGraphique(revenusParMois = []) {
  return revenusParMois.slice(-6).map((m) => ({
    mois: m.mois,
    encaisse: m.montant ?? 0,
    anneePrecedente: Math.round((m.montant ?? 0) * 0.85),
  }))
}

export function enrichDashboardStats(stats, { paiements = [], visites = [], biens = [] }) {
  const loyersListe = mapPaiementsEnRetard(paiements)
  const visitesListe = mapVisitesEnAttente(visites)
  const portefeuille = buildPortefeuille(biens)
  const montantLoyersEnRetard = loyersListe.reduce((s, p) => s + p.montant, 0)
  const tauxOccupation =
    stats.totalBiens > 0 ? Math.round((stats.biensLoues / stats.totalBiens) * 100) : 0

  return {
    ...stats,
    montantLoyersEnRetard,
    tauxOccupation,
    variationRevenus: computeVariationPourcent(stats.revenusParMois),
    variationOccupation: 0,
    variationLoyersRetard: 0,
    revenusParMois: mapRevenusGraphique(stats.revenusParMois),
    portefeuille,
    loyersEnRetardListe: loyersListe,
    visitesEnAttenteListe: visitesListe,
    loyersEnRetard: stats.loyersEnRetard ?? loyersListe.length,
    visitesEnAttente: stats.visitesEnAttente ?? visitesListe.length,
  }
}

function normaliserSerieMontant(raw) {
  if (Array.isArray(raw)) {
    return raw.map((it) => ({
      mois: it.mois ?? it.label ?? it.cle ?? it.periode ?? '',
      montant: Number(it.montant ?? it.valeur ?? it.value ?? it.total ?? 0),
    }))
  }
  if (raw && typeof raw === 'object') {
    return Object.entries(raw).map(([mois, montant]) => ({ mois, montant: Number(montant) || 0 }))
  }
  return []
}

function buildPortefeuilleFromMap(raw) {
  let entries = []
  if (Array.isArray(raw)) {
    entries = raw.map((it) => [
      it.type ?? it.libelle ?? it.cle ?? '',
      Number(it.count ?? it.valeur ?? it.nombre ?? it.value ?? 0),
    ])
  } else if (raw && typeof raw === 'object') {
    entries = Object.entries(raw).map(([k, v]) => [k, Number(v) || 0])
  }
  const total = entries.reduce((s, [, v]) => s + v, 0)
  if (!total) return []
  return entries.map(([type, count], i) => ({
    type: labelTypeBien(type),
    count,
    percent: Math.round((count / total) * 100),
    color: PORTEFEUILLE_COLORS[i % PORTEFEUILLE_COLORS.length],
  }))
}

function normaliserTaux(valeur) {
  let t = Number(valeur) || 0
  if (t > 0 && t <= 1) t *= 100
  return Math.round(t)
}

/**
 * Transforme le DashboardResponseDTO backend (+ visites en attente) en l'objet
 * attendu par le store dashboard. Tolérant aux formats libres des séries.
 * @param {object} dto DashboardResponseDTO
 * @param {Array} [visites] Items DemandeVisiteDTOList bruts
 * @returns {object}
 */
export function mapDashboardDTO(dto = {}, visites = []) {
  const visitesListe = mapVisitesEnAttente(visites)
  const loyersListe = (dto.listeLoyersEnRetard || []).map((l, i) => ({
    id: i,
    locataire: l.locataireNom ?? '—',
    echeance: l.echeanceDate ?? '',
    montant: Number(l.montantDu) || 0,
  }))
  return {
    totalBiens: Number(dto.totalBiensPortefeuille) || 0,
    biensLoues: Number(dto.totalBiensLoues) || 0,
    revenusMois: Number(dto.revenusCeMois) || 0,
    montantLoyersEnRetard: Number(dto.totalLoyersEnRetard) || 0,
    loyersEnRetard: Number(dto.nombreLocatairesEnRetard) || 0,
    tauxOccupation: normaliserTaux(dto.tauxOccupation),
    variationRevenus: Math.round((Number(dto.evolutionRevenusPourcentage) || 0) * 10) / 10,
    variationOccupation: 0,
    variationLoyersRetard: 0,
    revenusParMois: mapRevenusGraphique(normaliserSerieMontant(dto.evolutionChiffreAffaires)),
    portefeuille: buildPortefeuilleFromMap(dto.repartitionPortefeuille),
    loyersEnRetardListe: loyersListe,
    visitesEnAttenteListe: visitesListe,
    visitesEnAttente: visitesListe.length,
    notificationsNonLues: 0,
  }
}
