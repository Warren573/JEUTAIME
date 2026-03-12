import React from 'react';
import ScreenHeader from '../common/ScreenHeader';

export default function BarsScreen({ setScreen, setGameScreen, setSelectedSalon, currentUser }) {
  const salons = [
    {
      id: 1,
      name: 'Piscine',
      emoji: '🏊',
      description: '2H/2F - Ambiance aquatique et détente',
      currentMembers: 3,
      maxMembers: 4,
      gradient: 'linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%)',
      textColor: 'white',
      action: () => setSelectedSalon(1)
    },
    {
      id: 2,
      name: 'Café de Paris',
      emoji: '☕',
      description: '2H/2F - Ambiance parisienne chic',
      currentMembers: 3,
      maxMembers: 4,
      gradient: 'linear-gradient(180deg, #D7CCC8 0%, #8D6E63 100%)',
      textColor: 'white',
      action: () => setSelectedSalon(2)
    },
    {
      id: 3,
      name: 'Île des pirates',
      emoji: '🏴‍☠️',
      description: '2H/2F - Aventures maritimes',
      currentMembers: 2,
      maxMembers: 4,
      gradient: 'linear-gradient(180deg, #FFD54F 0%, #5D4037 100%)',
      textColor: 'white',
      action: () => setSelectedSalon(3)
    },
    {
      id: 4,
      name: 'Théâtre improvisé',
      emoji: '🎭',
      description: '2H/2F - Spectacles et fous rires',
      currentMembers: 3,
      maxMembers: 4,
      gradient: 'linear-gradient(180deg, #CE93D8 0%, #7B1FA2 100%)',
      textColor: 'white',
      action: () => setSelectedSalon(4)
    },
    {
      id: 5,
      name: 'Bar à cocktails',
      emoji: '🍸',
      description: '2H/2F - Mixologie et saveurs exotiques',
      currentMembers: 2,
      maxMembers: 4,
      gradient: 'linear-gradient(180deg, #F48FB1 0%, #C2185B 100%)',
      textColor: 'white',
      action: () => setSelectedSalon(5)
    },
    {
      id: 6,
      name: 'Métal',
      emoji: '🤘',
      description: '2H/2F - Faut battre le fer tant qu\'il est chaud',
      currentMembers: 3,
      maxMembers: 4,
      gradient: 'linear-gradient(180deg, #424242 0%, #000000 100%)',
      textColor: 'white',
      action: () => setSelectedSalon(6)
    },
    {
      id: 7,
      name: 'Cabinet du Psy',
      emoji: '🛋️',
      description: '2H/2F - On y sert aussi des mojitos',
      currentMembers: 2,
      maxMembers: 4,
      gradient: 'linear-gradient(180deg, #B2DFDB 0%, #00695C 100%)',
      textColor: 'white',
      action: () => setSelectedSalon(7)
    },
    {
      id: 99,
      name: 'Café de Paris 2.0',
      emoji: '☕',
      description: '2H/2F - Le salon nouvelle génération',
      currentMembers: 3,
      maxMembers: 4,
      badge: 'NOUVEAU',
      gradient: 'linear-gradient(135deg, #6B4F3A 0%, #C8A882 60%, #F5E6D3 100%)',
      textColor: 'white',
      action: () => setSelectedSalon(99)
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

      <div style={{
        padding: '0 var(--spacing-sm)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
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
