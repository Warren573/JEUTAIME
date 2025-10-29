# 🏰 Empires d'Étheria 3D - Guide Complet

## 🎮 Vue d'ensemble

**Empires d'Étheria 3D** est une version entièrement immersive et 3D du jeu de plateau stratégique, avec support multijoueur asynchrone via Firebase.

### ✨ Fonctionnalités principales

- 🎯 **Rendu 3D immersif** avec React-Three-Fiber
- 🌐 **Multijoueur asynchrone** (chaque joueur joue à son tour)
- 📱 **Compatible mobile** (contrôles tactiles optimisés)
- 🎨 **Effets visuels fantasy** (particules, lumières, animations)
- 💾 **Sauvegarde cloud** avec Firebase Firestore
- 🏆 **Système de récompenses** intégré
- 📊 **Statistiques persistantes**

---

## 📦 Installation

### 1. Installer les dépendances

```bash
cd /home/user/JEUTAIME
npm install @react-three/fiber @react-three/drei three
npm install firebase
```

### 2. Configurer Firebase (optionnel pour le multijoueur)

#### a. Créer un projet Firebase

1. Aller sur https://console.firebase.google.com
2. Créer un nouveau projet "JeuTaime" ou utiliser un existant
3. Activer **Firestore Database** (mode test pour commencer)
4. Activer **Authentication** > Email/Password

#### b. Obtenir les credentials

Dans les paramètres du projet > Configuration du projet > Vos applications > Config SDK :

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "jeutaime-....firebaseapp.com",
  projectId: "jeutaime-...",
  storageBucket: "jeutaime-....appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

#### c. Créer le fichier `.env.local`

Créer un fichier `.env.local` à la racine du projet :

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

⚠️ **Important** : Ajouter `.env.local` au `.gitignore` !

#### d. Règles de sécurité Firestore

Dans Firebase Console > Firestore Database > Règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les parties d'Empires d'Étheria
    match /empires_games/{gameId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                     request.auth.uid in resource.data.players;
    }
  }
}
```

---

## 🚀 Utilisation

### Mode Local (sans Firebase)

Le jeu fonctionne **automatiquement en mode local** si Firebase n'est pas configuré.

- ✅ Partie contre un bot
- ✅ Sauvegarde localStorage
- ✅ Tous les effets 3D

### Mode Multijoueur (avec Firebase)

Une fois Firebase configuré :

1. **Créer une partie** : Le premier joueur crée une partie
2. **Partager le code** : Les autres joueurs rejoignent avec le code
3. **Jouer à tour de rôle** : Chaque joueur reçoit une notification quand c'est son tour

---

## 🎯 Structure des fichiers créés

```
src/
├── components/games/empires3d/
│   ├── EmpiresEtheria3D.jsx       ✅ Créé - Composant principal
│   ├── Board3D.jsx                ✅ Créé - Plateau circulaire 3D
│   ├── Player3D.jsx               ✅ Créé - Pions des joueurs
│   ├── Effects3D.jsx              ✅ Créé - Effets visuels
│   └── UI3D.jsx                   ✅ Créé - Interface overlay
│
├── services/empires/
│   ├── firebaseConfig.js          ✅ Créé - Configuration Firebase
│   └── multiplayerService.js      ✅ Créé - Gestion multijoueur
│
└── components/games/
    └── EmpiresEtheriaGame.jsx     📝 Existe (version 2D)
```

---

## 🔧 Intégration dans l'app

### Option 1: Remplacer la version 2D

Dans `src/App.jsx` :

```javascript
// Remplacer
import EmpiresEtheriaGame from './components/games/EmpiresEtheriaGame';

// Par
import EmpiresEtheria3D from './components/games/empires3d/EmpiresEtheria3D';

// Et dans le rendu :
{gameScreen === 'empires' && <EmpiresEtheria3D {...appState} />}
```

### Option 2: Ajouter comme jeu séparé

Dans `src/App.jsx` :

```javascript
import EmpiresEtheria3D from './components/games/empires3d/EmpiresEtheria3D';

// Dans le rendu :
{gameScreen === 'empires3d' && <EmpiresEtheria3D {...appState} />}
```

Dans `src/components/screens/SocialScreen.jsx` :

```javascript
<div onClick={() => setGameScreen('empires3d')} style={{...}}>
  <div style={{ fontSize: '36px' }}>🏰</div>
  <h4>Empires d'Étheria 3D</h4>
  <p>Version 3D immersive avec multijoueur</p>
</div>
```

---

## 📱 Optimisations Mobile

Le jeu est **automatiquement optimisé** pour mobile :

- ✅ Détection de la taille d'écran
- ✅ Contrôles tactiles (pinch to zoom, swipe)
- ✅ Rendu adaptatif (moins de polygones)
- ✅ Interface responsive

Configuration dans le code :

```javascript
const isMobile = window.innerWidth < 768;

<Canvas
  dpr={isMobile ? [1, 1.5] : [1, 2]}
  performance={{ min: 0.5 }}
>
  <OrbitControls
    enablePan={!isMobile}
    enableZoom={!isMobile}
  />
</Canvas>
```

---

## 🎨 Personnalisation

### Changer les couleurs du thème

Dans `Board3D.jsx` :

```javascript
// Changer la couleur du plateau
<meshStandardMaterial
  color="#1a0a2a"  // ← Modifier ici
  metalness={0.8}
  roughness={0.2}
/>
```

### Ajouter de nouveaux types de cases

Dans `EmpiresEtheria3D.jsx` :

```javascript
function initializeBoard() {
  return [
    // ... cases existantes
    { id: 24, type: "treasure", name: "Coffre du Roi", bonus: 50 }  // Nouvelle case
  ];
}
```

Dans `Board3D.jsx` :

```javascript
// Ajouter la gestion du nouveau type
if (cell.type === 'treasure') {
  color = '#fbbf24';
  emissiveColor = '#f59e0b';
  icon = '💰';
}
```

### Modifier la taille du plateau

Dans `Board3D.jsx` :

```javascript
const radius = 10;  // ← Changer pour agrandir/réduire
```

---

## 🐛 Dépannage

### Erreur: "Cannot find module '@react-three/fiber'"

```bash
npm install @react-three/fiber @react-three/drei three
```

### Erreur: "Firebase app not initialized"

Le jeu fonctionne en **mode local** sans Firebase. Configurer Firebase seulement pour le multijoueur.

### Performance lente sur mobile

Réduire le nombre de particules dans `Effects3D.jsx` :

```javascript
<MagicParticles count={100} />  // Au lieu de 200
```

### Canvas vide / écran noir

Vérifier la console pour les erreurs. S'assurer que Three.js est bien installé :

```bash
npm list three
```

---

## 📊 Structure Firestore (si multijoueur activé)

```javascript
empires_games/
  └── game_123456/
      ├── id: "game_123456"
      ├── status: "active"
      ├── creator: "user_id"
      ├── players: [
      │   {
      │     id: "player_1",
      │     name: "Aelyr",
      │     color: "#667eea",
      │     position: 5,
      │     mana: 45,
      │     artifacts: [],
      │     skipNext: false
      │   },
      │   { ... }
      ├── ]
      ├── board: [ ... ]
      ├── currentPlayerIndex: 0
      ├── turn: 3
      ├── lastAction: {
      │     type: "buy_city",
      │     playerId: "player_1",
      │     timestamp: Timestamp
      ├── }
      ├── createdAt: Timestamp
      └── updatedAt: Timestamp
```

---

## 🚀 Déploiement sur Vercel

Le jeu fonctionne directement avec le déploiement Vercel existant :

```bash
# Construire l'app
npm run build

# Déployer
npm run deploy
```

Les variables d'environnement Firebase doivent être ajoutées dans Vercel :
1. Projet Vercel > Settings > Environment Variables
2. Ajouter toutes les `VITE_FIREBASE_*` variables

---

## 🎯 Prochaines améliorations possibles

- [ ] **Mode spectateur** pour regarder les parties en cours
- [ ] **Chat vocal** entre joueurs
- [ ] **Replays** des parties
- [ ] **Tournois** avec classement global
- [ ] **Skins 3D** pour les pions
- [ ] **Terrains thématiques** (glace, feu, nature)
- [ ] **Mode équipe** (2v2)
- [ ] **IA améliorée** avec niveaux de difficulté

---

## 📝 License

Partie de l'application JeuTaime - Tous droits réservés

---

## 💡 Support

- Documentation React Three Fiber : https://docs.pmnd.rs/react-three-fiber
- Documentation Three.js : https://threejs.org/docs/
- Documentation Firebase : https://firebase.google.com/docs

---

**Créé avec ❤️ pour JeuTaime**
