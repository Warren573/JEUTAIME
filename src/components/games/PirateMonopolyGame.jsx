import React, { useState, useEffect } from 'react';
import {
  boardSpaces,
  adventureCards,
  curseCards,
  playerTokens,
  islandGroups,
  STARTING_GOLD,
  PASS_START_BONUS
} from '../../data/pirateMonopolyData';

export default function PirateMonopolyGame({ setGameScreen, userCoins, setUserCoins }) {
  // Configuration du jeu
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [properties, setProperties] = useState({}); // { spaceId: { owner, buildings } }

  // État du tour
  const [diceRoll, setDiceRoll] = useState([0, 0]);
  const [canRoll, setCanRoll] = useState(true);
  const [message, setMessage] = useState('🎲 Lance les dés pour commencer !');
  const [consecutiveDoubles, setConsecutiveDoubles] = useState(0);

  // Modales et actions
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  const [selectedPropertyForBuild, setSelectedPropertyForBuild] = useState(null);

  // Prison
  const [playersInJail, setPlayersInJail] = useState({});
  const [getOutOfJailCards, setGetOutOfJailCards] = useState({});

  // Initialiser les joueurs
  const initializePlayers = () => {
    const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      id: i,
      name: i === 0 ? 'Vous' : `Pirate ${i}`,
      token: playerTokens[i % 4],
      gold: STARTING_GOLD,
      position: 0,
      isAI: i !== 0
    }));
    setPlayers(newPlayers);
    setGameStarted(true);
    setMessage(`🏴‍☠️ ${newPlayers[0].name}, c'est à toi de jouer !`);
  };

  const currentPlayer = players[currentPlayerIndex];
  const currentSpace = boardSpaces[currentPlayer?.position];

  // Lancer les dés
  const rollDice = () => {
    if (!canRoll) return;

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    setDiceRoll([die1, die2]);
    setCanRoll(false);

    const total = die1 + die2;
    const isDouble = die1 === die2;

    // Vérifier si le joueur est en prison
    if (playersInJail[currentPlayer.id]) {
      if (isDouble) {
        setPlayersInJail(prev => ({ ...prev, [currentPlayer.id]: false }));
        setMessage(`🎉 Double ! Tu sors de prison !`);
        movePlayer(total);
      } else {
        setMessage(`🏴‍☠️ Toujours en prison... Essaie de faire un double !`);
        setTimeout(() => endTurn(), 2000);
      }
      return;
    }

    // Gérer les doubles consécutifs
    if (isDouble) {
      const newConsecutiveDoubles = consecutiveDoubles + 1;
      setConsecutiveDoubles(newConsecutiveDoubles);

      if (newConsecutiveDoubles >= 3) {
        setMessage(`☠️ Trois doubles ! Direction la prison du Kraken !`);
        sendToJail();
        return;
      } else {
        setMessage(`🎲 Double ${die1} ! Tu rejoues après cette action !`);
      }
    } else {
      setConsecutiveDoubles(0);
    }

    movePlayer(total, isDouble);
  };

  // Déplacer le joueur
  const movePlayer = (spaces, canRollAgain = false) => {
    const newPosition = (currentPlayer.position + spaces) % 40;
    const passedStart = newPosition < currentPlayer.position;

    // Mettre à jour la position
    setPlayers(prev => prev.map(p =>
      p.id === currentPlayer.id
        ? { ...p, position: newPosition }
        : p
    ));

    // Bonus de passage par le départ
    if (passedStart) {
      setPlayers(prev => prev.map(p =>
        p.id === currentPlayer.id
          ? { ...p, gold: p.gold + PASS_START_BONUS }
          : p
      ));
      setMessage(`🏁 Tu passes par le Port du Capitaine ! +${PASS_START_BONUS} pièces d'or !`);
    }

    // Gérer l'arrivée sur la case
    setTimeout(() => {
      handleLanding(newPosition, canRollAgain);
    }, 1000);
  };

  // Gérer l'arrivée sur une case
  const handleLanding = (position, canRollAgain) => {
    const space = boardSpaces[position];

    switch (space.type) {
      case 'start':
        setMessage(`🏁 Bienvenue au Port du Capitaine !`);
        if (canRollAgain) {
          setCanRoll(true);
        } else {
          setTimeout(() => endTurn(), 2000);
        }
        break;

      case 'island':
        handleIslandSpace(space, canRollAgain);
        break;

      case 'port':
        handlePortSpace(space, canRollAgain);
        break;

      case 'adventure':
        drawAdventureCard(canRollAgain);
        break;

      case 'curse':
        drawCurseCard(canRollAgain);
        break;

      case 'treasure':
        handleTreasure(space, canRollAgain);
        break;

      case 'tax':
        handleTax(space, canRollAgain);
        break;

      case 'storm':
        handleStorm(space, canRollAgain);
        break;

      case 'combat':
        handleCombat(space, canRollAgain);
        break;

      case 'prison':
        setMessage(`🏴‍☠️ En visite à la Prison du Kraken !`);
        if (canRollAgain) {
          setCanRoll(true);
        } else {
          setTimeout(() => endTurn(), 2000);
        }
        break;

      case 'goToPrison':
        setMessage(`💀 Oh non ! Direction la Prison du Kraken !`);
        sendToJail();
        break;

      case 'free':
        setMessage(`🍺 Repos à la Taverne !`);
        if (canRollAgain) {
          setCanRoll(true);
        } else {
          setTimeout(() => endTurn(), 2000);
        }
        break;

      default:
        if (canRollAgain) {
          setCanRoll(true);
        } else {
          setTimeout(() => endTurn(), 2000);
        }
    }
  };

  // Gérer une île
  const handleIslandSpace = (space, canRollAgain) => {
    const property = properties[space.id];

    if (!property) {
      // Propriété disponible
      setMessage(`🏝️ ${space.name} est disponible ! Prix: ${space.price} pièces`);
      if (!currentPlayer.isAI) {
        setShowBuyModal(true);
      } else {
        // IA achète si elle a assez d'argent
        if (currentPlayer.gold >= space.price) {
          buyProperty(space.id, canRollAgain);
        } else {
          if (canRollAgain) {
            setTimeout(() => setCanRoll(true), 2000);
          } else {
            setTimeout(() => endTurn(), 2000);
          }
        }
      }
    } else if (property.owner === currentPlayer.id) {
      // Le joueur possède déjà cette propriété
      setMessage(`🏝️ Tu es chez toi sur ${space.name} !`);
      if (canRollAgain) {
        setCanRoll(true);
      } else {
        setTimeout(() => endTurn(), 2000);
      }
    } else {
      // Payer un loyer
      const rent = calculateRent(space, property);
      payRent(property.owner, rent, space.name, canRollAgain);
    }
  };

  // Gérer un port
  const handlePortSpace = (space, canRollAgain) => {
    const property = properties[space.id];

    if (!property) {
      setMessage(`⚓ ${space.name} est disponible ! Prix: ${space.price} pièces`);
      if (!currentPlayer.isAI) {
        setShowBuyModal(true);
      } else {
        if (currentPlayer.gold >= space.price) {
          buyProperty(space.id, canRollAgain);
        } else {
          if (canRollAgain) {
            setTimeout(() => setCanRoll(true), 2000);
          } else {
            setTimeout(() => endTurn(), 2000);
          }
        }
      }
    } else if (property.owner === currentPlayer.id) {
      setMessage(`⚓ Tu possèdes ${space.name} !`);
      if (canRollAgain) {
        setCanRoll(true);
      } else {
        setTimeout(() => endTurn(), 2000);
      }
    } else {
      const portsOwned = countPortsOwned(property.owner);
      const rent = space.rent[portsOwned - 1] || space.rent[0];
      payRent(property.owner, rent, space.name, canRollAgain);
    }
  };

  // Calculer le loyer
  const calculateRent = (space, property) => {
    const buildings = property.buildings || 0;
    return space.rent[buildings] || space.rent[0];
  };

  // Compter les ports possédés
  const countPortsOwned = (ownerId) => {
    return Object.entries(properties).filter(([spaceId, prop]) => {
      return prop.owner === ownerId && boardSpaces[spaceId].type === 'port';
    }).length;
  };

  // Payer un loyer
  const payRent = (ownerId, amount, propertyName, canRollAgain) => {
    const owner = players.find(p => p.id === ownerId);

    setPlayers(prev => prev.map(p => {
      if (p.id === currentPlayer.id) {
        return { ...p, gold: Math.max(0, p.gold - amount) };
      }
      if (p.id === ownerId) {
        return { ...p, gold: p.gold + amount };
      }
      return p;
    }));

    setMessage(`💰 Tu paies ${amount} pièces de loyer à ${owner.name} pour ${propertyName} !`);

    if (canRollAgain) {
      setTimeout(() => setCanRoll(true), 2000);
    } else {
      setTimeout(() => endTurn(), 2000);
    }
  };

  // Acheter une propriété
  const buyProperty = (spaceId, canRollAgain) => {
    const space = boardSpaces[spaceId];

    setPlayers(prev => prev.map(p =>
      p.id === currentPlayer.id
        ? { ...p, gold: p.gold - space.price }
        : p
    ));

    setProperties(prev => ({
      ...prev,
      [spaceId]: { owner: currentPlayer.id, buildings: 0 }
    }));

    setMessage(`🎉 Tu as acheté ${space.name} pour ${space.price} pièces !`);
    setShowBuyModal(false);

    if (canRollAgain) {
      setTimeout(() => setCanRoll(true), 2000);
    } else {
      setTimeout(() => endTurn(), 2000);
    }
  };

  // Piocher une carte aventure
  const drawAdventureCard = (canRollAgain) => {
    const card = adventureCards[Math.floor(Math.random() * adventureCards.length)];
    setCurrentCard({ ...card, canRollAgain });
    setShowCardModal(true);
    setMessage(`🗺️ Carte Aventure : ${card.title}`);
  };

  // Piocher une carte malédiction
  const drawCurseCard = (canRollAgain) => {
    const card = curseCards[Math.floor(Math.random() * curseCards.length)];
    setCurrentCard({ ...card, canRollAgain });
    setShowCardModal(true);
    setMessage(`🧙 Carte Malédiction : ${card.title}`);
  };

  // Appliquer l'effet d'une carte
  const applyCardEffect = () => {
    const { effect, canRollAgain } = currentCard;

    switch (effect.type) {
      case 'gainGold':
        setPlayers(prev => prev.map(p =>
          p.id === currentPlayer.id
            ? { ...p, gold: p.gold + effect.amount }
            : p
        ));
        break;

      case 'loseGold':
        setPlayers(prev => prev.map(p =>
          p.id === currentPlayer.id
            ? { ...p, gold: Math.max(0, p.gold - effect.amount) }
            : p
        ));
        break;

      case 'goToJail':
        sendToJail();
        setShowCardModal(false);
        return;

      case 'skipTurn':
        setMessage(`😵 Tu perds ton prochain tour !`);
        break;

      case 'moveForward':
        movePlayer(effect.spaces, false);
        setShowCardModal(false);
        return;

      case 'moveBackward':
        const newPos = (currentPlayer.position - effect.spaces + 40) % 40;
        setPlayers(prev => prev.map(p =>
          p.id === currentPlayer.id
            ? { ...p, position: newPos }
            : p
        ));
        setTimeout(() => handleLanding(newPos, false), 1000);
        setShowCardModal(false);
        return;

      case 'moveToStart':
        setPlayers(prev => prev.map(p =>
          p.id === currentPlayer.id
            ? { ...p, position: 0, gold: p.gold + PASS_START_BONUS }
            : p
        ));
        break;

      case 'getOutOfJail':
        setGetOutOfJailCards(prev => ({
          ...prev,
          [currentPlayer.id]: (prev[currentPlayer.id] || 0) + 1
        }));
        setMessage(`🔓 Carte "Sortie de Prison" reçue !`);
        break;

      case 'collectFromAll':
        let totalCollected = 0;
        setPlayers(prev => prev.map(p => {
          if (p.id !== currentPlayer.id) {
            totalCollected += effect.amount;
            return { ...p, gold: Math.max(0, p.gold - effect.amount) };
          }
          return p;
        }));
        setPlayers(prev => prev.map(p =>
          p.id === currentPlayer.id
            ? { ...p, gold: p.gold + totalCollected }
            : p
        ));
        break;

      case 'giveToAll':
        const totalToGive = effect.amount * (players.length - 1);
        setPlayers(prev => prev.map(p => {
          if (p.id === currentPlayer.id) {
            return { ...p, gold: Math.max(0, p.gold - totalToGive) };
          }
          return { ...p, gold: p.gold + effect.amount };
        }));
        break;
    }

    setShowCardModal(false);

    if (canRollAgain) {
      setTimeout(() => setCanRoll(true), 2000);
    } else {
      setTimeout(() => endTurn(), 2000);
    }
  };

  // Gérer le trésor
  const handleTreasure = (space, canRollAgain) => {
    setPlayers(prev => prev.map(p =>
      p.id === currentPlayer.id
        ? { ...p, gold: p.gold + space.amount }
        : p
    ));
    setMessage(`🪙 ${space.description} !`);

    if (canRollAgain) {
      setTimeout(() => setCanRoll(true), 2000);
    } else {
      setTimeout(() => endTurn(), 2000);
    }
  };

  // Gérer la taxe
  const handleTax = (space, canRollAgain) => {
    setPlayers(prev => prev.map(p =>
      p.id === currentPlayer.id
        ? { ...p, gold: Math.max(0, p.gold - space.amount) }
        : p
    ));
    setMessage(`☠️ ${space.description} !`);

    if (canRollAgain) {
      setTimeout(() => setCanRoll(true), 2000);
    } else {
      setTimeout(() => endTurn(), 2000);
    }
  };

  // Gérer la tempête
  const handleStorm = (space, canRollAgain) => {
    setPlayers(prev => prev.map(p =>
      p.id === currentPlayer.id
        ? { ...p, gold: Math.max(0, p.gold - space.amount) }
        : p
    ));
    setMessage(`⛈️ ${space.description} !`);

    if (canRollAgain) {
      setTimeout(() => setCanRoll(true), 2000);
    } else {
      setTimeout(() => endTurn(), 2000);
    }
  };

  // Gérer le combat
  const handleCombat = (space, canRollAgain) => {
    setPlayers(prev => prev.map(p =>
      p.id === currentPlayer.id
        ? { ...p, gold: Math.max(0, p.gold - space.amount) }
        : p
    ));
    setMessage(`💣 ${space.description} !`);

    if (canRollAgain) {
      setTimeout(() => setCanRoll(true), 2000);
    } else {
      setTimeout(() => endTurn(), 2000);
    }
  };

  // Envoyer en prison
  const sendToJail = () => {
    setPlayers(prev => prev.map(p =>
      p.id === currentPlayer.id
        ? { ...p, position: 10 }
        : p
    ));
    setPlayersInJail(prev => ({ ...prev, [currentPlayer.id]: true }));
    setConsecutiveDoubles(0);
    setTimeout(() => endTurn(), 2000);
  };

  // Sortir de prison avec une carte
  const useGetOutOfJailCard = () => {
    if (getOutOfJailCards[currentPlayer.id] > 0) {
      setGetOutOfJailCards(prev => ({
        ...prev,
        [currentPlayer.id]: prev[currentPlayer.id] - 1
      }));
      setPlayersInJail(prev => ({ ...prev, [currentPlayer.id]: false }));
      setMessage(`🔓 Tu utilises ta carte pour sortir de prison !`);
    }
  };

  // Finir le tour
  const endTurn = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    setCanRoll(true);
    setConsecutiveDoubles(0);
    setMessage(`🏴‍☠️ ${players[nextIndex].name}, c'est à toi de jouer !`);

    // Si c'est un joueur IA, jouer automatiquement
    if (players[nextIndex].isAI) {
      setTimeout(() => {
        rollDice();
      }, 2000);
    }
  };

  // Construire sur une propriété
  const buildOnProperty = (spaceId) => {
    const space = boardSpaces[spaceId];
    const property = properties[spaceId];

    if (property.buildings >= 5) {
      setMessage(`⚠️ Maximum de constructions atteint !`);
      return;
    }

    if (currentPlayer.gold < space.buildCost) {
      setMessage(`⚠️ Pas assez d'or !`);
      return;
    }

    // Vérifier si le joueur possède toutes les propriétés du groupe
    const groupSpaces = boardSpaces.filter(s => s.group === space.group);
    const ownsAll = groupSpaces.every(s => properties[s.id]?.owner === currentPlayer.id);

    if (!ownsAll) {
      setMessage(`⚠️ Tu dois posséder toutes les îles de ${islandGroups[space.group].name} !`);
      return;
    }

    setPlayers(prev => prev.map(p =>
      p.id === currentPlayer.id
        ? { ...p, gold: p.gold - space.buildCost }
        : p
    ));

    setProperties(prev => ({
      ...prev,
      [spaceId]: { ...prev[spaceId], buildings: prev[spaceId].buildings + 1 }
    }));

    const buildingName = property.buildings === 0 ? 'Taverne' :
                        property.buildings === 4 ? 'Fort Pirate' :
                        `Amélioration niveau ${property.buildings + 1}`;
    setMessage(`🏗️ ${buildingName} construite sur ${space.name} !`);
    setShowBuildModal(false);
  };

  if (!gameStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c1810, #1a0f0a)',
        padding: '20px',
        color: '#f4e8d0'
      }}>
        <button
          onClick={() => setGameScreen(null)}
          style={{
            background: 'none',
            border: '2px solid #8B6F47',
            color: '#f4e8d0',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Retour
        </button>

        <div style={{
          maxWidth: '500px',
          margin: '50px auto',
          background: 'linear-gradient(135deg, #3d2817, #2a1810)',
          padding: '40px',
          borderRadius: '20px',
          border: '4px solid #8B6F47',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '10px',
            color: '#FFD700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            🏴‍☠️ Monopoly Pirate 🏴‍☠️
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#b89968' }}>
            Deviens le pirate le plus riche des Sept Mers !
          </p>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>
              Nombre de pirates (2-4) :
            </label>
            <select
              value={numPlayers}
              onChange={(e) => setNumPlayers(Number(e.target.value))}
              style={{
                padding: '12px',
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: '2px solid #8B6F47',
                background: '#2a1810',
                color: '#f4e8d0',
                cursor: 'pointer'
              }}
            >
              <option value={2}>2 Pirates</option>
              <option value={3}>3 Pirates</option>
              <option value={4}>4 Pirates</option>
            </select>
          </div>

          <button
            onClick={initializePlayers}
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              color: '#1a0f0a',
              padding: '15px 40px',
              borderRadius: '12px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(255, 215, 0, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            ⚓ Larguer les amarres !
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c1810, #1a0f0a)',
      padding: '20px',
      paddingBottom: '120px',
      color: '#f4e8d0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setGameScreen(null)}
          style={{
            background: 'none',
            border: '2px solid #8B6F47',
            color: '#f4e8d0',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>

        <h2 style={{ margin: 0, color: '#FFD700' }}>🏴‍☠️ Monopoly Pirate</h2>

        <button
          onClick={() => setShowPropertiesModal(true)}
          style={{
            background: '#3d2817',
            border: '2px solid #8B6F47',
            color: '#f4e8d0',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🏝️ Mes îles
        </button>
      </div>

      {/* Message */}
      <div style={{
        background: 'linear-gradient(135deg, #3d2817, #2a1810)',
        padding: '15px',
        borderRadius: '12px',
        border: '2px solid #8B6F47',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '1.1rem'
      }}>
        {message}
      </div>

      {/* Joueurs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: numPlayers === 2 ? '1fr 1fr' : '1fr 1fr',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {players.map((player, idx) => (
          <div
            key={player.id}
            style={{
              background: currentPlayerIndex === idx ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#3d2817',
              padding: '15px',
              borderRadius: '12px',
              border: `3px solid ${currentPlayerIndex === idx ? '#FFD700' : '#8B6F47'}`,
              boxShadow: currentPlayerIndex === idx ? '0 0 20px rgba(255, 215, 0, 0.5)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2rem' }}>{player.token.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 'bold',
                  color: currentPlayerIndex === idx ? '#1a0f0a' : '#f4e8d0'
                }}>
                  {player.name} {playersInJail[player.id] && '🏴‍☠️'}
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: currentPlayerIndex === idx ? '#8B4513' : '#FFD700'
                }}>
                  💰 {player.gold}
                </div>
              </div>
            </div>
            {getOutOfJailCards[player.id] > 0 && (
              <div style={{
                fontSize: '0.9rem',
                color: currentPlayerIndex === idx ? '#1a0f0a' : '#b89968'
              }}>
                🔓 Cartes prison: {getOutOfJailCards[player.id]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Plateau simplifié (sera détaillé dans la prochaine tâche) */}
      <div style={{
        background: '#3d2817',
        padding: '20px',
        borderRadius: '15px',
        border: '3px solid #8B6F47',
        marginBottom: '20px',
        minHeight: '300px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(11, 1fr)',
          gridTemplateRows: 'repeat(11, 1fr)',
          gap: '2px',
          aspectRatio: '1/1',
          maxWidth: '100%'
        }}>
          {boardSpaces.map((space, idx) => {
            const playersHere = players.filter(p => p.position === idx);
            const property = properties[space.id];
            let gridArea;

            // Calculer la position sur le plateau carré
            if (idx <= 10) {
              gridArea = `11 / ${idx + 1} / 12 / ${idx + 2}`; // Bas
            } else if (idx <= 20) {
              gridArea = `${12 - (idx - 10)} / 11 / ${13 - (idx - 10)} / 12`; // Droite
            } else if (idx <= 30) {
              gridArea = `1 / ${12 - (idx - 20)} / 2 / ${13 - (idx - 20)}`; // Haut
            } else {
              gridArea = `${idx - 29} / 1 / ${idx - 28} / 2`; // Gauche
            }

            return (
              <div
                key={space.id}
                style={{
                  gridArea,
                  background: property?.owner !== undefined
                    ? players[property.owner]?.token?.emoji === '⚓' ? '#4A5568'
                    : players[property.owner]?.token?.emoji === '🦜' ? '#48BB78'
                    : players[property.owner]?.token?.emoji === '💀' ? '#9F7AEA'
                    : '#F56565'
                    : space.group ? islandGroups[space.group].color : '#2a1810',
                  border: '1px solid #8B6F47',
                  borderRadius: '4px',
                  padding: '2px',
                  fontSize: '0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: '1rem' }}>{space.emoji}</div>
                {property?.buildings > 0 && (
                  <div style={{ fontSize: '0.7rem' }}>
                    {property.buildings < 5 ? '🏠'.repeat(property.buildings) : '🏰'}
                  </div>
                )}
                {playersHere.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    display: 'flex',
                    gap: '1px'
                  }}>
                    {playersHere.map(p => (
                      <span key={p.id} style={{ fontSize: '0.8rem' }}>
                        {p.token.emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Centre du plateau */}
          <div style={{
            gridArea: '2 / 2 / 11 / 11',
            background: 'linear-gradient(135deg, #3d2817, #2a1810)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏴‍☠️</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#FFD700' }}>
              Monopoly
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b89968' }}>
              Pirate
            </div>
          </div>
        </div>
      </div>

      {/* Dés et actions */}
      <div style={{
        background: 'linear-gradient(135deg, #3d2817, #2a1810)',
        padding: '20px',
        borderRadius: '15px',
        border: '3px solid #8B6F47',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#f4e8d0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a0f0a',
            border: '3px solid #8B6F47',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            {diceRoll[0] || '?'}
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#f4e8d0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a0f0a',
            border: '3px solid #8B6F47',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            {diceRoll[1] || '?'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={rollDice}
            disabled={!canRoll || currentPlayer?.isAI}
            style={{
              flex: 1,
              background: canRoll && !currentPlayer?.isAI
                ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                : '#555',
              border: 'none',
              color: canRoll && !currentPlayer?.isAI ? '#1a0f0a' : '#999',
              padding: '15px',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: canRoll && !currentPlayer?.isAI ? 'pointer' : 'not-allowed',
              minWidth: '120px'
            }}
          >
            🎲 Lancer
          </button>

          {playersInJail[currentPlayer?.id] && getOutOfJailCards[currentPlayer?.id] > 0 && (
            <button
              onClick={useGetOutOfJailCard}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #48BB78, #38A169)',
                border: 'none',
                color: '#fff',
                padding: '15px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              🔓 Sortir
            </button>
          )}

          <button
            onClick={() => setShowBuildModal(true)}
            disabled={currentPlayer?.isAI}
            style={{
              flex: 1,
              background: currentPlayer?.isAI ? '#555' : '#8B6F47',
              border: 'none',
              color: '#f4e8d0',
              padding: '15px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: currentPlayer?.isAI ? 'not-allowed' : 'pointer',
              minWidth: '120px'
            }}
          >
            🏗️ Construire
          </button>

          <button
            onClick={() => endTurn()}
            disabled={canRoll || currentPlayer?.isAI}
            style={{
              flex: 1,
              background: !canRoll && !currentPlayer?.isAI ? '#DC143C' : '#555',
              border: 'none',
              color: !canRoll && !currentPlayer?.isAI ? '#fff' : '#999',
              padding: '15px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: !canRoll && !currentPlayer?.isAI ? 'pointer' : 'not-allowed',
              minWidth: '120px'
            }}
          >
            ⏭️ Passer
          </button>
        </div>
      </div>

      {/* Modal d'achat */}
      {showBuyModal && currentSpace && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3d2817, #2a1810)',
            padding: '30px',
            borderRadius: '20px',
            border: '4px solid #8B6F47',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
              {currentSpace.emoji}
            </div>
            <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>
              {currentSpace.name}
            </h3>
            <p style={{ fontSize: '1.5rem', color: '#f4e8d0', marginBottom: '20px' }}>
              💰 {currentSpace.price} pièces
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  buyProperty(currentSpace.id, false);
                }}
                disabled={currentPlayer.gold < currentSpace.price}
                style={{
                  flex: 1,
                  background: currentPlayer.gold >= currentSpace.price
                    ? 'linear-gradient(135deg, #48BB78, #38A169)'
                    : '#555',
                  border: 'none',
                  color: '#fff',
                  padding: '15px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: currentPlayer.gold >= currentSpace.price ? 'pointer' : 'not-allowed'
                }}
              >
                ✅ Acheter
              </button>
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setTimeout(() => endTurn(), 500);
                }}
                style={{
                  flex: 1,
                  background: '#DC143C',
                  border: 'none',
                  color: '#fff',
                  padding: '15px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ❌ Refuser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de carte */}
      {showCardModal && currentCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3d2817, #2a1810)',
            padding: '30px',
            borderRadius: '20px',
            border: '4px solid #8B6F47',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>
              {currentCard.emoji}
            </div>
            <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>
              {currentCard.title}
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#f4e8d0', marginBottom: '20px' }}>
              {currentCard.description}
            </p>
            <button
              onClick={applyCardEffect}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                color: '#1a0f0a',
                padding: '15px 40px',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ⚓ Continuer
            </button>
          </div>
        </div>
      )}

      {/* Modal de construction */}
      {showBuildModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3d2817, #2a1810)',
            padding: '30px',
            borderRadius: '20px',
            border: '4px solid #8B6F47',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '20px', textAlign: 'center' }}>
              🏗️ Construire sur tes îles
            </h3>

            <div style={{ marginBottom: '20px' }}>
              {Object.entries(properties)
                .filter(([spaceId, prop]) => prop.owner === currentPlayer?.id && boardSpaces[spaceId].type === 'island')
                .map(([spaceId, prop]) => {
                  const space = boardSpaces[spaceId];
                  const groupSpaces = boardSpaces.filter(s => s.group === space.group);
                  const ownsAll = groupSpaces.every(s => properties[s.id]?.owner === currentPlayer?.id);

                  return (
                    <div
                      key={spaceId}
                      style={{
                        background: islandGroups[space.group].color,
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '10px',
                        border: '2px solid #8B6F47'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#fff' }}>
                            {space.emoji} {space.name}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#f4e8d0' }}>
                            {prop.buildings < 5 ? '🏠'.repeat(prop.buildings) : '🏰'}
                            {prop.buildings === 0 && 'Pas de construction'}
                            {prop.buildings > 0 && prop.buildings < 5 && ` (${prop.buildings})`}
                            {prop.buildings === 5 && ' Fort Pirate'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.9rem', color: '#f4e8d0' }}>
                            Coût: {space.buildCost}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => buildOnProperty(Number(spaceId))}
                        disabled={!ownsAll || prop.buildings >= 5 || currentPlayer.gold < space.buildCost}
                        style={{
                          width: '100%',
                          background: ownsAll && prop.buildings < 5 && currentPlayer.gold >= space.buildCost
                            ? 'linear-gradient(135deg, #48BB78, #38A169)'
                            : '#555',
                          border: 'none',
                          color: '#fff',
                          padding: '10px',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          cursor: ownsAll && prop.buildings < 5 && currentPlayer.gold >= space.buildCost ? 'pointer' : 'not-allowed'
                        }}
                      >
                        {!ownsAll && '⚠️ Groupe incomplet'}
                        {ownsAll && prop.buildings >= 5 && '✅ Maximum'}
                        {ownsAll && prop.buildings < 5 && currentPlayer.gold < space.buildCost && '💰 Pas assez d\'or'}
                        {ownsAll && prop.buildings < 5 && currentPlayer.gold >= space.buildCost && '🏗️ Construire'}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => setShowBuildModal(false)}
              style={{
                width: '100%',
                background: '#DC143C',
                border: 'none',
                color: '#fff',
                padding: '15px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ❌ Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal des propriétés */}
      {showPropertiesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3d2817, #2a1810)',
            padding: '30px',
            borderRadius: '20px',
            border: '4px solid #8B6F47',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '20px', textAlign: 'center' }}>
              🏝️ Propriétés de tous les joueurs
            </h3>

            {players.map(player => {
              const playerProperties = Object.entries(properties)
                .filter(([spaceId, prop]) => prop.owner === player.id);

              if (playerProperties.length === 0) return null;

              return (
                <div key={player.id} style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                    padding: '10px',
                    background: '#2a1810',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{player.token.emoji}</span>
                    <span style={{ fontWeight: 'bold', color: '#FFD700' }}>{player.name}</span>
                  </div>

                  {playerProperties.map(([spaceId, prop]) => {
                    const space = boardSpaces[spaceId];
                    return (
                      <div
                        key={spaceId}
                        style={{
                          background: space.group ? islandGroups[space.group].color : '#4A5568',
                          padding: '10px',
                          borderRadius: '8px',
                          marginBottom: '5px',
                          fontSize: '0.9rem'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', color: '#fff' }}>
                          {space.emoji} {space.name}
                        </div>
                        {prop.buildings > 0 && (
                          <div style={{ color: '#f4e8d0' }}>
                            {prop.buildings < 5 ? '🏠'.repeat(prop.buildings) : '🏰 Fort Pirate'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <button
              onClick={() => setShowPropertiesModal(false)}
              style={{
                width: '100%',
                background: '#DC143C',
                border: 'none',
                color: '#fff',
                padding: '15px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ❌ Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
