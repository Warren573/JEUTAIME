import React from 'react';
import { journalNews } from '../../data/appData';

export default function JournalScreen({ currentUser }) {
  // Données simulées pour les différentes sections
  const activities = [
    { text: 'Dix nouveaux contenus ajoutés', icon: '📝' },
    { text: 'Cinq couples formés', icon: '💑' },
    { text: 'Nouveau salon "Aventuriers" ouvert', icon: '🍸' }
  ];

  const tournament = [
    { name: 'Les inscriptions continuent', status: '⏰' }
  ];

  const goodVibes = [
    { from: 'Marie', to: 'Pierre', text: 'Merci pour tes jolies phrases', icon: '💬' },
    { from: 'Julien', to: 'Emma', text: 'Tu es géniale', icon: '❤️' }
  ];

  const giftsOfDay = [
    { who: 'Émilie', what: 'reçoit 5 good vibes récemment', icon: '🎁' },
    { who: 'Marie', what: 'reçoit 3 good vibes', icon: '🎁' }
  ];

  const topProfiles = [
    { name: 'Sophie', points: '1,850 pts', rank: '1', icon: '👩' },
    { name: 'Marc', points: '1,720 pts', rank: '2', icon: '👨' },
    { name: 'Julie', points: '1,580 pts', rank: '3', icon: '👩' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      maxHeight: '100vh',
      overflowY: 'auto',
      paddingBottom: '80px',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* En-tête Journal - Style gazette */}
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
          color: 'var(--color-text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          borderBottom: '2px solid var(--color-text-primary)',
          paddingBottom: 'var(--spacing-sm)'
        }}>
          JOURNAL
        </h1>
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          margin: 0,
          fontStyle: 'italic'
        }}>
          Actualités de la communauté
        </p>
      </div>

      {/* Grille de sections style journal */}
      <div style={{ padding: '0 var(--spacing-sm)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--spacing-md)'
        }}>
          {/* Section Dernières Actions */}
          <div className="card" style={{
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown)',
            padding: 'var(--spacing-md)'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)',
              borderBottom: '2px solid var(--color-text-primary)',
              paddingBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase'
            }}>
              Dernières Actions
            </h2>
            {activities.map((activity, idx) => (
              <div key={idx} style={{
                padding: 'var(--spacing-sm) 0',
                borderBottom: idx < activities.length - 1 ? '1px dashed var(--color-tan)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{activity.icon}</span>
                <span style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.4'
                }}>
                  {activity.text}
                </span>
              </div>
            ))}
          </div>

          {/* Section Tournoi + Good vibes côte à côte */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)'
          }}>
            {/* Tournoi de Scrabble */}
            <div className="card" style={{
              background: 'var(--color-beige)',
              border: '2px solid var(--color-brown-light)',
              padding: 'var(--spacing-md)'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)',
                borderBottom: '1px solid var(--color-text-primary)',
                paddingBottom: 'var(--spacing-xs)',
                textTransform: 'uppercase',
                fontSize: '0.9rem'
              }}>
                Tournoi de Scrabble
              </h3>
              {tournament.map((item, idx) => (
                <div key={idx} style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.4'
                }}>
                  {item.status} {item.name}
                </div>
              ))}
            </div>

            {/* Good vibes */}
            <div className="card" style={{
              background: 'var(--color-beige)',
              border: '2px solid var(--color-brown-light)',
              padding: 'var(--spacing-md)'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-sm)',
                borderBottom: '1px solid var(--color-text-primary)',
                paddingBottom: 'var(--spacing-xs)',
                textTransform: 'uppercase',
                fontSize: '0.9rem'
              }}>
                {' '} Good vibes
              </h3>
              {goodVibes.slice(0, 2).map((comp, idx) => (
                <div key={idx} style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                  lineHeight: '1.3'
                }}>
                  {comp.icon} <strong>{comp.from}</strong> à <strong>{comp.to}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Section Les Cadeaux du Jour */}
          <div className="card" style={{
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown)',
            padding: 'var(--spacing-md)'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)',
              borderBottom: '2px solid var(--color-text-primary)',
              paddingBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase'
            }}>
              Les Cadeaux du Jour
            </h2>
            {giftsOfDay.map((gift, idx) => (
              <div key={idx} style={{
                padding: 'var(--spacing-sm) 0',
                borderBottom: idx < giftsOfDay.length - 1 ? '1px dashed var(--color-tan)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{gift.icon}</span>
                <span style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  <strong>{gift.who}</strong> {gift.what}
                </span>
              </div>
            ))}
          </div>

          {/* Section Top Profils */}
          <div className="card" style={{
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown)',
            padding: 'var(--spacing-md)'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)',
              borderBottom: '2px solid var(--color-text-primary)',
              paddingBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase'
            }}>
              Top Profils
            </h2>
            {topProfiles.map((profile, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                background: idx === 0 ? 'var(--color-gold-light)' : 'var(--color-beige)',
                borderRadius: 'var(--border-radius-sm)',
                marginBottom: 'var(--spacing-xs)',
                border: '1px solid var(--color-tan)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-brown)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  {profile.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)'
                  }}>
                    {profile.rank}. {profile.name}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-light)'
                  }}>
                    {profile.points}
                  </div>
                </div>
                {idx < 3 && (
                  <div style={{ fontSize: '1.5rem' }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actualités de journalNews */}
          <div className="card" style={{
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown)',
            padding: 'var(--spacing-md)'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)',
              borderBottom: '2px solid var(--color-text-primary)',
              paddingBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase'
            }}>
              📰 Fil d'actualités
            </h2>
            {journalNews.map((news) => (
              <div
                key={news.id}
                style={{
                  padding: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-sm)',
                  background: 'var(--color-beige)',
                  borderLeft: '4px solid var(--color-romantic)',
                  borderRadius: 'var(--border-radius-sm)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ fontSize: '1.75rem' }}>{news.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1rem',
                      margin: '0 0 var(--spacing-xs) 0',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {news.title}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-secondary)',
                      margin: '0 0 var(--spacing-xs) 0',
                      lineHeight: '1.4'
                    }}>
                      {news.desc}
                    </p>
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}>
                      <span>{news.time}</span>
                      <span>•</span>
                      <span>❤️ {news.reactions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
