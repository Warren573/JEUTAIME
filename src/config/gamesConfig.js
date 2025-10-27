// Configuration des récompenses et badges pour les jeux

export const GAME_REWARDS = {
  WHACK_A_MOLE: {
    name: 'Tape la Taupe',
    coinsPerPoint: 2, // 2 pièces par point
    bonusThresholds: [
      { score: 10, coins: 20, message: '🎉 Bonus 10+ : +20 pièces !' },
      { score: 20, coins: 50, message: '🔥 Bonus 20+ : +50 pièces !' },
      { score: 30, coins: 100, message: '⚡ Bonus 30+ : +100 pièces !' },
      { score: 50, coins: 200, message: '💎 Bonus 50+ : +200 pièces !' }
    ]
  },
  CARD_GAME: {
    name: 'Jeu des Cartes',
    coinsPerWin: 50,
    coinsPerLoss: -20,
    maxCoins: 500
  },
  PONG: {
    name: 'Pong',
    coinsPerPoint: 5,
    winBonus: 50,
    loseBonus: 10
  },
  BRICK_BREAKER: {
    name: 'Casse Brique',
    coinsPerBrick: 1,
    levelCompleteBonus: 100,
    gameCompleteBonus: 500
  },
  MORPION: {
    name: 'Morpion',
    winCoins: 30,
    drawCoins: 10,
    loseCoins: 5
  },
  HERO_LOVE: {
    name: 'HeroLove Quest',
    coinsPerMonster: 10,
    coinsPerLevel: 50,
    victoryBonus: 200
  }
};

export const GAME_BADGES = {
  MOLE_MASTER: {
    id: 'mole_master',
    name: 'Maître des Taupes',
    emoji: '⚡',
    description: 'Atteindre 50 points à Tape la Taupe',
    requirement: { game: 'WHACK_A_MOLE', score: 50 },
    points: 100
  },
  CARD_SHARK: {
    id: 'card_shark',
    name: 'As des Cartes',
    emoji: '🎴',
    description: 'Gagner 500 pièces au Jeu des Cartes',
    requirement: { game: 'CARD_GAME', totalEarned: 500 },
    points: 150
  },
  PONG_CHAMPION: {
    id: 'pong_champion',
    name: 'Champion de Pong',
    emoji: '🏓',
    description: 'Gagner 10 parties de Pong',
    requirement: { game: 'PONG', wins: 10 },
    points: 100
  },
  BRICK_DESTROYER: {
    id: 'brick_destroyer',
    name: 'Destructeur de Briques',
    emoji: '🧱',
    description: 'Compléter 5 niveaux de Casse Brique',
    requirement: { game: 'BRICK_BREAKER', levelsCompleted: 5 },
    points: 120
  },
  HERO_LEGEND: {
    id: 'hero_legend',
    name: 'Légende Héroïque',
    emoji: '🦸',
    description: 'Terminer HeroLove Quest',
    requirement: { game: 'HERO_LOVE', victory: true },
    points: 200
  },
  GAME_ADDICT: {
    id: 'game_addict',
    name: 'Accro aux Jeux',
    emoji: '🎮',
    description: 'Jouer à tous les jeux au moins une fois',
    requirement: { allGamesPlayed: true },
    points: 150
  }
};

/**
 * Calculer les récompenses pour un jeu
 * @param {string} gameType - Type de jeu (WHACK_A_MOLE, etc.)
 * @param {object} gameResult - Résultat du jeu (score, win, etc.)
 * @returns {object} - { coins, points, bonus, message }
 */
export function calculateGameReward(gameType, gameResult) {
  const gameConfig = GAME_REWARDS[gameType];
  if (!gameConfig) return { coins: 0, points: 0, bonus: [], message: '' };

  let totalCoins = 0;
  let totalPoints = 0;
  let bonusMessages = [];

  switch (gameType) {
    case 'WHACK_A_MOLE': {
      const { score } = gameResult;

      // Pièces de base
      totalCoins = score * gameConfig.coinsPerPoint;
      totalPoints = score;

      // Bonus par palier
      for (const threshold of gameConfig.bonusThresholds) {
        if (score >= threshold.score) {
          totalCoins += threshold.coins;
          bonusMessages.push(threshold.message);
        }
      }

      break;
    }

    case 'CARD_GAME': {
      const { won, amount } = gameResult;
      totalCoins = won ? amount : -Math.abs(amount);
      totalPoints = won ? 10 : 0;
      break;
    }

    case 'PONG': {
      const { playerScore, opponentScore } = gameResult;
      const won = playerScore > opponentScore;

      totalCoins = playerScore * gameConfig.coinsPerPoint;
      totalCoins += won ? gameConfig.winBonus : gameConfig.loseBonus;
      totalPoints = won ? 20 : 5;

      if (won) bonusMessages.push('🏆 Victoire : +50 pièces !');
      break;
    }

    case 'BRICK_BREAKER': {
      const { bricksDestroyed, levelCompleted, gameCompleted } = gameResult;

      totalCoins = bricksDestroyed * gameConfig.coinsPerBrick;
      totalPoints = bricksDestroyed;

      if (levelCompleted) {
        totalCoins += gameConfig.levelCompleteBonus;
        totalPoints += 50;
        bonusMessages.push('✨ Niveau terminé : +100 pièces !');
      }

      if (gameCompleted) {
        totalCoins += gameConfig.gameCompleteBonus;
        totalPoints += 200;
        bonusMessages.push('🏆 Jeu terminé : +500 pièces !');
      }

      break;
    }

    case 'MORPION': {
      const { result } = gameResult; // 'win', 'draw', 'lose'

      if (result === 'win') {
        totalCoins = gameConfig.winCoins;
        totalPoints = 15;
        bonusMessages.push('🏆 Victoire !');
      } else if (result === 'draw') {
        totalCoins = gameConfig.drawCoins;
        totalPoints = 5;
        bonusMessages.push('🤝 Match nul');
      } else {
        totalCoins = gameConfig.loseCoins;
        totalPoints = 2;
      }

      break;
    }

    case 'HERO_LOVE': {
      const { monstersDefeated, coinsEarned, victory } = gameResult;

      totalCoins = coinsEarned || 0;
      totalPoints = monstersDefeated * 5;

      if (victory) {
        totalCoins += gameConfig.victoryBonus;
        totalPoints += 100;
        bonusMessages.push('🏆 Quête terminée : +200 pièces !');
      }

      break;
    }
  }

  const message = bonusMessages.length > 0
    ? bonusMessages.join('\n')
    : `🎮 +${totalCoins} pièces gagnées !`;

  return {
    coins: totalCoins,
    points: totalPoints,
    bonus: bonusMessages,
    message
  };
}

/**
 * Sauvegarder un score de jeu
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} gameType - Type de jeu
 * @param {number} score - Score obtenu
 */
export function saveGameScore(userEmail, gameType, score) {
  const scores = JSON.parse(localStorage.getItem('jeutaime_game_scores') || '{}');

  if (!scores[userEmail]) {
    scores[userEmail] = {};
  }

  if (!scores[userEmail][gameType]) {
    scores[userEmail][gameType] = {
      bestScore: 0,
      totalPlays: 0,
      totalCoinsEarned: 0,
      lastPlayed: null
    };
  }

  const gameData = scores[userEmail][gameType];
  gameData.bestScore = Math.max(gameData.bestScore, score);
  gameData.totalPlays += 1;
  gameData.lastPlayed = new Date().toISOString();

  scores[userEmail] = { ...scores[userEmail], [gameType]: gameData };
  localStorage.setItem('jeutaime_game_scores', JSON.stringify(scores));

  return gameData;
}

/**
 * Récupérer les scores d'un utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} gameType - Type de jeu (optionnel)
 * @returns {object} - Données de score
 */
export function getGameScores(userEmail, gameType = null) {
  const scores = JSON.parse(localStorage.getItem('jeutaime_game_scores') || '{}');

  if (!scores[userEmail]) return null;

  if (gameType) {
    return scores[userEmail][gameType] || null;
  }

  return scores[userEmail];
}

/**
 * Vérifier et attribuer un badge de jeu
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} badgeId - ID du badge
 * @returns {boolean} - True si le badge a été attribué
 */
export function checkGameBadge(userEmail, badgeId) {
  const badge = GAME_BADGES[badgeId];
  if (!badge) return false;

  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const userIndex = users.findIndex(u => u.email === userEmail);
  if (userIndex === -1) return false;

  const user = users[userIndex];
  if (!user.badges) user.badges = [];

  // Vérifier si déjà obtenu
  if (user.badges.includes(badge.id)) return false;

  // Vérifier les conditions
  const gameScores = getGameScores(userEmail);
  if (!gameScores) return false;

  const req = badge.requirement;
  let conditionMet = false;

  if (req.allGamesPlayed) {
    const allGames = Object.keys(GAME_REWARDS);
    conditionMet = allGames.every(game => gameScores[game]?.totalPlays > 0);
  } else if (req.game) {
    const gameData = gameScores[req.game];
    if (!gameData) return false;

    if (req.score) {
      conditionMet = gameData.bestScore >= req.score;
    } else if (req.totalEarned) {
      conditionMet = gameData.totalCoinsEarned >= req.totalEarned;
    } else if (req.wins) {
      conditionMet = gameData.wins >= req.wins;
    } else if (req.levelsCompleted) {
      conditionMet = gameData.levelsCompleted >= req.levelsCompleted;
    } else if (req.victory) {
      conditionMet = gameData.victory === true;
    }
  }

  if (conditionMet) {
    user.badges.push(badge.id);
    user.points = (user.points || 0) + badge.points;

    users[userIndex] = user;
    localStorage.setItem('jeutaime_users', JSON.stringify(users));

    // Mettre à jour currentUser
    const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
    if (currentUser && currentUser.email === userEmail) {
      localStorage.setItem('jeutaime_current_user', JSON.stringify(user));
    }

    console.log(`[Badge] ${user.pseudo} a débloqué: ${badge.name} ${badge.emoji} (+${badge.points} pts)`);
    return true;
  }

  return false;
}
