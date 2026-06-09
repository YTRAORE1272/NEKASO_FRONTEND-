# 🚀 Guide de Démarrage Rapide - NEKASO Frontend

## Installation et Lancement

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm run dev

# Build pour production
npm run build
```

## 🌐 Routes Disponibles

### Pages Publiques
- `/` - Landing page (hero + features + biens vedette)
- `/catalogue` - Catalogue des biens avec filtres
- `/biens/:id` - Détail d'un bien
- `/demande-visite/:id` - Formulaire demande de visite
- `/login` - Connexion
- `/inscription` - Inscription multi-étapes

### Espace Locataire
- `/locataire/mes-locations` - Dashboard locataire
- `/locataire/contrat/:id?` - Contrat et paiements
- `/locataire/profil` - Profil utilisateur
- `/locataire/succes-visite/:bienId` - Confirmation visite
- `/locataire/succes-location/:bienId` - Confirmation location

### Espace Gestionnaire
- `/gestionnaire/dashboard` - Tableau de bord
- `/gestionnaire/biens` - Liste des biens
- `/gestionnaire/biens/:id` - Détail bien (édition)
- `/gestionnaire/visites` - Gestion des visites
- `/gestionnaire/demandes-location` - Demandes de location
- `/gestionnaire/contrats` - Gestion des contrats
- `/gestionnaire/paiements` - Gestion des paiements
- `/gestionnaire/parametres` - Paramètres

## 🎨 Design System

### Couleurs Principales
```css
--primaire: #1e3a5f (Navy blue)
--secondaire: #22c55e (Green)
--texte: #111827 (Dark gray)
--texte-secondaire: #6b7280 (Medium gray)
--bordure: #e5e7eb (Light gray)
--fond: #f9fafb (Background)
```

### Composants Réutilisables

#### Badges
```vue
<BadgeStatut statut="disponible" />
<!-- Statuts: disponible, loue, reserve, en_attente, confirmee, etc. -->
```

#### Message Vide
```vue
<MessageVide 
  icone="📋" 
  titre="Aucun élément" 
  message="Description ici" 
/>
```

#### Spinner
```vue
<ChargementSpinner message="Chargement..." />
```

#### Carte Bien
```vue
<CarteBienPublic :bien="bienObject" />
```

## 📦 Structure des Stores

### Auth Store
```js
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
authStore.login(telephone, motDePasse)
authStore.register(nom, telephone, motDePasse)
authStore.logout()
```

### Biens Publics Store
```js
import { useBiensPublicsStore } from '@/stores/biensPublics.store'

const biensStore = useBiensPublicsStore()
await biensStore.chargerBiens()
const biens = biensStore.biens
```

### Locataire Stores
```js
import { useContratsLocataireStore } from '@/stores/contratsLocataire.store'
import { usePaiementsLocataireStore } from '@/stores/paiementsLocataire.store'
import { useDemandesLocataireStore } from '@/stores/demandesLocataire.store'
import { useVisitesLocataireStore } from '@/stores/visitesLocataire.store'
```

## 🔧 Configuration

### Variables d'Environnement
Créer `.env.development` et `.env.production` avec :
```
VITE_API_URL=http://localhost:3000/api
```

### Accès API
Les services sont dans `src/services/` :
- `auth.service.js`
- `biens-publics.service.js`
- `contrats.service.js`
- `paiements.service.js`
- etc.

## 📱 Tests Rapides

### Tester le Flow Public
1. Aller sur `/`
2. Cliquer sur "Liste des biens" ou rechercher
3. Naviguer vers `/catalogue`
4. Cliquer sur un bien → `/biens/:id`
5. Cliquer "Demander une visite" → `/demande-visite/:id`
6. Soumettre → Redirection vers `/locataire/succes-visite/:id`

### Tester l'Inscription
1. Aller sur `/inscription`
2. Étape 1 : Remplir nom + téléphone
3. Étape 2 : Code WhatsApp (4 chiffres)
4. Étape 3 : Mot de passe + confirmation
5. Création compte → Redirection dashboard

### Tester l'Espace Locataire
1. Se connecter via `/login`
2. Redirection vers `/locataire/mes-locations`
3. Voir stats (visites, demandes, locations actives)
4. Naviguer vers "Contrat & Paiements"
5. Voir contrat et historique paiements

## 🐛 Debug

### Vue DevTools
Installer l'extension Vue DevTools pour Chrome/Firefox

### Console Logs
Les stores utilisent `console.log` pour le debugging

### Toasts
Les notifications utilisent `vue-toastification` :
```js
import { useToast } from 'vue-toastification'
const toast = useToast()
toast.success('Message')
toast.error('Erreur')
toast.info('Info')
```

## 📚 Ressources

- **Figma Design** : [Lien fourni](https://www.figma.com/design/9MeqKVcWuJ07W2775yPZAw/NEKASO)
- **Documentation Vue 3** : https://vuejs.org/
- **Vue Router** : https://router.vuejs.org/
- **Pinia** : https://pinia.vuejs.org/

## ✅ Checklist Avant Commit

- [ ] Vérifier que toutes les pages s'affichent
- [ ] Tester la navigation entre les pages
- [ ] Vérifier les formulaires (validation)
- [ ] Tester responsive (mobile/tablet)
- [ ] Vérifier les toasts (notifications)
- [ ] Lancer `npm run build` (pas d'erreurs)

---

**Bon développement ! 🎉**
