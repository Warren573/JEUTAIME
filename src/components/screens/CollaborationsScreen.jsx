import React, { useState, useEffect } from 'react';
import {
  getActiveCollaborations,
  getCollaborationSuggestions,
  createCollaboration,
  joinCollaboration,
  getCollaborationMessages,
  addCollaborationMessage,
  getTimeRemaining
} from '../../utils/collaborationSystem';
import { bars } from '../../data/appData';

export default function CollaborationsScreen({ currentUser, setScreen }) {
  const [activeCollaborations, setActiveCollaborations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [tab, setTab] = useState('active'); // 'active', 'suggestions'

  useEffect(() => {
    loadCollaborations();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadCollaborations, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCollab) {
      const msgs = getCollaborationMessages(selectedCollab.id);
      setMessages(msgs);
    }
  }, [selectedCollab]);

  const loadCollaborations = () => {
    const actives = getActiveCollaborations();
    setActiveCollaborations(actives);

    const suggest = getCollaborationSuggestions(bars);
    setSuggestions(suggest.slice(0, 5)); // Limiter à 5 suggestions
  };

  const handleCreateCollaboration = (bar1, bar2, event) => {
    const result = createCollaboration(bar1, bar2, event);
    if (result.success) {
      loadCollaborations();
      setTab('active');
    } else {
      alert(result.message);
    }
  };

  const handleJoinCollaboration = (collabId) => {
    const result = joinCollaboration(collabId, currentUser?.email || 'user');
    if (result.success) {
      loadCollaborations();
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedCollab) return;

    const result = addCollaborationMessage(selectedCollab.id, {
      userId: currentUser?.email || 'user',
      userName: currentUser?.name || 'Toi',
      barId: 1, // À adapter selon le bar d'origine
      text: messageInput
    });

    if (result.success) {
      setMessages([...messages, result.message]);
      setMessageInput('');
    }
  };

  if (selectedCollab) {
    return (
      <div style={{
        height: '100vh',
        background: selectedCollab.specialEvent?.bgGradient || 'var(--color-beige)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: 'var(--spacing-md)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
        }}>
          <button
            onClick={() => setSelectedCollab(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: 'var(--spacing-xs)'
            }}
          >
            ← Retour
          </button>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>
              {selectedCollab.bar1Icon} × {selectedCollab.bar2Icon}
            </div>
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              margin: '0 0 var(--spacing-xs) 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {selectedCollab.bar1Name} × {selectedCollab.bar2Name}
            </h2>
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>
              {selectedCollab.specialEvent.emoji} {selectedCollab.specialEvent.name}
            </div>
            <div style={{
              fontSize: '0.85rem',
              marginBottom: 'var(--spacing-xs)',
              opacity: 0.9
            }}>
              {selectedCollab.specialEvent.description}
            </div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              ⏰ {getTimeRemaining(selectedCollab.endTime)}
            </div>
          </div>
        </div>

        {/* Bonus info */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.2)',
          padding: 'var(--spacing-sm)',
          margin: 'var(--spacing-sm)',
          borderRadius: 'var(--border-radius-md)',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          textAlign: 'center',
          color: 'white',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          🎁 Bonus: {selectedCollab.specialEvent.bonus}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          padding: '0 var(--spacing-sm)',
          marginBottom: 'var(--spacing-sm)'
        }}>
          <div style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.2)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius-md)',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {selectedCollab.participants.length}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Participants</div>
          </div>
          <div style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.2)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius-md)',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {selectedCollab.rewards.totalPoints}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Points</div>
          </div>
        </div>

        {/* Chat */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          margin: '0 var(--spacing-sm)',
          borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: 'var(--spacing-sm)',
            borderBottom: '2px solid var(--color-brown-light)',
            background: 'var(--color-cream)',
            fontWeight: 'bold',
            color: 'var(--color-text-primary)'
          }}>
            💬 Chat collaboratif
          </div>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xs)'
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                padding: 'var(--spacing-lg)',
                fontSize: '0.9rem'
              }}>
                Aucun message pour l'instant.<br />
                Sois le premier à lancer la discussion! 🎉
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    background: 'var(--color-beige-light)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--color-brown-light)'
                  }}
                >
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: '600',
                    marginBottom: '2px'
                  }}>
                    {msg.userName}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{
            padding: 'var(--spacing-sm)',
            borderTop: '2px solid var(--color-brown-light)',
            background: 'var(--color-cream)',
            display: 'flex',
            gap: 'var(--spacing-xs)'
          }}>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Écris un message..."
              style={{
                flex: 1,
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius-md)',
                border: '2px solid var(--color-brown-light)',
                fontSize: '0.9rem',
                background: 'white'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: '0 var(--spacing-md)',
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              📤
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      background: 'var(--color-beige)',
      overflow: 'auto',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: 'var(--spacing-lg)',
        color: 'white',
        textAlign: 'center'
      }}>
        <button
          onClick={() => setScreen('bars')}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: 'var(--spacing-sm)',
            display: 'block'
          }}
        >
          ← Retour aux bars
        </button>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem',
          margin: '0 0 var(--spacing-xs) 0'
        }}>
          🤝 Collaborations Éphémères
        </h1>
        <p style={{
          fontSize: '0.9rem',
          margin: 0,
          opacity: 0.9
        }}>
          Des bars s'associent pour des événements uniques!
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-md)',
        background: 'var(--color-cream)',
        borderBottom: '2px solid var(--color-brown-light)'
      }}>
        <button
          onClick={() => setTab('active')}
          style={{
            flex: 1,
            padding: 'var(--spacing-sm)',
            background: tab === 'active' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'var(--color-beige-light)',
            border: '2px solid var(--color-brown-light)',
            borderRadius: 'var(--border-radius-md)',
            color: tab === 'active' ? 'white' : 'var(--color-text-primary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🔥 Actives ({activeCollaborations.length})
        </button>
        <button
          onClick={() => setTab('suggestions')}
          style={{
            flex: 1,
            padding: 'var(--spacing-sm)',
            background: tab === 'suggestions' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'var(--color-beige-light)',
            border: '2px solid var(--color-brown-light)',
            borderRadius: 'var(--border-radius-md)',
            color: tab === 'suggestions' ? 'white' : 'var(--color-text-primary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          💡 Suggestions
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        {tab === 'active' ? (
          <>
            {activeCollaborations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-xl)',
                color: 'var(--color-text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
                  🤷
                </div>
                <p style={{ fontSize: '1rem', fontWeight: '600' }}>
                  Aucune collaboration active pour le moment
                </p>
                <p style={{ fontSize: '0.85rem', margin: 'var(--spacing-sm) 0' }}>
                  Consulte les suggestions pour en créer une !
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)'
              }}>
                {activeCollaborations.map((collab) => (
                  <div
                    key={collab.id}
                    onClick={() => setSelectedCollab(collab)}
                    style={{
                      background: collab.specialEvent.bgGradient,
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--border-radius-lg)',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      color: 'white',
                      boxShadow: 'var(--shadow-lg)',
                      transition: 'transform 0.2s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-sm)',
                      fontSize: '2rem'
                    }}>
                      {collab.bar1Icon} × {collab.bar2Icon}
                    </div>
                    <h3 style={{
                      margin: '0 0 var(--spacing-xs) 0',
                      textAlign: 'center',
                      fontSize: '1.1rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {collab.bar1Name} × {collab.bar2Name}
                    </h3>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      marginBottom: 'var(--spacing-xs)',
                      fontWeight: 'bold'
                    }}>
                      {collab.specialEvent.emoji} {collab.specialEvent.name}
                    </div>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      marginBottom: 'var(--spacing-sm)',
                      opacity: 0.9
                    }}>
                      {collab.specialEvent.description}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      padding: 'var(--spacing-sm)',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 'var(--border-radius-md)',
                      fontSize: '0.8rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{collab.participants.length}</div>
                        <div style={{ opacity: 0.8 }}>Participants</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>⏰ {getTimeRemaining(collab.endTime)}</div>
                        <div style={{ opacity: 0.8 }}>Restant</div>
                      </div>
                    </div>
                    {!collab.participants.includes(currentUser?.email || 'user') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinCollaboration(collab.id);
                        }}
                        style={{
                          width: '100%',
                          marginTop: 'var(--spacing-sm)',
                          padding: 'var(--spacing-sm)',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '2px solid white',
                          borderRadius: 'var(--border-radius-md)',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        🎯 Rejoindre
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{
              background: 'var(--color-cream)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-lg)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-brown-light)'
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                textAlign: 'center'
              }}>
                💡 Clique sur une suggestion pour créer une nouvelle collaboration!<br />
                <small>Durée: 48 heures • Événement unique • Récompenses exclusives</small>
              </p>
            </div>
            {suggestions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-xl)',
                color: 'var(--color-text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
                  ⌛
                </div>
                <p style={{ fontSize: '0.9rem' }}>
                  Tous les bars sont déjà en collaboration!<br />
                  Reviens plus tard.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleCreateCollaboration(suggestion.bar1, suggestion.bar2, suggestion.suggestedEvent)}
                    style={{
                      background: suggestion.suggestedEvent.bgGradient,
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--border-radius-lg)',
                      border: '3px dashed rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      color: 'white',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-sm)',
                      fontSize: '2rem'
                    }}>
                      {suggestion.bar1.icon} + {suggestion.bar2.icon}
                    </div>
                    <h3 style={{
                      margin: '0 0 var(--spacing-xs) 0',
                      textAlign: 'center',
                      fontSize: '1rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {suggestion.bar1.name} × {suggestion.bar2.name}
                    </h3>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '1.1rem',
                      marginBottom: 'var(--spacing-xs)',
                      fontWeight: 'bold'
                    }}>
                      {suggestion.suggestedEvent.emoji} {suggestion.suggestedEvent.name}
                    </div>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      marginBottom: 'var(--spacing-xs)',
                      opacity: 0.9
                    }}>
                      {suggestion.suggestedEvent.description}
                    </div>
                    <div style={{
                      background: 'rgba(255, 215, 0, 0.3)',
                      padding: 'var(--spacing-xs)',
                      borderRadius: 'var(--border-radius-md)',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginTop: 'var(--spacing-sm)'
                    }}>
                      🎁 {suggestion.suggestedEvent.bonus}
                    </div>
                    <div style={{
                      textAlign: 'center',
                      marginTop: 'var(--spacing-sm)',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      opacity: 0.9
                    }}>
                      👆 Tap pour créer
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
