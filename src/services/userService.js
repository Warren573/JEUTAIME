/**
 * USER SERVICE
 *
 * Gère les utilisateurs et les sanctions admin.
 * Architecture backend-ready : toute la logique est ici.
 */

const USERS_KEY = 'jeutaime_users';
const SANCTIONS_KEY = 'jeutaime_sanctions';

/**
 * Récupère tous les utilisateurs
 */
export function getAllUsers() {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    // Si pas de users, on récupère ceux qui existent déjà dans l'app
    const existing = localStorage.getItem('jeutaime_users');
    return existing ? JSON.parse(existing) : [];
  }
  return JSON.parse(data);
}

/**
 * Récupère un utilisateur par ID
 */
export function getUserById(userId) {
  const users = getAllUsers();
  return users.find(u => u.id === userId || u.email === userId);
}

/**
 * Recherche des utilisateurs
 */
export function searchUsers(searchTerm) {
  if (!searchTerm) return getAllUsers();

  const users = getAllUsers();
  const term = searchTerm.toLowerCase();

  return users.filter(u =>
    (u.name && u.name.toLowerCase().includes(term)) ||
    (u.email && u.email.toLowerCase().includes(term)) ||
    (u.id && u.id.toString().includes(term))
  );
}

/**
 * Filtre les utilisateurs par statut
 */
export function getUsersByStatus(status) {
  const users = getAllUsers();

  if (status === 'all') return users;

  return users.filter(u => {
    const sanctions = getUserSanctions(u.id || u.email);
    const activeSanction = sanctions.find(s => s.active);

    switch (status) {
      case 'active':
        return !activeSanction;
      case 'banned':
        return activeSanction && activeSanction.type === 'ban';
      case 'restricted':
        return activeSanction && activeSanction.type === 'restrict';
      case 'warned':
        return sanctions.some(s => s.type === 'warning');
      case 'premium':
        return u.premium === true;
      default:
        return true;
    }
  });
}

/**
 * Stats utilisateurs
 */
export function getUserStats() {
  const users = getAllUsers();
  const sanctions = getAllSanctions();

  const activeBans = sanctions.filter(s => s.active && s.type === 'ban').length;
  const activeRestricts = sanctions.filter(s => s.active && s.type === 'restrict').length;

  return {
    total: users.length,
    active: users.length - activeBans,
    premium: users.filter(u => u.premium).length,
    banned: activeBans,
    restricted: activeRestricts
  };
}

/**
 * SANCTIONS
 */

/**
 * Récupère toutes les sanctions
 */
export function getAllSanctions() {
  const data = localStorage.getItem(SANCTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Récupère les sanctions d'un utilisateur
 */
export function getUserSanctions(userId) {
  const sanctions = getAllSanctions();
  return sanctions.filter(s => s.userId === userId);
}

/**
 * Récupère la sanction active d'un utilisateur
 */
export function getActiveSanction(userId) {
  const sanctions = getUserSanctions(userId);
  return sanctions.find(s => s.active);
}

/**
 * Crée une nouvelle sanction
 */
export function createSanction(sanctionData) {
  const sanctions = getAllSanctions();

  const newSanction = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    active: true,
    ...sanctionData
  };

  sanctions.push(newSanction);
  localStorage.setItem(SANCTIONS_KEY, JSON.stringify(sanctions));
  return newSanction;
}

/**
 * Avertit un utilisateur
 */
export function warnUser(userId, reason, adminNote = '') {
  return createSanction({
    userId,
    type: 'warning',
    reason,
    adminNote,
    adminId: 'admin', // TODO: utiliser le vrai admin ID
    active: false // Les warnings ne sont pas "actifs" (pas de blocage)
  });
}

/**
 * Restreint un utilisateur (durée limitée)
 */
export function restrictUser(userId, reason, durationDays, adminNote = '') {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  return createSanction({
    userId,
    type: 'restrict',
    reason,
    adminNote,
    adminId: 'admin',
    expiresAt: expiresAt.toISOString(),
    durationDays
  });
}

/**
 * Bannit un utilisateur (permanent)
 */
export function banUser(userId, reason, adminNote = '') {
  return createSanction({
    userId,
    type: 'ban',
    reason,
    adminNote,
    adminId: 'admin',
    permanent: true
  });
}

/**
 * Lève une sanction
 */
export function removeSanction(sanctionId) {
  const sanctions = getAllSanctions();
  const index = sanctions.findIndex(s => s.id === sanctionId);

  if (index === -1) return false;

  sanctions[index] = {
    ...sanctions[index],
    active: false,
    removedAt: new Date().toISOString(),
    removedBy: 'admin' // TODO: utiliser le vrai admin ID
  };

  localStorage.setItem(SANCTIONS_KEY, JSON.stringify(sanctions));
  return sanctions[index];
}

/**
 * Lève toutes les sanctions actives d'un utilisateur
 */
export function removeAllUserSanctions(userId) {
  const sanctions = getAllSanctions();
  let updated = false;

  const newSanctions = sanctions.map(s => {
    if (s.userId === userId && s.active) {
      updated = true;
      return {
        ...s,
        active: false,
        removedAt: new Date().toISOString(),
        removedBy: 'admin'
      };
    }
    return s;
  });

  if (updated) {
    localStorage.setItem(SANCTIONS_KEY, JSON.stringify(newSanctions));
  }

  return updated;
}

/**
 * Vérifie si un utilisateur peut se connecter
 */
export function canUserLogin(userId) {
  const sanction = getActiveSanction(userId);

  if (!sanction) return { allowed: true };

  if (sanction.type === 'ban') {
    return {
      allowed: false,
      reason: 'banned',
      message: sanction.reason
    };
  }

  if (sanction.type === 'restrict') {
    // Vérifier si la restriction est expirée
    if (sanction.expiresAt && new Date(sanction.expiresAt) < new Date()) {
      removeSanction(sanction.id);
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'restricted',
      message: sanction.reason,
      expiresAt: sanction.expiresAt
    };
  }

  return { allowed: true };
}

/**
 * Historique d'activité d'un utilisateur (pour la fiche)
 */
export function getUserActivity(userId) {
  // TODO: Implémenter quand les autres systèmes seront en place
  return {
    matchs: 0,
    messages: 0,
    gamesPlayed: 0,
    reportsReceived: 0,
    reportsSent: 0,
    lastActive: new Date().toISOString()
  };
}
