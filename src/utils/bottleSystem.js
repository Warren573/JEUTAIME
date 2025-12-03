// Système de Bouteille à la mer - Messages anonymes
// Permet d'envoyer des messages anonymes à des utilisateurs aléatoires

const STORAGE_KEY = 'jeutaime_bottles';
const COOLDOWN_KEY = 'jeutaime_bottle_cooldown';
const MAX_BOTTLES_PER_DAY = 3; // Gratuit
const COOLDOWN_HOURS = 1; // Cooldown entre envois

/**
 * Obtenir tous les messages bouteille
 */
export function getAllBottles() {
  const bottles = localStorage.getItem(STORAGE_KEY);
  return bottles ? JSON.parse(bottles) : [];
}

/**
 * Envoyer un message bouteille
 * @param {string} senderId - Email de l'expéditeur
 * @param {string} message - Message à envoyer
 * @param {string} type - Type: 'thought', 'question', 'goodvibes', 'chat'
 * @param {boolean} isPremium - Si l'utilisateur est premium
 * @returns {Object} { success, error, bottle }
 */
export function sendBottle(senderId, message, type = 'thought', isPremium = false) {
  // Vérifier le cooldown
  if (!isPremium) {
    const cooldownCheck = checkCooldown(senderId);
    if (!cooldownCheck.canSend) {
      return {
        success: false,
        error: cooldownCheck.error
      };
    }
  }

  // Obtenir tous les utilisateurs sauf l'expéditeur
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const eligibleUsers = users.filter(u => u.email !== senderId && u.email);

  if (eligibleUsers.length === 0) {
    return {
      success: false,
      error: 'Aucun utilisateur disponible pour recevoir ton message'
    };
  }

  // Sélectionner un destinataire aléatoire
  const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
  const recipient = eligibleUsers[randomIndex];

  // Créer la bouteille
  const bottle = {
    id: `bottle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    senderId,
    recipientId: recipient.email,
    message,
    type,
    timestamp: Date.now(),
    read: false,
    revealed: false, // Si l'expéditeur a révélé son identité
    response: null // Réponse du destinataire
  };

  // Sauvegarder
  const bottles = getAllBottles();
  bottles.push(bottle);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bottles));

  // Mettre à jour le cooldown
  if (!isPremium) {
    updateCooldown(senderId);
  }

  return { success: true, bottle };
}

/**
 * Obtenir les messages reçus par un utilisateur
 * @param {string} userId - Email de l'utilisateur
 * @returns {Array} Messages reçus
 */
export function getReceivedBottles(userId) {
  const bottles = getAllBottles();
  return bottles
    .filter(b => b.recipientId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Obtenir les messages envoyés par un utilisateur
 * @param {string} userId - Email de l'utilisateur
 * @returns {Array} Messages envoyés
 */
export function getSentBottles(userId) {
  const bottles = getAllBottles();
  return bottles
    .filter(b => b.senderId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Marquer un message comme lu
 * @param {string} bottleId - ID du message
 */
export function markBottleAsRead(bottleId) {
  const bottles = getAllBottles();
  const bottle = bottles.find(b => b.id === bottleId);
  if (bottle) {
    bottle.read = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bottles));
  }
}

/**
 * Révéler l'identité de l'expéditeur
 * @param {string} bottleId - ID du message
 */
export function revealSender(bottleId) {
  const bottles = getAllBottles();
  const bottle = bottles.find(b => b.id === bottleId);
  if (bottle) {
    bottle.revealed = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bottles));
  }
}

/**
 * Répondre à une bouteille
 * @param {string} bottleId - ID du message original
 * @param {string} response - Réponse
 */
export function respondToBottle(bottleId, response) {
  const bottles = getAllBottles();
  const bottle = bottles.find(b => b.id === bottleId);
  if (bottle) {
    bottle.response = response;
    bottle.responseTimestamp = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bottles));
    return { success: true };
  }
  return { success: false, error: 'Message non trouvé' };
}

/**
 * Vérifier le cooldown
 * @param {string} userId - Email de l'utilisateur
 * @returns {Object} { canSend, error, nextAvailable }
 */
export function checkCooldown(userId) {
  const cooldownData = JSON.parse(localStorage.getItem(COOLDOWN_KEY) || '{}');
  const userCooldown = cooldownData[userId];

  if (!userCooldown) {
    return { canSend: true };
  }

  // Vérifier le nombre de messages aujourd'hui
  const today = new Date().setHours(0, 0, 0, 0);
  const todayBottles = userCooldown.dates?.filter(d => d >= today).length || 0;

  if (todayBottles >= MAX_BOTTLES_PER_DAY) {
    return {
      canSend: false,
      error: `Tu as atteint la limite de ${MAX_BOTTLES_PER_DAY} bouteilles par jour. Deviens Premium pour envoyer sans limite ! 📜✨`
    };
  }

  // Vérifier le cooldown de 1h
  const lastSent = userCooldown.lastSent || 0;
  const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
  const timeSinceLastSent = Date.now() - lastSent;

  if (timeSinceLastSent < cooldownMs) {
    const remainingMs = cooldownMs - timeSinceLastSent;
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    return {
      canSend: false,
      error: `Attends encore ${remainingMinutes} minutes avant d'envoyer une nouvelle bouteille 🕐`,
      nextAvailable: lastSent + cooldownMs
    };
  }

  return { canSend: true };
}

/**
 * Mettre à jour le cooldown après envoi
 * @param {string} userId - Email de l'utilisateur
 */
function updateCooldown(userId) {
  const cooldownData = JSON.parse(localStorage.getItem(COOLDOWN_KEY) || '{}');
  const now = Date.now();
  const today = new Date().setHours(0, 0, 0, 0);

  if (!cooldownData[userId]) {
    cooldownData[userId] = {
      lastSent: now,
      dates: [today]
    };
  } else {
    cooldownData[userId].lastSent = now;
    // Nettoyer les anciennes dates et ajouter aujourd'hui
    const recentDates = cooldownData[userId].dates?.filter(d => d >= today) || [];
    if (!recentDates.includes(today)) {
      recentDates.push(today);
    }
    cooldownData[userId].dates = recentDates;
  }

  localStorage.setItem(COOLDOWN_KEY, JSON.stringify(cooldownData));
}

/**
 * Obtenir le nombre de bouteilles envoyées aujourd'hui
 * @param {string} userId - Email de l'utilisateur
 * @returns {number} Nombre de bouteilles
 */
export function getTodayBottleCount(userId) {
  const cooldownData = JSON.parse(localStorage.getItem(COOLDOWN_KEY) || '{}');
  const userCooldown = cooldownData[userId];

  if (!userCooldown) return 0;

  const today = new Date().setHours(0, 0, 0, 0);
  return userCooldown.dates?.filter(d => d >= today).length || 0;
}

/**
 * Obtenir le nombre de messages non lus
 * @param {string} userId - Email de l'utilisateur
 * @returns {number} Nombre de messages non lus
 */
export function getUnreadCount(userId) {
  const bottles = getReceivedBottles(userId);
  return bottles.filter(b => !b.read).length;
}

/**
 * Types de messages disponibles
 */
export const BOTTLE_TYPES = {
  thought: {
    icon: '💭',
    label: 'Une pensée',
    placeholder: 'Partage une pensée, une citation, une réflexion...'
  },
  question: {
    icon: '❓',
    label: 'Une question',
    placeholder: 'Pose une question existentielle, philosophique...'
  },
  goodvibes: {
    icon: '💝',
    label: 'Good vibes',
    placeholder: 'Envoie des good vibes anonymes...'
  },
  chat: {
    icon: '💬',
    label: 'Discuter',
    placeholder: 'Cherche quelqu\'un pour discuter de...'
  }
};
