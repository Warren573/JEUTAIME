import React, { useState, useEffect } from 'react';
import { enrichedProfiles } from '../../data/appData';
import ChatScreen from './ChatScreen';

export default function LettersScreen({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showGifts, setShowGifts] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [currentUser]);

  const loadConversations = () => {
    // Charger les matchs depuis localStorage
    const matches = JSON.parse(localStorage.getItem('jeutaime_matches') || '{}');
    const userMatches = matches[currentUser?.email] || [];

    // Charger les conversations
    const convos = JSON.parse(localStorage.getItem('jeutaime_conversations') || '{}');

    // Créer une liste de conversations avec infos
    const conversationsList = userMatches.map(match => {
      // Trouver le profil correspondant
      const matchedProfile = enrichedProfiles.find(p => p.id === match.userId) || {
        id: match.userId,
        name: match.userName,
        bio: 'Profil inconnu'
      };

      // Trouver la conversation
      const convKey = getConversationKey(currentUser.email, match.userId);
      const convo = convos[convKey] || { messages: [], letterCount: { user: 0, matched: 0 } };

      const lastMessage = convo.messages[convo.messages.length - 1];

      return {
        matchedUser: matchedProfile,
        lastMessage: lastMessage ? lastMessage.text : 'Commencez la conversation...',
        lastTimestamp: lastMessage ? lastMessage.timestamp : match.date,
        letterCount: convo.letterCount,
        unread: lastMessage && lastMessage.sender === 'matched' && !lastMessage.read
      };
    });

    // Trier par date de dernier message
    conversationsList.sort((a, b) =>
      new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
    );

    setConversations(conversationsList);
  };

  const getConversationKey = (userId, matchedId) => {
    return [userId, matchedId].sort().join('_');
  };

  const getTimeDiff = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}j`;
  };

  const handleOpenConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackFromChat = () => {
    setSelectedConversation(null);
    loadConversations(); // Recharger pour mettre à jour
  };

  if (selectedConversation) {
    return (
      <ChatScreen
        currentUser={currentUser}
        matchedUser={selectedConversation.matchedUser}
        onBack={handleBackFromChat}
      />
    );
  }

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '80px',
      background: 'var(--color-beige-light)'
    }}>
      {/* En-tête style Journal */}
      <div style={{
        background: 'var(--color-cream)',
        borderBottom: '4px double var(--color-brown-dark)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          textAlign: 'center',
          margin: '0 0 var(--spacing-xs) 0',
          color: 'var(--color-brown-dark)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          borderBottom: '2px solid var(--color-gold)',
          paddingBottom: 'var(--spacing-xs)'
        }}>
          💌 Lettres
        </h1>
      </div>

      {/* Message si pas de conversations */}
      <div style={{ padding: '0 var(--spacing-sm)' }}>
        <p style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--color-brown)',
          margin: 0,
          fontStyle: 'italic'
        }}>
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          margin: '0 var(--spacing-lg)',
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          border: '3px solid var(--color-tan)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>💌</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '10px',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-heading)'
          }}>
            Aucune conversation
          </h3>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6'
          }}>
            Envoie des sourires et réussis des matchs<br />
            pour commencer des conversations !
          </p>
        </div>
      ) : (
        <div style={{ padding: '0 var(--spacing-lg)' }}>
          {conversations.map((convo, index) => {
            const isPhotoRevealed = (convo.letterCount.user >= 10 && convo.letterCount.matched >= 10) || currentUser.premium;
            const totalLetters = convo.letterCount.user + convo.letterCount.matched;

            return (
              <div
                key={index}
                style={{
                  background: 'var(--color-cream)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-md)',
                  border: '3px solid var(--color-tan)',
                  boxShadow: 'var(--shadow-lg)',
                  transition: 'all var(--transition-normal)',
                  position: 'relative'
                }}
              >
                {/* En-tête de l'enveloppe */}
                <div
                  onClick={() => handleOpenConversation(convo)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-md)',
                    paddingBottom: 'var(--spacing-md)',
                    borderBottom: '2px dashed var(--color-tan)',
                    marginBottom: 'var(--spacing-md)'
                  }}
                >
                  {/* Icône enveloppe */}
                  <div style={{
                    fontSize: '2.5rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}>
                    ✉️
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Expéditeur */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-brown), var(--color-brown-light))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        border: '2px solid var(--color-tan)',
                        filter: isPhotoRevealed ? 'none' : 'blur(4px)'
                      }}>
                        👤
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        margin: 0,
                        color: 'var(--color-text-primary)',
                        fontWeight: '700'
                      }}>
                        {convo.matchedUser.name || convo.matchedUser.pseudo}
                      </h3>
                    </div>

                    {/* Aperçu du message */}
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-secondary)',
                      margin: '0 0 var(--spacing-xs) 0',
                      fontStyle: 'italic',
                      lineHeight: '1.3'
                    }}>
                      "{convo.lastMessage.length > 60 ? convo.lastMessage.substring(0, 60) + '...' : convo.lastMessage}"
                    </p>

                    {/* Statut */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-light)'
                    }}>
                      <span>💌 {totalLetters} lettres</span>
                      <span>•</span>
                      <span>{convo.unread ? '✨ Non lu' : 'Tu es ghosté'}</span>
                      {!isPhotoRevealed && (
                        <>
                          <span>•</span>
                          <span style={{ color: 'var(--color-gold)', fontWeight: '600' }}>
                            🔒 {20 - totalLetters} pour révéler
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions - Boutons style LETTRES.png */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--spacing-xs)'
                }}>
                  <button
                    onClick={() => handleOpenConversation(convo)}
                    style={{
                      padding: 'var(--spacing-sm)',
                      background: 'linear-gradient(135deg, var(--color-romantic-light), var(--color-romantic))',
                      border: '2px solid var(--color-romantic)',
                      borderRadius: 'var(--border-radius-sm)',
                      color: 'var(--color-cream)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all var(--transition-normal)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Relancer
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Conversation archivée');
                    }}
                    style={{
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-brown-light)',
                      border: '2px solid var(--color-brown)',
                      borderRadius: 'var(--border-radius-sm)',
                      color: 'var(--color-cream)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all var(--transition-normal)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Archiver
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Supprimer cette conversation ?')) {
                        alert('Conversation supprimée');
                      }
                    }}
                    style={{
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-error)',
                      border: '2px solid var(--color-brown-dark)',
                      borderRadius: 'var(--border-radius-sm)',
                      color: 'var(--color-cream)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all var(--transition-normal)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section Offrandes - Thème vintage */}
      <div style={{ padding: '0 var(--spacing-lg)', marginTop: 'var(--spacing-xl)' }}>
        <button
          onClick={() => setShowGifts(!showGifts)}
          className="btn-primary"
          style={{
            width: '100%',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              margin: '0 0 var(--spacing-xs) 0',
              fontWeight: '700',
              fontFamily: 'var(--font-heading)'
            }}>
              ✨ Envoyer de la Magie
            </h3>
            <p style={{
              fontSize: '0.9rem',
              margin: 0,
              lineHeight: '1.3',
              opacity: 0.9
            }}>
              Envoie des cadeaux magiques !
            </p>
          </div>
          <div style={{ fontSize: '1.5rem' }}>
            {showGifts ? '▼' : '▶'}
          </div>
        </button>

        {showGifts && (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-md)',
            border: '3px solid var(--color-tan)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-text-primary)',
              textAlign: 'center'
            }}>
              🎁 Offrandes disponibles
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-sm)'
            }}>
              <div className="card" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--color-beige)',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>🌹</div>
                <h3 style={{ fontSize: '0.95rem', margin: '0 0 var(--spacing-xs) 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Rose</h3>
                <div className="currency" style={{ fontSize: '0.85rem' }}>
                  <span className="currency-icon">J</span> 30
                </div>
              </div>
              <div className="card" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--color-beige)',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>🧪</div>
                <h3 style={{ fontSize: '0.95rem', margin: '0 0 var(--spacing-xs) 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Philtre</h3>
                <div className="currency" style={{ fontSize: '0.85rem' }}>
                  <span className="currency-icon">J</span> 50
                </div>
              </div>
              <div className="card" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--color-beige)',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>💐</div>
                <h3 style={{ fontSize: '0.95rem', margin: '0 0 var(--spacing-xs) 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Bouquet</h3>
                <div className="currency" style={{ fontSize: '0.85rem' }}>
                  <span className="currency-icon">J</span> 75
                </div>
              </div>
              <div className="card" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--color-beige)',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>🍷</div>
                <h3 style={{ fontSize: '0.95rem', margin: '0 0 var(--spacing-xs) 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Verre de vin</h3>
                <div className="currency" style={{ fontSize: '0.85rem' }}>
                  <span className="currency-icon">J</span> 100
                </div>
              </div>
              <div className="card" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                cursor: 'pointer',
                gridColumn: '1 / -1',
                background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
                border: '3px solid var(--color-gold-dark)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>💎</div>
                <h3 style={{ fontSize: '1rem', margin: '0 0 var(--spacing-xs) 0', fontWeight: '700', color: 'var(--color-brown-dark)', fontFamily: 'var(--font-heading)' }}>Diamant Éternel</h3>
                <div className="currency" style={{ fontSize: '1rem', background: 'var(--color-gold-dark)' }}>
                  <span className="currency-icon">J</span> 500
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
