import React, { useState, useEffect } from 'react';

export default function WhackAMoleGame({ setGameScreen, moleBestScore, setMoleBestScore }) {
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
          alert(`Fin du jeu! Score: ${localMoleScore}`);
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

  const startMoleGame = () => {
    setLocalGameActive(true);
    setLocalMoleScore(0);
    setLocalMoleTimer(30);
    setLocalActiveMoles([]);
    setLocalMoleInterval(1500);
  };

  return (
    <div>
      <button onClick={() => setGameScreen(null)} style={{ padding: '10px 20px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>← Retour</button>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>⚡ Tape la Taupe</h2>

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
              {localActiveMoles.includes(index) ? '😊' : ''}
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
  );
}
