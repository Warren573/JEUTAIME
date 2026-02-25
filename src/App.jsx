import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomeScreen from './components/screens/HomeScreen';
import EspacePersoScreen from './components/screens/EspacePersoScreen';
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

// Auth
import AuthScreen from './components/auth/AuthScreen';
import ProfileCreation from './components/auth/ProfileCreation';

// Points system
import { awardDailyLogin } from './utils/pointsSystem';

// Demo users
import { initializeDemoUsers } from './utils/demoUsers';

// Demo pets
import { initializeDemoPets } from './utils/petsSystem';

// Onboarding progressif
import { getUserDay, isFeatureUnlocked, getOnboardingMessage } from './utils/onboarding';

// Event tracking
import { initDemoEvents, trackLogin } from './utils/eventTracker';

// Data
import { salons } from './data/appData';

// Effect Engine - Auto-cleanup
import { startAutoCleanup } from './engine/EffectEngine';

// Debug
import LogOverlay from './components/debug/LogOverlay';

function MainApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); // null, 'signup-profile'
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [screen, setScreen] = useState('home');
  const [socialTab, setSocialTab] = useState(null);
  const [gameScreen, setGameScreen] = useState(null);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [barTab, setBarTab] = useState('discuss');
  const [userCoins, setUserCoins] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(0);
  const [premiumActive, setPremiumActive] = useState(false);
  const [joinedSalons, setJoinedSalons] = useState([1]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [userDay, setUserDay] = useState(0);
  const [showOnboardingMessage, setShowOnboardingMessage] = useState(false);

  const { isAdminAuthenticated } = useAdmin();

  // Check if user is already logged in
  useEffect(() => {
    console.log('🚀 JEUTAIME v2.0.0 - DATING PREFERENCES - Démarrage de l\'application...');
    console.log('📅 Build: 2025-12-06T17:00:00Z');
    console.log('✅ Nouvelles fonctionnalités: Préférences de rencontre, Description physique');

    // Initialiser les profils démo (bots) au démarrage
    initializeDemoUsers();

    // Initialiser les animaux de démo pour tester
    initializeDemoPets();

    // MIGRATION: Ajouter les préférences et IDs manquants
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    let updated = false;

    users.forEach((user, index) => {
      // Migration 1: Ajouter les préférences par défaut
      if (!user.interestedIn && !user.isBot) {
        user.interestedIn = user.gender === 'Homme' ? 'Femmes' : user.gender === 'Femme' ? 'Hommes' : 'Tout le monde';
        user.lookingFor = 'Advienne que pourra';
        user.children = 'Je n\'ai pas d\'enfant';
        user.physicalDescription = 'moyenne';
        updated = true;
      }

      // Migration 2: Ajouter un ID unique si manquant
      if (!user.id) {
        // Générer un ID déterministe basé sur l'email + index
        const hash = user.email.split('').reduce((acc, char) => {
          return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);
        user.id = Math.abs(hash) + index;
        console.log(`🔧 Migration: ID ${user.id} assigné à ${user.pseudo || user.email}`);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      console.log('✅ Migrations complétées (préférences + IDs)');
    }

    const savedUser = localStorage.getItem('jeutaime_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);

      // Mettre à jour le currentUser avec les préférences par défaut si nécessaire
      const updatedUserFromStorage = users.find(u => u.email === user.email);
      if (updatedUserFromStorage) {
        setCurrentUser(updatedUserFromStorage);
        localStorage.setItem('jeutaime_current_user', JSON.stringify(updatedUserFromStorage));
        setUserCoins(updatedUserFromStorage.coins || 100);
        setPremiumActive(updatedUserFromStorage.premium || false);
      } else {
        setCurrentUser(user);
        setUserCoins(user.coins || 100);
        setPremiumActive(user.premium || false);
      }

      // Award daily login points
      const awarded = awardDailyLogin(user.email);
      if (awarded) {
        console.log('🎁 Bonus quotidien reçu ! +10 points');
        // Reload user to get updated points
        const updatedUser = JSON.parse(localStorage.getItem('jeutaime_current_user'));
        if (updatedUser) {
          setCurrentUser(updatedUser);
        }
      }

      // Initialiser les événements de démo si nécessaire
      initDemoEvents(user.email);

      // Tracker la connexion
      trackLogin(user.email, user.pseudo || user.name);
    }
  }, []);

  // Synchroniser userCoins et premium avec currentUser
  useEffect(() => {
    if (currentUser) {
      setUserCoins(currentUser.coins || 0);
      setPremiumActive(currentUser.premium || false);
    }
  }, [currentUser]);

  // Tracker le jour d'onboarding de l'utilisateur
  useEffect(() => {
    if (currentUser?.email) {
      const day = getUserDay(currentUser.email);
      setUserDay(day);
      console.log(`📅 Jour d'onboarding: ${day}`);
    }
  }, [currentUser]);

  // Auto-cleanup des effets expirés (EffectEngine)
  useEffect(() => {
    const cleanup = startAutoCleanup();
    return cleanup; // Cleanup on unmount
  }, []);

  // Reset selectedSalon when screen changes (to allow navigation)
  useEffect(() => {
    if (selectedSalon && screen !== 'bars') {
      setSelectedSalon(null);
    }
  }, [screen]);

  // Reset gameScreen when screen changes (to allow navigation from games)
  useEffect(() => {
    if (gameScreen && screen !== 'social') {
      setGameScreen(null);
    }
  }, [screen]);

  // Reset gameScreen when socialTab changes (to allow navigation within social)
  useEffect(() => {
    if (gameScreen && socialTab !== 'games') {
      setGameScreen(null);
    }
  }, [socialTab]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setUserCoins(user.coins || 100);
    setPremiumActive(user.premium || false);
    localStorage.setItem('jeutaime_current_user', JSON.stringify(user));

    // Award daily login points
    const awarded = awardDailyLogin(user.email);
    if (awarded) {
      console.log('🎁 Bonus quotidien reçu ! +10 points');
      // Reload user to get updated points
      const updatedUser = JSON.parse(localStorage.getItem('jeutaime_current_user'));
      if (updatedUser) {
        setCurrentUser(updatedUser);
        setUserCoins(updatedUser.coins || 100);
      }
    }
  };

  const handleSignup = (email, password) => {
    setSignupEmail(email);
    setSignupPassword(password);
    setAuthMode('signup-profile');
  };

  const handleProfileComplete = (user) => {
    setCurrentUser(user);
    setUserCoins(user.coins || 100);
    setPremiumActive(user.premium || false);
    setAuthMode(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jeutaime_current_user');
  };

  // Game states
  const [reactivityScore, setReactivityScore] = useState(0);
  const [reactivityReady, setReactivityReady] = useState(false);
  const [brickScore, setBrickScore] = useState(0);
  const [morpionBoard, setMorpionBoard] = useState(Array(9).fill(null));
  const [morpionTurn, setMorpionTurn] = useState('X');
  const [storyText, setStoryText] = useState('Il était une fois...');
  const [storyInput, setStoryInput] = useState('');

  // Card Game states
  const [cardSymbols, setCardSymbols] = useState([]);
  const [cardRevealed, setCardRevealed] = useState([]);
  const [cardGains, setCardGains] = useState(0);
  const [cardGameOver, setCardGameOver] = useState(false);
  const [cardMessage, setCardMessage] = useState('');

  // Whack A Mole state
  const [moleBestScore, setMoleBestScore] = useState(0);

  // Letters
  const [myLetters, setMyLetters] = useState([
    { id: 1, name: 'Alice', lastMsg: 'C\'était super nos derniers échanges!', lastDate: '2h', unread: true },
    { id: 2, name: 'Sophie', lastMsg: 'Tu as vu mon dernier message?', lastDate: '1j', unread: false },
  ]);

  const navItems = [
    { icon: '⭐', label: 'Accueil', id: 'home' },
    { icon: '🔍', label: 'Profils', id: 'profiles' },
    { icon: '👥', label: 'Social', id: 'social' },
    { icon: '💌', label: 'Lettres', id: 'letters' },
    { icon: '📰', label: 'Journal', id: 'journal' },
    { icon: '⚙️', label: 'Plus', id: 'settings' }
  ];

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
    isFeatureUnlocked: (feature) => isFeatureUnlocked(currentUser?.email, feature)
  };

  // Show auth screen if not logged in
  if (!currentUser && authMode !== 'signup-profile') {
    return <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />;
  }

  // Show profile creation if in signup mode
  if (authMode === 'signup-profile') {
    return <ProfileCreation email={signupEmail} onComplete={handleProfileComplete} />;
  }

  // If admin panel is shown and user is not authenticated, show login
  if (showAdminPanel && !isAdminAuthenticated) {
    return <AdminLogin />;
  }

  // If admin panel is shown and user is authenticated, show admin panel
  if (showAdminPanel && isAdminAuthenticated) {
    return <AdminLayout onExit={() => setShowAdminPanel(false)} />;
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '100vw',
      margin: '0 auto',
      background: '#000',
      minHeight: '100dvh',
      color: 'white',
      fontFamily: '-apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      {screen === 'home' && !gameScreen && !selectedSalon && <EspacePersoScreenSimple {...appState} />}
      {screen === 'profiles' && !gameScreen && !selectedSalon && <ProfilesScreen {...appState} />}
      {screen === 'social' && !gameScreen && !selectedSalon && <SocialScreen {...appState} currentUser={currentUser} />}
      {screen === 'bars' && !gameScreen && !selectedSalon && <BarsScreen setScreen={setScreen} setGameScreen={setGameScreen} setSelectedSalon={setSelectedSalon} currentUser={currentUser} />}
      {screen === 'referral' && !gameScreen && !selectedSalon && <ReferralScreen currentUser={currentUser} />}
      {screen === 'letters' && !gameScreen && !selectedSalon && <LettersScreen currentUser={currentUser} />}
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

      <Navigation navItems={navItems} screen={screen} setScreen={setScreen} />

      {/* Admin Mode Toggle - Floating Button */}
      {isAdminAuthenticated && (
        <button
          onClick={() => setAdminMode(!adminMode)}
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
            transition: 'all 0.3s'
          }}
          title={adminMode ? 'Désactiver mode admin' : 'Activer mode admin'}
        >
          {adminMode ? '🛡️' : '🔒'}
        </button>
      )}

      {/* Debug Log Overlay */}
      <LogOverlay />
    </div>
  );
}

// Wrapper component with AdminProvider
export default function JeuTaimeApp() {
  return (
    <AdminProvider>
      <MainApp />
    </AdminProvider>
  );
}
/* Build: 1763584841 */
