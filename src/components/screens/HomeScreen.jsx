import React, { useState } from 'react';
import { receivedOfferings } from '../../data/appData';
import { useAdmin } from '../../contexts/AdminContext';
import { getTitleFromPoints } from '../../config/gameConfig';
import UserAvatar from '../avatar/UserAvatar';

export default function HomeScreen({ setScreen, myLetters, joinedBars, setCurrentProfile, setAdminMode, currentUser }) {
  const { adminLogin } = useAdmin();
  const [selectedOffering, setSelectedOffering] = useState(null);

  const handleAdminTest = () => {
    // Auto-login as admin
    adminLogin('admin', 'admin123');
    // Activate admin mode
    setAdminMode(true);
    // Navigate to admin profile
    setCurrentProfile(0);
    setScreen('profiles');
  };

  // Définition des offrandes disponibles selon DESIGN.png
  const offerings = [
    {
      id: 'letter',
      icon: '✉️',
      secondIcon: '🌹',
      name: 'Lettre parfumée',
      description: 'Rose virtuelle',
      price: 3500,
      color: 'var(--color-romantic)'
    },
    {
      id: 'rose',
      icon: '🌹',
      name: 'Rose virtuelle',
      description: '',
      price: 6000,
      color: 'var(--color-romantic-light)'
    },
    {
      id: 'music',
      icon: '🎵',
      name: 'Musique dédiée',
      description: '',
      price: 7500,
      color: 'var(--color-gold)'
    },
    {
      id: 'gift',
      icon: '🎁',
      name: 'Petit cadeau mignon',
      description: '',
      price: 5000,
      color: 'var(--color-humorous)'
    },
    {
      id: 'magic1',
      icon: '🎩',
      name: 'Magie romantique',
      description: '',
      price: 20000,
      color: 'var(--color-friendly)'
    },
    {
      id: 'magic2',
      icon: '🪄',
      name: 'Magie romantique',
      description: '',
      price: 2000,
      color: 'var(--color-brown-light)'
    }
  ];

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
      minHeight: '100vh',
      paddingBottom: '100px',
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
          💝 Accueil
        </h1>
      </div>

      <div style={{ padding: '0 var(--spacing-lg)' }}>
        {/* PROFIL UTILISATEUR */}
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

        {/* BUREAU D'OFFRANDES */}
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
            🎁 Bureau d'Offrandes
          </h3>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-md)',
            fontStyle: 'italic'
          }}>
            Envoie des cadeaux virtuels pour faire plaisir à tes matchs !
          </p>

          {/* Grille des offrandes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacing-md)'
          }}>
        {offerings.map((offering) => (
          <div
            key={offering.id}
            onClick={() => setSelectedOffering(offering)}
            className="card"
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              padding: 'var(--spacing-lg)',
              background: 'var(--color-cream)',
              border: '3px solid var(--color-tan)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-normal)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            {/* Icône principale */}
            <div style={{
              fontSize: '4rem',
              marginBottom: 'var(--spacing-sm)',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}>
              {offering.icon}
              {offering.secondIcon && (
                <span style={{ marginLeft: '-10px' }}>{offering.secondIcon}</span>
              )}
            </div>

            {/* Nom de l'offrande */}
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '600',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {offering.name}
            </h3>

            {offering.description && (
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-light)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                {offering.description}
              </p>
            )}

            {/* Prix avec icône de monnaie */}
            <div className="currency" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: 'var(--color-gold)',
              color: 'var(--color-brown-dark)',
              borderRadius: 'var(--border-radius-xl)',
              fontWeight: '700',
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="currency-icon" style={{
                width: '22px',
                height: '22px',
                background: 'var(--color-gold-dark)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-cream)',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                J
              </span>
              {offering.price} à Julien
            </div>
          </div>
        ))}
          </div>
        </div>

      {/* Accès rapide - Action rapides vers fonctionnalités */}
      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: '0 var(--spacing-lg)'
      }}>
        <div className="card" style={{
          padding: 'var(--spacing-lg)',
          background: 'var(--color-cream)',
          border: '2px solid var(--color-brown-light)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
            textAlign: 'center'
          }}>
            🎯 Accès rapide
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)'
          }}>
            <button
              onClick={() => setScreen('profiles')}
              className="btn-primary"
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>👥</span> Découvrir des profils
            </button>

            <button
              onClick={() => setScreen('social')}
              className="btn-friendly"
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🍸</span> Explorer les Bars
            </button>

            <button
              onClick={() => setScreen('letters')}
              className="btn-romantic"
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>💌</span> Mes Lettres ({myLetters.length})
            </button>

            <button
              onClick={handleAdminTest}
              className="btn-secondary"
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                border: '3px solid var(--color-gold)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🛡️</span> Essai Profil Admin
            </button>
          </div>
        </div>
      </div>

      {/* Stats de l'utilisateur */}
      <div style={{
        marginTop: 'var(--spacing-lg)',
        padding: '0 var(--spacing-lg)'
      }}>
        <div className="card" style={{
          padding: 'var(--spacing-lg)',
          background: 'var(--color-beige)',
          border: '2px solid var(--color-tan)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
            textAlign: 'center'
          }}>
            📊 Mes Statistiques
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)',
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.5rem', color: 'var(--color-gold)' }}>
                {userPoints}
              </div>
              <div>Points</div>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.5rem', color: 'var(--color-gold)' }}>
                {userRank || '—'}
              </div>
              <div>Classement</div>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.5rem', color: 'var(--color-romantic)' }}>
                {myLetters.length}
              </div>
              <div>Lettres</div>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.5rem', color: 'var(--color-friendly)' }}>
                {joinedBars.length}
              </div>
              <div>Bars</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
