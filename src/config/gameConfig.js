// Configuration du système de points et de classement

export const TITLES = [
  { level: 1, minPoints: 0, title: 'Novice du Cœur', emoji: '💗' },
  { level: 2, minPoints: 100, title: 'Apprenti(e) Séducteur/Séductrice', emoji: '💝' },
  { level: 3, minPoints: 300, title: 'Charmeur/Charmeuse', emoji: '💖' },
  { level: 4, minPoints: 600, title: 'Expert(e) en Romance', emoji: '💕' },
  { level: 5, minPoints: 1000, title: 'Maître/Maîtresse de l\'Amour', emoji: '💘' },
  { level: 6, minPoints: 1500, title: 'Séducteur/Séductrice Légendaire', emoji: '💞' },
  { level: 7, minPoints: 2500, title: 'Prince/Princesse des Cœurs', emoji: '👑' },
  { level: 8, minPoints: 4000, title: 'Roi/Reine des Cœurs', emoji: '👸' },
  { level: 9, minPoints: 6000, title: 'Empereur/Impératrice de l\'Amour', emoji: '⭐' },
  { level: 10, minPoints: 10000, title: 'Divinité de l\'Amour', emoji: '✨' }
];

export const BADGES = {
  FIRST_SMILE: {
    id: 'first_smile',
    name: 'Premier Sourire',
    emoji: '😊',
    description: 'Envoie ton premier sourire',
    points: 10
  },
  FIRST_MATCH: {
    id: 'first_match',
    name: 'Premier Match',
    emoji: '🎯',
    description: 'Réussis ton premier match',
    points: 50
  },
  POPULAR: {
    id: 'popular',
    name: 'Populaire',
    emoji: '🌟',
    description: 'Reçois 10 sourires',
    points: 100
  },
  HEARTBREAKER: {
    id: 'heartbreaker',
    name: 'Briseur/Briseuse de Cœurs',
    emoji: '💔',
    description: 'Envoie 50 grimaces',
    points: 0
  },
  ROMANTIC: {
    id: 'romantic',
    name: 'Romantique',
    emoji: '💌',
    description: 'Envoie 20 lettres',
    points: 200
  },
  GENEROUS: {
    id: 'generous',
    name: 'Généreux/Généreuse',
    emoji: '🎁',
    description: 'Offre 10 cadeaux',
    points: 150
  },
  WARRIOR: {
    id: 'warrior',
    name: 'Guerrier/Guerrière',
    emoji: '⚔️',
    description: 'Gagne 5 duels',
    points: 250
  },
  MAGICIAN: {
    id: 'magician',
    name: 'Magicien/Magicienne',
    emoji: '🔮',
    description: 'Lance 20 sorts',
    points: 200
  }
};

export const POINTS_ACTIONS = {
  SMILE_SENT: 5,
  SMILE_RECEIVED: 10,
  GRIMACE_RECEIVED: -5,
  MATCH_SUCCESS: 50,
  LETTER_SENT: 10,
  LETTER_RECEIVED: 15,
  GIFT_SENT: 20,
  GIFT_RECEIVED: 30,
  DECLARATION_SENT: 50,
  DECLARATION_RECEIVED: 100,
  DUEL_WON: 100,
  DUEL_LOST: -50,
  SPELL_CAST: 15,
  DAILY_LOGIN: 10
};

// Fonction pour calculer le titre en fonction des points
export function getTitleFromPoints(points) {
  // Parcourir les titres du plus haut au plus bas
  for (let i = TITLES.length - 1; i >= 0; i--) {
    if (points >= TITLES[i].minPoints) {
      return TITLES[i];
    }
  }
  return TITLES[0]; // Retourner le premier titre par défaut
}

// Fonction pour calculer le prochain niveau
export function getNextLevel(points) {
  const currentTitle = getTitleFromPoints(points);
  const currentIndex = TITLES.findIndex(t => t.level === currentTitle.level);

  if (currentIndex < TITLES.length - 1) {
    return TITLES[currentIndex + 1];
  }

  return null; // Maximum level reached
}

// Fonction pour calculer la progression vers le prochain niveau
export function getProgressToNextLevel(points) {
  const currentTitle = getTitleFromPoints(points);
  const nextLevel = getNextLevel(points);

  if (!nextLevel) {
    return 100; // Max level
  }

  const pointsInCurrentLevel = points - currentTitle.minPoints;
  const pointsNeededForNextLevel = nextLevel.minPoints - currentTitle.minPoints;

  return Math.min(100, Math.floor((pointsInCurrentLevel / pointsNeededForNextLevel) * 100));
}
