/**
 * MOCKS — Salons virtuels
 *
 * Données statiques utilisées en l'absence de Supabase.
 * À remplacer par des données dynamiques lors de la migration Supabase.
 */

export const salons = [
  {
    id: 1,
    icon: '🏊',
    name: 'Piscine',
    desc: '2H/2F - Ambiance aquatique et détente',
    bgGradient: 'linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%)',
    magicAction: {
      name: 'Faire une bombe',
      emoji: '💦',
      animation: 'splash',
      message: 'SPLASH! Tu as éclaboussé tout le monde! 🌊'
    },
    participants: [
      { name: 'Sophie', gender: 'F', age: 28, online: true },
      { name: 'Emma', gender: 'F', age: 26, online: true },
      { name: 'Alexandre', gender: 'M', age: 32, online: true }
    ]
  },
  {
    id: 2,
    icon: '☕',
    name: 'Café de Paris',
    desc: '2H/2F - Ambiance parisienne chic',
    bgGradient: 'linear-gradient(180deg, #D7CCC8 0%, #8D6E63 100%)',
    magicAction: {
      name: 'Offrir un café',
      emoji: '☕',
      animation: 'coffee',
      message: 'Tu as offert un délicieux café! ☕✨'
    },
    participants: [
      { name: 'Léa', gender: 'F', age: 25, online: true },
      { name: 'Clara', gender: 'F', age: 27, online: true },
      { name: 'Jules', gender: 'M', age: 28, online: true }
    ]
  },
  {
    id: 3,
    icon: '🏴‍☠️',
    name: 'Île des pirates',
    desc: '2H/2F - Aventures maritimes',
    bgGradient: 'linear-gradient(180deg, #FFD54F 0%, #5D4037 100%)',
    magicAction: {
      name: 'Chercher un trésor',
      emoji: '💎',
      animation: 'treasure',
      message: "Trésor trouvé! +50 pièces d'or! 💰✨"
    },
    participants: [
      { name: 'Océane', gender: 'F', age: 29, online: true },
      { name: 'Marine', gender: 'F', age: 24, online: false },
      { name: 'Lucas', gender: 'M', age: 30, online: true }
    ]
  },
  {
    id: 4,
    icon: '🎭',
    name: 'Théâtre improvisé',
    desc: '2H/2F - Spectacles et fous rires',
    bgGradient: 'linear-gradient(180deg, #CE93D8 0%, #7B1FA2 100%)',
    magicAction: {
      name: 'Transformation magique',
      emoji: '🐸',
      secondEmoji: '💋',
      animation: 'frog',
      message: 'Transformé en crapaud! 🐸 Donne un bisou pour rompre le charme!',
      message2: 'Le charme est rompu! 💋✨'
    },
    participants: [
      { name: 'Zoé', gender: 'F', age: 26, online: true },
      { name: 'Valérie', gender: 'F', age: 31, online: true },
      { name: 'Kevin', gender: 'M', age: 27, online: true }
    ]
  },
  {
    id: 5,
    icon: '🍸',
    name: 'Bar à cocktails',
    desc: '2H/2F - Mixologie et saveurs exotiques',
    bgGradient: 'linear-gradient(180deg, #F48FB1 0%, #C2185B 100%)',
    magicAction: {
      name: 'Servir un cocktail',
      emoji: '🍸',
      animation: 'cocktail',
      message: 'Cocktail magique servi! 🍸 Philtre d\'amour activé! 💖'
    },
    participants: [
      { name: 'Amélia', gender: 'F', age: 30, online: true },
      { name: 'Victoria', gender: 'F', age: 28, online: true },
      { name: 'Xavier', gender: 'M', age: 35, online: false }
    ]
  },
  {
    id: 7,
    icon: '🛋️',
    name: 'Cabinet du Psy',
    desc: '2H/2F - On y sert aussi des mojitos',
    bgGradient: 'linear-gradient(180deg, #B2DFDB 0%, #00695C 100%)',
    magicAction: {
      name: 'Allonger sur le divan',
      emoji: '🛋️',
      animation: 'relax',
      message: 'Séance gratuite! Tu te sens déjà mieux... 🧠✨'
    },
    participants: [
      { name: 'Camille', gender: 'F', age: 29, online: true },
      { name: 'Noémie', gender: 'F', age: 32, online: true },
      { name: 'Raphaël', gender: 'M', age: 34, online: true }
    ]
  },
  {
    id: 6,
    icon: '🤘',
    name: 'Métal',
    desc: '2H/2F - Faut battre le fer tant qu\'il est chaud',
    bgGradient: 'linear-gradient(180deg, #424242 0%, #000000 100%)',
    magicAction: {
      name: 'Lancer un solo',
      emoji: '🎸',
      animation: 'guitar',
      message: 'Solo de guitare dévastateur! 🎸🔥 La foule est en délire!'
    },
    participants: [
      { name: 'Maxime', gender: 'M', age: 29, online: true },
      { name: 'Laura', gender: 'F', age: 27, online: true },
      { name: 'Thomas', gender: 'M', age: 31, online: false }
    ]
  }
  {
    id: 99,
    icon: '☕',
    name: 'Café de Paris 2.0',
    desc: '2H/2F - Le salon nouvelle génération',
    bgGradient: 'linear-gradient(135deg, #6B4F3A 0%, #C8A882 60%, #F5E6D3 100%)',
    tag: 'global',
    isQuadScene: true,   // flag pour activer le layout spatial 4 coins
    participants: [
      { name: 'Sophie', gender: 'F', age: 28, online: true },
      { name: 'Emma',   gender: 'F', age: 26, online: true },
      { name: 'Alex',   gender: 'M', age: 31, online: true },
    ],
  },
];
