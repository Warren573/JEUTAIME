/**
 * usePets — Hook système d'animaux
 *
 * Wrapper React sur petsSystem.js.
 * Gère le chargement, les actions (nourrir, jouer, etc.) et la persistance.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getUserPet,
  adoptPet,
  feedPet,
  playWithPet,
  cleanPet,
  petSleep,
  releasePet,
  getPetStatus,
  getPetHappinessEmoji,
} from '../utils/petsSystem';
import { useSessionStore } from '../store/sessionStore';

export function usePets() {
  const { currentUser } = useSessionStore();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const email = currentUser?.email;

  const loadPet = useCallback(() => {
    if (!email) {
      setPet(null);
      setLoading(false);
      return;
    }
    const userPet = getUserPet(email);
    setPet(userPet);
    setLoading(false);
  }, [email]);

  useEffect(() => {
    loadPet();
  }, [loadPet]);

  const adopt = (animalType) => {
    if (!email) return { success: false, message: 'Non connecté' };
    const result = adoptPet(email, animalType);
    if (result.success) loadPet();
    return result;
  };

  const feed = () => {
    if (!email || !pet) return { success: false };
    const result = feedPet(email);
    if (result.success) loadPet();
    return result;
  };

  const play = () => {
    if (!email || !pet) return { success: false };
    const result = playWithPet(email);
    if (result.success) loadPet();
    return result;
  };

  const clean = () => {
    if (!email || !pet) return { success: false };
    const result = cleanPet(email);
    if (result.success) loadPet();
    return result;
  };

  const sleep = () => {
    if (!email || !pet) return { success: false };
    const result = petSleep(email);
    if (result.success) loadPet();
    return result;
  };

  const release = () => {
    if (!email || !pet) return { success: false };
    const result = releasePet(email);
    if (result.success) {
      setPet(null);
    }
    return result;
  };

  return {
    pet,
    loading,
    hasPet: !!pet,
    status: pet ? getPetStatus(pet) : null,
    happinessEmoji: pet ? getPetHappinessEmoji(pet) : null,
    adopt,
    feed,
    play,
    clean,
    sleep,
    release,
    refresh: loadPet,
  };
}
