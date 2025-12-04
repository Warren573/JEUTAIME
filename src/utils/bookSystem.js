/**
 * Système de gestion des données du Book personnel
 */

const STORAGE_KEY_PREFIX = 'jeutaime_book_';

/**
 * Structure par défaut du Book
 */
export const DEFAULT_BOOK_DATA = {
  // Infos de base
  bio: 'Ma phrase d\'ambiance style Skyblog ✨',
  age: '25 ans',
  city: 'Paris',
  job: 'Étudiant·e',
  music: 'Indé / Électro',
  movie: 'À compléter',
  food: 'Pizza 🍕',

  // À propos
  about: 'Passionné·e par la vie, les rencontres et les moments authentiques. ' +
         'Toujours partant·e pour une discussion deep à 3h du matin ou une aventure improvisée. ' +
         'J\'adore les gens qui assument leur bizarrerie ✨',
  mood: '😊 De bonne humeur',
  status: '💭 En ligne',

  // Photos
  photos: [],

  // Style & Perso
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  accentColor: '#667eea',
  coverImage: '',
  song: '', // Musique d'ambiance (YouTube embed)

  // Extras style Skyblog
  favorites: {
    books: '',
    series: '',
    hobbies: '',
    quote: '"Sois toi-même, tous les autres sont déjà pris." - Oscar Wilde'
  },

  topFriends: [], // Liste de noms/usernames
  gifs: [], // URLs de GIFs animés
  stickers: [], // Emojis/stickers favoris

  // Quiz/Questions
  quiz: {
    q1: { question: 'Plutôt chat ou chien ?', answer: '🐱 Team chat !' },
    q2: { question: 'Ton guilty pleasure ?', answer: 'Les reality TV 📺' },
    q3: { question: 'Superpouvoirs si tu pouvais ?', answer: 'Téléportation 🌍' }
  },

  // Compteurs
  visitors: 0,

  // Page Ultra-Privé
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
