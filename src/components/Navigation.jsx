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
      borderTop: '2px solid var(--color-gold)',
      padding: '2px 2px 3px',
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '2px',
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
              border: isActive ? '1px solid var(--color-gold-light)' : '1px solid transparent',
              color: isActive ? 'var(--color-brown-dark)' : 'var(--color-tan)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1px',
              fontSize: '8px',
              padding: '4px 2px',
              fontWeight: isActive ? '700' : '500',
              borderRadius: '6px',
              transition: 'all var(--transition-normal)',
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
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
              fontSize: '18px',
              filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
              transition: 'all var(--transition-normal)'
            }}>
              {nav.icon}
            </div>
            <div style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              lineHeight: '1',
              fontFamily: 'var(--font-primary)',
              width: '100%',
              maxWidth: '100%'
            }}>
              {nav.label}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
