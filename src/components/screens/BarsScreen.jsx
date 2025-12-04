import React from 'react';

export default function BarsScreen({ setScreen, setGameScreen, setSelectedSalon, currentUser }) {
  const salons = [
    {
      id: 'romantic',
      name: 'Salon Romantique',
      emoji: '🌹',
      description: 'Écrivez ensemble des histoires d\'amour touchantes',
      currentMembers: 2,
      maxMembers: 4,
      gradient: 'linear-gradient(135deg, #FF6B9D, #C2185B)',
      textColor: 'white',
      action: () => setSelectedSalon({ type: 'romantic', name: 'Salon Romantique', emoji: '🌹' })
    },
    {
      id: 'humorous',
      name: 'Salon Humoristique',
      emoji: '😄',
      description: 'Créez des histoires drôles et absurdes à plusieurs',
      currentMembers: 3,
      maxMembers: 4,
      gradient: 'linear-gradient(135deg, #FFD54F, #FFA000)',
      textColor: '#1a1a1a',
      action: () => setSelectedSalon({ type: 'humorous', name: 'Salon Humoristique', emoji: '😄' })
    },
    {
      id: 'adventure',
      name: 'Salon Aventure',
      emoji: '🗺️',
      description: 'Partez en quête d\'aventures épiques ensemble',
      currentMembers: 1,
      maxMembers: 4,
      gradient: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
      textColor: 'white',
      action: () => setSelectedSalon({ type: 'adventure', name: 'Salon Aventure', emoji: '🗺️' })
    },
    {
      id: 'mystery',
      name: 'Salon Mystère',
      emoji: '🔮',
      description: 'Tissez des récits mystérieux et envoûtants',
      currentMembers: 4,
      maxMembers: 4,
      gradient: 'linear-gradient(135deg, #7B1FA2, #4A148C)',
      textColor: '#FFD700',
      border: '2px solid rgba(255, 215, 0, 0.3)',
      action: () => setSelectedSalon({ type: 'mystery', name: 'Salon Mystère', emoji: '🔮' })
    },
    {
      id: 'weekly',
      name: 'Salon Hebdomadaire',
      emoji: '📅',
      description: 'Groupe exclusif renouvelé chaque semaine',
      badge: 'NOUVEAU',
      currentMembers: 0,
      maxMembers: 4,
      gradient: 'linear-gradient(135deg, #5C6BC0, #3949AB)',
      textColor: 'white',
      action: () => setSelectedSalon({ type: 'weekly', name: 'Salon Hebdomadaire', emoji: '📅' })
    }
  ];

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '100px',
      background: 'var(--color-beige-light)'
    }}>
      {/* En-tête */}
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
          🍸 Les Salons
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 'var(--spacing-sm) 0 0 0'
        }}>
          Écrivez des histoires ensemble • Une phrase chacun • Timer 24h
        </p>
      </div>

      {/* Bouton créer son salon (Premium) */}
      <div style={{
        padding: '0 var(--spacing-sm)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {currentUser?.isPremium && (
          <div
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
              border: '2px solid #FFD700',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              width: '100%',
              boxSizing: 'border-box'
            }}
            onClick={() => alert('🎨 Interface de création de salon en développement !')}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>🎨</span>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: '#000',
                  margin: '0 0 5px 0',
                  fontSize: '1.3rem',
                  fontWeight: '700'
                }}>
                  👑 Créer mon salon Premium
                </h3>
                <p style={{
                  color: 'rgba(0,0,0,0.7)',
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  Personnalisez votre espace avec nom, thème et couleurs
                </p>
              </div>
              <span style={{ fontSize: '1.5rem', color: '#000' }}>→</span>
            </div>
          </div>
        )}

        {salons.map((salon) => (
          <div
            key={salon.id}
            style={{
              background: salon.gradient,
              border: salon.border || 'none',
              borderRadius: '0',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-xs)',
              boxShadow: 'none',
              width: '100%',
              boxSizing: 'border-box',
              borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {/* En-tête de la carte */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px'
            }}>
              <h3 style={{
                color: salon.textColor,
                margin: 0,
                fontSize: '1.4rem',
                fontWeight: '700'
              }}>
                {salon.emoji} {salon.name}
              </h3>
              {bar.badge && (
                <span style={{
                  background: '#FFD700',
                  color: '#000',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {salon.badge}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{
              color: bar.textColor === '#1a1a1a' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
              margin: '10px 0',
              fontSize: '0.95rem',
              lineHeight: '1.4'
            }}>
              {salon.description}
            </p>

            {/* Footer avec membres et bouton */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '15px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  color: salon.textColor,
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  👥 {salon.currentMembers}/{salon.maxMembers}
                </span>
                {salon.currentMembers === salon.maxMembers && (
                  <span style={{
                    background: '#E91E63',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    COMPLET
                  </span>
                )}
              </div>
              <button
                onClick={bar.action}
                disabled={salon.currentMembers === salon.maxMembers}
                style={{
                  padding: '10px 20px',
                  minHeight: '48px',
                  background: salon.currentMembers === salon.maxMembers
                    ? '#666'
                    : (salon.buttonStyle || 'var(--color-gold)'),
                  border: 'none',
                  borderRadius: '10px',
                  color: salon.currentMembers === salon.maxMembers
                    ? '#aaa'
                    : (salon.buttonStyle ? '#fff' : 'var(--color-brown-dark)'),
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: salon.currentMembers === salon.maxMembers ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  whiteSpace: 'nowrap',
                  opacity: salon.currentMembers === salon.maxMembers ? 0.5 : 1
                }}
                onMouseDown={(e) => {
                  if (salon.currentMembers !== salon.maxMembers) {
                    e.target.style.transform = 'scale(0.95)';
                  }
                }}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                {salon.currentMembers === salon.maxMembers ? 'Complet' : 'Rejoindre'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
