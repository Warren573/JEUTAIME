/**
 * Système de déblocage du Book
 * Un utilisateur doit envoyer au moins 10 lettres pour débloquer le Book d'un autre utilisateur
 */

const LETTERS_REQUIRED = 10;
const STORAGE_KEY_PREFIX = 'jeutaime_book_unlock_';

/**
 * Vérifie si un utilisateur a débloqué le Book d'un autre utilisateur
 * @param {string} currentUserEmail - Email de l'utilisateur actuel
 * @param {string} targetUserEmail - Email de l'utilisateur cible
 * @returns {boolean}
 */
export function isBookUnlocked(currentUserEmail, targetUserEmail) {
  // Si c'est son propre book, toujours débloqué
  if (currentUserEmail === targetUserEmail) {
    return true;
  }

  // Vérifier si l'utilisateur est Premium (tout débloqué)
  const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || '{}');
  if (currentUser.premium) {
    return true;
  }

  // Compter le nombre de lettres envoyées
  const letterCount = getLetterCount(currentUserEmail, targetUserEmail);
  return letterCount >= LETTERS_REQUIRED;
}

/**
 * Obtient le nombre de lettres envoyées à un utilisateur
 * @param {string} fromEmail - Email de l'expéditeur
 * @param {string} toEmail - Email du destinataire
 * @returns {number}
 */
export function getLetterCount(fromEmail, toEmail) {
  const key = `${STORAGE_KEY_PREFIX}${fromEmail}_to_${toEmail}`;
  const count = localStorage.getItem(key);
  return count ? parseInt(count, 10) : 0;
}

/**
 * Incrémente le compteur de lettres envoyées
 * @param {string} fromEmail - Email de l'expéditeur
 * @param {string} toEmail - Email du destinataire
 * @returns {number} - Nouveau nombre de lettres
 */
export function incrementLetterCount(fromEmail, toEmail) {
  const key = `${STORAGE_KEY_PREFIX}${fromEmail}_to_${toEmail}`;
  const currentCount = getLetterCount(fromEmail, toEmail);
  const newCount = currentCount + 1;
  localStorage.setItem(key, newCount.toString());

  // Si on vient de débloquer le book
  if (newCount === LETTERS_REQUIRED) {
    console.log(`🔓 Book de ${toEmail} débloqué ! ${LETTERS_REQUIRED} lettres envoyées.`);
    return newCount;
  }

  return newCount;
}

/**
 * Calcule le nombre de lettres restantes avant déblocage
 * @param {string} fromEmail - Email de l'expéditeur
 * @param {string} toEmail - Email du destinataire
 * @returns {number}
 */
export function getLettersRemaining(fromEmail, toEmail) {
  const currentCount = getLetterCount(fromEmail, toEmail);
  const remaining = LETTERS_REQUIRED - currentCount;
  return Math.max(0, remaining);
}

/**
 * Réinitialise le compteur de lettres (pour tests/admin)
 * @param {string} fromEmail - Email de l'expéditeur
 * @param {string} toEmail - Email du destinataire
 */
export function resetLetterCount(fromEmail, toEmail) {
  const key = `${STORAGE_KEY_PREFIX}${fromEmail}_to_${toEmail}`;
  localStorage.removeItem(key);
}

/**
 * Obtient toutes les statistiques de déblocage pour un utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @returns {Object}
 */
export function getUnlockStats(userEmail) {
  const allKeys = Object.keys(localStorage);
  const relevantKeys = allKeys.filter(key =>
    key.startsWith(STORAGE_KEY_PREFIX) && key.includes(userEmail)
  );

  const stats = {
    totalLettersSent: 0,
    booksUnlocked: 0,
    inProgress: []
  };

  relevantKeys.forEach(key => {
    if (key.includes(`${userEmail}_to_`)) {
      const count = parseInt(localStorage.getItem(key), 10);
      stats.totalLettersSent += count;

      if (count >= LETTERS_REQUIRED) {
        stats.booksUnlocked++;
      } else {
        const targetEmail = key.split('_to_')[1];
        stats.inProgress.push({
          targetEmail,
          lettersSent: count,
          lettersRemaining: LETTERS_REQUIRED - count
        });
      }
    }
  });

  return stats;
}

/**
 * Obtient le message de statut pour l'interface
 * @param {string} fromEmail - Email de l'expéditeur
 * @param {string} toEmail - Email du destinataire
 * @returns {string}
 */
export function getUnlockStatusMessage(fromEmail, toEmail) {
  if (fromEmail === toEmail) {
    return "C'est ton Book ! ✨";
  }

  const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || '{}');
  if (currentUser.premium) {
    return "Book débloqué (Premium) 👑";
  }

  const count = getLetterCount(fromEmail, toEmail);
  const remaining = getLettersRemaining(fromEmail, toEmail);

  if (remaining === 0) {
    return "Book complètement débloqué ! 🔓✨";
  }

  return `Encore ${remaining} lettre${remaining > 1 ? 's' : ''} pour débloquer ce Book 🔒`;
}

export const BOOK_UNLOCK_CONFIG = {
  lettersRequired: LETTERS_REQUIRED,
  features: {
    unlockWithLetters: true,
    unlockWithPremium: true,
    ownBookAlwaysUnlocked: true
  }
};
