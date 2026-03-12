/**
 * SESSION STORE
 *
 * Gère l'état de la session utilisateur : connexion, profil courant, mode admin.
 * Remplace les useState currentUser, authMode, signupEmail, signupPassword de App.jsx.
 */

import { create } from 'zustand';
import { awardDailyLogin } from '../utils/pointsSystem';
import { getUserDay } from '../utils/onboarding';

const CURRENT_USER_KEY = 'jeutaime_current_user';
const USERS_KEY = 'jeutaime_users';

export const useSessionStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  currentUser: null,
  authMode: null,          // null | 'signup-profile'
  signupEmail: '',
  signupPassword: '',
  userDay: 0,

  // ── Computed helpers ─────────────────────────────────────────────────────
  isLoggedIn: () => get().currentUser !== null,

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Restaure la session depuis localStorage au démarrage.
   * Applique aussi les migrations de données utilisateur si nécessaire.
   */
  restoreSession: () => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (!saved) return;

    const user = JSON.parse(saved);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const fresh = users.find(u => u.email === user.email);
    const activeUser = fresh || user;

    // Bonus quotidien
    const awarded = awardDailyLogin(activeUser.email);
    if (awarded) {
      const updated = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
      if (updated) {
        set({ currentUser: updated, userDay: getUserDay(updated.email) });
        return;
      }
    }

    set({
      currentUser: activeUser,
      userDay: getUserDay(activeUser.email),
    });
  },

  /**
   * Connecte un utilisateur et sauvegarde la session.
   */
  login: (user) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    const awarded = awardDailyLogin(user.email);
    let activeUser = user;
    if (awarded) {
      const updated = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
      if (updated) activeUser = updated;
    }
    set({
      currentUser: activeUser,
      authMode: null,
      userDay: getUserDay(activeUser.email),
    });
  },

  /**
   * Lance le flow d'inscription (étape profil).
   */
  startSignup: (email, password) => {
    set({ signupEmail: email, signupPassword: password, authMode: 'signup-profile' });
  },

  /**
   * Finalise la création de profil.
   */
  completeProfile: (user) => {
    set({ currentUser: user, authMode: null, userDay: getUserDay(user.email) });
  },

  /**
   * Déconnecte l'utilisateur et nettoie la session.
   */
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    set({ currentUser: null, authMode: null, userDay: 0 });
  },

  /**
   * Met à jour le currentUser (après modification de profil, points, etc.).
   */
  updateUser: (updates) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));

    // Mettre à jour aussi dans la liste des users
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = users.findIndex(u => u.email === updated.email);
    if (idx !== -1) {
      users[idx] = updated;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    set({ currentUser: updated });
  },
}));
