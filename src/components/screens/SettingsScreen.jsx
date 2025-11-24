import React, { useState, useEffect } from 'react';
import { getReferralStats, copyReferralCode } from '../../utils/referralSystem';
import { getTitleFromPoints } from '../../config/gameConfig';
import UserAvatar from '../avatar/UserAvatar';

export default function SettingsScreen({ setShowAdminPanel, currentUser, onLogout, setScreen, setCurrentUser }) {
  const [settingsTab, setSettingsTab] = useState('profile');
  const [profileSubTab, setProfileSubTab] = useState('edit');
  const [referralStats, setReferralStats] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPublicPreview, setShowPublicPreview] = useState(false);

  // Questions state for editing
  const [questions, setQuestions] = useState({
    question1: currentUser?.question1 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question2: currentUser?.question2 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question3: currentUser?.question3 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' }
  });

  // Form states pour édition
  const [formData, setFormData] = useState({
    pseudo: currentUser?.pseudo || '',
    bio: currentUser?.bio || '',
    ville: currentUser?.ville || '',
    codePostal: currentUser?.codePostal || '',
    dateNaissance: currentUser?.dateNaissance || '',
    genre: currentUser?.genre || ''
  });

  const handleSaveQuestions = () => {
    // Save questions to localStorage
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...questions };
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      localStorage.setItem('jeutaime_current_user', JSON.stringify({ ...currentUser, ...questions }));
      alert('✅ Tes questions ont été mises à jour !');
    }
  };

  const handleSaveProfile = () => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      const updatedUser = { ...currentUser, ...formData };
      localStorage.setItem('jeutaime_current_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      alert('✅ Profil mis à jour avec succès !');
    }
  };

  // Calcul des statistiques
  const getStats = () => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const sortedUsers = users
      .filter(u => u.pseudo)
      .sort((a, b) => (b.points || 0) - (a.points || 0));

    const rank = sortedUsers.findIndex(u => u.email === currentUser?.email);
    const userPoints = currentUser?.points || 0;
    const userTitle = getTitleFromPoints(userPoints);

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

  // Load referral stats when tab is opened
  useEffect(() => {
    if (settingsTab === 'referral' && currentUser) {
      const stats = getReferralStats(currentUser.email);
      setReferralStats(stats);
    }
  }, [settingsTab, currentUser]);

  const handleCopyReferralCode = async () => {
    if (referralStats?.code) {
      const success = await copyReferralCode(referralStats.code);
      if (success) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    }
  };

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '80px',
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
          borderBottom: '2px solid var(--color-text-primary)',
          paddingBottom: 'var(--spacing-xs)'
        }}>
          ⚙️ Paramètres
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 0
        }}>
          Personnalisez votre expérience
        </p>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 var(--spacing-sm)' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-xs)',
          marginBottom: 'var(--spacing-lg)',
          justifyContent: 'center'
        }}>
          {['profile', 'referral', 'shop', 'notifications', 'privacy', 'account'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSettingsTab(tab)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: settingsTab === tab
                  ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                  : 'var(--color-brown)',
                border: settingsTab === tab ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
                color: settingsTab === tab ? 'var(--color-brown-dark)' : 'var(--color-cream)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all var(--transition-normal)',
                boxShadow: settingsTab === tab ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                minWidth: 'fit-content'
              }}
            >
              {tab === 'profile' ? '👤 Profil' : tab === 'referral' ? '🎁 Parrainage' : tab === 'shop' ? '🛍️ Boutique' : tab === 'notifications' ? '🔔 Notifs' : tab === 'privacy' ? '🔒 Confidentialité' : '⚙️ Compte'}
            </button>
          ))}
        </div>

      {/* PROFIL */}
      {settingsTab === 'profile' && (
        <div>
          {/* Carte Profil Principal - Style Dating App */}
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '0',
            marginBottom: 'var(--spacing-lg)',
            border: '3px solid var(--color-gold)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            {/* Header avec fond dégradé */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              position: 'relative'
            }}>
              {/* Avatar centré et grand */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                <UserAvatar
                  user={currentUser}
                  size={150}
                  emoji="😊"
                />
              </div>

              {/* Infos utilisateur */}
              <h2 style={{
                fontSize: '2rem',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'white',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {currentUser?.pseudo || currentUser?.name || 'Utilisateur'}
              </h2>

              <div style={{
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.95)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {stats.title.emoji} {stats.title.title}
              </div>

              {stats.rank && (
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.9)',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'inline-block',
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  borderRadius: 'var(--border-radius-xl)',
                  backdropFilter: 'blur(10px)'
                }}>
                  {getMedalEmoji(stats.rank)} Classé #{stats.rank}
                </div>
              )}
            </div>

            {/* Stats rapides */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              background: 'var(--color-tan)',
              borderTop: '1px solid var(--color-tan)',
              borderBottom: '1px solid var(--color-tan)'
            }}>
              <div style={{
                background: 'var(--color-beige-light)',
                padding: 'var(--spacing-md)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>
                  {stats.points}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Points</div>
              </div>
              <div style={{
                background: 'var(--color-beige-light)',
                padding: 'var(--spacing-md)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-romantic)' }}>
                  {stats.matches}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Matches</div>
              </div>
              <div style={{
                background: 'var(--color-beige-light)',
                padding: 'var(--spacing-md)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-friendly)' }}>
                  {stats.likes_received}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Likes reçus</div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={{ padding: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
              <button
                onClick={() => setShowPublicPreview(!showPublicPreview)}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-sm)',
                  background: showPublicPreview ? 'var(--color-brown)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                {showPublicPreview ? '❌ Fermer' : '👁️ Aperçu public'}
              </button>
              <button
                onClick={() => setProfileSubTab('edit')}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-sm)',
                  background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                  border: 'none',
                  color: 'white',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                ✏️ Modifier
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
              <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)', textAlign: 'center' }}>
                👁️ Aperçu Public
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                Votre profil vu par les autres
              </p>
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

          {/* Sous-onglets du Profil */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-lg)',
            overflowX: 'auto',
            paddingBottom: 'var(--spacing-xs)'
          }}>
            {[
              { id: 'edit', label: '✏️ Éditer', icon: '✏️' },
              { id: 'photos', label: '📷 Photos', icon: '📷' },
              { id: 'stats', label: '📊 Statistiques', icon: '📊' },
              { id: 'progression', label: '🎯 Progression', icon: '🎯' },
              { id: 'achievements', label: '🏆 Badges', icon: '🏆' },
              { id: 'activity', label: '📅 Activité', icon: '📅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProfileSubTab(tab.id)}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: profileSubTab === tab.id
                    ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                    : 'var(--color-brown)',
                  border: profileSubTab === tab.id ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
                  color: profileSubTab === tab.id ? 'var(--color-brown-dark)' : 'var(--color-cream)',
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

          {/* Éditer le profil */}
          {profileSubTab === 'edit' && (
            <div>
              {/* Bio obligatoire */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid #E91E63' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '24px' }}>❓</div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '600', color: '#E91E63' }}>Bio (Obligatoire - Min 50 caractères)</h3>
            </div>
            <textarea
              placeholder="Décrivez-vous de manière authentique. C'est la première chose que les autres verront..."
              style={{ width: '100%', padding: '12px', background: 'var(--color-beige)', border: '1px solid #E91E63', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}>
            </textarea>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>0 / 500 caractères <span style={{ color: '#E91E63' }}>(minimum 50)</span></div>
          </div>

          {/* Informations Personnelles */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', fontWeight: '600' }}>Informations Personnelles</h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Code Postal</label>
              <input type="text" placeholder="75001" style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Ville</label>
              <input type="text" placeholder="Paris" style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Date de naissance</label>
              <input type="date" style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Genre</label>
              <select style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px' }}>
                <option>Sélectionnez votre genre</option>
                <option>Homme</option>
                <option>Femme</option>
              </select>
            </div>
          </div>

          {/* Tes 3 Questions */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid #667eea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '24px' }}>🎯</div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '600', color: '#667eea' }}>Tes 3 Questions</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px' }}>Les autres devront y répondre après un sourire mutuel</p>

            {/* Question 1 */}
            <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--color-beige)', borderRadius: '10px', border: '1px solid #667eea' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#667eea' }}>Question 1</h4>
              <input
                type="text"
                placeholder="Ex: Aimes-tu le fromage ?"
                value={questions.question1.text}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, text: e.target.value } })}
                style={{ width: '100%', padding: '10px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question1.answerA}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question1.answerB}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question1.answerC}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <select
                value={questions.question1.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px' }}
              >
                <option value="">Bonne réponse ?</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            {/* Question 2 */}
            <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--color-beige)', borderRadius: '10px', border: '1px solid #764ba2' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#764ba2' }}>Question 2</h4>
              <input
                type="text"
                placeholder="Ex: Préfères-tu la mer ou la montagne ?"
                value={questions.question2.text}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, text: e.target.value } })}
                style={{ width: '100%', padding: '10px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question2.answerA}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question2.answerB}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question2.answerC}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <select
                value={questions.question2.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px' }}
              >
                <option value="">Bonne réponse ?</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            {/* Question 3 */}
            <div style={{ marginBottom: '15px', padding: '15px', background: 'var(--color-beige)', borderRadius: '10px', border: '1px solid #f093fb' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#f093fb' }}>Question 3</h4>
              <input
                type="text"
                placeholder="Ex: Quel est ton super-pouvoir idéal ?"
                value={questions.question3.text}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, text: e.target.value } })}
                style={{ width: '100%', padding: '10px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question3.answerA}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question3.answerB}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question3.answerC}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px' }}
              />
              <select
                value={questions.question3.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px' }}
              >
                <option value="">Bonne réponse ?</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <button
              onClick={handleSaveQuestions}
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              💾 Sauvegarder mes questions
            </button>
          </div>

          {/* Bouton Enregistrer */}
          <button
            onClick={handleSaveProfile}
            style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)' }}>
            💾 Enregistrer mon profil
          </button>
            </div>
          )}

          {/* Sous-onglet Photos */}
          {profileSubTab === 'photos' && (
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
              border: '2px solid var(--color-brown)'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
                📷 Mes Photos
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                Gérez votre book de photos. Les autres utilisateurs découvriront vos photos au fil de vos échanges.
              </p>

              {/* Photo principale / Avatar */}
              <div style={{
                background: 'var(--color-beige)',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-md)',
                textAlign: 'center',
                border: '3px solid var(--color-gold)'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
                  Photo de profil principale
                </h4>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  <UserAvatar
                    user={currentUser}
                    size={120}
                    emoji="😊"
                  />
                </div>
                <button
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none',
                    color: 'white',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  📸 Changer ma photo
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: 'var(--spacing-sm)' }}>
                  Cette photo sera visible dès le début
                </p>
              </div>

              {/* Book de photos */}
              <div style={{
                background: 'var(--color-beige)',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-lg)',
                border: '2px solid var(--color-tan)'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-primary)' }}>
                  Mon Book Photos (0/6)
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                  Ces photos se débloquent progressivement après 10 lettres échangées
                </p>

                {/* Grille de photos */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--spacing-md)'
                }}>
                  {[1, 2, 3, 4, 5, 6].map((slot) => (
                    <div
                      key={slot}
                      style={{
                        aspectRatio: '3/4',
                        background: 'var(--color-cream)',
                        borderRadius: 'var(--border-radius-md)',
                        border: '2px dashed var(--color-brown-light)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-brown-light)'}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>📷</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                        Photo {slot}
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: 'var(--spacing-xs)',
                        right: 'var(--spacing-xs)',
                        background: 'var(--color-gold)',
                        color: 'var(--color-brown-dark)',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        +
                      </div>
                    </div>
                  ))}
                </div>

                {/* Infos importantes */}
                <div style={{
                  marginTop: 'var(--spacing-lg)',
                  padding: 'var(--spacing-md)',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid rgba(102, 126, 234, 0.3)'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                    💡 <strong>Comment ça marche ?</strong>
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Ajoutez jusqu'à 6 photos dans votre book</li>
                    <li>Les photos se débloquent après 10 lettres échangées avec un match</li>
                    <li>Privilégiez des photos récentes et authentiques</li>
                    <li>Évitez les photos de groupe où on ne vous reconnaît pas</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Sous-onglet Stats */}
          {profileSubTab === 'stats' && (
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

          {/* Sous-onglet Progression */}
          {profileSubTab === 'progression' && (
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

          {/* Sous-onglet Badges */}
          {profileSubTab === 'achievements' && (
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

          {/* Sous-onglet Activité */}
          {profileSubTab === 'activity' && (
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
      )}

      {/* PARRAINAGE */}
      {settingsTab === 'referral' && (
        <div>
          {/* Hero section */}
          <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '25px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎁</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 10px 0', color: 'white' }}>Programme de Parrainage</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
              Invite tes amis et gagnez des récompenses ensemble !
            </p>
          </div>

          {/* Mon code de parrainage */}
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '20px', border: '2px solid #667eea' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 15px 0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔑</span> Mon code de parrainage
            </h3>

            {referralStats && (
              <>
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '10px', marginBottom: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea', letterSpacing: '2px', marginBottom: '10px' }}>
                    {referralStats.code}
                  </div>
                  <button
                    onClick={handleCopyReferralCode}
                    style={{
                      padding: '12px 24px',
                      background: copiedCode ? '#4CAF50' : 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s'
                    }}
                  >
                    {copiedCode ? '✅ Copié !' : '📋 Copier le code'}
                  </button>
                </div>

                <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '14px', margin: '0 0 10px 0', fontWeight: '600', color: '#888' }}>
                    Comment ça marche ?
                  </h4>
                  <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8', color: '#aaa' }}>
                    <li>Partage ton code avec tes amis</li>
                    <li>Ils l'entrent lors de leur inscription</li>
                    <li>Tu reçois <strong style={{ color: '#667eea' }}>+100 points</strong> et <strong style={{ color: '#FFD700' }}>+50 coins</strong> par filleul</li>
                    <li>Ton filleul reçoit <strong style={{ color: '#667eea' }}>+50 points</strong> et <strong style={{ color: '#FFD700' }}>+25 coins</strong> bonus</li>
                    <li>Parraine 5 personnes pour débloquer le badge <strong style={{ color: '#667eea' }}>Influenceur 🌟</strong> (+500 pts)</li>
                  </ol>
                </div>
              </>
            )}
          </div>

          {/* Mes filleuls */}
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 15px 0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👥</span> Mes filleuls ({referralStats?.referrals?.length || 0})
            </h3>

            {referralStats?.referrals && referralStats.referrals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {referralStats.referrals.map((referral, index) => (
                  <div key={index} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      😊
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '2px' }}>{referral.pseudo}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        Inscrit le {new Date(referral.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      +100 pts
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>👤</div>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>Tu n'as pas encore de filleuls</p>
                <p style={{ fontSize: '12px', margin: 0 }}>Partage ton code pour commencer à gagner des récompenses !</p>
              </div>
            )}
          </div>

          {/* Si parrain */}
          {referralStats?.referredBy && (
            <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '2px solid #4CAF50' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 15px 0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎉</span> Mon parrain
              </h3>
              <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  ⭐
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '2px' }}>{referralStats.referredBy.pseudo}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    T'a parrainé le {new Date(referralStats.referredBy.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#4CAF50', marginTop: '5px', fontWeight: '600' }}>
                    Bonus reçu : +50 pts + 25 🪙
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BOUTIQUE */}
      {settingsTab === 'shop' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', padding: '20px', borderRadius: '15px', marginBottom: '20px', color: '#000' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', fontWeight: '700' }}>👑 Premium</h3>
            <p style={{ fontSize: '14px', margin: '0 0 15px 0', fontWeight: '600' }}>19,90€/mois</p>
            <ul style={{ fontSize: '13px', margin: '0 0 15px 0', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>5 000 pièces offertes chaque mois</li>
              <li>10 conversations privées simultanées</li>
              <li>Photos débloquées instantanément</li>
              <li>Badge Premium visible</li>
              <li>Priorité dans les Bars</li>
            </ul>
            <button style={{ width: '100%', padding: '12px', background: '#000', border: 'none', color: '#FFD700', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>✨ Activer Premium</button>
          </div>

          <h3 style={{ fontSize: '18px', margin: '0 0 15px 0', fontWeight: '600' }}>💰 Packs de pièces</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '2px solid var(--color-brown-light)', cursor: 'pointer' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px', color: '#FFD700' }}>1 000</div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>pièces</div>
              <button style={{ width: '100%', padding: '8px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>2,99€</button>
            </div>
            <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '2px solid #E91E63', cursor: 'pointer', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '5px', right: '5px', background: '#E91E63', color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold' }}>+20%</div>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>💎</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px', color: '#FFD700' }}>2 500</div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>pièces</div>
              <button style={{ width: '100%', padding: '8px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>6,99€</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS, PRIVACY - Version simplifiée */}
      {(settingsTab === 'notifications' || settingsTab === 'privacy') && (
        <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚧</div>
          <h3 style={{ fontSize: '18px', marginBottom: '10px', fontWeight: '600' }}>Section en construction</h3>
          <p style={{ fontSize: '14px', color: '#888' }}>Cette section sera disponible prochainement</p>
        </div>
      )}

      {/* ACCOUNT */}
      {settingsTab === 'account' && (
        <div>
          {/* Parrainage */}
          <div
            onClick={() => setScreen('referral')}
            style={{
              background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              transition: 'transform 0.2s',
              border: '2px solid #66BB6A'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>🤝</span>
                <div>
                  <h3 style={{ fontSize: '16px', margin: '0 0 4px 0', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                    Parrainage
                  </h3>
                  <p style={{ fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                    Invitez vos amis et gagnez des pièces
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '20px', color: 'var(--color-text-primary)' }}>→</div>
            </div>
          </div>

          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', fontWeight: '600' }}>Compte</h3>

            <button style={{ width: '100%', padding: '15px', background: '#dc3545', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '10px' }}>
              🗑️ Supprimer mon compte
            </button>

            <button
              onClick={onLogout}
              style={{ width: '100%', padding: '15px', background: '#666', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              🚪 Se déconnecter
            </button>
          </div>

          {/* Admin Panel Access - Hidden section */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', border: '2px solid var(--color-brown-light)' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', fontWeight: '600', color: '#667eea' }}>🛠️ Développeur</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
              Accès réservé aux administrateurs et développeurs
            </p>
            <button
              onClick={() => setShowAdminPanel?.(true)}
              style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
            >
              🔐 Panneau d'administration
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
