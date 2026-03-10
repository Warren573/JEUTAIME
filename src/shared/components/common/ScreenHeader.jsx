import React from 'react';

export default function ScreenHeader({ icon, title, subtitle, onBack }) {
  return (
    <div style={{
      background: 'var(--color-cream)',
      borderBottom: '4px double var(--color-brown-dark)',
      padding: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-lg)',
      boxShadow: 'var(--shadow-md)',
      position: 'relative'
    }}>
      {/* Bouton retour optionnel */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '3px solid var(--color-brown-dark)',
            background: 'white',
            color: 'var(--color-brown-dark)',
            fontSize: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 100,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-gold)';
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ←
        </button>
      )}

      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '2rem',
        textAlign: 'center',
        margin: '0 0 var(--spacing-xs) 0',
        color: 'var(--color-brown-dark)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        borderBottom: '2px solid var(--color-text-primary)',
        paddingBottom: 'var(--spacing-xs)',
        paddingLeft: onBack ? '45px' : '0',
        paddingRight: onBack ? '45px' : '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '2rem', lineHeight: '1' }}>{icon}</span>
        <span>{title}</span>
      </h1>
      {subtitle && (
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 0
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
