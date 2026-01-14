/**
 * AVATAR ENGINE
 *
 * Moteur de gestion du state des avatars.
 * Permet de modifier l'identité, les extensions, l'évolution, etc.
 *
 * AUCUNE LOGIQUE VISUELLE - Seulement de la gestion de données.
 */

import { DEFAULT_EXTENSIONS } from './avatar.extensions.types.js';
import { DEFAULT_EVOLUTION, DEFAULT_EFFECTS } from './avatar.types.js';

/**
 * Met à jour l'identité visuelle de l'avatar
 * @param {Object} avatarState - État actuel de l'avatar
 * @param {Partial<Object>} identityChanges - Modifications à appliquer
 * @returns {Object} Nouvel état de l'avatar
 */
export function updateIdentity(avatarState, identityChanges) {
  return {
    ...avatarState,
    identity: {
      ...avatarState.identity,
      ...identityChanges
    },
    lastUpdate: Date.now()
  };
}

/**
 * Met à jour les extensions de l'avatar
 * @param {Object} avatarState - État actuel de l'avatar
 * @param {Partial<Object>} extensionChanges - Modifications à appliquer
 * @returns {Object} Nouvel état de l'avatar
 */
export function updateExtensions(avatarState, extensionChanges) {
  return {
    ...avatarState,
    extensions: {
      ...avatarState.extensions,
      ...extensionChanges
    },
    lastUpdate: Date.now()
  };
}

/**
 * Met à jour l'évolution de l'avatar
 * @param {Object} avatarState - État actuel de l'avatar
 * @param {Partial<Object>} evolutionChanges - Modifications à appliquer
 * @returns {Object} Nouvel état de l'avatar
 */
export function updateEvolution(avatarState, evolutionChanges) {
  return {
    ...avatarState,
    evolution: {
      ...avatarState.evolution,
      ...evolutionChanges
    },
    lastUpdate: Date.now()
  };
}

/**
 * Met à jour les effets visuels de l'avatar
 * @param {Object} avatarState - État actuel de l'avatar
 * @param {Partial<Object>} effectsChanges - Modifications à appliquer
 * @returns {Object} Nouvel état de l'avatar
 */
export function updateEffects(avatarState, effectsChanges) {
  return {
    ...avatarState,
    effects: {
      ...avatarState.effects,
      ...effectsChanges
    },
    lastUpdate: Date.now()
  };
}

/**
 * Réinitialise l'avatar à son état par défaut
 * @param {Object} avatarState - État actuel de l'avatar
 * @returns {Object} Nouvel état de l'avatar
 */
export function resetAvatar(avatarState) {
  return {
    ...avatarState,
    evolution: { ...DEFAULT_EVOLUTION },
    effects: { ...DEFAULT_EFFECTS },
    extensions: { ...DEFAULT_EXTENSIONS },
    transformation: null,
    lastUpdate: Date.now()
  };
}

/**
 * Applique une transformation complète à l'avatar
 * @param {Object} avatarState - État actuel de l'avatar
 * @param {Object} transformation - Données de transformation
 * @returns {Object} Nouvel état de l'avatar
 */
export function applyTransformation(avatarState, transformation) {
  return {
    ...avatarState,
    transformation,
    lastUpdate: Date.now()
  };
}

/**
 * Retire la transformation en cours
 * @param {Object} avatarState - État actuel de l'avatar
 * @returns {Object} Nouvel état de l'avatar
 */
export function removeTransformation(avatarState) {
  return {
    ...avatarState,
    transformation: null,
    lastUpdate: Date.now()
  };
}
