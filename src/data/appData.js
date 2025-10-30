// Données statiques de l'application

export const bars = [
  {
    id: 1,
    icon: '🌹',
    name: 'Bar Romantique',
    desc: 'Ambiance tamisée',
    participants: [
      { name: 'Sophie', gender: 'F', age: 28, online: true },
      { name: 'Emma', gender: 'F', age: 26, online: true },
      { name: 'Alexandre', gender: 'M', age: 32, online: true },
      { name: 'Thomas', gender: 'M', age: 29, online: false }
    ]
  },
  {
    id: 2,
    icon: '😄',
    name: 'Bar Humoristique',
    desc: 'Rires garantis',
    participants: [
      { name: 'Léa', gender: 'F', age: 25, online: true },
      { name: 'Clara', gender: 'F', age: 27, online: true },
      { name: 'Jules', gender: 'M', age: 28, online: true },
      { name: 'Martin', gender: 'M', age: 31, online: true }
    ]
  },
  {
    id: 3,
    icon: '🏴‍☠️',
    name: 'Bar Pirates',
    desc: 'Aventures maritimes',
    participants: [
      { name: 'Océane', gender: 'F', age: 29, online: true },
      { name: 'Nora', gender: 'F', age: 24, online: false },
      { name: 'Lucas', gender: 'M', age: 30, online: true },
      { name: 'Pierre', gender: 'M', age: 33, online: true }
    ]
  },
  {
    id: 4,
    icon: '📅',
    name: 'Bar Hebdomadaire',
    desc: '2H/2F - Renouvellement chaque lundi',
    participants: [
      { name: 'Zoé', gender: 'F', age: 26, online: true },
      { name: 'Valerie', gender: 'F', age: 31, online: true },
      { name: 'Kevin', gender: 'M', age: 27, online: true },
      { name: 'David', gender: 'M', age: 34, online: true }
    ]
  },
  {
    id: 5,
    icon: '👑',
    name: 'Bar Caché',
    desc: '3 énigmes pour accéder',
    participants: [
      { name: 'Amelia', gender: 'F', age: 30, online: true },
      { name: 'Victoria', gender: 'F', age: 28, online: true },
      { name: 'Xavier', gender: 'M', age: 35, online: false },
      { name: 'Nicolas', gender: 'M', age: 32, online: true }
    ]
  }
];

export const receivedOfferings = [
  { id: 1, date: '16/10', type: 'Rose', donor: 'MissNikita', icon: '🌹', color: '#E91E63' },
  { id: 2, date: '16/10', type: 'Rose', donor: 'HollypeindePlum', icon: '🌹', color: '#E91E63' },
  { id: 3, date: '16/10', type: 'Philtre', donor: 'HollypeindePlum', icon: '🧪', color: '#9C27B0' },
  { id: 4, date: '15/10', type: 'Philtre', donor: 'BaMBy', icon: '🧪', color: '#9C27B0' },
  { id: 5, date: '15/10', type: 'Rose', donor: 'venusParis', icon: '🌹', color: '#E91E63' },
  { id: 6, date: '14/10', type: 'Philtre', donor: 'pticoeurfragile', icon: '🧪', color: '#9C27B0' },
  { id: 7, date: '13/10', type: 'Rose', donor: 'Lily', icon: '🌹', color: '#E91E63' },
  { id: 8, date: '13/10', type: 'Rose', donor: 'bulletedendresse', icon: '🌹', color: '#E91E63' },
  { id: 9, date: '13/10', type: 'Rose', donor: 'mimicracra', icon: '🌹', color: '#E91E63' },
  { id: 10, date: '13/10', type: 'Rose', donor: 'jji', icon: '🌹', color: '#E91E63' }
];

export const journalNews = [
  { id: 1, time: 'à l\'instant', icon: '🔥', title: 'CLASH EN DIRECT!', desc: 'MaxiCoeur et LoveParis se battent pour Sophie!', type: 'clash', reactions: 234 },
  { id: 2, time: '5 min', icon: '🏆', title: 'Champion du jour!', desc: 'LaurenStyle a reçu 47 offrandes! 🎁', type: 'record', reactions: 1205 },
  { id: 3, time: '12 min', icon: '💘', title: 'Love Story!', desc: 'Alex et Emma se sont écrit 15 lettres en 2h!', type: 'love', reactions: 856 },
];

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
    bio: '👨‍💻 Créateur et administrateur de JeuTaime. Ici pour gérer l\'app, créer de nouveaux jeux et bars, et assurer la modération. N\'hésitez pas à me contacter pour vos suggestions ! 🛠️✨',
    badges: ['verified', 'premium', 'admin', 'developer'],
    distance: '0 km',
    lastActive: 'En ligne',
    stats: {
      letters: 0,
      games: 999,
      bars: 50
    },
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
    bio: 'Passionnée de livres et de voyages. À la recherche de quelqu\'un avec qui partager des aventures et des soirées cinéma. 🎬📚',
    badges: ['verified', 'romantic', 'writer'],
    distance: '2 km',
    lastActive: 'En ligne',
    stats: {
      letters: 15,
      games: 23,
      bars: 8
    }
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
    stats: {
      letters: 8,
      games: 45,
      bars: 12
    }
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
    stats: {
      letters: 32,
      games: 156,
      bars: 25
    }
  }
];

export const profileBadges = {
  'verified': { emoji: '✅', name: 'Vérifié', color: '#4CAF50' },
  'premium': { emoji: '👑', name: 'Premium', color: '#FFD700' },
  'popular': { emoji: '⭐', name: 'Populaire', color: '#FF9800' },
  'active': { emoji: '🔥', name: 'Actif', color: '#E91E63' },
  'romantic': { emoji: '💕', name: 'Romantique', color: '#FF69B4' },
  'gamer': { emoji: '🎮', name: 'Joueur', color: '#9C27B0' },
  'writer': { emoji: '✍️', name: 'Écrivain', color: '#2196F3' },
  'admin': { emoji: '🛡️', name: 'Administrateur', color: '#667eea' },
  'developer': { emoji: '💻', name: 'Développeur', color: '#764ba2' }
};

// Système d'adoption d'animaux virtuels
export const availableAnimals = [
  { id: 'cat', emoji: '🐱', name: 'Chat', description: 'Indépendant et câlin', personality: 'Mystérieux', power: '🔮 Vision nocturne', price: 0 },
  { id: 'dog', emoji: '🐶', name: 'Chien', description: 'Fidèle et joueur', personality: 'Enthousiaste', power: '🎯 Détection émotions', price: 0 },
  { id: 'rabbit', emoji: '🐰', name: 'Lapin', description: 'Doux et curieux', personality: 'Timide', power: '🌸 Chance en amour', price: 0 },
  { id: 'hamster', emoji: '🐹', name: 'Hamster', description: 'Mignon et actif', personality: 'Énergique', power: '⚡ Énergie contagieuse', price: 0 },
  { id: 'bird', emoji: '🐦', name: 'Oiseau', description: 'Libre et chanteur', personality: 'Joyeux', power: '🎵 Charme vocal', price: 0 },
  { id: 'fox', emoji: '🦊', name: 'Renard', description: 'Rusé et charmant', personality: 'Malin', power: '🧠 Intelligence sociale', price: 0 },
  { id: 'parrot', emoji: '🦜', name: 'Perroquet', description: 'Bavard et coloré', personality: 'Sociable', power: '💬 Communication parfaite', price: 100, premium: true },
  { id: 'panda', emoji: '🐼', name: 'Panda', description: 'Rare et adorable', personality: 'Zen', power: '☮️ Aura de paix', price: 200, premium: true },
  { id: 'dragon', emoji: '🐉', name: 'Dragon', description: 'Légendaire et puissant', personality: 'Noble', power: '🔥 Attraction irrésistible', price: 500, premium: true }
];

export const animalAccessories = [
  { id: 'hat', emoji: '🎩', name: 'Chapeau élégant', price: 50 },
  { id: 'bow', emoji: '🎀', name: 'Nœud papillon', price: 30 },
  { id: 'crown', emoji: '👑', name: 'Couronne royale', price: 100 },
  { id: 'glasses', emoji: '🕶️', name: 'Lunettes cool', price: 40 },
  { id: 'scarf', emoji: '🧣', name: 'Écharpe', price: 35 },
  { id: 'cape', emoji: '🦸', name: 'Cape de super-héros', price: 80 }
];

export const adoptableAnimals = [
  { id: 1, animal: '🐱', name: 'Minou', owner: 'Sophie', age: 28, hunger: 60, happiness: 80, energy: 70, cleanliness: 50, affection: 90 },
  { id: 2, animal: '🐶', name: 'Rex', owner: 'Thomas', age: 31, hunger: 30, happiness: 95, energy: 85, cleanliness: 80, affection: 70 },
  { id: 3, animal: '🐰', name: 'Fluffy', owner: 'Marie', age: 26, hunger: 80, happiness: 60, energy: 40, cleanliness: 90, affection: 85 }
];
