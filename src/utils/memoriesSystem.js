/**
 * Système de gestion de la Boîte à souvenirs
 * Permet d'archiver et de restaurer des conversations
 */

// Clé localStorage pour les souvenirs
const MEMORIES_KEY = 'jeutaime_memories';

/**
 * Structure d'un souvenir :
 * {
 *   id: string,
 *   userId: string (email de l'utilisateur),
 *   profileId: string (email du profil),
 *   profileName: string,
 *   profileGender: string,
 *   archivedDate: timestamp,
 *   breakupType: string ('gifle', 'sayonara', 'adieux', 'salut', 'aurevoir'),
 *   breakupReason: string,
 *   messages: Array,
 *   photosUnlocked: boolean (devient false lors de l'archivage)
 * }
 */

/**
 * Récupère tous les souvenirs d'un utilisateur
 */
export function getUserMemories(userEmail) {
  const memories = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]');
  return memories.filter(m => m.userId === userEmail);
}

/**
 * Archive une conversation (créer un souvenir)
 */
export function archiveConversation(userId, profile, messages, breakupType = 'aurevoir', breakupReason = '') {
  const memories = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]');

  const newMemory = {
    id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: userId,
    profileId: profile.email,
    profileName: profile.name || profile.pseudo,
    profileGender: profile.gender,
    profileAge: profile.age,
    profileBio: profile.bio,
    archivedDate: Date.now(),
    breakupType: breakupType,
    breakupReason: breakupReason,
    messages: messages || [],
    photosUnlocked: false, // Photos toujours masquées dans les souvenirs
    messageCount: (messages || []).length
  };

  memories.push(newMemory);
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));

  return newMemory;
}

/**
 * Récupère un souvenir spécifique
 */
export function getMemory(memoryId) {
  const memories = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]');
  return memories.find(m => m.id === memoryId);
}

/**
 * Supprime un souvenir
 */
export function deleteMemory(memoryId) {
  const memories = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]');
  const filtered = memories.filter(m => m.id !== memoryId);
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Restaure une conversation depuis un souvenir (en cas de re-match)
 */
export function restoreMemory(memoryId, userId) {
  const memory = getMemory(memoryId);
  if (!memory || memory.userId !== userId) {
    return null;
  }

  // Les messages sont disponibles mais les photos restent masquées
  return {
    profileId: memory.profileId,
    messages: memory.messages,
    restored: true,
    restoredFrom: memoryId
  };
}

/**
 * Vérifie si une conversation existe déjà dans les souvenirs
 */
export function hasMemoryWith(userId, profileEmail) {
  const memories = getUserMemories(userId);
  return memories.find(m => m.profileId === profileEmail);
}

/**
 * Met à jour un souvenir existant
 */
export function updateMemory(memoryId, updates) {
  const memories = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]');
  const index = memories.findIndex(m => m.id === memoryId);

  if (index !== -1) {
    memories[index] = { ...memories[index], ...updates };
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
    return memories[index];
  }

  return null;
}

/**
 * Récupère le type de rupture avec emoji
 */
export function getBreakupTypeInfo(type) {
  const types = {
    'gifle': {
      emoji: '🤚',
      label: 'Gifle',
      color: '#E74C3C',
      description: 'Rupture brutale'
    },
    'sayonara': {
      emoji: '😉',
      label: 'Sayonara',
      color: '#3498DB',
      description: 'Au revoir décontracté'
    },
    'adieux': {
      emoji: '😞',
      label: 'Adieux',
      color: '#95A5A6',
      description: 'Séparation triste'
    },
    'salut': {
      emoji: '🫡',
      label: 'Salut',
      color: '#F39C12',
      description: 'Au revoir respectueux'
    },
    'aurevoir': {
      emoji: '🤗',
      label: 'Au revoir',
      color: '#2ECC71',
      description: 'Séparation amicale'
    }
  };

  return types[type] || types['aurevoir'];
}

/**
 * Récupère les statistiques des souvenirs
 */
export function getMemoriesStats(userEmail) {
  const memories = getUserMemories(userEmail);

  return {
    total: memories.length,
    byType: {
      gifle: memories.filter(m => m.breakupType === 'gifle').length,
      sayonara: memories.filter(m => m.breakupType === 'sayonara').length,
      adieux: memories.filter(m => m.breakupType === 'adieux').length,
      salut: memories.filter(m => m.breakupType === 'salut').length,
      aurevoir: memories.filter(m => m.breakupType === 'aurevoir').length
    },
    totalMessages: memories.reduce((sum, m) => sum + m.messageCount, 0)
  };
}

/**
 * Exporte tous les souvenirs d'un utilisateur (pour backup)
 */
export function exportMemories(userEmail) {
  const memories = getUserMemories(userEmail);
  return JSON.stringify(memories, null, 2);
}

/**
 * Importe des souvenirs (depuis un backup)
 */
export function importMemories(userEmail, memoriesJson) {
  try {
    const importedMemories = JSON.parse(memoriesJson);
    const allMemories = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]');

    // Ajouter uniquement les souvenirs de l'utilisateur
    const userImported = importedMemories.filter(m => m.userId === userEmail);
    const merged = [...allMemories, ...userImported];

    localStorage.setItem(MEMORIES_KEY, JSON.stringify(merged));
    return userImported.length;
  } catch (error) {
    console.error('Erreur lors de l\'importation des souvenirs:', error);
    return 0;
  }
}
