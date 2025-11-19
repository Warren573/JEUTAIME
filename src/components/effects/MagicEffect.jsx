import React, { useEffect, useState } from 'react';

/**
 * Composant d'effet visuel magique
 * Affiche une animation quand un cadeau ou sort est envoyé
 */
export default function MagicEffect({ gift, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Générer des particules magiques
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: gift?.emoji || '✨',
      angle: (Math.PI * 2 * i) / 20,
      speed: 2 + Math.random() * 3,
      size: 20 + Math.random() * 30
    }));

    setParticles(newParticles);

    // Animation terminée après 2 secondes
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [gift, onComplete]);

  if (!gift) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Fond avec fade */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
          animation: 'magicFadeIn 0.3s ease-out, magicFadeOut 0.5s ease-in 1.5s forwards'
        }}
      />

      {/* Cadeau central */}
      <div
        style={{
          fontSize: '100px',
          animation: 'magicPulse 2s ease-in-out',
          filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))',
          zIndex: 2
        }}
      >
        {gift.emoji}
      </div>

      {/* Particules en explosion */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            fontSize: `${particle.size}px`,
            opacity: 0,
            animation: `magicParticle 2s ease-out forwards`,
            animationDelay: `${particle.id * 0.05}s`,
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
            '--angle': `${particle.angle}rad`,
            '--speed': particle.speed
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Texte du cadeau */}
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '24px',
          fontWeight: 'bold',
          color: gift.color || '#FFD700',
          textShadow: '0 0 10px rgba(0,0,0,0.5), 0 0 20px currentColor',
          animation: 'magicTextAppear 2s ease-out',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          zIndex: 2
        }}
      >
        {gift.name}
        <div style={{
          fontSize: '14px',
          marginTop: '8px',
          opacity: 0.9
        }}>
          {gift.effect}
        </div>
      </div>

      {/* Vagues magiques */}
      {[0, 1, 2].map((i) => (
        <div
          key={`wave-${i}`}
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            border: '2px solid rgba(255,215,0,0.5)',
            borderRadius: '50%',
            animation: `magicWave 2s ease-out ${i * 0.3}s`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Styles d'animation en CSS-in-JS */}
      <style>{`
        @keyframes magicPulse {
          0% { transform: scale(0); opacity: 0; }
          20% { transform: scale(1.3); opacity: 1; }
          50% { transform: scale(1); }
          70% { transform: scale(1.1); }
          100% { transform: scale(0.8); opacity: 0; }
        }

        @keyframes magicParticle {
          0% {
            opacity: 0;
            transform: translate(
              calc(-50% + cos(var(--angle)) * 0px),
              calc(-50% + sin(var(--angle)) * 0px)
            ) scale(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + cos(var(--angle)) * calc(var(--speed) * 100px)),
              calc(-50% + sin(var(--angle)) * calc(var(--speed) * 100px))
            ) scale(1.5) rotate(360deg);
          }
        }

        @keyframes magicTextAppear {
          0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
          30% { opacity: 1; transform: translateX(-50%) translateY(0); }
          70% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }

        @keyframes magicWave {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }

        @keyframes magicFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes magicFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
