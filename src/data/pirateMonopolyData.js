// Données du jeu Monopoly Pirate

export const STARTING_GOLD = 1500;
export const PASS_START_BONUS = 200;

// Groupes de couleurs pour les îles
export const islandGroups = {
  brown: { name: 'Caraïbes du Sud', color: '#8B4513', islands: 2 },
  lightBlue: { name: 'Îles Turquoise', color: '#87CEEB', islands: 3 },
  pink: { name: 'Récifs Coralliens', color: '#FF69B4', islands: 3 },
  orange: { name: 'Côte Dorée', color: '#FFA500', islands: 3 },
  red: { name: 'Mers Sanglantes', color: '#DC143C', islands: 3 },
  yellow: { name: 'Îles d\'Or', color: '#FFD700', islands: 3 },
  green: { name: 'Archipel Émeraude', color: '#228B22', islands: 3 },
  darkBlue: { name: 'Abysses Profonds', color: '#00008B', islands: 2 }
};

// 40 cases du plateau
export const boardSpaces = [
  // Côté bas (0-9)
  {
    id: 0,
    type: 'start',
    name: '🏁 Le Port du Capitaine',
    description: 'Gagne 200 pièces d\'or en passant',
    emoji: '🏁'
  },
  {
    id: 1,
    type: 'island',
    name: 'Île des Palmiers',
    group: 'brown',
    price: 60,
    rent: [2, 10, 30, 90, 160, 250],
    buildCost: 50,
    emoji: '🏝️'
  },
  {
    id: 2,
    type: 'adventure',
    name: 'Carte Aventure',
    description: 'Pioche une carte aventure',
    emoji: '🗺️'
  },
  {
    id: 3,
    type: 'island',
    name: 'Baie du Rhum',
    group: 'brown',
    price: 60,
    rent: [4, 20, 60, 180, 320, 450],
    buildCost: 50,
    emoji: '🏝️'
  },
  {
    id: 4,
    type: 'tax',
    name: '☠️ Tribut au Roi',
    description: 'Paie 200 pièces d\'or',
    amount: 200,
    emoji: '☠️'
  },
  {
    id: 5,
    type: 'port',
    name: '⚓ Port Marchand',
    price: 200,
    rent: [25, 50, 100, 200],
    emoji: '⚓'
  },
  {
    id: 6,
    type: 'island',
    name: 'Lagon Azur',
    group: 'lightBlue',
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    buildCost: 50,
    emoji: '🏝️'
  },
  {
    id: 7,
    type: 'curse',
    name: 'Malédiction',
    description: 'Pioche une carte malédiction',
    emoji: '🧙'
  },
  {
    id: 8,
    type: 'island',
    name: 'Anse Secrète',
    group: 'lightBlue',
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    buildCost: 50,
    emoji: '🏝️'
  },
  {
    id: 9,
    type: 'island',
    name: 'Crique Cachée',
    group: 'lightBlue',
    price: 120,
    rent: [8, 40, 100, 300, 450, 600],
    buildCost: 50,
    emoji: '🏝️'
  },

  // Côté droit (10-19)
  {
    id: 10,
    type: 'prison',
    name: '🏴‍☠️ Prison du Kraken',
    description: 'En visite ou prisonnier',
    emoji: '🏴‍☠️'
  },
  {
    id: 11,
    type: 'island',
    name: 'Île Corail',
    group: 'pink',
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    buildCost: 100,
    emoji: '🏝️'
  },
  {
    id: 12,
    type: 'treasure',
    name: '🪙 Trésor Trouvé',
    description: 'Gagne 100 pièces d\'or',
    amount: 100,
    emoji: '🪙'
  },
  {
    id: 13,
    type: 'island',
    name: 'Récif du Dragon',
    group: 'pink',
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    buildCost: 100,
    emoji: '🏝️'
  },
  {
    id: 14,
    type: 'island',
    name: 'Barrière de Corail',
    group: 'pink',
    price: 160,
    rent: [12, 60, 180, 500, 700, 900],
    buildCost: 100,
    emoji: '🏝️'
  },
  {
    id: 15,
    type: 'port',
    name: '⚓ Port du Nord',
    price: 200,
    rent: [25, 50, 100, 200],
    emoji: '⚓'
  },
  {
    id: 16,
    type: 'island',
    name: 'Côte Dorée',
    group: 'orange',
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    buildCost: 100,
    emoji: '🏝️'
  },
  {
    id: 17,
    type: 'adventure',
    name: 'Carte Aventure',
    description: 'Pioche une carte aventure',
    emoji: '🗺️'
  },
  {
    id: 18,
    type: 'island',
    name: 'Plage Dorée',
    group: 'orange',
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    buildCost: 100,
    emoji: '🏝️'
  },
  {
    id: 19,
    type: 'island',
    name: 'Mine d\'Or',
    group: 'orange',
    price: 200,
    rent: [16, 80, 220, 600, 800, 1000],
    buildCost: 100,
    emoji: '🏝️'
  },

  // Côté haut (20-29)
  {
    id: 20,
    type: 'free',
    name: '🍺 La Taverne',
    description: 'Repos gratuit',
    emoji: '🍺'
  },
  {
    id: 21,
    type: 'island',
    name: 'Île Sanglante',
    group: 'red',
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    buildCost: 150,
    emoji: '🏝️'
  },
  {
    id: 22,
    type: 'curse',
    name: 'Malédiction',
    description: 'Pioche une carte malédiction',
    emoji: '🧙'
  },
  {
    id: 23,
    type: 'island',
    name: 'Baie Rouge',
    group: 'red',
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    buildCost: 150,
    emoji: '🏝️'
  },
  {
    id: 24,
    type: 'island',
    name: 'Cap Écarlate',
    group: 'red',
    price: 240,
    rent: [20, 100, 300, 750, 925, 1100],
    buildCost: 150,
    emoji: '🏝️'
  },
  {
    id: 25,
    type: 'port',
    name: '⚓ Port de l\'Est',
    price: 200,
    rent: [25, 50, 100, 200],
    emoji: '⚓'
  },
  {
    id: 26,
    type: 'island',
    name: 'Île d\'Or',
    group: 'yellow',
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    buildCost: 150,
    emoji: '🏝️'
  },
  {
    id: 27,
    type: 'island',
    name: 'Trésor d\'Or',
    group: 'yellow',
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    buildCost: 150,
    emoji: '🏝️'
  },
  {
    id: 28,
    type: 'storm',
    name: '⛈️ Tempête',
    description: 'Paie 100 pièces ou perds un tour',
    amount: 100,
    emoji: '⛈️'
  },
  {
    id: 29,
    type: 'island',
    name: 'Fort d\'Or',
    group: 'yellow',
    price: 280,
    rent: [24, 120, 360, 850, 1025, 1200],
    buildCost: 150,
    emoji: '🏝️'
  },

  // Côté gauche (30-39)
  {
    id: 30,
    type: 'goToPrison',
    name: '💀 Vers le Kraken',
    description: 'Va directement en prison',
    emoji: '💀'
  },
  {
    id: 31,
    type: 'island',
    name: 'Île Émeraude',
    group: 'green',
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    buildCost: 200,
    emoji: '🏝️'
  },
  {
    id: 32,
    type: 'adventure',
    name: 'Carte Aventure',
    description: 'Pioche une carte aventure',
    emoji: '🗺️'
  },
  {
    id: 33,
    type: 'island',
    name: 'Jungle Verte',
    group: 'green',
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    buildCost: 200,
    emoji: '🏝️'
  },
  {
    id: 34,
    type: 'island',
    name: 'Montagne Verte',
    group: 'green',
    price: 320,
    rent: [28, 150, 450, 1000, 1200, 1400],
    buildCost: 200,
    emoji: '🏝️'
  },
  {
    id: 35,
    type: 'port',
    name: '⚓ Port du Sud',
    price: 200,
    rent: [25, 50, 100, 200],
    emoji: '⚓'
  },
  {
    id: 36,
    type: 'curse',
    name: 'Malédiction',
    description: 'Pioche une carte malédiction',
    emoji: '🧙'
  },
  {
    id: 37,
    type: 'island',
    name: 'Abysses Noirs',
    group: 'darkBlue',
    price: 350,
    rent: [35, 175, 500, 1100, 1300, 1500],
    buildCost: 200,
    emoji: '🏝️'
  },
  {
    id: 38,
    type: 'combat',
    name: '💣 Combat Naval',
    description: 'Affronte un ennemi ou paie 150 pièces',
    amount: 150,
    emoji: '💣'
  },
  {
    id: 39,
    type: 'island',
    name: 'Fosse du Kraken',
    group: 'darkBlue',
    price: 400,
    rent: [50, 200, 600, 1400, 1700, 2000],
    buildCost: 200,
    emoji: '🏝️'
  }
];

// Cartes Aventure
export const adventureCards = [
  {
    id: 1,
    title: 'Coffre au Trésor',
    description: 'Tu trouves un coffre plein d\'or !',
    effect: { type: 'gainGold', amount: 200 },
    emoji: '💰'
  },
  {
    id: 2,
    title: 'Vente de Rhum',
    description: 'Ton équipage vend du rhum avec succès !',
    effect: { type: 'gainGold', amount: 100 },
    emoji: '🍾'
  },
  {
    id: 3,
    title: 'Carte au Trésor',
    description: 'Tu découvres un trésor ancien !',
    effect: { type: 'gainGold', amount: 150 },
    emoji: '🗺️'
  },
  {
    id: 4,
    title: 'Pêche Miraculeuse',
    description: 'Ton équipage attrape des poissons rares !',
    effect: { type: 'gainGold', amount: 80 },
    emoji: '🐟'
  },
  {
    id: 5,
    title: 'Perroquet Espion',
    description: 'Ton perroquet trahit ta position...',
    effect: { type: 'loseGold', amount: 50 },
    emoji: '🦜'
  },
  {
    id: 6,
    title: 'Navigation Experte',
    description: 'Avance jusqu\'au prochain port !',
    effect: { type: 'moveToNextPort' },
    emoji: '🧭'
  },
  {
    id: 7,
    title: 'Retour au Port',
    description: 'Retourne au départ et collecte 200 pièces !',
    effect: { type: 'moveToStart' },
    emoji: '🏁'
  },
  {
    id: 8,
    title: 'Faveur du Capitaine',
    description: 'Chaque joueur te donne 50 pièces !',
    effect: { type: 'collectFromAll', amount: 50 },
    emoji: '👑'
  },
  {
    id: 9,
    title: 'Fête au Rhum',
    description: 'Offre 20 pièces à chaque joueur !',
    effect: { type: 'giveToAll', amount: 20 },
    emoji: '🎉'
  },
  {
    id: 10,
    title: 'Sors de Prison',
    description: 'Garde cette carte pour sortir de prison !',
    effect: { type: 'getOutOfJail' },
    emoji: '🔓'
  },
  {
    id: 11,
    title: 'Réparations du Navire',
    description: 'Paie 25 pièces par taverne, 100 par fort !',
    effect: { type: 'payPerBuilding', tavern: 25, fort: 100 },
    emoji: '🔨'
  },
  {
    id: 12,
    title: 'Commerce Prospère',
    description: 'Gagne 10% de ton or actuel !',
    effect: { type: 'gainPercent', percent: 10 },
    emoji: '💹'
  },
  {
    id: 13,
    title: 'Sirène Généreuse',
    description: 'Une sirène t\'offre 120 pièces !',
    effect: { type: 'gainGold', amount: 120 },
    emoji: '🧜‍♀️'
  },
  {
    id: 14,
    title: 'Vent Favorable',
    description: 'Avance de 3 cases !',
    effect: { type: 'moveForward', spaces: 3 },
    emoji: '💨'
  },
  {
    id: 15,
    title: 'Alliance Pirate',
    description: 'Échange une propriété avec un joueur !',
    effect: { type: 'trade' },
    emoji: '🤝'
  }
];

// Cartes Malédiction
export const curseCards = [
  {
    id: 1,
    title: 'Le Kraken Attaque',
    description: 'Le Kraken t\'attrape ! Va en prison !',
    effect: { type: 'goToJail' },
    emoji: '🦑'
  },
  {
    id: 2,
    title: 'Tempête Dévastatrice',
    description: 'Une tempête emporte ton trésor !',
    effect: { type: 'loseGold', amount: 150 },
    emoji: '⛈️'
  },
  {
    id: 3,
    title: 'Attaque Pirate',
    description: 'Un rival t\'attaque ! Donne 100 pièces au joueur de ton choix !',
    effect: { type: 'giveToPlayer', amount: 100 },
    emoji: '⚔️'
  },
  {
    id: 4,
    title: 'Navire qui Coule',
    description: 'Ton navire prend l\'eau ! Perds 80 pièces !',
    effect: { type: 'loseGold', amount: 80 },
    emoji: '🚢'
  },
  {
    id: 5,
    title: 'Mutinerie',
    description: 'Ton équipage se mutine ! Perds 120 pièces !',
    effect: { type: 'loseGold', amount: 120 },
    emoji: '☠️'
  },
  {
    id: 6,
    title: 'Malédiction Vaudou',
    description: 'Recule de 3 cases !',
    effect: { type: 'moveBackward', spaces: 3 },
    emoji: '🧙'
  },
  {
    id: 7,
    title: 'Impôts du Roi',
    description: 'Paie 10% de ton or au roi !',
    effect: { type: 'losePercent', percent: 10 },
    emoji: '👑'
  },
  {
    id: 8,
    title: 'Rats sur le Navire',
    description: 'Des rats mangent tes provisions ! Perds 60 pièces !',
    effect: { type: 'loseGold', amount: 60 },
    emoji: '🐀'
  },
  {
    id: 9,
    title: 'Brouillard Épais',
    description: 'Perdu dans le brouillard ! Perds ton prochain tour !',
    effect: { type: 'skipTurn' },
    emoji: '🌫️'
  },
  {
    id: 10,
    title: 'Requin Affamé',
    description: 'Un requin endommage ton navire ! Paie 90 pièces !',
    effect: { type: 'loseGold', amount: 90 },
    emoji: '🦈'
  },
  {
    id: 11,
    title: 'Naufrage',
    description: 'Naufrage ! Va à la case la plus proche !',
    effect: { type: 'randomMove' },
    emoji: '⚓'
  },
  {
    id: 12,
    title: 'Vol à Main Armée',
    description: 'Tu es volé ! Perds 100 pièces !',
    effect: { type: 'loseGold', amount: 100 },
    emoji: '🔪'
  },
  {
    id: 13,
    title: 'Bouteille Empoisonnée',
    description: 'Rhum empoisonné ! Paie 70 pièces de soins !',
    effect: { type: 'loseGold', amount: 70 },
    emoji: '☠️'
  },
  {
    id: 14,
    title: 'Fantôme du Galion',
    description: 'Un fantôme te hante ! Perds ton prochain tour !',
    effect: { type: 'skipTurn' },
    emoji: '👻'
  },
  {
    id: 15,
    title: 'Taxation Générale',
    description: 'Paie 40 pièces à chaque joueur !',
    effect: { type: 'giveToAll', amount: 40 },
    emoji: '💸'
  }
];

// Pions disponibles
export const playerTokens = [
  { id: 'ship', emoji: '⚓', name: 'Bateau' },
  { id: 'parrot', emoji: '🦜', name: 'Perroquet' },
  { id: 'skull', emoji: '💀', name: 'Crâne' },
  { id: 'sword', emoji: '🗡️', name: 'Sabre' }
];
