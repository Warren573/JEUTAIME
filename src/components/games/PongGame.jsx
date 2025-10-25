import React, { useState, useEffect } from 'react';

export default function PongGame({ setGameScreen }) {
  const [localBallX, setLocalBallX] = useState(290);
  const [localBallY, setLocalBallY] = useState(190);
  const [localBallDirX, setLocalBallDirX] = useState(1);
  const [localBallDirY, setLocalBallDirY] = useState(1);
  const [localBallSpeed, setLocalBallSpeed] = useState(4);
  const [localPaddleLeftY, setLocalPaddleLeftY] = useState(168);
  const [localPaddleRightY, setLocalPaddleRightY] = useState(168);
  const [localPlayerScore, setLocalPlayerScore] = useState(0);
  const [localBotScore, setLocalBotScore] = useState(0);
  const [localGameActive, setLocalGameActive] = useState(false);
  const [keysPressed, setKeysPressed] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        setKeysPressed(prev => ({ ...prev, [e.code]: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        setKeysPressed(prev => ({ ...prev, [e.code]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!localGameActive) return;

    const gameLoop = setInterval(() => {
      if (keysPressed['ArrowUp']) {
        setLocalPaddleLeftY(prev => Math.max(0, prev - 28));
      }
      if (keysPressed['ArrowDown']) {
        setLocalPaddleLeftY(prev => Math.min(236, prev + 28));
      }

      setLocalBallX(prev => prev + localBallSpeed * localBallDirX);
      setLocalBallY(prev => prev + localBallSpeed * localBallDirY);

      setLocalBallY(prev => {
        if (prev <= 0 || prev >= 280) {
          setLocalBallDirY(d => -d);
          return Math.max(0, Math.min(280, prev));
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [localGameActive, keysPressed, localBallSpeed, localBallDirX, localBallDirY]);

  useEffect(() => {
    if (!localGameActive) return;

    const aiLoop = setInterval(() => {
      setLocalPaddleRightY(prev => {
        const centerPaddle = prev + 32;
        const ballCenter = localBallY + 6;
        const diff = ballCenter - centerPaddle;

        if (Math.abs(diff) > 20) {
          if (diff > 0 && prev + 64 < 236) {
            return prev + 14;
          } else if (diff < 0 && prev > 0) {
            return prev - 14;
          }
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(aiLoop);
  }, [localGameActive, localBallY]);

  useEffect(() => {
    if (!localGameActive) return;

    const collisionCheck = setInterval(() => {
      setLocalBallX(prev => {
        if (
          prev <= 30 &&
          localBallY + 10 >= localPaddleLeftY &&
          localBallY <= localPaddleLeftY + 64
        ) {
          setLocalBallDirX(1);
          setLocalBallSpeed(s => Math.min(12, s + 0.25));
          return 30;
        }

        if (
          prev >= 360 &&
          localBallY + 10 >= localPaddleRightY &&
          localBallY <= localPaddleRightY + 64
        ) {
          setLocalBallDirX(-1);
          setLocalBallSpeed(s => Math.min(12, s + 0.25));
          return 360;
        }

        if (prev <= 0) {
          setLocalBotScore(s => s + 1);
          setLocalGameActive(false);
          alert('Le bot a marqué un point!');
          return 190;
        }

        if (prev >= 385) {
          setLocalPlayerScore(s => s + 1);
          setLocalGameActive(false);
          alert('Vous avez marqué un point!');
          return 190;
        }

        return prev;
      });
    }, 20);

    return () => clearInterval(collisionCheck);
  }, [localGameActive, localBallY, localPaddleLeftY, localPaddleRightY]);

  const startGame = () => {
    setLocalBallX(190);
    setLocalBallY(140);
    setLocalBallDirX(1);
    setLocalBallDirY(1);
    setLocalBallSpeed(4);
    setLocalPaddleLeftY(118);
    setLocalPaddleRightY(118);
    setLocalGameActive(true);
  };

  return (
    <div>
      <button onClick={() => setGameScreen(null)} style={{ padding: '10px 20px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>← Retour</button>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>🎮 Pong</h2>

      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '400px', height: '300px', background: '#0a0a0a', border: '2px solid #888', marginBottom: '20px', margin: '0 auto 20px' }}>
          <div style={{ position: 'absolute', left: '10px', top: `${localPaddleLeftY}px`, width: '15px', height: '64px', background: '#f5f5f5', borderRadius: '6px' }} />
          <div style={{ position: 'absolute', right: '10px', top: `${localPaddleRightY}px`, width: '15px', height: '64px', background: '#f5f5f5', borderRadius: '6px' }} />
          <div style={{ position: 'absolute', left: `${localBallX}px`, top: `${localBallY}px`, width: '15px', height: '15px', background: '#FFD700', borderRadius: '50%' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
          <div>Vous: {localPlayerScore}</div>
          <div>Bot: {localBotScore}</div>
        </div>

        <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Utilise les flèches ↑↓ pour bouger ta raquette</p>

        <button
          onClick={startGame}
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
