// Empires d'Étheria - Version 3D avec React Three Fiber
// À installer: npm install @react-three/fiber @react-three/drei three

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import Board3D from './Board3D';
import Player3D from './Player3D';
import Effects3D from './Effects3D';
import UI3D from './UI3D';
import { awardGameRewards, showRewardModal } from '../../../utils/gameRewards';
import { getGameScores } from '../../../config/gamesConfig';

export default function EmpiresEtheria3D({ setGameScreen, currentUser, setUserCoins }) {
  // État du jeu
  const [gameState, setGameState] = useState({
    board: initializeBoard(),
    players: initializePlayers(),
    currentPlayerIndex: 0,
    dice: null,
    phase: 'roll', // 'roll', 'move', 'action', 'end'
    message: 'Bienvenue dans Empires d\'Étheria 3D',
    selectedCell: null
  });

  const [cameraMode, setCameraMode] = useState('overview'); // 'overview', 'follow', 'top'
  const [showStats, setShowStats] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Stats persistantes
  const [totalGames, setTotalGames] = useState(0);
  const [totalVictories, setTotalVictories] = useState(0);
  const [bestMana, setBestMana] = useState(0);

  useEffect(() => {
    // Détecter mobile
    setIsMobile(window.innerWidth < 768);

    // Charger stats
    if (currentUser) {
      const gameData = getGameScores(currentUser.email, 'EMPIRES_ETHERIA');
      if (gameData) {
        setTotalGames(gameData.totalPlays || 0);
        setTotalVictories(gameData.victories || 0);
        setBestMana(gameData.bestScore || 0);
      }
    }
  }, [currentUser]);

  // Actions du jeu
  const rollDice = () => {
    if (gameState.phase !== 'roll') return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.skipNext) {
      // Sauter le tour
      setGameState(prev => ({
        ...prev,
        players: prev.players.map((p, i) =>
          i === prev.currentPlayerIndex ? { ...p, skipNext: false } : p
        ),
        message: `${currentPlayer.name} saute ce tour`,
        phase: 'end'
      }));
      setTimeout(() => endTurn(), 1500);
      return;
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;
    const moveBonus = currentPlayer.moveBonus || 0;
    const totalMove = diceValue + moveBonus;

    setGameState(prev => ({
      ...prev,
      dice: totalMove,
      phase: 'move',
      message: `${currentPlayer.name} lance : ${diceValue} (+${moveBonus}) = ${totalMove}`
    }));

    // Déplacer automatiquement après 1s
    setTimeout(() => movePlayer(totalMove), 1000);
  };

  const movePlayer = (steps) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const newPos = (currentPlayer.position + steps) % gameState.board.length;

    setGameState(prev => ({
      ...prev,
      players: prev.players.map((p, i) =>
        i === prev.currentPlayerIndex ? { ...p, position: newPos } : p
      ),
      phase: 'action'
    }));

    // Gérer l'arrivée sur la case
    setTimeout(() => handleLanding(newPos), 800);
  };

  const handleLanding = (position) => {
    const cell = gameState.board[position];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    setGameState(prev => ({ ...prev, selectedCell: cell }));

    if (cell.type === 'city') {
      if (cell.owner === null) {
        // Proposer d'acheter
        setGameState(prev => ({
          ...prev,
          message: `Acheter ${cell.name} ? (${cell.cost} mana)`,
          phase: 'buy'
        }));
      } else if (cell.owner !== gameState.currentPlayerIndex) {
        // Payer loyer
        payRent(cell);
      } else {
        // Propre ville
        setGameState(prev => ({
          ...prev,
          message: `Vous visitez ${cell.name}`,
          phase: 'end'
        }));
        setTimeout(() => endTurn(), 1500);
      }
    } else if (cell.type === 'event') {
      handleEvent();
    } else if (cell.type === 'artifact') {
      handleArtifact();
    } else if (cell.type === 'portal') {
      handlePortal();
    }
  };

  const buyCity = () => {
    const cell = gameState.selectedCell;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (currentPlayer.mana < cell.cost) {
      setGameState(prev => ({
        ...prev,
        message: 'Mana insuffisant',
        phase: 'end'
      }));
      setTimeout(() => endTurn(), 1500);
      return;
    }

    setGameState(prev => ({
      ...prev,
      players: prev.players.map((p, i) =>
        i === prev.currentPlayerIndex ? { ...p, mana: p.mana - cell.cost } : p
      ),
      board: prev.board.map(c =>
        c.id === cell.id ? { ...c, owner: prev.currentPlayerIndex } : c
      ),
      message: `${currentPlayer.name} achète ${cell.name}`,
      phase: 'end',
      selectedCell: null
    }));

    checkVictory();
    setTimeout(() => endTurn(), 2000);
  };

  const passCity = () => {
    setGameState(prev => ({
      ...prev,
      message: 'Achat refusé',
      phase: 'end',
      selectedCell: null
    }));
    setTimeout(() => endTurn(), 1500);
  };

  const payRent = (cell) => {
    const rent = cell.rent;
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const owner = gameState.players[cell.owner];

    setGameState(prev => ({
      ...prev,
      players: prev.players.map((p, i) => {
        if (i === currentPlayerIndex) return { ...p, mana: Math.max(0, p.mana - rent) };
        if (i === cell.owner) return { ...p, mana: p.mana + rent };
        return p;
      }),
      message: `Loyer payé à ${owner.name} : ${rent} mana`,
      phase: 'end'
    }));

    setTimeout(() => endTurn(), 2000);
  };

  const handleEvent = () => {
    const events = [
      { title: 'Trésor', effect: 8, message: 'Vous trouvez un trésor : +8 mana' },
      { title: 'Tempête', effect: -3, message: 'Tempête magique : -3 mana' },
      { title: 'Bénédiction', effect: 5, message: 'Bénédiction divine : +5 mana' }
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    setGameState(prev => ({
      ...prev,
      players: prev.players.map((p, i) =>
        i === prev.currentPlayerIndex
          ? { ...p, mana: Math.max(0, p.mana + event.effect) }
          : p
      ),
      message: event.message,
      phase: 'end'
    }));

    setTimeout(() => endTurn(), 2500);
  };

  const handleArtifact = () => {
    setGameState(prev => ({
      ...prev,
      message: '🔮 Artefact trouvé ! +1 déplacement permanent',
      players: prev.players.map((p, i) =>
        i === prev.currentPlayerIndex
          ? { ...p, moveBonus: (p.moveBonus || 0) + 1 }
          : p
      ),
      phase: 'end'
    }));

    setTimeout(() => endTurn(), 2500);
  };

  const handlePortal = () => {
    const gain = Math.floor(Math.random() * 6) + 1;

    setGameState(prev => ({
      ...prev,
      players: prev.players.map((p, i) =>
        i === prev.currentPlayerIndex ? { ...p, mana: p.mana + gain } : p
      ),
      message: `✨ Portail activé : +${gain} mana`,
      phase: 'end'
    }));

    setTimeout(() => endTurn(), 2000);
  };

  const endTurn = () => {
    const nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: nextIndex,
      dice: null,
      phase: 'roll',
      message: `Tour de ${prev.players[nextIndex].name}`,
      selectedCell: null
    }));
  };

  const checkVictory = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const ownedCities = gameState.board.filter(
      c => c.type === 'city' && c.owner === gameState.currentPlayerIndex
    );
    const legendaryCount = ownedCities.filter(c => c.cost >= 20).length;

    if (currentPlayer.mana >= 100 || legendaryCount >= 3) {
      handleVictory();
    }
  };

  const handleVictory = () => {
    const winner = gameState.players[gameState.currentPlayerIndex];

    setGameState(prev => ({
      ...prev,
      phase: 'victory',
      message: `🏆 ${winner.name} remporte la partie !`
    }));

    if (currentUser) {
      const reward = awardGameRewards(currentUser.email, 'EMPIRES_ETHERIA', {
        victory: true,
        mana: winner.mana,
        score: winner.mana
      });

      setTotalGames(prev => prev + 1);
      setTotalVictories(prev => prev + 1);
      if (winner.mana > bestMana) setBestMana(winner.mana);

      if (setUserCoins) setUserCoins(reward.newCoins);

      setTimeout(() => showRewardModal(reward), 1500);
    }
  };

  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      players: initializePlayers(),
      currentPlayerIndex: 0,
      dice: null,
      phase: 'roll',
      message: 'Nouvelle partie !',
      selectedCell: null
    });
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      background: '#000'
    }}>
      {/* Bouton retour */}
      <button
        onClick={() => setGameScreen(null)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          padding: '10px 20px',
          background: 'rgba(26, 26, 26, 0.9)',
          border: '1px solid #333',
          color: 'white',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600',
          backdropFilter: 'blur(10px)'
        }}
      >
        ← Retour
      </button>

      {/* Canvas 3D */}
      <Canvas
        shadows
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a1a, #1a0a2a)' }}
      >
        <Suspense fallback={null}>
          {/* Lumières */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#8b5cf6" />

          {/* Étoiles */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          {/* Environnement */}
          <Environment preset="night" />

          {/* Plateau 3D */}
          <Board3D
            board={gameState.board}
            selectedCell={gameState.selectedCell}
          />

          {/* Joueurs 3D */}
          {gameState.players.map((player, index) => (
            <Player3D
              key={player.id}
              player={player}
              position={player.position}
              isActive={index === gameState.currentPlayerIndex}
              boardLength={gameState.board.length}
            />
          ))}

          {/* Effets visuels */}
          <Effects3D dice={gameState.dice} phase={gameState.phase} />

          {/* Caméra */}
          <PerspectiveCamera makeDefault position={[0, 25, 25]} fov={50} />
          <OrbitControls
            enablePan={!isMobile}
            enableZoom={!isMobile}
            minDistance={15}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UI3D
        gameState={gameState}
        currentPlayer={currentPlayer}
        totalGames={totalGames}
        totalVictories={totalVictories}
        bestMana={bestMana}
        onRollDice={rollDice}
        onBuyCity={buyCity}
        onPassCity={passCity}
        onReset={resetGame}
        showStats={showStats}
        setShowStats={setShowStats}
      />
    </div>
  );
}

// --- Fonctions d'initialisation ---

function initializeBoard() {
  return [
    { id: 0, type: "city", name: "Cité de Brumeciel", cost: 6, rent: 2, owner: null },
    { id: 1, type: "event" },
    { id: 2, type: "city", name: "Forge d'Obsidienne", cost: 12, rent: 5, owner: null },
    { id: 3, type: "artifact" },
    { id: 4, type: "city", name: "Tour des Arcanes", cost: 20, rent: 8, owner: null },
    { id: 5, type: "event" },
    { id: 6, type: "city", name: "Sanctuaire du Néant", cost: 30, rent: 12, owner: null },
    { id: 7, type: "portal" },
    { id: 8, type: "city", name: "Bastion d'Azur", cost: 8, rent: 3, owner: null },
    { id: 9, type: "event" },
    { id: 10, type: "city", name: "Bourg des Murmures", cost: 10, rent: 4, owner: null },
    { id: 11, type: "artifact" },
    { id: 12, type: "city", name: "Marais des Echos", cost: 9, rent: 4, owner: null },
    { id: 13, type: "event" },
    { id: 14, type: "city", name: "Motte de Givre", cost: 11, rent: 5, owner: null },
    { id: 15, type: "portal" },
    { id: 16, type: "city", name: "Cime des Sages", cost: 14, rent: 6, owner: null },
    { id: 17, type: "event" },
    { id: 18, type: "city", name: "Ruines d'Yl", cost: 16, rent: 7, owner: null },
    { id: 19, type: "artifact" },
    { id: 20, type: "city", name: "Val des Brumes", cost: 18, rent: 8, owner: null },
    { id: 21, type: "event" },
    { id: 22, type: "city", name: "Nid d'Oblivion", cost: 22, rent: 10, owner: null },
    { id: 23, type: "portal" }
  ];
}

function initializePlayers() {
  return [
    {
      id: 'player_1',
      name: 'Aelyr',
      color: '#667eea',
      position: 0,
      mana: 30,
      artifacts: [],
      moveBonus: 0,
      skipNext: false
    },
    {
      id: 'bot_1',
      name: 'Thoren',
      color: '#10b981',
      position: 0,
      mana: 30,
      artifacts: [],
      moveBonus: 0,
      skipNext: false,
      isBot: true
    }
  ];
}
