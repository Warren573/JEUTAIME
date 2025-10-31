import React from 'react';

export default function BarsScreen({ setScreen, setGameScreen }) {
  const bars = [
    {
      id: 'romantic',
      name: 'Bar Romantique',
      emoji: '🌹',
      description: 'Ambiance tamisée, poésie et émotions sincères',
      members: 12,
      gradient: 'linear-gradient(135deg, #FF6B9D, #C2185B)',
      textColor: 'white',
      action: () => alert('🌹 Rejoindre le Bar Romantique bientôt !')
    },
    {
      id: 'humorous',
      name: 'Bar Humoristique',
      emoji: '😄',
      description: 'Stand-up, blagues et jeux de mots hilarants',
      members: 18,
      gradient: 'linear-gradient(135deg, #FFD54F, #FFA000)',
      textColor: '#1a1a1a',
      action: () => alert('😄 Rejoindre le Bar Humoristique bientôt !')
    },
    {
      id: 'pirates',
      name: 'Bar Pirates',
      emoji: '🏴‍☠️',
      description: 'Aventures maritimes, chasses au trésor et énigmes',
      members: 8,
      gradient: 'linear-gradient(135deg, #6D4C41, #3E2723)',
      textColor: '#FFD700',
      border: '2px solid #8D6E63',
      buttonStyle: 'linear-gradient(135deg, #8D6E63, #5D4037)',
      action: () => setGameScreen('piratemonopoly')
    },
    {
      id: 'weekly',
      name: 'Bar Hebdomadaire',
      emoji: '📅',
      description: 'Groupe fermé de 4 personnes (2H/2F) • Durée: 7 jours',
      badge: 'EXCLUSIF',
      stats: '🎯 87% de réussite',
      gradient: 'linear-gradient(135deg, #5C6BC0, #3949AB)',
      textColor: 'white',
      action: () => alert('📅 Inscription au Bar Hebdomadaire bientôt disponible !')
    },
    {
      id: 'sanctuary',
      name: 'Le Sanctuaire',
      emoji: '👑',
      description: 'Accès ultra-exclusif • 3 énigmes à résoudre',
      badge: 'VIP',
      gradient: 'linear-gradient(135deg, #7B1FA2, #4A148C)',
      textColor: '#FFD700',
      border: '2px solid #FFD700',
      hasEnigmas: true,
      enigmas: [true, false, false],
      action: () => alert('🧩 Système d\'énigmes en développement !')
    }
  ];

  return (
    <div style={{
      maxHeight: 'calc(100vh - 80px)',
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
          🍸 Les Bars
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 'var(--spacing-sm) 0 0 0'
        }}>
          Rejoignez des espaces thématiques pour des rencontres authentiques
        </p>
      </div>

      <div style={{ padding: '0 var(--spacing-lg)' }}>
        {bars.map((bar) => (
          <div
            key={bar.id}
            style={{
              background: bar.gradient,
              border: bar.border || 'none',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              maxWidth: '100%',
              boxSizing: 'border-box'
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
                color: bar.textColor,
                margin: 0,
                fontSize: '1.4rem',
                fontWeight: '700'
              }}>
                {bar.emoji} {bar.name}
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
                  {bar.badge}
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
              {bar.description}
            </p>

            {/* Énigmes pour Le Sanctuaire */}
            {bar.hasEnigmas && (
              <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '10px'
                }}>
                  {bar.enigmas.map((solved, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
                        {solved ? '🔓' : '🔒'}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: solved ? '#4CAF50' : '#888'
                      }}>
                        Énigme {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer avec stats et bouton */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '15px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span style={{
                color: bar.textColor,
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {bar.stats || `👥 ${bar.members} ${bar.id === 'pirates' ? 'moussaillons' : 'personnes'}`}
              </span>
              <button
                onClick={bar.action}
                style={{
                  padding: '10px 20px',
                  background: bar.buttonStyle || 'var(--color-gold)',
                  border: 'none',
                  borderRadius: '10px',
                  color: bar.buttonStyle ? '#fff' : 'var(--color-brown-dark)',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                {bar.id === 'pirates' ? '⚓ Naviguer' :
                 bar.id === 'sanctuary' ? 'Tenter l\'accès' :
                 bar.id === 'weekly' ? 'S\'inscrire' : 'Rejoindre'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
