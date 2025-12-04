import React, { useState } from 'react';
import { receivedOfferings } from '../../data/appData';
import { useAdmin } from '../../contexts/AdminContext';
import { getTitleFromPoints } from '../../config/gameConfig';
import UserAvatar from '../avatar/UserAvatar';
import MessageBottleModal from '../bottle/MessageBottleModal';
import { getUnreadCount } from '../../utils/bottleSystem';

export default function HomeScreen({ setScreen, myLetters, joinedSalons, setCurrentProfile, setAdminMode, currentUser }) {
  const { adminLogin } = useAdmin();
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [showBottleModal, setShowBottleModal] = useState(false);
  const unreadBottles = getUnreadCount(currentUser?.email);

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
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{joinedSalons?.length || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>Salons rejoints</div>
            </div>
          </div>
        </div>

        {/* BOUTEILLE À LA MER */}
        <div
          onClick={() => setShowBottleModal(true)}
          style={{
            background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            border: '3px solid #0277BD',
            boxShadow: '0 8px 20px rgba(2,136,209,0.3)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            position: 'relative'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {unreadBottles > 0 && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#E91E63',
              color: 'white',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(233,30,99,0.4)'
            }}>
              {unreadBottles} nouveau{unreadBottles > 1 ? 'x' : ''}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
              📜
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                color: 'white',
                margin: '0 0 8px 0',
                fontSize: '1.5rem',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                Bouteille à la mer
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.95)',
                margin: 0,
                fontSize: '0.95rem',
                lineHeight: '1.4'
              }}>
                Envoie un message anonyme à un utilisateur aléatoire 🌊
              </p>
            </div>
            <div style={{
              fontSize: '2rem',
              color: 'white',
              opacity: 0.8
            }}>
              →
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
                <strong style={{ color: 'var(--color-text-primary)' }}>Salons :</strong>{' '}
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Rejoins des salons thématiques pour discuter et jouer avec d'autres membres.
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-md)',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
            justifyContent: 'center'
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
              position: 'relative',
              maxWidth: '100%',
              boxSizing: 'border-box'
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
              <span style={{ fontSize: '1.5rem' }}>🍸</span> Explorer les Salons
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
                {joinedSalons.length}
              </div>
              <div>Salons</div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Modal Bouteille à la mer */}
      {showBottleModal && (
        <MessageBottleModal
          currentUser={currentUser}
          onClose={() => setShowBottleModal(false)}
        />
      )}
    </div>
  );
}
