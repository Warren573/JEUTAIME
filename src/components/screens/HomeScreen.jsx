import React, { useState } from 'react';
import { receivedOfferings } from '../../data/appData';
import { useAdmin } from '../../contexts/AdminContext';
import { getTitleFromPoints } from '../../config/gameConfig';

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
      {/* En-tête JeuTaime */}
      <div style={{
        textAlign: 'center',
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        background: 'linear-gradient(180deg, var(--color-cream) 0%, var(--color-beige-light) 100%)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          color: 'var(--color-romantic)',
          marginBottom: 'var(--spacing-sm)',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          JeuT'aime
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--color-text-secondary)',
          fontWeight: '500'
        }}>
          Fais plaisir avec une offrande
        </p>
      </div>

      {/* Grille des offrandes - Style DESIGN.png */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--spacing-md)',
        padding: '0 var(--spacing-lg) var(--spacing-lg)'
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

      {/* Accès rapide */}
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
  );
}
