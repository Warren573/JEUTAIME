import { useMemo } from 'react';
import { calculateAvatar, getDefaultMetrics } from '../lib/avatarEngine';

/**
 * Hook pour calculer l'avatar typographique d'un utilisateur
 * Basé sur ses métriques de comportement
 *
 * @param {Object} user - L'objet utilisateur
 * @returns {Object} Avatar typographique calculé
 */
export function useAvatarEvolution(user) {
  const avatar = useMemo(() => {
    if (!user) return null;

    // Récupère les métriques depuis l'utilisateur ou utilise les valeurs par défaut
    const metrics = {
      userId: user.id || user.name,
      firstName: user.name || 'A',
      daysSinceJoined: user.daysSinceJoined || 0,
      messagesCount: user.messagesCount || 0,
      avgMessageLength: user.avgMessageLength || 0,
      avgResponseDelay: user.avgResponseDelay || 24,
      consistencyScore: user.consistencyScore || 0,
      vocabularyDiversity: user.vocabularyDiversity || 0,
      profileViewsCount: user.profileViewsCount || 0,
      reactionsGiven: user.reactionsGiven || 0,
      nightMessagesRatio: user.nightMessagesRatio || 0
    };

    // Calcule l'avatar basé sur les métriques
    return calculateAvatar(metrics);
  }, [user]);

  return avatar;
}

/**
 * Hook pour générer un avatar typographique à partir de métriques simulées
 * Utile pour les utilisateurs de démo
 *
 * @param {Object} user - L'objet utilisateur
 * @param {Object} simulatedMetrics - Métriques simulées (optionnel)
 * @returns {Object} Avatar typographique
 */
export function useSimulatedAvatar(user, simulatedMetrics = {}) {
  const avatar = useMemo(() => {
    if (!user) return null;

    const baseMetrics = getDefaultMetrics(user);
    const metrics = { ...baseMetrics, ...simulatedMetrics };

    return calculateAvatar(metrics);
  }, [user, simulatedMetrics]);

  return avatar;
}
