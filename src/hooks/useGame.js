/**
 * useGame — Hook accès à l'état des mini-jeux
 *
 * Façade sur economyStore pour les composants de jeux.
 * Chaque jeu peut accéder à son état sans connaître le store.
 */

import { useEconomyStore } from '../store/economyStore';
import { useUIStore } from '../store/uiStore';

export function useGame(gameId) {
  const store = useEconomyStore();
  const { setGameScreen } = useUIStore();

  const exitGame = () => setGameScreen(null);

  const gameStates = {
    pong: {
      score: store.reactivityScore,
      setScore: store.setReactivityScore,
      ready: store.reactivityReady,
      setReady: store.setReactivityReady,
    },
    brickbreaker: {
      score: store.brickScore,
      setScore: store.setBrickScore,
    },
    morpion: {
      board: store.morpionBoard,
      setBoard: store.setMorpionBoard,
      turn: store.morpionTurn,
      setTurn: store.setMorpionTurn,
      reset: store.resetMorpion,
    },
    storytime: {
      text: store.storyText,
      setText: store.setStoryText,
      input: store.storyInput,
      setInput: store.setStoryInput,
    },
    cards: {
      symbols: store.cardSymbols,
      setSymbols: store.setCardSymbols,
      revealed: store.cardRevealed,
      setRevealed: store.setCardRevealed,
      gains: store.cardGains,
      setGains: store.setCardGains,
      gameOver: store.cardGameOver,
      setGameOver: store.setCardGameOver,
      message: store.cardMessage,
      setMessage: store.setCardMessage,
      reset: store.resetCardGame,
    },
    reactivity: {
      bestScore: store.moleBestScore,
      setBestScore: store.setMoleBestScore,
    },
  };

  return {
    state: gameId ? (gameStates[gameId] || {}) : gameStates,
    exitGame,
  };
}
