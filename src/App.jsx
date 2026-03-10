import React, { useState, useEffect } from 'react';
import HomeScreen from './components/screens/HomeScreen';
import EspacePersoScreenSimple from './components/screens/EspacePersoScreenSimple';
import ProfilesScreen from './components/screens/ProfilesScreen';
import SocialScreen from './components/screens/SocialScreen';
import LettersScreen from './components/screens/LettersScreen';
import JournalScreen from './components/screens/JournalScreen';
import MemoriesScreen from './components/screens/MemoriesScreen';
import BadgesScreen from './components/screens/BadgesScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import BarDetailScreen from './components/screens/BarDetailScreen';
import RankingScreen from './components/screens/RankingScreen';
import BarsScreen from './components/screens/BarsScreen';
import ReferralScreen from './components/screens/ReferralScreen';
import DemoEffectsScreen from './components/screens/DemoEffectsScreen';
import AvatarEditor from './avatar/AvatarEditor';

// Games
import PongGame from './components/games/PongGame';
import WhackAMoleGame from './components/games/WhackAMoleGame';
import BrickBreakerGame from './components/games/BrickBreakerGame';
import MorpionGame from './components/games/MorpionGame';
import CardGame from './components/games/CardGame';
import StoryTimeGame from './components/games/StoryTimeGame';

// Admin
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';

// AppShell
import AppShell from './components/AppShell';

// Auth
import AuthScreen from './components/auth/AuthScreen';
import ProfileCreation from './components/auth/ProfileCreation';

// Stores
import { useSessionStore } from './store/sessionStore';
import { useUIStore } from './store/uiStore';
import { useEconomyStore } from './store/economyStore';

// Demo users & pets
import { initializeDemoUsers } from './utils/demoUsers';
import { initializeDemoPets } from './utils/petsSystem';

// Onboarding
import { isFeatureUnlocked } from './utils/onboarding';

// Data
import { salons } from './data/appData';

// Effect Engine - Auto-cleanup
import { startAutoCleanup } from './engine/EffectEngine';

// Debug
import LogOverlay from './components/debug/LogOverlay';

function MainApp() {
  const { isAdminAuthenticated } = useAdmin();

  // ── Session store ──────────────────────────────────────────────────────────
  const {
    currentUser,
    authMode,
    signupEmail,
    userDay,
    restoreSession,
    login,
    startSignup,
    completeProfile,
    logout,
    updateUser,
  } = useSessionStore();

  // ── UI store ───────────────────────────────────────────────────────────────
  const {
    screen, setScreen,
    socialTab, setSocialTab,
    gameScreen, setGameScreen,
    selectedSalon, setSelectedSalon,
    barTab, setBarTab,
    joinedSalons, setJoinedSalons,
    showAdminPanel, setShowAdminPanel,
    adminMode, setAdminMode, toggleAdminMode,
  } = useUIStore();

  // ── Economy store ─────────────────────────────────────────────────────────
  const {
    userCoins, setUserCoins,
    premiumActive, setPremiumActive,
    syncFromUser,
    reactivityScore, setReactivityScore,
    reactivityReady, setReactivityReady,
    brickScore, setBrickScore,
    morpionBoard, setMorpionBoard,
    morpionTurn, setMorpionTurn,
    storyText, setStoryText,
    storyInput, setStoryInput,
    cardSymbols, setCardSymbols,
    cardRevealed, setCardRevealed,
    cardGains, setCardGains,
    cardGameOver, setCardGameOver,
    cardMessage, setCardMessage,
    moleBestScore, setMoleBestScore,
  } = useEconomyStore();

  // ── État local résiduel (migré en step 4) ─────────────────────────────────
  const [currentProfile, setCurrentProfile] = useState(0);
  const [myLetters, setMyLetters] = useState([
    { id: 1, name: 'Alice', lastMsg: 'C\'était super nos derniers échanges!', lastDate: '2h', unread: true },
    { id: 2, name: 'Sophie', lastMsg: 'Tu as vu mon dernier message?', lastDate: '1j', unread: false },
  ]);

  // ── Init au démarrage ──────────────────────────────────────────────────────
  useEffect(() => {
    // Initialiser les profils démo (bots) au démarrage
    initializeDemoUsers();
    initializeDemoPets();

    // Migrations de données utilisateur
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    let migrated = false;

    users.forEach((user, index) => {
      if (!user.interestedIn && !user.isBot) {
        user.interestedIn = user.gender === 'Homme' ? 'Femmes' : user.gender === 'Femme' ? 'Hommes' : 'Tout le monde';
        user.lookingFor = 'Advienne que pourra';
        user.children = 'Je n\'ai pas d\'enfant';
        user.physicalDescription = 'moyenne';
        migrated = true;
      }
      if (!user.id) {
        const hash = user.email.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
        user.id = Math.abs(hash) + index;
        migrated = true;
      }
    });

    if (migrated) {
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
    }

    // Restaurer la session depuis localStorage
    restoreSession();

    // Cleanup des effets expirés
    return startAutoCleanup();
  }, []);

  // Sync economy state avec currentUser
  useEffect(() => {
    syncFromUser(currentUser);
  }, [currentUser]);

  // ── Handlers auth ─────────────────────────────────────────────────────────

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

  // setCurrentUser compatible pour les composants enfants qui l'appellent directement
  const setCurrentUser = (userOrUpdater) => {
    if (typeof userOrUpdater === 'function') {
      const next = userOrUpdater(currentUser);
      updateUser(next);
      syncFromUser(next);
    } else {
      updateUser(userOrUpdater);
      syncFromUser(userOrUpdater);
    }
  };

  // ── Routing guards ─────────────────────────────────────────────────────────
  if (!currentUser && authMode !== 'signup-profile') {
    return <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (authMode === 'signup-profile') {
    return <ProfileCreation email={signupEmail} onComplete={handleProfileComplete} />;
  }

  if (showAdminPanel && !isAdminAuthenticated) {
    return <AdminLogin />;
  }

  if (showAdminPanel && isAdminAuthenticated) {
    return <AdminLayout onExit={() => setShowAdminPanel(false)} />;
  }

  // ── appState — interface rétrocompatible pour les composants existants ────
  const appState = {
    screen, setScreen,
    socialTab, setSocialTab,
    gameScreen, setGameScreen,
    selectedSalon, setSelectedSalon,
    barTab, setBarTab,
    userCoins, setUserCoins,
    setCurrentUser,
    currentProfile, setCurrentProfile,
    premiumActive, setPremiumActive,
    joinedSalons, setJoinedSalons,
    reactivityScore, setReactivityScore,
    reactivityReady, setReactivityReady,
    brickScore, setBrickScore,
    morpionBoard, setMorpionBoard,
    morpionTurn, setMorpionTurn,
    storyText, setStoryText,
    storyInput, setStoryInput,
    cardSymbols, setCardSymbols,
    cardRevealed, setCardRevealed,
    cardGains, setCardGains,
    cardGameOver, setCardGameOver,
    cardMessage, setCardMessage,
    moleBestScore, setMoleBestScore,
    myLetters, setMyLetters,
    showAdminPanel, setShowAdminPanel,
    adminMode, setAdminMode,
    isAdminAuthenticated,
    currentUser,
    onLogout: handleLogout,
    userDay,
    isFeatureUnlocked: (feature) => isFeatureUnlocked(currentUser?.email, feature),
  };

  const navItems = [
    { icon: '⭐', label: 'Accueil', id: 'home' },
    { icon: '🔍', label: 'Profils', id: 'profiles' },
    { icon: '👥', label: 'Social', id: 'social' },
    { icon: '💌', label: 'Lettres', id: 'letters' },
    { icon: '📰', label: 'Journal', id: 'journal' },
    { icon: '⚙️', label: 'Plus', id: 'settings' },
  ];

  return (
    <AppShell navItems={navItems} screen={screen} setScreen={setScreen} hideNav={!!selectedSalon}>
      {screen === 'home' && !gameScreen && !selectedSalon && <EspacePersoScreenSimple {...appState} />}
      {screen === 'profiles' && !gameScreen && !selectedSalon && <ProfilesScreen {...appState} />}
      {screen === 'social' && !gameScreen && !selectedSalon && <SocialScreen {...appState} currentUser={currentUser} />}
      {screen === 'bars' && !gameScreen && !selectedSalon && <BarsScreen setScreen={setScreen} setGameScreen={setGameScreen} setSelectedSalon={setSelectedSalon} currentUser={currentUser} />}
      {screen === 'referral' && !gameScreen && !selectedSalon && <ReferralScreen currentUser={currentUser} />}
      {screen === 'letters' && !gameScreen && !selectedSalon && <LettersScreen currentUser={currentUser} setScreen={setScreen} />}
      {screen === 'memories' && !gameScreen && !selectedSalon && <MemoriesScreen currentUser={currentUser} setScreen={setScreen} />}
      {screen === 'journal' && !gameScreen && !selectedSalon && <JournalScreen {...appState} />}
      {screen === 'settings' && !gameScreen && !selectedSalon && <SettingsScreen {...appState} setScreen={setScreen} />}
      {screen === 'demo-effects' && !gameScreen && !selectedSalon && <DemoEffectsScreen currentUser={currentUser} onBack={() => setScreen('settings')} />}
      {screen === 'avatar-editor' && !gameScreen && !selectedSalon && <AvatarEditor currentUser={currentUser} onBack={() => setScreen('settings')} />}

      {gameScreen === 'pong' && <PongGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'reactivity' && <WhackAMoleGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'brickbreaker' && <BrickBreakerGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'morpion' && <MorpionGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'cards' && <CardGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'storytime' && <StoryTimeGame {...appState} currentUser={currentUser} />}

      {selectedSalon && <BarDetailScreen {...appState} salon={salons.find(s => s.id === selectedSalon)} />}

      {/* Admin Mode Toggle */}
      {isAdminAuthenticated && (
        <button
          onClick={toggleAdminMode}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: adminMode ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#1a1a1a',
            border: adminMode ? '3px solid #667eea' : '3px solid #333',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            transition: 'all 0.3s',
          }}
          title={adminMode ? 'Désactiver mode admin' : 'Activer mode admin'}
        >
          {adminMode ? '🛡️' : '🔒'}
        </button>
      )}

      <LogOverlay />
    </AppShell>
  );
}

export default function JeuTaimeApp() {
  return (
    <AdminProvider>
      <MainApp />
    </AdminProvider>
  );
}
