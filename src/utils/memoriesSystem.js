/**
 * Système de gestion de la Boîte à Souvenirs
 * Permet de sauvegarder conversations, photos, messages et moments marquants
 */

// Configuration
export const MEMORIES_CONFIG = {
  FREE_SLOTS: 10,              // Emplacements gratuits
  PRICE_PER_SLOT: 50,          // Prix en pièces par emplacement supplémentaire
  RENTAL_DURATION: 30,         // Durée de location en jours (0 = permanent)
  MAX_SLOTS: 100               // Maximum total d'emplacements
};

/**
 * Types de souvenirs possibles
 */
export const MEMORY_TYPES = {
  CONVERSATION_PRIVATE: 'conversation_private',
  CONVERSATION_SALON: 'conversation_salon',
  PHOTO: 'photo',
  MESSAGE: 'message',
  MOMENT: 'moment'
};

/**
 * Récupère tous les souvenirs d'un utilisateur
 */
export function getUserMemories(userEmail) {
  const key = `jeutaime_memories_${userEmail}`;
  const memories = JSON.parse(localStorage.getItem(key) || '[]');
  return memories.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Récupère le nombre d'emplacements achetés par l'utilisateur
 */
export function getPurchasedSlots(userEmail) {
  const key = `jeutaime_memory_slots_${userEmail}`;
  const data = JSON.parse(localStorage.getItem(key) || '{"purchased": 0, "expirations": []}');

  // Vérifier les expirations si location temporaire
  if (MEMORIES_CONFIG.RENTAL_DURATION > 0) {
    const now = new Date();
    const validSlots = data.expirations.filter(exp => new Date(exp) > now).length;
    return validSlots;
  }

  return data.purchased || 0;
}

/**
 * Récupère le nombre total d'emplacements disponibles
 */
export function getTotalSlots(userEmail) {
  return MEMORIES_CONFIG.FREE_SLOTS + getPurchasedSlots(userEmail);
}

/**
 * Vérifie si l'utilisateur peut ajouter un souvenir
 */
export function canAddMemory(userEmail) {
  const memories = getUserMemories(userEmail);
  const totalSlots = getTotalSlots(userEmail);
  return memories.length < totalSlots;
}

/**
 * Calcule le coût pour acheter N emplacements supplémentaires
 */
export function calculateSlotsCost(numberOfSlots) {
  return numberOfSlots * MEMORIES_CONFIG.PRICE_PER_SLOT;
}

/**
 * Achète des emplacements supplémentaires
 */
export function purchaseSlots(userEmail, numberOfSlots, userCoins) {
  const cost = calculateSlotsCost(numberOfSlots);

  if (userCoins < cost) {
    return { success: false, error: 'Pas assez de pièces' };
  }

  const currentPurchased = getPurchasedSlots(userEmail);
  const newTotal = currentPurchased + numberOfSlots;

  if (newTotal + MEMORIES_CONFIG.FREE_SLOTS > MEMORIES_CONFIG.MAX_SLOTS) {
    return { success: false, error: 'Limite maximale atteinte' };
  }

  const key = `jeutaime_memory_slots_${userEmail}`;
  const data = JSON.parse(localStorage.getItem(key) || '{"purchased": 0, "expirations": []}');

  // Calculer les dates d'expiration si location temporaire
  const expirations = [];
  if (MEMORIES_CONFIG.RENTAL_DURATION > 0) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + MEMORIES_CONFIG.RENTAL_DURATION);

    for (let i = 0; i < numberOfSlots; i++) {
      expirations.push(expirationDate.toISOString());
    }
  }

  data.purchased = newTotal;
  if (expirations.length > 0) {
    data.expirations = [...(data.expirations || []), ...expirations];
  }

  localStorage.setItem(key, JSON.stringify(data));

  // Déduire les pièces
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const userIndex = users.findIndex(u => u.email === userEmail);
  if (userIndex !== -1) {
    users[userIndex].coins = (users[userIndex].coins || 0) - cost;
    localStorage.setItem('jeutaime_users', JSON.stringify(users));
    localStorage.setItem('jeutaime_current_user', JSON.stringify(users[userIndex]));
  }

  return {
    success: true,
    newTotal: newTotal + MEMORIES_CONFIG.FREE_SLOTS,
    spent: cost
  };
}

/**
 * Ajoute un souvenir
 */
export function addMemory(userEmail, memory) {
  if (!canAddMemory(userEmail)) {
    return {
      success: false,
      error: 'Plus d\'emplacements disponibles',
      needsUpgrade: true
    };
  }

  const memories = getUserMemories(userEmail);
  const newMemory = {
    id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    isFavorite: false,
    tags: [],
    ...memory
  };

  memories.unshift(newMemory);

  const key = `jeutaime_memories_${userEmail}`;
  localStorage.setItem(key, JSON.stringify(memories));

  return { success: true, memory: newMemory };
}

/**
 * Supprime un souvenir
 */
export function deleteMemory(userEmail, memoryId) {
  const memories = getUserMemories(userEmail);
  const filtered = memories.filter(m => m.id !== memoryId);

  const key = `jeutaime_memories_${userEmail}`;
  localStorage.setItem(key, JSON.stringify(filtered));

  return { success: true };
}

/**
 * Met à jour un souvenir
 */
export function updateMemory(userEmail, memoryId, updates) {
  const memories = getUserMemories(userEmail);
  const index = memories.findIndex(m => m.id === memoryId);

  if (index === -1) {
    return { success: false, error: 'Souvenir introuvable' };
  }

  memories[index] = { ...memories[index], ...updates };

  const key = `jeutaime_memories_${userEmail}`;
  localStorage.setItem(key, JSON.stringify(memories));

  return { success: true, memory: memories[index] };
}

/**
 * Toggle favorite sur un souvenir
 */
export function toggleFavorite(userEmail, memoryId) {
  const memories = getUserMemories(userEmail);
  const memory = memories.find(m => m.id === memoryId);

  if (!memory) {
    return { success: false, error: 'Souvenir introuvable' };
  }

  return updateMemory(userEmail, memoryId, { isFavorite: !memory.isFavorite });
}

/**
 * Helpers pour créer des souvenirs rapidement
 */

// Sauvegarder une conversation privée
export function savePrivateConversation(userEmail, targetUser, messages) {
  return addMemory(userEmail, {
    type: MEMORY_TYPES.CONVERSATION_PRIVATE,
    title: `Conversation avec ${targetUser.name}`,
    description: `${messages.length} messages`,
    data: {
      targetUser,
      messages,
      lastMessage: messages[messages.length - 1]
    },
    tags: ['conversation', 'privé']
  });
}

// Sauvegarder une discussion de salon
export function saveSalonConversation(userEmail, salonName, participants, messages) {
  return addMemory(userEmail, {
    type: MEMORY_TYPES.CONVERSATION_SALON,
    title: `Salon "${salonName}"`,
    description: `${participants.length} participants, ${messages.length} messages`,
    data: {
      salonName,
      participants,
      messages,
      lastMessage: messages[messages.length - 1]
    },
    tags: ['conversation', 'salon', salonName.toLowerCase()]
  });
}

// Sauvegarder une photo débloquée
export function saveUnlockedPhoto(userEmail, userName, photoUrl) {
  return addMemory(userEmail, {
    type: MEMORY_TYPES.PHOTO,
    title: `Photo de ${userName}`,
    description: 'Photo débloquée',
    data: {
      userName,
      photoUrl
    },
    tags: ['photo', userName.toLowerCase()]
  });
}

// Sauvegarder un message important
export function saveImportantMessage(userEmail, from, to, content, context = '') {
  return addMemory(userEmail, {
    type: MEMORY_TYPES.MESSAGE,
    title: `Message de ${from}`,
    description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    data: {
      from,
      to,
      content,
      context
    },
    tags: ['message', from.toLowerCase()]
  });
}

// Sauvegarder un moment marquant
export function saveSpecialMoment(userEmail, title, content, icon = '✨') {
  return addMemory(userEmail, {
    type: MEMORY_TYPES.MOMENT,
    title,
    description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    data: {
      content,
      icon
    },
    tags: ['moment']
  });
}

/**
 * Filtrer les souvenirs
 */
export function filterMemories(memories, filters = {}) {
  let filtered = [...memories];

  // Filtrer par type
  if (filters.type) {
    filtered = filtered.filter(m => m.type === filters.type);
  }

  // Filtrer par favoris
  if (filters.favoritesOnly) {
    filtered = filtered.filter(m => m.isFavorite);
  }

  // Filtrer par tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(m =>
      m.tags.some(tag => filters.tags.includes(tag))
    );
  }

  // Recherche textuelle
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(searchLower) ||
      m.description.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

/**
 * Initialise des souvenirs de démo
 */
export function initDemoMemories(userEmail) {
  const existing = getUserMemories(userEmail);
  if (existing.length > 0) return; // Ne pas créer si déjà existants

  const now = new Date();

  const demoMemories = [
    {
      type: MEMORY_TYPES.MOMENT,
      title: '🎉 Bienvenue sur JeuTaime',
      description: 'Premier souvenir enregistré automatiquement',
      data: {
        content: 'Bienvenue dans ta Boîte à Souvenirs ! Ici, tu peux conserver tes conversations, photos débloquées et moments importants.',
        icon: '🎉'
      },
      tags: ['moment', 'bienvenue']
    },
    {
      type: MEMORY_TYPES.MESSAGE,
      title: 'Message de Sophie',
      description: 'Merci pour cette belle conversation !',
      data: {
        from: 'Sophie',
        to: 'Toi',
        content: 'Merci pour cette belle conversation ! J\'ai adoré discuter avec toi. À très bientôt j\'espère ! 💕',
        context: 'Suite à votre premier échange'
      },
      tags: ['message', 'sophie']
    }
  ];

  // Ajouter avec des dates légèrement décalées
  demoMemories.forEach((memory, index) => {
    const memDate = new Date(now.getTime() - (index * 3600000)); // 1h d'écart
    addMemory(userEmail, {
      ...memory,
      date: memDate.toISOString()
    });
  });

  console.log('🎁 Souvenirs de démo initialisés');
}

/**
 * Obtenir les statistiques des souvenirs
 */
export function getMemoriesStats(userEmail) {
  const memories = getUserMemories(userEmail);
  const totalSlots = getTotalSlots(userEmail);
  const usedSlots = memories.length;
  const freeSlots = totalSlots - usedSlots;

  const byType = {
    [MEMORY_TYPES.CONVERSATION_PRIVATE]: memories.filter(m => m.type === MEMORY_TYPES.CONVERSATION_PRIVATE).length,
    [MEMORY_TYPES.CONVERSATION_SALON]: memories.filter(m => m.type === MEMORY_TYPES.CONVERSATION_SALON).length,
    [MEMORY_TYPES.PHOTO]: memories.filter(m => m.type === MEMORY_TYPES.PHOTO).length,
    [MEMORY_TYPES.MESSAGE]: memories.filter(m => m.type === MEMORY_TYPES.MESSAGE).length,
    [MEMORY_TYPES.MOMENT]: memories.filter(m => m.type === MEMORY_TYPES.MOMENT).length
  };

  const favorites = memories.filter(m => m.isFavorite).length;

  return {
    total: usedSlots,
    totalSlots,
    freeSlots,
    favorites,
    byType
  };
}
