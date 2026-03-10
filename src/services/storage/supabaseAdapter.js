/**
 * SUPABASE ADAPTER — Stub pour migration future
 *
 * À implémenter quand Supabase sera configuré.
 * Remplace localStorageAdapter sans toucher aux composants.
 */

import { StorageAdapter } from './storageAdapter.js';

export class SupabaseAdapter extends StorageAdapter {
  get(_key) {
    throw new Error('SupabaseAdapter non implémenté — utiliser localStorageAdapter');
  }

  set(_key, _value) {
    throw new Error('SupabaseAdapter non implémenté');
  }

  remove(_key) {
    throw new Error('SupabaseAdapter non implémenté');
  }

  getAll(_prefix) {
    throw new Error('SupabaseAdapter non implémenté');
  }

  clear() {
    throw new Error('SupabaseAdapter non implémenté');
  }
}
