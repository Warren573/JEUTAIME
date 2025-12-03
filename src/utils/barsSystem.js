/**
 * Système de gestion des bars - Histoires collaboratives
 * Architecture extensible pour faciliter les ajouts futurs
 */

import { awardPoints } from './pointsSystem';
import { addCoinsToUser, updateUserStats } from './demoUsers';

// Récompenses pour participation
const REWARDS = {
  SENTENCE_ADDED: {
    points: 5,  // Points pour ajouter une phrase
    coins: 10   // Coins pour ajouter une phrase
  },
  STORY_COMPLETED: {
    points: 50,  // Bonus pour compléter une histoire (15+ phrases)
    coins: 100
  }
};

/**
 * Sauvegarder l'état d'un bar
 */
export function saveBarState(barId, state) {
  const bars = JSON.parse(localStorage.getItem('jeutaime_bars_state') || '{}');
  bars[barId] = {
    ...state,
    lastUpdated: Date.now()
  };
  localStorage.setItem('jeutaime_bars_state', JSON.stringify(bars));
}

/**
 * Charger l'état d'un bar
 */
export function loadBarState(barId) {
  const bars = JSON.parse(localStorage.getItem('jeutaime_bars_state') || '{}');
  return bars[barId] || null;
}

/**
 * Ajouter une phrase à l'histoire et récompenser l'utilisateur
 */
export function addStoryParagraph(barId, userEmail, username, text) {
  // Charger l'état du salon
  const barState = loadBarState(barId) || {
    story: [],
    currentTurnIndex: 0,
    participants: []
  };

  // Ajouter la nouvelle phrase
  const newParagraph = {
    id: barState.story.length + 1,
    user: username,
    userEmail: userEmail,
    text: text.trim(),
    timestamp: Date.now()
  };

  barState.story.push(newParagraph);

  // Sauvegarder l'état mis à jour
  saveBarState(barId, barState);

  // Récompenser l'utilisateur
  if (userEmail) {
    // Points pour la phrase ajoutée
    awardPoints(userEmail, 'SENTENCE_ADDED');
    addCoinsToUser(userEmail, REWARDS.SENTENCE_ADDED.coins);

    // Mettre à jour les stats (incrémenter participation aux salons)
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const user = users.find(u => u.email === userEmail);
    if (user) {
      const currentStats = user.stats || { messages: 0, games: 0, barParticipations: 0 };
      updateUserStats(userEmail, {
        ...currentStats,
        barParticipations: (currentStats.barParticipations || 0) + 1
      });
    }

    // Bonus si l'histoire atteint 15+ phrases
    if (barState.story.length === 15) {
      completeStory(barId, barState.story);
    }
  }

  return newParagraph;
}

/**
 * Compléter une histoire et récompenser tous les participants
 */
export function completeStory(barId, story) {
  // Sauvegarder dans l'historique
  const history = JSON.parse(localStorage.getItem('jeutaime_bars_history') || '[]');

  const completedStory = {
    id: Date.now(),
    barId: barId,
    story: story,
    completedAt: Date.now(),
    participantsCount: new Set(story.map(s => s.userEmail)).size
  };

  history.unshift(completedStory); // Ajouter au début

  // Garder seulement les 50 dernières histoires
  if (history.length > 50) {
    history.splice(50);
  }

  localStorage.setItem('jeutaime_bars_history', JSON.stringify(history));

  // Récompenser tous les participants
  const participants = new Set(story.map(s => s.userEmail).filter(Boolean));
  participants.forEach(userEmail => {
    awardPoints(userEmail, 'STORY_COMPLETED');
    addCoinsToUser(userEmail, REWARDS.STORY_COMPLETED.coins);
  });

  // Réinitialiser l'histoire du salon
  const barState = loadBarState(barId);
  if (barState) {
    barState.story = [];
    saveBarState(barId, barState);
  }

  return completedStory;
}

/**
 * Récupérer l'historique des histoires complétées
 */
export function getStoriesHistory(limit = 10) {
  const history = JSON.parse(localStorage.getItem('jeutaime_bars_history') || '[]');
  return history.slice(0, limit);
}

/**
 * Récupérer les histoires auxquelles l'utilisateur a participé
 */
export function getUserStories(userEmail) {
  const history = JSON.parse(localStorage.getItem('jeutaime_bars_history') || '[]');
  return history.filter(story =>
    story.story.some(paragraph => paragraph.userEmail === userEmail)
  );
}

/**
 * Sauvegarder un message de chat dans un bar
 */
export function saveBarMessage(barId, userEmail, username, text, isSystem = false, giftData = null) {
  const messages = JSON.parse(localStorage.getItem(`jeutaime_bar_${barId}_messages`) || '[]');

  const newMessage = {
    id: Date.now(),
    username: username,
    userEmail: userEmail,
    text: text,
    timestamp: Date.now(),
    isSystem: isSystem,
    giftData: giftData
  };

  messages.push(newMessage);

  // Garder seulement les 100 derniers messages
  if (messages.length > 100) {
    messages.splice(0, messages.length - 100);
  }

  localStorage.setItem(`jeutaime_bar_${barId}_messages`, JSON.stringify(messages));

  return newMessage;
}

/**
 * Charger les messages d'un bar
 */
export function loadBarMessages(barId) {
  return JSON.parse(localStorage.getItem(`jeutaime_bar_${barId}_messages`) || '[]');
}

/**
 * Mettre à jour le tour actuel dans un bar
 */
export function updateBarTurn(barId, currentTurnIndex, members) {
  const barState = loadBarState(barId) || { story: [] };
  barState.currentTurnIndex = currentTurnIndex;
  barState.members = members;
  saveBarState(barId, barState);
}

/**
 * Obtenir les statistiques d'un utilisateur dans les bars
 */
export function getUserBarStats(userEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const user = users.find(u => u.email === userEmail);

  const userStories = getUserStories(userEmail);
  const totalParagraphs = userStories.reduce((sum, story) => {
    return sum + story.story.filter(p => p.userEmail === userEmail).length;
  }, 0);

  return {
    storiesCompleted: userStories.length,
    totalParagraphs: totalParagraphs,
    barParticipations: user?.stats?.barParticipations || 0
  };
}
