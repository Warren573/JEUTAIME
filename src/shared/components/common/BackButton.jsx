import React from 'react';

export default function BackButton({ onClick, noSafeArea = false, absolute = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: absolute ? 'absolute' : 'sticky',
        top: noSafeArea ? '10px' : 'calc(env(safe-area-inset-top) + 10px)',
        left: '10px',
        width: '40px',
        height: '40px',
        background: 'var(--color-cream)',
        border: '2px solid var(--color-brown-light)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '20px',
        boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition-normal)',
        zIndex: 100,
        margin: '0',
        marginTop: '-60px',
        flexShrink: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.background = 'var(--color-brown-light)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = 'var(--color-cream)';
      }}
    >
      ←
    </button>
  );
}
