import React, { useState, useEffect } from 'react';
import { getUserActiveEffects } from '../../engine/effectEngine.js';

/**
 * AVATAR EFFECTS LAYER
 *
 * Affiche les effets visuels actifs sur un avatar.
 * Lit les effets via effectEngine — aucune logique hardcodée.
 *
 * Usage :
 *   <div style={{ position: 'relative' }}>
 *     <UserAvatar user={member} />
 *     <AvatarEffectsLayer userId={member.id} />
 *   </div>
 *
 * renderMode supportés :
 *   - emoji_above_avatar  → emoji flottant au-dessus
 *   - avatar_transform    → remplace l'avatar par un emoji géant
 *   - particle_overlay    → particules animées autour
 *   - animated_overlay    → overlay CSS animé
 */
export default function AvatarEffectsLayer({ userId }) {
  const [activeEffects, setActiveEffects] = useState([]);

  // Rafraîchir les effets toutes les 2 secondes
  useEffect(() => {
    const refresh = () => setActiveEffects(getUserActiveEffects(userId));
    refresh();
    const timer = setInterval(refresh, 2000);
    return () => clearInterval(timer);
  }, [userId]);

  if (activeEffects.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'visible',
      }}
    >
      {activeEffects.map(effect => (
        <EffectRenderer key={effect.id} effect={effect} />
      ))}
    </div>
  );
}

// ─── RENDERER GÉNÉRIQUE ───────────────────────────────────────────────────────
// L'engine lit effectDef.renderMode et dispatch — aucun if (effectId === ...)

function EffectRenderer({ effect }) {
  const { effectDef } = effect;
  if (!effectDef) return null;

  switch (effectDef.renderMode) {
    case 'emoji_above_avatar':
      return <EmojiAboveAvatar asset={effectDef.asset} />;
    case 'avatar_transform':
      return <AvatarTransform asset={effectDef.asset} />;
    case 'particle_overlay':
      return <ParticleOverlay asset={effectDef.asset} />;
    case 'animated_overlay':
      return <AnimatedOverlay asset={effectDef.asset} />;
    default:
      return null;
  }
}

// ─── COMPOSANTS DE RENDU ─────────────────────────────────────────────────────

function EmojiAboveAvatar({ asset }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '-22px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '1.3rem',
        animation: 'floatUpDown 1.5s ease-in-out infinite',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        lineHeight: 1,
      }}
    >
      {asset}
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

function AvatarTransform({ asset }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFF8F0',
        borderRadius: '50%',
        fontSize: '2.2rem',
        zIndex: 20,
        animation: 'transformPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 0 0 3px rgba(194,24,91,0.35)',
      }}
    >
      {asset}
      <style>{`
        @keyframes transformPop {
          0%   { transform: scale(0.3); opacity: 0; }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const PARTICLE_CONFIGS = {
  confetti: { emoji: ['🎊', '🎉', '✨', '🎈'], color: null },
  bubble:   { emoji: ['🫧', '⚪', '🔵'], color: null },
  rain:     { emoji: ['💧', '🌧️'], color: null },
};

function ParticleOverlay({ asset }) {
  const config = PARTICLE_CONFIGS[asset] || { emoji: ['✨'] };
  const particles = config.emoji;

  return (
    <div style={{
      position: 'absolute',
      top: '-10px', left: '-10px', right: '-10px', bottom: '-10px',
      overflow: 'visible',
      pointerEvents: 'none',
    }}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: '0.8rem',
            animation: `particleFly${i % 3} ${1 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          {particles[i % particles.length]}
        </div>
      ))}
      <style>{`
        @keyframes particleFly0 {
          0%   { transform: translate(0,0)    scale(1);   opacity: 1; }
          100% { transform: translate(-15px,-25px) scale(0.5); opacity: 0; }
        }
        @keyframes particleFly1 {
          0%   { transform: translate(0,0)    scale(1);   opacity: 1; }
          100% { transform: translate(10px,-20px)  scale(0.5); opacity: 0; }
        }
        @keyframes particleFly2 {
          0%   { transform: translate(0,0)    scale(1);   opacity: 1; }
          100% { transform: translate(5px,-30px)   scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const OVERLAY_CONFIGS = {
  thunder: { emoji: '⚡', bg: 'rgba(255,230,0,0.25)', border: '2px solid gold' },
  star:    { emoji: '⭐', bg: 'rgba(255,215,0,0.15)', border: '2px solid #FFD700' },
  fire:    { emoji: '🔥', bg: 'rgba(255,100,0,0.15)', border: '2px solid orange' },
  guitar:  { emoji: '🎸', bg: 'rgba(150,0,200,0.15)', border: '2px solid purple' },
  ghost:   { emoji: '👻', bg: 'rgba(200,200,255,0.3)', border: '2px dashed #aaa' },
};

function AnimatedOverlay({ asset }) {
  const cfg = OVERLAY_CONFIGS[asset] || { emoji: '✨', bg: 'rgba(255,255,255,0.2)', border: '2px solid white' };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: '50%',
        background: cfg.bg,
        border: cfg.border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'overlayPulse 1.5s ease-in-out infinite',
      }}
    >
      <span style={{
        position: 'absolute',
        top: '-14px', left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '1rem',
      }}>
        {cfg.emoji}
      </span>
      <style>{`
        @keyframes overlayPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
