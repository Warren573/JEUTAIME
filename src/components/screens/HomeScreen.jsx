import React, { useState } from 'react';
import { receivedOfferings } from '../../data/appData';
import { useAdmin } from '../../contexts/AdminContext';
import { getTitleFromPoints } from '../../config/gameConfig';
import UserAvatar from '../avatar/UserAvatar';

export default function HomeScreen({ setScreen, myLetters, joinedBars, setCurrentProfile, setAdminMode, currentUser }) {
  const { adminLogin } = useAdmin();

  const handleAdminTest = () => {
    // Auto-login as admin
    adminLogin('admin', 'admin123');
    // Activate admin mode
    setAdminMode(true);
    // Navigate to admin profile
    setCurrentProfile(0);
    setScreen('profiles');
  };

  // Calculer le rang de l'utilisateur
  const getUserRank = () => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const sortedUsers = users
      .filter(u => u.pseudo)
      .sort((a, b) => (b.points || 0) - (a.points || 0));

    const rank = sortedUsers.findIndex(u => u.email === currentUser?.email);
    return rank >= 0 ? rank + 1 : null;
  };

  const userPoints = currentUser?.points || 0;
  const userTitle = getTitleFromPoints(userPoints);
  const userRank = getUserRank();

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

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
          borderBottom: '2px solid var(--color-text-primary)',
          paddingBottom: 'var(--spacing-xs)'
        }}>
          💝 Accueil
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 0
        }}>
          Votre tableau de bord personnel
        </p>
      </div>

      {/* PROFIL UTILISATEUR */}
      <div style={{ padding: '0 var(--spacing-md)' }}>
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '3px solid var(--color-gold)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
            <UserAvatar
              user={currentUser}
              size={80}
              emoji="😊"
            />
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: '1.5rem',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--color-text-primary)',
                fontWeight: '700'
              }}>
                {currentUser?.pseudo || currentUser?.name || 'Utilisateur'}
              </h2>
              <div style={{
                fontSize: '1rem',
                color: 'var(--color-gold-dark)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {userTitle.emoji} {userTitle.title}
              </div>
              {userRank && (
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  {getMedalEmoji(userRank)} Classé #{userRank}
                </div>
              )}
            </div>
          </div>

          {/* Stats utilisateur */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-md)'
          }}>
            <div style={{
              background: 'var(--color-beige-light)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-sm)',
              textAlign: 'center',
              border: '2px solid var(--color-brown-light)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>⭐</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{userPoints}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>Points</div>
            </div>
            <div style={{
              background: 'var(--color-beige-light)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-sm)',
              textAlign: 'center',
              border: '2px solid var(--color-brown-light)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>💌</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{myLetters?.length || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>Conversations</div>
            </div>
            <div style={{
              background: 'var(--color-beige-light)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-sm)',
              textAlign: 'center',
              border: '2px solid var(--color-brown-light)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>🍸</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{joinedBars?.length || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>Bars rejoints</div>
            </div>
          </div>
        </div>

        {/* CADEAUX & OFFRANDES REÇUS */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '3px solid #DAA520',
          boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-md)'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              margin: 0,
              color: '#000',
              fontWeight: '800',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              🎁 Mes Cadeaux Reçus
            </h3>
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '6px 12px',
              borderRadius: '20px',
              color: '#000',
              fontWeight: '700',
              fontSize: '0.9rem'
            }}>
              {receivedOfferings.length} total
            </div>
          </div>

          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(0, 0, 0, 0.7)',
            marginBottom: 'var(--spacing-md)',
            fontWeight: '600'
          }}>
            Les personnes qui t'ont envoyé des offrandes ✨
          </p>

          {/* Grille des offrandes reçues */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 'var(--spacing-sm)',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: 'var(--spacing-xs)',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 'var(--border-radius-md)'
          }}>
            {receivedOfferings.map((offering) => (
              <div
                key={offering.id}
                style={{
                  background: 'white',
                  borderRadius: 'var(--border-radius-md)',
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  border: `3px solid ${offering.color}`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
              >
                {/* Icône de l'offrande */}
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: 'var(--spacing-xs)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>
                  {offering.icon}
                </div>

                {/* Type de cadeau */}
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: offering.color,
                  marginBottom: 'var(--spacing-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {offering.type}
                </div>

                {/* Nom du donneur */}
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {offering.donor}
                </div>

                {/* Date */}
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--color-text-light)',
                  fontStyle: 'italic'
                }}>
                  {offering.date}
                </div>
              </div>
            ))}
          </div>

          {/* Message si aucun cadeau */}
          {receivedOfferings.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-xl)',
              color: 'rgba(0, 0, 0, 0.5)',
              fontStyle: 'italic'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>🎁</div>
              <div>Aucun cadeau reçu pour le moment...</div>
              <div style={{ fontSize: '0.85rem', marginTop: 'var(--spacing-xs)' }}>
                Sois actif pour recevoir des offrandes !
              </div>
            </div>
          )}
        </div>

        {/* COMMENT ÇA MARCHE */}
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '2px solid var(--color-brown)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            margin: '0 0 var(--spacing-md) 0',
            color: 'var(--color-text-primary)',
            fontWeight: '700',
            borderBottom: '2px solid var(--color-gold)',
            paddingBottom: 'var(--spacing-xs)'
          }}>
            💡 Comment ça marche ?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>👤</div>
              <div>
                <strong style={{ color: 'var(--color-text-primary)' }}>Profils :</strong>{' '}
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Découvre des profils, envoie des sourires. Les photos se débloquent après 10 lettres échangées chacune.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>💌</div>
              <div>
                <strong style={{ color: 'var(--color-text-primary)' }}>Lettres :</strong>{' '}
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Échange des messages avec tes matchs. Plus tu écris, plus tu débloqueras leurs photos !
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>🍸</div>
              <div>
                <strong style={{ color: 'var(--color-text-primary)' }}>Bars :</strong>{' '}
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Rejoins des bars thématiques pour discuter et jouer avec d'autres membres.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⭐</div>
              <div>
                <strong style={{ color: 'var(--color-text-primary)' }}>Points :</strong>{' '}
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Gagne des points en étant actif : sourires, matches, jeux, lettres. Monte dans le classement !
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ACCÈS RAPIDE */}
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '2px solid var(--color-brown-light)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            margin: '0 0 var(--spacing-md) 0',
            color: 'var(--color-text-primary)',
            fontWeight: '700',
            borderBottom: '2px solid var(--color-gold)',
            paddingBottom: 'var(--spacing-xs)',
            textAlign: 'center'
          }}>
            🎯 Accès Rapide
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-sm)'
          }}>
            <button
              onClick={() => setScreen('profiles')}
              className="btn-primary"
              style={{
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '2rem' }}>👥</span>
              <span>Découvrir des profils</span>
            </button>

            <button
              onClick={() => setScreen('letters')}
              className="btn-romantic"
              style={{
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '2rem' }}>💌</span>
              <span>Mes Lettres ({myLetters.length})</span>
            </button>

            <button
              onClick={() => setScreen('social')}
              className="btn-friendly"
              style={{
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '2rem' }}>🍸</span>
              <span>Explorer les Bars</span>
            </button>

            <button
              onClick={() => setScreen('memories')}
              style={{
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #8B7355, #A0826D)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                fontWeight: '600',
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
              <span style={{ fontSize: '2rem' }}>📦</span>
              <span>Boîte à souvenirs</span>
            </button>

            <button
              onClick={() => setScreen('photobook')}
              style={{
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #FF6B9D, #C06C84)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                fontWeight: '600',
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
              <span style={{ fontSize: '2rem' }}>📸</span>
              <span>Book Photos</span>
            </button>

            <button
              onClick={() => setScreen('collaborations')}
              style={{
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #9C27B0, #6A1B9A)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                fontWeight: '600',
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
              <span style={{ fontSize: '2rem' }}>🤝</span>
              <span>Collaborations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
