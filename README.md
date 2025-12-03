# 💕 JeuTaime - L'application de rencontres anti-superficielle

Bienvenue sur **JeuTaime**, une application de rencontres innovante qui met l'accent sur la personnalité plutôt que sur l'apparence physique.

## 🌟 Caractéristiques principales

### 📱 Fonctionnalités de base
- **Profils approfondis** : Découvrez les personnes en profondeur avant de voir leurs photos
- **Système de lettres** : Échangez des messages authentiques
- **Salons thématiques** : Rejoignez des salons de discussion avec différentes ambiances
- **Journal communautaire** : Suivez l'actualité de la communauté
- **Système de pièces** : Gagnez et dépensez des pièces virtuelles

### 🎮 Jeux intégrés
- **HeroLove Quest** : Jeu RPG romantique pour gagner des pièces
- **Pong** : Jeu classique pour 2 joueurs
- **Tape la Taupe** : Jeu de réflexes solo
- **Morpion** : Jeu de stratégie pour 2 joueurs
- **Jeu des Cartes** : Jeu de hasard pour gagner des pièces
- **Continue l'histoire** : Jeu collaboratif de narration
- **Casse Brique** : À venir

### ✨ Fonctionnalités sociales
- **Offrandes magiques** : Envoyez des cadeaux virtuels (roses, philtres, bouquets, etc.)
- **5 Salons thématiques** :
  - 🌹 Salon Romantique
  - 😄 Salon Humoristique
  - 🏴‍☠️ Salon Pirates
  - 📅 Salon Hebdomadaire
  - 👑 Salon Caché
- **Adoption de compagnons** : Adoptez des animaux virtuels
- **Concours hebdomadaires** : Participez aux élections de popularité

### 👑 Système Premium
- 5 000 pièces offertes chaque mois
- 10 conversations privées simultanées
- Photos débloquées instantanément
- Badge Premium visible
- Priorité dans les Salons

## 🚀 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation des dépendances

```bash
# Cloner le repository
git clone https://github.com/Warren573/JEUTAIME.git
cd JEUTAIME

# Installer les dépendances
npm install
```

## 💻 Développement

### Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Build de production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

### Prévisualiser le build

```bash
npm run preview
```

## 📁 Structure du projet

```
JEUTAIME/
├── public/              # Fichiers statiques
│   └── heart.svg        # Icône de l'application
├── src/
│   ├── components/      # Composants React
│   │   ├── games/       # Composants des jeux
│   │   │   ├── HeroLoveQuest.jsx
│   │   │   ├── PongGame.jsx
│   │   │   ├── WhackAMoleGame.jsx
│   │   │   ├── BrickBreakerGame.jsx
│   │   │   ├── MorpionGame.jsx
│   │   │   ├── CardGame.jsx
│   │   │   └── StoryTimeGame.jsx
│   │   ├── screens/     # Écrans principaux
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── ProfilesScreen.jsx
│   │   │   ├── SocialScreen.jsx
│   │   │   ├── LettersScreen.jsx
│   │   │   ├── JournalScreen.jsx
│   │   │   ├── SettingsScreen.jsx
│   │   │   └── BarDetailScreen.jsx
│   │   ├── Header.jsx
│   │   └── Navigation.jsx
│   ├── data/            # Données statiques
│   │   └── appData.js
│   ├── styles/          # Styles CSS
│   │   └── index.css
│   ├── App.jsx          # Composant principal
│   └── main.jsx         # Point d'entrée
├── index.html           # Template HTML
├── package.json         # Dépendances
├── vite.config.js       # Configuration Vite
└── README.md            # Ce fichier
```

## 🎯 Utilisation

### Navigation
L'application dispose de 6 sections principales accessibles via la barre de navigation :
- 🏠 **Accueil** : Vue d'ensemble et démarrage rapide
- 👤 **Profils** : Découverte de profils
- 👥 **Social** : Salons, jeux, adoption, concours
- 💌 **Lettres** : Messages et offrandes
- 📰 **Journal** : Actualités de la communauté
- ⚙️ **Paramètres** : Configuration du profil

### Système de pièces
- Gagnez des pièces en jouant aux jeux
- Achetez des packs de pièces dans la boutique
- Utilisez les pièces pour envoyer des offrandes

### Jeux
Accédez aux jeux depuis la section **Social > Jeux**

#### HeroLove Quest
- Déplacez-vous sur la grille avec les flèches
- Surmontez les obstacles avec vos stats
- Atteignez le rendez-vous décisif pour gagner !

#### Tape la Taupe
- Cliquez sur les taupes dorées qui apparaissent
- Évitez de cliquer sur les trous vides
- Survivez 30 secondes pour battre votre record

#### Pong
- Utilisez les flèches ↑↓ pour contrôler votre raquette
- Marquez des points contre le bot

#### Jeu des Cartes
- Retournez des cartes pour gagner des pièces
- ❤️ +15 pièces
- ♣️ Divise vos gains par 2
- ♠️ Vous perdez tout
- ♦️ Indice sur les cartes restantes

## 🛠️ Technologies utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool et serveur de développement
- **JavaScript (ES6+)** - Langage de programmation
- **CSS-in-JS** - Styling inline

## 📝 Licence

Ce projet est sous licence privée.

## 👥 Contribution

Les contributions ne sont pas acceptées pour le moment.

## 📧 Contact

Pour toute question, veuillez ouvrir une issue sur GitHub.

---

Développé avec ❤️ par l'équipe JeuTaime