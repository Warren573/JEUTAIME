import React, { useState, useEffect } from 'react';

// Base de dilemmes
const dilemmas = [
  {
    id: 1,
    optionA: {
      text: 'Avouer que tu stalk ton crush sur Insta tous les jours',
      emoji: '👀',
      color: '#E91E63'
    },
    optionB: {
      text: 'Révéler ton nombre de matchs Tinder',
      emoji: '📱',
      color: '#9C27B0'
    }
  },
  {
    id: 2,
    optionA: {
      text: 'Tes parents voient ton historique de recherche',
      emoji: '😱',
      color: '#dc3545'
    },
    optionB: {
      text: 'Ton crush lit tous tes DMs',
      emoji: '💬',
      color: '#FF9800'
    }
  },
  {
    id: 3,
    optionA: {
      text: 'Date avec quelqu\'un de parfait mais 0 humour',
      emoji: '🤐',
      color: '#607D8B'
    },
    optionB: {
      text: 'Date avec quelqu\'un moyen mais hilarant',
      emoji: '😂',
      color: '#4CAF50'
    }
  },
  {
    id: 4,
    optionA: {
      text: 'Ton ex voit toutes tes stories pendant 1 an',
      emoji: '👻',
      color: '#9C27B0'
    },
    optionB: {
      text: 'Tu dois liker TOUTES les photos de ton ex pendant 1 an',
      emoji: '❤️',
      color: '#E91E63'
    }
  },
  {
    id: 5,
    optionA: {
      text: 'Premier date au McDo',
      emoji: '🍔',
      color: '#FFC107'
    },
    optionB: {
      text: 'Premier date chez tes parents',
      emoji: '🏠',
      color: '#FF5722'
    }
  },
  {
    id: 6,
    optionA: {
      text: 'Ghosté après 3 mois de relation',
      emoji: '👻',
      color: '#607D8B'
    },
    optionB: {
      text: 'Friendzoné après 10 dates',
      emoji: '😢',
      color: '#2196F3'
    }
  },
  {
    id: 7,
    optionA: {
      text: 'Ton crush découvre ta fanfic sur lui/elle',
      emoji: '📖',
      color: '#9C27B0'
    },
    optionB: {
      text: 'Ton crush trouve ton journal intime',
      emoji: '📔',
      color: '#E91E63'
    }
  },
  {
    id: 8,
    optionA: {
      text: 'Jamais pouvoir envoyer de nudes',
      emoji: '🚫',
      color: '#dc3545'
    },
    optionB: {
      text: 'Tous tes nudes postés sur ton profil LinkedIn',
      emoji: '💼',
      color: '#0077B5'
    }
  },
  {
    id: 9,
    optionA: {
      text: 'Mauvais haleine permanente',
      emoji: '🤢',
      color: '#4CAF50'
    },
    optionB: {
      text: 'Pets incontrôlables en date',
      emoji: '💨',
      color: '#795548'
    }
  },
  {
    id: 10,
    optionA: {
      text: 'Date qui parle QUE de son ex',
      emoji: '💔',
      color: '#E91E63'
    },
    optionB: {
      text: 'Date qui parle QUE de crypto',
      emoji: '₿',
      color: '#FF9800'
    }
  },
  {
    id: 11,
    optionA: {
      text: 'Appeler ton crush par le nom de ton ex',
      emoji: '😬',
      color: '#dc3545'
    },
    optionB: {
      text: 'Appeler ton crush "Maman/Papa"',
      emoji: '😳',
      color: '#9C27B0'
    }
  },
  {
    id: 12,
    optionA: {
      text: 'Tes amis voient ton historique Pornhub',
      emoji: '🙈',
      color: '#FF9800'
    },
    optionB: {
      text: 'Ton crush voit tes crushes secrets sur Insta',
      emoji: '👀',
      color: '#E91E63'
    }
  },
  {
    id: 13,
    optionA: {
      text: 'Vomir sur ton crush pendant le 1er bisou',
      emoji: '🤮',
      color: '#4CAF50'
    },
    optionB: {
      text: 'Péter bruyamment pendant le 1er bisou',
      emoji: '💨',
      color: '#795548'
    }
  },
  {
    id: 14,
    optionA: {
      text: 'Être avec quelqu\'un qui ronfle comme un tracteur',
      emoji: '😴',
      color: '#607D8B'
    },
    optionB: {
      text: 'Être avec quelqu\'un qui parle dans son sommeil',
      emoji: '💬',
      color: '#2196F3'
    }
  },
  {
    id: 15,
    optionA: {
      text: 'Ton crush voit ta playlist Spotify "sad vibes 3am"',
      emoji: '🎵',
      color: '#1DB954'
    },
    optionB: {
      text: 'Ton crush lit tes textos non envoyés',
      emoji: '📝',
      color: '#9C27B0'
    }
  }
];

export default function WouldYouRather({ onClose, currentUser }) {
  const [currentDilemma, setCurrentDilemma] = useState(null);
  const [round, setRound] = useState(1);
  const [votes, setVotes] = useState({ A: 0, B: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const maxRounds = 8;

  useEffect(() => {
    loadNewDilemma();
  }, []);

  const loadNewDilemma = () => {
    const randomDilemma = dilemmas[Math.floor(Math.random() * dilemmas.length)];
    setCurrentDilemma(randomDilemma);

    // Votes simulés des autres participants
    const totalVotes = Math.floor(Math.random() * 40) + 20;
    const aVotes = Math.floor(Math.random() * totalVotes);
    setVotes({ A: aVotes, B: totalVotes - aVotes });

    setHasVoted(false);
    setUserVote(null);
    setShowResults(false);
  };

  const handleVote = (option) => {
    if (hasVoted) return;

    setUserVote(option);
    setHasVoted(true);
    setVotes(prev => ({
      ...prev,
      [option]: prev[option] + 1
    }));

    setShowResults(true);
  };

  const handleNext = () => {
    if (round >= maxRounds) {
      alert('🎉 Partie terminée !\n\nTu connais mieux les autres maintenant ! 😄');
      onClose();
    } else {
      setRound(r => r + 1);
      loadNewDilemma();
    }
  };

  if (!currentDilemma) return null;

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
        marginBottom: '25px'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>🎲 Tu préfères...</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
            Dilemme {round}/{maxRounds}
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

      {/* Question header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '15px',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          margin: 0,
          color: 'white'
        }}>
          Tu préfères quoi ? 🤔
        </h3>
      </div>

      {/* Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '25px',
        flex: 1
      }}>
        {/* Option A */}
        <button
          onClick={() => handleVote('A')}
          disabled={hasVoted}
          style={{
            background: userVote === 'A' ? `linear-gradient(135deg, ${currentDilemma.optionA.color}, ${currentDilemma.optionA.color}dd)` : '#1a1a1a',
            border: userVote === 'A' ? `3px solid ${currentDilemma.optionA.color}` : '2px solid #333',
            borderRadius: '20px',
            padding: '30px 20px',
            color: 'white',
            cursor: hasVoted ? 'default' : 'pointer',
            transition: 'all 0.3s',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '15px',
            opacity: hasVoted && userVote !== 'A' ? 0.6 : 1,
            transform: userVote === 'A' ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <div style={{ fontSize: '56px' }}>
            {currentDilemma.optionA.emoji}
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '1.4'
          }}>
            {currentDilemma.optionA.text}
          </div>

          {showResults && (
            <div style={{
              marginTop: '15px',
              width: '100%'
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                padding: '12px',
                width: '100%'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#4CAF50', marginBottom: '5px' }}>
                  {percentA}%
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>
                  {votes.A} personnes
                </div>
              </div>
            </div>
          )}
        </button>

        {/* VS */}
        <div style={{
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: '700',
          color: '#666',
          padding: '10px 0'
        }}>
          VS
        </div>

        {/* Option B */}
        <button
          onClick={() => handleVote('B')}
          disabled={hasVoted}
          style={{
            background: userVote === 'B' ? `linear-gradient(135deg, ${currentDilemma.optionB.color}, ${currentDilemma.optionB.color}dd)` : '#1a1a1a',
            border: userVote === 'B' ? `3px solid ${currentDilemma.optionB.color}` : '2px solid #333',
            borderRadius: '20px',
            padding: '30px 20px',
            color: 'white',
            cursor: hasVoted ? 'default' : 'pointer',
            transition: 'all 0.3s',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '15px',
            opacity: hasVoted && userVote !== 'B' ? 0.6 : 1,
            transform: userVote === 'B' ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <div style={{ fontSize: '56px' }}>
            {currentDilemma.optionB.emoji}
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '1.4'
          }}>
            {currentDilemma.optionB.text}
          </div>

          {showResults && (
            <div style={{
              marginTop: '15px',
              width: '100%'
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                padding: '12px',
                width: '100%'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#4CAF50', marginBottom: '5px' }}>
                  {percentB}%
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>
                  {votes.B} personnes
                </div>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Bouton suivant */}
      {showResults && (
        <button
          onClick={handleNext}
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
            marginTop: '20px'
          }}
        >
          {round >= maxRounds ? '🎉 Terminer' : '➡️ Dilemme suivant'}
        </button>
      )}
    </div>
  );
}
