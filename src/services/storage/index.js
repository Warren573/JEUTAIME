/**
 * STORAGE — Point d'entrée unique
 *
 * Sélectionne l'adapter actif selon VITE_USE_SUPABASE.
 * Par défaut : localStorage. Pour migrer vers Supabase :
 *   1. npm install @supabase/supabase-js
 *   2. Remplir VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY dans .env.local
 *   3. Définir VITE_USE_SUPABASE=true dans .env.local
 */

import { LocalStorageAdapter } from './localStorageAdapter.js';

// Instance singleton de l'adapter actif (localStorage par défaut)
export const storage = new LocalStorageAdapter();

export { LocalStorageAdapter } from './localStorageAdapter.js';
export { SupabaseAdapter } from './supabaseAdapter.js';
export { StorageAdapter } from './storageAdapter.js';
