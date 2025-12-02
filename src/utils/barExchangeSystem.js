// Système d'échange entre salons
// Permet aux membres de différents salons d'échanger temporairement de salon pour 24h

const STORAGE_KEY = 'jeutaime_bar_exchanges';
const ACTIVE_EXCHANGES_KEY = 'jeutaime_active_exchanges';
const EXCHANGE_DURATION = 24 * 60 * 60 * 1000; // 24 heures en ms
const EXCHANGE_COOLDOWN = 48 * 60 * 60 * 1000; // 48 heures entre échanges

/**
 * Obtenir toutes les demandes d'échange en attente
 */
export function getPendingExchanges() {
  const exchanges = localStorage.getItem(STORAGE_KEY);
  const parsed = exchanges ? JSON.parse(exchanges) : [];

  // Nettoyer les demandes expirées (plus de 24h)
  const now = Date.now();
  const valid = parsed.filter(ex => now - ex.timestamp < EXCHANGE_DURATION);

  if (valid.length !== parsed.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
  }

  return valid;
}

/**
 * Proposer un échange de salon
 * @param {number} barId - ID du salon
 * @param {string} userId - Email de l'utilisateur
 * @returns {Object} { success, exchange, matchedExchange }
 */
export function proposeExchange(barId, userId) {
  const pending = getPendingExchanges();
  const now = Date.now();

  // Vérifier si l'utilisateur a déjà proposé un échange pour ce bar
  const existing = pending.find(ex => ex.barId === barId && ex.userId === userId);
  if (existing) {
    return {
      success: false,
      error: 'Tu as déjà proposé un échange pour ce salon !'
    };
  }

  // Vérifier le cooldown
  const cooldownCheck = checkExchangeCooldown(barId);
  if (!cooldownCheck.canExchange) {
    return {
      success: false,
      error: cooldownCheck.error
    };
  }

  // Chercher une demande compatible (autre salon)
  const matchingExchange = pending.find(ex => ex.barId !== barId);

  if (matchingExchange) {
    // Match trouvé ! Créer l'échange
    const exchange = {
      id: `exchange_${Date.now()}`,
      bar1Id: barId,
      bar2Id: matchingExchange.barId,
      user1Id: userId,
      user2Id: matchingExchange.userId,
      startTime: now,
      endTime: now + EXCHANGE_DURATION,
      active: true
    };

    // Sauvegarder l'échange actif
    saveActiveExchange(exchange);

    // Retirer les demandes en attente
    const updated = pending.filter(ex =>
      ex.barId !== barId && ex.barId !== matchingExchange.barId
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return {
      success: true,
      exchange,
      matchedExchange
    };
  } else {
    // Pas de match, ajouter à la liste d'attente
    const newExchange = {
      id: `pending_${Date.now()}`,
      barId,
      userId,
      timestamp: now
    };

    pending.push(newExchange);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));

    return {
      success: true,
      pending: true,
      exchange: newExchange
    };
  }
}

/**
 * Sauvegarder un échange actif
 */
function saveActiveExchange(exchange) {
  const active = getActiveExchanges();
  active.push(exchange);
  localStorage.setItem(ACTIVE_EXCHANGES_KEY, JSON.stringify(active));
}

/**
 * Obtenir tous les échanges actifs
 */
export function getActiveExchanges() {
  const exchanges = localStorage.getItem(ACTIVE_EXCHANGES_KEY);
  const parsed = exchanges ? JSON.parse(exchanges) : [];

  // Nettoyer les échanges expirés
  const now = Date.now();
  const valid = parsed.filter(ex => ex.endTime > now);

  if (valid.length !== parsed.length) {
    localStorage.setItem(ACTIVE_EXCHANGES_KEY, JSON.stringify(valid));
  }

  return valid;
}

/**
 * Obtenir l'échange actif pour un bar donné
 * @param {number} barId - ID du salon
 * @returns {Object|null} Échange actif ou null
 */
export function getActiveExchangeForBar(barId) {
  const active = getActiveExchanges();
  return active.find(ex => ex.bar1Id === barId || ex.bar2Id === barId) || null;
}

/**
 * Obtenir l'échange actif pour un utilisateur
 * @param {string} userId - Email de l'utilisateur
 * @returns {Object|null} Échange actif ou null
 */
export function getActiveExchangeForUser(userId) {
  const active = getActiveExchanges();
  return active.find(ex => ex.user1Id === userId || ex.user2Id === userId) || null;
}

/**
 * Annuler une demande d'échange en attente
 * @param {string} exchangeId - ID de la demande
 * @param {string} userId - Email de l'utilisateur
 */
export function cancelPendingExchange(exchangeId, userId) {
  const pending = getPendingExchanges();
  const updated = pending.filter(ex =>
    !(ex.id === exchangeId && ex.userId === userId)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Vérifier le cooldown d'échange pour un bar
 * @param {number} barId - ID du salon
 * @returns {Object} { canExchange, error }
 */
export function checkExchangeCooldown(barId) {
  const active = getActiveExchanges();
  const now = Date.now();

  // Chercher un échange récent pour ce bar
  const allExchanges = JSON.parse(localStorage.getItem(ACTIVE_EXCHANGES_KEY) || '[]');
  const recentExchanges = allExchanges.filter(ex =>
    (ex.bar1Id === barId || ex.bar2Id === barId) &&
    now - ex.startTime < EXCHANGE_COOLDOWN
  );

  if (recentExchanges.length > 0) {
    const lastExchange = recentExchanges[recentExchanges.length - 1];
    const timeLeft = EXCHANGE_COOLDOWN - (now - lastExchange.startTime);
    const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));

    return {
      canExchange: false,
      error: `Ce salon est encore en cooldown ! Attends ${hoursLeft}h avant un nouvel échange.`
    };
  }

  return { canExchange: true };
}

/**
 * Obtenir le temps restant pour un échange actif
 * @param {Object} exchange - L'échange
 * @returns {string} Temps restant formaté
 */
export function getTimeRemaining(exchange) {
  const now = Date.now();
  const remaining = exchange.endTime - now;

  if (remaining <= 0) return 'Terminé';

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

/**
 * Obtenir le nom d'un bar par son ID
 * @param {number} barId - ID du salon
 * @returns {string} Nom du salon
 */
export function getBarName(barId) {
  const barNames = {
    1: 'Piscine 🏊',
    2: 'Café de Paris ☕',
    3: 'Île des pirates 🏴‍☠️',
    4: 'Théâtre improvisé 🎭',
    5: 'Bar à cocktails 🍸'
  };
  return barNames[barId] || `Salon #${barId}`;
}

/**
 * Obtenir le nombre de demandes en attente
 * @returns {number} Nombre de demandes
 */
export function getPendingExchangeCount() {
  return getPendingExchanges().length;
}

/**
 * Vérifier si un utilisateur a une demande en attente
 * @param {string} userId - Email de l'utilisateur
 * @returns {Object|null} Demande en attente ou null
 */
export function getUserPendingExchange(userId) {
  const pending = getPendingExchanges();
  return pending.find(ex => ex.userId === userId) || null;
}
