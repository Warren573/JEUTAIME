import React from 'react';

export default function Header({ userCoins }) {
  return (
    <div style={{ background: '#1a1a1a', padding: '15px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'linear-gradient(135deg, #E91E63, #C2185B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>UT</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Utilisateur, 28 👑</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Paris, France</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', padding: '10px 18px', borderRadius: '25px', fontWeight: 'bold', color: '#000', fontSize: '16px' }}>
          💰 {userCoins}
        </div>
      </div>
    </div>
  );
}
