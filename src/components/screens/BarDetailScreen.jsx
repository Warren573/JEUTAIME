import React from 'react';
import { bars } from '../../data/appData';

export default function BarDetailScreen({ selectedBar, setSelectedBar, barTab, setBarTab }) {
  const bar = bars.find(b => b.id === selectedBar);
  if (!bar) return null;

  return (
    <div>
      <button onClick={() => setSelectedBar(null)} style={{ padding: '10px 20px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>← Retour</button>

      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
          <div style={{ fontSize: '40px' }}>{bar.icon}</div>
          <div>
            <h2 style={{ fontSize: '24px', margin: '0 0 4px 0', fontWeight: '600' }}>{bar.name}</h2>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{bar.desc}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {bar.participants.map((p, idx) => (
            <div key={idx} style={{ background: '#0a0a0a', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{p.gender === 'F' ? '👩' : '👨'}</div>
              <p style={{ fontSize: '11px', fontWeight: '600', margin: '0 0 2px 0' }}>{p.name}</p>
              <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>{p.age}ans</p>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.online ? '#4CAF50' : '#666', margin: '4px auto 0' }}></div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => setBarTab('discuss')} style={{ padding: '10px', background: barTab === 'discuss' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#0a0a0a', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💬 Discuter</button>
          <button onClick={() => setBarTab('challenges')} style={{ padding: '10px', background: barTab === 'challenges' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#0a0a0a', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>⚡ Défis</button>
          <button onClick={() => setBarTab('games')} style={{ padding: '10px', background: barTab === 'games' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#0a0a0a', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🎮 Jeux</button>
        </div>

        {barTab === 'discuss' && (
          <div>
            <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '15px', marginBottom: '15px', minHeight: '200px', maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>Sophie: Coucou les gens! 😊</div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>Alexandre: Salut! Ça va?</div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>Emma: Super ambiance ce soir!</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Écris un message..." style={{ flex: 1, padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '12px' }} />
              <button style={{ padding: '10px 20px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Envoyer</button>
            </div>
          </div>
        )}

        {barTab === 'challenges' && (
          <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '600' }}>Défis disponibles</h3>
            <p style={{ fontSize: '13px', color: '#888' }}>Fonctionnalité à venir...</p>
          </div>
        )}

        {barTab === 'games' && (
          <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
            <button style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>📖 Continue l'histoire</button>
            <p style={{ fontSize: '12px', color: '#888', margin: '12px 0 0 0' }}>Autres jeux à venir...</p>
          </div>
        )}
      </div>
    </div>
  );
}
