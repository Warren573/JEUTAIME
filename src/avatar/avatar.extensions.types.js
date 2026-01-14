/**
 * AVATAR EXTENSIONS - TYPE DEFINITIONS
 *
 * Les extensions sont des overlays OPTIONNELS et INDÉPENDANTS.
 * Elles ne remplacent jamais les assets de base - elles se superposent.
 *
 * RÈGLE D'OR : Une extension n'efface jamais un asset, elle l'enrichit visuellement.
 */

/**
 * Types d'expressions faciales
 * @typedef {'neutral'|'smile'|'sad'|'surprised'|'angry'} ExpressionType
 */

/**
 * Types d'émotions (aura/présence)
 * @typedef {'calm'|'confident'|'attracted'|'mysterious'} EmotionType
 */

/**
 * Niveaux de vieillissement
 * @typedef {'none'|'light'|'medium'|'strong'} AgingType
 */

/**
 * Configuration des extensions actives
 *
 * @typedef {Object} AvatarExtensions
 * @property {ExpressionType} expression - Expression faciale active
 * @property {EmotionType} emotion - Émotion affichée
 * @property {AgingType} aging - Niveau de vieillissement
 */

/**
 * Définition d'un asset d'extension dans le manifest
 *
 * @typedef {Object} ExtensionAssetDefinition
 * @property {string} id - ID unique (ex: "expr_smile")
 * @property {string} type - Type d'extension (expression/emotion/aging)
 * @property {string} value - Valeur spécifique (ex: "smile", "calm", "light")
 * @property {string} path - Chemin vers l'overlay (SVG/PNG avec transparence)
 * @property {Object.<string, any>} [metadata] - Métadonnées optionnelles
 */

/**
 * Manifest des extensions disponibles
 *
 * @typedef {Object} ExtensionManifest
 * @property {ExtensionAssetDefinition[]} expressions - Assets d'expressions
 * @property {ExtensionAssetDefinition[]} emotions - Assets d'émotions
 * @property {ExtensionAssetDefinition[]} aging - Assets de vieillissement
 */

/**
 * Valeurs par défaut pour les extensions
 */
export const DEFAULT_EXTENSIONS = {
  expression: 'neutral',
  emotion: 'calm',
  aging: 'none'
};

/**
 * Types disponibles pour chaque extension
 */
export const EXPRESSION_TYPES = ['neutral', 'smile', 'sad', 'surprised', 'angry'];
export const EMOTION_TYPES = ['calm', 'confident', 'attracted', 'mysterious'];
export const AGING_TYPES = ['none', 'light', 'medium', 'strong'];

/**
 * Catégories d'extensions (pour le manifest)
 */
export const EXTENSION_CATEGORIES = ['expressions', 'emotions', 'aging'];
