/**
 * ProfileSmileActions — Boutons Sourire / Grimace / Cadeau
 *
 * Extrait de ProfilesScreen.jsx (actions sous la carte profil).
 * Composant pur — tout comportement via callbacks.
 */

import React from 'react';

export default function ProfileSmileActions({ onSmile, onGrimace, onGift, disabled }) {
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--spacing-md)',
      justifyContent: 'center',
      marginTop: 'var(--spacing-md)',
    }}>
      {/* Grimace */}
      <button
        onClick={onGrimace}
        disabled={disabled}
        title="Grimace — pas intéressé"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '3px solid var(--color-brown-light)',
          background: 'var(--color-cream)',
          fontSize: '2rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          opacity: disabled ? 0.5 : 1,
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        😬
      </button>

      {/* Sourire */}
      <button
        onClick={onSmile}
        disabled={disabled}
        title="Sourire — ce profil me plaît"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '3px solid var(--color-gold)',
          background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
          fontSize: '2.5rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          opacity: disabled ? 0.5 : 1,
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        😊
      </button>

      {/* Cadeau */}
      {onGift && (
        <button
          onClick={onGift}
          disabled={disabled}
          title="Envoyer un cadeau"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid var(--color-romantic)',
            background: 'var(--color-cream)',
            fontSize: '2rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            opacity: disabled ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          🎁
        </button>
      )}
    </div>
  );
}
