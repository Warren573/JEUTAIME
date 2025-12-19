import React from 'react';

export default function ScreenHeader({ icon, title, subtitle }) {
  return (
    <div style={{
      background: 'var(--color-cream)',
      borderBottom: '4px double var(--color-brown-dark)',
      padding: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-lg)',
      boxShadow: 'var(--shadow-md)'
    }}>
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
