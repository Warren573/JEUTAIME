import React, { useState, useEffect } from 'react';
import AvatarEffectsLayer from '../effects/AvatarEffectsLayer';
import {
  activateEffect,
  deactivateEffect,
  getUserActiveEffects,
  activateInvisibility,
  activateAvatarOverlay,
  activateProfileBadge,
  applyTextTransform,
  EFFECT_TYPES
} from '../../engine/EffectEngine';
import { applyTheme, transitionToTheme } from '../../engine/ThemeEngine';
import { getSalons } from '../../engine/ContentRegistry';

export default function DemoEffectsScreen({ currentUser, onBack }) {
  const [selectedSalon, setSelectedSalon] = useState(1);
  const [activeEffects, setActiveEffects] = useState([]);
  const [testText, setTestText] = useState('Bonjour ! Ceci est un message de test 🎉');
  const [refreshKey, setRefreshKey] = useState(0);

  const userId = currentUser?.email || 'demo-user';
  const salons = getSalons();

  // Rafraîchir les effets actifs
  useEffect(() => {
    const interval = setInterval(() => {
      const effects = getUserActiveEffects(userId);
      setActiveEffects(effects);
      setRefreshKey(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [userId]);

  // Thème actif
  const themeStyles = applyTheme(selectedSalon, {
    bgGradient: salons.find(s => s.id === selectedSalon)?.bgGradient
  });

  // Appliquer transform au texte
  const transformedText = applyTextTransform(testText, userId);

  // Handlers
  const handleInvisibility = () => {
    activateInvisibility(userId, 10000); // 10 secondes
    alert('🫥 Invisibilité activée pour 10 secondes !');
    setRefreshKey(prev => prev + 1);
  };

  const handleSparkle = () => {
    activateAvatarOverlay(userId, 'sparkle', 15000); // 15 secondes
    alert('✨ Effet sparkle activé pour 15 secondes !');
    setRefreshKey(prev => prev + 1);
  };

  const handleGlow = () => {
    activateAvatarOverlay(userId, 'glow', 15000);
    alert('🌟 Effet lueur activé pour 15 secondes !');
    setRefreshKey(prev => prev + 1);
  };

  const handleBadge = () => {
    activateProfileBadge(userId, '👑', 'VIP', 20000);
    alert('👑 Badge VIP activé pour 20 secondes !');
    setRefreshKey(prev => prev + 1);
  };

  const handleTextReverse = () => {
    activateEffect(EFFECT_TYPES.TEXT_TRANSFORM, userId, 15000, { transform: 'reverse' });
    alert('🔄 Texte inversé pour 15 secondes !');
    setRefreshKey(prev => prev + 1);
  };

  const handleTextUppercase = () => {
    activateEffect(EFFECT_TYPES.TEXT_TRANSFORM, userId, 15000, { transform: 'uppercase' });
    alert('🔤 Texte en majuscules pour 15 secondes !');
    setRefreshKey(prev => prev + 1);
  };

  const handleClearEffects = () => {
    activeEffects.forEach(effect => {
      deactivateEffect(effect.id);
    });
    alert('🧹 Tous les effets ont été supprimés !');
    setRefreshKey(prev => prev + 1);
  };

  const handleChangeSalon = (salonId) => {
    transitionToTheme(salonId, 800);
    setSelectedSalon(salonId);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      overflowY: 'auto',
      background: 'var(--color-beige-light)'
    }}>
      {/* Header avec thème dynamique */}
      <div style={{
        ...themeStyles,
        padding: 'var(--spacing-lg)',
        paddingTop: 'calc(var(--spacing-lg) + env(safe-area-inset-top))',
        boxShadow: 'var(--shadow-md)',
        borderBottom: '4px solid rgba(0,0,0,0.2)',
        position: 'relative',
        minHeight: '200px',
        transition: 'all 0.8s ease-in-out'
      }}>
        {/* Bouton retour */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top) + 12px)',
            left: '12px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '3px solid white',
            background: 'white',
            color: 'var(--color-brown-dark)',
            fontSize: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 100,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          ←
        </button>

        <h1 style={{
          fontSize: '1.8rem',
          color: 'white',
          margin: '0 0 12px 0',
          fontWeight: '700',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          🎨 Démo Effets Visuels
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          fontSize: '0.9rem',
          margin: '0',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          Testez l'EffectEngine et le ThemeEngine en live
        </p>

        {/* Avatar de démo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            {/* Image avatar personnalisée */}
            <img
              key={refreshKey}
              src="/demo-avatar.png"
              alt="Avatar démo"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            />
            {/* Couche d'effets visuels par-dessus */}
            <AvatarEffectsLayer userId={userId} />

            {/* Indicateur effets actifs */}
            {activeEffects.length > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                right: '-10px',
                background: '#FFD700',
                color: '#000',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 20
              }}>
                {activeEffects.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        {/* Section: Effets actifs */}
        {activeEffects.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #4CAF5022, #4CAF5011)',
            borderRadius: '15px',
            padding: '15px',
            marginBottom: '20px',
            border: '2px solid #4CAF50'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '700',
                margin: 0,
                color: '#4CAF50'
              }}>
                ✅ Effets actifs ({activeEffects.length})
              </h3>
              <button
                onClick={handleClearEffects}
                style={{
                  padding: '6px 12px',
                  background: '#dc3545',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🧹 Tout supprimer
              </button>
            </div>
            {activeEffects.map(effect => (
              <div
                key={effect.id}
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  padding: '10px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {effect.type}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    Expire dans {Math.ceil((effect.expiresAt - Date.now()) / 1000)}s
                  </div>
                </div>
                <button
                  onClick={() => {
                    deactivateEffect(effect.id);
                    setRefreshKey(prev => prev + 1);
                  }}
                  style={{
                    padding: '4px 8px',
                    background: '#666',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Section: Effets Avatar */}
        <div style={{
          background: '#fff',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '15px',
            color: 'var(--color-brown-dark)'
          }}>
            👤 Effets Avatar
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            <button
              onClick={handleInvisibility}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(156,39,176,0.3)'
              }}
            >
              👻 Invisibilité<br/>
              <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>10s</span>
            </button>
            <button
              onClick={handleSparkle}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(255,215,0,0.3)'
              }}
            >
              ✨ Sparkle<br/>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>15s</span>
            </button>
            <button
              onClick={handleGlow}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(33,150,243,0.3)'
              }}
            >
              🌟 Lueur<br/>
              <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>15s</span>
            </button>
            <button
              onClick={handleBadge}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #FF5722, #E64A19)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(255,87,34,0.3)'
              }}
            >
              👑 Badge VIP<br/>
              <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>20s</span>
            </button>
          </div>
        </div>

        {/* Section: Effets Texte */}
        <div style={{
          background: '#fff',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '15px',
            color: 'var(--color-brown-dark)'
          }}>
            📝 Effets Texte (Display Only)
          </h2>
          <div style={{
            background: 'var(--color-beige-light)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '15px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '500',
            textAlign: 'center',
            wordBreak: 'break-word'
          }}>
            {transformedText}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            <button
              onClick={handleTextReverse}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(233,30,99,0.3)'
              }}
            >
              🔄 Inverser<br/>
              <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>15s</span>
            </button>
            <button
              onClick={handleTextUppercase}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #00BCD4, #0097A7)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,188,212,0.3)'
              }}
            >
              🔤 MAJUSCULES<br/>
              <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>15s</span>
            </button>
          </div>
        </div>

        {/* Section: Thèmes Salons */}
        <div style={{
          background: '#fff',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '15px',
            color: 'var(--color-brown-dark)'
          }}>
            🎨 Thèmes Salons (Mobile-First)
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: '#666',
            marginBottom: '15px'
          }}>
            Changez le thème de fond avec transitions douces (0.8s)
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '10px'
          }}>
            {salons.map(salon => (
              <button
                key={salon.id}
                onClick={() => handleChangeSalon(salon.id)}
                style={{
                  padding: '15px 10px',
                  background: selectedSalon === salon.id
                    ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                    : salon.bgGradient || '#666',
                  border: selectedSalon === salon.id ? '3px solid #4CAF50' : 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: selectedSalon === salon.id
                    ? '0 4px 12px rgba(76,175,80,0.4)'
                    : '0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '5px' }}>
                  {salon.icon}
                </div>
                {salon.name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '12px',
          fontSize: '0.75rem',
          color: '#666',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: '600' }}>
            📦 Architecture:
          </div>
          <div>
            ContentRegistry • EffectEngine • ThemeEngine
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.7rem', opacity: 0.7 }}>
            Mobile-first • GPU accelerated • LocalStorage ready
          </div>
        </div>
      </div>
    </div>
  );
}
