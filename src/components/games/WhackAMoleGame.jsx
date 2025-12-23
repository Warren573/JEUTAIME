import React, { useState, useEffect } from 'react';
import { addCoinsToUser, addPointsToUser, updateUserStats } from '../../utils/demoUsers';

export default function WhackAMoleGame({ setGameScreen, moleBestScore, setMoleBestScore, currentUser, setUserCoins }) {
  const [localMoleScore, setLocalMoleScore] = useState(0);
  const [localMoleTimer, setLocalMoleTimer] = useState(30);
  const [localActiveMoles, setLocalActiveMoles] = useState([]);
  const [localGameActive, setLocalGameActive] = useState(false);
  const [localMoleInterval, setLocalMoleInterval] = useState(1500);

  const moleHoles = Array(16).fill(null).map((_, i) => i);

  useEffect(() => {
    if (!localGameActive) return;

    const gameTimer = setInterval(() => {
      setLocalMoleTimer(prev => {
        if (prev <= 1) {
          setLocalGameActive(false);
          if (localMoleScore > moleBestScore) {
            setMoleBestScore(localMoleScore);
          }
          handleGameEnd(localMoleScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimer);
  }, [localGameActive, localMoleScore, moleBestScore, setMoleBestScore]);

  useEffect(() => {
    if (!localGameActive) return;

    const moleGenerator = setInterval(() => {
      setLocalActiveMoles(prev => {
        if (prev.length < 2) {
          const randomIndex = Math.floor(Math.random() * 16);
          if (!prev.includes(randomIndex)) {
            return [...prev, randomIndex];
          }
        }
        return prev;
      });
    }, localMoleInterval);

    return () => clearInterval(moleGenerator);
  }, [localGameActive, localMoleInterval]);

  const handleMoleClick = (index) => {
    if (!localGameActive) return;

    if (localActiveMoles.includes(index)) {
      setLocalMoleScore(prev => prev + 1);
      setLocalActiveMoles(prev => prev.filter(i => i !== index));
      setLocalMoleInterval(prev => {
        const newInterval = prev - 150;
        return newInterval < 200 ? 200 : newInterval;
      });
    } else {
      setLocalGameActive(false);
      alert(`Oups! Tu as cliqué sur un trou vide. Score: ${localMoleScore}`);
    }
  };

  const handleGameEnd = (finalScore) => {
    // Calcul des récompenses basées sur le score
    const pointsPerMole = 2;
    const coinsPerMole = 5;
    const pointsEarned = finalScore * pointsPerMole;
    const coinsEarned = finalScore * coinsPerMole;

    if (currentUser?.email && finalScore > 0) {
      addPointsToUser(currentUser.email, pointsEarned);
      addCoinsToUser(currentUser.email, coinsEarned);

      // Mettre à jour les stats de jeux
      const currentStats = currentUser.stats || { letters: 0, games: 0, bars: 0 };
      updateUserStats(currentUser.email, {
        games: currentStats.games + 1
      });

      // Mettre à jour l'affichage des pièces
      setUserCoins(prev => prev + coinsEarned);

      alert(`⚡ Partie terminée !\n\nScore: ${finalScore} taupes tapées\n+${pointsEarned} points\n+${coinsEarned} 💰`);
    } else {
      alert(`Fin du jeu! Score: ${finalScore}`);
    }
  };

  const startMoleGame = () => {
    setLocalGameActive(true);
    setLocalMoleScore(0);
    setLocalMoleTimer(30);
    setLocalActiveMoles([]);
    setLocalMoleInterval(1500);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 'var(--spacing-md)'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600', color: 'var(--color-brown-dark)' }}>⚡ Tape Taupe</h2>

      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px', maxWidth: '300px', margin: '0 auto 20px' }}>
          {moleHoles.map(index => (
            <button
              key={index}
              onClick={() => handleMoleClick(index)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: localActiveMoles.includes(index) ? '#FFD700' : '#2a2a2a',
                border: '2px solid #444',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                transition: 'all 0.1s ease'
              }}
            >
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', fontSize: '16px' }}>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#888' }}>Score</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{localMoleScore}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#888' }}>Meilleur</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{moleBestScore}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#888' }}>Temps</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: localMoleTimer < 10 ? '#E91E63' : '#4CAF50' }}>{localMoleTimer}s</p>
          </div>
        </div>

        <button
          onClick={startMoleGame}
          disabled={localGameActive}
          style={{
            padding: '12px 24px',
            background: localGameActive ? '#666' : 'linear-gradient(135deg, #E91E63, #C2185B)',
            border: 'none',
            color: 'white',
            borderRadius: '10px',
            cursor: localGameActive ? 'default' : 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          {localGameActive ? 'Partie en cours...' : 'Jouer'}
        </button>
      </div>
      </div>
    </div>
  );
}
