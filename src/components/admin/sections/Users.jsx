import React, { useState } from 'react';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    { id: 1, name: 'Sophie Laurent', email: 'sophie@example.com', joined: '15/10/2024', status: 'active', premium: true, coins: 2450, reports: 0 },
    { id: 2, name: 'Thomas Martin', email: 'thomas@example.com', joined: '14/10/2024', status: 'active', premium: false, coins: 1230, reports: 0 },
    { id: 3, name: 'Emma Dubois', email: 'emma@example.com', joined: '13/10/2024', status: 'active', premium: true, coins: 3890, reports: 0 },
    { id: 4, name: 'Lucas Bernard', email: 'lucas@example.com', joined: '12/10/2024', status: 'banned', premium: false, coins: 450, reports: 3 },
    { id: 5, name: 'Chloé Petit', email: 'chloe@example.com', joined: '11/10/2024', status: 'active', premium: true, coins: 5670, reports: 0 }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus ||
                         (filterStatus === 'premium' && user.premium);
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Gestion des utilisateurs</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Gérer les comptes et permissions</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Total utilisateurs</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>12,847</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Actifs aujourd'hui</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2196F3' }}>3,456</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Premium</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFD700' }}>1,234</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Bannis</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545' }}>23</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '20px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'active', 'premium', 'banned'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '12px 20px',
                  background: filterStatus === status ? '#667eea' : '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : status === 'premium' ? 'Premium' : 'Bannis'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users table */}
      <div style={{ background: '#1a1a1a', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr 150px', gap: '15px', padding: '15px 20px', background: '#0a0a0a', fontSize: '12px', fontWeight: '700', color: '#888', borderBottom: '1px solid #333' }}>
          <div>UTILISATEUR</div>
          <div>EMAIL</div>
          <div>INSCRIT</div>
          <div>STATUT</div>
          <div>PIÈCES</div>
          <div>SIGNALEMENTS</div>
          <div>ACTIONS</div>
        </div>

        {filteredUsers.map(user => (
          <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr 150px', gap: '15px', padding: '15px 20px', borderBottom: '1px solid #222', alignItems: 'center', fontSize: '13px' }}>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.name}
                {user.premium && <span style={{ padding: '2px 6px', background: '#FFD700', color: '#000', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>👑</span>}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>ID: {user.id}</div>
            </div>
            <div style={{ color: '#888' }}>{user.email}</div>
            <div style={{ color: '#888' }}>{user.joined}</div>
            <div>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                background: user.status === 'active' ? '#4CAF5022' : '#dc354522',
                color: user.status === 'active' ? '#4CAF50' : '#dc3545'
              }}>
                {user.status === 'active' ? '✓ Actif' : '✗ Banni'}
              </span>
            </div>
            <div style={{ fontWeight: '600' }}>{user.coins} 🪙</div>
            <div>
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                background: user.reports > 0 ? '#FF980022' : '#0a0a0a',
                color: user.reports > 0 ? '#FF9800' : '#666'
              }}>
                {user.reports}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={{ padding: '6px 12px', background: '#2196F3', border: 'none', borderRadius: '6px', color: 'white', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                👁️
              </button>
              <button style={{ padding: '6px 12px', background: user.status === 'active' ? '#dc3545' : '#4CAF50', border: 'none', borderRadius: '6px', color: 'white', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                {user.status === 'active' ? '🚫' : '✓'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
