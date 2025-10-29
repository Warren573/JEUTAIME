import React, { useState, useEffect } from 'react';
import { awardGameRewards, showRewardModal } from '../../utils/gameRewards';
import { getGameScores } from '../../config/gamesConfig';

export default function MorpionGame({ setGameScreen, currentUser, setUserCoins }) {
  const [morpionBoard, setMorpionBoard] = useState(Array(9).fill(null));
  const [morpionTurn, setMorpionTurn] = useState('X'); // X = joueur, O = bot
  const [gameOver, setGameOver] = useState(false);

  // Stats
  const [totalGames, setTotalGames] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalDraws, setTotalDraws] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);

  // Charger les stats au démarrage
  useEffect(() => {
    if (currentUser) {
      const gameData = getGameScores(currentUser.email, 'MORPION');
      if (gameData) {
        setTotalGames(gameData.totalPlays || 0);
        setTotalWins(gameData.wins || 0);
        setTotalDraws(gameData.draws || 0);
        setTotalCoinsEarned(gameData.totalCoinsEarned || 0);
      }
    }
  }, [currentUser]);
  const calculateWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  // Bot joue après le joueur
  useEffect(() => {
    if (morpionTurn === 'O' && !gameOver && !calculateWinner(morpionBoard)) {
      const emptySquares = morpionBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter(val => val !== null);

      if (emptySquares.length > 0) {
        setTimeout(() => {
          const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
          const newBoard = morpionBoard.slice();
          newBoard[randomIndex] = 'O';
          setMorpionBoard(newBoard);
          setMorpionTurn('X');

          // Vérifier victoire/match nul après coup du bot
          checkGameEnd(newBoard);
        }, 500);
      }
    }
  }, [morpionTurn, gameOver]);

  const checkGameEnd = (board) => {
    const winner = calculateWinner(board);
    const isFull = board.every(cell => cell !== null);

    if (winner || isFull) {
      setGameOver(true);
      setTimeout(() => handleGameEnd(winner, isFull), 300);
    }
  };

  const handleMorpionClick = (index) => {
    if (morpionBoard[index] || calculateWinner(morpionBoard) || morpionTurn !== 'X' || gameOver) return;

    const newBoard = morpionBoard.slice();
    newBoard[index] = 'X';
    setMorpionBoard(newBoard);

    // Vérifier victoire/match nul après coup du joueur
    const winner = calculateWinner(newBoard);
    const isFull = newBoard.every(cell => cell !== null);

    if (winner || isFull) {
      setGameOver(true);
      setTimeout(() => handleGameEnd(winner, isFull), 300);
    } else {
      setMorpionTurn('O');
    }
  };

  const handleGameEnd = (winner, isFull) => {
    if (!currentUser) {
      if (winner === 'X') alert('🎉 Victoire !');
      else if (winner === 'O') alert('😔 Défaite...');
      else alert('🤝 Match nul !');
      return;
    }

    const won = winner === 'X';
    const draw = !winner && isFull;

    // Attribuer les récompenses
    const reward = awardGameRewards(currentUser.email, 'MORPION', {
      won: won,
      draw: draw
    });

    // Mettre à jour les stats
    setTotalGames(prev => prev + 1);
    if (won) setTotalWins(prev => prev + 1);
    if (draw) setTotalDraws(prev => prev + 1);
    setTotalCoinsEarned(prev => prev + reward.coins);

    // Mettre à jour les pièces
    if (setUserCoins) {
      setUserCoins(reward.newCoins);
    }

    // Sauvegarder wins et draws pour les badges
    const scores = JSON.parse(localStorage.getItem('jeutaime_game_scores') || '{}');
    if (scores[currentUser.email] && scores[currentUser.email].MORPION) {
      scores[currentUser.email].MORPION.wins = (scores[currentUser.email].MORPION.wins || 0) + (won ? 1 : 0);
      scores[currentUser.email].MORPION.draws = (scores[currentUser.email].MORPION.draws || 0) + (draw ? 1 : 0);
      localStorage.setItem('jeutaime_game_scores', JSON.stringify(scores));
    }

    // Afficher le modal
    showRewardModal(reward);
  };

  const resetGame = () => {
    setMorpionBoard(Array(9).fill(null));
    setMorpionTurn('X');
    setGameOver(false);
  };

  const winner = calculateWinner(morpionBoard);
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <div>
      <button
        onClick={() => setGameScreen(null)}
        style={{
          padding: '10px 20px',
          background: '#1a1a1a',
          border: '1px solid #333',
          color: 'white',
          borderRadius: '10px',
          marginBottom: '20px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        ← Retour
      </button>

      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>⭕ Morpion</h2>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Parties
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {totalGames}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Victoires
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {totalWins}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #FF9800, #F57C00)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Taux
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {winRate}%
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #2196F3, #1976D2)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Nuls
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {totalDraws}
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', marginBottom: '20px', fontWeight: '600', color: morpionTurn === 'X' ? '#E91E63' : '#2196F3' }}>
          {morpionTurn === 'X' ? '🎮 À toi de jouer (X)' : '🤖 Le bot joue (O)...'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '8px', margin: '0 auto 30px', width: 'fit-content' }}>
          {morpionBoard.map((val, idx) => (
            <button
              key={idx}
              onClick={() => handleMorpionClick(idx)}
              disabled={morpionTurn === 'O' || gameOver}
              style={{
                width: '80px',
                height: '80px',
                fontSize: '38px',
                background: val === null ? '#0a0a0a' : 'rgba(255,255,255,0.05)',
                border: '2px solid #333',
                borderRadius: '12px',
                cursor: val === null && morpionTurn === 'X' && !gameOver ? 'pointer' : 'default',
                fontWeight: 'bold',
                color: val === 'X' ? '#E91E63' : '#2196F3',
                transition: 'all 0.2s',
                opacity: val === null && morpionTurn === 'X' && !gameOver ? 1 : 0.8
              }}
            >
              {val}
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #E91E63, #C2185B)',
            border: 'none',
            color: 'white',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          Nouvelle partie
        </button>

        {/* Info récompenses */}
        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: 'rgba(103, 58, 183, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(103, 58, 183, 0.3)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#BB86FC' }}>
            💰 Récompenses
          </div>
          <div style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.6', textAlign: 'left' }}>
            • <strong>Victoire :</strong> 30 pièces + 3 points<br />
            • <strong>Match nul :</strong> 10 pièces + 1 point<br />
            • <strong>Défaite :</strong> 5 pièces<br />
            • Joue contre un bot intelligent !
          </div>
        </div>
      </div>
    </div>
  );
}
