import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAdmin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const success = adminLogin(username, password);
    if (!success) {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔐</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Administration</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>JeuTaime Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              required
            />
          </div>

          {error && (
            <div style={{ background: '#dc3545', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' }}
          >
            Se connecter
          </button>
        </form>

        <div style={{ marginTop: '25px', padding: '15px', background: '#0a0a0a', borderRadius: '10px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', textAlign: 'center', fontWeight: '600' }}>
            🔒 Accès restreint
          </div>
          <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', lineHeight: '1.5' }}>
            Identifiants par défaut: admin / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
