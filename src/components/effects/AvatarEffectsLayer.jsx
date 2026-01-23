/**
 * AvatarEffectsLayer - Couche d'effets pour Avatar
 *
 * Affiche les effets visuels actifs sur un avatar sans modifier l'avatar source.
 * Mobile-first : léger, performant, pas de canvas lourd.
 */

import React from 'react';
import { getUserActiveEffects, EFFECT_TYPES } from '../../engine/EffectEngine';

/**
 * Composant overlay pour avatar
 *
 * Usage :
 * <div style={{ position: 'relative' }}>
 *   <Avatar userId={userId} />
 *   <AvatarEffectsLayer userId={userId} />
 * </div>
 */
export default function AvatarEffectsLayer({ userId }) {
  const effects = getUserActiveEffects(userId);

  // Filtrer seulement les effets avatar
  const avatarEffects = effects.filter(e =>
    e.type === EFFECT_TYPES.AVATAR_OVERLAY ||
    e.type === EFFECT_TYPES.AVATAR_VISIBILITY
  );

  if (avatarEffects.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none', // Ne bloque pas les interactions
        zIndex: 10
      }}
    >
      {avatarEffects.map(effect => (
        <EffectRenderer key={effect.id} effect={effect} />
      ))}
    </div>
  );
}

/**
 * Rendu d'un effet individuel
 */
function EffectRenderer({ effect }) {
  const { type, data } = effect;

  switch (type) {
    case EFFECT_TYPES.AVATAR_OVERLAY:
      return <OverlayEffect data={data} />;

    case EFFECT_TYPES.AVATAR_VISIBILITY:
      return <VisibilityEffect data={data} />;

    default:
      return null;
  }
}

/**
 * Effet Overlay (emoji, animation)
 */
function OverlayEffect({ data }) {
  const { overlay } = data;

  if (!overlay) return null;

  // Si c'est un emoji
  if (overlay.emoji) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '3rem', // Responsive avec rem
          animation: overlay.animation ? getAnimation(overlay.animation) : 'none',
          opacity: 0.9
        }}
      >
        {overlay.emoji}
      </div>
    );
  }

  // Si c'est une animation CSS custom
  if (overlay.animation) {
    return (
      <div
        className={`avatar-effect-${overlay.animation}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          animation: getAnimation(overlay.animation)
        }}
      />
    );
  }

  return null;
}

/**
 * Effet Visibilité (invisibilité partielle)
 */
function VisibilityEffect({ data }) {
  const { opacity = 0.3 } = data;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.7)',
        opacity: 1 - opacity,
        backdropFilter: 'blur(2px)', // Effet flou léger
        transition: 'opacity 0.3s ease' // Transition douce
      }}
    />
  );
}

/**
 * Retourne l'animation CSS selon le nom
 * Mobile-first : animations légères, pas de transform 3D lourdes
 */
function getAnimation(animationName) {
  const animations = {
    sparkle: 'sparkle 1s ease-in-out infinite',
    pulse: 'pulse 2s ease-in-out infinite',
    rotate: 'rotate 3s linear infinite',
    bounce: 'bounce 1s ease-in-out infinite',
    shake: 'shake 0.5s ease-in-out infinite'
  };

  return animations[animationName] || 'none';
}

// ============================================================================
// CSS ANIMATIONS (à ajouter dans le CSS global ou styled-components)
// ============================================================================

/*
@keyframes sparkle {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
*/
