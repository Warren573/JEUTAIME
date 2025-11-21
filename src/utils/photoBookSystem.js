/**
 * Système de gestion du Book Photos
 * Galerie d'images + collection de stickers personnalisés
 */

const PHOTOBOOK_KEY = 'jeutaime_photobooks';

/**
 * Structure d'un photobook :
 * {
 *   userId: string,
 *   photos: Array<{ id, type: 'avatar'|'placeholder', avatarOptions?, url?, caption?, date }>,
 *   stickers: Array<{ id, emoji, category, favorite, dateAdded }>,
 *   settings: { maxPhotos: 6, publicVisibility: true }
 * }
 */

// Catégories de stickers disponibles
export const STICKER_CATEGORIES = {
  LOVE: {
    name: 'Amour',
    emojis: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞', '💌', '💋', '😍', '🥰', '😘', '🌹', '💐', '🌺']
  },
  EMOTIONS: {
    name: 'Émotions',
    emojis: ['😊', '😂', '🤣', '😭', '😢', '😔', '😌', '😇', '🥺', '😳', '🙈', '🙊', '🙉', '😎', '🤗', '🤔']
  },
  ACTIVITIES: {
    name: 'Activités',
    emojis: ['☕', '🍷', '🎵', '🎸', '📚', '🎮', '🎬', '✈️', '🏖️', '🎨', '📸', '🎭', '🎪', '🎡', '🎢', '🎰']
  },
  NATURE: {
    name: 'Nature',
    emojis: ['🌸', '🌼', '🌻', '🌷', '🍀', '🌺', '🌙', '⭐', '✨', '🌟', '💫', '☀️', '🌈', '🦋', '🐝', '🌊']
  },
  FOOD: {
    name: 'Nourriture',
    emojis: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰', '🎂', '🍪', '🍩', '🍫', '🍬', '🍭', '🍮', '🍯', '🍓']
  },
  MAGIC: {
    name: 'Magie',
    emojis: ['✨', '🌟', '💫', '⚡', '🔮', '🎩', '🪄', '🦄', '🧚', '🧞', '👑', '💎', '🎁', '🎀', '🎊', '🎉']
  }
};

/**
 * Récupère le photobook d'un utilisateur
 */
export function getUserPhotoBook(userEmail) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');

  if (!photobooks[userEmail]) {
    // Créer un photobook par défaut
    photobooks[userEmail] = {
      userId: userEmail,
      photos: [],
      stickers: [],
      settings: {
        maxPhotos: 6,
        publicVisibility: true
      }
    };
    localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));
  }

  return photobooks[userEmail];
}

/**
 * Ajoute une photo au book
 */
export function addPhoto(userEmail, photoData) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');
  const userBook = photobooks[userEmail] || getUserPhotoBook(userEmail);

  if (userBook.photos.length >= userBook.settings.maxPhotos) {
    return { success: false, error: 'Maximum de photos atteint' };
  }

  const newPhoto = {
    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: photoData.type || 'avatar',
    avatarOptions: photoData.avatarOptions || null,
    url: photoData.url || null,
    caption: photoData.caption || '',
    dateAdded: Date.now(),
    likes: 0
  };

  userBook.photos.push(newPhoto);
  photobooks[userEmail] = userBook;
  localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));

  return { success: true, photo: newPhoto };
}

/**
 * Supprime une photo
 */
export function deletePhoto(userEmail, photoId) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');
  const userBook = photobooks[userEmail];

  if (!userBook) return false;

  userBook.photos = userBook.photos.filter(p => p.id !== photoId);
  photobooks[userEmail] = userBook;
  localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));

  return true;
}

/**
 * Met à jour une photo
 */
export function updatePhoto(userEmail, photoId, updates) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');
  const userBook = photobooks[userEmail];

  if (!userBook) return null;

  const photoIndex = userBook.photos.findIndex(p => p.id === photoId);
  if (photoIndex === -1) return null;

  userBook.photos[photoIndex] = { ...userBook.photos[photoIndex], ...updates };
  photobooks[userEmail] = userBook;
  localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));

  return userBook.photos[photoIndex];
}

/**
 * Ajoute un sticker à la collection
 */
export function addSticker(userEmail, emoji, category) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');
  const userBook = photobooks[userEmail] || getUserPhotoBook(userEmail);

  // Vérifier si le sticker existe déjà
  if (userBook.stickers.find(s => s.emoji === emoji)) {
    return { success: false, error: 'Sticker déjà dans la collection' };
  }

  const newSticker = {
    id: `sticker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    emoji: emoji,
    category: category,
    favorite: false,
    dateAdded: Date.now()
  };

  userBook.stickers.push(newSticker);
  photobooks[userEmail] = userBook;
  localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));

  return { success: true, sticker: newSticker };
}

/**
 * Supprime un sticker de la collection
 */
export function removeSticker(userEmail, stickerId) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');
  const userBook = photobooks[userEmail];

  if (!userBook) return false;

  userBook.stickers = userBook.stickers.filter(s => s.id !== stickerId);
  photobooks[userEmail] = userBook;
  localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));

  return true;
}

/**
 * Marque un sticker comme favori
 */
export function toggleStickerFavorite(userEmail, stickerId) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');
  const userBook = photobooks[userEmail];

  if (!userBook) return null;

  const sticker = userBook.stickers.find(s => s.id === stickerId);
  if (!sticker) return null;

  sticker.favorite = !sticker.favorite;
  photobooks[userEmail] = userBook;
  localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));

  return sticker;
}

/**
 * Récupère les statistiques du photobook
 */
export function getPhotoBookStats(userEmail) {
  const book = getUserPhotoBook(userEmail);

  return {
    totalPhotos: book.photos.length,
    maxPhotos: book.settings.maxPhotos,
    totalStickers: book.stickers.length,
    favoriteStickers: book.stickers.filter(s => s.favorite).length,
    stickersByCategory: Object.keys(STICKER_CATEGORIES).reduce((acc, cat) => {
      acc[cat] = book.stickers.filter(s => s.category === cat).length;
      return acc;
    }, {})
  };
}

/**
 * Réorganise les photos (drag & drop)
 */
export function reorderPhotos(userEmail, photoIds) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');
  const userBook = photobooks[userEmail];

  if (!userBook) return false;

  const reordered = photoIds.map(id => userBook.photos.find(p => p.id === id)).filter(Boolean);
  userBook.photos = reordered;
  photobooks[userEmail] = userBook;
  localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));

  return true;
}

/**
 * Change la visibilité du photobook
 */
export function updateBookSettings(userEmail, settings) {
  const photobooks = JSON.parse(localStorage.getItem(PHOTOBOOK_KEY) || '{}');
  const userBook = photobooks[userEmail] || getUserPhotoBook(userEmail);

  userBook.settings = { ...userBook.settings, ...settings };
  photobooks[userEmail] = userBook;
  localStorage.setItem(PHOTOBOOK_KEY, JSON.stringify(photobooks));

  return userBook.settings;
}
