/**
 * STORAGE — Point d'entrée unique
 *
 * Exporte l'adapter actif selon la config.
 * Pour migrer vers Supabase : changer VITE_USE_SUPABASE=true dans .env
 */

import { LocalStorageAdapter } from './localStorageAdapter.js';

// Instance singleton de l'adapter actif
export const storage = new LocalStorageAdapter();

export { LocalStorageAdapter } from './localStorageAdapter.js';
export { SupabaseAdapter } from './supabaseAdapter.js';
export { StorageAdapter } from './storageAdapter.js';
