import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import Dashboard from './sections/Dashboard';
import Users from './sections/Users';
import Salons from './sections/Salons';
import Games from './sections/Games';
import Moderation from './sections/Moderation';
import Settings from './sections/Settings';

export default function AdminLayout({ onExit }) {
  const { adminUser, adminLogout } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', color: '#667eea' },
    { id: 'users', icon: '👥', label: 'Utilisateurs', color: '#4CAF50' },
    { id: 'salons', icon: '🏊', label: 'Salons', color: '#E91E63' },
    { id: 'games', icon: '🎮', label: 'Jeux', color: '#9C27B0' },
    { id: 'moderation', icon: '🛡️', label: 'Modération', color: '#FF9800' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres', color: '#607D8B' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#0a0a0a' }}>
      {/* Sidebar */}
      <div style={{ position: 'relative', width: sidebarOpen ? '260px' : '80px', background: '#1a1a1a', borderRight: '1px solid #333', transition: 'width 0.3s', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>💕</div>
            {sidebarOpen && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>JeuTaime</h2>
                <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, padding: '20px 10px', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                marginBottom: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
                background: currentSection === item.id ? `${item.color}22` : 'transparent',
                border: currentSection === item.id ? `2px solid ${item.color}` : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '24px' }}>{item.icon}</div>
              {sidebarOpen && (
                <div style={{ fontSize: '14px', fontWeight: '600', color: currentSection === item.id ? item.color : '#ccc' }}>
                  {item.label}
                </div>
              )}
            </div>
          ))}

          {/* Exit button */}
          {onExit && (
            <div
              onClick={onExit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                marginTop: '20px',
                borderRadius: '10px',
                cursor: 'pointer',
                background: 'transparent',
                border: '2px solid #666',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '24px' }}>🔙</div>
              {sidebarOpen && (
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#ccc' }}>
                  Retour à l'app
                </div>
              )}
            </div>
          )}
        </div>

        {/* User info */}
        <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
              A
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>{adminUser?.username}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Super Admin</div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={adminLogout}
              style={{ width: '100%', padding: '10px', background: '#dc3545', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              🚪 Déconnexion
            </button>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ position: 'absolute', top: '20px', right: '-15px', width: '30px', height: '30px', background: '#1a1a1a', border: '2px solid #333', borderRadius: '50%', color: 'white', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentSection === 'dashboard' && <Dashboard />}
        {currentSection === 'users' && <Users />}
        {currentSection === 'salons' && <Salons />}
        {currentSection === 'games' && <Games />}
        {currentSection === 'moderation' && <Moderation />}
        {currentSection === 'settings' && <Settings />}
      </div>
    </div>
  );
}
