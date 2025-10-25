import React from 'react';

export default function BrickBreakerGame({ setGameScreen, brickScore }) {
  return (
    <div>
      <button onClick={() => setGameScreen(null)} style={{ padding: '10px 20px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>← Retour</button>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>🧱 Casse Brique</h2>
      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
        <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '20px', marginBottom: '20px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎮</div>
            <p style={{ color: '#888', fontSize: '16px' }}>Jeu interactif à venir...</p>
          </div>
        </div>
        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Score: {brickScore}</h3>
      </div>
    </div>
  );
}
