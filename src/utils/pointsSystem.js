import { POINTS_ACTIONS, getTitleFromPoints, BADGES } from '../config/gameConfig';

/**
 * Ajoute des points à un utilisateur et met à jour son titre
 * @param {string} userEmail - L'email de l'utilisateur
 * @param {number} points - Le nombre de points à ajouter (peut être négatif)
 * @param {string} reason - La raison de l'ajout de points (optionnel)
 * @returns {object} - L'utilisateur mis à jour
 */
export function addPoints(userEmail, points, reason = '') {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const userIndex = users.findIndex(u => u.email === userEmail);

  if (userIndex === -1) {
    console.error('Utilisateur non trouvé');
    return null;
  }

  const user = users[userIndex];
  const oldPoints = user.points || 0;
  const newPoints = Math.max(0, oldPoints + points); // Les points ne peuvent pas être négatifs

  // Mettre à jour les points
  user.points = newPoints;

  // Mettre à jour le titre basé sur les nouveaux points
  const titleInfo = getTitleFromPoints(newPoints);
  user.level = titleInfo.level;
  user.title = titleInfo.title;

  // Sauvegarder
  users[userIndex] = user;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  // Mettre à jour current_user si c'est lui
  const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
  if (currentUser && currentUser.email === userEmail) {
    localStorage.setItem('jeutaime_current_user', JSON.stringify(user));
  }

  // Log pour debug
  if (reason) {
    console.log(`[Points] ${user.pseudo}: ${oldPoints} → ${newPoints} (+${points}) - ${reason}`);
  }

  return user;
}

/**
 * Attribution de points pour une action spécifique
 * @param {string} userEmail - L'email de l'utilisateur
 * @param {string} action - Le type d'action (SMILE_RECEIVED, MATCH_SUCCESS, etc.)
 * @returns {object} - L'utilisateur mis à jour
 */
export function awardPoints(userEmail, action) {
  const pointsValue = POINTS_ACTIONS[action];

  if (pointsValue === undefined) {
    console.error(`Action inconnue: ${action}`);
    return null;
  }

  return addPoints(userEmail, pointsValue, action);
}

/**
 * Vérifie et attribue un badge si les conditions sont remplies
 * @param {string} userEmail - L'email de l'utilisateur
 * @param {string} badgeId - L'ID du badge à vérifier
 * @returns {boolean} - True si le badge a été attribué
 */
export function checkAndAwardBadge(userEmail, badgeId) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const userIndex = users.findIndex(u => u.email === userEmail);

  if (userIndex === -1) return false;

  const user = users[userIndex];

  // Vérifier si l'utilisateur a déjà ce badge
  if (!user.badges) user.badges = [];
  if (user.badges.includes(badgeId)) return false;

  // Trouver le badge
  const badge = Object.values(BADGES).find(b => b.id === badgeId);
  if (!badge) return false;

  // Ajouter le badge
  user.badges.push(badgeId);

  // Ajouter les points du badge
  if (badge.points > 0) {
    user.points = (user.points || 0) + badge.points;

    // Mettre à jour le titre
    const titleInfo = getTitleFromPoints(user.points);
    user.level = titleInfo.level;
    user.title = titleInfo.title;
  }

  // Sauvegarder
  users[userIndex] = user;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  // Mettre à jour current_user si c'est lui
  const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
  if (currentUser && currentUser.email === userEmail) {
    localStorage.setItem('jeutaime_current_user', JSON.stringify(user));
  }

  console.log(`[Badge] ${user.pseudo} a débloqué: ${badge.name} ${badge.emoji} (+${badge.points} pts)`);

  return true;
}

/**
 * Récupère les statistiques d'un utilisateur
 * @param {string} userEmail - L'email de l'utilisateur
 * @returns {object} - Les statistiques de l'utilisateur
 */
export function getUserStats(userEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const user = users.find(u => u.email === userEmail);

  if (!user) return null;

  // Récupérer les données de smiles et matches
  const smiles = JSON.parse(localStorage.getItem('jeutaime_smiles') || '{}');
  const matches = JSON.parse(localStorage.getItem('jeutaime_matches') || '{}');

  const userId = user.email;
  const userSmiles = smiles[userId] || { sentTo: [], receivedFrom: [], grimaces: [] };
  const userMatches = matches[userId] || [];

  return {
    points: user.points || 0,
    level: user.level || 1,
    title: user.title || 'Novice du Cœur',
    badges: user.badges || [],
    smilesSent: userSmiles.sentTo?.length || 0,
    smilesReceived: userSmiles.receivedFrom?.length || 0,
    grimacesSent: userSmiles.grimaces?.length || 0,
    matches: userMatches.length || 0
  };
}

/**
 * Attribue des points quotidiens pour la connexion
 * @param {string} userEmail - L'email de l'utilisateur
 * @returns {boolean} - True si les points ont été attribués
 */
export function awardDailyLogin(userEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const userIndex = users.findIndex(u => u.email === userEmail);

  if (userIndex === -1) return false;

  const user = users[userIndex];
  const today = new Date().toDateString();

  // Vérifier si l'utilisateur a déjà reçu ses points aujourd'hui
  if (user.lastLoginDate === today) {
    return false;
  }

  // Attribuer les points
  user.lastLoginDate = today;
  awardPoints(userEmail, 'DAILY_LOGIN');

  return true;
}
