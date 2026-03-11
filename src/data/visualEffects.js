/**
 * CATALOGUE DES EFFETS VISUELS
 *
 * Pour ajouter un nouvel effet visuel : ajouter un objet dans ce tableau.
 * L'engine le lira automatiquement — aucune autre modification nécessaire.
 *
 * renderMode :
 *   - "emoji_above_avatar"  → affiche un emoji flottant au-dessus de l'avatar
 *   - "particle_overlay"    → animation de particules autour de l'avatar
 *   - "animated_overlay"    → overlay CSS animé sur l'avatar
 *   - "avatar_transform"    → remplace visuellement l'avatar par un emoji géant
 */

export const visualEffects = [
  // ── TRANSFORMATIONS ───────────────────────────────────────────────
  {
    id: 'frog_transform',
    type: 'visual_effect',
    label: 'Grenouille',
    renderMode: 'avatar_transform',
    asset: '🐸',
  },
  {
    id: 'black_cat_transform',
    type: 'visual_effect',
    label: 'Chat Noir',
    renderMode: 'avatar_transform',
    asset: '🐱',
  },
  {
    id: 'unicorn_transform',
    type: 'visual_effect',
    label: 'Licorne',
    renderMode: 'avatar_transform',
    asset: '🦄',
  },
  {
    id: 'ghost_overlay',
    type: 'visual_effect',
    label: 'Fantôme',
    renderMode: 'animated_overlay',
    asset: 'ghost',   // clé CSS dans AvatarEffectsLayer
  },

  // ── EMOJI AU-DESSUS DE L'AVATAR ───────────────────────────────────
  {
    id: 'vomito_emoji',
    type: 'visual_effect',
    label: 'Emoji Vomito',
    renderMode: 'emoji_above_avatar',
    asset: '🤮',
  },
  {
    id: 'skull_above',
    type: 'visual_effect',
    label: 'Tête de Mort',
    renderMode: 'emoji_above_avatar',
    asset: '💀',
  },
  {
    id: 'heart_float',
    type: 'visual_effect',
    label: 'Cœurs Flottants',
    renderMode: 'emoji_above_avatar',
    asset: '❤️',
  },
  {
    id: 'cupid_arrow',
    type: 'visual_effect',
    label: 'Flèche Cupidon',
    renderMode: 'emoji_above_avatar',
    asset: '💘',
  },
  {
    id: 'devil_horns_overlay',
    type: 'visual_effect',
    label: 'Cornes du Diable',
    renderMode: 'emoji_above_avatar',
    asset: '😈',
  },

  // ── PARTICULES ────────────────────────────────────────────────────
  {
    id: 'confetti_overlay',
    type: 'visual_effect',
    label: 'Confettis',
    renderMode: 'particle_overlay',
    asset: 'confetti',
  },
  {
    id: 'bubble_overlay',
    type: 'visual_effect',
    label: 'Bulles',
    renderMode: 'particle_overlay',
    asset: 'bubble',
  },
  {
    id: 'rain_cloud',
    type: 'visual_effect',
    label: 'Nuage de Pluie',
    renderMode: 'particle_overlay',
    asset: 'rain',
  },

  // ── OVERLAY ANIMÉ ─────────────────────────────────────────────────
  {
    id: 'thunder_overlay',
    type: 'visual_effect',
    label: 'Foudre',
    renderMode: 'animated_overlay',
    asset: 'thunder',
  },
  {
    id: 'star_aura',
    type: 'visual_effect',
    label: 'Aura Étoilée',
    renderMode: 'animated_overlay',
    asset: 'star',
  },
  {
    id: 'fire_aura',
    type: 'visual_effect',
    label: 'Aura de Feu',
    renderMode: 'animated_overlay',
    asset: 'fire',
  },
  {
    id: 'guitar_smash',
    type: 'visual_effect',
    label: 'Guitar Smash',
    renderMode: 'animated_overlay',
    asset: 'guitar',
  },
];
