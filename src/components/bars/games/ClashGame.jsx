import React, { useState, useEffect } from 'react';

// Base de données des débats
const clashDebates = [
  {
    id: 1,
    question: 'Premier rendez-vous :',
    optionA: '🍕 Pizza confortable',
    optionB: '🍷 Restaurant chic',
    category: 'dating'
  },
  {
    id: 2,
    question: 'Week-end parfait :',
    optionA: '🏔️ Aventure nature',
    optionB: '🛋️ Netflix & chill',
    category: 'lifestyle'
  },
  {
    id: 3,
    question: 'Meilleur signe d\'intérêt :',
    optionA: '💬 Textos constants',
    optionB: '🎁 Petits cadeaux',
    category: 'dating'
  },
  {
    id: 4,
    question: 'Confession impossible :',
    optionA: '😴 J\'ai menti sur mon âge',
    optionB: '📱 J\'ai stalké ton ex',
    category: 'fun'
  },
  {
    id: 5,
    question: 'Deal breaker :',
    optionA: '🚬 Il/elle fume',
    optionB: '🎮 Trop gamer',
    category: 'serious'
  },
  {
    id: 6,
    question: 'Pire date :',
    optionA: '😶 Silence total',
    optionB: '📱 Sur son phone',
    category: 'dating'
  },
  {
    id: 7,
    question: 'Test ultime :',
    optionA: '🐶 Aime pas les chiens',
    optionB: '😂 Aucun humour',
    category: 'serious'
  },
  {
    id: 8,
    question: 'Pour séduire :',
    optionA: '💪 Confiance en soi',
    optionB: '🎭 Mystère',
    category: 'dating'
  },
  {
    id: 9,
    question: 'Meilleur compliment :',
    optionA: '😍 "T\'es canon"',
    optionB: '🧠 "T\'es intelligent(e)"',
    category: 'dating'
  },
  {
    id: 10,
    question: 'After first date :',
    optionA: '💋 Bisou',
    optionB: '🤗 Juste un câlin',
    category: 'dating'
  },
  {
    id: 11,
    question: 'Red flag énorme :',
    optionA: '💸 Radin extrême',
    optionB: '😤 Jaloux malade',
    category: 'serious'
  },
  {
    id: 12,
    question: 'Pour faire rire :',
    optionA: '🤪 Blagues pourries',
    optionB: '😏 Humour noir',
    category: 'fun'
  }
];

export default function ClashGame({ onClose, currentUser }) {
  const [currentDebate, setCurrentDebate] = useState(null);
  const [votes, setVotes] = useState({ A: 0, B: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [timer, setTimer] = useState(15);
  const [gamePhase, setGamePhase] = useState('voting'); // 'voting' | 'results'
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const maxRounds = 5;

  // Charger un nouveau débat
  useEffect(() => {
    loadNewDebate();
  }, []);

  // Timer pour le vote
  useEffect(() => {
    if (gamePhase === 'voting' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && gamePhase === 'voting') {
      // Temps écoulé, passer aux résultats
      if (!hasVoted) {
        // Vote aléatoire automatique si pas voté
        handleVote(Math.random() > 0.5 ? 'A' : 'B', true);
      } else {
        setGamePhase('results');
      }
    }
  }, [timer, gamePhase, hasVoted]);

  const loadNewDebate = () => {
    const randomDebate = clashDebates[Math.floor(Math.random() * clashDebates.length)];
    setCurrentDebate(randomDebate);

    // Générer des votes aléatoires pour simuler autres participants
    const totalVotes = Math.floor(Math.random() * 30) + 10;
    const aVotes = Math.floor(Math.random() * totalVotes);
    setVotes({ A: aVotes, B: totalVotes - aVotes });

    setHasVoted(false);
    setUserVote(null);
    setTimer(15);
    setGamePhase('voting');
  };

  const handleVote = (option, auto = false) => {
    if (hasVoted && !auto) return;

    setUserVote(option);
    setHasVoted(true);

    // Ajouter le vote de l'utilisateur
    setVotes(prev => ({
      ...prev,
      [option]: prev[option] + 1
    }));

    // Bonus points si on vote avec la majorité (calculé après)
    setTimeout(() => {
      setGamePhase('results');
      const totalVotes = votes.A + votes.B + 1;
      const majorityVote = votes.A >= votes.B ? 'A' : 'B';
      if (option === majorityVote) {
        setScore(s => s + 10);
      } else {
        setScore(s => s + 3); // Points de participation
      }
    }, 500);
  };

  const handleNextRound = () => {
    if (round >= maxRounds) {
      // Fin du jeu
      alert(`🎮 Partie terminée!\n\n🏆 Score final: ${score} points\n\n💰 +${score} pièces gagnées !`);
      onClose();
    } else {
      setRound(r => r + 1);
      loadNewDebate();
    }
  };

  if (!currentDebate) return null;

  const totalVotes = votes.A + votes.B;
  const percentA = totalVotes > 0 ? Math.round((votes.A / totalVotes) * 100) : 50;
  const percentB = totalVotes > 0 ? Math.round((votes.B / totalVotes) * 100) : 50;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>🔥 Clash Game</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
            Round {round}/{maxRounds} • Score: {score}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#333',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Timer */}
      {gamePhase === 'voting' && (
        <div style={{
          background: timer <= 5 ? '#dc3545' : '#2196F3',
          color: 'white',
          padding: '15px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '700',
          animation: timer <= 5 ? 'pulse 1s infinite' : 'none'
        }}>
          ⏱️ {timer}s
        </div>
      )}

      {/* Question */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px',
        textAlign: 'center',
        border: '2px solid #E91E63'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          margin: '0 0 10px 0',
          color: '#E91E63'
        }}>
          {currentDebate.question}
        </h3>
        <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
          Choisis ton camp !
        </p>
      </div>

      {/* Options */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '25px'
      }}>
        {/* Option A */}
        <button
          onClick={() => handleVote('A')}
          disabled={hasVoted}
          style={{
            background: userVote === 'A' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#1a1a1a',
            border: userVote === 'A' ? '3px solid #E91E63' : '1px solid #333',
            borderRadius: '15px',
            padding: '25px 15px',
            color: 'white',
            cursor: hasVoted ? 'default' : 'pointer',
            transition: 'all 0.3s',
            opacity: hasVoted && userVote !== 'A' ? 0.5 : 1,
            transform: userVote === 'A' ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>
            {currentDebate.optionA.split(' ')[0]}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {currentDebate.optionA.substring(currentDebate.optionA.indexOf(' ') + 1)}
          </div>

          {gamePhase === 'results' && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>
                {percentA}%
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                {votes.A} votes
              </div>
            </div>
          )}
        </button>

        {/* Option B */}
        <button
          onClick={() => handleVote('B')}
          disabled={hasVoted}
          style={{
            background: userVote === 'B' ? 'linear-gradient(135deg, #2196F3, #1976D2)' : '#1a1a1a',
            border: userVote === 'B' ? '3px solid #2196F3' : '1px solid #333',
            borderRadius: '15px',
            padding: '25px 15px',
            color: 'white',
            cursor: hasVoted ? 'default' : 'pointer',
            transition: 'all 0.3s',
            opacity: hasVoted && userVote !== 'B' ? 0.5 : 1,
            transform: userVote === 'B' ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>
            {currentDebate.optionB.split(' ')[0]}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {currentDebate.optionB.substring(currentDebate.optionB.indexOf(' ') + 1)}
          </div>

          {gamePhase === 'results' && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>
                {percentB}%
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                {votes.B} votes
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Bouton suivant (résultats) */}
      {gamePhase === 'results' && (
        <button
          onClick={handleNextRound}
          style={{
            width: '100%',
            padding: '18px',
            background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: 'auto'
          }}
        >
          {round >= maxRounds ? '🏆 Terminer' : '➡️ Prochain débat'}
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
