/**
 * Système Magie & Offrandes - Fonctions utilitaires
 * Placeholders pour future implémentation WebSocket/API
 */

import { getMagicById, getGiftById } from '../data/magicGifts';

/**
 * Hook personnalisé pour gérer l'utilisation de la magie
 * @returns {Function} Fonction pour utiliser une magie
 */
export function useMagic() {
  return (magicId, userId, salonId = null) => {
    const magic = getMagicById(magicId);

    if (!magic) {
      console.error('Magie introuvable:', magicId);
      return false;
    }

    // TODO: Implémenter l'envoi WebSocket/API
    console.log('✨ Magie utilisée:', {
      magic: magic.name,
      user: userId,
      salon: salonId,
      cost: magic.cost,
      type: magic.type
    });

    // Placeholder: simulation de succès
    return true;
  };
}

/**
 * Hook personnalisé pour gérer l'envoi de cadeaux
 * @returns {Function} Fonction pour envoyer un cadeau
 */
export function useGifts() {
  return (giftId, senderId, recipientId) => {
    const gift = getGiftById(giftId);

    if (!gift) {
      console.error('Cadeau introuvable:', giftId);
      return false;
    }

    // TODO: Implémenter l'envoi WebSocket/API
    console.log('🎁 Cadeau envoyé:', {
      gift: gift.name,
      from: senderId,
      to: recipientId,
      cost: gift.cost,
      category: gift.category
    });

    // Placeholder: simulation de succès
    return true;
  };
}

/**
 * Envoie une magie qui affecte tout le salon
 * @param {string} magicId - ID de la magie
 * @param {number} userId - ID de l'utilisateur qui lance la magie
 * @param {number} salonId - ID du salon ciblé
 * @returns {boolean} Succès de l'opération
 */
export function sendMagicToSalon(magicId, userId, salonId) {
  const magic = getMagicById(magicId);

  if (!magic) {
    console.error('Magie introuvable:', magicId);
    return false;
  }

  if (magic.type !== 'salon') {
    console.warn('Cette magie n\'affecte pas tout le salon:', magic.name);
  }

  // TODO: Implémenter l'envoi WebSocket/API pour diffusion salon
  console.log('🌟 Magie de salon activée:', {
    magic: magic.name,
    user: userId,
    salon: salonId,
    duration: magic.duration,
    cost: magic.cost
  });

  // Placeholder: simulation d'effet visuel
  if (magic.id === 'pluie-emotions') {
    console.log('🎊 Animation: Pluie d\'émojis pendant', magic.duration, 'secondes');
  }

  return true;
}

/**
 * Envoie un cadeau à un utilisateur spécifique
 * @param {string} giftId - ID du cadeau
 * @param {number} senderId - ID de l'expéditeur
 * @param {number} recipientId - ID du destinataire
 * @param {number} salonId - ID du salon où le cadeau est envoyé
 * @returns {boolean} Succès de l'opération
 */
export function sendGiftToUser(giftId, senderId, recipientId, salonId) {
  const gift = getGiftById(giftId);

  if (!gift) {
    console.error('Cadeau introuvable:', giftId);
    return false;
  }

  if (!recipientId) {
    console.error('Destinataire requis pour envoyer un cadeau');
    return false;
  }

  // TODO: Implémenter l'envoi WebSocket/API
  console.log('💝 Cadeau personnel envoyé:', {
    gift: gift.name,
    from: senderId,
    to: recipientId,
    salon: salonId,
    cost: gift.cost,
    isPremium: gift.isPremium || false,
    isLegendary: gift.isLegendary || false
  });

  // Placeholder: notification visuelle
  console.log(`🎁 ${gift.icon} ${gift.name} a été envoyé !`);

  return true;
}

/**
 * Vérifie si l'utilisateur a assez de pièces
 * @param {Object} user - Objet utilisateur
 * @param {number} cost - Coût de l'action
 * @returns {boolean} True si l'utilisateur peut se le permettre
 */
export function canAfford(user, cost) {
  return (user?.coins || 0) >= cost;
}

/**
 * Déduit le coût des pièces de l'utilisateur (placeholder)
 * @param {Object} user - Objet utilisateur
 * @param {number} cost - Coût à déduire
 * @returns {Object} Utilisateur mis à jour
 */
export function deductCoins(user, cost) {
  // TODO: Implémenter la déduction réelle via API/state management
  console.log(`💰 Déduction de ${cost} pièces pour l'utilisateur ${user.id || user.name}`);

  return {
    ...user,
    coins: (user.coins || 0) - cost
  };
}
