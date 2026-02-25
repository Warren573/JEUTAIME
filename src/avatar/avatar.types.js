/**
 * AVATAR SYSTEM - TYPE DEFINITIONS
 *
 * Architecture modulaire pour avatars basés sur assets externes.
 * AUCUN visuel n'est défini ici - seulement la structure de données.
 */

/**
 * @typedef {'face'} AssetCategory_Face
 * @typedef {'eyes'} AssetCategory_Eyes
 * @typedef {'mouth'} AssetCategory_Mouth
 * @typedef {'hairBack'} AssetCategory_HairBack
 * @typedef {'hairFront'} AssetCategory_HairFront
 * @typedef {'beard'} AssetCategory_Beard
 * @typedef {'accessory'} AssetCategory_Accessory
 *
 * @typedef {AssetCategory_Face | AssetCategory_Eyes | AssetCategory_Mouth |
 *           AssetCategory_HairBack | AssetCategory_HairFront |
 *           AssetCategory_Beard | AssetCategory_Accessory} AssetCategory
 */

/**
 * Identité visuelle de l'avatar
 * Chaque propriété pointe vers un ID d'asset dans le manifest
 *
 * @typedef {Object} AvatarIdentity
 * @property {string} seed - Seed unique pour génération déterministe
 * @property {string|null} face - ID de l'asset face (ex: "face_01")
 * @property {string|null} eyes - ID de l'asset eyes (ex: "eyes_almond_blue")
 * @property {string|null} mouth - ID de l'asset mouth (ex: "mouth_neutral")
 * @property {string|null} hairBack - ID de l'asset cheveux arrière
 * @property {string|null} hairFront - ID de l'asset cheveux avant
 * @property {string|null} beard - ID de l'asset barbe (optionnel)
 * @property {string|null} accessory - ID de l'asset accessoire (optionnel)
 */

/**
 * Métadonnées d'évolution (pour futures fonctionnalités)
 *
 * @typedef {Object} AvatarEvolution
 * @property {number} stage - Niveau d'évolution (1-7)
 * @property {number} complexity - Complexité visuelle (0-100)
 * @property {number} luminosity - Luminosité (0-100)
 * @property {number} presence - Présence visuelle (0-100)
 * @property {number} maturity - Maturité (0-100)
 */

/**
 * Effets visuels (pour futures fonctionnalités)
 *
 * @typedef {Object} AvatarEffects
 * @property {boolean} glow - Effet de halo lumineux
 * @property {boolean} halo - Auréole
 * @property {boolean} particles - Particules flottantes
 */

/**
 * État complet d'un avatar
 *
 * @typedef {Object} AvatarState
 * @property {AvatarIdentity} identity - Identité visuelle (assets)
 * @property {AvatarEvolution} evolution - Métadonnées d'évolution
 * @property {AvatarEffects} effects - Effets visuels
 * @property {AvatarExtensions} extensions - Extensions (expressions, aging, etc.)
 * @property {Object|null} transformation - État de transformation
 * @property {number} lastUpdate - Timestamp de dernière mise à jour
 */

/**
 * Définition d'un asset dans le manifest
 *
 * @typedef {Object} AssetDefinition
 * @property {string} id - ID unique de l'asset
 * @property {AssetCategory} category - Catégorie de l'asset
 * @property {string} path - Chemin relatif vers le fichier (SVG/PNG)
 * @property {Object.<string, any>} [metadata] - Métadonnées optionnelles
 */

/**
 * Manifest complet des assets disponibles
 *
 * @typedef {Object} AssetManifest
 * @property {AssetDefinition[]} face - Assets de visage
 * @property {AssetDefinition[]} eyes - Assets d'yeux
 * @property {AssetDefinition[]} mouth - Assets de bouche
 * @property {AssetDefinition[]} hairBack - Assets cheveux arrière
 * @property {AssetDefinition[]} hairFront - Assets cheveux avant
 * @property {AssetDefinition[]} beard - Assets de barbe
 * @property {AssetDefinition[]} accessory - Assets d'accessoires
 */

export const ASSET_CATEGORIES = [
  'face',
  'eyes',
  'mouth',
  'hairFront',
  'beard',
  'accessory'
];

/**
 * Z-ORDER ABSOLU - NE JAMAIS MODIFIER
 * Ordre de rendu des couches (de l'arrière vers l'avant)
 */
export const Z_ORDER = [
  'face',            // 0 - Visage
  'eyes',            // 1 - Yeux
  'mouth',           // 2 - Bouche
  'beard',           // 3 - Barbe
  'hairFront',       // 4 - Cheveux
  'accessory',       // 5 - Accessoires
  'expression',      // 6 - Expression (extension)
  'aging',           // 7 - Vieillissement (extension)
  'emotion'          // 8 - Émotion (extension)
];

/**
 * Valeurs par défaut pour l'évolution
 */
export const DEFAULT_EVOLUTION = {
  stage: 1,
  complexity: 0,
  luminosity: 50,
  presence: 50,
  maturity: 0
};

/**
 * Valeurs par défaut pour les effets
 */
export const DEFAULT_EFFECTS = {
  glow: false,
  halo: false,
  particles: false
};
