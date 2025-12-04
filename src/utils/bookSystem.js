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

  // Photos
  photos: [],

  // Page 6 - Ultra-Privé
  privateContent: ''
};

/**
 * Charge les données du Book d'un utilisateur
 */
export function loadBookData(userEmail) {
  if (!userEmail) return { ...DEFAULT_BOOK_DATA };

  const key = `${STORAGE_KEY_PREFIX}${userEmail}`;
  const data = localStorage.getItem(key);

  if (data) {
    try {
      const parsed = JSON.parse(data);
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
 */
export function saveBookData(userEmail, bookData) {
  if (!userEmail) return false;

  try {
    const key = `${STORAGE_KEY_PREFIX}${userEmail}`;
    localStorage.setItem(key, JSON.stringify(bookData));
    return true;
  } catch (e) {
    console.error('Erreur lors de la sauvegarde du Book:', e);
    return false;
  }
}
