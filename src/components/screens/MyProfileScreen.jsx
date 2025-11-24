import React, { useState, useEffect } from 'react';
import { getTitleFromPoints } from '../../config/gameConfig';
import UserAvatar from '../avatar/UserAvatar';

export default function MyProfileScreen({ currentUser, setScreen, setCurrentUser }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [showPublicPreview, setShowPublicPreview] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form states pour édition
  const [formData, setFormData] = useState({
    pseudo: currentUser?.pseudo || '',
    bio: currentUser?.bio || '',
    ville: currentUser?.ville || '',
    codePostal: currentUser?.codePostal || '',
    dateNaissance: currentUser?.dateNaissance || '',
    genre: currentUser?.genre || '',
    centresInteret: currentUser?.centresInteret || []
  });

  // Calcul des statistiques
  const getStats = () => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const sortedUsers = users
      .filter(u => u.pseudo)
      .sort((a, b) => (b.points || 0) - (a.points || 0));

    const rank = sortedUsers.findIndex(u => u.email === currentUser?.email);
    const userPoints = currentUser?.points || 0;
    const userTitle = getTitleFromPoints(userPoints);

    // Statistiques fictives pour la démo (à remplacer par de vraies données)
    return {
      rank: rank >= 0 ? rank + 1 : null,
      points: userPoints,
      title: userTitle,
      likes_sent: currentUser?.likesSent || 0,
      likes_received: currentUser?.likesReceived || 0,
      matches: currentUser?.matches || 0,
      messages_sent: currentUser?.messagesSent || 0,
      messages_received: currentUser?.messagesReceived || 0,
      profile_views: currentUser?.profileViews || 0,
      success_rate: currentUser?.matches > 0
        ? Math.round((currentUser.matches / (currentUser.likesSent || 1)) * 100)
        : 0
    };
  };

  const stats = getStats();

  // Progression vers le prochain titre
  const getNextTitle = () => {
    const titles = [
      { min: 0, title: 'Nouveau Venu', emoji: '🌱' },
      { min: 100, title: 'Explorateur', emoji: '🔍' },
      { min: 250, title: 'Sociable', emoji: '😊' },
      { min: 500, title: 'Ami Fidèle', emoji: '🤝' },
      { min: 1000, title: 'Populaire', emoji: '⭐' },
      { min: 2000, title: 'Influenceur', emoji: '🌟' },
      { min: 5000, title: 'Légende', emoji: '👑' }
    ];

    const current = titles.findIndex(t => stats.points >= t.min &&
      (titles[titles.indexOf(t) + 1] ? stats.points < titles[titles.indexOf(t) + 1].min : true));

    return {
      current: titles[current],
      next: titles[current + 1] || titles[titles.length - 1],
      progress: titles[current + 1]
        ? ((stats.points - titles[current].min) / (titles[current + 1].min - titles[current].min)) * 100
        : 100
    };
  };

  const progression = getNextTitle();

  // Badges / Achievements
  const achievements = [
    { id: 'first_match', name: 'Premier Match', emoji: '💘', unlocked: stats.matches >= 1, description: 'Obtiens ton premier match' },
    { id: 'social_butterfly', name: 'Papillon Social', emoji: '🦋', unlocked: stats.likes_sent >= 10, description: 'Envoie 10 likes' },
    { id: 'popular', name: 'Populaire', emoji: '⭐', unlocked: stats.likes_received >= 10, description: 'Reçois 10 likes' },
    { id: 'chatterbox', name: 'Bavard', emoji: '💬', unlocked: stats.messages_sent >= 50, description: 'Envoie 50 messages' },
    { id: 'influencer', name: 'Influenceur', emoji: '🌟', unlocked: stats.points >= 2000, description: 'Atteins 2000 points' },
    { id: 'legend', name: 'Légende', emoji: '👑', unlocked: stats.points >= 5000, description: 'Atteins 5000 points' }
  ];

  // Historique d'activité (fictif pour la démo)
  const activityHistory = [
    { type: 'match', name: 'Sophie', date: new Date(Date.now() - 2 * 3600000), icon: '💘' },
    { type: 'like_sent', name: 'Alice', date: new Date(Date.now() - 5 * 3600000), icon: '❤️' },
    { type: 'message', name: 'Marie', date: new Date(Date.now() - 24 * 3600000), icon: '💬' },
    { type: 'achievement', name: 'Badge "Bavard" débloqué', date: new Date(Date.now() - 48 * 3600000), icon: '🏆' }
  ];

  const handleSaveProfile = () => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      localStorage.setItem('jeutaime_current_user', JSON.stringify({ ...currentUser, ...formData }));
      setCurrentUser({ ...currentUser, ...formData });
      setEditMode(false);
      alert('✅ Profil mis à jour avec succès !');
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '80px',
      background: 'var(--color-beige-light)'
    }}>
      {/* En-tête */}
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
          borderBottom: '2px solid var(--color-text-primary)',
          paddingBottom: 'var(--spacing-xs)'
        }}>
          👤 Mon Profil
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 0
        }}>
          Gérez votre profil et suivez vos progrès
        </p>
      </div>

      <div style={{ padding: '0 var(--spacing-md)' }}>
        {/* Carte Profil Principal */}
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '3px solid var(--color-gold)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
            <UserAvatar
              user={currentUser}
              size={100}
              emoji="😊"
            />
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: '1.8rem',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--color-text-primary)',
                fontWeight: '700'
              }}>
                {currentUser?.pseudo || currentUser?.name || 'Utilisateur'}
              </h2>
              <div style={{
                fontSize: '1.1rem',
                color: 'var(--color-gold-dark)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {stats.title.emoji} {stats.title.title}
              </div>
              {stats.rank && (
                <div style={{
                  fontSize: '1rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  {getMedalEmoji(stats.rank)} Classé #{stats.rank}
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
            <button
              onClick={() => setShowPublicPreview(!showPublicPreview)}
              style={{
                flex: 1,
                padding: 'var(--spacing-sm)',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                color: 'white',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              👁️ Aperçu public
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              style={{
                flex: 1,
                padding: 'var(--spacing-sm)',
                background: editMode ? 'var(--color-brown)' : 'linear-gradient(135deg, #E91E63, #C2185B)',
                border: 'none',
                color: 'white',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              {editMode ? '❌ Annuler' : '✏️ Éditer'}
            </button>
          </div>
        </div>

        {/* Aperçu Public */}
        {showPublicPreview && (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            border: '3px solid var(--color-gold)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
              👁️ Aperçu Public - Votre profil vu par les autres
            </h3>
            <div style={{
              background: 'var(--color-beige)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              border: '2px solid var(--color-tan)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                <UserAvatar user={currentUser} size={120} emoji="😊" />
                <h3 style={{ fontSize: '1.5rem', margin: 'var(--spacing-sm) 0', color: 'var(--color-text-primary)' }}>
                  {currentUser?.pseudo}
                </h3>
                <div style={{ fontSize: '1rem', color: 'var(--color-gold-dark)', fontWeight: '600' }}>
                  {stats.title.emoji} {stats.title.title}
                </div>
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                {currentUser?.bio || 'Aucune bio pour le moment...'}
              </div>
            </div>
          </div>
        )}

        {/* Mode Édition */}
        {editMode && (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            border: '2px solid var(--color-brown)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
              ✏️ Éditer mon profil
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <label style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                  Pseudo
                </label>
                <input
                  type="text"
                  value={formData.pseudo}
                  onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    background: 'var(--color-beige)',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    background: 'var(--color-beige)',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '1rem',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Code Postal
                  </label>
                  <input
                    type="text"
                    value={formData.codePostal}
                    onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                style={{
                  padding: 'var(--spacing-md)',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  border: 'none',
                  color: 'white',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                💾 Enregistrer les modifications
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-xs)',
          marginBottom: 'var(--spacing-lg)',
          overflowX: 'auto',
          paddingBottom: 'var(--spacing-xs)'
        }}>
          {[
            { id: 'stats', label: '📊 Statistiques', icon: '📊' },
            { id: 'progression', label: '🎯 Progression', icon: '🎯' },
            { id: 'achievements', label: '🏆 Badges', icon: '🏆' },
            { id: 'activity', label: '📅 Activité', icon: '📅' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                  : 'var(--color-brown)',
                border: activeTab === tab.id ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
                color: activeTab === tab.id ? 'var(--color-brown-dark)' : 'var(--color-cream)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Statistiques Détaillées */}
        {activeTab === 'stats' && (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            border: '2px solid var(--color-brown)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
              📊 Statistiques Détaillées
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
              <div style={{
                background: 'var(--color-beige)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>💘</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-romantic)' }}>
                  {stats.matches}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Matches</div>
              </div>

              <div style={{
                background: 'var(--color-beige)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>❤️</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-romantic)' }}>
                  {stats.likes_sent}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Likes envoyés</div>
              </div>

              <div style={{
                background: 'var(--color-beige)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>💕</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-romantic)' }}>
                  {stats.likes_received}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Likes reçus</div>
              </div>

              <div style={{
                background: 'var(--color-beige)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>💬</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-friendly)' }}>
                  {stats.messages_sent}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Messages envoyés</div>
              </div>

              <div style={{
                background: 'var(--color-beige)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>👁️</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>
                  {stats.profile_views}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Vues du profil</div>
              </div>

              <div style={{
                background: 'var(--color-beige)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>📈</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>
                  {stats.success_rate}%
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Taux de réussite</div>
              </div>
            </div>
          </div>
        )}

        {/* Progression */}
        {activeTab === 'progression' && (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            border: '2px solid var(--color-brown)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
              🎯 Ma Progression
            </h3>

            {/* Titre actuel et suivant */}
            <div style={{
              background: 'var(--color-beige)',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--border-radius-md)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-tan)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem' }}>{progression.current.emoji}</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                    {progression.current.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {progression.current.min} pts
                  </div>
                </div>

                <div style={{ fontSize: '2rem', color: 'var(--color-text-light)' }}>→</div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem' }}>{progression.next.emoji}</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-gold-dark)' }}>
                    {progression.next.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {progression.next.min} pts
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div>
                <div style={{
                  background: 'var(--color-cream)',
                  height: '20px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '2px solid var(--color-brown-light)'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progression.progress}%`,
                    background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-dark))',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'var(--spacing-xs)',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  <span>{stats.points} pts</span>
                  <span>{Math.round(progression.progress)}%</span>
                  <span>{progression.next.min} pts</span>
                </div>
              </div>
            </div>

            {/* Objectifs */}
            <div style={{
              background: 'var(--color-beige)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              border: '2px solid var(--color-tan)'
            }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-primary)' }}>
                🎯 Objectifs à atteindre
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  • Envoyer 5 likes de plus
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  • Obtenir 2 nouveaux matches
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  • Envoyer 20 messages
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  • Gagner {progression.next.min - stats.points} points pour le prochain titre
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements / Badges */}
        {activeTab === 'achievements' && (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            border: '2px solid var(--color-brown)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
              🏆 Mes Badges
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  style={{
                    background: achievement.unlocked ? 'var(--color-beige)' : 'rgba(0,0,0,0.05)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--border-radius-md)',
                    textAlign: 'center',
                    border: achievement.unlocked ? '2px solid var(--color-gold)' : '2px solid var(--color-tan)',
                    opacity: achievement.unlocked ? 1 : 0.5,
                    filter: achievement.unlocked ? 'none' : 'grayscale(1)'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-xs)' }}>
                    {achievement.emoji}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {achievement.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {achievement.description}
                  </div>
                  {achievement.unlocked && (
                    <div style={{
                      marginTop: 'var(--spacing-xs)',
                      fontSize: '0.75rem',
                      color: 'var(--color-gold-dark)',
                      fontWeight: '600'
                    }}>
                      ✅ Débloqué
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique d'activité */}
        {activeTab === 'activity' && (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            border: '2px solid var(--color-brown)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
              📅 Historique d'Activité
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {activityHistory.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--color-beige)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--border-radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    border: '2px solid var(--color-tan)'
                  }}
                >
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {activity.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {formatDate(activity.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
