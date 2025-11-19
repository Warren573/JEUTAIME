import { awardPoints, checkAndAwardBadge } from './pointsSystem';

/**
 * Génère un code de parrainage unique pour un utilisateur
 * @param {string} userEmail - L'email de l'utilisateur
 * @returns {string} - Le code de parrainage
 */
export function generateReferralCode(userEmail) {
  // Créer un code basé sur l'email + timestamp
  const base = userEmail.split('@')[0].toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}-${random}`;
}

/**
 * Initialise le code de parrainage d'un utilisateur s'il n'existe pas
 * @param {string} userEmail - L'email de l'utilisateur
 * @returns {string} - Le code de parrainage
 */
export function initializeReferralCode(userEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const userIndex = users.findIndex(u => u.email === userEmail);

  if (userIndex === -1) return null;

  const user = users[userIndex];

  if (!user.referralCode) {
    user.referralCode = generateReferralCode(userEmail);
    user.referrals = [];
    users[userIndex] = user;
    localStorage.setItem('jeutaime_users', JSON.stringify(users));

    // Update current user if it's them
    const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
    if (currentUser && currentUser.email === userEmail) {
      localStorage.setItem('jeutaime_current_user', JSON.stringify(user));
    }
  }

  return user.referralCode;
}

/**
 * Trouve un utilisateur par son code de parrainage
 * @param {string} referralCode - Le code de parrainage à chercher
 * @returns {object|null} - L'utilisateur trouvé ou null
 */
export function findUserByReferralCode(referralCode) {
  if (!referralCode || referralCode.trim() === '') return null;

  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  return users.find(u => u.referralCode === referralCode.trim().toUpperCase());
}

/**
 * Applique un code de parrainage lors de l'inscription
 * @param {string} newUserEmail - L'email du nouvel utilisateur
 * @param {string} referralCode - Le code de parrainage entré
 * @returns {object} - Résultat de l'opération {success: boolean, message: string, sponsor: object|null}
 */
export function applyReferralCode(newUserEmail, referralCode) {
  if (!referralCode || referralCode.trim() === '') {
    return { success: false, message: 'Code vide', sponsor: null };
  }

  const sponsor = findUserByReferralCode(referralCode);

  if (!sponsor) {
    return { success: false, message: 'Code invalide', sponsor: null };
  }

  if (sponsor.email === newUserEmail) {
    return { success: false, message: 'Tu ne peux pas utiliser ton propre code', sponsor: null };
  }

  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const sponsorIndex = users.findIndex(u => u.email === sponsor.email);
  const newUserIndex = users.findIndex(u => u.email === newUserEmail);

  if (sponsorIndex === -1 || newUserIndex === -1) {
    return { success: false, message: 'Erreur utilisateur', sponsor: null };
  }

  // Vérifier que le filleul n'a pas déjà un parrain
  if (users[newUserIndex].referredBy) {
    return { success: false, message: 'Tu as déjà un parrain', sponsor: null };
  }

  // Ajouter le filleul au parrain
  if (!users[sponsorIndex].referrals) {
    users[sponsorIndex].referrals = [];
  }

  users[sponsorIndex].referrals.push({
    email: newUserEmail,
    pseudo: users[newUserIndex].pseudo,
    date: new Date().toISOString()
  });

  // Ajouter le parrain au filleul
  users[newUserIndex].referredBy = {
    email: sponsor.email,
    pseudo: sponsor.pseudo,
    code: referralCode,
    date: new Date().toISOString()
  };

  // Ajouter des coins au filleul
  users[newUserIndex].coins = (users[newUserIndex].coins || 100) + 25;

  // Ajouter des coins au parrain
  users[sponsorIndex].coins = (users[sponsorIndex].coins || 0) + 50;

  // Sauvegarder
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  // Attribuer les points au parrain
  awardPoints(sponsor.email, 'REFERRAL_SPONSOR');

  // Attribuer les points au filleul
  awardPoints(newUserEmail, 'REFERRAL_REFERRED');

  // Vérifier le badge INFLUENCER (5 filleuls)
  if (users[sponsorIndex].referrals.length >= 5) {
    checkAndAwardBadge(sponsor.email, 'influencer');
  }

  console.log(`🎁 Parrainage réussi ! ${sponsor.pseudo} → ${users[newUserIndex].pseudo}`);
  console.log(`   Parrain: +100 pts, +50 🪙`);
  console.log(`   Filleul: +50 pts, +25 🪙`);

  return { success: true, message: 'Parrainage appliqué !', sponsor: sponsor };
}

/**
 * Récupère les statistiques de parrainage d'un utilisateur
 * @param {string} userEmail - L'email de l'utilisateur
 * @returns {object} - Les statistiques {code: string, referrals: array, referredBy: object|null}
 */
export function getReferralStats(userEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const user = users.find(u => u.email === userEmail);

  if (!user) return null;

  // Initialiser le code si nécessaire
  if (!user.referralCode) {
    initializeReferralCode(userEmail);
    const updatedUsers = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const updatedUser = updatedUsers.find(u => u.email === userEmail);
    return {
      code: updatedUser.referralCode,
      referrals: updatedUser.referrals || [],
      referredBy: updatedUser.referredBy || null
    };
  }

  return {
    code: user.referralCode,
    referrals: user.referrals || [],
    referredBy: user.referredBy || null
  };
}

/**
 * Copie le code de parrainage dans le presse-papier
 * @param {string} referralCode - Le code à copier
 * @returns {Promise<boolean>} - True si succès
 */
export async function copyReferralCode(referralCode) {
  try {
    await navigator.clipboard.writeText(referralCode);
    return true;
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
    return false;
  }
}
