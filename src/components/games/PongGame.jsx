import React, { useState, useEffect } from 'react';
import { awardGameRewards, showRewardModal } from '../../utils/gameRewards';
import { getGameScores } from '../../config/gamesConfig';

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

  // Stats
  const [totalGames, setTotalGames] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const MAX_SCORE = 5; // Première à 5 points gagne

  // Charger les stats au démarrage
  useEffect(() => {
    if (currentUser) {
      const gameData = getGameScores(currentUser.email, 'PONG');
      if (gameData) {
        setTotalGames(gameData.totalPlays || 0);
        setTotalWins(gameData.wins || 0);
        setTotalCoinsEarned(gameData.totalCoinsEarned || 0);
        setBestScore(gameData.bestScore || 0);
      }
    }
  }, [currentUser]);

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

  const handleGameEnd = (playerScore, botScore) => {
    if (!currentUser) {
      const won = playerScore > botScore;
      alert(won ? `🎉 Victoire ${playerScore}-${botScore} !` : `😔 Défaite ${playerScore}-${botScore}...`);
      return;
    }

    const won = playerScore > botScore;

    // Attribuer les récompenses
    const reward = awardGameRewards(currentUser.email, 'PONG', {
      playerScore: playerScore,
      opponentScore: botScore,
      score: playerScore
    });

    // Mettre à jour les stats
    setTotalGames(prev => prev + 1);
    if (won) {
      setTotalWins(prev => prev + 1);
    }
    setTotalCoinsEarned(prev => prev + reward.coins);
    if (playerScore > bestScore) {
      setBestScore(playerScore);
    }

    // Mettre à jour les pièces
    if (setUserCoins) {
      setUserCoins(reward.newCoins);
    }

    // Mettre à jour wins dans game_scores pour le badge
    const scores = JSON.parse(localStorage.getItem('jeutaime_game_scores') || '{}');
    if (scores[currentUser.email] && scores[currentUser.email].PONG) {
      scores[currentUser.email].PONG.wins = (scores[currentUser.email].PONG.wins || 0) + (won ? 1 : 0);
      localStorage.setItem('jeutaime_game_scores', JSON.stringify(scores));
    }

    // Afficher le modal
    showRewardModal(reward);
  };

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
          const newBotScore = localBotScore + 1;
          setLocalBotScore(newBotScore);
          setLocalGameActive(false);

          if (newBotScore >= MAX_SCORE) {
            setTimeout(() => handleGameEnd(localPlayerScore, newBotScore), 500);
          }
          return 190;
        }

        if (prev >= 385) {
          const newPlayerScore = localPlayerScore + 1;
          setLocalPlayerScore(newPlayerScore);
          setLocalGameActive(false);

          if (newPlayerScore >= MAX_SCORE) {
            setTimeout(() => handleGameEnd(newPlayerScore, localBotScore), 500);
          }
          return 190;
        }

        return prev;
      });
    }, 20);

    return () => clearInterval(collisionCheck);
  }, [localGameActive, localBallY, localPaddleLeftY, localPaddleRightY]);

  const startGame = () => {
    // Reset si un joueur a atteint MAX_SCORE
    if (localPlayerScore >= MAX_SCORE || localBotScore >= MAX_SCORE) {
      setLocalPlayerScore(0);
      setLocalBotScore(0);
    }

    setLocalBallX(190);
    setLocalBallY(140);
    setLocalBallDirX(1);
    setLocalBallDirY(1);
    setLocalBallSpeed(4);
    setLocalPaddleLeftY(118);
    setLocalPaddleRightY(118);
    setLocalGameActive(true);
  };

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

      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>🏓 Pong</h2>

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
          background: 'linear-gradient(135deg, #E91E63, #C2185B)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Record
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {bestScore}
          </div>
        </div>
      </div>

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
            • <strong>Victoire :</strong> 50 pièces + 5 points<br />
            • <strong>Défaite :</strong> 10 pièces + 2 points<br />
            • <strong>Bonus points :</strong> 5 pièces par point marqué<br />
            • <strong>Badge "Champion de Pong" :</strong> Débloqué à 10 victoires (100 points bonus)
          </div>
        </div>
      </div>
    </div>
  );
}
