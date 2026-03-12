# 💖 JeuTaime — L'appli de rencontres par les mots

**JeuTaime** est une application de rencontres qui privilégie la personnalité sur l'apparence. Ici, pas de swipe, pas de photos floues dès le premier regard. Tu découvres les gens à travers leurs lettres, leurs mots, leur humour. L'image vient après.

🌐 **Site web** : [jeutaime.vercel.app](https://jeutaime.vercel.app)
📦 **Version** : 2.0.1
⚛️ **Stack** : React 18 + Vite

---

## ✨ Concept

JeuTaime fonctionne comme un jeu social : chaque interaction (lettre envoyée, salon visité, partie jouée) te rapporte des points et dévoile de nouvelles choses. Les photos de profil sont floues au départ et se débloquent au fil des échanges.

> La personnalité d'abord. L'image ensuite.

---

## 🎮 Mécaniques de jeu

### 💌 Les Lettres — le cœur de l'app

Les lettres privées sont la mécanique principale. Tu envoies, tu reçois, tu progresses.

| Action | Points |
|--------|--------|
| Envoyer une lettre | +10 pts |
| Recevoir une réponse | +15 pts |

**Déverrouillage progressif des photos :**
- Photo 1 → après 10 lettres échangées
- Photo 2 → après 20 lettres échangées
- Photo 3 → après 30 lettres échangées

### 😊 Sourires & 😬 Grimaces

En parcourant les profils, tu exprimes ta réaction :

| Action | Points |
|--------|--------|
| Envoyer un sourire | +5 pts |
| Recevoir un sourire | +10 pts |
| Recevoir une grimace | −5 pts |

### 💘 Matchs

Deux sourires mutuels créent un match. Un questionnaire de compatibilité le valide. **Bonus : +50 pts chacun.**

### 🏛️ Salons de discussion

5 salons thématiques pour rencontrer la communauté en groupe :

- 🌹 **Romantique** — pour les cœurs tendres
- 😄 **Humoristique** — rires et légèreté
- 🏴‍☠️ **Pirates** — esprit aventurier
- 📅 **Hebdomadaire** — événements de la semaine
- 👑 **Caché** — accès Premium uniquement

Chaque visite rapporte **+15 pts**. Les histoires collectives rapportent **+5 pts/phrase** et **+50 pts** à la complétion.

### 🎮 Mini-jeux

6 jeux pour gagner des pièces et s'amuser :

| Jeu | Mode | Gain victoire |
|-----|------|---------------|
| 🐭 Tape Taupe | Solo (30 sec) | +50 pts |
| 🏓 Pong | 2 joueurs | +50 pts |
| ❌ Morpion | 2 joueurs | +50 pts |
| 🃏 Jeu des Cartes | Solo, hasard | Variable |
| 📖 Continue l'Histoire | Collaboratif | +5 pts/phrase |
| 🧱 Casse-Brique | Solo, arcade | +50 pts |

Défaite : **−10 pts**

### 🐾 Compagnon virtuel

Adopte un animal et prends soin de lui. Il s'affiche sur ton profil et réagit à tes actions. 4 jauges : 🍽️ Faim · 😊 Bonheur · ⚡ Énergie · 🧼 Propreté.

### 🏅 Points, Niveaux & Badges

Les points font monter ton niveau et débloquent des badges. Chaque semaine, **1 profil féminin** et **1 profil masculin** sont mis en avant par la communauté.

### 🎁 Offrandes & Magie

Envoie des cadeaux pour marquer les esprits :

| Offrande | Prix |
|----------|------|
| 🌹 Rose | 50 pièces |
| 🍫 Chocolats | 75 pièces |
| 💜 Philtre d'amour | 100 pièces |
| 💐 Bouquet | 150 pièces |
| 🍾 Champagne | 200 pièces |

### 👑 Premium

- **5 000 pièces** offertes chaque mois
- **10 conversations** simultanées
- **Photos débloquées** instantanément
- **Badge Premium** sur ton profil
- **Accès au Salon Caché**
- **Prix** : 500 pièces/mois

---

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/Warren573/JEUTAIME.git
cd JEUTAIME

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

```bash
# Build de production
npm run build

# Déployer sur Vercel
npm run deploy
```

---

## 📁 Structure du projet

```
JEUTAIME/
├── public/
│   └── heart.svg
├── src/
│   ├── features/                # Domaines métier
│   │   ├── auth/                # Authentification & création de profil
│   │   ├── home/                # Écran d'accueil & espace perso
│   │   ├── profiles/            # Découverte de profils
│   │   ├── letters/             # Lettres & conversations
│   │   ├── social/              # Salons & jeux
│   │   ├── games/               # 6 mini-jeux
│   │   ├── pets/                # Adoption d'animaux
│   │   ├── memories/            # Souvenirs & badges
│   │   ├── journal/             # Journal communautaire
│   │   ├── ranking/             # Classement
│   │   ├── referral/            # Parrainage
│   │   └── admin/               # Panel d'administration
│   ├── shared/                  # Composants & hooks réutilisables
│   │   ├── components/          # UI partagée (AppShell, Header, Navigation…)
│   │   ├── hooks/               # useAuth, useCoins, usePets, useLetters…
│   │   └── stores/              # Zustand (session, UI, economy)
│   ├── config/                  # Configuration (Supabase, constantes)
│   ├── mocks/                   # Profils démo & données de test
│   ├── styles/                  # CSS global
│   ├── App.jsx                  # Composant racine
│   └── main.jsx                 # Point d'entrée
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## 🛠️ Technologies

| Technologie | Usage |
|------------|-------|
| **React 18** | Framework UI |
| **Vite** | Build tool |
| **Zustand** | State management |
| **Avataaars** | Avatars personnalisables |
| **LocalStorage** | Persistance locale |
| **Supabase** | Backend (préparé, en cours) |
| **Vercel** | Hébergement |
| **GitHub Actions** | CI/CD automatique |

---

## 🔄 Déploiement

Le projet utilise **GitHub Actions** pour le déploiement automatique :

1. Push sur une branche `claude/production-deploy-*`
2. GitHub Actions merge automatiquement vers `main`
3. Vercel détecte le push et déploie

```bash
# Déployer manuellement
git checkout -b claude/production-deploy-[session-id]
git push origin claude/production-deploy-[session-id]
```

---

## 📊 Données locales

```javascript
jeutaime_users           // Utilisateurs (réels + bots)
jeutaime_current_user    // Utilisateur connecté
jeutaime_conversations   // Lettres & messages
jeutaime_gifts_inventory // Inventaire des offrandes
jeutaime_badges          // Badges débloqués
jeutaime_memories        // Souvenirs sauvegardés
```

### Profils démo

| Email | Rôle |
|-------|------|
| `admin@jeutaime.com` | Administrateur |
| `sophie@demo.jeutaime.com` | Sophie, 29 ans, Paris |
| `emma@demo.jeutaime.com` | Emma, 27 ans, Paris |
| `chloe@demo.jeutaime.com` | Chloé, 30 ans, Paris |

---

## 🐛 Debugging

```javascript
// Voir les utilisateurs en console navigateur
JSON.parse(localStorage.getItem('jeutaime_users'))

// Réinitialiser les profils démo
localStorage.removeItem('jeutaime_users')
localStorage.removeItem('jeutaime_demo_version')
location.reload()
```

Vérifier la version déployée : `https://jeutaime.vercel.app/version.txt`

---

## 📝 Changelog

### v2.0.1 (2026-02-17)
- Fix critique : Service Worker causant un écran blanc sur Vercel

### v2.0.0 (2026-01-05)
- Préférences de rencontre (Intéressé·e par, Recherche, Enfants)
- Description physique humoristique
- Refactorisation architecture features/ + shared/
- Zustand stores (session, UI, economy)
- Custom hooks (useAuth, useCoins, usePets…)
- Fix overflow horizontal mobile
- AppShell unifié

### v1.0.1
- Design mobile-first
- 6 jeux intégrés
- 5 salons thématiques
- Système de lettres & offrandes

---

## 📜 Licence

Projet sous **licence privée**. Tous droits réservés.

## 📧 Support

- Ouvrir une issue : [GitHub Issues](https://github.com/Warren573/JEUTAIME/issues)

---

*Développé avec ❤️ — Où la personnalité compte plus que l'apparence*
