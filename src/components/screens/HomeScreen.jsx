import React from 'react';
import { receivedOfferings } from '../../data/appData';
import { useAdmin } from '../../contexts/AdminContext';
import { getTitleFromPoints } from '../../config/gameConfig';

export default function HomeScreen({ setScreen, myLetters, joinedBars, setCurrentProfile, setAdminMode, currentUser }) {
  const { adminLogin } = useAdmin();

  const handleAdminTest = () => {
    // Auto-login as admin
    adminLogin('admin', 'admin123');
    // Activate admin mode
    setAdminMode(true);
    // Navigate to admin profile
    setCurrentProfile(0);
    setScreen('profiles');
  };

  // Calculer le rang de l'utilisateur
  const getUserRank = () => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const sortedUsers = users
      .filter(u => u.pseudo)
      .sort((a, b) => (b.points || 0) - (a.points || 0));

    const rank = sortedUsers.findIndex(u => u.email === currentUser?.email);
    return rank >= 0 ? rank + 1 : null;
  };

  const userPoints = currentUser?.points || 0;
  const userTitle = getTitleFromPoints(userPoints);
  const userRank = getUserRank();

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div>
      <h1 style={{ fontSize: '36px', marginBottom: '15px', fontWeight: '600' }}>Bienvenue sur JeuTaime</h1>

      <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '25px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '15px', fontWeight: '500' }}>L'application de rencontres anti-superficielle</h3>
        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#aaa', margin: 0 }}>Découvrez les profils en profondeur. Les photos ne sont révélées qu'après 10 lettres échangées ou avec Premium.</p>
      </div>

      {/* Widget Classement */}
      <div
        onClick={() => {
          setScreen('social');
          // L'onglet classement sera sélectionné automatiquement dans SocialScreen
        }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>🏆</div>
            <h3 style={{ fontSize: '20px', margin: 0, fontWeight: '700', color: 'white' }}>Mon Classement</h3>
          </div>
          <div style={{ fontSize: '20px', color: 'white' }}>→</div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '15px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'white', marginBottom: '10px' }}>
              {userRank ? getMedalEmoji(userRank) : '—'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
              {userTitle.emoji} {userTitle.title}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginBottom: '10px' }}>
              {userPoints} points
            </div>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              display: 'inline-block'
            }}>
              Voir le classement complet
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '25px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
          <div style={{ fontSize: '28px' }}>🎁</div>
          <h3 style={{ fontSize: '20px', margin: 0, fontWeight: '600' }}>Bureau d'Offrandes</h3>
          <span style={{ background: '#E91E63', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginLeft: 'auto' }}>
            {receivedOfferings.length}
          </span>
        </div>

        <div style={{ marginTop: '25px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#aaa', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Historique des 6 derniers mois
          </h4>

          <div style={{ background: '#0a0a0a', borderRadius: '15px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '15px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', padding: '15px', fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
              <div>📅 Date</div>
              <div>🎁 Offrande</div>
              <div>👤 De</div>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {receivedOfferings.map((offering, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '15px', padding: '12px 15px', borderBottom: '1px solid #2a2a2a', fontSize: '13px', alignItems: 'center' }}>
                  <div style={{ color: '#aaa', fontSize: '12px', fontWeight: '500' }}>{offering.date}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{offering.icon}</span>
                    <span style={{ color: offering.color, fontWeight: '600' }}>{offering.type}</span>
                  </div>
                  <div style={{ color: '#E91E63', fontSize: '12px', fontWeight: '600', wordBreak: 'break-word' }}>{offering.donor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '20px 15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ fontSize: '28px' }}>🎯</div>
          <h3 style={{ fontSize: '18px', margin: 0, fontWeight: '500' }}>Démarrage rapide</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setScreen('profiles')} style={{ padding: '20px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '15px', cursor: 'pointer', fontWeight: '600', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>👥</span> Découvrir des profils
          </button>
          <button onClick={() => setScreen('social')} style={{ padding: '20px', background: 'linear-gradient(135deg, #2196F3, #1976D2)', border: 'none', color: 'white', borderRadius: '15px', cursor: 'pointer', fontWeight: '600', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>🍸</span> Explorer les Bars
          </button>
          <button onClick={() => setScreen('letters')} style={{ padding: '20px', background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)', border: 'none', color: 'white', borderRadius: '15px', cursor: 'pointer', fontWeight: '600', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>💌</span> Mes Lettres ({myLetters.length})
          </button>
          <button
            onClick={handleAdminTest}
            style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: '3px solid #FFD700', color: 'white', borderRadius: '15px', cursor: 'pointer', fontWeight: '700', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <span style={{ fontSize: '22px' }}>🛡️</span> Essai Profil Admin
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', background: '#0a0a0a', borderRadius: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '15px', fontWeight: '600' }}>📊 Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px', color: '#aaa' }}>
          <div>Profils vus: 12</div>
          <div>Lettres: 5</div>
          <div>Bars rejoints: {joinedBars.length}</div>
          <div>Badges: 3/8</div>
        </div>
      </div>
    </div>
  );
}
