import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomeScreen from './components/screens/HomeScreen';
import ProfilesScreen from './components/screens/ProfilesScreen';
import SocialScreen from './components/screens/SocialScreen';
import LettersScreen from './components/screens/LettersScreen';
import JournalScreen from './components/screens/JournalScreen';
import MemoriesScreen from './components/screens/MemoriesScreen';
import BadgesScreen from './components/screens/BadgesScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import PhotoBookScreen from './components/screens/PhotoBookScreen';
import BarDetailScreen from './components/screens/BarDetailScreen';
import RankingScreen from './components/screens/RankingScreen';
import BarsScreen from './components/screens/BarsScreen';
import ReferralScreen from './components/screens/ReferralScreen';
import CollaborationsScreen from './components/screens/CollaborationsScreen';

// Games
import PongGame from './components/games/PongGame';
import WhackAMoleGame from './components/games/WhackAMoleGame';
import BrickBreakerGame from './components/games/BrickBreakerGame';
import MorpionGame from './components/games/MorpionGame';
import CardGame from './components/games/CardGame';
import StoryTimeGame from './components/games/StoryTimeGame';
import BattleshipGame from './components/games/BattleshipGame';

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

// Ad system
import { shouldShowAd, markAdAsShown, getRandomAd } from './utils/adSystem';
import AdOverlay from './components/AdOverlay';

// Data
import { bars } from './data/appData';

function MainApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); // null, 'signup-profile'
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [screen, setScreen] = useState('home');
  const [socialTab, setSocialTab] = useState(null);
  const [gameScreen, setGameScreen] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);
  const [barTab, setBarTab] = useState('discuss');
  const [userCoins, setUserCoins] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(0);
  const [premiumActive, setPremiumActive] = useState(false);
  const [joinedBars, setJoinedBars] = useState([1]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);

  const { isAdminAuthenticated } = useAdmin();

  // Check if user is already logged in
  useEffect(() => {
    // Initialiser les profils démo (bots) au démarrage
    initializeDemoUsers();

    const savedUser = localStorage.getItem('jeutaime_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setUserCoins(user.coins || 100);
      setPremiumActive(user.premium || false);

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

      // Vérifier si l'utilisateur doit voir une pub
      if (shouldShowAd()) {
        const ad = getRandomAd();
        setCurrentAd(ad);
        setShowAd(true);
        markAdAsShown();
      }
    }
  }, []);

  // Synchroniser userCoins et premium avec currentUser
  useEffect(() => {
    if (currentUser) {
      setUserCoins(currentUser.coins || 0);
      setPremiumActive(currentUser.premium || false);
    }
  }, [currentUser]);

  // Reset selectedBar when screen changes (to allow navigation)
  useEffect(() => {
    if (selectedBar && screen !== 'bars') {
      setSelectedBar(null);
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

    // Vérifier si l'utilisateur doit voir une pub
    if (shouldShowAd()) {
      const ad = getRandomAd();
      setCurrentAd(ad);
      setShowAd(true);
      markAdAsShown();
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
    { icon: '🏠', label: 'Accueil', id: 'home' },
    { icon: '👤', label: 'Profils', id: 'profiles' },
    { icon: '👥', label: 'Social', id: 'social' },
    { icon: '💌', label: 'Lettres', id: 'letters' },
    { icon: '📰', label: 'Journal', id: 'journal' },
    { icon: '⚙️', label: 'Paramètres', id: 'settings' }
  ];

  const appState = {
    screen, setScreen,
    socialTab, setSocialTab,
    gameScreen, setGameScreen,
    selectedBar, setSelectedBar,
    barTab, setBarTab,
    userCoins, setUserCoins,
    setCurrentUser,
    currentProfile, setCurrentProfile,
    premiumActive, setPremiumActive,
    joinedBars, setJoinedBars,
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
    onLogout: handleLogout
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
      minHeight: '100vh',
      color: 'white',
      fontFamily: '-apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      {screen === 'home' && !gameScreen && !selectedBar && <HomeScreen {...appState} />}
      {screen === 'profiles' && !gameScreen && !selectedBar && <ProfilesScreen {...appState} />}
      {screen === 'social' && !gameScreen && !selectedBar && <SocialScreen {...appState} currentUser={currentUser} />}
      {screen === 'bars' && !gameScreen && !selectedBar && <BarsScreen setScreen={setScreen} setGameScreen={setGameScreen} setSelectedBar={setSelectedBar} currentUser={currentUser} />}
      {screen === 'referral' && !gameScreen && !selectedBar && <ReferralScreen currentUser={currentUser} />}
      {screen === 'letters' && !gameScreen && !selectedBar && <LettersScreen currentUser={currentUser} />}
      {screen === 'memories' && !gameScreen && !selectedBar && <MemoriesScreen currentUser={currentUser} setScreen={setScreen} />}
      {screen === 'photobook' && !gameScreen && !selectedBar && <PhotoBookScreen currentUser={currentUser} setScreen={setScreen} />}
      {screen === 'collaborations' && !gameScreen && !selectedBar && <CollaborationsScreen currentUser={currentUser} setScreen={setScreen} />}
      {screen === 'journal' && !gameScreen && !selectedBar && <JournalScreen {...appState} />}
      {screen === 'settings' && !gameScreen && !selectedBar && <SettingsScreen {...appState} />}

      {gameScreen === 'pong' && <PongGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'reactivity' && <WhackAMoleGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'brickbreaker' && <BrickBreakerGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'morpion' && <MorpionGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'cards' && <CardGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'storytime' && <StoryTimeGame {...appState} currentUser={currentUser} />}
      {gameScreen === 'battleship' && <BattleshipGame {...appState} currentUser={currentUser} />}

      {selectedBar && <BarDetailScreen {...appState} bar={bars.find(b => b.id === selectedBar)} />}

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

      {/* Publicité au lancement */}
      {showAd && currentAd && (
        <AdOverlay
          ad={currentAd}
          onClose={() => setShowAd(false)}
        />
      )}
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
