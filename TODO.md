# TODO — Alignement parcours utilisateur (Nekaso)

- [x] Étudier et corriger le flow Auth : quand une action est pending depuis la fiche bien (visite/location)
  - [x] Ouvrir automatiquement l’onglet Inscription sur `/login` (stepper en 3 étapes)
  - [ ] Garantir le bandeau orange “demande traitée juste après”
  - [x] Garantir la reprise du contexte (type visite/location + bienId)
- [ ] Brancher la création réelle de la demande dans `src/views/public/BienDetailView.vue`
  - [ ] `confirmerVisite` appelle le store/service création visite
  - [ ] `confirmerLocation` appelle le store/service création location
  - [ ] Puis rediriger vers pages success

- [ ] Vérifier `src/views/locataire/MesLocationsView.vue`
  - [ ] Widgets statut (Visites en attente / Demandes de location / Location active)
  - [ ] Sections : Mes locations actives, demandes de location, demandes de visite
  - [ ] Empty states + CTAs
  - [ ] Carte cliquable → fiche bien
- [ ] Vérifier `src/views/locataire/ContratPaiementsView.vue`
  - [ ] Onglet Contrat : badge/infos, PDF download, grille infos gestionnaire
  - [ ] Onglet Historique : rappel canaux paiements, tableau scrollable mobile, badges statut
  - [ ] Condition “locataire actif uniquement”
- [ ] Vérifier timelines lecture seule côté locataire
  - [ ] `CarteVisiteTimeline.vue` + cartes demandes location
- [ ] Lancer build/lint/test rapide (npm run dev / npm run build si applicable)
