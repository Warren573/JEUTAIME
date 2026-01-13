/**
 * Types pour le système d'avatars graphiques évolutifs
 * Avatars SVG modulaires qui évoluent selon l'engagement utilisateur
 */

// TYPES IDENTITÉ
export const FACE_SHAPES = ['oval', 'round', 'square', 'triangle', 'long'];
export const EYE_TYPES = ['almond', 'round', 'narrow', 'wide', 'hooded'];
export const MOUTH_TYPES = ['neutral', 'slight-smile', 'closed', 'subtle-curve'];
export const EYEBROW_TYPES = ['straight', 'arched', 'soft', 'angular'];
export const HAIR_TYPES = ['short-1', 'short-2', 'medium-1', 'medium-2', 'long-1', 'long-2', 'minimal'];
export const ACCESSORY_TYPES = ['none', 'glasses-subtle', 'earring-small', 'necklace-thin'];

// Palettes de couleurs
export const SKIN_TONES = [
  '#FFDFC4', '#F0D5BE', '#EECEB3', '#E1B899', '#E5C298',
  '#DEAB90', '#C68642', '#8D5524', '#5C3317'
];

export const HAIR_COLORS = [
  '#090806', '#2C222B', '#71635A', '#B7A69E',
  '#D6C4C2', '#CABFB1', '#FFF5E1', '#E6CEA8',
  '#DE834D', '#B55239', '#A56B3C', '#543D1F'
];

export const EYE_COLORS = [
  '#2E536F', '#3D6A91', '#5A7C99', '#8FA5B8',
  '#4A7C59', '#8FBC94', '#A0785A', '#8B7355',
  '#D2691E', '#654321'
];

// TYPES TRANSFORMATIONS
export const TRANSFORMATION_TYPES = [
  'none', 'ethereal', 'shadow', 'frost', 'golden',
  'nature', 'cosmic', 'fire', 'water'
];

export const PARTICLE_TYPES = ['soft', 'sharp', 'ethereal'];

/**
 * @typedef {Object} AvatarIdentity
 * @property {string} seed - Seed pour génération reproductible
 * @property {string} faceShape - Forme du visage
 * @property {string} eyeType - Type d'yeux
 * @property {string} mouthType - Type de bouche
 * @property {string} eyebrowType - Type de sourcils
 * @property {string} hairType - Type de cheveux
 * @property {string} skinTone - Couleur de peau (hex)
 * @property {string} hairColor - Couleur de cheveux (hex)
 * @property {string} eyeColor - Couleur des yeux (hex)
 * @property {string[]} accessories - Liste des accessoires
 */

/**
 * @typedef {Object} AvatarEvolution
 * @property {number} stage - Niveau d'évolution (1-7)
 * @property {number} complexity - Complexité visuelle (0-100)
 * @property {number} luminosity - Luminosité (0.3-1.0)
 * @property {number} presence - Échelle de présence (0.85-1.15)
 * @property {number} maturity - Maturité (0-100)
 */

/**
 * @typedef {Object} GlowEffect
 * @property {boolean} active
 * @property {string} color
 * @property {number} intensity
 * @property {number} radius
 * @property {number} pulseSpeed
 */

/**
 * @typedef {Object} HaloEffect
 * @property {boolean} active
 * @property {string} color
 * @property {number} size
 * @property {number} opacity
 */

/**
 * @typedef {Object} ParticlesEffect
 * @property {boolean} active
 * @property {number} count
 * @property {string} color
 * @property {string} type - 'soft' | 'sharp' | 'ethereal'
 * @property {number} orbitRadius
 * @property {number} speed
 */

/**
 * @typedef {Object} VisualEffect
 * @property {GlowEffect} glow
 * @property {HaloEffect} halo
 * @property {ParticlesEffect} particles
 */

/**
 * @typedef {Object} Transformation
 * @property {string} type - Type de transformation
 * @property {number} startTime - Timestamp de début
 * @property {number} duration - Durée en ms
 * @property {number} intensity - Intensité (0-1)
 * @property {string[]} overlays - Filtres SVG à appliquer
 * @property {Object} [colorShift] - Décalage de couleur HSL
 */

/**
 * @typedef {Object} AvatarState
 * @property {AvatarIdentity} identity
 * @property {AvatarEvolution} evolution
 * @property {VisualEffect} effects
 * @property {Transformation | null} transformation
 * @property {number} lastUpdate
 */

/**
 * @typedef {Object} UserMetrics
 * @property {number} messagesSent
 * @property {number} messagesReceived
 * @property {number} daysActive
 * @property {number} lastActivityDays
 * @property {number} responseRate - 0-1
 * @property {number} regularityScore - 0-1
 */
