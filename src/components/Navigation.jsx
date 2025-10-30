import React from 'react';

export default function Navigation({ navItems, screen, setScreen }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: '430px',
      margin: '0 auto',
      background: 'var(--color-brown-dark)',
      borderTop: '3px solid var(--color-gold)',
      padding: '8px 5px 12px',
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '4px',
      boxShadow: '0 -4px 12px rgba(58, 40, 24, 0.3)',
      zIndex: 1000
    }}>
      {navItems.map((nav) => {
        const isActive = screen === nav.id;
        return (
          <button
            key={nav.id}
            onClick={() => setScreen(nav.id)}
            style={{
              background: isActive
                ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                : 'transparent',
              border: isActive ? '2px solid var(--color-gold-light)' : '2px solid transparent',
              color: isActive ? 'var(--color-brown-dark)' : 'var(--color-tan)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              padding: '8px 4px',
              fontWeight: isActive ? '700' : '500',
              borderRadius: 'var(--border-radius-md)',
              transition: 'all var(--transition-normal)',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isActive ? 'var(--shadow-md)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(218, 165, 32, 0.2)';
                e.currentTarget.style.color = 'var(--color-gold-light)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-tan)';
              }
            }}
          >
            <div style={{
              fontSize: '22px',
              filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
              transition: 'all var(--transition-normal)'
            }}>
              {nav.icon}
            </div>
            <div style={{
              wordBreak: 'break-word',
              textAlign: 'center',
              lineHeight: '1.1',
              fontFamily: 'var(--font-primary)'
            }}>
              {nav.label}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
