import React, { useState, useEffect } from 'react';

function AdOverlay({ ad, onClose }) {
  const [timeRemaining, setTimeRemaining] = useState(5); // 5 secondes max
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Permettre de skip après 3 secondes
    const skipTimeout = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(skipTimeout);
    };
  }, [onClose]);

  const handleSkip = () => {
    if (canSkip) {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideInFromTop {
          from { transform: translateY(-100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Contenu de la pub */}
      <div style={{
        background: ad.background,
        borderRadius: '30px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        animation: 'slideInFromTop 0.5s ease-out',
        position: 'relative'
      }}>
        {/* Emoji principal */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '20px',
          animation: 'pulse 2s infinite'
        }}>
          {ad.emoji}
        </div>

        {/* Titre */}
        <h2 style={{
          fontSize: '2rem',
          margin: '0 0 15px 0',
          color: 'white',
          fontWeight: '900',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {ad.title}
        </h2>

        {/* Message */}
        <p style={{
          fontSize: '1.2rem',
          color: 'white',
          margin: '0 0 30px 0',
          fontWeight: '600',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          lineHeight: '1.5'
        }}>
          {ad.message}
        </p>

        {/* Compte à rebours */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '15px',
          padding: '10px 20px',
          display: 'inline-block',
          marginBottom: '20px'
        }}>
          <span style={{
            color: 'white',
            fontSize: '1rem',
            fontWeight: '700'
          }}>
            ⏱️ Fermeture dans {timeRemaining}s
          </span>
        </div>

        {/* Bouton Skip */}
        {canSkip ? (
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '2px solid white',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              color: 'white',
              fontSize: '1.3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'rgba(0, 0, 0, 0.6)';
            }}
          >
            ✕
          </button>
        ) : (
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.8rem',
            fontWeight: '700'
          }}>
            {3 - timeRemaining + 1}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdOverlay;
