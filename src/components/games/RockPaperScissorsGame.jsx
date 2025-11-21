import React, { useState, useEffect } from 'react';

export default function RockPaperScissorsGame({ currentUser, opponent, onClose, onGameEnd }) {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [round, setRound] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const choices = [
    { id: 'rock', emoji: '✊', label: 'Pierre' },
    { id: 'paper', emoji: '✋', label: 'Feuille' },
    { id: 'scissors', emoji: '✌️', label: 'Ciseaux' }
  ];

  const maxRounds = 3;

  const getWinner = (player, opponent) => {
    if (player === opponent) return 'draw';
    if (
      (player === 'rock' && opponent === 'scissors') ||
      (player === 'paper' && opponent === 'rock') ||
      (player === 'scissors' && opponent === 'paper')
    ) {
      return 'player';
    }
    return 'opponent';
  };

  const handleChoice = (choice) => {
    if (isAnimating || result) return;

    setPlayerChoice(choice);
    setIsAnimating(true);

    // Countdown animation
    let count = 3;
    setCountdown(count);
    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countInterval);
        setCountdown(null);

        // Choix de l'adversaire (IA aléatoire pour la démo)
        const opponentPick = choices[Math.floor(Math.random() * choices.length)].id;
        setOpponentChoice(opponentPick);

        // Déterminer le gagnant
        const winner = getWinner(choice, opponentPick);
        setResult(winner);

        // Mettre à jour le score
        if (winner === 'player') {
          setScore(prev => ({ ...prev, player: prev.player + 1 }));
        } else if (winner === 'opponent') {
          setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
        }

        setIsAnimating(false);
      }
    }, 800);
  };

  const handleNextRound = () => {
    if (round >= maxRounds) {
      // Fin du jeu
      const finalWinner = score.player > score.opponent ? 'player' :
                         score.opponent > score.player ? 'opponent' : 'draw';

      if (onGameEnd) {
        onGameEnd(finalWinner, score);
      }
      return;
    }

    // Round suivant
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setRound(round + 1);
  };

  const getResultMessage = () => {
    if (!result) return '';
    if (result === 'draw') return '🤝 Égalité !';
    if (result === 'player') return '🎉 Tu gagnes ce round !';
    return '😞 Tu perds ce round...';
  };

  const getResultColor = () => {
    if (!result) return 'var(--color-beige)';
    if (result === 'draw') return '#FFA500';
    if (result === 'player') return '#4CAF50';
    return '#E74C3C';
  };

  const isFinalRound = round === maxRounds && result;
  const finalWinner = isFinalRound ? (
    score.player > score.opponent ? 'player' :
    score.opponent > score.player ? 'opponent' : 'draw'
  ) : null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 'var(--spacing-lg)'
    }}>
      <div style={{
        background: 'var(--color-cream)',
        borderRadius: 'var(--border-radius-xl)',
        padding: 'var(--spacing-xl)',
        maxWidth: '500px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)',
        border: '4px solid var(--color-brown-dark)',
        position: 'relative'
      }}>
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#E74C3C',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}
        >
          ×
        </button>

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--spacing-xs) 0'
          }}>
            ✊✋✌️ Pierre-Feuille-Ciseaux
          </h2>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            fontWeight: '600'
          }}>
            Round {round}/{maxRounds}
          </div>
        </div>

        {/* Score */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          background: 'var(--color-beige-light)',
          borderRadius: 'var(--border-radius-md)',
          border: '2px solid var(--color-brown-light)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {currentUser?.name || 'Toi'}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>
              {score.player}
            </div>
          </div>
          <div style={{ fontSize: '2rem', color: 'var(--color-text-light)' }}>-</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {opponent?.name || 'Adversaire'}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#E74C3C' }}>
              {score.opponent}
            </div>
          </div>
        </div>

        {/* Zone de jeu */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
          minHeight: '120px'
        }}>
          {/* Choix du joueur */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: playerChoice ? 1 : 0.3,
              transition: 'all 0.3s'
            }}>
              {playerChoice ? choices.find(c => c.id === playerChoice)?.emoji : '❓'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Toi
            </div>
          </div>

          {/* VS / Countdown */}
          <div style={{ textAlign: 'center' }}>
            {countdown ? (
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#FF6B9D',
                animation: 'pulse 0.8s ease-in-out'
              }}>
                {countdown}
              </div>
            ) : (
              <div style={{ fontSize: '1.5rem', color: 'var(--color-text-light)' }}>
                VS
              </div>
            )}
          </div>

          {/* Choix de l'adversaire */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: opponentChoice ? 1 : 0.3,
              transition: 'all 0.3s'
            }}>
              {opponentChoice ? choices.find(c => c.id === opponentChoice)?.emoji : '❓'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {opponent?.name || 'Adversaire'}
            </div>
          </div>
        </div>

        {/* Résultat du round */}
        {result && (
          <div style={{
            padding: 'var(--spacing-md)',
            background: getResultColor(),
            color: 'white',
            borderRadius: 'var(--border-radius-md)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-lg)',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {getResultMessage()}
          </div>
        )}

        {/* Résultat final */}
        {isFinalRound && (
          <div style={{
            padding: 'var(--spacing-lg)',
            background: finalWinner === 'player' ? '#4CAF50' : finalWinner === 'opponent' ? '#E74C3C' : '#FFA500',
            color: 'white',
            borderRadius: 'var(--border-radius-md)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-lg)',
            border: '3px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
              {finalWinner === 'player' ? '🏆' : finalWinner === 'opponent' ? '😢' : '🤝'}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>
              {finalWinner === 'player' ? 'VICTOIRE !' : finalWinner === 'opponent' ? 'DÉFAITE' : 'ÉGALITÉ'}
            </div>
            <div style={{ fontSize: '1.2rem' }}>
              {score.player} - {score.opponent}
            </div>
          </div>
        )}

        {/* Boutons de choix */}
        {!result && !isAnimating && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--spacing-md)'
          }}>
            {choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--color-beige-light)',
                  border: '3px solid var(--color-brown-light)',
                  borderRadius: 'var(--border-radius-lg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px) scale(1.05)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                  e.target.style.background = 'var(--color-cream)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'var(--color-beige-light)';
                }}
              >
                <div style={{ fontSize: '3rem' }}>{choice.emoji}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
                  {choice.label}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bouton suivant / Fermer */}
        {result && (
          <button
            onClick={isFinalRound ? onClose : handleNextRound}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              background: isFinalRound ? '#E74C3C' : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            {isFinalRound ? 'Fermer' : 'Round suivant →'}
          </button>
        )}

        {/* Animations CSS */}
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
