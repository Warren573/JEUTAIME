import React, { useState } from 'react';

export default function Bars() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBar, setNewBar] = useState({ name: '', desc: '', icon: '', theme: '' });

  const bars = [
    { id: 1, icon: '🌹', name: 'Salon Romantique', desc: 'Ambiance tamisée', participants: 45, messages: 1234, active: true, created: '01/10/2024' },
    { id: 2, icon: '😄', name: 'Salon Humoristique', desc: 'Rires garantis', participants: 38, messages: 892, active: true, created: '01/10/2024' },
    { id: 3, icon: '🏴‍☠️', name: 'Salon Pirates', desc: 'Aventures maritimes', participants: 29, messages: 567, active: true, created: '01/10/2024' },
    { id: 4, icon: '📅', name: 'Salon Hebdomadaire', desc: 'Renouvelé chaque lundi', participants: 52, messages: 1456, active: true, created: '15/10/2024' },
    { id: 5, icon: '👑', name: 'Salon Caché', desc: '3 énigmes pour accéder', participants: 15, messages: 234, active: true, created: '10/10/2024' },
    { id: 6, icon: '🎄', name: 'Salon Saisonnier', desc: 'Spécial Noël', participants: 8, messages: 45, active: false, created: '20/12/2023' }
  ];

  const handleCreateBar = () => {
    console.log('Créer salon:', newBar);
    setShowCreateModal(false);
    setNewBar({ name: '', desc: '', icon: '', theme: '' });
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Gestion des Salons</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Créer et gérer les salons thématiques</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ➕ Nouveau Salon
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Total salons</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#E91E63' }}>{bars.length}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Actifs</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>{bars.filter(b => b.active).length}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Participants total</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2196F3' }}>{bars.reduce((acc, b) => acc + b.participants, 0)}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Messages total</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#9C27B0' }}>{bars.reduce((acc, b) => acc + b.messages, 0)}</div>
        </div>
      </div>

      {/* Bars grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {bars.map(bar => (
          <div key={bar.id} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333', position: 'relative' }}>
            {/* Status badge */}
            <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                background: bar.active ? '#4CAF5022' : '#66666622',
                color: bar.active ? '#4CAF50' : '#666'
              }}>
                {bar.active ? '✓ Actif' : '✗ Inactif'}
              </span>
            </div>

            {/* Icon and title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ fontSize: '48px' }}>{bar.icon}</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>{bar.name}</h3>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{bar.desc}</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#E91E63' }}>{bar.participants}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>Participants</div>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#2196F3' }}>{bar.messages}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>Messages</div>
              </div>
            </div>

            {/* Meta */}
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '15px' }}>
              Créé le {bar.created}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#2196F3', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                ✏️ Modifier
              </button>
              <button style={{ flex: 1, padding: '10px', background: bar.active ? '#FF9800' : '#4CAF50', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                {bar.active ? '⏸️ Désactiver' : '▶️ Activer'}
              </button>
              <button style={{ padding: '10px 15px', background: '#dc3545', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '500px', border: '1px solid #333' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 20px 0' }}>Créer un nouveau Salon</h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Nom du salon
              </label>
              <input
                type="text"
                value={newBar.name}
                onChange={(e) => setNewBar({ ...newBar, name: e.target.value })}
                placeholder="Ex: Salon Musical"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Description
              </label>
              <input
                type="text"
                value={newBar.desc}
                onChange={(e) => setNewBar({ ...newBar, desc: e.target.value })}
                placeholder="Ex: Pour les mélomanes"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Icône (emoji)
              </label>
              <input
                type="text"
                value={newBar.icon}
                onChange={(e) => setNewBar({ ...newBar, icon: e.target.value })}
                placeholder="Ex: 🎵"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Thème
              </label>
              <select
                value={newBar.theme}
                onChange={(e) => setNewBar({ ...newBar, theme: e.target.value })}
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              >
                <option value="">Sélectionner un thème</option>
                <option value="romantic">Romantique</option>
                <option value="humor">Humoristique</option>
                <option value="adventure">Aventure</option>
                <option value="music">Musical</option>
                <option value="sport">Sportif</option>
                <option value="geek">Geek</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ flex: 1, padding: '12px', background: '#666', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateBar}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
