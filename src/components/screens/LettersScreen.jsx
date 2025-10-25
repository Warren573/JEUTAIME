import React from 'react';

export default function LettersScreen({ myLetters }) {
  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '25px', fontWeight: '600' }}>💌 Mes Lettres</h1>
      {myLetters.map((letter) => (
        <div key={letter.id} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', fontWeight: '600' }}>{letter.name}</h3>
          <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 6px 0' }}>{letter.lastMsg}</p>
          <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>{letter.lastDate}</p>
        </div>
      ))}

      <div style={{ background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)', padding: '15px', borderRadius: '15px', marginTop: '25px', marginBottom: '20px', color: 'white' }}>
        <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: '600' }}>✨ Envoyer de la Magie</h3>
        <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Envoie des cadeaux magiques à tes correspondants pour renforcer votre connexion!</p>
      </div>

      <h3 style={{ fontSize: '14px', marginBottom: '15px', fontWeight: '600', color: '#aaa' }}>🎁 Offrandes disponibles</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌹</div>
          <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '600' }}>Rose</h3>
          <p style={{ fontSize: '12px', color: '#E91E63', margin: '0 0 8px 0', fontWeight: 'bold' }}>30 🪙</p>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🧪</div>
          <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '600' }}>Philtre</h3>
          <p style={{ fontSize: '12px', color: '#9C27B0', margin: '0 0 8px 0', fontWeight: 'bold' }}>50 🪙</p>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>💐</div>
          <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '600' }}>Bouquet</h3>
          <p style={{ fontSize: '12px', color: '#FF9800', margin: '0 0 8px 0', fontWeight: 'bold' }}>75 🪙</p>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍷</div>
          <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '600' }}>Verre de vin</h3>
          <p style={{ fontSize: '12px', color: '#2196F3', margin: '0 0 8px 0', fontWeight: 'bold' }}>100 🪙</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1', border: '3px solid #FFD700' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>💎</div>
          <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '700', color: '#000' }}>Diamant Éternel</h3>
          <p style={{ fontSize: '14px', color: '#000', margin: '0 0 8px 0', fontWeight: 'bold' }}>500 🪙</p>
        </div>
      </div>
    </div>
  );
}
