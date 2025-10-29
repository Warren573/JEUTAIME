import React from 'react';

export default function Header({ userCoins, adminMode, isAdminAuthenticated }) {
  return (
    <div style={{ background: '#1a1a1a', padding: '15px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'linear-gradient(135deg, #E91E63, #C2185B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>UT</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Utilisateur, 28 👑</h2>
            {adminMode && isAdminAuthenticated && (
              <span style={{ fontSize: '16px', animation: 'pulse 2s infinite' }} title="Mode Admin Actif">🛡️</span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
            Paris, France
            {adminMode && isAdminAuthenticated && (
              <span style={{ marginLeft: '8px', padding: '2px 8px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '10px', fontSize: '10px', fontWeight: '700' }}>
                ADMIN
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
