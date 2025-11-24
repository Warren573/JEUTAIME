import React from 'react';

export default function LandingPage({ onTryApp, onLogin }) {
  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Logo/Icon */}
        <div style={{
          fontSize: 'clamp(60px, 15vw, 80px)',
          marginBottom: '12px'
        }}>
          💕
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 2.8rem)',
          fontWeight: '800',
          color: 'white',
          margin: '0 0 8px 0',
          textShadow: '0 4px 12px rgba(0,0,0,0.2)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          JeuTaime
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
          color: 'rgba(255,255,255,0.95)',
          margin: '0 0 24px 0',
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          Rencontres anti-superficielles<br />avec jeux et bars virtuels 🎮
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '320px'
        }}>
          {/* Essayer sans compte */}
          <button
            onClick={onTryApp}
            style={{
              padding: '16px 24px',
              background: 'white',
              border: 'none',
              borderRadius: '12px',
              color: '#667eea',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              width: '100%',
              touchAction: 'manipulation'
            }}
          >
            🚀 Essayer sans compte
          </button>

          {/* Se connecter / Créer compte */}
          <button
            onClick={onLogin}
            style={{
              padding: '16px 24px',
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid white',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              width: '100%',
              touchAction: 'manipulation'
            }}
          >
            🔐 Se connecter
          </button>
        </div>

        {/* Footer info */}
        <p style={{
          marginTop: '20px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: '1.4'
        }}>
          Essai gratuit sans inscription
        </p>
      </div>
    </div>
  );
}
