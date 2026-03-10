/**
 * useMatching — Hook de découverte de profils et de matching
 *
 * Charge les profils, gère les sourires / grimaces,
 * détecte les matchs mutuels. Prêt pour migration Supabase.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSessionStore } from '../store/sessionStore';

const SMILES_KEY = (email) => `jeutaime_smiles_${email}`;
const GRIMACES_KEY = (email) => `jeutaime_grimaces_${email}`;
const MATCHES_KEY = (email) => `jeutaime_matches_${email}`;

export function useMatching() {
  const { currentUser } = useSessionStore();
  const [profiles, setProfiles] = useState([]);
  const [smiles, setSmiles] = useState([]);
  const [grimaces, setGrimaces] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const email = currentUser?.email;

  const loadData = useCallback(() => {
    if (!email) return;

    // Charger les profils (tous les users sauf soi)
    const allUsers = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const others = allUsers.filter(u => u.email !== email && !u.isBanned);
    setProfiles(others);

    // Charger les interactions
    const savedSmiles = JSON.parse(localStorage.getItem(SMILES_KEY(email)) || '[]');
    const savedGrimaces = JSON.parse(localStorage.getItem(GRIMACES_KEY(email)) || '[]');
    const savedMatches = JSON.parse(localStorage.getItem(MATCHES_KEY(email)) || '[]');

    setSmiles(savedSmiles);
    setGrimaces(savedGrimaces);
    setMatches(savedMatches);
  }, [email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Envoie un sourire à un profil.
   * Détecte automatiquement un match mutuel.
   */
  const sendSmile = (targetEmail) => {
    if (!email) return { match: false };

    const newSmiles = [...smiles, targetEmail];
    localStorage.setItem(SMILES_KEY(email), JSON.stringify(newSmiles));
    setSmiles(newSmiles);

    // Vérifier si match mutuel (l'autre a aussi souri à moi)
    const otherSmiles = JSON.parse(localStorage.getItem(SMILES_KEY(targetEmail)) || '[]');
    const isMatch = otherSmiles.includes(email);

    if (isMatch && !matches.includes(targetEmail)) {
      const newMatches = [...matches, targetEmail];
      localStorage.setItem(MATCHES_KEY(email), JSON.stringify(newMatches));
      setMatches(newMatches);
    }

    next();
    return { match: isMatch };
  };

  /**
   * Envoie une grimace à un profil.
   */
  const sendGrimace = (targetEmail) => {
    if (!email) return;
    const newGrimaces = [...grimaces, targetEmail];
    localStorage.setItem(GRIMACES_KEY(email), JSON.stringify(newGrimaces));
    setGrimaces(newGrimaces);
    next();
  };

  const next = () => setCurrentIndex(i => i + 1);

  /**
   * Profils restants (non encore notés).
   */
  const seen = [...smiles, ...grimaces];
  const remaining = profiles.filter(p => !seen.includes(p.email));

  const currentProfileData = remaining[0] || null;

  return {
    profiles: remaining,
    currentProfile: currentProfileData,
    matches,
    smiles,
    grimaces,
    currentIndex,
    hasMore: remaining.length > 0,
    sendSmile,
    sendGrimace,
    next,
    refresh: loadData,
  };
}
