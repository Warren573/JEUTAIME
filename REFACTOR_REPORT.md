# Rapport de refactoring : bar → salon

**Date :** 2025-12-03
**Branche :** claude/rename-bars-to-salons-011KyUsPwxt3S9Xbs4Bq3VWe

---

## 📊 Statistique des occurrences

- **"bar"** (minuscule) : ~150+ occurrences
- **"bars"** (minuscule) : ~80+ occurrences
- **"Bar"** (majuscule) : ~50+ occurrences
- **"Bars"** (majuscule) : ~30+ occurrences

---

## 📁 Fichiers concernés (par catégorie)

### 🔴 PRIORITÉ 1 : Textes UI visibles par l'utilisateur

| Fichier | Lignes | Type de changement |
|---------|--------|-------------------|
| `README.md` | 10, 25-30, 39, 126 | Texte documentation (« Bar Romantique », « 5 Bars thématiques ») |
| `src/components/screens/BarsScreen.jsx` | Lignes multiples | Textes UI des cartes de bars |
| `src/components/screens/HomeScreen.jsx` | 221, 333, 335, 539, 625 | Textes UI (« Explorer les Bars », « Bars rejoints ») |
| `src/components/screens/SocialScreen.jsx` | 176, 183, 217 | Labels UI (« Nouveau Bar », tab « Salons ») |
| `src/components/screens/SettingsScreen.jsx` | 496 | Liste avantages (« Priorité dans les Bars ») |
| `src/components/screens/ProfilesScreen.jsx` | 609-610 | Stats affichées (« Bars ») |
| `src/components/screens/MemoriesScreen.jsx` | 24 | Texte narratif (« Bar Romantique ») |
| `src/components/admin/sections/Bars.jsx` | Titres et labels UI | Interface admin (« Gestion des Bars ») |
| `src/components/screens/BarDetailScreen.jsx` | 124, 198, 689, 701 | Messages UI (« expulsé du bar », « Fermer le bar ») |
| `src/components/screens/JournalScreen.jsx` | 9 | Texte notification (« Nouveau bar "Aventuriers" ») |

---

### 🟡 PRIORITÉ 2 : Variables, fonctions, composants

| Fichier | Type | Exemples d'identifiants |
|---------|------|------------------------|
| `src/App.jsx` | Variables | `selectedBar`, `setSelectedBar` |
| `src/data/appData.js` | Export | `export const bars = [...]`, propriété `stats.bars` |
| `src/utils/barExchangeSystem.js` | Fonctions | `getActiveExchangeForBar()`, `getBarName()`, paramètres `barId` |
| `src/utils/barsSystem.js` | Système complet | Toutes les fonctions du module (saveBarState, loadBarState, etc.) |
| `src/components/screens/BarsScreen.jsx` | Composant + variables | `BarsScreen`, variable `bars`, props `bar.*` |
| `src/components/screens/BarDetailScreen.jsx` | Composant + props | `BarDetailScreen`, prop `bar` |
| `src/components/screens/SocialScreen.jsx` | Fonctions + state | `handleAdminEditBar()`, `handleAdminDeleteBar()`, `animatingBars` |
| `src/components/admin/sections/Bars.jsx` | Composant + variables | `Bars` (composant), variable `bars` |
| `src/components/admin/AdminLayout.jsx` | Import + config | `import Bars`, objet config avec `id: 'bars'` |
| `src/config/gameConfig.js` | Commentaire | `// Ajouter une phrase à l'histoire dans un bar` |

---

### 🟢 PRIORITÉ 3 : Fichiers système (À EXCLURE ou traiter avec précaution)

| Fichier | Raison | Action |
|---------|--------|--------|
| `src/components/auth/ProfileCreation.jsx` ligne 183 | `{/* Progress bar */}` | ⚠️ NE PAS MODIFIER (barre de progression HTML) |
| `src/styles/index.css` ligne 24 | `/* Couleurs thématiques des Bars */` | ✅ À modifier (commentaire) |

---

## 🎯 Stratégie de renommage

### Étape 1 : Textes UI (commit 2)
- README.md
- Tous les textes affichés à l'utilisateur
- Labels, titres, descriptions

### Étape 2 : Code (commit 3)
- Renommer variables : `bars` → `salons`, `bar` → `salon`
- Renommer fonctions : `getBarName()` → `getSalonName()`
- Renommer composants : `BarsScreen` → `SalonsScreen`
- Renommer fichiers si nécessaire

### Étape 3 : Documentation (commit 4)
- Commentaires dans le code
- Documentation technique

---

## ⚠️ Points d'attention

1. **Fichier `src/components/auth/ProfileCreation.jsx` ligne 183** :
   → `{/* Progress bar */}` = barre de progression HTML, **NE PAS TOUCHER**

2. **Propriété `stats.bars`** dans les profils utilisateurs :
   → Peut nécessiter migration de données si stocké en localStorage

3. **Routes et endpoints** :
   → Vérifier si des URLs dépendent de `/bars` ou `/bar/:id`

4. **localStorage keys** :
   → Clé `jeutaime_bars_state` dans `barsSystem.js` à migrer ?

5. **Imports/exports** :
   → Vérifier tous les imports après renommage des fichiers

---

## 📦 Fichiers à renommer (probablement)

- `src/components/screens/BarsScreen.jsx` → `SalonsScreen.jsx`
- `src/components/screens/BarDetailScreen.jsx` → `SalonDetailScreen.jsx`
- `src/utils/barsSystem.js` → `salonsSystem.js`
- `src/utils/barExchangeSystem.js` → `salonExchangeSystem.js`
- `src/components/admin/sections/Bars.jsx` → `Salons.jsx`

---

**Total estimé : ~200+ occurrences à traiter**
