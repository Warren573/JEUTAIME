import React from 'react';

export default function LandingPage({ onTryApp, onLogin }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decoration background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px', width: '100%' }}>
        {/* Logo/Icon */}
        <div style={{
          fontSize: '120px',
          marginBottom: '20px',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          💕
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 3.5rem)',
          fontWeight: '800',
          color: 'white',
          margin: '0 0 16px 0',
          textShadow: '0 4px 12px rgba(0,0,0,0.2)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          JeuTaime
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 4vw, 1.3rem)',
          color: 'rgba(255,255,255,0.95)',
          margin: '0 0 40px 0',
          fontWeight: '500',
          lineHeight: '1.6'
        }}>
          L'application de rencontres<br />
          anti-superficielle 🎮✨
        </p>

        {/* Features */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          {[
            { icon: '🎮', text: 'Mini-jeux pour briser la glace' },
            { icon: '💬', text: 'Conversations authentiques' },
            { icon: '🍸', text: 'Bars virtuels thématiques' },
            { icon: '💌', text: 'Lettres d\'amour digitales' }
          ].map((feature, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.15)',
              padding: '12px 16px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ fontSize: '24px' }}>{feature.icon}</span>
              <span style={{ color: 'white', fontSize: '15px', fontWeight: '500' }}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%'
        }}>
          {/* Essayer sans compte */}
          <button
            onClick={onTryApp}
            style={{
              padding: '18px 32px',
              background: 'white',
              border: 'none',
              borderRadius: '16px',
              color: '#667eea',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              width: '100%'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            🚀 Essayer sans compte
          </button>

          {/* Se connecter / Créer compte */}
          <button
            onClick={onLogin}
            style={{
              padding: '18px 32px',
              background: 'transparent',
              border: '3px solid white',
              borderRadius: '16px',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s',
              width: '100%'
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'scale(0.98)';
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'transparent';
            }}
          >
            🔐 Se connecter / Créer un compte
          </button>
        </div>

        {/* Footer info */}
        <p style={{
          marginTop: '32px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: '1.5'
        }}>
          Mode essai : accès limité sans inscription<br />
          Créez un compte pour l'expérience complète
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
