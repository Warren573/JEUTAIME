import React, { useState, useEffect } from 'react';
import { getTitleFromPoints } from '../../config/gameConfig';
import UserAvatar from '../avatar/UserAvatar';

export default function RankingScreen({ currentUser }) {
  const [rankings, setRankings] = useState([]);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    loadRankings();
  }, [currentUser]);

  const loadRankings = () => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');

    // Filtrer et trier par points
    const sortedUsers = users
      .filter(u => u.pseudo) // Seulement les profils complets
      .map(u => ({
        ...u,
        points: u.points || 0,
        titleInfo: getTitleFromPoints(u.points || 0)
      }))
      .sort((a, b) => b.points - a.points);

    setRankings(sortedUsers);

    // Trouver le rang de l'utilisateur actuel
    const rank = sortedUsers.findIndex(u => u.email === currentUser?.email);
    setMyRank(rank >= 0 ? rank + 1 : null);
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const currentUserTitle = getTitleFromPoints(currentUser?.points || 0);

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: '100px',
      background: 'var(--color-beige-light)'
    }}>
      {/* En-tête style Journal */}
      <div style={{
        background: 'var(--color-cream)',
        borderBottom: '4px double var(--color-brown-dark)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          textAlign: 'center',
          margin: '0 0 var(--spacing-xs) 0',
          color: 'var(--color-brown-dark)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          borderBottom: '2px solid var(--color-gold)',
          paddingBottom: 'var(--spacing-xs)'
        }}>
          🏆 Classement
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--color-brown)',
          margin: 0,
          fontStyle: 'italic'
        }}>
          Les joueurs les plus courtisés
        </p>
      </div>

      <div style={{ padding: '0 var(--spacing-lg)' }}>
        {/* Header avec stats personnelles */}
        <div style={{
          background: 'var(--color-cream)',
          border: '3px solid var(--color-gold)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-lg)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>

        {/* Mes stats */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '10px' }}>Mon Rang</div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>
            {myRank ? getMedalEmoji(myRank) : '—'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
            {currentUserTitle.emoji} {currentUserTitle.title}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>
            {currentUser?.points || 0} points
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {rankings.length >= 3 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '10px',
          marginBottom: '30px'
        }}>
          {/* 2ème place */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
            borderRadius: '15px 15px 0 0',
            padding: '20px 10px',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '5px' }}>🥈</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '3px' }}>
              {rankings[1].pseudo}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {rankings[1].titleInfo.emoji}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#667eea', marginTop: '5px' }}>
              {rankings[1].points} pts
            </div>
          </div>

          {/* 1ère place */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '15px 15px 0 0',
            padding: '20px 10px',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(255,215,0,0.3)'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '5px' }}>🥇</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '3px' }}>
              {rankings[0].pseudo}
            </div>
            <div style={{ fontSize: '16px', color: '#555' }}>
              {rankings[0].titleInfo.emoji} {rankings[0].titleInfo.title}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#667eea', marginTop: '5px' }}>
              {rankings[0].points} pts
            </div>
          </div>

          {/* 3ème place */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #CD7F32, #8B4513)',
            borderRadius: '15px 15px 0 0',
            padding: '20px 10px',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '5px' }}>🥉</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>
              {rankings[2].pseudo}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
              {rankings[2].titleInfo.emoji}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFD700', marginTop: '5px' }}>
              {rankings[2].points} pts
            </div>
          </div>
        </div>
      )}

      {/* Liste complète du classement */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
          Classement Général
        </h2>

        {rankings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            Aucun joueur dans le classement pour le moment
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rankings.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = user.email === currentUser?.email;

              return (
                <div
                  key={user.email}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    background: isCurrentUser
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))'
                      : '#f8f9fa',
                    borderRadius: '12px',
                    border: isCurrentUser ? '2px solid #667eea' : 'none'
                  }}
                >
                  {/* Rang */}
                  <div style={{
                    width: '50px',
                    fontSize: '20px',
                    fontWeight: '700',
                    textAlign: 'center',
                    color: rank <= 3 ? '#667eea' : '#666'
                  }}>
                    {getMedalEmoji(rank)}
                  </div>

                  {/* Avatar */}
                  <UserAvatar user={user} size={50} emoji="😊" />

                  {/* Infos */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '3px' }}>
                      {user.pseudo}
                      {isCurrentUser && (
                        <span style={{
                          marginLeft: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#667eea',
                          background: 'rgba(102, 126, 234, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '8px'
                        }}>
                          Vous
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {user.titleInfo.emoji} {user.titleInfo.title}
                    </div>
                  </div>

                  {/* Points */}
                  <div style={{
                    textAlign: 'right',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#667eea'
                  }}>
                    {user.points} pts
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info sur les points */}
      <div style={{
        marginTop: '25px',
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#333' }}>
          💡 Comment gagner des points ?
        </h3>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
          • Sourire reçu : <strong>+10 pts</strong><br />
          • Match réussi : <strong>+50 pts</strong><br />
          • Lettre reçue : <strong>+15 pts</strong><br />
          • Offrande reçue : <strong>+30 pts</strong><br />
          • Déclaration reçue : <strong>+100 pts</strong><br />
          • Duel gagné : <strong>+100 pts</strong><br />
          • Connexion quotidienne : <strong>+10 pts</strong>
        </div>
      </div>
      </div>
    </div>
  );
}
