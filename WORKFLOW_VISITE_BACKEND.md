# Cahier des charges backend — Workflow de visite

> Document à destination de l'équipe backend (Spring Boot).
> Établi le 2026-06-20 après vérification **en réel** sur `http://74.248.184.17:8080`.
> Objectif : permettre l'implémentation côté frontend du workflow de visite décrit ci-dessous.
> ⚠️ Les 4 besoins ci-dessous **n'existent pas encore** dans la spec OpenAPI (`/v3/api-docs`) — testés et confirmés manquants.

---

## 1. Le workflow cible (machine à états)

```
[Locataire] crée une demande de visite sur un bien
        └──> Visite.statut = EN_ATTENTE

[Gestionnaire] valide la demande : choisit un CRÉNEAU (date/heure) + un AGENT
        └──> Visite.statut = CONFIRMEE   (= "planifiée / à venir")
             + créneau et agent enregistrés et visibles des deux côtés

[Locataire] après la visite, choisit :
   • "Valider AVEC contrat"
        └──> Visite.statut = TERMINEE
             + Bien.statutBien = CONFIRME
             + le gestionnaire peut alors créer le pré-contrat (action MANUELLE)
   • "Valider SANS contrat"
        └──> Visite.statut = TERMINEE
             + Bien.statutBien inchangé
             + pas de pré-contrat possible pour cette visite
```

⚠️ **Règle clé** : dans les deux cas la visite passe au **même** statut `TERMINEE`. Seul l'impact sur le bien (et le déblocage du pré-contrat) diffère. Ne pas créer deux statuts de visite distincts.

---

## 2. État ACTUEL vérifié (ce qui existe)

| Endpoint | Statut |
|---|---|
| `POST /api/visites/locataire/bien/{id_Bien}` | ✅ crée la demande (EN_ATTENTE) |
| `PATCH /api/visites/gestionnaire/demande/{id}/statut/{statut}` | ✅ mais enum limité (voir ci-dessous) |
| `PATCH /api/visites/gestionnaire/demande/{id}/confirmer/bien/{idBien}/agent/{idAgent}` | ✅ passe la visite à CONFIRMEE — **mais sans date/heure** |
| `GET /api/visites/gestionnaire/demande` | 🐛 **renvoie 500** (à réparer, voir §4) |
| `GET /api/visites/locataire/mes_demandes` | ✅ |
| `POST /api/agents/gestionnaire/create` | ✅ renvoie `id` |
| `GET /api/agents/gestionnaire/mes_agents` | ✅ mais `AgentListDto` **sans `id`** |
| `POST /api/pre-contrats/gestionnaire/create` | ✅ (exige visite CONFIRMEE) |

**Enums réels actuels :**
- Visite : `EN_ATTENTE`, `CONFIRMEE`, `REFUSEE`, `ANNULEE` (pas de `TERMINEE`, pas de `CLOTUREE_*`).
- Bien : `DISPONIBLE`, `LOUE`, `RESERVE`, `EN_REPARATION`, `DESACTIVE`, `ARCHIVE` (pas de `CONFIRME`).

---

## 3. Ce qu'il MANQUE (à livrer)

### A. Enregistrer le CRÉNEAU à la confirmation
La confirmation par le gestionnaire doit stocker une date/heure de visite.

- **Modifier** `PATCH /api/visites/gestionnaire/demande/{id_Demande}/confirmer/bien/{idBien}/agent/{idAgent}`
  pour accepter un **corps JSON** :
  ```json
  { "dateCreneau": "2026-07-01", "heureCreneau": "10:30" }
  ```
- **Exposer** dans `DemandeVisiteDTOList` (GET gestionnaire ET locataire) :
  - `dateCreneau`, `heureCreneau`
  - l'agent affecté : `agent { id, nom, prenom, telephone }`
  (aujourd'hui le DTO ne contient ni créneau ni agent → le locataire ne peut pas voir quand/avec qui).

### B. Ajouter le statut visite `TERMINEE`
- Ajouter `TERMINEE` à l'enum des statuts de visite.
- Enum cible : `EN_ATTENTE | CONFIRMEE | REFUSEE | ANNULEE | TERMINEE`.

### C. Endpoint LOCATAIRE de validation après visite (avec/sans contrat)
Aucun endpoint locataire ne permet aujourd'hui de changer le statut d'une visite.

- **Créer** : `PATCH /api/visites/locataire/demande/{id_Demande}/terminer`
  - **Corps** : `{ "avecContrat": true | false }`
  - **Sécurité** : réservé au locataire **propriétaire** de la demande.
  - **Pré-condition** : visite au statut `CONFIRMEE` (idéalement après la date du créneau).
  - **Effet** :
    - visite → `TERMINEE` (dans les deux cas)
    - si `avecContrat = true` → bien → `CONFIRME`
    - si `avecContrat = false` → bien inchangé
  - **Réponse** : la visite mise à jour (avec son nouveau statut).

  *(Alternative acceptable : deux endpoints `/terminer-avec-contrat` et `/terminer-sans-contrat`.)*

### D. Ajouter le statut bien `CONFIRME`
- Ajouter `CONFIRME` à l'enum `statutBien`.
- **Mis à jour automatiquement** par l'endpoint C (cas « avec contrat ») — **pas** par une action manuelle du gestionnaire.

### E. Création du pré-contrat après terminaison
- Aujourd'hui `POST /api/pre-contrats/gestionnaire/create` exige une visite `CONFIRMEE`.
- Après le passage à `TERMINEE` (avec contrat), **la création du pré-contrat doit rester possible**
  (via `demandeVisiteId`). → Étendre la règle pour accepter une visite `CONFIRMEE` **ou** `TERMINEE` avec bien `CONFIRME`.
- Le pré-contrat reste une **action manuelle** du gestionnaire (le système le rend juste possible).

---

## 4. Régressions à corriger (introduites par la dernière MAJ)

1. **`GET /api/visites/gestionnaire/demande` → 500** (« une erreur est survenue »).
   Bloque entièrement la page « Visites » du gestionnaire. **Priorité haute.**
2. **`AgentListDto` sans `id`** : `GET /api/agents/gestionnaire/mes_agents` renvoie `{nom, prenom, telephone}` sans identifiant
   → impossible de réutiliser un agent listé pour confirmer une visite après rechargement. **Ajouter `id`.**
3. La réinitialisation de la base a **effacé les comptes** (le locataire de test a dû être recréé). À éviter en environnement partagé.

---

## 5. Récapitulatif — checklist backend

- [ ] Corriger le **500** sur `GET /api/visites/gestionnaire/demande`
- [ ] Ajouter `id` dans `AgentListDto`
- [ ] Confirmation visite : accepter **dateCreneau/heureCreneau** + les exposer (avec l'agent) dans le DTO
- [ ] Enum visite : ajouter **`TERMINEE`**
- [ ] Enum bien : ajouter **`CONFIRME`**
- [ ] Nouvel endpoint **`PATCH /api/visites/locataire/demande/{id}/terminer`** `{ avecContrat }`
- [ ] Pré-contrat créable après visite **TERMINEE** (bien CONFIRME), pas seulement CONFIRMEE

> Dès ces points livrés, l'implémentation frontend est rapide : services Axios + stores + écrans
> (modale de validation gestionnaire avec créneau, action « Valider la visite » côté locataire,
> déblocage du pré-contrat quand le bien est `CONFIRME`).
