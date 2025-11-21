// Système de collaborations éphémères entre bars
const COLLABORATIONS_KEY = 'jeutaime_bar_collaborations';
const COLLABORATION_DURATION = 48 * 60 * 60 * 1000; // 48 heures en millisecondes

/**
 * Obtenir toutes les collaborations actives
 */
export function getActiveCollaborations() {
  const collaborations = JSON.parse(localStorage.getItem(COLLABORATIONS_KEY) || '[]');
  const now = Date.now();

  // Filtrer les collaborations expirées
  const activeCollaborations = collaborations.filter(collab => collab.endTime > now);

  // Mettre à jour le localStorage si des collaborations ont expiré
  if (activeCollaborations.length !== collaborations.length) {
    localStorage.setItem(COLLABORATIONS_KEY, JSON.stringify(activeCollaborations));
  }

  return activeCollaborations;
}

/**
 * Vérifier si un bar est actuellement en collaboration
 */
export function isBarInCollaboration(barId) {
  const collaborations = getActiveCollaborations();
  return collaborations.find(c => c.bar1Id === barId || c.bar2Id === barId);
}

/**
 * Créer une nouvelle collaboration entre deux bars
 */
export function createCollaboration(bar1, bar2, specialEvent = null) {
  const collaborations = getActiveCollaborations();

  // Vérifier que les bars ne sont pas déjà en collaboration
  const bar1InCollab = collaborations.find(c => c.bar1Id === bar1.id || c.bar2Id === bar1.id);
  const bar2InCollab = collaborations.find(c => c.bar1Id === bar2.id || c.bar2Id === bar2.id);

  if (bar1InCollab || bar2InCollab) {
    return { success: false, message: 'Un des bars est déjà en collaboration' };
  }

  const now = Date.now();
  const endTime = now + COLLABORATION_DURATION;

  const newCollaboration = {
    id: `collab_${now}_${Math.random().toString(36).substr(2, 9)}`,
    bar1Id: bar1.id,
    bar2Id: bar2.id,
    bar1Name: bar1.name,
    bar2Name: bar2.name,
    bar1Icon: bar1.icon,
    bar2Icon: bar2.icon,
    startTime: now,
    endTime: endTime,
    specialEvent: specialEvent || generateRandomEvent(),
    participants: [],
    sharedMessages: [],
    rewards: {
      totalPoints: 0,
      participantCount: 0
    }
  };

  collaborations.push(newCollaboration);
  localStorage.setItem(COLLABORATIONS_KEY, JSON.stringify(collaborations));

  return { success: true, collaboration: newCollaboration };
}

/**
 * Générer un événement aléatoire pour la collaboration
 */
function generateRandomEvent() {
  const events = [
    {
      name: 'Festival Tropical',
      emoji: '🌴',
      description: 'Ambiance tropicale avec cocktails et musique!',
      bonus: 'Double points sur les interactions',
      bgGradient: 'linear-gradient(135deg, #FFD93D, #FF6B9D)'
    },
    {
      name: 'Soirée Casino',
      emoji: '🎰',
      description: 'Tentez votre chance aux jeux de hasard!',
      bonus: '+50% de chances de gagner aux jeux',
      bgGradient: 'linear-gradient(135deg, #FFD700, #8B0000)'
    },
    {
      name: 'Nuit des Étoiles',
      emoji: '⭐',
      description: 'Observation des étoiles et romantisme',
      bonus: 'Débloquer photos premium temporairement',
      bgGradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      name: 'Battle Musicale',
      emoji: '🎵',
      description: 'Compétition musicale entre les deux bars',
      bonus: 'Badges exclusifs pour les gagnants',
      bgGradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
    },
    {
      name: 'Tournoi Sportif',
      emoji: '🏆',
      description: 'Compétition amicale avec mini-jeux',
      bonus: 'Trophées et récompenses spéciales',
      bgGradient: 'linear-gradient(135deg, #4CAF50, #2196F3)'
    },
    {
      name: 'Carnaval Masqué',
      emoji: '🎭',
      description: 'Mystère et déguisements pour tout le monde',
      bonus: 'Avatars masqués avec indices progressifs',
      bgGradient: 'linear-gradient(135deg, #CE93D8, #FFA726)'
    }
  ];

  return events[Math.floor(Math.random() * events.length)];
}

/**
 * Rejoindre une collaboration
 */
export function joinCollaboration(collaborationId, userId) {
  const collaborations = getActiveCollaborations();
  const collaboration = collaborations.find(c => c.id === collaborationId);

  if (!collaboration) {
    return { success: false, message: 'Collaboration non trouvée' };
  }

  // Vérifier si l'utilisateur a déjà rejoint
  if (collaboration.participants.includes(userId)) {
    return { success: false, message: 'Déjà participant' };
  }

  collaboration.participants.push(userId);
  collaboration.rewards.participantCount = collaboration.participants.length;

  localStorage.setItem(COLLABORATIONS_KEY, JSON.stringify(collaborations));

  return { success: true, collaboration };
}

/**
 * Obtenir les messages partagés d'une collaboration
 */
export function getCollaborationMessages(collaborationId) {
  const collaborations = getActiveCollaborations();
  const collaboration = collaborations.find(c => c.id === collaborationId);

  return collaboration?.sharedMessages || [];
}

/**
 * Ajouter un message dans la collaboration
 */
export function addCollaborationMessage(collaborationId, message) {
  const collaborations = getActiveCollaborations();
  const collaboration = collaborations.find(c => c.id === collaborationId);

  if (!collaboration) {
    return { success: false };
  }

  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: message.userId,
    userName: message.userName,
    barId: message.barId,
    text: message.text,
    timestamp: Date.now()
  };

  collaboration.sharedMessages.push(newMessage);
  collaboration.rewards.totalPoints += 1; // Points pour l'activité

  localStorage.setItem(COLLABORATIONS_KEY, JSON.stringify(collaborations));

  return { success: true, message: newMessage };
}

/**
 * Terminer une collaboration manuellement
 */
export function endCollaboration(collaborationId) {
  const collaborations = getActiveCollaborations();
  const filtered = collaborations.filter(c => c.id !== collaborationId);

  localStorage.setItem(COLLABORATIONS_KEY, JSON.stringify(filtered));

  return { success: true };
}

/**
 * Obtenir le temps restant pour une collaboration (en format lisible)
 */
export function getTimeRemaining(endTime) {
  const now = Date.now();
  const remaining = endTime - now;

  if (remaining <= 0) {
    return 'Terminée';
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}j ${hours % 24}h`;
  }

  return `${hours}h ${minutes}min`;
}

/**
 * Obtenir toutes les collaborations possibles (suggestions)
 */
export function getCollaborationSuggestions(bars) {
  const activeCollabs = getActiveCollaborations();
  const barsInCollab = new Set();

  activeCollabs.forEach(c => {
    barsInCollab.add(c.bar1Id);
    barsInCollab.add(c.bar2Id);
  });

  // Bars disponibles pour collaboration
  const availableBars = bars.filter(bar => !barsInCollab.has(bar.id));

  // Créer des paires de suggestions
  const suggestions = [];
  for (let i = 0; i < availableBars.length - 1; i++) {
    for (let j = i + 1; j < availableBars.length; j++) {
      suggestions.push({
        bar1: availableBars[i],
        bar2: availableBars[j],
        suggestedEvent: generateRandomEvent()
      });
    }
  }

  return suggestions;
}

/**
 * Récompenser les participants d'une collaboration terminée
 */
export function distributeCollaborationRewards(collaboration) {
  const pointsPerParticipant = Math.floor(50 + collaboration.rewards.totalPoints * 2);

  return {
    points: pointsPerParticipant,
    badge: collaboration.rewards.participantCount > 10 ? 'collaboration_master' : 'collaboration_participant',
    message: `🎉 Collaboration terminée! Tu as gagné ${pointsPerParticipant} points!`
  };
}
