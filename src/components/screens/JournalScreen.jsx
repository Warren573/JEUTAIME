import React, { useState, useEffect } from 'react';
import ScreenHeader from '../common/ScreenHeader';

export default function JournalScreen({ currentUser, setScreen }) {
  const [activeTab, setActiveTab] = useState('perso');

  // Récupérer les événements personnels depuis localStorage
  const getPersonalEvents = () => {
    const events = JSON.parse(localStorage.getItem(`jeutaime_events_${currentUser?.email}`) || '[]');
    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);
  };

  // Récupérer les événements globaux depuis localStorage
  const getGlobalEvents = () => {
    const events = JSON.parse(localStorage.getItem('jeutaime_global_events') || '[]');
    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);
  };

  const [personalEvents, setPersonalEvents] = useState(getPersonalEvents());
  const [globalEvents, setGlobalEvents] = useState(getGlobalEvents());

  // Rafraîchir les événements toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setPersonalEvents(getPersonalEvents());
      setGlobalEvents(getGlobalEvents());
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Fonction pour formater l'heure relative
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now - eventTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return eventTime.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Fonction pour obtenir l'icône selon le type d'événement
  const getEventIcon = (type) => {
    const icons = {
      // Événements personnels
      'points': '⭐',
      'smile': '😊',
      'message': '💌',
      'game': '🎮',
      'badge': '🏆',
      'salon': '🍸',
      'letter': '✉️',
      'login': '👋',
      'profile': '👤',
      'match': '💕',
      'photo': '📸',

      // Événements globaux
      'couple': '💑',
      'new_member': '🎉',
      'record': '🔥',
      'achievement': '🌟',
      'event': '🎊'
    };
    return icons[type] || '📰';
  };

  // Fonction pour obtenir la couleur de la bordure selon le type
  const getEventColor = (type) => {
    const colors = {
      'points': '#FFD700',
      'smile': '#FF69B4',
      'message': '#E91E63',
      'game': '#9C27B0',
      'badge': '#FF9800',
      'salon': '#667eea',
      'letter': '#E91E63',
      'login': '#4CAF50',
      'profile': '#2196F3',
      'match': '#E91E63',
      'photo': '#00BCD4',
      'couple': '#E91E63',
      'new_member': '#4CAF50',
      'record': '#FF5722',
      'achievement': '#FFD700',
      'event': '#9C27B0'
    };
    return colors[type] || 'var(--color-brown)';
  };

  return (
    <div style={{
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ScreenHeader
        icon="📰"
        title="JOURNAL"
        subtitle="Ton activité et celle de la communauté"
        onBack={() => setScreen('home')}
      />

      <div style={{ padding: '0 var(--spacing-sm)' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-lg)',
          background: 'var(--color-cream)',
          padding: 'var(--spacing-xs)',
          borderRadius: 'var(--border-radius-lg)',
          border: '2px solid var(--color-brown-light)'
        }}>
          <button
            onClick={() => setActiveTab('perso')}
            style={{
              flex: 1,
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: activeTab === 'perso'
                ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                : 'transparent',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              color: activeTab === 'perso' ? 'var(--color-brown-dark)' : 'var(--color-text-secondary)',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'perso' ? 'var(--shadow-md)' : 'none'
            }}
          >
            👤 Mon Journal
          </button>
          <button
            onClick={() => setActiveTab('global')}
            style={{
              flex: 1,
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: activeTab === 'global'
                ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                : 'transparent',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              color: activeTab === 'global' ? 'var(--color-brown-dark)' : 'var(--color-text-secondary)',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'global' ? 'var(--shadow-md)' : 'none'
            }}
          >
            🌍 Communauté
          </button>
        </div>

        {/* Journal Perso */}
        {activeTab === 'perso' && (
          <div>
            {personalEvents.length === 0 ? (
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                border: '2px solid var(--color-brown-light)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📝</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  Ton journal est vide
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.5'
                }}>
                  Commence à explorer JeuTaime ! Chaque action que tu fais sera enregistrée ici :
                  sourires envoyés, points gagnés, jeux joués, badges débloqués...
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)'
              }}>
                {personalEvents.map((event, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--color-cream)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: 'var(--spacing-md)',
                      borderLeft: `4px solid ${getEventColor(event.type)}`,
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-md)',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        flexShrink: 0
                      }}>
                        {getEventIcon(event.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '0.95rem',
                          color: 'var(--color-text-primary)',
                          margin: '0 0 var(--spacing-xs) 0',
                          lineHeight: '1.4',
                          fontWeight: '500'
                        }}>
                          {event.message}
                        </p>
                        <div style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text-light)'
                        }}>
                          {getRelativeTime(event.timestamp)}
                        </div>
                      </div>
                      {event.points && (
                        <div style={{
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          color: '#000',
                          padding: '4px 10px',
                          borderRadius: 'var(--border-radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          whiteSpace: 'nowrap'
                        }}>
                          +{event.points} pts
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Journal Global */}
        {activeTab === 'global' && (
          <div>
            {globalEvents.length === 0 ? (
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                border: '2px solid var(--color-brown-light)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🌍</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  Aucune actualité pour le moment
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.5'
                }}>
                  Les événements de la communauté apparaîtront ici : nouveaux couples,
                  records battus, membres populaires...
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)'
              }}>
                {globalEvents.map((event, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--color-cream)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: 'var(--spacing-md)',
                      borderLeft: `4px solid ${getEventColor(event.type)}`,
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-md)',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        flexShrink: 0
                      }}>
                        {getEventIcon(event.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '0.95rem',
                          color: 'var(--color-text-primary)',
                          margin: '0 0 var(--spacing-xs) 0',
                          lineHeight: '1.4',
                          fontWeight: '500'
                        }}>
                          {event.message}
                        </p>
                        <div style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text-light)'
                        }}>
                          {getRelativeTime(event.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
