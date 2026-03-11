/**
 * CATALOGUE DES OFFRANDES
 *
 * Pour ajouter une nouvelle offrande : ajouter un objet dans ce tableau.
 * Aucune autre modification de code nécessaire.
 *
 * effect.kind :
 *   - "apply_effect"  → applique un effet visuel sur la cible
 *   - "cancel_effect" → annule un effet actif sur la cible
 */

export const offerings = [
  // ── BOISSONS ────────────────────────────────────────────────────
  {
    id: 'coffee',
    type: 'offering',
    category: 'drink',
    label: 'Café',
    emoji: '☕',
    salonTags: ['global'],
    priceCoins: 20,
    effect: { kind: 'cancel_effect', cancels: ['vomito_emoji'] },
    salonMessage: '{sender} offre un café à {target} ☕ (ça remet les idées en place)',
  },
  {
    id: 'cocktail_vomito',
    type: 'offering',
    category: 'funny_drink',
    label: 'Cocktail Vomito',
    emoji: '🤮',
    salonTags: ['global'],
    priceCoins: 60,
    effect: { kind: 'apply_effect', effectId: 'vomito_emoji', durationSec: 3600 },
    salonMessage: '{target} boit un Cocktail Vomito… mauvaise idée 🤮',
  },
  {
    id: 'champagne',
    type: 'offering',
    category: 'drink',
    label: 'Champagne',
    emoji: '🥂',
    salonTags: ['global'],
    priceCoins: 80,
    effect: { kind: 'apply_effect', effectId: 'bubble_overlay', durationSec: 120 },
    salonMessage: '{sender} offre du champagne à {target} 🥂 Tchin !',
  },
  {
    id: 'poison_apple',
    type: 'offering',
    category: 'funny_drink',
    label: 'Pomme Empoisonnée',
    emoji: '🍎',
    salonTags: ['global'],
    priceCoins: 90,
    effect: { kind: 'apply_effect', effectId: 'skull_above', durationSec: 1800 },
    salonMessage: '{sender} offre une pomme à {target} 🍎… elle avait l\'air suspecte',
  },

  // ── ROMANTIQUE ───────────────────────────────────────────────────
  {
    id: 'rose',
    type: 'offering',
    category: 'romantic',
    label: 'Rose',
    emoji: '🌹',
    salonTags: ['global'],
    priceCoins: 30,
    effect: { kind: 'apply_effect', effectId: 'heart_float', durationSec: 600 },
    salonMessage: '{sender} offre une rose à {target} 🌹',
  },
  {
    id: 'heart_arrow',
    type: 'offering',
    category: 'romantic',
    label: 'Flèche de Cupidon',
    emoji: '💘',
    salonTags: ['global'],
    priceCoins: 50,
    effect: { kind: 'apply_effect', effectId: 'cupid_arrow', durationSec: 900 },
    salonMessage: 'Cupidon frappe {target} grâce à {sender} 💘',
  },

  // ── AMBIANCE ─────────────────────────────────────────────────────
  {
    id: 'confetti',
    type: 'offering',
    category: 'ambiance',
    label: 'Confettis',
    emoji: '🎊',
    salonTags: ['global'],
    priceCoins: 40,
    effect: { kind: 'apply_effect', effectId: 'confetti_overlay', durationSec: 30 },
    salonMessage: '{sender} lance des confettis sur {target} 🎊',
  },
  {
    id: 'thunder',
    type: 'offering',
    category: 'ambiance',
    label: 'Foudre',
    emoji: '⚡',
    salonTags: ['global'],
    priceCoins: 70,
    effect: { kind: 'apply_effect', effectId: 'thunder_overlay', durationSec: 300 },
    salonMessage: '{sender} foudroie {target} ⚡ POW !',
  },
  {
    id: 'rain_cloud',
    type: 'offering',
    category: 'weather',
    label: 'Nuage de Pluie',
    emoji: '🌧️',
    salonTags: ['global'],
    priceCoins: 55,
    effect: { kind: 'apply_effect', effectId: 'rain_cloud', durationSec: 600 },
    salonMessage: 'Un nuage suit {target} partout… merci {sender} 🌧️',
  },

  // ── SPÉCIAUX METAL ───────────────────────────────────────────────
  {
    id: 'devil_horns',
    type: 'offering',
    category: 'metal',
    label: 'Cornes du Diable',
    emoji: '🤘',
    salonTags: ['global', 'metal'],
    priceCoins: 100,
    effect: { kind: 'apply_effect', effectId: 'devil_horns_overlay', durationSec: 1800 },
    salonMessage: '{sender} donne les cornes du diable à {target} 🤘 MÉTAL !',
  },
];
