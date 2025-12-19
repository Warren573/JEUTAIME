import React, { useState, useEffect } from 'react';
import { awardPoints, checkAndAwardBadge } from '../../utils/pointsSystem';
import { addCoinsToUser, updateUserStats, incrementDuelWins } from '../../utils/demoUsers';
import BackButton from '../common/BackButton';

const WINNING_SCORE = 5; // Premier à 5 points gagne

export default function PongGame({ setGameScreen, currentUser, setUserCoins }) {
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
  const [gameFinished, setGameFinished] = useState(false);

  // Touch control handler
  const handleTouchMove = (e) => {
    if (!localGameActive) return;
    const touch = e.touches[0];
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const touchY = touch.clientY - rect.top;

    // Map touch position to paddle position (260px height, 54px paddle)
    const maxPaddleY = 206; // 260 - 54
    const newPaddleY = Math.max(0, Math.min(maxPaddleY, touchY - 27)); // Center paddle on touch
    setLocalPaddleLeftY(newPaddleY / 0.87); // Inverse scale factor
  };

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
          setLocalBotScore(s => {
            const newScore = s + 1;
            setLocalGameActive(false);
            if (newScore >= WINNING_SCORE) {
              setGameFinished(true);
              alert('😢 Défaite ! Le bot a gagné ' + newScore + ' - ' + localPlayerScore);
            }
            return newScore;
          });
          return 190;
        }

        if (prev >= 385) {
          setLocalPlayerScore(s => {
            const newScore = s + 1;
            setLocalGameActive(false);
            if (newScore >= WINNING_SCORE) {
              handleVictory(newScore);
            }
            return newScore;
          });
          return 190;
        }

        return prev;
      });
    }, 20);

    return () => clearInterval(collisionCheck);
  }, [localGameActive, localBallY, localPaddleLeftY, localPaddleRightY]);

  const handleVictory = (finalScore) => {
    setGameFinished(true);
    const pointsEarned = 20; // Points pour gagner un duel
    const coinsEarned = 50; // Pièces pour gagner un duel

    // Attribuer les points et pièces
    if (currentUser?.email) {
      awardPoints(currentUser.email, 'DUEL_WON');
      addCoinsToUser(currentUser.email, coinsEarned);

      // Mettre à jour les stats de jeux
      const currentStats = currentUser.stats || { letters: 0, games: 0, bars: 0 };
      updateUserStats(currentUser.email, {
        games: currentStats.games + 1
      });

      // Incrémenter les victoires de duels et vérifier le badge warrior
      const totalDuelWins = incrementDuelWins(currentUser.email);
      if (totalDuelWins >= 5) {
        checkAndAwardBadge(currentUser.email, 'warrior'); // 5 duels gagnés = badge warrior
      }

      // Mettre à jour l'affichage des pièces
      setUserCoins(prev => prev + coinsEarned);

      alert(`🎉 Victoire ! ${finalScore} - ${localBotScore}\n\n+${pointsEarned} points\n+${coinsEarned} 💰${totalDuelWins >= 5 ? '\n\n⚔️ Badge Warrior débloqué !' : ''}`);
    } else {
      alert(`🎉 Victoire ! ${finalScore} - ${localBotScore}`);
    }
  };

  const resetGame = () => {
    setLocalBallX(190);
    setLocalBallY(140);
    setLocalBallDirX(1);
    setLocalBallDirY(1);
    setLocalBallSpeed(4);
    setLocalPaddleLeftY(118);
    setLocalPaddleRightY(118);
    setLocalPlayerScore(0);
    setLocalBotScore(0);
    setGameFinished(false);
    setLocalGameActive(false);
  };

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
    <div style={{
      height: '100dvh',
      overflow: 'hidden',
      paddingTop: 'env(safe-area-inset-top)',
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
        <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600', color: 'var(--color-brown-dark)' }}>🎮 Pong</h2>

      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
        <div
          onTouchMove={handleTouchMove}
          style={{
            position: 'relative',
            width: '340px',
            height: '260px',
            background: '#0a0a0a',
            border: '2px solid #888',
            marginBottom: '20px',
            margin: '0 auto 20px',
            maxWidth: '100%',
            touchAction: 'none'
          }}>
          <div style={{ position: 'absolute', left: '10px', top: `${localPaddleLeftY * 0.87}px`, width: '12px', height: '54px', background: '#f5f5f5', borderRadius: '6px' }} />
          <div style={{ position: 'absolute', right: '10px', top: `${localPaddleRightY * 0.87}px`, width: '12px', height: '54px', background: '#f5f5f5', borderRadius: '6px' }} />
          <div style={{ position: 'absolute', left: `${localBallX * 0.87}px`, top: `${localBallY * 0.87}px`, width: '12px', height: '12px', background: '#FFD700', borderRadius: '50%' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
          <div>Vous: {localPlayerScore}</div>
          <div>Bot: {localBotScore}</div>
        </div>

        {gameFinished && (
          <div style={{ marginBottom: '20px', padding: '15px', background: localPlayerScore >= WINNING_SCORE ? '#4CAF50' : '#f44336', borderRadius: '10px' }}>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 10px 0' }}>
              {localPlayerScore >= WINNING_SCORE ? '🎉 Victoire !' : '😢 Défaite'}
            </p>
            <p style={{ fontSize: '14px', margin: '0' }}>
              {localPlayerScore >= WINNING_SCORE ? `+20 points et +50 💰` : 'Retente ta chance !'}
            </p>
          </div>
        )}

        <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
          {gameFinished ? `Premier à ${WINNING_SCORE} points` : '👆 Glisse ton doigt sur l\'écran pour bouger ta raquette'}
        </p>

        {!gameFinished ? (
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
            {localGameActive ? 'Partie en cours...' : (localPlayerScore > 0 || localBotScore > 0 ? 'Continuer' : 'Jouer')}
          </button>
        ) : (
          <button
            onClick={resetGame}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
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
        )}
      </div>
      </div>
    </div>
  );
}
