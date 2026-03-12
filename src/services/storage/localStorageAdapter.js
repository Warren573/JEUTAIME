/**
 * LOCAL STORAGE ADAPTER — Implémentation localStorage
 *
 * Implémentation actuelle utilisée partout dans l'app.
 * Toutes les clés de l'app sont préfixées par APP_PREFIX.
 */

import { StorageAdapter } from './storageAdapter.js';

const APP_PREFIX = 'jeutaime_';

export class LocalStorageAdapter extends StorageAdapter {
  /**
   * Lit et parse une valeur depuis localStorage.
   * Retourne null si la clé n'existe pas ou si le JSON est invalide.
   */
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Sérialise et écrit une valeur dans localStorage.
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[storage] Impossible d'écrire la clé "${key}"`, e);
    }
  }

  /**
   * Supprime une clé du localStorage.
   */
  remove(key) {
    localStorage.removeItem(key);
  }

  /**
   * Retourne toutes les entrées dont la clé commence par le préfixe donné.
   * Si aucun préfixe fourni, utilise APP_PREFIX.
   */
  getAll(prefix = APP_PREFIX) {
    const results = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        results.push({ key, value: this.get(key) });
      }
    }
    return results;
  }

  /**
   * Supprime toutes les clés préfixées par APP_PREFIX.
   * ATTENTION : efface toutes les données de l'application.
   */
  clear() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(APP_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}
