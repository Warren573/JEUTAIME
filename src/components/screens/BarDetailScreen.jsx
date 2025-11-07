import React, { useState, useEffect } from 'react';

export default function BarDetailScreen({ bar, currentUser, setSelectedBar }) {
  // Mock data pour le développement
  const [story, setStory] = useState([
    { id: 1, user: 'Marie', text: 'Il était une fois, dans un royaume lointain...', timestamp: Date.now() - 3600000 },
    { id: 2, user: 'Thomas', text: 'Un chevalier courageux découvrit une carte mystérieuse.', timestamp: Date.now() - 1800000 },
    { id: 3, user: 'Sophie', text: 'La carte menait vers une forêt enchantée où...', timestamp: Date.now() - 900000 }
  ]);

  const [members, setMembers] = useState([
    { id: 1, name: 'Marie', emoji: '🌸', isPatron: false, skippedTurns: 0 },
    { id: 2, name: 'Thomas', emoji: '⚔️', isPatron: false, skippedTurns: 0 },
    { id: 3, name: 'Sophie', emoji: '📖', isPatron: false, skippedTurns: 1 },
    { id: 4, name: currentUser?.name || 'Vous', emoji: '✨', isPatron: true, skippedTurns: 0 }
  ]);

  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [newSentence, setNewSentence] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24h en secondes
  const [voteRestart, setVoteRestart] = useState({ voted: false, count: 0 });

  const currentPlayer = members[currentTurnIndex];
  const isMyTurn = currentPlayer?.name === (currentUser?.name || 'Vous');
  const isPatron = members.find(m => m.name === (currentUser?.name || 'Vous'))?.isPatron;

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          // Tour sauté - passer au suivant
          handleSkipTurn();
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTurnIndex]);

  const handleSkipTurn = () => {
    const updatedMembers = [...members];
    updatedMembers[currentTurnIndex].skippedTurns += 1;

    // Expulsion automatique après 2 tours sautés
    if (updatedMembers[currentTurnIndex].skippedTurns >= 2) {
      alert(`❌ ${updatedMembers[currentTurnIndex].name} a été expulsé(e) du bar (2 tours sautés)`);
      updatedMembers.splice(currentTurnIndex, 1);
      setMembers(updatedMembers);
    }

    // Passer au joueur suivant
    setCurrentTurnIndex((currentTurnIndex + 1) % updatedMembers.length);
  };

  const handleSubmitSentence = () => {
    if (newSentence.trim().length < 10) {
      alert('⚠️ Votre phrase doit faire au moins 10 caractères !');
      return;
    }

    const newStoryEntry = {
      id: story.length + 1,
      user: currentUser?.name || 'Vous',
      text: newSentence.trim(),
      timestamp: Date.now()
    };

    setStory([...story, newStoryEntry]);
    setNewSentence('');
    setTimeRemaining(24 * 60 * 60); // Reset timer

    // Passer au joueur suivant
    setCurrentTurnIndex((currentTurnIndex + 1) % members.length);
  };

  const handleSaveToJournal = () => {
    const storyText = story.map(s => `${s.user}: ${s.text}`).join('\n\n');
    alert(`📔 Histoire sauvegardée dans votre journal !\n\n${storyText}`);
  };

  const handleExpelMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    const reason = prompt(`Raison de l'expulsion de ${member.name} :`);

    if (reason && reason.trim().length > 10) {
      const updatedMembers = members.filter(m => m.id !== memberId);
      setMembers(updatedMembers);
      alert(`✅ ${member.name} a été expulsé(e) du bar.\nRaison: ${reason}`);
    } else if (reason) {
      alert('⚠️ La raison doit faire au moins 10 caractères.');
    }
  };

  const handleVoteRestart = () => {
    setVoteRestart({ voted: true, count: voteRestart.count + 1 });

    // Si unanimité (tous les membres restants votent)
    if (voteRestart.count + 1 >= members.length) {
      setStory([]);
      setVoteRestart({ voted: false, count: 0 });
      setCurrentTurnIndex(Math.floor(Math.random() * members.length));
      alert('🔄 L\'histoire a été redémarrée ! Nouveau tirage au sort...');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div style={{
      maxHeight: 'calc(100vh - 80px)',
      overflowY: 'auto',
      paddingBottom: '100px',
      background: 'var(--color-beige-light)'
    }}>
      {/* En-tête du bar */}
      <div style={{
        background: bar?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-md)',
        borderBottom: '4px solid rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={() => setSelectedBar(null)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '10px',
            fontWeight: '600'
          }}
        >
          ← Retour aux bars
        </button>

        <h1 style={{
          fontSize: '2rem',
          color: 'white',
          margin: '10px 0',
          fontWeight: '700'
        }}>
          {bar?.emoji} {bar?.name}
        </h1>

        {/* Membres du bar */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '15px',
          flexWrap: 'wrap'
        }}>
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                background: member.id === members[currentTurnIndex]?.id
                  ? 'rgba(255, 215, 0, 0.3)'
                  : 'rgba(255,255,255,0.2)',
                padding: '8px 12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: member.id === members[currentTurnIndex]?.id ? '2px solid #FFD700' : 'none'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{member.emoji}</span>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
                {member.name}
                {member.isPatron && ' 👑'}
                {member.skippedTurns > 0 && ` ⚠️${member.skippedTurns}`}
              </span>
              {isPatron && member.id !== members.find(m => m.isPatron)?.id && (
                <button
                  onClick={() => handleExpelMember(member.id)}
                  style={{
                    background: '#E91E63',
                    border: 'none',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    marginLeft: '5px'
                  }}
                >
                  Expulser
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 'var(--spacing-lg)' }}>
        {/* Timer et tour actuel */}
        <div style={{
          background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
          borderRadius: '12px',
          padding: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Tour de</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              {currentPlayer?.emoji} {currentPlayer?.name}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Temps restant</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* L'histoire en cours */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          boxShadow: 'var(--shadow-sm)',
          border: '2px solid var(--color-brown-light)'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            color: 'var(--color-brown-dark)',
            marginBottom: 'var(--spacing-md)',
            fontWeight: '700'
          }}>
            📖 L'histoire
          </h2>

          {story.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
              L'histoire n'a pas encore commencé...
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {story.map((sentence) => (
                <div
                  key={sentence.id}
                  style={{
                    background: 'var(--color-beige-light)',
                    padding: '12px',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--color-gold)'
                  }}
                >
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '5px',
                    fontWeight: '600'
                  }}>
                    {sentence.user}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.5'
                  }}>
                    {sentence.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bouton sauvegarder */}
          {story.length > 0 && (
            <button
              onClick={handleSaveToJournal}
              style={{
                width: '100%',
                marginTop: 'var(--spacing-md)',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                color: 'white',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem'
              }}
            >
              📔 Sauvegarder dans mon journal
            </button>
          )}
        </div>

        {/* Zone d'écriture (si c'est votre tour) */}
        {isMyTurn && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '3px solid #FFD700'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              color: 'var(--color-brown-dark)',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '700'
            }}>
              ✍️ C'est votre tour !
            </h3>
            <textarea
              value={newSentence}
              onChange={(e) => setNewSentence(e.target.value)}
              placeholder="Ajoutez votre phrase à l'histoire... (minimum 10 caractères)"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid var(--color-brown-light)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                {newSentence.length} caractères
              </span>
              <button
                onClick={handleSubmitSentence}
                disabled={newSentence.trim().length < 10}
                style={{
                  padding: '12px 24px',
                  background: newSentence.trim().length < 10
                    ? '#ccc'
                    : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '10px',
                  cursor: newSentence.trim().length < 10 ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '0.95rem'
                }}
              >
                Envoyer ✨
              </button>
            </div>
          </div>
        )}

        {/* Vote pour redémarrer (si 1-2 personnes) */}
        {members.length <= 2 && story.length > 0 && (
          <div style={{
            background: '#fff3cd',
            borderRadius: '12px',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            border: '2px solid #ffc107'
          }}>
            <h3 style={{
              fontSize: '1rem',
              color: '#856404',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '700'
            }}>
              🔄 Redémarrer l'histoire ?
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#856404', marginBottom: 'var(--spacing-sm)' }}>
              Vous n'êtes plus que {members.length}. Vous pouvez voter pour redémarrer une nouvelle histoire.
            </p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handleVoteRestart}
                disabled={voteRestart.voted}
                style={{
                  padding: '10px 20px',
                  background: voteRestart.voted ? '#ccc' : '#ffc107',
                  border: 'none',
                  color: voteRestart.voted ? '#666' : '#000',
                  borderRadius: '8px',
                  cursor: voteRestart.voted ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}
              >
                {voteRestart.voted ? '✓ Voté' : 'Voter pour redémarrer'}
              </button>
              <span style={{ fontSize: '0.9rem', color: '#856404', fontWeight: '600' }}>
                {voteRestart.count}/{members.length} votes
              </span>
            </div>
          </div>
        )}

        {/* Pouvoirs du Patron */}
        {isPatron && (
          <div style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '12px',
            padding: 'var(--spacing-md)',
            border: '2px solid #FFD700'
          }}>
            <h3 style={{
              fontSize: '1rem',
              color: '#000',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '700'
            }}>
              👑 Pouvoirs du Patron
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => alert('🔒 Fermeture/Réouverture du bar en développement')}
                style={{
                  padding: '10px 15px',
                  background: '#000',
                  border: 'none',
                  color: '#FFD700',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              >
                🔒 Fermer le bar
              </button>
              <button
                onClick={() => alert('🎨 Modification du thème en développement')}
                style={{
                  padding: '10px 15px',
                  background: '#000',
                  border: 'none',
                  color: '#FFD700',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              >
                🎨 Modifier le thème
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
