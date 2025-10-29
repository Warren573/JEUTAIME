import React, { useState, useEffect } from 'react';

// Composant pour afficher un effet visuel magique
export default function MagicEffect({ spell, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Créer les particules
    const newParticles = Array.from({ length: spell.particles.count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5
    }));
    setParticles(newParticles);

    // Nettoyer après l'animation
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => clearTimeout(timeout);
  }, [spell, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: '24px',
            animation: `magicFloat ${particle.duration}s ease-out ${particle.delay}s`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            opacity: 0
          }}
        >
          {spell.particles.emoji}
        </div>
      ))}

      {/* Effet central */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '120px',
          animation: 'magicPulse 0.6s ease-out'
        }}
      >
        {spell.icon}
      </div>

      <style>{`
        @keyframes magicFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(${particles[0]?.scale || 1}) rotate(${particles[0]?.rotation || 0}deg);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateY(-150px) scale(0.2) rotate(${(particles[0]?.rotation || 0) + 180}deg);
          }
        }

        @keyframes magicPulse {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Composant pour afficher un mini effet sur un message
export function MiniMagicEffect({ spell, targetRef }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '-20px',
        right: '10px',
        fontSize: '32px',
        animation: 'miniSpellBounce 0.8s ease-out',
        zIndex: 100
      }}
    >
      {spell.icon}
      <style>{`
        @keyframes miniSpellBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) scale(1.3);
            opacity: 0.7;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
