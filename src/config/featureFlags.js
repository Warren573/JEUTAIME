/**
 * FEATURE FLAGS
 *
 * Active / désactive des fonctionnalités selon l'environnement.
 * Pour activer : changer la valeur à true ou définir la variable d'env correspondante.
 */

const env = import.meta.env;

export const FEATURES = {
  // Backend
  SUPABASE_AUTH: env.VITE_USE_SUPABASE === 'true',
  SUPABASE_DB: env.VITE_USE_SUPABASE === 'true',

  // Fonctionnalités en développement (masquées en prod)
  CREATE_PREMIUM_SALON: false,
  MEMORIES_TIMELINE: false,
  MEMORIES_COFFRE: false,
  INVENTORY_SCREEN: false,
  THEME_CUSTOMIZATION: false,
  NOTIFICATIONS_SETTINGS: false,
  PRIVACY_SETTINGS: false,

  // Fonctionnalités actives
  PETS: true,
  MAGIC: true,
  GIFTS: true,
  BOTTLES: true,
  GAMES: true,
  REFERRAL: true,
  ADMIN: true,
};

export function isEnabled(flag) {
  return FEATURES[flag] === true;
}
