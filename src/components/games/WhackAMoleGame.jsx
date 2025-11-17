import React, { useState, useEffect } from 'react';
import { awardGameRewards, showRewardModal } from '../../utils/gameRewards';
import { getGameScores } from '../../config/gamesConfig';

export default function WhackAMoleGame({ setGameScreen, currentUser, setUserCoins }) {
  const [localMoleScore, setLocalMoleScore] = useState(0);
  const [localMoleTimer, setLocalMoleTimer] = useState(30);
  const [localActiveMoles, setLocalActiveMoles] = useState([]);
  const [localGameActive, setLocalGameActive] = useState(false);
  const [localMoleInterval, setLocalMoleInterval] = useState(1500);
  const [bestScore, setBestScore] = useState(0);
  const [totalPlays, setTotalPlays] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);

  const moleHoles = Array(16).fill(null).map((_, i) => i);

  // Charger les scores au démarrage
  useEffect(() => {
    if (currentUser) {
      const gameData = getGameScores(currentUser.email, 'WHACK_A_MOLE');
      if (gameData) {
        setBestScore(gameData.bestScore);
        setTotalPlays(gameData.totalPlays);
        setTotalCoinsEarned(gameData.totalCoinsEarned || 0);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (!localGameActive) return;

    const gameTimer = setInterval(() => {
      setLocalMoleTimer(prev => {
        if (prev <= 1) {
          setLocalGameActive(false);
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimer);
  }, [localGameActive]);

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

  const handleGameEnd = () => {
    if (!currentUser) {
      alert(`Fin du jeu ! Score: ${localMoleScore}`);
      return;
    }

    // Attribuer les récompenses
    const reward = awardGameRewards(currentUser.email, 'WHACK_A_MOLE', {
      score: localMoleScore
    });

    // Mettre à jour les states
    if (localMoleScore > bestScore) {
      setBestScore(localMoleScore);
    }
    setTotalPlays(prev => prev + 1);
    setTotalCoinsEarned(prev => prev + reward.coins);

    // Mettre à jour les pièces de l'utilisateur dans le parent
    if (setUserCoins) {
      setUserCoins(reward.newCoins);
    }

    // Afficher le modal de récompense
    showRewardModal(reward);
  };

  const handleMoleClick = (index) => {
    if (!localGameActive) return;

    if (localActiveMoles.includes(index)) {
      setLocalMoleScore(prev => prev + 1);
      setLocalActiveMoles(prev => prev.filter(i => i !== index));
      setLocalMoleInterval(prev => {
        const newInterval = prev - 50;
        return newInterval < 300 ? 300 : newInterval;
      });
    } else {
      setLocalGameActive(false);

      if (!currentUser) {
        alert(`Oups ! Tu as cliqué sur un trou vide. Score: ${localMoleScore}`);
        return;
      }

      // Attribuer les récompenses même en cas d'échec
      const reward = awardGameRewards(currentUser.email, 'WHACK_A_MOLE', {
        score: localMoleScore
      });

      if (localMoleScore > bestScore) {
        setBestScore(localMoleScore);
      }
      setTotalPlays(prev => prev + 1);
      setTotalCoinsEarned(prev => prev + reward.coins);

      if (setUserCoins) {
        setUserCoins(reward.newCoins);
      }

      showRewardModal({
        ...reward,
        message: `Oups ! Trou vide 😅\n\n${reward.message}`
      });
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

      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>⚡ Tape la Taupe</h2>

      {/* Stats globales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>
            Meilleur Score
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
            {bestScore}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #FF9800, #F57C00)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>
            Parties
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
            {totalPlays}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>
            🪙 Gagnées
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
            {totalCoinsEarned}
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          marginBottom: '20px',
          maxWidth: '300px',
          margin: '0 auto 20px'
        }}>
          {moleHoles.map(index => {
            const isActive = localActiveMoles.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleMoleClick(index)}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: isActive
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                    : '#2a2a2a',
                  border: isActive ? '3px solid #FFD700' : '2px solid #444',
                  cursor: 'pointer',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  transition: 'all 0.1s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isActive ? '0 0 20px rgba(255, 215, 0, 0.5)' : 'none'
                }}
              >
                {isActive ? '😊' : ''}
              </button>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '20px',
          fontSize: '16px'
        }}>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#888' }}>Score</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>
              {localMoleScore}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#888' }}>Record</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#FFD700' }}>
              {bestScore}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#888' }}>Temps</p>
            <p style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 'bold',
              color: localMoleTimer < 10 ? '#E91E63' : '#4CAF50'
            }}>
              {localMoleTimer}s
            </p>
          </div>
        </div>

        {/* Indicateur de récompenses potentielles */}
        {localMoleScore > 0 && localGameActive && (
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '13px', color: '#FFD700', fontWeight: '600' }}>
              💰 Récompense actuelle: {localMoleScore * 2} pièces
            </div>
            {localMoleScore >= 10 && (
              <div style={{ fontSize: '12px', color: '#4CAF50', marginTop: '5px' }}>
                🎉 Bonus 10+ activé !
              </div>
            )}
            {localMoleScore >= 20 && (
              <div style={{ fontSize: '12px', color: '#FF9800', marginTop: '5px' }}>
                🔥 Bonus 20+ activé !
              </div>
            )}
            {localMoleScore >= 30 && (
              <div style={{ fontSize: '12px', color: '#E91E63', marginTop: '5px' }}>
                ⚡ Bonus 30+ activé !
              </div>
            )}
          </div>
        )}

        <button
          onClick={startMoleGame}
          disabled={localGameActive}
          style={{
            padding: '15px 30px',
            background: localGameActive
              ? '#666'
              : 'linear-gradient(135deg, #E91E63, #C2185B)',
            border: 'none',
            color: 'white',
            borderRadius: '12px',
            cursor: localGameActive ? 'default' : 'pointer',
            fontWeight: '700',
            fontSize: '18px',
            boxShadow: localGameActive ? 'none' : '0 4px 15px rgba(233, 30, 99, 0.4)',
            transition: 'all 0.3s'
          }}
        >
          {localGameActive ? '⚡ Partie en cours...' : '🎮 Jouer'}
        </button>

        {/* Info récompenses */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#0a0a0a',
          borderRadius: '12px',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFD700', marginBottom: '10px' }}>
            💰 Récompenses
          </div>
          <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.6' }}>
            • 2 pièces par point<br />
            • Bonus 10+ : +20 pièces<br />
            • Bonus 20+ : +50 pièces<br />
            • Bonus 30+ : +100 pièces<br />
            • Bonus 50+ : +200 pièces<br />
            🏆 Record 50+ = Badge "Maître des Taupes"
          </div>
        </div>
      </div>
    </div>
  );
}
