import React from 'react';

export default function Dashboard() {
  const stats = [
    { icon: '👥', label: 'Utilisateurs totaux', value: '12,847', change: '+12%', color: '#4CAF50' },
    { icon: '💰', label: 'Revenus du mois', value: '24,567€', change: '+8%', color: '#FFD700' },
    { icon: '🎮', label: 'Parties jouées', value: '45,231', change: '+15%', color: '#9C27B0' },
    { icon: '💌', label: 'Lettres envoyées', value: '8,934', change: '+23%', color: '#E91E63' }
  ];

  const recentActivity = [
    { time: 'Il y a 2 min', user: 'Sophie_Paris', action: 'S\'est inscrite', type: 'user', icon: '👤' },
    { time: 'Il y a 5 min', user: 'MaxCoeur', action: 'A acheté Premium', type: 'payment', icon: '💳' },
    { time: 'Il y a 8 min', user: 'LoveSeeker', action: 'A gagné 150 pièces (HeroLove Quest)', type: 'game', icon: '🎮' },
    { time: 'Il y a 12 min', user: 'Emma_Lyon', action: 'A signalé un message', type: 'report', icon: '⚠️' },
    { time: 'Il y a 15 min', user: 'Thomas_92', action: 'A rejoint le Salon Romantique', type: 'bar', icon: '🍸' }
  ];

  const topGames = [
    { name: 'HeroLove Quest', plays: 15234, avgCoins: 45, color: '#E91E63' },
    { name: 'Tape Taupe', plays: 12456, avgCoins: 38, color: '#FFD700' },
    { name: 'Pong', plays: 9876, avgCoins: 25, color: '#4CAF50' },
    { name: 'Jeu des Cartes', plays: 8234, avgCoins: 52, color: '#9C27B0' },
    { name: 'Morpion', plays: 5432, avgCoins: 18, color: '#2196F3' }
  ];

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Dashboard</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Vue d'ensemble de votre application</p>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <div style={{ fontSize: '32px' }}>{stat.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '4px 8px', background: `${stat.color}22`, borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: stat.color }}>
                {stat.change}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>vs mois dernier</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent activity */}
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Activité récente
          </h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {recentActivity.map((activity, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', padding: '12px', marginBottom: '8px', background: '#0a0a0a', borderRadius: '10px', border: '1px solid #222' }}>
                <div style={{ fontSize: '24px' }}>{activity.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{activity.user}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{activity.action}</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top games */}
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Jeux les plus populaires
          </h2>
          <div>
            {topGames.map((game, idx) => (
              <div key={idx} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{game.name}</div>
                  <div style={{ fontSize: '14px', color: game.color, fontWeight: '700' }}>{game.plays.toLocaleString()}</div>
                </div>
                <div style={{ height: '8px', background: '#0a0a0a', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(game.plays / topGames[0].plays) * 100}%`, background: game.color, transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                  Moyenne: {game.avgCoins} 🪙 par partie
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
