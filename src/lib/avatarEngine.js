/**
 * Engine de calcul d'avatar typographique
 * Génère un avatar basé sur le comportement et l'écriture de l'utilisateur
 */

// Mots par ton
const WORDS = {
  discret: ['Lent', 'Rare', 'Loin', 'Calme', 'Sobre'],
  curieux: ['Ailleurs', 'Entre', 'Cherche', 'Doute', 'Veille'],
  audacieux: ['Direct', 'Franc', 'Vrai', 'Cru', 'Nu'],
  poetique: ['Brume', 'Seuil', 'Lueur', 'Encre', 'Souffle'],
  ironique: ['Presque', 'Jamais', 'Parfois', 'Évite', 'Fuit'],
  intense: ['Intense', 'Brûle', 'Dévore', 'Veille', 'Obsède']
};

// Micro-phrases par ton
const PHRASES = {
  observateur: ['Écrit peu. Observe.', 'Lit entre les lignes.', 'Préfère le silence.'],
  audacieux: ['Dit ce qu\'il pense.', 'Jamais de détour.', 'Assume le risque.'],
  poetique: ['Cherche les mots justes.', 'Prend son temps.', 'Aime les ellipses.'],
  mysterieux: ['Se révèle lentement.', 'Cache l\'essentiel.', 'Jamais évident.'],
  intense: ['Écrit tard. Beaucoup.', 'Répond toujours.', 'Ne lâche pas.']
};

// Symboles par ton
const SYMBOLS = {
  discret: '·',
  curieux: '~',
  audacieux: '*',
  poetique: '∞',
  ironique: '—',
  intense: '•'
};

/**
 * Détermine le niveau d'avatar en fonction des métriques
 */
function determineLevel(metrics) {
  if (metrics.daysSinceJoined < 4) return 'initial';
  if (metrics.daysSinceJoined < 11 || metrics.messagesCount < 8) return 'symbol';
  if (metrics.daysSinceJoined < 30 || metrics.messagesCount < 25) return 'word';
  if (metrics.consistencyScore >= 60 && metrics.vocabularyDiversity >= 0.4) return 'phrase';
  return 'word';
}

/**
 * Détecte le ton dominant de l'utilisateur
 */
export function detectTone(metrics) {
  const { avgMessageLength, avgResponseDelay, nightMessagesRatio, vocabularyDiversity, messagesCount } = metrics;

  // Discret : messages courts, réponses lentes
  if (avgMessageLength < 10 && avgResponseDelay > 12) return 'discret';

  // Audacieux : messages longs, réponses rapides
  if (avgMessageLength > 40 && avgResponseDelay < 2) return 'audacieux';

  // Poétique : vocabulaire riche, messages longs
  if (vocabularyDiversity > 0.6 && avgMessageLength > 25) return 'poetique';

  // Ironique : messages courts, vocabulaire varié
  if (avgMessageLength < 15 && vocabularyDiversity > 0.5) return 'ironique';

  // Intense : messages nocturnes, très actif
  if (nightMessagesRatio > 0.4 && messagesCount > 30) return 'intense';

  // Par défaut : Curieux
  return 'curieux';
}

/**
 * Mappe un ton vers une catégorie de phrase
 */
function mapToneToPhrase(tone) {
  const mapping = {
    discret: 'observateur',
    curieux: 'mysterieux',
    audacieux: 'audacieux',
    poetique: 'poetique',
    ironique: 'mysterieux',
    intense: 'intense'
  };
  return mapping[tone] || 'observateur';
}

/**
 * Sélectionne aléatoirement un élément dans un tableau (avec seed basé sur userId)
 */
function pickRandom(arr, seed = 0) {
  if (!arr || arr.length === 0) return '';
  return arr[seed % arr.length];
}

/**
 * Récupère le symbole pour un ton donné
 */
function getSymbolForTone(tone) {
  return SYMBOLS[tone] || '·';
}

/**
 * Récupère le contenu de l'avatar selon le niveau
 */
function getContentForLevel(level, tone, firstName, userIdHash = 0) {
  if (level === 'initial') return firstName ? firstName[0].toUpperCase() : 'A';
  if (level === 'symbol') return getSymbolForTone(tone);
  if (level === 'word') return pickRandom(WORDS[tone] || WORDS.curieux, userIdHash);
  if (level === 'phrase') return pickRandom(PHRASES[mapToneToPhrase(tone)], userIdHash);
  return '·';
}

/**
 * Récupère l'état visuel selon le niveau
 */
function getVisualState(level) {
  const states = {
    initial: {
      fontWeight: 300,
      letterSpacing: '0.05em',
      opacity: 0.6,
      fontSize: '3rem'
    },
    symbol: {
      fontWeight: 400,
      letterSpacing: '0.1em',
      opacity: 0.75,
      fontSize: '2.5rem'
    },
    word: {
      fontWeight: 500,
      letterSpacing: '0.02em',
      opacity: 0.9,
      fontSize: '1.2rem',
      fontStyle: 'italic'
    },
    phrase: {
      fontWeight: 400,
      letterSpacing: '0.01em',
      opacity: 1,
      fontSize: '0.9rem'
    }
  };
  return states[level] || states.initial;
}

/**
 * Hash simple d'un string pour générer un seed
 */
function hashString(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Calcule l'avatar typographique complet
 * @param {Object} metrics - Métriques de l'utilisateur
 * @returns {Object} Avatar typographique
 */
export function calculateAvatar(metrics) {
  const level = determineLevel(metrics);
  const tone = detectTone(metrics);
  const userIdHash = hashString(metrics.userId || metrics.name);
  const content = getContentForLevel(level, tone, metrics.firstName, userIdHash);
  const visualState = getVisualState(level);

  return {
    level,
    content,
    tone,
    visualState
  };
}

/**
 * Récupère le niveau précédent (pour affichage "soi-même")
 */
export function getPreviousLevel(level) {
  const hierarchy = ['initial', 'symbol', 'word', 'phrase'];
  const index = hierarchy.indexOf(level);
  return hierarchy[Math.max(0, index - 1)];
}

/**
 * Calcule les métriques par défaut pour un nouvel utilisateur
 */
export function getDefaultMetrics(user) {
  return {
    userId: user.id || user.name,
    firstName: user.name || 'A',
    daysSinceJoined: 0,
    messagesCount: 0,
    avgMessageLength: 0,
    avgResponseDelay: 24,
    consistencyScore: 0,
    vocabularyDiversity: 0,
    profileViewsCount: 0,
    reactionsGiven: 0,
    nightMessagesRatio: 0
  };
}
