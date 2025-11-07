import React, { useState, useEffect, useRef } from 'react';

export default function BarDetailScreen({ bar, currentUser, setSelectedBar }) {
  const [barTab, setBarTab] = useState('discuss');
  const messagesEndRef = useRef(null);

  // Chat discussion
  const [messages, setMessages] = useState([
    { id: 1, username: 'Sophie', text: 'Coucou les gens! 😊', timestamp: Date.now() - 3600000 },
    { id: 2, username: 'Alexandre', text: 'Salut! Ça va?', timestamp: Date.now() - 1800000 },
    { id: 3, username: 'Emma', text: 'Super ambiance ce soir!', timestamp: Date.now() - 900000 }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Système "Continuer l'histoire"
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

  // Scroll automatique pour le chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envoyer un message dans le chat
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      username: currentUser?.name || 'Vous',
      text: messageInput,
      timestamp: Date.now()
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

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

  const formatChatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <button
            onClick={() => setSelectedBar(null)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            ← Retour
          </button>

          {/* Timer discret en haut à droite */}
          {barTab === 'story' && (
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'white', opacity: 0.9 }}>⏱️ {formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        <h1 style={{
          fontSize: '1.8rem',
          color: 'white',
          margin: '0 0 12px 0',
          fontWeight: '700'
        }}>
          {bar?.emoji} {bar?.name}
        </h1>

        {/* Membres du bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '8px',
          marginTop: '12px'
        }}>
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                background: barTab === 'story' && member.id === members[currentTurnIndex]?.id
                  ? 'rgba(255, 215, 0, 0.25)'
                  : 'rgba(255,255,255,0.15)',
                padding: '10px',
                borderRadius: '10px',
                textAlign: 'center',
                border: barTab === 'story' && member.id === members[currentTurnIndex]?.id ? '2px solid #FFD700' : 'none',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{member.emoji}</div>
              <div style={{ color: 'white', fontWeight: '600', fontSize: '0.75rem' }}>
                {member.name.length > 8 ? member.name.substring(0, 8) + '...' : member.name}
              </div>
              {member.isPatron && <div style={{ fontSize: '0.9rem' }}>👑</div>}
              {barTab === 'story' && member.skippedTurns > 0 && (
                <div style={{ fontSize: '0.8rem', color: '#FFD700' }}>⚠️{member.skippedTurns}</div>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '15px'
        }}>
          <button
            onClick={() => setBarTab('discuss')}
            style={{
              flex: 1,
              padding: '10px',
              background: barTab === 'discuss'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(255,255,255,0.1)',
              border: barTab === 'discuss' ? '2px solid rgba(255,255,255,0.5)' : 'none',
              color: 'white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            💬 Discussion
          </button>
          <button
            onClick={() => setBarTab('story')}
            style={{
              flex: 1,
              padding: '10px',
              background: barTab === 'story'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(255,255,255,0.1)',
              border: barTab === 'story' ? '2px solid rgba(255,255,255,0.5)' : 'none',
              color: 'white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            📖 Continuer l'histoire
          </button>
        </div>
      </div>

      <div style={{ padding: 'var(--spacing-lg)' }}>

        {/* ONGLET DISCUSSION */}
        {barTab === 'discuss' && (
          <div>
            {/* Zone de chat */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '15px',
              minHeight: '400px',
              maxHeight: '500px',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-sm)',
              border: '2px solid var(--color-brown-light)'
            }}>
              {messages.map((msg) => {
                const isOwnMessage = msg.username === (currentUser?.name || 'Vous');
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#888',
                      marginBottom: '4px',
                      paddingLeft: '8px',
                      paddingRight: '8px'
                    }}>
                      {msg.username} • {formatChatTime(msg.timestamp)}
                    </div>
                    <div style={{
                      background: isOwnMessage
                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                        : '#f0f0f0',
                      color: isOwnMessage ? 'white' : '#333',
                      padding: '10px 15px',
                      borderRadius: isOwnMessage ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      maxWidth: '75%',
                      wordWrap: 'break-word',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de chat */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Écris un message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#fff',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: '25px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                Envoyer
              </button>
            </div>

            {/* Pouvoirs du Patron (seulement en discussion) */}
            {isPatron && (
              <div style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '12px',
                padding: 'var(--spacing-md)',
                marginTop: 'var(--spacing-lg)',
                border: '2px solid #FFD700'
              }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  color: '#000',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  👑 Pouvoirs du Patron
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const memberId = prompt('ID du membre à expulser (1-4):');
                      if (memberId) handleExpelMember(parseInt(memberId));
                    }}
                    style={{
                      padding: '8px 14px',
                      background: '#E91E63',
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    👤 Expulser un membre
                  </button>
                  <button
                    onClick={() => alert('🔒 Fermeture/Réouverture du bar en développement')}
                    style={{
                      padding: '8px 14px',
                      background: '#000',
                      border: 'none',
                      color: '#FFD700',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    🔒 Fermer le bar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ONGLET CONTINUER L'HISTOIRE */}
        {barTab === 'story' && (
          <div>
            {/* Indicateur de tour discret */}
            <div style={{
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: 'var(--spacing-md)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}>
              <span>Tour de {currentPlayer?.emoji} {currentPlayer?.name}</span>
            </div>

            {/* L'histoire en cours */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)',
              boxShadow: 'var(--shadow-sm)',
              border: '2px solid var(--color-brown-light)',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {story.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '30px' }}>
                  L'histoire n'a pas encore commencé...
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {story.map((sentence) => (
                    <div
                      key={sentence.id}
                      style={{
                        background: 'var(--color-beige-light)',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        borderLeft: '3px solid var(--color-gold)'
                      }}
                    >
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '4px',
                        fontWeight: '600'
                      }}>
                        {sentence.user}
                      </div>
                      <div style={{
                        fontSize: '0.95rem',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.5'
                      }}>
                        {sentence.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton sauvegarder */}
            {story.length > 0 && (
              <button
                onClick={handleSaveToJournal}
                style={{
                  width: '100%',
                  marginBottom: 'var(--spacing-md)',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                📔 Sauvegarder dans mon journal
              </button>
            )}

            {/* Zone d'écriture (si c'est votre tour) */}
            {isMyTurn && (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '2px solid #FFD700'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-brown-dark)',
                  marginBottom: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  ✍️ À toi de jouer !
                </div>
                <textarea
                  value={newSentence}
                  onChange={(e) => setNewSentence(e.target.value)}
                  placeholder="Ajoute ta phrase à l'histoire... (min. 10 caractères)"
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid var(--color-brown-light)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px'
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {newSentence.length} / 500
                  </span>
                  <button
                    onClick={handleSubmitSentence}
                    disabled={newSentence.trim().length < 10}
                    style={{
                      padding: '10px 20px',
                      background: newSentence.trim().length < 10
                        ? '#ccc'
                        : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '10px',
                      cursor: newSentence.trim().length < 10 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
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
                border: '2px solid #ffc107'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#856404',
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  🔄 Redémarrer l'histoire ?
                </div>
                <p style={{ fontSize: '0.85rem', color: '#856404', marginBottom: '10px' }}>
                  Vous n'êtes plus que {members.length}. Votez pour recommencer.
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={handleVoteRestart}
                    disabled={voteRestart.voted}
                    style={{
                      padding: '8px 16px',
                      background: voteRestart.voted ? '#ccc' : '#ffc107',
                      border: 'none',
                      color: voteRestart.voted ? '#666' : '#000',
                      borderRadius: '8px',
                      cursor: voteRestart.voted ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    {voteRestart.voted ? '✓ Voté' : 'Voter'}
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#856404', fontWeight: '600' }}>
                    {voteRestart.count}/{members.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
