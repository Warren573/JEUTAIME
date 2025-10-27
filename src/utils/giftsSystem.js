import { getGiftById, getSpellById } from '../config/giftsConfig';
import { awardPoints, checkAndAwardBadge } from './pointsSystem';

/**
 * Envoie un cadeau à un utilisateur
 * @param {string} senderEmail - Email de l'expéditeur
 * @param {string} receiverId - ID du destinataire
 * @param {string} giftId - ID du cadeau
 * @returns {object} - Résultat de l'envoi { success: boolean, message: string, gift: object }
 */
export function sendGift(senderEmail, receiverId, giftId) {
  const gift = getGiftById(giftId);

  if (!gift) {
    return { success: false, message: 'Cadeau introuvable', gift: null };
  }

  // Vérifier si l'expéditeur a assez de pièces
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const senderIndex = users.findIndex(u => u.email === senderEmail);

  if (senderIndex === -1) {
    return { success: false, message: 'Utilisateur introuvable', gift: null };
  }

  const sender = users[senderIndex];

  if ((sender.coins || 0) < gift.cost) {
    return { success: false, message: 'Pas assez de pièces !', gift: null };
  }

  // Déduire les pièces
  sender.coins = (sender.coins || 0) - gift.cost;
  users[senderIndex] = sender;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  // Mettre à jour currentUser si c'est lui
  const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
  if (currentUser && currentUser.email === senderEmail) {
    currentUser.coins = sender.coins;
    localStorage.setItem('jeutaime_current_user', JSON.stringify(currentUser));
  }

  // Sauvegarder le cadeau envoyé
  const gifts = JSON.parse(localStorage.getItem('jeutaime_gifts') || '{}');

  if (!gifts[receiverId]) {
    gifts[receiverId] = { received: [], sent: [] };
  }
  if (!gifts[senderEmail]) {
    gifts[senderEmail] = { received: [], sent: [] };
  }

  const giftData = {
    id: Date.now(),
    giftId: gift.id,
    giftName: gift.name,
    giftEmoji: gift.emoji,
    from: senderEmail,
    to: receiverId,
    timestamp: new Date().toISOString(),
    read: false
  };

  gifts[receiverId].received.push(giftData);
  gifts[senderEmail].sent.push(giftData);

  localStorage.setItem('jeutaime_gifts', JSON.stringify(gifts));

  // Attribuer des points à l'envoyeur
  awardPoints(senderEmail, 'GIFT_SENT');

  // Vérifier badge généreux (10 cadeaux envoyés)
  if (gifts[senderEmail].sent.length >= 10) {
    checkAndAwardBadge(senderEmail, 'generous');
  }

  // TODO: Attribuer des points au destinataire quand il est un vrai utilisateur
  // Pour l'instant, les destinataires sont des profils de démo

  console.log(`[Gift] ${sender.pseudo} a envoyé ${gift.emoji} ${gift.name} à ${receiverId}`);

  return {
    success: true,
    message: `${gift.emoji} ${gift.name} envoyé(e) !`,
    gift: giftData,
    coinsRemaining: sender.coins
  };
}

/**
 * Lance un sort magique
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} spellId - ID du sort
 * @returns {object} - Résultat { success: boolean, message: string, spell: object }
 */
export function castSpell(userEmail, spellId) {
  const spell = getSpellById(spellId);

  if (!spell) {
    return { success: false, message: 'Sort introuvable', spell: null };
  }

  // Vérifier si l'utilisateur a assez de pièces
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const userIndex = users.findIndex(u => u.email === userEmail);

  if (userIndex === -1) {
    return { success: false, message: 'Utilisateur introuvable', spell: null };
  }

  const user = users[userIndex];

  if ((user.coins || 0) < spell.cost) {
    return { success: false, message: 'Pas assez de pièces !', spell: null };
  }

  // Déduire les pièces
  user.coins = (user.coins || 0) - spell.cost;
  users[userIndex] = user;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  // Mettre à jour currentUser si c'est lui
  const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
  if (currentUser && currentUser.email === userEmail) {
    currentUser.coins = user.coins;
    localStorage.setItem('jeutaime_current_user', JSON.stringify(currentUser));
  }

  // Sauvegarder le sort lancé
  const spells = JSON.parse(localStorage.getItem('jeutaime_active_spells') || '{}');

  if (!spells[userEmail]) {
    spells[userEmail] = [];
  }

  const spellData = {
    id: Date.now(),
    spellId: spell.id,
    spellName: spell.name,
    spellEmoji: spell.emoji,
    startTime: new Date().toISOString(),
    endTime: spell.duration > 0 ? new Date(Date.now() + spell.duration).toISOString() : null,
    active: true
  };

  spells[userEmail].push(spellData);
  localStorage.setItem('jeutaime_active_spells', JSON.stringify(spells));

  // Attribuer des points
  awardPoints(userEmail, 'SPELL_CAST');

  // Vérifier badge magicien (20 sorts lancés)
  if (spells[userEmail].length >= 20) {
    checkAndAwardBadge(userEmail, 'magician');
  }

  console.log(`[Spell] ${user.pseudo} a lancé ${spell.emoji} ${spell.name}`);

  return {
    success: true,
    message: `${spell.emoji} ${spell.name} activé !`,
    spell: spellData,
    coinsRemaining: user.coins
  };
}

/**
 * Récupère les cadeaux reçus par un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {boolean} unreadOnly - Ne récupérer que les non lus
 * @returns {array} - Liste des cadeaux
 */
export function getReceivedGifts(userId, unreadOnly = false) {
  const gifts = JSON.parse(localStorage.getItem('jeutaime_gifts') || '{}');
  const userGifts = gifts[userId] || { received: [], sent: [] };

  if (unreadOnly) {
    return userGifts.received.filter(g => !g.read);
  }

  return userGifts.received;
}

/**
 * Récupère les cadeaux envoyés par un utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @returns {array} - Liste des cadeaux envoyés
 */
export function getSentGifts(userEmail) {
  const gifts = JSON.parse(localStorage.getItem('jeutaime_gifts') || '{}');
  const userGifts = gifts[userEmail] || { received: [], sent: [] };
  return userGifts.sent;
}

/**
 * Marque un cadeau comme lu
 * @param {string} userId - ID de l'utilisateur
 * @param {number} giftId - ID du cadeau
 */
export function markGiftAsRead(userId, giftId) {
  const gifts = JSON.parse(localStorage.getItem('jeutaime_gifts') || '{}');

  if (!gifts[userId]) return;

  const giftIndex = gifts[userId].received.findIndex(g => g.id === giftId);
  if (giftIndex !== -1) {
    gifts[userId].received[giftIndex].read = true;
    localStorage.setItem('jeutaime_gifts', JSON.stringify(gifts));
  }
}

/**
 * Récupère les sorts actifs pour un utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @returns {array} - Liste des sorts actifs
 */
export function getActiveSpells(userEmail) {
  const spells = JSON.parse(localStorage.getItem('jeutaime_active_spells') || '{}');
  const userSpells = spells[userEmail] || [];

  // Filtrer les sorts encore actifs
  const now = new Date();
  return userSpells.filter(s => {
    if (!s.endTime) return true; // Sort instantané déjà utilisé
    return new Date(s.endTime) > now;
  });
}

/**
 * Vérifie si un sort est actif
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} spellId - ID du sort
 * @returns {boolean} - True si le sort est actif
 */
export function isSpellActive(userEmail, spellId) {
  const activeSpells = getActiveSpells(userEmail);
  return activeSpells.some(s => s.spellId === spellId);
}
