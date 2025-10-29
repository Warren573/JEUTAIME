import React, { useEffect, useState, useCallback } from "react";
import {
  createGame,
  joinGame,
  subscribeToGame,
  performAction,
  findAvailableGames,
  checkWinCondition,
  getPlayerStats
} from '../../services/empires/multiplayerService';
import { isDemoMode } from '../../services/empires/firebaseConfig';

/* ======= CONFIGURATION DES ÉVÉNEMENTS ======= */
const EVENT_CARDS = [
  {
    id: 'e1',
    title: "Tempête d'Éther",
    effect: (players) => players.map(p => ({...p, mana: Math.max(0, p.mana - 3)})),
    desc: "⚡ Tous les joueurs perdent 3 mana",
    color: "from-purple-600 to-violet-700"
  },
  {
    id: 'e2',
    title: "Trésor Enfoui",
    effect: (players, currentIdx) => players.map((p, i) => i === currentIdx ? {...p, mana: p.mana + 8} : p),
    desc: "💎 Vous gagnez 8 mana",
    color: "from-amber-500 to-yellow-600"
  },
  {
    id: 'e3',
    title: "Bénédiction Lunaire",
    effect: (players, currentIdx) => players.map((p, i) => i === currentIdx ? {...p, mana: p.mana + 5} : p),
    desc: "🌙 Vous gagnez 5 mana",
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: 'e4',
    title: "Taxe Impériale",
    effect: (players) => players.map(p => ({...p, mana: Math.max(0, p.mana - 5)})),
    desc: "👑 Tous perdent 5 mana",
    color: "from-red-600 to-rose-700"
  },
  {
    id: 'e5',
    title: "Marché Mystique",
    effect: (players, currentIdx) => players.map((p, i) => i === currentIdx ? {...p, mana: p.mana + 10} : p),
    desc: "🏪 Vous gagnez 10 mana",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 'e6',
    title: "Portail Instable",
    effect: (players, currentIdx) => {
      if (players.length < 2) return players;
      const others = players.filter((_, i) => i !== currentIdx);
      const rnd = others[Math.floor(Math.random() * others.length)];
      return players.map((p, i) => i === currentIdx ? {...p, position: rnd.position} : p);
    },
    desc: "🌀 Téléportation vers un autre joueur",
    color: "from-indigo-600 to-purple-700"
  }
];

const ARTIFACT_TYPES = [
  { id: 'crystal', title: 'Cristal de Mana', desc: '+5 mana', bonus: 5, icon: '💎' },
  { id: 'orb', title: 'Orbe Arcane', desc: '+8 mana', bonus: 8, icon: '🔮' },
  { id: 'amulet', title: 'Amulette Ancienne', desc: '+3 mana', bonus: 3, icon: '📿' },
  { id: 'staff', title: 'Bâton Mystique', desc: '+6 mana', bonus: 6, icon: '🪄' },
  { id: 'tome', title: 'Tome Oublié', desc: '+4 mana', bonus: 4, icon: '📖' }
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ======= COMPOSANT PRINCIPAL ======= */
export default function EmpiresEtheriaIsometric({ currentUser, onBack }) {
  const [gameMode, setGameMode] = useState('lobby'); // lobby, game, victory
  const [gameState, setGameState] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [message, setMessage] = useState("Bienvenue dans les Empires d'Étheria");
  const [dice, setDice] = useState(null);
  const [pendingBuy, setPendingBuy] = useState(null);
  const [event, setEvent] = useState(null);
  const [availableGames, setAvailableGames] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [victoryData, setVictoryData] = useState(null);
  const [showRules, setShowRules] = useState(false);

  // Charger les parties disponibles
  useEffect(() => {
    if (gameMode === 'lobby') {
      loadAvailableGames();
    }
  }, [gameMode]);

  const loadAvailableGames = async () => {
    const games = await findAvailableGames(10);
    setAvailableGames(games);
  };

  // Souscrire aux mises à jour de la partie
  useEffect(() => {
    if (!gameId || gameMode !== 'game') return;

    const unsubscribe = subscribeToGame(gameId, (updatedState) => {
      if (!updatedState) {
        setMessage("La partie n'existe plus");
        return;
      }
      setGameState(updatedState);

      // Vérifier victoire
      const winner = checkWinCondition(updatedState);
      if (winner && gameMode !== 'victory') {
        setVictoryData(winner);
        setGameMode('victory');
      }
    });

    return () => unsubscribe();
  }, [gameId, gameMode]);

  /* ======= GESTION DU LOBBY ======= */
  const handleCreateGame = async () => {
    const playerData = {
      id: currentUser?.id || `player_${Date.now()}`,
      name: currentUser?.name || 'Joueur',
      color: '#6366f1',
      avatar: currentUser?.avatar
    };

    const result = await createGame(playerData, { maxPlayers: 4 });
    if (result) {
      setGameId(result.gameId);
      setGameState(result.gameState);
      setGameMode('game');
      setMessage(`Partie créée ! Code: ${result.gameId.slice(-8)}`);
    }
  };

  const handleJoinGame = async (targetGameId) => {
    const playerData = {
      id: currentUser?.id || `player_${Date.now()}`,
      name: currentUser?.name || 'Joueur',
      color: '#10b981',
      avatar: currentUser?.avatar
    };

    const result = await joinGame(targetGameId, playerData);
    if (result) {
      setGameId(result.gameId);
      setGameState(result.gameState);
      setGameMode('game');
      setMessage(`Vous avez rejoint la partie !`);
    }
  };

  const handleQuickPlay = () => {
    // Mode solo rapide avec bot
    const localState = {
      id: `local_${Date.now()}`,
      status: 'active',
      players: [
        {
          id: currentUser?.id || 'p1',
          name: currentUser?.name || 'Joueur',
          color: '#6366f1',
          position: 0,
          mana: 30,
          artifacts: []
        },
        {
          id: 'bot1',
          name: 'Thoren (Bot)',
          color: '#10b981',
          position: 0,
          mana: 30,
          artifacts: [],
          isBot: true
        }
      ],
      board: initializeLocalBoard(),
      currentPlayerIndex: 0,
      turn: 1
    };

    setGameState(localState);
    setGameMode('game');
    setMessage("Partie solo démarrée !");
  };

  /* ======= LOGIQUE DU JEU ======= */
  const rollDice = useCallback(async () => {
    if (!gameState || isRolling || dice !== null) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== (currentUser?.id || 'p1') && !currentPlayer.isBot) {
      setMessage("Ce n'est pas votre tour !");
      return;
    }

    setIsRolling(true);
    const roll = rand(1, 6);
    setDice(roll);
    setMessage(`🎲 ${currentPlayer.name} lance le dé : ${roll}`);

    // Animation du mouvement
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setGameState(prev => {
        const newPlayers = [...prev.players];
        const player = newPlayers[prev.currentPlayerIndex];
        player.position = (player.position + 1) % prev.board.length;
        return { ...prev, players: newPlayers };
      });

      if (step >= roll) {
        clearInterval(interval);
        setIsRolling(false);
        handleLanding();
      }
    }, 300);
  }, [gameState, dice, isRolling, currentUser]);

  const handleLanding = () => {
    if (!gameState) return;

    const currentIdx = gameState.currentPlayerIndex;
    const player = gameState.players[currentIdx];
    const cell = gameState.board[player.position];

    switch (cell.type) {
      case 'city':
        if (cell.owner == null) {
          setPendingBuy({ playerIndex: currentIdx, pos: player.position });
          setMessage(`${player.name} peut acheter ${cell.name} (${cell.cost} mana)`);
        } else if (cell.owner !== currentIdx) {
          payRent(currentIdx, cell.owner, cell.rent);
        } else {
          setMessage(`${player.name} visite sa propre cité`);
          nextTurn();
        }
        break;

      case 'event':
        triggerEvent(currentIdx);
        break;

      case 'artifact':
        collectArtifact(currentIdx);
        break;

      case 'portal':
        activatePortal(currentIdx);
        break;

      default:
        nextTurn();
    }
  };

  const buyCity = () => {
    if (!pendingBuy || !gameState) return;

    const { playerIndex, pos } = pendingBuy;
    const player = gameState.players[playerIndex];
    const cell = gameState.board[pos];

    if (player.mana < cell.cost) {
      setMessage("Mana insuffisant !");
      setPendingBuy(null);
      nextTurn();
      return;
    }

    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], mana: newPlayers[playerIndex].mana - cell.cost };

      const newBoard = [...prev.board];
      newBoard[pos] = { ...newBoard[pos], owner: playerIndex };

      return { ...prev, players: newPlayers, board: newBoard };
    });

    setMessage(`${player.name} achète ${cell.name} !${cell.legendary ? ' 👑' : ''}`);
    setPendingBuy(null);
    nextTurn();
  };

  const passBuy = () => {
    if (!pendingBuy) return;
    setMessage(`${gameState.players[pendingBuy.playerIndex].name} passe l'achat`);
    setPendingBuy(null);
    nextTurn();
  };

  const payRent = (payerIdx, ownerIdx, amount) => {
    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[payerIdx] = {
        ...newPlayers[payerIdx],
        mana: Math.max(0, newPlayers[payerIdx].mana - amount)
      };
      newPlayers[ownerIdx] = {
        ...newPlayers[ownerIdx],
        mana: newPlayers[ownerIdx].mana + amount
      };
      return { ...prev, players: newPlayers };
    });

    setMessage(`${gameState.players[payerIdx].name} paie ${amount} mana de tribut`);
    nextTurn();
  };

  const triggerEvent = (playerIdx) => {
    const randomEvent = EVENT_CARDS[rand(0, EVENT_CARDS.length - 1)];
    setEvent({ ...randomEvent, playerIdx });
    setMessage(`🎴 ${gameState.players[playerIdx].name} déclenche: ${randomEvent.title}`);
  };

  const applyEvent = () => {
    if (!event || !gameState) return;

    setGameState(prev => {
      let newPlayers = [...prev.players];
      if (event.effect) {
        newPlayers = event.effect(newPlayers, event.playerIdx);
      }
      return { ...prev, players: newPlayers };
    });

    setEvent(null);
    nextTurn();
  };

  const collectArtifact = (playerIdx) => {
    const artifact = ARTIFACT_TYPES[rand(0, ARTIFACT_TYPES.length - 1)];

    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[playerIdx] = {
        ...newPlayers[playerIdx],
        artifacts: [...(newPlayers[playerIdx].artifacts || []), artifact],
        mana: newPlayers[playerIdx].mana + artifact.bonus
      };
      return { ...prev, players: newPlayers };
    });

    setMessage(`${gameState.players[playerIdx].name} trouve ${artifact.icon} ${artifact.title} (+${artifact.bonus} mana)`);
    nextTurn();
  };

  const activatePortal = (playerIdx) => {
    const bonus = rand(3, 10);
    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[playerIdx] = {
        ...newPlayers[playerIdx],
        mana: newPlayers[playerIdx].mana + bonus
      };
      return { ...prev, players: newPlayers };
    });

    setMessage(`✨ ${gameState.players[playerIdx].name} active un portail (+${bonus} mana)`);
    nextTurn();
  };

  const nextTurn = () => {
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
        turn: prev.currentPlayerIndex === prev.players.length - 1 ? prev.turn + 1 : prev.turn
      }));
      setDice(null);

      // Vérifier victoire
      if (gameState) {
        const winner = checkWinCondition(gameState);
        if (winner) {
          setVictoryData(winner);
          setGameMode('victory');
        }
      }
    }, 1500);
  };

  /* ======= CALCUL DES POSITIONS ISOMÉTRIQUES ======= */
  const computeIsometricPositions = (count) => {
    const positions = [];
    const cx = 50, cy = 50;
    const rx = 38, ry = 22;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      const isoY = y - (x - cx) * 0.14;
      positions.push({ x, y: isoY });
    }

    return positions;
  };

  const positions = gameState ? computeIsometricPositions(gameState.board.length) : [];

  /* ======= RENDER LOBBY ======= */
  if (gameMode === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={onBack}
              className="absolute top-4 left-4 text-white/70 hover:text-white text-2xl"
            >
              ← Retour
            </button>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 mb-2 font-serif">
              Empires d'Étheria
            </h1>
            <p className="text-purple-200 text-sm">Version Isométrique Fantasy</p>
          </div>

          {/* Quick Play */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 mb-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              ⚡ Partie Rapide
            </h2>
            <p className="text-indigo-100 mb-4">Jouez immédiatement contre un adversaire IA</p>
            <button
              onClick={handleQuickPlay}
              className="w-full bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-all transform hover:scale-105"
            >
              Démarrer
            </button>
          </div>

          {/* Create Game */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 mb-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              🌟 Créer une Partie
            </h2>
            <p className="text-emerald-100 mb-4">Invitez vos amis à vous rejoindre (2-4 joueurs)</p>
            <button
              onClick={handleCreateGame}
              className="w-full bg-white text-emerald-700 font-bold py-3 px-6 rounded-xl hover:bg-emerald-50 transition-all transform hover:scale-105"
              disabled={isDemoMode && !gameState}
            >
              {isDemoMode ? 'Mode Démo (Local uniquement)' : 'Créer'}
            </button>
          </div>

          {/* Available Games */}
          {!isDemoMode && availableGames.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🎮 Parties Disponibles
              </h2>
              <div className="space-y-3">
                {availableGames.map(game => (
                  <div
                    key={game.id}
                    className="bg-slate-700/50 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-semibold">Partie #{game.id.slice(-6)}</p>
                      <p className="text-slate-300 text-sm">{game.players}/{game.maxPlayers} joueurs</p>
                    </div>
                    <button
                      onClick={() => handleJoinGame(game.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition"
                    >
                      Rejoindre
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Button */}
          <button
            onClick={() => setShowRules(true)}
            className="w-full mt-6 bg-slate-800/50 text-white py-3 rounded-xl hover:bg-slate-700/50 transition"
          >
            📖 Règles du Jeu
          </button>

          {/* Rules Modal */}
          {showRules && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setShowRules(false)}>
              <div className="bg-slate-800 rounded-2xl p-6 max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-4">📖 Règles du Jeu</h2>
                <div className="text-slate-200 space-y-3 text-sm">
                  <div>
                    <h3 className="font-bold text-purple-400 mb-1">🎯 Objectif</h3>
                    <p>Soyez le premier à atteindre <strong>100 mana</strong> ou à contrôler <strong>3 lieux légendaires</strong> 👑</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-400 mb-1">🎲 Déroulement</h3>
                    <p>• Lancez le dé et avancez sur le plateau<br/>
                    • Achetez des cités pour percevoir des tributs<br/>
                    • Collectez des artefacts et activez des portails<br/>
                    • Attention aux événements aléatoires !</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-400 mb-1">🏰 Types de cases</h3>
                    <p>• <strong>Cités</strong>: Achetez-les pour gagner des tributs<br/>
                    • <strong>Événements</strong>: Effets aléatoires<br/>
                    • <strong>Artefacts</strong>: Bonus de mana<br/>
                    • <strong>Portails</strong>: Téléportation et bonus</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-400 mb-1">👑 Lieux Légendaires</h3>
                    <p>Les cités avec une couronne sont des lieux légendaires. Contrôlez-en 3 pour gagner instantanément !</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRules(false)}
                  className="w-full mt-6 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-500"
                >
                  Compris !
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ======= RENDER VICTORY ======= */
  if (gameMode === 'victory' && victoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="text-6xl mb-4">👑</div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Victoire !</h1>
          <p className="text-2xl font-semibold text-amber-800 mb-4">{victoryData.winnerName}</p>
          <p className="text-amber-900 mb-6">{victoryData.message}</p>

          <div className="bg-white/20 rounded-xl p-4 mb-6">
            <p className="text-amber-900 font-semibold">
              {victoryData.reason === 'mana' ? '💎 Victoire par Mana' : '👑 Victoire Légendaire'}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setGameMode('lobby');
                setGameState(null);
                setGameId(null);
                setVictoryData(null);
              }}
              className="w-full bg-amber-900 text-white font-bold py-3 rounded-xl hover:bg-amber-800 transition"
            >
              Nouvelle Partie
            </button>
            <button
              onClick={onBack}
              className="w-full bg-white/20 text-amber-900 font-bold py-3 rounded-xl hover:bg-white/30 transition"
            >
              Retour au Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ======= RENDER JEU ======= */
  if (!gameState) return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">Chargement...</div>;

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === (currentUser?.id || 'p1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-white/70 hover:text-white text-xl"
          >
            ← Quitter
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 font-serif">
              Empires d'Étheria
            </h1>
            <p className="text-xs text-purple-300">Tour {gameState.turn}</p>
          </div>
          <div className="w-8"></div>
        </div>

        {/* Current Player Info */}
        <div className={`rounded-2xl p-4 mb-4 ${isMyTurn ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-slate-700/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-white"
                style={{ backgroundColor: currentPlayer.color }}
              >
                {currentPlayer.name[0]}
              </div>
              <div>
                <p className="text-white font-bold">{currentPlayer.name}</p>
                <p className="text-white/80 text-sm">{currentPlayer.mana} 💎 Mana</p>
              </div>
            </div>
            {isMyTurn && (
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <p className="text-white text-sm font-semibold">Votre tour</p>
              </div>
            )}
          </div>
        </div>

        {/* Board SVG */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 mb-4 shadow-xl">
          <svg
            viewBox="0 0 100 60"
            className="w-full h-auto"
            style={{ minHeight: '300px' }}
          >
            {/* Center decoration */}
            <ellipse cx="50" cy="50" rx="26" ry="14" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.3" opacity="0.4" />
            <text x="50" y="52" fontSize="3.5" textAnchor="middle" fill="#92400e" fontWeight="700" fontFamily="serif">
              ÉTHERIA
            </text>

            {/* Board cells */}
            {gameState.board.map((cell, idx) => {
              const pos = positions[idx];
              const size = cell.type === 'city' ? 5.5 : 4.8;
              const h = size * 0.58;

              let fill = '#e0e7ff'; // default
              if (cell.type === 'city') fill = cell.legendary ? '#fef08a' : '#ddd6fe';
              else if (cell.type === 'event') fill = '#fecaca';
              else if (cell.type === 'artifact') fill = '#bfdbfe';
              else if (cell.type === 'portal') fill = '#d8b4fe';

              const owner = cell.owner != null ? gameState.players[cell.owner]?.color : null;

              const top = `${pos.x},${pos.y - h}`;
              const right = `${pos.x + size},${pos.y}`;
              const bottom = `${pos.x},${pos.y + h}`;
              const left = `${pos.x - size},${pos.y}`;

              return (
                <g key={cell.id}>
                  <polygon
                    points={`${top} ${right} ${bottom} ${left}`}
                    fill={fill}
                    stroke="#78716c"
                    strokeWidth="0.25"
                    opacity="0.95"
                  />

                  {cell.type === 'city' && (
                    <>
                      <text x={pos.x} y={pos.y - 0.5} fontSize="1.2" textAnchor="middle" fill="#1f2937" fontWeight="600">
                        {cell.name.split(' ')[0]}
                      </text>
                      <text x={pos.x} y={pos.y + 1.2} fontSize="0.85" textAnchor="middle" fill="#6b7280">
                        {cell.cost}💎 • {cell.rent}↑
                      </text>
                      {cell.legendary && (
                        <text x={pos.x} y={pos.y + 2.5} fontSize="1.5" textAnchor="middle">
                          👑
                        </text>
                      )}
                    </>
                  )}

                  {cell.type === 'event' && (
                    <text x={pos.x} y={pos.y + 0.6} fontSize="2.2" textAnchor="middle">🎴</text>
                  )}

                  {cell.type === 'artifact' && (
                    <text x={pos.x} y={pos.y + 0.6} fontSize="2.2" textAnchor="middle">💎</text>
                  )}

                  {cell.type === 'portal' && (
                    <text x={pos.x} y={pos.y + 0.6} fontSize="2.2" textAnchor="middle">✨</text>
                  )}

                  {owner && (
                    <circle
                      cx={pos.x + size * 0.65}
                      cy={pos.y - h * 0.65}
                      r={1.1}
                      fill={owner}
                      stroke="#fff"
                      strokeWidth="0.2"
                    />
                  )}
                </g>
              );
            })}

            {/* Players */}
            {gameState.players.map((player, idx) => {
              const pos = positions[player.position];
              const offsetX = (idx % 2) * 2.5 - 1.25;
              const offsetY = Math.floor(idx / 2) * 1.2;

              return (
                <g key={player.id}>
                  <circle
                    cx={pos.x + offsetX}
                    cy={pos.y - 4 - offsetY}
                    r={1.8}
                    fill={player.color}
                    stroke="#fff"
                    strokeWidth="0.25"
                  />
                  <text
                    x={pos.x + offsetX}
                    y={pos.y - 3.4 - offsetY}
                    fontSize="1.4"
                    textAnchor="middle"
                    fill="#fff"
                    fontWeight="700"
                  >
                    {player.name[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Message */}
        <div className="bg-slate-700/50 backdrop-blur rounded-xl p-4 mb-4 text-center">
          <p className="text-white text-sm">{message}</p>
        </div>

        {/* Dice Roll Button */}
        {isMyTurn && !dice && !pendingBuy && !event && (
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            🎲 Lancer le dé
          </button>
        )}

        {/* Buy Dialog */}
        {pendingBuy && isMyTurn && (
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl p-4 space-y-3">
            <p className="text-amber-900 font-bold text-center">
              Acheter {gameState.board[pendingBuy.pos].name} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={buyCity}
                className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-500 transition"
              >
                Acheter ({gameState.board[pendingBuy.pos].cost} 💎)
              </button>
              <button
                onClick={passBuy}
                className="flex-1 bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-600 transition"
              >
                Passer
              </button>
            </div>
          </div>
        )}

        {/* Event Card */}
        {event && (
          <div className={`bg-gradient-to-br ${event.color} rounded-xl p-6 space-y-4 shadow-2xl`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-white/90">{event.desc}</p>
            </div>
            <button
              onClick={applyEvent}
              className="w-full bg-white/20 backdrop-blur text-white font-bold py-3 rounded-lg hover:bg-white/30 transition"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Players List */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {gameState.players.map((player, idx) => {
            const stats = getPlayerStats(gameState, player.id);
            return (
              <div
                key={player.id}
                className={`rounded-xl p-3 ${idx === gameState.currentPlayerIndex ? 'ring-2 ring-yellow-400' : ''}`}
                style={{ backgroundColor: `${player.color}20`, borderLeft: `4px solid ${player.color}` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{player.name}</p>
                    <p className="text-white/70 text-xs">{player.mana} 💎</p>
                  </div>
                </div>
                {stats && (
                  <div className="text-xs text-white/80 space-y-1">
                    <p>🏰 {stats.citiesOwned} cités</p>
                    {stats.legendariesOwned > 0 && <p>👑 {stats.legendariesOwned} légendaires</p>}
                    {stats.artifacts > 0 && <p>✨ {stats.artifacts} artefacts</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper: Initialize local board
function initializeLocalBoard() {
  return [
    { id: 0, type: "city", name: "Cité de Brumeciel", cost: 6, rent: 2, owner: null },
    { id: 1, type: "event" },
    { id: 2, type: "city", name: "Forge d'Obsidienne", cost: 12, rent: 5, owner: null },
    { id: 3, type: "artifact" },
    { id: 4, type: "city", name: "Tour des Arcanes", cost: 20, rent: 8, owner: null, legendary: true },
    { id: 5, type: "event" },
    { id: 6, type: "city", name: "Sanctuaire du Néant", cost: 30, rent: 12, owner: null, legendary: true },
    { id: 7, type: "portal" },
    { id: 8, type: "city", name: "Bastion d'Azur", cost: 8, rent: 3, owner: null },
    { id: 9, type: "event" },
    { id: 10, type: "city", name: "Bourg des Murmures", cost: 10, rent: 4, owner: null },
    { id: 11, type: "artifact" },
    { id: 12, type: "city", name: "Marais des Echos", cost: 9, rent: 4, owner: null },
    { id: 13, type: "event" },
    { id: 14, type: "city", name: "Motte de Givre", cost: 11, rent: 5, owner: null },
    { id: 15, type: "portal" },
    { id: 16, type: "city", name: "Cime des Sages", cost: 14, rent: 6, owner: null, legendary: true },
    { id: 17, type: "event" },
    { id: 18, type: "city", name: "Ruines d'Yl", cost: 16, rent: 7, owner: null, legendary: true },
    { id: 19, type: "artifact" },
    { id: 20, type: "city", name: "Val des Brumes", cost: 18, rent: 8, owner: null },
    { id: 21, type: "event" },
    { id: 22, type: "city", name: "Nid d'Oblivion", cost: 22, rent: 10, owner: null, legendary: true },
    { id: 23, type: "portal" }
  ];
}
