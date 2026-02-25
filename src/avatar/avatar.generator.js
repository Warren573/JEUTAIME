/**
 * AVATAR GENERATOR
 *
 * Génère des identités d'avatar de manière déterministe.
 * Sélectionne des IDs d'assets depuis le manifest.
 *
 * AUCUNE LOGIQUE VISUELLE - Seulement de la sélection d'IDs.
 */

import manifest from './assets/manifest.json';
import { DEFAULT_EXTENSIONS } from './avatar.extensions.types.js';

/**
 * Crée un générateur de nombres aléatoires déterministe (seeded RNG)
 * @param {string} seed - Seed pour la génération
 * @returns {() => number} Fonction qui retourne un nombre entre 0 et 1
 */
function createSeededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }

  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

/**
 * Sélectionne un élément aléatoire dans un tableau
 * @param {Array} array - Tableau source
 * @param {() => number} random - Fonction RNG
 * @returns {*} Élément sélectionné ou null si tableau vide
 */
function selectRandom(array, random) {
  if (!array || array.length === 0) return null;
  const index = Math.floor(random() * array.length);
  return array[index];
}

/**
 * Génère une identité d'avatar basée sur un userId
 * @param {string} userId - ID unique de l'utilisateur
 * @returns {Object} Identité générée avec IDs d'assets
 */
export function generateAvatarIdentity(userId) {
  const seed = `avatar_${userId}`;
  const random = createSeededRandom(seed);

  // Sélection aléatoire d'IDs depuis le manifest
  const faceAsset = selectRandom(manifest.face, random);
  const eyesAsset = selectRandom(manifest.eyes, random);
  const mouthAsset = selectRandom(manifest.mouth, random);
  const hairFrontAsset = selectRandom(manifest.hairFront, random);

  // Assets optionnels (50% de chance)
  const beardAsset = random() > 0.5 ? selectRandom(manifest.beard, random) : null;
  const accessoryAsset = random() > 0.3 ? selectRandom(manifest.accessory, random) : null;

  return {
    seed,
    face: faceAsset ? faceAsset.id : null,
    eyes: eyesAsset ? eyesAsset.id : null,
    mouth: mouthAsset ? mouthAsset.id : null,
    hairFront: hairFrontAsset ? hairFrontAsset.id : null,
    beard: beardAsset ? beardAsset.id : null,
    accessory: accessoryAsset ? accessoryAsset.id : null
  };
}

/**
 * Crée un état initial complet d'avatar
 * @param {string} userId - ID unique de l'utilisateur
 * @returns {Object} État complet de l'avatar
 */
export function createInitialAvatarState(userId) {
  return {
    identity: generateAvatarIdentity(userId),
    evolution: {
      stage: 1,
      complexity: 0,
      luminosity: 50,
      presence: 50,
      maturity: 0
    },
    effects: {
      glow: false,
      halo: false,
      particles: false
    },
    extensions: { ...DEFAULT_EXTENSIONS },
    transformation: null,
    lastUpdate: Date.now()
  };
}

/**
 * Récupère un asset par son ID depuis le manifest
 * @param {string} assetId - ID de l'asset
 * @returns {Object|null} Définition de l'asset ou null
 */
export function getAssetById(assetId) {
  if (!assetId) return null;

  // Filtrer seulement les catégories qui sont des tableaux (pas "version" ou "size")
  const categories = Object.keys(manifest).filter(key => Array.isArray(manifest[key]));

  for (const category of categories) {
    const asset = manifest[category].find(a => a.id === assetId);
    if (asset) return asset;
  }

  return null;
}
