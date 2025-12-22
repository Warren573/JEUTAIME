import React, { useEffect } from 'react';
import { awardPoints, checkAndAwardBadge } from '../../utils/pointsSystem';
import BackButton from '../common/BackButton';

export default function MorpionGame({ setGameScreen, morpionBoard, setMorpionBoard, morpionTurn, setMorpionTurn, currentUser, setUserCoins }) {
  const calculateWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleMorpionClick = (index) => {
    if (morpionBoard[index] || calculateWinner(morpionBoard)) return;
    const newBoard = morpionBoard.slice();
    newBoard[index] = morpionTurn;
    setMorpionBoard(newBoard);
    setMorpionTurn(morpionTurn === 'X' ? 'O' : 'X');
  };

  const winner = calculateWinner(morpionBoard);

  // Award rewards when game is won
  useEffect(() => {
    if (winner && currentUser) {
      // Track games won
      const gamesStats = JSON.parse(localStorage.getItem('jeutaime_games_stats') || '{}');
      const userEmail = currentUser.email;

      if (!gamesStats[userEmail]) {
        gamesStats[userEmail] = { gamesWon: 0, gamesLost: 0 };
      }

      // Only award once per game
      const gameState = morpionBoard.join('');
      const lastGameState = localStorage.getItem('jeutaime_last_morpion_state');

      if (gameState !== lastGameState) {
        // Player X wins (human player)
        if (winner === 'X') {
          gamesStats[userEmail].gamesWon++;

          // Award points
          awardPoints(userEmail, 'GAME_WON');

          // Award coins
          const coinReward = 25;
          setUserCoins(c => c + coinReward);

          // Update user coins in localStorage
          const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
          const userIndex = users.findIndex(u => u.email === userEmail);
          if (userIndex !== -1) {
            users[userIndex].coins = (users[userIndex].coins || 0) + coinReward;
            localStorage.setItem('jeutaime_users', JSON.stringify(users));
            const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user'));
            if (currentUser && currentUser.email === userEmail) {
              currentUser.coins = users[userIndex].coins;
              localStorage.setItem('jeutaime_current_user', JSON.stringify(currentUser));
            }
          }

          // Check for GAMER badge (10 wins)
          if (gamesStats[userEmail].gamesWon >= 10) {
            checkAndAwardBadge(userEmail, 'gamer');
          }

          console.log(`🎮 Victoire au Morpion ! +50 pts, +${coinReward} 🪙`);
        } else {
          // Player lost
          gamesStats[userEmail].gamesLost++;
          awardPoints(userEmail, 'GAME_LOST');
        }

        localStorage.setItem('jeutaime_games_stats', JSON.stringify(gamesStats));
        localStorage.setItem('jeutaime_last_morpion_state', gameState);
      }
    }
  }, [winner, currentUser, morpionBoard, setUserCoins]);

  return (
    <div style={{
      height: '100dvh',
      overflow: 'hidden',
      
      paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <BackButton onClick={() => setGameScreen(null)} />

      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 'var(--spacing-md)'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600', color: 'var(--color-brown-dark)' }}>⭕ Morpion</h2>
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', marginBottom: '20px', fontWeight: '600' }}>Joueur: {morpionTurn}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '5px', margin: '0 auto 30px', width: 'fit-content' }}>
            {morpionBoard.map((val, idx) => (
              <button key={idx} onClick={() => handleMorpionClick(idx)} style={{ width: '80px', height: '80px', fontSize: '32px', background: '#0a0a0a', border: '2px solid #333', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: val === 'X' ? '#E91E63' : '#2196F3' }}>
                {val}
              </button>
            ))}
          </div>
          {winner && <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Gagnant: {winner}!</p>}
          <button onClick={() => { setMorpionBoard(Array(9).fill(null)); setMorpionTurn('X'); }} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Nouvelle partie</button>
        </div>
      </div>
    </div>
  );
}
