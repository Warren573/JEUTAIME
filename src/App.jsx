import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeScreen from './components/screens/HomeScreen';
import ProfilesScreen from './components/screens/ProfilesScreen';
import SocialScreen from './components/screens/SocialScreen';
import LettersScreen from './components/screens/LettersScreen';
import JournalScreen from './components/screens/JournalScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import BarDetailScreen from './components/screens/BarDetailScreen';

// Games
import HeroLoveQuest from './components/games/HeroLoveQuest';
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

// Helper function for HeroLove Quest
function rnd(min=1,max=6){ return Math.floor(Math.random()*(max-min+1))+min; }

function MainApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); // null, 'signup-profile'
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [screen, setScreen] = useState('home');
  const [socialTab, setSocialTab] = useState('bars');
  const [gameScreen, setGameScreen] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);
  const [barTab, setBarTab] = useState('discuss');
  const [userCoins, setUserCoins] = useState(5245);
  const [currentProfile, setCurrentProfile] = useState(0);
  const [premiumActive, setPremiumActive] = useState(false);
  const [joinedBars, setJoinedBars] = useState([1]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  const { isAdminAuthenticated } = useAdmin();

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('jeutaime_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setUserCoins(user.coins || 100);
      setPremiumActive(user.premium || false);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setUserCoins(user.coins || 100);
    setPremiumActive(user.premium || false);
    localStorage.setItem('jeutaime_current_user', JSON.stringify(user));
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

  // HeroLove Quest states
  const [heroPlayer, setHeroPlayer] = useState({
    name: "Aventurier·e",
    pos: {x:0,y:0},
    charm: 2,
    wit: 1,
    humor: 2,
    courage: 2,
    confidence: 10,
    coinsEarned: 0,
    monstersDefeated: 0
  });
  const [heroMessage, setHeroMessage] = useState("🎮 Commence ton aventure romantique !");
  const [heroGridSize] = useState(7);
  const [heroGameOver, setHeroGameOver] = useState(false);
  const [heroVictory, setHeroVictory] = useState(false);

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
    heroPlayer, setHeroPlayer,
    heroMessage, setHeroMessage,
    heroGridSize,
    heroGameOver, setHeroGameOver,
    heroVictory, setHeroVictory,
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
    rnd
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
    <div style={{ maxWidth: '430px', margin: '0 auto', background: '#000', minHeight: '100vh', color: 'white', fontFamily: '-apple-system, sans-serif', paddingBottom: '100px' }}>
      <Header userCoins={userCoins} adminMode={adminMode} isAdminAuthenticated={isAdminAuthenticated} />

      <div style={{ padding: '25px 20px' }}>
        {screen === 'home' && !gameScreen && !selectedBar && <HomeScreen {...appState} />}
        {screen === 'profiles' && !gameScreen && !selectedBar && <ProfilesScreen {...appState} />}
        {screen === 'social' && !gameScreen && !selectedBar && <SocialScreen {...appState} />}
        {screen === 'letters' && !gameScreen && !selectedBar && <LettersScreen {...appState} />}
        {screen === 'journal' && !gameScreen && !selectedBar && <JournalScreen {...appState} />}
        {screen === 'settings' && !gameScreen && !selectedBar && <SettingsScreen {...appState} />}

        {gameScreen === 'herolove' && <HeroLoveQuest {...appState} />}
        {gameScreen === 'pong' && <PongGame {...appState} />}
        {gameScreen === 'reactivity' && <WhackAMoleGame {...appState} />}
        {gameScreen === 'brickbreaker' && <BrickBreakerGame {...appState} />}
        {gameScreen === 'morpion' && <MorpionGame {...appState} />}
        {gameScreen === 'cards' && <CardGame {...appState} />}
        {gameScreen === 'storytime' && <StoryTimeGame {...appState} />}

        {selectedBar && <BarDetailScreen {...appState} />}
      </div>

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
