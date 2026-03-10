/**
 * ECONOMY STORE
 *
 * Gère les pièces, le statut premium et les états des mini-jeux.
 * Remplace userCoins, premiumActive et tous les game states de App.jsx.
 */

import { create } from 'zustand';

export const useEconomyStore = create((set, get) => ({
  // ── Economy ───────────────────────────────────────────────────────────────
  userCoins: 0,
  premiumActive: false,

  // ── Game states ───────────────────────────────────────────────────────────
  // Pong / Reactivity
  reactivityScore: 0,
  reactivityReady: false,

  // BrickBreaker
  brickScore: 0,

  // Morpion
  morpionBoard: Array(9).fill(null),
  morpionTurn: 'X',

  // StoryTime
  storyText: 'Il était une fois...',
  storyInput: '',

  // CardGame
  cardSymbols: [],
  cardRevealed: [],
  cardGains: 0,
  cardGameOver: false,
  cardMessage: '',

  // WhackAMole
  moleBestScore: 0,

  // ── Actions economy ───────────────────────────────────────────────────────

  setUserCoins: (coins) => {
    const value = typeof coins === 'function' ? coins(get().userCoins) : coins;
    set({ userCoins: value });
  },

  addCoins: (amount) => set(state => ({ userCoins: state.userCoins + amount })),

  spendCoins: (amount) => {
    const { userCoins } = get();
    if (userCoins < amount) return false;
    set({ userCoins: userCoins - amount });
    return true;
  },

  setPremiumActive: (active) => set({ premiumActive: active }),

  syncFromUser: (user) => {
    if (!user) return;
    set({
      userCoins: user.coins || 0,
      premiumActive: user.premium || false,
    });
  },

  // ── Actions jeux ─────────────────────────────────────────────────────────

  setReactivityScore: (score) => set({ reactivityScore: score }),
  setReactivityReady: (ready) => set({ reactivityReady: ready }),

  setBrickScore: (score) => set({ brickScore: score }),

  setMorpionBoard: (board) => set({ morpionBoard: board }),
  setMorpionTurn: (turn) => set({ morpionTurn: turn }),
  resetMorpion: () => set({ morpionBoard: Array(9).fill(null), morpionTurn: 'X' }),

  setStoryText: (text) => set({ storyText: text }),
  setStoryInput: (input) => set({ storyInput: input }),

  setCardSymbols: (symbols) => set({ cardSymbols: symbols }),
  setCardRevealed: (revealed) => set({ cardRevealed: revealed }),
  setCardGains: (gains) => set({ cardGains: gains }),
  setCardGameOver: (over) => set({ cardGameOver: over }),
  setCardMessage: (msg) => set({ cardMessage: msg }),
  resetCardGame: () => set({
    cardSymbols: [],
    cardRevealed: [],
    cardGains: 0,
    cardGameOver: false,
    cardMessage: '',
  }),

  setMoleBestScore: (score) => set({ moleBestScore: score }),
}));
