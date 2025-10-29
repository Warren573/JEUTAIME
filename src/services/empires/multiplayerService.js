// Service multijoueur pour Empires d'Étheria
import { db, isDemoMode } from './firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Créer une nouvelle partie multijoueur
 */
export async function createGame(playerData, gameConfig) {
  if (isDemoMode) {
    console.log('Mode démo: partie locale uniquement');
    return createLocalGame(playerData, gameConfig);
  }

  try {
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const gameRef = doc(db, 'empires_games', gameId);

    const gameState = {
      id: gameId,
      status: 'waiting', // waiting, active, finished
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      creator: playerData.id,
      players: [
        {
          ...playerData,
          position: 0,
          mana: 30,
          artifacts: [],
          skipNext: false,
          ready: true
        }
      ],
      maxPlayers: gameConfig.maxPlayers || 4,
      board: initializeBoard(),
      currentPlayerIndex: 0,
      turn: 1,
      lastAction: null
    };

    await setDoc(gameRef, gameState);
    console.log('✅ Partie créée:', gameId);
    return { gameId, gameState };
  } catch (error) {
    console.error('❌ Erreur création partie:', error);
    return null;
  }
}

/**
 * Rejoindre une partie existante
 */
export async function joinGame(gameId, playerData) {
  if (isDemoMode) {
    console.log('Mode démo: impossible de rejoindre');
    return null;
  }

  try {
    const gameRef = doc(db, 'empires_games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      console.error('Partie introuvable');
      return null;
    }

    const gameState = gameSnap.data();

    // Vérifier si la partie est pleine
    if (gameState.players.length >= gameState.maxPlayers) {
      console.error('Partie pleine');
      return null;
    }

    // Ajouter le joueur
    const newPlayer = {
      ...playerData,
      position: 0,
      mana: 30,
      artifacts: [],
      skipNext: false,
      ready: false
    };

    await updateDoc(gameRef, {
      players: [...gameState.players, newPlayer],
      updatedAt: serverTimestamp()
    });

    console.log('✅ Joueur ajouté à la partie');
    return { gameId, gameState: { ...gameState, players: [...gameState.players, newPlayer] } };
  } catch (error) {
    console.error('❌ Erreur rejoindre partie:', error);
    return null;
  }
}

/**
 * Écouter les changements d'une partie en temps réel
 */
export function subscribeToGame(gameId, callback) {
  if (isDemoMode) {
    console.log('Mode démo: pas de sync temps réel');
    return () => {}; // No-op unsubscribe
  }

  try {
    const gameRef = doc(db, 'empires_games', gameId);

    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        console.error('Partie supprimée');
        callback(null);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error('❌ Erreur subscription:', error);
    return () => {};
  }
}

/**
 * Effectuer une action dans la partie
 */
export async function performAction(gameId, action, playerId) {
  if (isDemoMode) {
    console.log('Mode démo: action locale uniquement');
    return true;
  }

  try {
    const gameRef = doc(db, 'empires_games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      console.error('Partie introuvable');
      return false;
    }

    const gameState = gameSnap.data();

    // Vérifier que c'est le tour du joueur
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      console.error('Ce n\'est pas votre tour');
      return false;
    }

    // Mettre à jour l'état selon l'action
    const updatedState = processAction(gameState, action, playerId);

    await updateDoc(gameRef, {
      ...updatedState,
      lastAction: {
        type: action.type,
        playerId,
        timestamp: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });

    console.log('✅ Action effectuée:', action.type);
    return true;
  } catch (error) {
    console.error('❌ Erreur action:', error);
    return false;
  }
}

/**
 * Trouver des parties disponibles
 */
export async function findAvailableGames(maxResults = 10) {
  if (isDemoMode) {
    console.log('Mode démo: pas de parties en ligne');
    return [];
  }

  try {
    const gamesRef = collection(db, 'empires_games');
    const q = query(
      gamesRef,
      where('status', '==', 'waiting'),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const games = [];

    querySnapshot.forEach((doc) => {
      const game = doc.data();
      games.push({
        id: doc.id,
        creator: game.creator,
        players: game.players.length,
        maxPlayers: game.maxPlayers,
        createdAt: game.createdAt
      });
    });

    return games;
  } catch (error) {
    console.error('❌ Erreur recherche parties:', error);
    return [];
  }
}

/**
 * Terminer une partie
 */
export async function endGame(gameId, winnerId) {
  if (isDemoMode) {
    console.log('Mode démo: fin de partie locale');
    return true;
  }

  try {
    const gameRef = doc(db, 'empires_games', gameId);

    await updateDoc(gameRef, {
      status: 'finished',
      winner: winnerId,
      endedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Partie terminée');
    return true;
  } catch (error) {
    console.error('❌ Erreur fin partie:', error);
    return false;
  }
}

// --- Fonctions utilitaires privées ---

function createLocalGame(playerData, gameConfig) {
  const gameId = `local_${Date.now()}`;
  const gameState = {
    id: gameId,
    status: 'active',
    players: [
      {
        ...playerData,
        position: 0,
        mana: 30,
        artifacts: [],
        skipNext: false
      },
      // Ajouter un bot pour le mode local
      {
        id: 'bot_1',
        name: 'Bot Thoren',
        color: '#10b981',
        isBot: true,
        position: 0,
        mana: 30,
        artifacts: [],
        skipNext: false
      }
    ],
    board: initializeBoard(),
    currentPlayerIndex: 0,
    turn: 1,
    lastAction: null
  };

  return { gameId, gameState };
}

function initializeBoard() {
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

function processAction(gameState, action, playerId) {
  const newState = { ...gameState };

  switch (action.type) {
    case 'roll_dice':
      // Logique du lancer de dé
      break;
    case 'buy_city':
      // Logique d'achat de ville
      break;
    case 'end_turn':
      // Passer au joueur suivant
      newState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
      newState.turn = gameState.currentPlayerIndex === 0 ? gameState.turn + 1 : gameState.turn;
      break;
    default:
      console.warn('Action inconnue:', action.type);
  }

  return newState;
}

/**
 * Vérifie les conditions de victoire
 * @returns {object|null} - { winnerId, reason } ou null
 */
export function checkWinCondition(gameState) {
  const { players, board } = gameState;

  for (let i = 0; i < players.length; i++) {
    const player = players[i];

    // Condition 1: Atteindre 100 mana
    if (player.mana >= 100) {
      return {
        winnerId: player.id,
        winnerName: player.name,
        reason: 'mana',
        message: `${player.name} a atteint 100 mana et remporte la victoire !`
      };
    }

    // Condition 2: Contrôler 3 lieux légendaires
    const legendariesOwned = board.filter(
      cell => cell.legendary && cell.owner === i
    ).length;

    if (legendariesOwned >= 3) {
      return {
        winnerId: player.id,
        winnerName: player.name,
        reason: 'legendary',
        message: `${player.name} contrôle 3 lieux légendaires et remporte la victoire !`
      };
    }
  }

  return null;
}

/**
 * Récupère les statistiques d'un joueur
 */
export function getPlayerStats(gameState, playerId) {
  const playerIndex = gameState.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return null;

  const player = gameState.players[playerIndex];
  const ownedCities = gameState.board.filter(c => c.type === 'city' && c.owner === playerIndex);
  const legendariesOwned = ownedCities.filter(c => c.legendary).length;
  const totalRent = ownedCities.reduce((sum, c) => sum + (c.rent || 0), 0);

  return {
    player,
    citiesOwned: ownedCities.length,
    legendariesOwned,
    totalRent,
    artifacts: player.artifacts?.length || 0,
    mana: player.mana
  };
}
