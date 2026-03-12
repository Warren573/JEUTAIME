/**
 * MOCKS — Profils enrichis et badges
 *
 * Données statiques utilisées en l'absence de Supabase.
 */

export const enrichedProfiles = [
  {
    id: 0,
    name: 'Admin JeuTaime',
    age: 99,
    city: 'Paris',
    avatar: 'https://i.pravatar.cc/300?img=60',
    photos: [
      'https://i.pravatar.cc/400?img=60',
      'https://i.pravatar.cc/400?img=61',
      'https://i.pravatar.cc/400?img=62'
    ],
    interests: 'Développement, design, communauté',
    job: 'Développeur / Administrateur',
    compatibility: 100,
    bio: "👨‍💻 Créateur et administrateur de JeuTaime. Ici pour gérer l'app, créer de nouveaux jeux et bars, et assurer la modération. N'hésitez pas à me contacter pour vos suggestions ! 🛠️✨",
    badges: ['verified', 'premium', 'admin', 'developer'],
    distance: '0 km',
    lastActive: 'En ligne',
    stats: { letters: 0, games: 999, bars: 50 },
    isAdmin: true
  },
  {
    id: 1,
    name: 'Sophie',
    age: 28,
    city: 'Paris',
    avatar: 'https://i.pravatar.cc/300?img=1',
    photos: [
      'https://i.pravatar.cc/400?img=1',
      'https://i.pravatar.cc/400?img=5',
      'https://i.pravatar.cc/400?img=9'
    ],
    interests: 'Lecture, voyages, cuisine italienne',
    job: 'Designer graphique',
    compatibility: 89,
    bio: "Passionnée de livres et de voyages. À la recherche de quelqu'un avec qui partager des aventures et des soirées cinéma. 🎬📚",
    badges: ['verified', 'romantic', 'writer'],
    distance: '2 km',
    lastActive: 'En ligne',
    stats: { letters: 15, games: 23, bars: 8 }
  },
  {
    id: 2,
    name: 'Emma',
    age: 26,
    city: 'Lyon',
    avatar: 'https://i.pravatar.cc/300?img=2',
    photos: [
      'https://i.pravatar.cc/400?img=2',
      'https://i.pravatar.cc/400?img=6'
    ],
    interests: 'Sport, musique, animaux',
    job: 'Vétérinaire',
    compatibility: 76,
    bio: 'Amoureuse des animaux et de la nature. Fan de randonnée le weekend ! 🏔️🐕',
    badges: ['verified', 'active'],
    distance: '5 km',
    lastActive: 'Il y a 10 min',
    stats: { letters: 8, games: 45, bars: 12 }
  },
  {
    id: 3,
    name: 'Chloé',
    age: 29,
    city: 'Marseille',
    avatar: 'https://i.pravatar.cc/300?img=3',
    photos: [
      'https://i.pravatar.cc/400?img=3',
      'https://i.pravatar.cc/400?img=7',
      'https://i.pravatar.cc/400?img=10',
      'https://i.pravatar.cc/400?img=11'
    ],
    interests: 'Jeux vidéo, manga, cosplay',
    job: 'Développeuse',
    compatibility: 92,
    bio: 'Gameuse passionnée et développeuse. Toujours partante pour une partie ! 🎮✨',
    badges: ['verified', 'premium', 'gamer', 'popular'],
    distance: '8 km',
    lastActive: 'En ligne',
    stats: { letters: 32, games: 156, bars: 25 }
  }
];

export const profileBadges = {
  verified: { emoji: '✅', name: 'Vérifié', color: '#4CAF50' },
  premium: { emoji: '👑', name: 'Premium', color: '#FFD700' },
  popular: { emoji: '⭐', name: 'Populaire', color: '#FF9800' },
  active: { emoji: '🔥', name: 'Actif', color: '#E91E63' },
  romantic: { emoji: '💕', name: 'Romantique', color: '#FF69B4' },
  gamer: { emoji: '🎮', name: 'Joueur', color: '#9C27B0' },
  writer: { emoji: '✍️', name: 'Écrivain', color: '#2196F3' },
  admin: { emoji: '🛡️', name: 'Administrateur', color: '#667eea' },
  developer: { emoji: '💻', name: 'Développeur', color: '#764ba2' },
  bot: { emoji: '🤖', name: 'Bot', color: '#607D8B' },
};
