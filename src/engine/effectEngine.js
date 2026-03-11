/**
 * EFFECT ENGINE
 *
 * Gère le cycle de vie des effets actifs : application, expiration, annulation.
 * Toute la logique est pilotée par les définitions des items — aucun if (item.id === ...).
 *
 * Stockage : localStorage (persistance entre navigations).
 * Cleanup automatique toutes les 60 secondes.
 */

import { getItemById, getEffectById } from './contentRegistry.js';

const STORAGE_KEY = 'jeutaime_active_effects';

// ─── TYPES D'EFFETS SUPPORTÉS ────────────────────────────────────────────────
export const EFFECT_KINDS = {
  APPLY_EFFECT: 'apply_effect',
  CANCEL_EFFECT: 'cancel_effect',
  TRANSFORM_AVATAR: 'transform_avatar',
  SPAWN_VISUAL: 'spawn_visual',
  TOGGLE_VISIBILITY: 'toggle_visibility',
  TRIGGER_ANIMATION: 'trigger_animation',
};

// ─── STORAGE ─────────────────────────────────────────────────────────────────

function loadEffects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEffects(effects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(effects));
  } catch {
    // silencieux
  }
}

// ─── CORE API ─────────────────────────────────────────────────────────────────

/**
 * Applique l'effet d'un item sur une cible.
 * L'engine lit la définition de l'item — aucune logique hardcodée.
 *
 * @param {string} itemId     - id de l'offrande ou du pouvoir
 * @param {string} senderId   - id de l'utilisateur qui envoie
 * @param {string} targetId   - id de l'utilisateur ciblé
 * @returns {{ ok: boolean, message?: string }}
 */
export function applyItemToTarget(itemId, senderId, targetId) {
  const item = getItemById(itemId);
  if (!item) return { ok: false, message: `Item inconnu : ${itemId}` };

  const { effect } = item;
  if (!effect) return { ok: true };

  switch (effect.kind) {
    case EFFECT_KINDS.APPLY_EFFECT:
      return _applyEffect(effect.effectId, targetId, senderId, itemId, effect.durationSec);

    case EFFECT_KINDS.CANCEL_EFFECT:
      return _cancelEffects(effect.cancels, targetId);

    case EFFECT_KINDS.TRANSFORM_AVATAR:
      return _applyEffect(effect.effectId, targetId, senderId, itemId, effect.durationSec);

    case EFFECT_KINDS.TOGGLE_VISIBILITY:
      return _applyEffect(effect.effectId, targetId, senderId, itemId, effect.durationSec);

    case EFFECT_KINDS.TRIGGER_ANIMATION:
      // Animation courte : durée en secondes depuis la définition
      return _applyEffect(effect.effectId, targetId, senderId, itemId, effect.durationSec || 5);

    case EFFECT_KINDS.SPAWN_VISUAL:
      return _applyEffect(effect.effectId, targetId, senderId, itemId, effect.durationSec);

    default:
      console.warn(`[EffectEngine] kind inconnu : ${effect.kind}`);
      return { ok: false, message: `Effect kind inconnu : ${effect.kind}` };
  }
}

/**
 * Retourne les effets actifs (non expirés) d'un utilisateur.
 * Chaque entrée contient : { id, effectId, targetUserId, sourceItemId, appliedAt, expiresAt, effectDef }
 *
 * @param {string} userId
 * @returns {Array}
 */
export function getUserActiveEffects(userId) {
  cleanupExpiredEffects();
  return loadEffects().filter(e => e.targetUserId === String(userId));
}

/**
 * Annule un effet spécifique sur un utilisateur.
 *
 * @param {string} targetId
 * @param {string} effectId
 */
export function cancelEffect(targetId, effectId) {
  const effects = loadEffects().filter(
    e => !(e.targetUserId === String(targetId) && e.effectId === effectId)
  );
  saveEffects(effects);
}

/**
 * Supprime tous les effets expirés.
 * Appelé automatiquement toutes les 60 secondes.
 */
export function cleanupExpiredEffects() {
  const now = Date.now();
  const active = loadEffects().filter(e => e.expiresAt > now);
  saveEffects(active);
}

// ─── HELPERS PRIVÉS ──────────────────────────────────────────────────────────

function _applyEffect(effectId, targetId, senderId, sourceItemId, durationSec) {
  if (!effectId) return { ok: false, message: 'effectId manquant' };

  const effectDef = getEffectById(effectId);
  if (!effectDef) return { ok: false, message: `Effet visuel inconnu : ${effectId}` };

  const now = Date.now();
  const durationMs = (durationSec || 60) * 1000;

  const effects = loadEffects();

  // Supprimer l'éventuel effet du même type déjà actif sur cette cible
  const filtered = effects.filter(
    e => !(e.targetUserId === String(targetId) && e.effectId === effectId)
  );

  const newEffect = {
    id: `${effectId}_${targetId}_${now}`,
    effectId,
    targetUserId: String(targetId),
    senderId: String(senderId),
    sourceItemId,
    appliedAt: now,
    expiresAt: now + durationMs,
    effectDef,   // snapshot de la définition visuelle au moment de l'application
  };

  saveEffects([...filtered, newEffect]);
  return { ok: true };
}

function _cancelEffects(effectIds = [], targetId) {
  if (!effectIds.length) return { ok: true };

  const effects = loadEffects().filter(
    e => !(e.targetUserId === String(targetId) && effectIds.includes(e.effectId))
  );
  saveEffects(effects);
  return { ok: true };
}

// ─── AUTO-CLEANUP ─────────────────────────────────────────────────────────────

let _cleanupTimer = null;

/**
 * Démarre le nettoyage automatique toutes les 60 secondes.
 * À appeler une fois au démarrage de l'app (App.jsx).
 */
export function startAutoCleanup() {
  if (_cleanupTimer) return;
  cleanupExpiredEffects(); // cleanup immédiat au démarrage
  _cleanupTimer = setInterval(cleanupExpiredEffects, 60_000);
}

/**
 * Arrête le nettoyage automatique (utile pour les tests).
 */
export function stopAutoCleanup() {
  if (_cleanupTimer) {
    clearInterval(_cleanupTimer);
    _cleanupTimer = null;
  }
}

export default {
  applyItemToTarget,
  getUserActiveEffects,
  cancelEffect,
  cleanupExpiredEffects,
  startAutoCleanup,
  stopAutoCleanup,
  EFFECT_KINDS,
};

// ─── STUBS DE COMPATIBILITÉ (ancien EffectEngine) ─────────────────────────────
// Permettent aux écrans legacy de compiler sans erreur.

export const EFFECT_TYPES = {
  AVATAR_OVERLAY: 'avatar_overlay',
  AVATAR_VISIBILITY: 'avatar_visibility',
  TEXT_TRANSFORM: 'text_transform',
  SCREEN_EFFECT: 'screen_effect',
  PROFILE_BADGE: 'profile_badge',
};

/** @deprecated Utiliser applyItemToTarget à la place */
export function activateEffect(type, userId, durationMs, data) {
  const effectDef = { renderMode: 'animated_overlay', asset: 'star', label: type };
  const entry = {
    id: `compat_${type}_${userId}_${Date.now()}`,
    effectId: type,
    targetUserId: String(userId),
    senderId: 'system',
    sourceItemId: 'compat',
    appliedAt: Date.now(),
    expiresAt: Date.now() + (durationMs || 15000),
    effectDef,
  };
  const effects = loadEffects();
  saveEffects([...effects.filter(e => !(e.targetUserId === String(userId) && e.effectId === type)), entry]);
}

/** @deprecated Utiliser cancelEffect à la place */
export function deactivateEffect(effectId) {
  const effects = loadEffects().filter(e => e.id !== effectId);
  saveEffects(effects);
}

/** @deprecated Utiliser applyItemToTarget à la place */
export function activateAvatarOverlay(userId, name, durationMs) {
  activateEffect('avatar_overlay_' + name, userId, durationMs);
}

/** @deprecated Utiliser applyItemToTarget à la place */
export function activateScreenEffect(userId, name, durationMs) {
  activateEffect('screen_' + name, userId, durationMs);
}

/** @deprecated */
export function activateInvisibility(userId, durationMs) {
  activateEffect('ghost_overlay', userId, durationMs);
}

/** @deprecated */
export function activateProfileBadge(userId, data, durationMs) {
  activateEffect('profile_badge', userId, durationMs);
}

/** @deprecated */
export function applyTextTransform(userId, transform, durationMs) {
  activateEffect('text_transform_' + transform, userId, durationMs);
}
