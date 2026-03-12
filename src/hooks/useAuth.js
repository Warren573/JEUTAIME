/**
 * useAuth — Hook d'authentification
 *
 * Façade sur sessionStore pour les composants qui ont besoin de l'auth.
 * Utilisé par : AuthScreen, ProfileCreation, SettingsScreen, Header
 */

import { useSessionStore } from '../store/sessionStore';
import { useEconomyStore } from '../store/economyStore';

export function useAuth() {
  const {
    currentUser,
    authMode,
    signupEmail,
    signupPassword,
    userDay,
    login,
    startSignup,
    completeProfile,
    logout,
    updateUser,
  } = useSessionStore();

  const { syncFromUser } = useEconomyStore();

  const handleLogin = (user) => {
    login(user);
    syncFromUser(user);
  };

  const handleSignup = (email, password) => {
    startSignup(email, password);
  };

  const handleProfileComplete = (user) => {
    completeProfile(user);
    syncFromUser(user);
  };

  const handleLogout = () => {
    logout();
  };

  // Mise à jour partielle du profil
  const handleUpdateUser = (updates) => {
    updateUser(updates);
    syncFromUser({ ...currentUser, ...updates });
  };

  return {
    currentUser,
    authMode,
    signupEmail,
    signupPassword,
    userDay,
    isLoggedIn: !!currentUser,
    login: handleLogin,
    startSignup: handleSignup,
    completeProfile: handleProfileComplete,
    logout: handleLogout,
    updateUser: handleUpdateUser,
  };
}
