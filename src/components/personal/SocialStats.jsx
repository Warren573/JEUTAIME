import React from 'react';
import { getReceivedGifts, getSentGifts } from '../../utils/giftsSystem';
import { loadBarState } from '../../utils/barsSystem';

export default function SocialStats({ currentUser }) {
  // Calculer les statistiques depuis les vraies données
  const stats = calculateRealStats(currentUser);

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

// Helper functions pour calculer les vraies stats
function calculateRealStats(currentUser) {
  if (!currentUser?.email) {
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

  const userEmail = currentUser.email;

  // Calculer les cadeaux envoyés et reçus
  const sentGifts = getSentGifts(userEmail);
  const receivedGifts = getReceivedGifts(userEmail);

  // Calculer les interactions dans les salons
  const barsState = JSON.parse(localStorage.getItem('jeutaime_bars_state') || '{}');
  let barInteractions = 0;
  Object.values(barsState).forEach(bar => {
    if (bar.story) {
      barInteractions += bar.story.filter(p => p.userEmail === userEmail).length;
    }
  });

  // Calculer les salons rejoints
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const user = users.find(u => u.email === userEmail) || currentUser;
  const joinedSalons = user.joinedSalons || [];

  // Récupérer les stats personnalisées sauvegardées
  const customStats = JSON.parse(localStorage.getItem(`jeutaime_custom_stats_${userEmail}`) || '{}');

  // Calculer le daily streak
  const dailyStreak = calculateDailyStreak(userEmail);

  // Calculer les interactions totales (salons + cadeaux envoyés)
  const totalInteractions = barInteractions + sentGifts.length;

  // Calculer le niveau social basé sur l'activité
  const socialLevel = Math.floor((totalInteractions + receivedGifts.length) / 10) + 1;

  // Calculer le taux d'interactions positives (basé sur les cadeaux reçus vs envoyés)
  const positiveRate = sentGifts.length > 0
    ? Math.min(100, Math.round((receivedGifts.length / sentGifts.length) * 100))
    : receivedGifts.length > 0 ? 100 : 75;

  return {
    interactions: totalInteractions,
    bookViews: customStats.bookViews || 0,
    goodVibes: receivedGifts.length,
    salonsJoined: joinedSalons.length,
    giftsSent: sentGifts.length,
    giftsReceived: receivedGifts.length,
    dailyStreak: dailyStreak,
    positiveRate: positiveRate,
    socialLevel: Math.min(socialLevel, 10)
  };
}

function calculateDailyStreak(userEmail) {
  const key = `jeutaime_daily_streak_${userEmail}`;
  const streakData = JSON.parse(localStorage.getItem(key) || '{"streak": 1, "lastVisit": null}');

  const today = new Date().toDateString();
  const lastVisit = streakData.lastVisit;

  if (!lastVisit) {
    // Première visite
    streakData.streak = 1;
    streakData.lastVisit = today;
    localStorage.setItem(key, JSON.stringify(streakData));
    return 1;
  }

  const lastVisitDate = new Date(lastVisit);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate - lastVisitDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Même jour
    return streakData.streak;
  } else if (diffDays === 1) {
    // Jour consécutif
    streakData.streak += 1;
    streakData.lastVisit = today;
    localStorage.setItem(key, JSON.stringify(streakData));
    return streakData.streak;
  } else {
    // Streak cassé
    streakData.streak = 1;
    streakData.lastVisit = today;
    localStorage.setItem(key, JSON.stringify(streakData));
    return 1;
  }
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

// Export helper pour incrémenter les visites de Book
export function incrementBookViews(userEmail) {
  if (!userEmail) return;

  const key = `jeutaime_custom_stats_${userEmail}`;
  const stats = JSON.parse(localStorage.getItem(key) || '{}');
  stats.bookViews = (stats.bookViews || 0) + 1;
  localStorage.setItem(key, JSON.stringify(stats));
}
