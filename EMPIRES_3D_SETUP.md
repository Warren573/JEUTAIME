# Empires d'Étheria 3D - Guide d'installation

## 📦 Dépendances à installer

```bash
npm install @react-three/fiber @react-three/drei three
npm install firebase
npm install zustand  # Pour la gestion d'état
npm install @react-spring/three  # Pour les animations
```

## 🏗️ Structure des fichiers créés

```
src/
├── components/games/empires3d/
│   ├── EmpiresEtheria3D.jsx          # Composant principal 3D
│   ├── Board3D.jsx                    # Plateau circulaire 3D
│   ├── Cell3D.jsx                     # Cases 3D (villes, événements)
│   ├── Player3D.jsx                   # Pions des joueurs
│   ├── Effects3D.jsx                  # Effets visuels fantasy
│   ├── UI3D.jsx                       # Interface overlay
│   └── Camera3D.jsx                   # Contrôle de caméra
│
├── services/empires/
│   ├── firebaseConfig.js              # Config Firebase
│   ├── gameService.js                 # Logique du jeu
│   └── multiplayerService.js          # Gestion multijoueur
│
└── hooks/empires/
    ├── useEmpiresGame.js              # Hook principal
    └── useMultiplayer.js              # Hook multijoueur
```

## 🔥 Configuration Firebase

1. Créer un projet Firebase sur https://console.firebase.google.com
2. Activer Firestore Database
3. Activer Authentication (Email/Password)
4. Copier les credentials dans `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🎮 Structure Firestore

```
games/
  └── {gameId}/
      ├── state: { board, players, currentPlayer, etc. }
      ├── createdAt: timestamp
      ├── updatedAt: timestamp
      └── status: "waiting" | "active" | "finished"

players/
  └── {playerId}/
      ├── games: [gameIds]
      └── activeGames: [gameIds]
```

## 🚀 Lancement

1. Installer les dépendances: `npm install`
2. Configurer Firebase (voir ci-dessus)
3. Lancer l'app: `npm run dev`
4. Accéder au jeu via Social > Empires d'Étheria 3D

## 📱 Optimisations Mobile

- Rendu adaptatif (moins de polygones sur mobile)
- Contrôles tactiles optimisés
- Chargement progressif des assets
- Mode performance réduit disponible
