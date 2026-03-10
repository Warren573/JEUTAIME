/**
 * useSalons — Hook gestion des salons
 *
 * Charge les salons, gère les adhésions, l'état actif.
 * Wrapper sur barsSystem.js et UIStore.
 */

import { useState, useEffect, useCallback } from 'react';
import { salons as staticSalons } from '../data/appData';
import { loadBarState, saveBarState } from '../utils/barsSystem';
import { useUIStore } from '../store/uiStore';
import { useSessionStore } from '../store/sessionStore';

export function useSalons() {
  const { currentUser } = useSessionStore();
  const {
    joinedSalons,
    joinSalon,
    selectedSalon,
    setSelectedSalon,
    setScreen,
  } = useUIStore();

  const [barStates, setBarStates] = useState({});

  const activeSalons = staticSalons.filter(s => joinedSalons.includes(s.id));

  const loadBarStates = useCallback(() => {
    const states = {};
    staticSalons.forEach(salon => {
      const state = loadBarState(salon.id);
      if (state) states[salon.id] = state;
    });
    setBarStates(states);
  }, []);

  useEffect(() => {
    loadBarStates();
  }, [loadBarStates]);

  const join = (salonId) => {
    joinSalon(salonId);
  };

  const openSalon = (salonId) => {
    setSelectedSalon(salonId);
    setScreen('bars');
  };

  const getSalon = (salonId) => staticSalons.find(s => s.id === salonId);

  const getBarState = (barId) => barStates[barId] || null;

  const updateBarState = (barId, state) => {
    saveBarState(barId, state);
    setBarStates(prev => ({ ...prev, [barId]: state }));
  };

  return {
    salons: staticSalons,
    activeSalons,
    joinedSalons,
    selectedSalon,
    join,
    openSalon,
    getSalon,
    getBarState,
    updateBarState,
  };
}
