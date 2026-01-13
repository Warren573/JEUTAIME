/**
 * Générateur d'avatars graphiques
 * Génération reproductible basée sur seed (userId)
 */

import {
  FACE_SHAPES, EYE_TYPES, MOUTH_TYPES, EYEBROW_TYPES, HAIR_TYPES,
  SKIN_TONES, HAIR_COLORS, EYE_COLORS, ACCESSORY_TYPES
} from '../../types/avatar';

/**
 * Générateur de nombres aléatoires avec seed
 */
function createSeededRandom(seed) {
  let value = 0;
  for (let i = 0; i < seed.length; i++) {
    value = ((value << 5) - value) + seed.charCodeAt(i);
    value = value & value;
  }

  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Sélection aléatoire dans un tableau avec seed
 */
function pickRandom(array, rng) {
  return array[Math.floor(rng() * array.length)];
}

/**
 * Génère un avatar complet basé sur userId
 */
export function generateAvatar(userId) {
  const rng = createSeededRandom(userId || 'default');

  return {
    seed: userId,
    faceShape: pickRandom(FACE_SHAPES, rng),
    eyeType: pickRandom(EYE_TYPES, rng),
    mouthType: pickRandom(MOUTH_TYPES, rng),
    eyebrowType: pickRandom(EYEBROW_TYPES, rng),
    hairType: pickRandom(HAIR_TYPES, rng),
    skinTone: pickRandom(SKIN_TONES, rng),
    hairColor: pickRandom(HAIR_COLORS, rng),
    eyeColor: pickRandom(EYE_COLORS, rng),
    accessories: [pickRandom(ACCESSORY_TYPES, rng)]
  };
}

/**
 * Crée l'état initial d'un avatar
 */
export function createInitialState(userId) {
  return {
    identity: generateAvatar(userId),
    evolution: {
      stage: 1,
      complexity: 0,
      luminosity: 0.5,
      presence: 0.9,
      maturity: 0
    },
    effects: {
      glow: { active: false, color: '#FFFFFF', intensity: 0, radius: 0, pulseSpeed: 1 },
      halo: { active: false, color: '#FFFFFF', size: 1, opacity: 0 },
      particles: { active: false, count: 0, color: '#FFFFFF', type: 'soft', orbitRadius: 80, speed: 1 }
    },
    transformation: null,
    lastUpdate: Date.now()
  };
}
