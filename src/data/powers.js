/**
 * CATALOGUE DES POUVOIRS
 *
 * Pour ajouter un nouveau pouvoir : ajouter un objet dans ce tableau.
 * Aucune autre modification de code nécessaire.
 *
 * effect.kind :
 *   - "transform_avatar"   → transforme visuellement l'avatar (emoji géant dessus)
 *   - "spawn_visual"       → déclenche un effet visuel ponctuel
 *   - "toggle_visibility"  → rend l'avatar invisible temporairement
 *   - "trigger_animation"  → joue une animation courte (non persistante)
 *   - "cancel_effect"      → annule un effet actif sur la cible
 */

export const powers = [
  // ── TRANSFORMATIONS ───────────────────────────────────────────────
  {
    id: 'frog_transform',
    type: 'power',
    category: 'transformation',
    label: 'Transformer en grenouille',
    emoji: '🐸',
    salonTags: ['global'],
    priceCoins: 120,
    effect: {
      kind: 'transform_avatar',
      transformId: 'frog',
      effectId: 'frog_transform',
      durationSec: 3600,
    },
    cancelBy: ['kiss'],
    salonMessage: '{sender} transforme {target} en grenouille 🐸',
  },
  {
    id: 'black_cat_transform',
    type: 'power',
    category: 'transformation',
    label: 'Transformer en chat noir',
    emoji: '🐱',
    salonTags: ['global', 'metal'],
    priceCoins: 130,
    effect: {
      kind: 'transform_avatar',
      transformId: 'black_cat',
      effectId: 'black_cat_transform',
      durationSec: 3600,
    },
    salonMessage: '{sender} transforme {target} en chat noir 🐱',
  },
  {
    id: 'unicorn_transform',
    type: 'power',
    category: 'transformation',
    label: 'Transformer en licorne',
    emoji: '🦄',
    salonTags: ['global'],
    priceCoins: 150,
    effect: {
      kind: 'transform_avatar',
      transformId: 'unicorn',
      effectId: 'unicorn_transform',
      durationSec: 3600,
    },
    salonMessage: '{sender} transforme {target} en licorne ✨🦄',
  },
  {
    id: 'ghost_transform',
    type: 'power',
    category: 'transformation',
    label: 'Transformer en fantôme',
    emoji: '👻',
    salonTags: ['global'],
    priceCoins: 100,
    effect: {
      kind: 'toggle_visibility',
      effectId: 'ghost_overlay',
      durationSec: 1800,
    },
    salonMessage: '{sender} transforme {target} en fantôme 👻',
  },

  // ── METAL EXCLUSIF ────────────────────────────────────────────────
  {
    id: 'rock_attitude',
    type: 'power',
    category: 'metal',
    label: 'Rock Attitude',
    emoji: '🎸',
    salonTags: ['global', 'metal'],
    priceCoins: 110,
    effect: {
      kind: 'trigger_animation',
      effectId: 'guitar_smash',
      durationSec: 8,
    },
    salonMessage: '{sender} donne la ROCK ATTITUDE à {target} 🎸💥',
  },

  // ── CONTRE-SORTS ──────────────────────────────────────────────────
  {
    id: 'kiss',
    type: 'power',
    category: 'counter',
    label: 'Bisou magique',
    emoji: '💋',
    salonTags: ['global'],
    priceCoins: 80,
    effect: {
      kind: 'cancel_effect',
      cancels: ['frog_transform', 'black_cat_transform', 'vomito_emoji'],
    },
    salonMessage: '{sender} envoie un bisou magique à {target} 💋 Le sortilège est brisé !',
  },

  // ── DIVERS ────────────────────────────────────────────────────────
  {
    id: 'star_aura',
    type: 'power',
    category: 'aura',
    label: 'Aura de Star',
    emoji: '⭐',
    salonTags: ['global'],
    priceCoins: 90,
    effect: {
      kind: 'apply_effect',
      effectId: 'star_aura',
      durationSec: 1800,
    },
    salonMessage: '{sender} donne une aura de star à {target} ⭐',
  },
  {
    id: 'fire_power',
    type: 'power',
    category: 'aura',
    label: 'Aura de Feu',
    emoji: '🔥',
    salonTags: ['global', 'metal'],
    priceCoins: 95,
    effect: {
      kind: 'apply_effect',
      effectId: 'fire_aura',
      durationSec: 900,
    },
    salonMessage: '{sender} enflamme {target} 🔥',
  },
];
