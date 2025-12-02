import React, { useState, useEffect } from 'react';
import {
  sendBottle,
  getReceivedBottles,
  getSentBottles,
  markBottleAsRead,
  revealSender,
  respondToBottle,
  checkCooldown,
  getTodayBottleCount,
  BOTTLE_TYPES
} from '../../utils/bottleSystem';

export default function MessageBottleModal({ currentUser, onClose }) {
  const [tab, setTab] = useState('send'); // 'send', 'received', 'sent'
  const [messageType, setMessageType] = useState('thought');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [receivedBottles, setReceivedBottles] = useState([]);
  const [sentBottles, setSentBottles] = useState([]);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [response, setResponse] = useState('');

  const isPremium = currentUser?.isPremium || false;
  const todayCount = getTodayBottleCount(currentUser?.email);
  const cooldownStatus = checkCooldown(currentUser?.email);

  useEffect(() => {
    if (tab === 'received') {
      const bottles = getReceivedBottles(currentUser?.email);
      setReceivedBottles(bottles);
    } else if (tab === 'sent') {
      const bottles = getSentBottles(currentUser?.email);
      setSentBottles(bottles);
    }
  }, [tab, currentUser]);

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Écris un message avant d\'envoyer ta bouteille !');
      return;
    }

    setSending(true);
    const result = sendBottle(currentUser.email, message.trim(), messageType, isPremium);

    if (result.success) {
      alert('📜 Bouteille envoyée ! Un utilisateur aléatoire la recevra...');
      setMessage('');
      setTab('sent'); // Basculer vers les messages envoyés
    } else {
      alert(result.error);
    }
    setSending(false);
  };

  const handleReveal = (bottleId) => {
    revealSender(bottleId);
    setSelectedBottle({ ...selectedBottle, revealed: true });
    alert('✨ Ton identité a été révélée !');
  };

  const handleRespond = (bottleId) => {
    if (!response.trim()) {
      alert('Écris une réponse avant d\'envoyer !');
      return;
    }

    const result = respondToBottle(bottleId, response.trim());
    if (result.success) {
      alert('📨 Réponse envoyée !');
      setResponse('');
      setSelectedBottle(null);
      // Rafraîchir
      const bottles = getReceivedBottles(currentUser?.email);
      setReceivedBottles(bottles);
    }
  };

  const handleOpenBottle = (bottle) => {
    markBottleAsRead(bottle.id);
    setSelectedBottle(bottle);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const getSenderName = (senderId) => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const user = users.find(u => u.email === senderId);
    return user?.pseudo || 'Anonyme';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--color-cream)',
        borderRadius: '20px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '3px solid var(--color-gold)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
          padding: '20px',
          borderBottom: '2px solid var(--color-gold)',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            ×
          </button>
          <h2 style={{
            margin: '0 0 8px 0',
            color: 'white',
            fontSize: '1.8rem',
            textAlign: 'center'
          }}>
            📜 Bouteille à la mer
          </h2>
          <p style={{
            margin: 0,
            color: 'rgba(255,255,255,0.9)',
            fontSize: '0.9rem',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Messages anonymes vers l'inconnu
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--color-brown-light)',
          background: 'var(--color-beige-light)'
        }}>
          {[
            { id: 'send', label: '📝 Envoyer', icon: '📜' },
            { id: 'received', label: '📬 Reçues', count: receivedBottles.filter(b => !b.read).length },
            { id: 'sent', label: '📤 Envoyées' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: '12px',
                background: tab === t.id ? 'var(--color-gold)' : 'transparent',
                border: 'none',
                borderBottom: tab === t.id ? '3px solid var(--color-brown-dark)' : 'none',
                color: tab === t.id ? 'var(--color-brown-dark)' : 'var(--color-text-secondary)',
                fontWeight: tab === t.id ? '700' : '500',
                cursor: 'pointer',
                fontSize: '0.85rem',
                position: 'relative'
              }}
            >
              {t.label}
              {t.count > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: '#E91E63',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          {/* Send Tab */}
          {tab === 'send' && (
            <div>
              {!isPremium && (
                <div style={{
                  background: todayCount >= 3 ? '#FFF3CD' : '#E3F2FD',
                  padding: '12px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  border: `2px solid ${todayCount >= 3 ? '#FFC107' : '#2196F3'}`,
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>
                    📜 {todayCount}/3 bouteilles envoyées aujourd'hui
                  </p>
                  {todayCount >= 3 && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Deviens Premium pour envoyer sans limite !
                    </p>
                  )}
                </div>
              )}

              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: 'var(--color-brown-dark)'
              }}>
                Type de message :
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {Object.entries(BOTTLE_TYPES).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => setMessageType(key)}
                    style={{
                      padding: '12px',
                      background: messageType === key ? 'var(--color-gold)' : 'white',
                      border: messageType === key ? '2px solid var(--color-brown-dark)' : '2px solid var(--color-brown-light)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: messageType === key ? '700' : '500',
                      color: messageType === key ? 'var(--color-brown-dark)' : 'var(--color-text-primary)'
                    }}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>

              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: 'var(--color-brown-dark)'
              }}>
                Ton message :
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={BOTTLE_TYPES[messageType].placeholder}
                maxLength={500}
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-brown-light)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{
                textAlign: 'right',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
                margin: '4px 0 16px 0'
              }}>
                {message.length}/500
              </p>

              <button
                onClick={handleSend}
                disabled={sending || !cooldownStatus.canSend || !message.trim()}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: sending || !cooldownStatus.canSend || !message.trim()
                    ? '#ccc'
                    : 'linear-gradient(135deg, #4FC3F7, #0288D1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: sending || !cooldownStatus.canSend || !message.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                {sending ? '📤 Envoi en cours...' : '📜 Lancer la bouteille !'}
              </button>

              {!cooldownStatus.canSend && (
                <p style={{
                  marginTop: '12px',
                  padding: '10px',
                  background: '#FFF3CD',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  color: 'var(--color-text-primary)'
                }}>
                  ⏳ {cooldownStatus.error}
                </p>
              )}
            </div>
          )}

          {/* Received Tab */}
          {tab === 'received' && (
            <div>
              {receivedBottles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌊</div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                    Aucune bouteille reçue pour le moment...
                  </p>
                </div>
              ) : (
                receivedBottles.map((bottle) => (
                  <div
                    key={bottle.id}
                    onClick={() => handleOpenBottle(bottle)}
                    style={{
                      background: bottle.read ? 'white' : '#FFF9C4',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '12px',
                      border: bottle.read ? '2px solid var(--color-brown-light)' : '2px solid var(--color-gold)',
                      cursor: 'pointer',
                      boxShadow: bottle.read ? 'none' : '0 2px 8px rgba(255,215,0,0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {BOTTLE_TYPES[bottle.type].icon}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {formatDate(bottle.timestamp)}
                      </span>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: '0.95rem',
                      color: 'var(--color-text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {bottle.message}
                    </p>
                    {!bottle.read && (
                      <span style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: '4px 8px',
                        background: 'var(--color-gold)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: 'var(--color-brown-dark)'
                      }}>
                        NOUVEAU
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sent Tab */}
          {tab === 'sent' && (
            <div>
              {sentBottles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📜</div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                    Tu n'as encore envoyé aucune bouteille...
                  </p>
                </div>
              ) : (
                sentBottles.map((bottle) => (
                  <div
                    key={bottle.id}
                    style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '12px',
                      border: '2px solid var(--color-brown-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {BOTTLE_TYPES[bottle.type].icon}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {formatDate(bottle.timestamp)}
                      </span>
                    </div>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '0.95rem',
                      color: 'var(--color-text-primary)'
                    }}>
                      {bottle.message}
                    </p>
                    <div style={{
                      padding: '8px',
                      background: bottle.response ? '#E8F5E9' : '#F5F5F5',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}>
                      {bottle.response ? (
                        <span>✅ Réponse reçue : "{bottle.response}"</span>
                      ) : bottle.read ? (
                        <span>👀 Lu</span>
                      ) : (
                        <span>📬 Non lu</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal détail bouteille */}
        {selectedBottle && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 3000
          }}>
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}>
              <button
                onClick={() => setSelectedBottle(null)}
                style={{
                  float: 'right',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '16px' }}>
                {BOTTLE_TYPES[selectedBottle.type].icon}
              </div>
              <p style={{
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: 'var(--color-text-primary)',
                marginBottom: '16px'
              }}>
                {selectedBottle.message}
              </p>
              <div style={{
                padding: '12px',
                background: 'var(--color-beige-light)',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  De : {selectedBottle.revealed ? getSenderName(selectedBottle.senderId) : '🎭 Anonyme'}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  {formatDate(selectedBottle.timestamp)}
                </p>
              </div>

              {!selectedBottle.response && (
                <>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Écris une réponse..."
                    maxLength={300}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid var(--color-brown-light)',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      marginBottom: '12px'
                    }}
                  />
                  <button
                    onClick={() => handleRespond(selectedBottle.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'var(--color-gold)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'var(--color-brown-dark)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginBottom: '8px'
                    }}
                  >
                    📨 Répondre
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
