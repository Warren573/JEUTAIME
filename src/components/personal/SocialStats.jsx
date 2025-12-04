import React from 'react';

export default function SocialStats({ currentUser }) {
  // Calculer les statistiques depuis localStorage ou utiliser des valeurs par défaut
  const stats = getUserStats(currentUser?.email);

  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '25px',
      color: 'white'
    }}>
      <h3 style={{
        fontSize: '1.6rem',
        marginBottom: '20px',
        color: '#667eea',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        📊 Tes Statistiques Sociales
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px'
      }}>
        <StatCard
          icon="💬"
          label="Interactions"
          value={stats.interactions}
          subtitle="cette semaine"
          color="#4CAF50"
        />
        <StatCard
          icon="📖"
          label="Visites Book"
          value={stats.bookViews}
          subtitle="total"
          color="#2196F3"
        />
        <StatCard
          icon="✨"
          label="Bonne Vibes"
          value={stats.goodVibes}
          subtitle="reçues"
          color="#FFD700"
        />
        <StatCard
          icon="🏆"
          label="Salons"
          value={stats.salonsJoined}
          subtitle="rejoints"
          color="#FF6B6B"
        />
        <StatCard
          icon="🎁"
          label="Offrandes"
          value={stats.giftsSent}
          subtitle="envoyées"
          color="#9C27B0"
        />
        <StatCard
          icon="⭐"
          label="Points"
          value={currentUser?.points || 0}
          subtitle="total"
          color="#FFA500"
        />
      </div>

      {/* Bonus quotidien */}
      <div style={{
        marginTop: '20px',
        background: 'linear-gradient(135deg, #667eea20, #764ba220)',
        border: '2px solid #667eea',
        borderRadius: '12px',
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '2rem' }}>🎯</div>
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '1rem' }}>
              Connexion quotidienne
            </h4>
            <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>
              {stats.dailyStreak} jour{stats.dailyStreak > 1 ? 's' : ''} d'affilée
            </p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          padding: '8px 16px',
          borderRadius: '20px',
          color: '#000',
          fontWeight: '700',
          fontSize: '0.9rem'
        }}>
          +10 pts
        </div>
      </div>

      {/* Taux d'interactions positives */}
      <div style={{
        marginTop: '20px',
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '15px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
            Taux d'interactions positives
          </span>
          <span style={{
            color: '#4CAF50',
            fontWeight: '700',
            fontSize: '1.1rem'
          }}>
            {stats.positiveRate}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#333',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${stats.positiveRate}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
      </div>

      {/* Niveau social */}
      <div style={{
        marginTop: '20px',
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '15px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '2.5rem',
          marginBottom: '10px'
        }}>
          {getLevelEmoji(stats.socialLevel)}
        </div>
        <h4 style={{
          margin: '0 0 8px 0',
          color: 'white',
          fontSize: '1.1rem'
        }}>
          Niveau {stats.socialLevel}
        </h4>
        <p style={{
          margin: 0,
          color: '#888',
          fontSize: '0.85rem'
        }}>
          {getLevelTitle(stats.socialLevel)}
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, color }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '15px',
      borderRadius: '12px',
      textAlign: 'center',
      border: `2px solid ${color}20`,
      transition: 'all 0.2s'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        color: color,
        fontWeight: '900',
        fontSize: '1.8rem',
        marginBottom: '5px'
      }}>
        {value}
      </div>
      <div style={{ color: 'white', fontSize: '0.85rem', marginBottom: '3px', fontWeight: '600' }}>
        {label}
      </div>
      <div style={{ color: '#666', fontSize: '0.75rem' }}>
        {subtitle}
      </div>
    </div>
  );
}

// Helper functions
function getUserStats(userEmail) {
  if (!userEmail) {
    return {
      interactions: 0,
      bookViews: 0,
      goodVibes: 0,
      salonsJoined: 0,
      giftsSent: 0,
      giftsReceived: 0,
      dailyStreak: 1,
      positiveRate: 0,
      socialLevel: 1
    };
  }

  // Récupérer les stats depuis localStorage
  const key = `jeutaime_stats_${userEmail}`;
  const savedStats = localStorage.getItem(key);

  if (savedStats) {
    return JSON.parse(savedStats);
  }

  // Stats par défaut
  return {
    interactions: Math.floor(Math.random() * 50) + 10,
    bookViews: Math.floor(Math.random() * 20) + 5,
    goodVibes: Math.floor(Math.random() * 30) + 8,
    salonsJoined: Math.floor(Math.random() * 5) + 1,
    giftsSent: Math.floor(Math.random() * 15) + 3,
    giftsReceived: Math.floor(Math.random() * 20) + 5,
    dailyStreak: Math.floor(Math.random() * 7) + 1,
    positiveRate: Math.floor(Math.random() * 30) + 70,
    socialLevel: Math.floor(Math.random() * 5) + 1
  };
}

function getLevelEmoji(level) {
  if (level >= 10) return '👑';
  if (level >= 7) return '⭐';
  if (level >= 5) return '💎';
  if (level >= 3) return '✨';
  return '🌟';
}

function getLevelTitle(level) {
  if (level >= 10) return 'Légende Sociale';
  if (level >= 7) return 'Expert·e Social·e';
  if (level >= 5) return 'Influenceur·se';
  if (level >= 3) return 'Sociable Confirmé·e';
  return 'Débutant·e Prometteur·se';
}

// Export helper pour mettre à jour les stats
export function updateUserStats(userEmail, updates) {
  if (!userEmail) return;

  const key = `jeutaime_stats_${userEmail}`;
  const currentStats = getUserStats(userEmail);
  const newStats = { ...currentStats, ...updates };

  localStorage.setItem(key, JSON.stringify(newStats));
}
