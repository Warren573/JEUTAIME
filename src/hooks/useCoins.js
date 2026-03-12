/**
 * useCoins — Hook économie
 *
 * Accès aux pièces et au statut premium depuis n'importe quel composant.
 * Synchronise automatiquement les changements dans localStorage.
 */

import { useEconomyStore } from '../store/economyStore';
import { useSessionStore } from '../store/sessionStore';

export function useCoins() {
  const { userCoins, premiumActive, addCoins, spendCoins, setUserCoins } = useEconomyStore();
  const { currentUser, updateUser } = useSessionStore();

  /**
   * Dépense des pièces et met à jour le profil utilisateur.
   * Retourne false si les fonds sont insuffisants.
   */
  const spend = (amount) => {
    const success = spendCoins(amount);
    if (success && currentUser) {
      const newCoins = (currentUser.coins || 0) - amount;
      updateUser({ coins: newCoins });
    }
    return success;
  };

  /**
   * Ajoute des pièces et met à jour le profil utilisateur.
   */
  const earn = (amount) => {
    addCoins(amount);
    if (currentUser) {
      const newCoins = (currentUser.coins || 0) + amount;
      updateUser({ coins: newCoins });
    }
  };

  return {
    coins: userCoins,
    isPremium: premiumActive,
    spend,
    earn,
    setCoins: setUserCoins,
    canAfford: (amount) => userCoins >= amount,
  };
}
