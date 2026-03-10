/**
 * UI STORE
 *
 * Gère la navigation et les états d'interface : écran actif, onglets,
 * salon sélectionné, jeu actif, panneau admin.
 * Remplace screen, socialTab, gameScreen, selectedSalon, barTab,
 * showAdminPanel, adminMode dans App.jsx.
 */

import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // ── Navigation ────────────────────────────────────────────────────────────
  screen: 'home',
  socialTab: null,
  gameScreen: null,
  selectedSalon: null,
  barTab: 'discuss',
  joinedSalons: [1],

  // ── Admin ─────────────────────────────────────────────────────────────────
  showAdminPanel: false,
  adminMode: false,

  // ── Onboarding ────────────────────────────────────────────────────────────
  showOnboardingMessage: false,

  // ── Actions navigation ────────────────────────────────────────────────────

  setScreen: (screen) => {
    const { selectedSalon, gameScreen } = get();
    set({
      screen,
      // Reset salon si on quitte bars
      selectedSalon: screen !== 'bars' ? null : selectedSalon,
      // Reset jeu si on quitte social
      gameScreen: screen !== 'social' ? null : gameScreen,
    });
  },

  setSocialTab: (tab) => {
    const { gameScreen } = get();
    set({
      socialTab: tab,
      // Reset jeu si on change d'onglet social
      gameScreen: tab !== 'games' ? null : gameScreen,
    });
  },

  setGameScreen: (game) => set({ gameScreen: game }),

  setSelectedSalon: (salonId) => set({ selectedSalon: salonId }),

  setBarTab: (tab) => set({ barTab: tab }),

  setJoinedSalons: (salons) => set({ joinedSalons: salons }),

  joinSalon: (salonId) => set(state => ({
    joinedSalons: state.joinedSalons.includes(salonId)
      ? state.joinedSalons
      : [...state.joinedSalons, salonId],
  })),

  // ── Actions admin ─────────────────────────────────────────────────────────

  setShowAdminPanel: (show) => set({ showAdminPanel: show }),

  toggleAdminMode: () => set(state => ({ adminMode: !state.adminMode })),

  setAdminMode: (mode) => set({ adminMode: mode }),

  // ── Onboarding ────────────────────────────────────────────────────────────

  setShowOnboardingMessage: (show) => set({ showOnboardingMessage: show }),
}));
