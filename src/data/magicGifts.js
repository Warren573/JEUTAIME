/**
 * Système Magie & Offrandes
 * Données des sorts magiques et cadeaux virtuels
 */

// 🔮 MAGIES INDIVIDUELLES
export const individualMagic = [
  {
    id: 'boost-charme',
    name: 'Boost de Charme +10%',
    icon: '✨',
    description: 'Améliore instantanément ton aura sociale pendant 3 minutes.',
    type: 'individual',
    duration: 180, // secondes
    cost: 50 // pièces
  },
  {
    id: 'detecteur-crush',
    name: 'Détecteur de Crush',
    icon: '💘',
    description: 'Révèle un indice humoristique sur quelqu\'un dans le salon.',
    type: 'individual',
    cost: 30
  },
  {
    id: 'teleportation',
    name: 'Téléportation dans le salon',
    icon: '⚡',
    description: 'Entrée dramatique en mode superstar.',
    type: 'individual',
    cost: 40
  },
  {
    id: 'sort-silence',
    name: 'Sort du Silence',
    icon: '🤫',
    description: 'Ping stylé pour attirer l\'attention sans être relou.',
    type: 'individual',
    cost: 20
  }
];

// 🌟 MAGIES POUR LE SALON
export const salonMagic = [
  {
    id: 'pluie-emotions',
    name: 'Pluie d\'Émotions',
    icon: '🎊',
    description: '10 secondes d\'émojis qui tombent du ciel.',
    type: 'salon',
    duration: 10,
    cost: 60
  },
  {
    id: 'vote-magique',
    name: 'Vote Magique',
    icon: '🗳️',
    description: 'Lance un vote fun : défi express, compliment collectif, etc.',
    type: 'salon',
    cost: 70
  },
  {
    id: 'sort-chaos',
    name: 'Sort du Chaos',
    icon: '🎲',
    description: 'Tire un défi aléatoire pour tout le salon.',
    type: 'salon',
    cost: 80
  }
];

// 🎁 OFFRANDES CLASSIQUES
export const classicGifts = [
  {
    id: 'pizza-mentale',
    name: 'Pizza Mentale XXL',
    icon: '🍕',
    description: 'La meilleure pizza virtuelle de l\'univers.',
    category: 'classic',
    cost: 25
  },
  {
    id: 'raclette',
    name: 'Raclette Interdimensionnelle',
    icon: '🧀',
    description: 'Fromage fondu venu d\'une autre dimension.',
    category: 'classic',
    cost: 30
  },
  {
    id: 'mojito',
    name: 'Mojito Cosmique',
    icon: '🍹',
    description: 'Cocktail rafraîchissant aux saveurs stellaires.',
    category: 'classic',
    cost: 20
  },
  {
    id: 'sieste',
    name: 'Sieste Premium',
    icon: '😴',
    description: 'Un repos bien mérité dans les nuages.',
    category: 'classic',
    cost: 15
  },
  {
    id: 'massage',
    name: 'Massage Virtuel',
    icon: '💆',
    description: 'Détente absolue en mode holographique.',
    category: 'classic',
    cost: 35
  },
  {
    id: 'excuse',
    name: 'Excuse Ultime',
    icon: '🎭',
    description: 'Pour annuler un plan sans culpabiliser.',
    category: 'classic',
    cost: 40
  }
];

// 😂 OFFRANDES HUMOUR
export const humorGifts = [
  {
    id: 'meme-sacre',
    name: 'Meme Sacré du Jour',
    icon: '🤣',
    description: 'Le meme parfait pour faire rire.',
    category: 'humor',
    cost: 10
  },
  {
    id: 'compliment-box',
    name: 'Compliment Box',
    icon: '💝',
    description: 'Boîte surprise remplie de compliments.',
    category: 'humor',
    cost: 25
  },
  {
    id: 'anti-bad-mood',
    name: 'Anti-Bad Mood Blast',
    icon: '🌈',
    description: 'Chasse instantanément la mauvaise humeur.',
    category: 'humor',
    cost: 30
  },
  {
    id: 'anti-ghost',
    name: 'Amulette Anti-Ghost',
    icon: '👻',
    description: 'Protection magique contre les ghosters.',
    category: 'humor',
    cost: 45
  }
];

// 💎 OFFRANDES PREMIUM
export const premiumGifts = [
  {
    id: 'cristaux',
    name: 'Cristaux de Charisme',
    icon: '💎',
    description: 'Boost permanent de ton énergie sociale.',
    category: 'premium',
    cost: 100,
    isPremium: true
  },
  {
    id: 'potion-anti-relou',
    name: 'Potion Anti-Mecs Relous',
    icon: '🧪',
    description: 'Filtre magique contre les comportements toxiques.',
    category: 'premium',
    cost: 150,
    isPremium: true
  },
  {
    id: 'potion-anti-chiante',
    name: 'Potion Anti-Meufs Chiantes',
    icon: '🧪',
    description: 'Tranquillité garantie.',
    category: 'premium',
    cost: 150,
    isPremium: true
  },
  {
    id: 'slip-heros',
    name: 'Slip du Héros Social',
    icon: '🩲',
    description: 'Objet légendaire ultra-rare. Confiance +999.',
    category: 'premium',
    cost: 500,
    isPremium: true,
    isLegendary: true
  }
];

// 📦 EXPORTS GROUPÉS
export const allMagic = [...individualMagic, ...salonMagic];
export const allGifts = [...classicGifts, ...humorGifts, ...premiumGifts];

// Helper pour obtenir un élément par ID
export function getMagicById(id) {
  return allMagic.find(m => m.id === id);
}

export function getGiftById(id) {
  return allGifts.find(g => g.id === id);
}
