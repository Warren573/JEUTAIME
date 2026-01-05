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
    gifUrl: 'https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif',
    description: 'Améliore instantanément ton aura sociale pendant 3 minutes.',
    type: 'individual',
    duration: 180, // secondes
    cost: 50 // pièces
  },
  {
    id: 'detecteur-crush',
    name: 'Détecteur de Crush',
    icon: '💘',
    gifUrl: 'https://media.giphy.com/media/26BRBKqUiq586bRVu/giphy.gif',
    description: 'Révèle un indice humoristique sur quelqu\'un dans le salon.',
    type: 'individual',
    cost: 30
  },
  {
    id: 'teleportation',
    name: 'Téléportation dans le salon',
    icon: '⚡',
    gifUrl: 'https://media.giphy.com/media/dbtDDSvWErdf2/giphy.gif',
    description: 'Entrée dramatique en mode superstar.',
    type: 'individual',
    cost: 40
  },
  {
    id: 'sort-silence',
    name: 'Sort du Silence',
    icon: '🤫',
    gifUrl: 'https://media.giphy.com/media/3ohhwMULc41N4CgoH6/giphy.gif',
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
    gifUrl: 'https://media.giphy.com/media/26tPnAAJxXTvpLwJy/giphy.gif',
    description: '10 secondes d\'émojis qui tombent du ciel.',
    type: 'salon',
    duration: 10,
    cost: 60
  },
  {
    id: 'vote-magique',
    name: 'Vote Magique',
    icon: '🗳️',
    gifUrl: 'https://media.giphy.com/media/l4FGp6wKxMULON88U/giphy.gif',
    description: 'Lance un vote fun : défi express, compliment collectif, etc.',
    type: 'salon',
    cost: 70
  },
  {
    id: 'sort-chaos',
    name: 'Sort du Chaos',
    icon: '🎲',
    gifUrl: 'https://media.giphy.com/media/5xtDarmwsuR9sDRObyU/giphy.gif',
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
    gifUrl: 'https://media.giphy.com/media/l4FB8FfKXqfort0Sk/giphy.gif',
    description: 'La meilleure pizza virtuelle de l\'univers.',
    category: 'classic',
    cost: 25
  },
  {
    id: 'raclette',
    name: 'Raclette Interdimensionnelle',
    icon: '🧀',
    gifUrl: 'https://media.giphy.com/media/xT77XTpyEzJ4OJO06c/giphy.gif',
    description: 'Fromage fondu venu d\'une autre dimension.',
    category: 'classic',
    cost: 30
  },
  {
    id: 'mojito',
    name: 'Mojito Cosmique',
    icon: '🍹',
    gifUrl: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
    description: 'Cocktail rafraîchissant aux saveurs stellaires.',
    category: 'classic',
    cost: 20
  },
  {
    id: 'sieste',
    name: 'Sieste Premium',
    icon: '😴',
    gifUrl: 'https://media.giphy.com/media/3o6UBhjHobLFgEmrJu/giphy.gif',
    description: 'Un repos bien mérité dans les nuages.',
    category: 'classic',
    cost: 15
  },
  {
    id: 'massage',
    name: 'Massage Virtuel',
    icon: '💆',
    gifUrl: 'https://media.giphy.com/media/xT8qBgvOUl9mj2fe6c/giphy.gif',
    description: 'Détente absolue en mode holographique.',
    category: 'classic',
    cost: 35
  },
  {
    id: 'excuse',
    name: 'Excuse Ultime',
    icon: '🎭',
    gifUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
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
    gifUrl: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif',
    description: 'Le meme parfait pour faire rire.',
    category: 'humor',
    cost: 10
  },
  {
    id: 'compliment-box',
    name: 'Compliment Box',
    icon: '💝',
    gifUrl: 'https://media.giphy.com/media/ZBQhoZC0nqknSviPqT/giphy.gif',
    description: 'Boîte surprise remplie de compliments.',
    category: 'humor',
    cost: 25
  },
  {
    id: 'anti-bad-mood',
    name: 'Anti-Bad Mood Blast',
    icon: '🌈',
    gifUrl: 'https://media.giphy.com/media/SKGo6OYe24EBG/giphy.gif',
    description: 'Chasse instantanément la mauvaise humeur.',
    category: 'humor',
    cost: 30
  },
  {
    id: 'anti-ghost',
    name: 'Amulette Anti-Ghost',
    icon: '👻',
    gifUrl: 'https://media.giphy.com/media/3oKIPf3C7HqqYBVcCk/giphy.gif',
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
    gifUrl: 'https://media.giphy.com/media/lOu4qz7HErSTK/giphy.gif',
    description: 'Boost permanent de ton énergie sociale.',
    category: 'premium',
    cost: 100,
    isPremium: true
  },
  {
    id: 'potion-anti-relou',
    name: 'Potion Anti-Mecs Relous',
    icon: '🧪',
    gifUrl: 'https://media.giphy.com/media/3o6Zt0hNCfak3QCqsw/giphy.gif',
    description: 'Filtre magique contre les comportements toxiques.',
    category: 'premium',
    cost: 150,
    isPremium: true
  },
  {
    id: 'potion-anti-chiante',
    name: 'Potion Anti-Meufs Chiantes',
    icon: '🧪',
    gifUrl: 'https://media.giphy.com/media/3o6Zt0hNCfak3QCqsw/giphy.gif',
    description: 'Tranquillité garantie.',
    category: 'premium',
    cost: 150,
    isPremium: true
  },
  {
    id: 'slip-heros',
    name: 'Slip du Héros Social',
    icon: '🩲',
    gifUrl: 'https://media.giphy.com/media/26BRzozg4TCBXv6QU/giphy.gif',
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
