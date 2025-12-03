/**
 * Système de gestion des données du Book personnel
 */

const STORAGE_KEY_PREFIX = 'jeutaime_book_';

/**
 * Structure par défaut du Book
 */
export const DEFAULT_BOOK_DATA = {
  // Page 1 - Moi en vrai
  bio: 'Ma phrase d\'ambiance style Skyblog ✨',
  age: '25 ans',
  city: 'Paris',
  job: 'Étudiant·e',
  music: 'Indé / Électro',
  movie: 'À compléter',
  food: 'Pizza 🍕',
  about: 'Passionné·e par la vie, les rencontres et les moments authentiques. ' +
         'Toujours partant·e pour une discussion deep à 3h du matin ou une aventure improvisée. ' +
         'J\'adore les gens qui assument leur bizarrerie ✨',

  // Page 2 - Vidéos
  videos: [],

  // Page 3 - Album
  photos: [],

  // Page 4 - Notes & Pensées
  notes: [],

  // Page 5 - Moodboard
  moodboard: [],

  // Page 6 - Ultra-Privé
  privateContent: ''
};

/**
 * Charge les données du Book d'un utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @returns {object} - Données du Book
 */
export function loadBookData(userEmail) {
  if (!userEmail) return { ...DEFAULT_BOOK_DATA };

  const key = `${STORAGE_KEY_PREFIX}${userEmail}`;
  const data = localStorage.getItem(key);

  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Merge avec les valeurs par défaut pour garantir toutes les clés
      return { ...DEFAULT_BOOK_DATA, ...parsed };
    } catch (e) {
      console.error('Erreur lors du chargement du Book:', e);
      return { ...DEFAULT_BOOK_DATA };
    }
  }

  return { ...DEFAULT_BOOK_DATA };
}

/**
 * Sauvegarde les données du Book d'un utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @param {object} bookData - Données du Book à sauvegarder
 * @returns {boolean} - Succès de la sauvegarde
 */
export function saveBookData(userEmail, bookData) {
  if (!userEmail) return false;

  try {
    const key = `${STORAGE_KEY_PREFIX}${userEmail}`;
    localStorage.setItem(key, JSON.stringify(bookData));
    console.log(`📖 Book de ${userEmail} sauvegardé`);
    return true;
  } catch (e) {
    console.error('Erreur lors de la sauvegarde du Book:', e);
    return false;
  }
}

/**
 * Met à jour une section spécifique du Book
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} section - Nom de la section à mettre à jour
 * @param {any} value - Nouvelle valeur
 * @returns {boolean} - Succès de la mise à jour
 */
export function updateBookSection(userEmail, section, value) {
  if (!userEmail) return false;

  const currentData = loadBookData(userEmail);
  currentData[section] = value;
  return saveBookData(userEmail, currentData);
}

/**
 * Ajoute un élément à une liste du Book (photos, vidéos, notes, moodboard)
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} listName - Nom de la liste
 * @param {any} item - Élément à ajouter
 * @returns {boolean} - Succès de l'ajout
 */
export function addBookListItem(userEmail, listName, item) {
  if (!userEmail) return false;

  const currentData = loadBookData(userEmail);
  if (!Array.isArray(currentData[listName])) {
    currentData[listName] = [];
  }

  currentData[listName].push({
    ...item,
    id: Date.now(),
    timestamp: new Date().toISOString()
  });

  return saveBookData(userEmail, currentData);
}

/**
 * Supprime un élément d'une liste du Book
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} listName - Nom de la liste
 * @param {number} itemId - ID de l'élément à supprimer
 * @returns {boolean} - Succès de la suppression
 */
export function removeBookListItem(userEmail, listName, itemId) {
  if (!userEmail) return false;

  const currentData = loadBookData(userEmail);
  if (!Array.isArray(currentData[listName])) {
    return false;
  }

  currentData[listName] = currentData[listName].filter(item => item.id !== itemId);
  return saveBookData(userEmail, currentData);
}

/**
 * Réinitialise le Book aux valeurs par défaut
 * @param {string} userEmail - Email de l'utilisateur
 * @returns {boolean} - Succès de la réinitialisation
 */
export function resetBookData(userEmail) {
  if (!userEmail) return false;

  return saveBookData(userEmail, { ...DEFAULT_BOOK_DATA });
}

/**
 * Exporte les données du Book en JSON
 * @param {string} userEmail - Email de l'utilisateur
 * @returns {string} - Données en JSON
 */
export function exportBookData(userEmail) {
  const data = loadBookData(userEmail);
  return JSON.stringify(data, null, 2);
}

/**
 * Importe des données de Book depuis JSON
 * @param {string} userEmail - Email de l'utilisateur
 * @param {string} jsonData - Données JSON à importer
 * @returns {boolean} - Succès de l'import
 */
export function importBookData(userEmail, jsonData) {
  if (!userEmail) return false;

  try {
    const data = JSON.parse(jsonData);
    // Valider que les données ont la bonne structure
    const validData = { ...DEFAULT_BOOK_DATA, ...data };
    return saveBookData(userEmail, validData);
  } catch (e) {
    console.error('Erreur lors de l\'import du Book:', e);
    return false;
  }
}
