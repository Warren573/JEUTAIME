/**
 * AVATAR STORAGE
 *
 * Gestion de la persistance des avatars dans localStorage.
 * Compatible avec la migration future vers backend.
 */

const STORAGE_KEY = 'jeutaime_avatar_state';

/**
 * Sauvegarde l'état de l'avatar dans localStorage
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} avatarState - État complet de l'avatar
 */
export function saveAvatarState(userId, avatarState) {
  try {
    const allAvatars = getAllAvatars();
    allAvatars[userId] = {
      ...avatarState,
      lastUpdate: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allAvatars));
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde avatar:', error);
    return false;
  }
}

/**
 * Charge l'état de l'avatar depuis localStorage
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object|null} État de l'avatar ou null
 */
export function loadAvatarState(userId) {
  try {
    const allAvatars = getAllAvatars();
    return allAvatars[userId] || null;
  } catch (error) {
    console.error('Erreur chargement avatar:', error);
    return null;
  }
}

/**
 * Récupère tous les avatars stockés
 * @returns {Object} Map userId -> avatarState
 */
export function getAllAvatars() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Erreur lecture localStorage:', error);
    return {};
  }
}

/**
 * Supprime l'avatar d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 */
export function deleteAvatarState(userId) {
  try {
    const allAvatars = getAllAvatars();
    delete allAvatars[userId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allAvatars));
    return true;
  } catch (error) {
    console.error('Erreur suppression avatar:', error);
    return false;
  }
}

/**
 * Efface tous les avatars (reset complet)
 */
export function clearAllAvatars() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Erreur clear avatars:', error);
    return false;
  }
}
