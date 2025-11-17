// Configuration du système de magie pour les bars
export const magicSpells = {
  heart: {
    id: 'heart',
    name: 'Coeur',
    icon: '💝',
    color: '#E91E63',
    cost: 0, // Gratuit
    description: 'Envoie un coeur',
    effect: 'sparkle',
    particles: {
      emoji: '💖',
      count: 15,
      colors: ['#E91E63', '#FF69B4', '#FF1493']
    }
  },
  fire: {
    id: 'fire',
    name: 'Feu',
    icon: '🔥',
    color: '#FF5722',
    cost: 5,
    description: 'Enflamme la conversation',
    effect: 'burn',
    particles: {
      emoji: '🔥',
      count: 20,
      colors: ['#FF5722', '#FF9800', '#FFC107']
    }
  },
  ice: {
    id: 'ice',
    name: 'Glace',
    icon: '❄️',
    color: '#03A9F4',
    cost: 5,
    description: 'Rafraîchit l\'ambiance',
    effect: 'freeze',
    particles: {
      emoji: '❄️',
      count: 25,
      colors: ['#03A9F4', '#00BCD4', '#B3E5FC']
    }
  },
  star: {
    id: 'star',
    name: 'Étoile',
    icon: '⭐',
    color: '#FFC107',
    cost: 10,
    description: 'Fait briller la personne',
    effect: 'shine',
    particles: {
      emoji: '✨',
      count: 30,
      colors: ['#FFC107', '#FFD54F', '#FFEB3B']
    }
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    icon: '🌹',
    color: '#C2185B',
    cost: 15,
    description: 'Offre une rose romantique',
    effect: 'bloom',
    particles: {
      emoji: '🌹',
      count: 12,
      colors: ['#C2185B', '#E91E63', '#F48FB1']
    }
  },
  sparkles: {
    id: 'sparkles',
    name: 'Étincelles',
    icon: '💫',
    color: '#9C27B0',
    cost: 20,
    description: 'Crée des étincelles magiques',
    effect: 'sparkles',
    particles: {
      emoji: '💫',
      count: 40,
      colors: ['#9C27B0', '#BA68C8', '#E1BEE7']
    }
  },
  lightning: {
    id: 'lightning',
    name: 'Éclair',
    icon: '⚡',
    color: '#FFD700',
    cost: 25,
    description: 'Frappe avec un éclair',
    effect: 'zap',
    particles: {
      emoji: '⚡',
      count: 35,
      colors: ['#FFD700', '#FFF59D', '#FFEB3B']
    }
  },
  rainbow: {
    id: 'rainbow',
    name: 'Arc-en-ciel',
    icon: '🌈',
    color: 'linear-gradient(135deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)',
    cost: 50,
    description: 'Arc-en-ciel magique (PREMIUM)',
    effect: 'rainbow',
    particles: {
      emoji: '🌈',
      count: 50,
      colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#9400D3']
    },
    premium: true
  }
};

// Messages prédéfinis pour les différents sorts
export const spellMessages = {
  heart: [
    '{sender} t\'envoie un coeur ! 💝',
    '{sender} te fait un câlin virtuel ! 🤗',
    '{sender} pense à toi ! 💕'
  ],
  fire: [
    '{sender} enflamme la conversation ! 🔥',
    '{sender} met le feu ! 🔥🔥',
    'Ça chauffe avec {sender} ! 🔥'
  ],
  ice: [
    '{sender} te rafraîchit ! ❄️',
    '{sender} lance un blizzard ! ❄️❄️',
    'Brr, {sender} gèle tout ! ❄️'
  ],
  star: [
    '{sender} te fait briller ! ⭐',
    'Tu es une star pour {sender} ! ⭐✨',
    '{sender} t\'illumine ! ⭐'
  ],
  rose: [
    '{sender} t\'offre une rose ! 🌹',
    'Une rose romantique de {sender} ! 🌹💕',
    '{sender} fleurit ton coeur ! 🌹'
  ],
  sparkles: [
    '{sender} crée de la magie ! 💫',
    'Étincelles magiques de {sender} ! 💫✨',
    '{sender} t\'enchante ! 💫'
  ],
  lightning: [
    '{sender} te foudroie ! ⚡',
    'Éclair magique de {sender} ! ⚡⚡',
    '{sender} électrise l\'ambiance ! ⚡'
  ],
  rainbow: [
    '{sender} déploie un arc-en-ciel ! 🌈',
    'Magie arc-en-ciel de {sender} ! 🌈✨',
    '{sender} colore ton monde ! 🌈'
  ]
};

// Fonction pour obtenir un message aléatoire pour un sort
export function getSpellMessage(spellId, senderName) {
  const messages = spellMessages[spellId] || ['{sender} lance un sort !'];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  return randomMessage.replace('{sender}', senderName);
}

// Fonction pour vérifier si un utilisateur peut utiliser un sort
export function canUseSpell(spell, userCoins, isPremium) {
  if (spell.premium && !isPremium) {
    return { canUse: false, reason: 'Ce sort nécessite un compte Premium' };
  }
  if (spell.cost > userCoins) {
    return { canUse: false, reason: `Vous avez besoin de ${spell.cost} pièces` };
  }
  return { canUse: true };
}
