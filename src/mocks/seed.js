/*
  seed.js — Données de démonstration initiales de la base mock NEKASO.

  Objectif : couvrir TOUS les cas du workflow métier afin de pouvoir tester
  de bout en bout sans backend :
    demande → validation gestionnaire (créneau + agent) → acceptation client
    → visite → clôture (avec / sans contrat) → pré-contrat
    → validation des deux parties → contrat actif → paiements par échéances.

  Cas particuliers volontairement présents :
    - 3 demandes de réservation SIMULTANÉES sur le même bien (Studio Plateau) → FIFO.
    - Agents avec créneaux de disponibilité (croisement des dispos).
    - Pré-contrat en attente de validation client + contrat en retours client.
    - Contrat actif avec échéances mensuelles et paiements partiels.
    - Alerte « bien défectueux » envoyée par un locataire.

  La date de référence du jeu de données est 2026-06-18.
*/

const PHOTO = {
  appart: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
  studio: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
  bureau: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
  villa:  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
  chambre:'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=600&h=400&fit=crop',
}

/* Génère des échéances mensuelles entre deux dates (incluses). */
function genererEcheancesMensuelles(dateDebut, nbMois, montant, nbPayes) {
  const echeances = []
  const base = new Date(dateDebut)
  for (let i = 0; i < nbMois; i++) {
    const d = new Date(base)
    d.setMonth(base.getMonth() + i)
    const iso = d.toISOString().split('T')[0]
    const libelle = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    echeances.push({
      id: 1000 + i,
      libelle: libelle.charAt(0).toUpperCase() + libelle.slice(1),
      dateEcheance: iso,
      montant,
      statut: i < nbPayes ? 'PAYE' : 'A_PAYER',
    })
  }
  return echeances
}

export function creerEtatInitial() {
  return {
    /* ── Gestionnaires ── */
    gestionnaires: [
      {
        id: 1,
        nom: 'Sarr',
        prenom: 'Awa',
        telephone: '771234567',
        email: 'awa.sarr@nekaso.sn',
        statut: 'ACTIF',
      },
    ],

    /* ── Clients (locataires) ── */
    clients: [
      { id: 1, nom: 'Sow',   prenom: 'Moussa',    telephone: '771111111', email: 'moussa.sow@mail.sn',   statut: 'ACTIF' },
      { id: 2, nom: 'Ndiaye',prenom: 'Fatou',     telephone: '772222222', email: 'fatou.ndiaye@mail.sn', statut: 'ACTIF' },
      { id: 3, nom: 'Ba',    prenom: 'Ibrahima',  telephone: '773333333', email: 'ib.ba@mail.sn',        statut: 'ACTIF' },
      { id: 4, nom: 'Diop',  prenom: 'Aminata',   telephone: '774444444', email: 'aminata@mail.sn',      statut: 'ACTIF' },
      { id: 5, nom: 'Fall',  prenom: 'Omar',      telephone: '775555555', email: 'omar.fall@mail.sn',    statut: 'ACTIF' },
    ],

    /* ── Agents ── */
    agents: [
      {
        id: 1,
        nom: 'Mbaye',
        prenom: 'Cheikh',
        telephone: '776600001',
        gestionnaireId: 1,
        disponibilites: [
          { id: 1, date: '2026-06-20', heure: '09:00' },
          { id: 2, date: '2026-06-20', heure: '14:00' },
          { id: 3, date: '2026-06-22', heure: '10:00' },
        ],
      },
      {
        id: 2,
        nom: 'Diouf',
        prenom: 'Rokhaya',
        telephone: '776600002',
        gestionnaireId: 1,
        disponibilites: [
          { id: 4, date: '2026-06-21', heure: '10:00' },
          { id: 5, date: '2026-06-23', heure: '15:00' },
        ],
      },
    ],

    /* ── Biens ──
         b1 LOUE   (1 photo)
         b2 DISPONIBLE — Studio Plateau (cible des 3 demandes concurrentes)
         b3 DISPONIBLE
         b4 DISPONIBLE
         b5 DISPONIBLE
    */
    biens: [
      {
        id: 1,
        intitule: 'Appartement Almadies',
        typeBien: 'APPARTEMENT',
        adresse: 'Rue 12, Almadies, Dakar',
        surface: 85,
        nombrePieces: 3,
        loyer: 450000,
        charges: 25000,
        statutBien: 'LOUE',
        dateAjout: '2026-01-15',
        gestionnaireId: 1,
        description: 'Bel appartement lumineux avec vue mer.',
        photos: [{ id: 1, urlPhoto: PHOTO.appart, dateUpload: '2026-01-15' }],
        locataire: { id: 5, nom: 'Fall', prenom: 'Omar', telephone: '775555555', dateDebut: '2026-02-01', loyer: 450000 },
      },
      {
        id: 2,
        intitule: 'Studio Plateau',
        typeBien: 'STUDIO',
        adresse: 'Av. Pompidou, Plateau, Dakar',
        surface: 35,
        nombrePieces: 1,
        loyer: 180000,
        charges: 10000,
        statutBien: 'DISPONIBLE',
        dateAjout: '2026-02-20',
        gestionnaireId: 1,
        description: 'Studio moderne proche centre-ville.',
        photos: [{ id: 2, urlPhoto: PHOTO.studio, dateUpload: '2026-02-20' }],
        locataire: null,
      },
      {
        id: 3,
        intitule: 'Bureau Mermoz',
        typeBien: 'BUREAU',
        adresse: 'Mermoz Sacré-Cœur, Dakar',
        surface: 60,
        nombrePieces: 2,
        loyer: 350000,
        charges: 15000,
        statutBien: 'DISPONIBLE',
        dateAjout: '2026-03-10',
        gestionnaireId: 1,
        description: 'Bureau bien situé avec parking.',
        photos: [{ id: 3, urlPhoto: PHOTO.bureau, dateUpload: '2026-03-10' }],
        locataire: null,
      },
      {
        id: 4,
        intitule: 'Villa Ngor',
        typeBien: 'VILLA',
        adresse: 'Corniche Ouest, Ngor',
        surface: 200,
        nombrePieces: 5,
        loyer: 1200000,
        charges: 50000,
        statutBien: 'DISPONIBLE',
        dateAjout: '2026-04-05',
        gestionnaireId: 1,
        description: 'Magnifique villa avec piscine.',
        photos: [{ id: 4, urlPhoto: PHOTO.villa, dateUpload: '2026-04-05' }],
        locataire: null,
      },
      {
        id: 5,
        intitule: 'Chambre Ouakam',
        typeBien: 'CHAMBRE',
        adresse: 'Cité Asecna, Ouakam',
        surface: 18,
        nombrePieces: 1,
        loyer: 90000,
        charges: 5000,
        statutBien: 'DISPONIBLE',
        dateAjout: '2026-05-15',
        gestionnaireId: 1,
        description: 'Chambre meublée avec salle de bain.',
        photos: [{ id: 5, urlPhoto: PHOTO.chambre, dateUpload: '2026-05-15' }],
        locataire: null,
      },
    ],

    /* ── Visites ──
         v1 EN_ATTENTE (clientId:1, bienId:2)
         v2 VALIDEE    (clientId:2, bienId:3) — créneau + agent affectés
         v3 CONFIRMEE  (clientId:1, bienId:4) — acceptée, prête à clôturer
         v4 EN_ATTENTE (clientId:3, bienId:5)
         v5 VALIDEE    (clientId:4, bienId:2)
    */
    visites: [
      { id: 1, bienId: 2, clientId: 1, statut: 'EN_ATTENTE', dateCreation: '2026-06-10T08:00:00Z', creneau: null, agentId: null, compteRendu: null },
      { id: 2, bienId: 3, clientId: 2, statut: 'VALIDEE',    dateCreation: '2026-06-11T09:00:00Z', creneau: { date: '2026-06-20', heure: '14:00' }, agentId: 1, compteRendu: null },
      { id: 3, bienId: 4, clientId: 1, statut: 'CONFIRMEE',  dateCreation: '2026-06-12T10:00:00Z', creneau: { date: '2026-06-21', heure: '10:00' }, agentId: 2, compteRendu: null },
      { id: 4, bienId: 5, clientId: 3, statut: 'EN_ATTENTE', dateCreation: '2026-06-13T11:00:00Z', creneau: null, agentId: null, compteRendu: null },
      { id: 5, bienId: 2, clientId: 4, statut: 'VALIDEE',    dateCreation: '2026-06-14T12:00:00Z', creneau: { date: '2026-06-22', heure: '09:00' }, agentId: 1, compteRendu: null },
    ],

    /* ── Demandes de location ──
         3 demandes EN_ATTENTE sur le bien 2 (Studio Plateau) → FIFO
         demande 1 est la plus ancienne (2026-06-10), clientId:2 → prioritaire
    */
    demandes: [
      { id: 1, bienId: 2, clientId: 2, statut: 'EN_ATTENTE', dateCreation: '2026-06-10T07:00:00Z', source: 'DIRECTE' },
      { id: 2, bienId: 2, clientId: 3, statut: 'EN_ATTENTE', dateCreation: '2026-06-11T07:00:00Z', source: 'DIRECTE' },
      { id: 3, bienId: 2, clientId: 4, statut: 'EN_ATTENTE', dateCreation: '2026-06-12T07:00:00Z', source: 'DIRECTE' },
    ],

    /* ── Contrats ──
         contrat actif (clientId:5, bienId:1) avec 12 échéances dont 5 payées
    */
    contrats: [
      {
        id: 1,
        numero: 'NKS-2026-001',
        bienId: 1,
        clientId: 5,
        gestionnaireId: 1,
        statut: 'ACTIF',
        dateCreation: '2026-02-01',
        dateDebut: '2026-02-01',
        dateFin: '2027-01-31',
        montantLoyer: 450000,
        montantCaution: 900000,
        frequence: 'MENSUELLE',
        conditions: 'Paiement avant le 5 de chaque mois.',
        retours: [],
        origine: { type: 'VISITE', refId: null },
        echeances: genererEcheancesMensuelles('2026-02-01', 12, 450000, 5),
      },
    ],

    /* ── Paiements ── */
    paiements: [],

    /* ── Alertes ── */
    alertes: [
      {
        id: 1,
        bienId: 1,
        clientId: 5,
        gestionnaireId: 1,
        titre: 'Fuite d\'eau salle de bain',
        message: 'Il y a une fuite sous le lavabo depuis 2 jours.',
        statut: 'NOUVELLE',
        dateCreation: '2026-06-16T08:00:00Z',
        suivi: [],
      },
    ],

    /* ── Notifications ──
         1 notification non lue pour GESTIONNAIRE
         1 notification non lue pour CLIENT (clientId:1)
    */
    notifications: [
      {
        id: 1,
        destinataire: 'GESTIONNAIRE',
        clientId: null,
        type: 'VISITE',
        message: 'Nouvelle demande de visite de Moussa Sow (Studio Plateau).',
        date: '2026-06-10T08:00:00Z',
        lue: false,
      },
      {
        id: 2,
        destinataire: 'CLIENT',
        clientId: 1,
        type: 'PRE_CONTRAT',
        message: 'Votre pré-contrat est prêt à être validé.',
        date: '2026-06-15T10:00:00Z',
        lue: false,
      },
    ],
  }
}
