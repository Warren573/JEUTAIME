// Configuration des offrandes et cadeaux magiques

export const GIFTS = {
  ROSE: {
    id: 'rose',
    name: 'Rose',
    emoji: '🌹',
    cost: 30,
    points: 10,
    rarity: 'common',
    description: 'Une rose délicate pour montrer ton intérêt',
    effect: 'Fait sourire ton admirateur',
    color: '#E91E63'
  },
  PHILTRE: {
    id: 'philtre',
    name: 'Philtre d\'Amour',
    emoji: '🧪',
    cost: 50,
    points: 20,
    rarity: 'uncommon',
    description: 'Un philtre magique qui renforce les liens',
    effect: 'Augmente vos chances de match',
    color: '#9C27B0'
  },
  BOUQUET: {
    id: 'bouquet',
    name: 'Bouquet de Fleurs',
    emoji: '💐',
    cost: 75,
    points: 30,
    rarity: 'uncommon',
    description: 'Un magnifique bouquet pour impressionner',
    effect: 'Montre tes intentions sérieuses',
    color: '#FF9800'
  },
  WINE: {
    id: 'wine',
    name: 'Verre de Vin',
    emoji: '🍷',
    cost: 100,
    points: 40,
    rarity: 'rare',
    description: 'Un verre de vin pour partager un moment',
    effect: 'Invite à une conversation romantique',
    color: '#2196F3'
  },
  CHOCOLATE: {
    id: 'chocolate',
    name: 'Chocolats',
    emoji: '🍫',
    cost: 60,
    points: 25,
    rarity: 'uncommon',
    description: 'Des chocolats fins pour régaler',
    effect: 'Adoucit les cœurs',
    color: '#795548'
  },
  CHAMPAGNE: {
    id: 'champagne',
    name: 'Champagne',
    emoji: '🍾',
    cost: 150,
    points: 60,
    rarity: 'rare',
    description: 'Pour célébrer votre rencontre',
    effect: 'Marque un moment spécial',
    color: '#FFD700'
  },
  TEDDY: {
    id: 'teddy',
    name: 'Ours en Peluche',
    emoji: '🧸',
    cost: 80,
    points: 35,
    rarity: 'uncommon',
    description: 'Un compagnon doux et mignon',
    effect: 'Attendrit les cœurs',
    color: '#FF6B6B'
  },
  HEART: {
    id: 'heart',
    name: 'Cœur Magique',
    emoji: '💝',
    cost: 120,
    points: 50,
    rarity: 'rare',
    description: 'Un cœur enchanté qui bat pour toi',
    effect: 'Révèle tes sentiments',
    color: '#E91E63'
  },
  DIAMOND: {
    id: 'diamond',
    name: 'Diamant Éternel',
    emoji: '💎',
    cost: 500,
    points: 200,
    rarity: 'legendary',
    description: 'Le cadeau ultime, symbole d\'amour éternel',
    effect: 'Prouve ton engagement total',
    color: '#00BCD4'
  }
};

export const SPELLS = {
  INVISIBILITY: {
    id: 'invisibility',
    name: 'Invisibilité',
    emoji: '👻',
    cost: 100,
    duration: 3600000, // 1 heure en ms
    description: 'Deviens invisible pendant 1 heure',
    effect: 'Parcours les profils sans être vu'
  },
  BOOST: {
    id: 'boost',
    name: 'Boost de Profil',
    emoji: '🚀',
    cost: 150,
    duration: 1800000, // 30 minutes
    description: 'Boost ton profil pendant 30 minutes',
    effect: 'Apparais en premier dans les découvertes'
  },
  VISION: {
    id: 'vision',
    name: 'Vision Magique',
    emoji: '🔮',
    cost: 200,
    duration: 0, // Instantané
    description: 'Vois qui t\'a souri',
    effect: 'Révèle la liste de ceux qui t\'ont souri'
  },
  CHARM: {
    id: 'charm',
    name: 'Charme Irrésistible',
    emoji: '✨',
    cost: 250,
    duration: 7200000, // 2 heures
    description: 'Deviens irrésistible pendant 2 heures',
    effect: '+50% de chances de match'
  }
};

// Fonction pour obtenir tous les cadeaux triés par coût
export function getAllGifts() {
  return Object.values(GIFTS).sort((a, b) => a.cost - b.cost);
}

// Fonction pour obtenir tous les sorts
export function getAllSpells() {
  return Object.values(SPELLS).sort((a, b) => a.cost - b.cost);
}

// Fonction pour obtenir un cadeau par ID
export function getGiftById(id) {
  return Object.values(GIFTS).find(g => g.id === id);
}

// Fonction pour obtenir un sort par ID
export function getSpellById(id) {
  return Object.values(SPELLS).find(s => s.id === id);
}
