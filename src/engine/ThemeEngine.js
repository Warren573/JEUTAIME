/**
 * ThemeEngine - Moteur de thèmes pour salons
 *
 * Gère les arrière-plans, overlays et thèmes visuels des salons.
 *
 * MOBILE-FIRST CRITICAL :
 * - background-size: cover pour ratio conservé
 * - pas d'images lourdes (optimisation)
 * - transitions douces (opacity, transform)
 * - safe-area aware pour notch/bords arrondis
 */

import { getSalonTheme } from './ContentRegistry';

// ============================================================================
// TYPES DE THÈMES
// ============================================================================

export const THEME_TYPES = {
  GRADIENT: 'gradient',   // Dégradé CSS
  IMAGE: 'image',         // Image de fond
  VIDEO: 'video',         // Vidéo de fond (rare, heavy)
  PATTERN: 'pattern'      // Pattern SVG/CSS
};

// ============================================================================
// CONFIGURATION RESPONSIVE
// ============================================================================

/**
 * Breakpoints mobile-first
 * Utilisés pour adapter la taille des images de fond
 */
const BREAKPOINTS = {
  SMALL: 375,    // iPhone SE, petits smartphones
  MEDIUM: 768,   // Tablettes portrait, grands téléphones
  LARGE: 1024    // Tablettes landscape
};

/**
 * Tailles d'images optimisées selon device
 * Évite de charger des images 4K sur mobile
 */
function getOptimalImageSize() {
  const width = window.innerWidth;

  if (width <= BREAKPOINTS.SMALL) return 'small';  // 800px max
  if (width <= BREAKPOINTS.MEDIUM) return 'medium'; // 1200px max
  return 'large'; // 1920px max
}

// ============================================================================
// THÈME ACTIF
// ============================================================================

let currentTheme = null;

/**
 * Applique un thème à un salon
 *
 * @param {number} salonId - ID du salon
 * @param {object} overrides - Surcharges optionnelles (effets temporaires)
 * @returns {object} Thème CSS prêt à être appliqué
 */
export function applyTheme(salonId, overrides = {}) {
  const baseTheme = getSalonTheme(salonId);
  if (!baseTheme) return getDefaultTheme();

  // Merger avec overrides (effets temporaires)
  const theme = { ...baseTheme, ...overrides };

  // Générer le CSS responsive
  const cssTheme = generateThemeCSS(theme);

  currentTheme = {
    salonId,
    theme: cssTheme,
    appliedAt: Date.now()
  };

  return cssTheme;
}

/**
 * Génère le CSS du thème de manière responsive
 */
function generateThemeCSS(theme) {
  const { bgGradient, bgImage, bgColor, overlay } = theme;

  // Background principal
  let background = bgGradient || bgColor || getDefaultGradient();

  // Si image de fond, l'ajouter
  if (bgImage) {
    const optimizedUrl = getOptimizedImageUrl(bgImage);
    background = `url(${optimizedUrl}), ${background}`;
  }

  // CSS mobile-first
  const css = {
    background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: shouldUseFixedBackground() ? 'fixed' : 'scroll', // Mobile: scroll, Desktop: fixed

    // Safe area pour notch iPhone
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',

    // Transition douce au changement de thème
    transition: 'background 0.5s ease-in-out',

    // GPU acceleration sur mobile
    ...(isMobile() && {
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)'
    }),

    // Overlay optionnel
    ...(overlay && {
      position: 'relative',
      '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: overlay.color || 'rgba(0,0,0,0.3)',
        opacity: overlay.opacity || 0.5,
        pointerEvents: 'none', // Ne bloque pas les interactions
        transition: 'opacity 0.3s ease'
      }
    })
  };

  return css;
}

/**
 * Optimise l'URL de l'image selon la taille d'écran
 * Si l'URL supporte les paramètres de taille, les ajoute
 */
function getOptimizedImageUrl(url) {
  const size = getOptimalImageSize();

  // Si URL Cloudinary, Imgix ou autre service avec resize
  if (url.includes('cloudinary') || url.includes('imgix')) {
    // Ajouter paramètres de resize
    // Ex: ?w=800&q=80
    const sizeParams = {
      small: 'w=800&q=80',
      medium: 'w=1200&q=85',
      large: 'w=1920&q=90'
    };

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${sizeParams[size]}`;
  }

  // Sinon retourner tel quel
  return url;
}

/**
 * Gradient par défaut (fallback)
 */
function getDefaultGradient() {
  return 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)';
}

/**
 * Thème par défaut (si salon introuvable)
 */
function getDefaultTheme() {
  return {
    background: getDefaultGradient(),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background 0.5s ease-in-out'
  };
}

// ============================================================================
// OVERLAYS & EFFETS
// ============================================================================

/**
 * Ajoute un overlay temporaire
 * Utile pour effets visuels (nuit, jour, brume, etc.)
 */
export function addOverlay(overlayConfig) {
  if (!currentTheme) return null;

  const { color, opacity, blur } = overlayConfig;

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: color || 'rgba(0,0,0,0.3)',
    opacity: opacity || 0.5,
    backdropFilter: blur ? `blur(${blur}px)` : 'none',
    pointerEvents: 'none',
    transition: 'all 0.3s ease',
    zIndex: 1
  };
}

/**
 * Supprime l'overlay
 */
export function removeOverlay() {
  // L'overlay s'enlève automatiquement si non inclus dans le style
  return null;
}

// ============================================================================
// ANIMATIONS THÈME (douces, non bloquantes)
// ============================================================================

/**
 * Transition douce entre deux thèmes
 * Évite les clignotements et sauts visuels
 */
export function transitionToTheme(newSalonId, durationMs = 500) {
  const newTheme = applyTheme(newSalonId);

  // Retourner le CSS avec transition custom
  return {
    ...newTheme,
    transition: `background ${durationMs}ms ease-in-out`
  };
}

/**
 * Précharge les images des salons
 * Évite les lags lors du changement de salon
 */
export function preloadSalonImages(salonIds) {
  salonIds.forEach(id => {
    const theme = getSalonTheme(id);
    if (theme?.bgImage) {
      const img = new Image();
      img.src = getOptimizedImageUrl(theme.bgImage);
    }
  });
}

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Détecte si device mobile (pour ajuster les effets)
 */
export function isMobile() {
  return window.innerWidth <= BREAKPOINTS.MEDIUM;
}

/**
 * Détecte si device a notch (iPhone X+)
 */
export function hasNotch() {
  return CSS.supports('padding-top: env(safe-area-inset-top)');
}

/**
 * Retourne les paddings safe-area
 */
export function getSafeAreaInsets() {
  if (!hasNotch()) return { top: 0, bottom: 0, left: 0, right: 0 };

  return {
    top: 'env(safe-area-inset-top)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
    right: 'env(safe-area-inset-right)'
  };
}

// ============================================================================
// PERFORMANCE
// ============================================================================

/**
 * Désactive backgroundAttachment:fixed si device lent
 * Évite les lags sur mobiles bas de gamme
 */
export function shouldUseFixedBackground() {
  // Désactiver sur mobile pour performances
  if (isMobile()) return false;

  // Vérifier si GPU disponible
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return !!gl;
}

/**
 * Optimise le thème pour performances mobile
 */
export function optimizeForMobile(theme) {
  return {
    ...theme,
    backgroundAttachment: 'scroll', // Au lieu de fixed
    willChange: 'auto', // Éviter will-change si pas nécessaire
    transform: 'translateZ(0)' // Force GPU acceleration si disponible
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  applyTheme,
  transitionToTheme,
  addOverlay,
  removeOverlay,
  preloadSalonImages,
  isMobile,
  hasNotch,
  getSafeAreaInsets,
  shouldUseFixedBackground,
  optimizeForMobile
};
