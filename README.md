# 💕 JeuTaime v2.0 - L'application de rencontres anti-superficielle

**JeuTaime** est une application de rencontres innovante qui privilégie la personnalité sur l'apparence. Découvrez les personnes en profondeur avant de voir leurs photos grâce à un système de points, de jeux et d'échanges épistolaires.

🌐 **Site web** : [jeutaime.vercel.app](https://jeutaime.vercel.app)
📦 **Version** : 2.0.1
⚛️ **Stack** : React 18 + Vite

---

## 🌟 Fonctionnalités principales

### 👤 Profils enrichis

- **Création de profil** avec avatar personnalisé (système Avataaars)
- **Questions personnelles** : 3 questions pour mieux vous connaître
- **Informations détaillées** :
  - Bio (50-500 caractères)
  - Ville, code postal, date de naissance
  - Job, intérêts
- **Nouvelles préférences de rencontre v2.0** :
  - 💑 **Intéressé•e par** : Femmes ou Hommes
  - 🔍 **Recherche** : Relation sérieuse, Du Fun, Amitiés, Advienne que pourra
  - 👶 **Enfants** : Je n'ai pas d'enfant, J'ai des enfants, J'en veux un jour, J'en ai mais pas assez, Je n'en veux pas, Rien n'est certain
- **Description physique humoristique** : 8 options amusantes (Filiforme, Athlétique, En formes généreuses, etc.)
- **Photos** : Jusqu'à 3 photos débloquées progressivement (10, 20, 30 lettres échangées)

### 💌 Système de lettres

- **Conversations privées** illimitées (ou 10 max pour utilisateurs gratuits)
- **Envoi de lettres** romantiques et authentiques
- **Offrandes magiques** : roses, philtres d'amour, bouquets, champagne, chocolats
- **Déverrouillage progressif** : Plus vous échangez, plus vous en découvrez

### 🎮 Jeux intégrés (6 jeux)

Gagnez des pièces en jouant :

1. **Tape Taupe** - Jeu de réflexes solo (30 secondes, taupes dorées)
2. **Pong** - Jeu classique à 2 joueurs
3. **Morpion** - Jeu de stratégie à 2 joueurs
4. **Jeu des Cartes** - Jeu de hasard avec gains/pertes
   - ❤️ +15 pièces
   - ♣️ Divise vos gains par 2
   - ♠️ Vous perdez tout
   - ♦️ Indice sur les cartes
5. **Continue l'histoire** - Jeu collaboratif de narration
6. **Casse Brique** - Mini-jeu arcade

### 🍺 Salons thématiques (5 salons)

Rejoignez des salons de discussion communautaires :
- 🌹 **Salon Romantique** - Pour les cœurs tendres
- 😄 **Salon Humoristique** - Rires et blagues
- 🏴‍☠️ **Salon Pirates** - Ambiance aventure
- 📅 **Salon Hebdomadaire** - Événements de la semaine
- 👑 **Salon Caché** - Accès premium uniquement

### 🏆 Système de points et badges

- **Points** gagnés en :
  - Envoyant des lettres (+10 points/lettre)
  - Jouant aux jeux (+5 points/partie)
  - Participant aux salons (+15 points/visite)
- **Badges déblocables** : Premium, Top joueur, Bavard, etc.
- **Classement** : Comparez-vous aux autres utilisateurs

### 🎁 Boutique et économie

- **Pièces virtuelles** pour acheter :
  - Packs de pièces (100, 500, 1000, 5000)
  - Offrandes magiques
  - Abonnement Premium
- **Prix** :
  - Rose : 50 pièces
  - Philtre d'amour : 100 pièces
  - Bouquet : 150 pièces
  - Premium mensuel : 500 pièces

### 👑 Abonnement Premium

- **5 000 pièces** offertes chaque mois
- **10 conversations privées** simultanées
- **Photos débloquées** instantanément
- **Badge Premium** visible sur votre profil
- **Accès au Salon Caché**
- **Priorité** dans les salons

### 📰 Journal communautaire

- **Événements** : Soirées, tournois de Scrabble
- **Actualités** : Nouveautés et mises à jour
- **Annonces** : Concours, élections de popularité

### 🐾 Adoption de compagnons

Adoptez des animaux virtuels pour personnaliser votre profil :
- Chats, chiens, oiseaux, poissons
- Affichage sur votre profil
- Interaction avec la communauté

### 🎯 Découverte de profils

- **Profils démo** : 4 bots pour tester l'app (Admin, Sophie, Emma, Chloé)
- **Filtre par compatibilité** : Algorithme basé sur vos réponses aux questions
- **Distance** : Calculée à partir de votre code postal
- **Dernière activité** : Sachez qui est en ligne

### ⚙️ Espace Personnel

- **Mon Espace Perso** : Statistiques personnelles
  - Lettres envoyées/reçues
  - Parties de jeux jouées
  - Visites de salons
  - Badges débloqués
- **Éditeur d'avatar** : Personnalisez votre avatar Avataaars
- **Paramètres du profil** : Modifiez toutes vos informations
- **Parrainage** : Invitez des amis et gagnez des bonus

### 🎖️ Souvenirs et réalisations

- **Galerie de souvenirs** : Conservez vos moments importants
- **Collection de badges** : Affichez vos accomplissements
- **Historique** : Revivez vos meilleures interactions

### 🔐 Administration (mode admin)

Panel d'administration complet :
- **Dashboard** : Vue d'ensemble des statistiques
- **Gestion des utilisateurs** : Modération et bannissement
- **Gestion des salons** : Création/modification
- **Gestion des jeux** : Configuration des récompenses
- **Modération** : Signalements et contenus inappropriés

---

## 🚀 Installation

### Prérequis

- **Node.js** 18+
- **npm** ou **yarn**

### Installation des dépendances

```bash
# Cloner le repository
git clone https://github.com/Warren573/JEUTAIME.git
cd JEUTAIME

# Installer les dépendances
npm install
```

### Lancer en développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

### Build de production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

### Déploiement sur Vercel

```bash
npm run deploy
```

---

## 📁 Structure du projet

```
JEUTAIME/
├── public/
│   ├── heart.svg                # Icône de l'app
│   └── version.txt              # Version du déploiement
├── src/
│   ├── components/
│   │   ├── admin/               # Panel d'administration
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── sections/        # Dashboard, Users, Bars, Games, Moderation
│   │   ├── auth/                # Authentification
│   │   │   ├── AuthScreen.jsx
│   │   │   ├── AvatarCreator.jsx
│   │   │   └── ProfileCreation.jsx
│   │   ├── avatar/              # Gestion des avatars
│   │   │   └── UserAvatar.jsx
│   │   ├── bottle/              # Messages en bouteille
│   │   │   └── MessageBottleModal.jsx
│   │   ├── common/              # Composants réutilisables
│   │   │   ├── BackButton.jsx
│   │   │   └── ScreenHeader.jsx
│   │   ├── effects/             # Effets visuels
│   │   │   └── MagicEffect.jsx
│   │   ├── games/               # 6 jeux
│   │   │   ├── WhackAMoleGame.jsx (Tape Taupe)
│   │   │   ├── PongGame.jsx
│   │   │   ├── MorpionGame.jsx
│   │   │   ├── CardGame.jsx
│   │   │   ├── StoryTimeGame.jsx
│   │   │   └── BrickBreakerGame.jsx
│   │   ├── gifts/               # Système de cadeaux
│   │   │   └── GiftSelector.jsx
│   │   ├── magic/               # Inventaire magique
│   │   │   └── MagicInventory.jsx
│   │   ├── matching/            # Jeu de questions
│   │   │   └── QuestionGame.jsx
│   │   ├── personal/            # Stats personnelles
│   │   │   ├── ReceivedGifts.jsx
│   │   │   └── SocialStats.jsx
│   │   ├── screens/             # Écrans principaux (17 screens)
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── ProfilesScreen.jsx
│   │   │   ├── SocialScreen.jsx
│   │   │   ├── BarsScreen.jsx
│   │   │   ├── BarDetailScreen.jsx
│   │   │   ├── LettersScreen.jsx
│   │   │   ├── ChatScreen.jsx
│   │   │   ├── JournalScreen.jsx
│   │   │   ├── SettingsScreen.jsx
│   │   │   ├── EspacePersoScreen.jsx
│   │   │   ├── EspacePersoScreenSimple.jsx
│   │   │   ├── AvatarEditorScreen.jsx
│   │   │   ├── AdoptionScreen.jsx
│   │   │   ├── BadgesScreen.jsx
│   │   │   ├── MemoriesScreen.jsx
│   │   │   ├── RankingScreen.jsx
│   │   │   └── ReferralScreen.jsx
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   └── MagicGiftsPanel.jsx
│   ├── data/
│   │   └── appData.js           # Données statiques (profils, badges, salons)
│   ├── utils/
│   │   ├── demoUsers.js         # Gestion des profils démo
│   │   ├── pointsSystem.js      # Système de points et badges
│   │   ├── giftsSystem.js       # Gestion des offrandes
│   │   └── ...
│   ├── styles/
│   │   └── index.css            # Styles globaux
│   ├── App.jsx                  # Composant racine
│   └── main.jsx                 # Point d'entrée
├── .github/workflows/
│   └── auto-deploy.yml          # CI/CD GitHub Actions
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                  # Configuration Vercel
└── README.md
```

---

## 🎯 Guide d'utilisation

### 🔐 Inscription / Connexion

1. Créez votre compte avec email/mot de passe
2. Créez votre avatar personnalisé (Avataaars)
3. Remplissez votre profil :
   - Informations personnelles
   - 3 questions sur votre personnalité
   - Préférences de rencontre
   - Description physique

### 💌 Envoyer une lettre

1. Allez dans **Profils** (Découverte)
2. Parcourez les profils
3. Cliquez sur **Envoyer une lettre**
4. Rédigez votre message
5. (Optionnel) Ajoutez une offrande magique

### 🎮 Jouer aux jeux

1. Allez dans **Social** → **Jeux**
2. Choisissez votre jeu préféré
3. Gagnez des pièces en jouant
4. Utilisez vos pièces dans la boutique

### 🍺 Rejoindre un salon

1. Allez dans **Social** → **Salons**
2. Choisissez un salon thématique
3. Discutez avec la communauté
4. Gagnez +15 points par visite

### 🏆 Débloquer des badges

- **Lettres** : Envoyez 10, 50, 100 lettres
- **Jeux** : Jouez 20, 50 parties
- **Social** : Visitez 10 salons
- **Premium** : Achetez l'abonnement

---

## 🛠️ Technologies

| Technologie | Usage |
|------------|-------|
| **React 18** | Framework UI |
| **Vite** | Build tool ultra-rapide |
| **Avataaars** | Avatars personnalisables |
| **LocalStorage** | Persistance des données |
| **CSS-in-JS** | Styling inline |
| **Vercel** | Hébergement et déploiement |
| **GitHub Actions** | CI/CD automatique |

---

## 🔄 Workflow de déploiement

Le projet utilise **GitHub Actions** pour le déploiement automatique :

1. Push sur une branche `claude/production-deploy-*`
2. GitHub Actions merge automatiquement vers `main`
3. Vercel détecte le push sur `main`
4. Build et déploiement automatique

```bash
# Pour déployer manuellement
git checkout -b claude/production-deploy-[session-id]
git push origin claude/production-deploy-[session-id]
```

---

## 📊 Système de données

### LocalStorage Keys

```javascript
jeutaime_users           // Tous les utilisateurs (vrais + bots)
jeutaime_current_user    // Utilisateur connecté
jeutaime_conversations   // Messages et lettres
jeutaime_gifts_inventory // Inventaire des offrandes
jeutaime_badges          // Badges débloqués
jeutaime_memories        // Souvenirs sauvegardés
```

### Profils démo (4 bots)

- **admin@jeutaime.com** - Profil admin (999,999 pièces)
- **sophie@demo.jeutaime.com** - Sophie, 29 ans, Paris
- **emma@demo.jeutaime.com** - Emma, 27 ans, Paris
- **chloe@demo.jeutaime.com** - Chloé, 30 ans, Paris

---

## 🎨 Personnalisation

### Thèmes disponibles

- **Rose romantique** : #FF6B9D
- **Violet mystique** : #9C27B0
- **Bleu océan** : #2196F3
- **Vert nature** : #4CAF50
- **Orange passion** : #FF5722
- **Or royal** : #FFD700

### Variables CSS principales

```css
--color-primary: #FF6B9D
--color-secondary: #9C27B0
--color-cream: #FFF5E1
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--border-radius-sm: 8px
--border-radius-md: 12px
--border-radius-lg: 16px
```

---

## 🐛 Debugging

### Vérifier les profils démo

```javascript
// Dans la console du navigateur
JSON.parse(localStorage.getItem('jeutaime_users'))
```

### Forcer la recréation des profils démo

```javascript
// Supprimer les profils démo
localStorage.removeItem('jeutaime_users');
localStorage.removeItem('jeutaime_demo_version');
// Recharger la page
location.reload();
```

### Vérifier la version déployée

Accédez à `https://jeutaime.vercel.app/version.txt`

---

## 📝 Changelog

### v2.0.1 (2026-02-17)
- 🐛 **FIX CRITIQUE** : Correction du Service Worker causant un écran blanc sur Vercel
- 🔧 Retrait de `/src/main.jsx` des URLs à cacher (fichier inexistant en production)
- ⚡ Mise à jour du cache vers v2.0.1

### v2.0.0 (2025-01-05)
- ✨ Ajout des préférences de rencontre (Intéressé•e par, Recherche, Enfants)
- ✨ Ajout de la description physique humoristique
- 🎮 Renommage "Tape la Taupe" → "Tape Taupe"
- 🐛 Amélioration du système de profils démo
- 🐛 Correction complète des boutons retour manquants sur mobile
- 📱 Ajout des safe areas pour iOS/Android
- 🚀 Optimisation du déploiement automatique

### v1.0.1
- 🎨 Design mobile-first
- 💌 Système de lettres et offrandes
- 🎮 6 jeux intégrés
- 🍺 5 salons thématiques

---

## 📜 Licence

Ce projet est sous **licence privée**. Tous droits réservés.

## 👥 Contribution

Les contributions externes ne sont pas acceptées pour le moment.

## 📧 Support

Pour toute question ou problème :
- 🐛 Ouvrez une issue sur [GitHub](https://github.com/Warren573/JEUTAIME/issues)
- 📧 Contactez l'équipe de développement

---

**Développé avec ❤️ par l'équipe JeuTaime**

*Application de rencontres nouvelle génération - Où la personnalité compte plus que l'apparence*
