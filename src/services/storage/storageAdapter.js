/**
 * STORAGE ADAPTER — Interface abstraite
 *
 * Toute lecture / écriture de données persistantes passe par cette interface.
 * Permet de switcher entre localStorage et Supabase sans toucher aux composants.
 *
 * Contrat :
 *   get(key)              → valeur parsée ou null
 *   set(key, value)       → void
 *   remove(key)           → void
 *   getAll(prefix)        → tableau de { key, value } correspondant au préfixe
 *   clear()               → void (vide tout le storage de l'app)
 */

export class StorageAdapter {
  get(_key) {
    throw new Error('StorageAdapter.get() must be implemented');
  }

  set(_key, _value) {
    throw new Error('StorageAdapter.set() must be implemented');
  }

  remove(_key) {
    throw new Error('StorageAdapter.remove() must be implemented');
  }

  getAll(_prefix) {
    throw new Error('StorageAdapter.getAll() must be implemented');
  }

  clear() {
    throw new Error('StorageAdapter.clear() must be implemented');
  }
}
