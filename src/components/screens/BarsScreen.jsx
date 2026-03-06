import React from 'react';
import ScreenHeader from '../common/ScreenHeader';

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
    },
    {
      id: 'metal',
      name: 'Métal',
      emoji: '🤘',
      description: 'Faut battre le fer tant qu\'il est chaud',
      currentMembers: 3,
      maxMembers: 4,
      gradient: 'linear-gradient(135deg, #424242, #000000)',
      textColor: 'white',
      action: () => setSelectedSalon({ type: 'metal', name: 'Métal', emoji: '🤘' })
    },
    {
      id: 'psy',
      name: 'Cabinet du Psy',
      emoji: '🛋️',
      description: 'On y sert aussi des mojitos',
      currentMembers: 2,
      maxMembers: 4,
      gradient: 'linear-gradient(135deg, #B2DFDB, #00695C)',
      textColor: 'white',
      action: () => setSelectedSalon({ type: 'psy', name: 'Cabinet du Psy', emoji: '🛋️' })
    }
  ];

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
        icon="✨"
        title="SALONS"
        subtitle="Écrivez des histoires ensemble • Une phrase chacun • Timer 24h"
        onBack={() => setScreen('social')}
      />

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
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* En-tête de la carte */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{salon.emoji}</span>
                <h3 style={{
                  color: salon.textColor,
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  lineHeight: 1.2
                }}>
                  {salon.name}
                </h3>
              </div>
              {salon.badge && (
                <span style={{
                  background: '#FFD700',
                  color: '#000',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {salon.badge}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{
              color: salon.textColor === '#1a1a1a' ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.85)',
              margin: '0 0 12px 0',
              fontSize: '0.88rem',
              lineHeight: '1.4'
            }}>
              {salon.description}
            </p>

            {/* Footer avec membres et bouton */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  color: salon.textColor,
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  opacity: 0.9
                }}>
                  👥 {salon.currentMembers}/{salon.maxMembers}
                </span>
                {salon.currentMembers === salon.maxMembers && (
                  <span style={{
                    background: '#E91E63',
                    color: 'white',
                    padding: '2px 7px',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: 'bold'
                  }}>
                    COMPLET
                  </span>
                )}
              </div>
              <button
                onClick={salon.action}
                disabled={salon.currentMembers === salon.maxMembers}
                style={{
                  padding: '10px 22px',
                  minHeight: '44px',
                  background: salon.currentMembers === salon.maxMembers
                    ? 'rgba(0,0,0,0.3)'
                    : 'rgba(255,255,255,0.25)',
                  border: salon.currentMembers === salon.maxMembers
                    ? 'none'
                    : '1.5px solid rgba(255,255,255,0.6)',
                  borderRadius: '12px',
                  color: salon.currentMembers === salon.maxMembers
                    ? 'rgba(255,255,255,0.4)'
                    : 'white',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: salon.currentMembers === salon.maxMembers ? 'not-allowed' : 'pointer',
                  backdropFilter: 'blur(4px)',
                  transition: 'transform 0.15s, opacity 0.15s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                onMouseDown={(e) => {
                  if (salon.currentMembers !== salon.maxMembers) {
                    e.target.style.transform = 'scale(0.95)';
                  }
                }}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                onTouchStart={(e) => {
                  if (salon.currentMembers !== salon.maxMembers) {
                    e.target.style.transform = 'scale(0.95)';
                  }
                }}
                onTouchEnd={(e) => e.target.style.transform = 'scale(1)'}
              >
                {salon.currentMembers === salon.maxMembers ? 'Complet' : 'Rejoindre →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
