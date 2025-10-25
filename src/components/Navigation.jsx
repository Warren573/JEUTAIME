import React from 'react';

export default function Navigation({ navItems, screen, setScreen }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '430px', margin: '0 auto', background: '#000', borderTop: '1px solid #1a1a1a', padding: '10px 5px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '3px' }}>
      {navItems.map((nav) => (
        <button key={nav.id} onClick={() => setScreen(nav.id)} style={{ background: 'none', border: 'none', color: screen === nav.id ? '#E91E63' : '#666', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', fontSize: '9px', padding: '6px 2px', fontWeight: screen === nav.id ? '600' : 'normal' }}>
          <div style={{ fontSize: '20px' }}>{nav.icon}</div>
          <div style={{ wordBreak: 'break-word', textAlign: 'center' }}>{nav.label}</div>
        </button>
      ))}
    </div>
  );
}
