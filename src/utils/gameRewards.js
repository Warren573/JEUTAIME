import { calculateGameReward, saveGameScore, checkGameBadge, GAME_BADGES } from '../config/gamesConfig';

/**
 * Attribuer les récompenses après une partie
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} gameType - Type de jeu
 * @param {object} gameResult - Résultat du jeu
 * @returns {object} - { coins, points, message, badgesUnlocked }
 */
export function awardGameRewards(userEmail, gameType, gameResult) {
  // Calculer les récompenses
  const reward = calculateGameReward(gameType, gameResult);

  // Mettre à jour les pièces de l'utilisateur
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const userIndex = users.findIndex(u => u.email === userEmail);

  if (userIndex === -1) {
    return { ...reward, badgesUnlocked: [] };
  }

  const user = users[userIndex];

  // Ajouter les pièces
  user.coins = (user.coins || 0) + reward.coins;

  // Ajouter les points
  user.points = (user.points || 0) + reward.points;

  // Sauvegarder le score
  const score = gameResult.score || gameResult.playerScore || 0;
  const gameData = saveGameScore(userEmail, gameType, score);

  // Mettre à jour totalCoinsEarned
  const scores = JSON.parse(localStorage.getItem('jeutaime_game_scores') || '{}');
  if (scores[userEmail] && scores[userEmail][gameType]) {
    scores[userEmail][gameType].totalCoinsEarned =
      (scores[userEmail][gameType].totalCoinsEarned || 0) + reward.coins;
    localStorage.setItem('jeutaime_game_scores', JSON.stringify(scores));
  }

  // Sauvegarder l'utilisateur
  users[userIndex] = user;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  // Mettre à jour currentUser
  const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
  if (currentUser && currentUser.email === userEmail) {
    currentUser.coins = user.coins;
    currentUser.points = user.points;
    localStorage.setItem('jeutaime_current_user', JSON.stringify(currentUser));
  }

  // Vérifier les badges
  const badgesUnlocked = [];

  // Vérifier tous les badges de jeux
  for (const badgeKey of Object.keys(GAME_BADGES)) {
    const badge = GAME_BADGES[badgeKey];
    const unlocked = checkGameBadge(userEmail, badgeKey);
    if (unlocked) {
      badgesUnlocked.push(badge);
    }
  }

  console.log(`[Game Reward] ${user.pseudo} earned ${reward.coins} coins and ${reward.points} points from ${gameType}`);

  return {
    ...reward,
    badgesUnlocked,
    newCoins: user.coins,
    newPoints: user.points,
    gameData
  };
}

/**
 * Afficher un modal de récompense
 * @param {object} reward - Objet de récompense
 */
export function showRewardModal(reward) {
  const messages = [
    `🎮 Partie terminée !`,
    `💰 +${reward.coins} pièces`,
    `⭐ +${reward.points} points`
  ];

  if (reward.bonus && reward.bonus.length > 0) {
    messages.push('', '🎁 Bonus :');
    messages.push(...reward.bonus);
  }

  if (reward.badgesUnlocked && reward.badgesUnlocked.length > 0) {
    messages.push('', '🏆 Nouveaux badges :');
    reward.badgesUnlocked.forEach(badge => {
      messages.push(`${badge.emoji} ${badge.name} (+${badge.points} pts)`);
    });
  }

  alert(messages.join('\n'));
}

/**
 * Récupérer les statistiques de jeux d'un utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @returns {object} - Statistiques globales
 */
export function getGameStats(userEmail) {
  const scores = JSON.parse(localStorage.getItem('jeutaime_game_scores') || '{}');
  const userScores = scores[userEmail] || {};

  let totalPlays = 0;
  let totalCoinsEarned = 0;
  let gamesPlayed = 0;

  Object.values(userScores).forEach(gameData => {
    totalPlays += gameData.totalPlays || 0;
    totalCoinsEarned += gameData.totalCoinsEarned || 0;
    if (gameData.totalPlays > 0) gamesPlayed += 1;
  });

  return {
    totalPlays,
    totalCoinsEarned,
    gamesPlayed,
    scores: userScores
  };
}
