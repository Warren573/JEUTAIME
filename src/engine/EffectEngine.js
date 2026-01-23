/**
 * EffectEngine - Moteur d'effets visuels
 *
 * Gère tous les effets temporaires de l'app de manière centralisée.
 * Les effets sont TOUJOURS non-destructifs (affichage-only).
 *
 * Mobile-first : tous les effets sont optimisés pour ne pas causer
 * de reflow, lag ou saccades sur petits écrans.
 */

// ============================================================================
// TYPES D'EFFETS SUPPORTÉS
// ============================================================================

export const EFFECT_TYPES = {
  // Avatar
  AVATAR_OVERLAY: 'avatar_overlay',         // Overlay CSS sur avatar (emoji, animation)
  AVATAR_VISIBILITY: 'avatar_visibility',   // Invisibilité avatar (opacity: 0.3)

  // Texte
  TEXT_TRANSFORM: 'text_transform',         // Texte inversé, rot13, etc.

  // Profil
  PROFILE_BADGE: 'profile_badge',           // Badge temporaire sur profil

  // Salon
  SALON_SWAP: 'salon_swap',                 // Change de salon automatiquement
  SALON_THEME_OVERRIDE: 'salon_theme_override', // Override temporaire du thème

  // Global
  SCREEN_EFFECT: 'screen_effect'            // Effet plein écran (confetti, pluie)
};

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = 'jeutaime_active_effects';

// ============================================================================
// EFFET ACTIF (structure)
// ============================================================================

/**
 * Structure d'un effet actif :
 * {
 *   id: 'effect_uuid',
 *   type: EFFECT_TYPES.xxx,
 *   targetUserId: 'user@email.com',
 *   startedAt: timestamp,
 *   expiresAt: timestamp,
 *   data: { ... } // Données spécifiques à l'effet
 * }
 */

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Active un effet pour un utilisateur
 *
 * @param {string} type - Type d'effet (EFFECT_TYPES.xxx)
 * @param {string} targetUserId - Email ou ID utilisateur
 * @param {number} duration - Durée en millisecondes (0 = instantané)
 * @param {object} data - Données spécifiques à l'effet
 * @returns {object} L'effet créé
 */
export function activateEffect(type, targetUserId, duration, data = {}) {
  const effect = {
    id: generateEffectId(),
    type,
    targetUserId,
    startedAt: Date.now(),
    expiresAt: duration > 0 ? Date.now() + duration : null,
    data
  };

  // Sauvegarder
  const effects = getActiveEffects();
  effects.push(effect);
  saveEffects(effects);

  // Auto-cleanup si durée définie
  if (duration > 0) {
    setTimeout(() => {
      deactivateEffect(effect.id);
    }, duration);
  }

  return effect;
}

/**
 * Désactive un effet
 */
export function deactivateEffect(effectId) {
  let effects = getActiveEffects();
  effects = effects.filter(e => e.id !== effectId);
  saveEffects(effects);
}

/**
 * Récupère tous les effets actifs d'un utilisateur
 */
export function getUserActiveEffects(userId) {
  const now = Date.now();
  return getActiveEffects().filter(e => {
    if (e.targetUserId !== userId) return false;
    if (e.expiresAt && e.expiresAt < now) {
      // Effet expiré, le nettoyer
      deactivateEffect(e.id);
      return false;
    }
    return true;
  });
}

/**
 * Récupère tous les effets actifs par type
 */
export function getEffectsByType(type, userId = null) {
  const effects = userId ? getUserActiveEffects(userId) : getActiveEffects();
  return effects.filter(e => e.type === type);
}

/**
 * Vérifie si un utilisateur a un effet actif
 */
export function hasActiveEffect(userId, type = null) {
  const effects = getUserActiveEffects(userId);
  if (!type) return effects.length > 0;
  return effects.some(e => e.type === type);
}

/**
 * Nettoie tous les effets expirés
 * (appelé périodiquement par l'app)
 */
export function cleanupExpiredEffects() {
  const now = Date.now();
  let effects = getActiveEffects();
  const initialCount = effects.length;

  effects = effects.filter(e => {
    if (!e.expiresAt) return true; // Effet permanent
    return e.expiresAt > now;
  });

  if (effects.length !== initialCount) {
    saveEffects(effects);
  }

  return initialCount - effects.length; // Nombre nettoyés
}

// ============================================================================
// EFFETS PRÉDÉFINIS (helpers)
// ============================================================================

/**
 * Active l'invisibilité pour un utilisateur
 */
export function activateInvisibility(userId, durationMs = 3600000) {
  return activateEffect(
    EFFECT_TYPES.AVATAR_VISIBILITY,
    userId,
    durationMs,
    { opacity: 0.3 }
  );
}

/**
 * Active un overlay avatar (emoji, animation)
 */
export function activateAvatarOverlay(userId, overlay, durationMs = 0) {
  return activateEffect(
    EFFECT_TYPES.AVATAR_OVERLAY,
    userId,
    durationMs,
    { overlay } // { emoji: '✨', animation: 'sparkle' }
  );
}

/**
 * Active un badge temporaire sur le profil
 */
export function activateProfileBadge(userId, badge, durationMs = 0) {
  return activateEffect(
    EFFECT_TYPES.PROFILE_BADGE,
    userId,
    durationMs,
    badge // { text: 'BOOST', color: '#FF9800', icon: '🚀' }
  );
}

/**
 * Active la transformation de texte (inversé, etc.)
 */
export function activateTextTransform(userId, transformType, durationMs = 0) {
  return activateEffect(
    EFFECT_TYPES.TEXT_TRANSFORM,
    userId,
    durationMs,
    { transform: transformType } // 'reverse', 'rot13', 'uppercase'
  );
}

/**
 * Override temporaire du thème d'un salon
 */
export function activateSalonThemeOverride(userId, salonId, themeData, durationMs = 0) {
  return activateEffect(
    EFFECT_TYPES.SALON_THEME_OVERRIDE,
    userId,
    durationMs,
    { salonId, theme: themeData }
  );
}

/**
 * Effet plein écran (confetti, pluie, etc.)
 */
export function activateScreenEffect(userId, effectName, durationMs = 10000) {
  return activateEffect(
    EFFECT_TYPES.SCREEN_EFFECT,
    userId,
    durationMs,
    { effect: effectName } // 'confetti', 'rain', 'hearts'
  );
}

// ============================================================================
// TRANSFORMATIONS TEXTE (affichage-only)
// ============================================================================

/**
 * Applique une transformation texte si l'utilisateur a l'effet actif
 * IMPORTANT : Ne modifie jamais les données source, juste l'affichage
 */
export function applyTextTransform(text, userId) {
  const effects = getEffectsByType(EFFECT_TYPES.TEXT_TRANSFORM, userId);
  if (effects.length === 0) return text;

  let transformed = text;
  effects.forEach(effect => {
    const { transform } = effect.data;
    switch (transform) {
      case 'reverse':
        transformed = transformed.split('').reverse().join('');
        break;
      case 'uppercase':
        transformed = transformed.toUpperCase();
        break;
      case 'rot13':
        transformed = transformed.replace(/[a-zA-Z]/g, char => {
          const code = char.charCodeAt(0);
          const base = code >= 97 ? 97 : 65;
          return String.fromCharCode(((code - base + 13) % 26) + base);
        });
        break;
      default:
        break;
    }
  });

  return transformed;
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

function getActiveEffects() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('EffectEngine: Error loading effects', e);
    return [];
  }
}

function saveEffects(effects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(effects));
  } catch (e) {
    console.error('EffectEngine: Error saving effects', e);
  }
}

function generateEffectId() {
  return `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// AUTO-CLEANUP (appelé au démarrage de l'app)
// ============================================================================

/**
 * Lance un nettoyage périodique des effets expirés
 * À appeler dans App.jsx au useEffect initial
 */
export function startAutoCleanup() {
  // Cleanup initial
  cleanupExpiredEffects();

  // Cleanup toutes les minutes
  const interval = setInterval(() => {
    cleanupExpiredEffects();
  }, 60000);

  return () => clearInterval(interval);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  EFFECT_TYPES,
  activateEffect,
  deactivateEffect,
  getUserActiveEffects,
  getEffectsByType,
  hasActiveEffect,
  cleanupExpiredEffects,
  // Helpers
  activateInvisibility,
  activateAvatarOverlay,
  activateProfileBadge,
  activateTextTransform,
  activateSalonThemeOverride,
  activateScreenEffect,
  applyTextTransform,
  startAutoCleanup
};
