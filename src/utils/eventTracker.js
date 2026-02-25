/**
 * Système de tracking des événements pour le Journal
 * Permet d'enregistrer les actions des utilisateurs et les événements globaux
 */

/**
 * Ajoute un événement personnel pour un utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} type - Type d'événement (points, smile, message, game, badge, etc.)
 * @param {string} message - Message descriptif de l'événement
 * @param {number} points - Nombre de points associés (optionnel)
 */
export function trackPersonalEvent(userEmail, type, message, points = null) {
  if (!userEmail) return;

  const event = {
    type,
    message,
    points,
    timestamp: new Date().toISOString()
  };

  // Récupérer les événements existants
  const storageKey = `jeutaime_events_${userEmail}`;
  const events = JSON.parse(localStorage.getItem(storageKey) || '[]');

  // Ajouter le nouvel événement
  events.unshift(event);

  // Garder seulement les 50 derniers événements
  const trimmedEvents = events.slice(0, 50);

  // Sauvegarder
  localStorage.setItem(storageKey, JSON.stringify(trimmedEvents));

  console.log('📝 Événement personnel enregistré:', event);
}

/**
 * Ajoute un événement global visible par toute la communauté
 * @param {string} type - Type d'événement (couple, new_member, record, achievement, event)
 * @param {string} message - Message descriptif de l'événement
 */
export function trackGlobalEvent(type, message) {
  const event = {
    type,
    message,
    timestamp: new Date().toISOString()
  };

  // Récupérer les événements existants
  const events = JSON.parse(localStorage.getItem('jeutaime_global_events') || '[]');

  // Ajouter le nouvel événement
  events.unshift(event);

  // Garder seulement les 100 derniers événements globaux
  const trimmedEvents = events.slice(0, 100);

  // Sauvegarder
  localStorage.setItem('jeutaime_global_events', JSON.stringify(trimmedEvents));

  console.log('🌍 Événement global enregistré:', event);
}

/**
 * Fonctions helper pour les événements courants
 */

// Points gagnés
export function trackPointsEarned(userEmail, points, reason) {
  trackPersonalEvent(userEmail, 'points', `Tu as gagné ${points} points ${reason}`, points);
}

// Sourire envoyé
export function trackSmileSent(userEmail, targetName) {
  trackPersonalEvent(userEmail, 'smile', `Tu as envoyé un sourire à ${targetName}`);
}

// Message envoyé
export function trackMessageSent(userEmail, targetName) {
  trackPersonalEvent(userEmail, 'message', `Tu as envoyé un message à ${targetName}`);
}

// Jeu joué
export function trackGamePlayed(userEmail, gameName, score, points = null) {
  const message = points
    ? `Tu as joué à ${gameName} et gagné ${score} points`
    : `Tu as joué à ${gameName} (score: ${score})`;
  trackPersonalEvent(userEmail, 'game', message, points);
}

// Badge débloqué
export function trackBadgeUnlocked(userEmail, badgeName, points = null) {
  trackPersonalEvent(userEmail, 'badge', `Tu as débloqué le badge "${badgeName}" !`, points);
}

// Salon rejoint
export function trackSalonJoined(userEmail, salonName) {
  trackPersonalEvent(userEmail, 'salon', `Tu as rejoint le salon "${salonName}"`);
}

// Lettre envoyée
export function trackLetterSent(userEmail, targetName) {
  trackPersonalEvent(userEmail, 'letter', `Tu as envoyé une lettre à ${targetName}`);
}

// Connexion
export function trackLogin(userEmail, userName) {
  trackPersonalEvent(userEmail, 'login', `Bon retour ${userName} !`);
}

// Profil mis à jour
export function trackProfileUpdated(userEmail) {
  trackPersonalEvent(userEmail, 'profile', 'Tu as mis à jour ton profil');
}

// Match
export function trackMatch(userEmail, targetName) {
  trackPersonalEvent(userEmail, 'match', `💕 C'est un match avec ${targetName} !`);
}

// Photo débloquée
export function trackPhotoUnlocked(userEmail, targetName) {
  trackPersonalEvent(userEmail, 'photo', `Tu as débloqué la photo de ${targetName}`);
}

/**
 * Fonctions helper pour les événements globaux
 */

// Nouveau couple
export function trackNewCouple(user1Name, user2Name) {
  trackGlobalEvent('couple', `💑 ${user1Name} et ${user2Name} forment un nouveau couple !`);
}

// Nouveau membre
export function trackNewMember(userName) {
  trackGlobalEvent('new_member', `🎉 ${userName} vient de rejoindre JeuTaime !`);
}

// Record battu
export function trackRecordBroken(userName, recordType, value) {
  trackGlobalEvent('record', `🔥 ${userName} a battu le record de ${recordType} avec ${value} !`);
}

// Achievement communautaire
export function trackCommunityAchievement(achievement) {
  trackGlobalEvent('achievement', `🌟 ${achievement}`);
}

// Événement spécial
export function trackSpecialEvent(message) {
  trackGlobalEvent('event', `🎊 ${message}`);
}

/**
 * Nettoie les anciens événements (à appeler périodiquement)
 */
export function cleanOldEvents() {
  // Nettoyer les événements de plus de 30 jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Nettoyer les événements globaux
  const globalEvents = JSON.parse(localStorage.getItem('jeutaime_global_events') || '[]');
  const recentGlobalEvents = globalEvents.filter(event =>
    new Date(event.timestamp) > thirtyDaysAgo
  );
  localStorage.setItem('jeutaime_global_events', JSON.stringify(recentGlobalEvents));

  // Nettoyer les événements personnels
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('jeutaime_events_')) {
      const events = JSON.parse(localStorage.getItem(key) || '[]');
      const recentEvents = events.filter(event =>
        new Date(event.timestamp) > thirtyDaysAgo
      );
      localStorage.setItem(key, JSON.stringify(recentEvents));
    }
  });

  console.log('🧹 Anciens événements nettoyés');
}

/**
 * Initialise quelques événements de démo
 */
export function initDemoEvents(userEmail) {
  if (!userEmail) return;

  // Vérifier si des événements existent déjà
  const existingEvents = JSON.parse(localStorage.getItem(`jeutaime_events_${userEmail}`) || '[]');
  if (existingEvents.length > 0) return; // Ne pas créer de démo si des événements existent

  // Créer quelques événements de démo
  const now = new Date();
  const events = [
    {
      type: 'login',
      message: 'Bienvenue sur JeuTaime !',
      points: null,
      timestamp: now.toISOString()
    },
    {
      type: 'points',
      message: 'Tu as gagné 50 points pour ta première connexion',
      points: 50,
      timestamp: new Date(now.getTime() - 5 * 60000).toISOString() // Il y a 5 min
    }
  ];

  localStorage.setItem(`jeutaime_events_${userEmail}`, JSON.stringify(events));

  // Événements globaux de démo
  const existingGlobalEvents = JSON.parse(localStorage.getItem('jeutaime_global_events') || '[]');
  if (existingGlobalEvents.length === 0) {
    const globalEvents = [
      {
        type: 'new_member',
        message: '🎉 5 nouveaux membres ont rejoint JeuTaime aujourd\'hui !',
        timestamp: new Date(now.getTime() - 2 * 3600000).toISOString() // Il y a 2h
      },
      {
        type: 'couple',
        message: '💑 Marie et Thomas forment un nouveau couple !',
        timestamp: new Date(now.getTime() - 5 * 3600000).toISOString() // Il y a 5h
      },
      {
        type: 'record',
        message: '🔥 Sophie a battu le record de points en une journée avec 850 points !',
        timestamp: new Date(now.getTime() - 24 * 3600000).toISOString() // Il y a 1 jour
      }
    ];

    localStorage.setItem('jeutaime_global_events', JSON.stringify(globalEvents));
  }

  console.log('📝 Événements de démo initialisés');
}
