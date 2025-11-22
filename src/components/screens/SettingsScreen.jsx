import React, { useState, useEffect } from 'react';
import { getReferralStats, copyReferralCode } from '../../utils/referralSystem';

export default function SettingsScreen({ setShowAdminPanel, currentUser, onLogout, setScreen, setCurrentUser }) {
  const [settingsTab, setSettingsTab] = useState('profile');
  const [referralStats, setReferralStats] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Profile state
  const [profileData, setProfileData] = useState({
    pseudo: currentUser?.pseudo || '',
    bio: currentUser?.bio || '',
    postalCode: currentUser?.postalCode || '',
    city: currentUser?.city || '',
    birthDate: currentUser?.birthDate || '',
    gender: currentUser?.gender || '',
    email: currentUser?.email || '',
    newPassword: '',
    confirmPassword: ''
  });

  // Questions state
  const [questions, setQuestions] = useState({
    question1: currentUser?.question1 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question2: currentUser?.question2 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question3: currentUser?.question3 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' }
  });

  const handleSaveProfile = () => {
    // Validation
    if (profileData.bio.length < 50) {
      setSaveMessage('❌ La bio doit contenir au moins 50 caractères');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setSaveMessage('❌ Les mots de passe ne correspondent pas');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      const updatedUser = {
        ...users[userIndex],
        pseudo: profileData.pseudo,
        bio: profileData.bio,
        postalCode: profileData.postalCode,
        city: profileData.city,
        birthDate: profileData.birthDate,
        gender: profileData.gender
      };

      // Update password if provided
      if (profileData.newPassword) {
        updatedUser.password = profileData.newPassword;
      }

      users[userIndex] = updatedUser;
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      localStorage.setItem('jeutaime_current_user', JSON.stringify(updatedUser));

      // Update current user in parent component
      if (setCurrentUser) {
        setCurrentUser(updatedUser);
      }

      setSaveMessage('✅ Profil mis à jour avec succès !');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleSaveQuestions = () => {
    // Validation
    const allQuestions = [questions.question1, questions.question2, questions.question3];
    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i];
      if (!q.text || !q.answerA || !q.answerB || !q.answerC || !q.correctAnswer) {
        setSaveMessage(`❌ Question ${i + 1} incomplète`);
        setTimeout(() => setSaveMessage(''), 3000);
        return;
      }
    }

    // Save questions
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...questions };
      users[userIndex] = updatedUser;
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      localStorage.setItem('jeutaime_current_user', JSON.stringify(updatedUser));

      if (setCurrentUser) {
        setCurrentUser(updatedUser);
      }

      setSaveMessage('✅ Questions mises à jour avec succès !');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Load referral stats
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

      {/* Message de sauvegarde */}
      {saveMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: saveMessage.includes('✅') ? '#4CAF50' : '#F44336',
          color: 'white',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 10000,
          fontWeight: '600',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <style>{`
            @keyframes slideDown {
              from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
              to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
          `}</style>
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding: '0 var(--spacing-md)' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-xs)',
          marginBottom: 'var(--spacing-lg)',
          justifyContent: 'center'
        }}>
          {[
            { id: 'profile', label: '👤 Profil' },
            { id: 'referral', label: '🎁 Parrainage' },
            { id: 'shop', label: '🛍️ Boutique' },
            { id: 'account', label: '⚙️ Compte' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: settingsTab === tab.id
                  ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                  : 'var(--color-brown)',
                border: settingsTab === tab.id ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
                color: settingsTab === tab.id ? 'var(--color-brown-dark)' : 'var(--color-cream)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all var(--transition-normal)',
                boxShadow: settingsTab === tab.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                minWidth: 'fit-content'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROFIL */}
        {settingsTab === 'profile' && (
          <div>
            {/* Pseudo */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-gold)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-md) 0',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                borderBottom: '2px solid var(--color-gold)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                ✨ Pseudo
              </h3>
              <input
                type="text"
                value={profileData.pseudo}
                onChange={(e) => setProfileData({ ...profileData, pseudo: e.target.value })}
                placeholder="Ton pseudo unique"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  background: 'var(--color-beige-light)',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: 'var(--border-radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Bio obligatoire */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-romantic)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-md) 0',
                fontWeight: '700',
                color: 'var(--color-romantic)',
                borderBottom: '2px solid var(--color-romantic)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                ❓ Bio (Min 50 caractères)
              </h3>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Décris-toi de manière authentique. C'est la première chose que les autres verront..."
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  background: 'var(--color-beige-light)',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: 'var(--border-radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.95rem',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-light)',
                marginTop: 'var(--spacing-xs)'
              }}>
                {profileData.bio.length} / 500 caractères
                <span style={{ color: profileData.bio.length >= 50 ? 'var(--color-friendly)' : 'var(--color-romantic)' }}>
                  {' '}(minimum 50)
                </span>
              </div>
            </div>

            {/* Informations Personnelles */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-brown-light)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-md) 0',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                borderBottom: '2px solid var(--color-gold)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                📍 Informations Personnelles
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Code Postal
                  </label>
                  <input
                    type="text"
                    value={profileData.postalCode}
                    onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                    placeholder="75001"
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige-light)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Ville
                  </label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    placeholder="Paris"
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige-light)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige-light)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Genre
                  </label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige-light)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="">Sélectionnez votre genre</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tes 3 Questions */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-friendly)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-xs) 0',
                fontWeight: '700',
                color: 'var(--color-friendly)',
                borderBottom: '2px solid var(--color-friendly)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                🎯 Tes 3 Questions
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-md)',
                fontStyle: 'italic'
              }}>
                Les autres devront y répondre après un sourire mutuel
              </p>

              {/* Question 1 */}
              <div style={{
                marginBottom: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'var(--color-beige-light)',
                borderRadius: 'var(--border-radius-md)',
                border: '2px solid #667eea'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)', color: '#667eea' }}>
                  Question 1
                </h4>
                <input
                  type="text"
                  placeholder="Ex: Aimes-tu le fromage ?"
                  value={questions.question1.text}
                  onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, text: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="A. Réponse A"
                  value={questions.question1.answerA}
                  onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerA: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="B. Réponse B"
                  value={questions.question1.answerB}
                  onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerB: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="C. Réponse C"
                  value={questions.question1.answerC}
                  onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerC: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <select
                  value={questions.question1.correctAnswer}
                  onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, correctAnswer: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="">Bonne réponse ?</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              {/* Question 2 */}
              <div style={{
                marginBottom: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'var(--color-beige-light)',
                borderRadius: 'var(--border-radius-md)',
                border: '2px solid #764ba2'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)', color: '#764ba2' }}>
                  Question 2
                </h4>
                <input
                  type="text"
                  placeholder="Ex: Préfères-tu la mer ou la montagne ?"
                  value={questions.question2.text}
                  onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, text: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="A. Réponse A"
                  value={questions.question2.answerA}
                  onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerA: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="B. Réponse B"
                  value={questions.question2.answerB}
                  onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerB: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="C. Réponse C"
                  value={questions.question2.answerC}
                  onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerC: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <select
                  value={questions.question2.correctAnswer}
                  onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, correctAnswer: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="">Bonne réponse ?</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              {/* Question 3 */}
              <div style={{
                marginBottom: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'var(--color-beige-light)',
                borderRadius: 'var(--border-radius-md)',
                border: '2px solid #f093fb'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)', color: '#f093fb' }}>
                  Question 3
                </h4>
                <input
                  type="text"
                  placeholder="Ex: Quel est ton super-pouvoir idéal ?"
                  value={questions.question3.text}
                  onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, text: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="A. Réponse A"
                  value={questions.question3.answerA}
                  onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerA: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="B. Réponse B"
                  value={questions.question3.answerB}
                  onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerB: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <input
                  type="text"
                  placeholder="C. Réponse C"
                  value={questions.question3.answerC}
                  onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerC: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                />
                <select
                  value={questions.question3.correctAnswer}
                  onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, correctAnswer: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    background: 'white',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="">Bonne réponse ?</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <button
                onClick={handleSaveQuestions}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: 'var(--border-radius-lg)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                💾 Sauvegarder mes questions
              </button>
            </div>

            {/* Sécurité */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-brown-light)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-md) 0',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                borderBottom: '2px solid var(--color-gold)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                🔒 Sécurité
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Email (non modifiable)
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-light)',
                      fontSize: '0.95rem',
                      opacity: 0.7
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Nouveau mot de passe (laisser vide si inchangé)
                  </label>
                  <input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige-light)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: 'var(--color-beige-light)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bouton Enregistrer */}
            <button
              onClick={handleSaveProfile}
              style={{
                width: '100%',
                padding: 'var(--spacing-lg)',
                background: 'linear-gradient(135deg, var(--color-romantic), #C2185B)',
                border: 'none',
                color: 'white',
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              💾 Enregistrer mon profil
            </button>
          </div>
        )}

        {/* PARRAINAGE */}
        {settingsTab === 'referral' && (
          <div>
            {/* Hero section */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-lg)',
              marginBottom: 'var(--spacing-lg)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>🎁</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 var(--spacing-sm) 0', color: 'white' }}>
                Programme de Parrainage
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                Invite tes amis et gagnez des récompenses ensemble !
              </p>
            </div>

            {/* Mon code de parrainage */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
              border: '2px solid #667eea',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-md) 0',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
              }}>
                <span>🔑</span> Mon code de parrainage
              </h3>

              {referralStats && (
                <>
                  <div style={{
                    background: 'var(--color-beige-light)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-md)',
                    marginBottom: 'var(--spacing-md)',
                    textAlign: 'center',
                    border: '2px solid var(--color-brown-light)'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#667eea',
                      letterSpacing: '2px',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      {referralStats.code}
                    </div>
                    <button
                      onClick={handleCopyReferralCode}
                      style={{
                        padding: 'var(--spacing-sm) var(--spacing-lg)',
                        background: copiedCode ? '#4CAF50' : 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        color: 'white',
                        borderRadius: 'var(--border-radius-md)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      onMouseEnter={(e) => !copiedCode && (e.target.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
                    >
                      {copiedCode ? '✅ Copié !' : '📋 Copier le code'}
                    </button>
                  </div>

                  <div style={{
                    background: 'var(--color-beige-light)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '2px solid var(--color-brown-light)'
                  }}>
                    <h4 style={{
                      fontSize: '0.95rem',
                      margin: '0 0 var(--spacing-sm) 0',
                      fontWeight: '600',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Comment ça marche ?
                    </h4>
                    <ol style={{
                      margin: 0,
                      paddingLeft: 'var(--spacing-lg)',
                      fontSize: '0.85rem',
                      lineHeight: '1.8',
                      color: 'var(--color-text-secondary)'
                    }}>
                      <li>Partage ton code avec tes amis</li>
                      <li>Ils l'entrent lors de leur inscription</li>
                      <li>Tu reçois <strong style={{ color: '#667eea' }}>+100 points</strong> et <strong style={{ color: 'var(--color-gold)' }}>+50 pièces</strong> par filleul</li>
                      <li>Ton filleul reçoit <strong style={{ color: '#667eea' }}>+50 points</strong> et <strong style={{ color: 'var(--color-gold)' }}>+25 pièces</strong> bonus</li>
                      <li>Parraine 5 personnes pour débloquer le badge <strong style={{ color: '#667eea' }}>Influenceur 🌟</strong> (+500 pts)</li>
                    </ol>
                  </div>
                </>
              )}
            </div>

            {/* Mes filleuls */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
              border: '2px solid var(--color-brown-light)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-md) 0',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
              }}>
                <span>👥</span> Mes filleuls ({referralStats?.referrals?.length || 0})
              </h3>

              {referralStats?.referrals && referralStats.referrals.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {referralStats.referrals.map((referral, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'var(--color-beige-light)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--border-radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        border: '2px solid var(--color-brown-light)'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem'
                      }}>
                        😊
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '2px', color: 'var(--color-text-primary)' }}>
                          {referral.pseudo}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                          Inscrit le {new Date(referral.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'white'
                      }}>
                        +100 pts
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-xl)',
                  color: 'var(--color-text-secondary)',
                  background: 'var(--color-beige-light)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-brown-light)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>👤</div>
                  <p style={{ fontSize: '0.95rem', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Tu n'as pas encore de filleuls
                  </p>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>
                    Partage ton code pour commencer à gagner des récompenses !
                  </p>
                </div>
              )}
            </div>

            {/* Si parrain */}
            {referralStats?.referredBy && (
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--spacing-lg)',
                border: '2px solid #4CAF50',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  margin: '0 0 var(--spacing-md) 0',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  color: 'var(--color-text-primary)'
                }}>
                  <span>🎉</span> Mon parrain
                </h3>
                <div style={{
                  background: 'var(--color-beige-light)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  border: '2px solid #4CAF50'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ⭐
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '2px', color: 'var(--color-text-primary)' }}>
                      {referralStats.referredBy.pseudo}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      T'a parrainé le {new Date(referralStats.referredBy.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#4CAF50', marginTop: 'var(--spacing-xs)', fontWeight: '600' }}>
                      Bonus reçu : +50 pts + 25 pièces
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
            <div style={{
              background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-lg)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-brown-dark)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 var(--spacing-xs) 0', fontWeight: '700' }}>
                👑 Premium
              </h3>
              <p style={{ fontSize: '1rem', margin: '0 0 var(--spacing-md) 0', fontWeight: '600' }}>
                19,90€/mois
              </p>
              <ul style={{
                fontSize: '0.9rem',
                margin: '0 0 var(--spacing-md) 0',
                paddingLeft: 'var(--spacing-lg)',
                lineHeight: '1.8'
              }}>
                <li>5 000 pièces offertes chaque mois</li>
                <li>10 conversations privées simultanées</li>
                <li>Photos débloquées instantanément</li>
                <li>Badge Premium visible</li>
                <li>Priorité dans les Salons</li>
              </ul>
              <button style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                background: 'var(--color-brown-dark)',
                border: 'none',
                color: 'var(--color-gold)',
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1rem',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ✨ Activer Premium
              </button>
            </div>

            <h3 style={{
              fontSize: '1.1rem',
              margin: '0 0 var(--spacing-md) 0',
              fontWeight: '700',
              color: 'var(--color-text-primary)'
            }}>
              💰 Packs de pièces
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                border: '2px solid var(--color-brown-light)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>💰</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)', color: 'var(--color-gold)' }}>
                  1 000
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: 'var(--spacing-sm)' }}>
                  pièces
                </div>
                <button style={{
                  width: '100%',
                  padding: 'var(--spacing-xs)',
                  background: 'var(--color-romantic)',
                  border: 'none',
                  color: 'white',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  2,99€
                </button>
              </div>

              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                border: '2px solid var(--color-romantic)',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'var(--color-romantic)',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  +20%
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>💎</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)', color: 'var(--color-gold)' }}>
                  2 500
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: 'var(--spacing-sm)' }}>
                  pièces
                </div>
                <button style={{
                  width: '100%',
                  padding: 'var(--spacing-xs)',
                  background: 'var(--color-romantic)',
                  border: 'none',
                  color: 'white',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  6,99€
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COMPTE */}
        {settingsTab === 'account' && (
          <div>
            {/* Parrainage */}
            <div
              onClick={() => setScreen('referral')}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-md)',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                transition: 'all 0.2s',
                border: '2px solid #66BB6A'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ fontSize: '1.8rem' }}>🤝</span>
                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      margin: '0 0 var(--spacing-xs) 0',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      Parrainage
                    </h3>
                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                      Invitez vos amis et gagnez des pièces
                    </p>
                  </div>
                </div>
                <div style={{ fontSize: '1.3rem', color: 'white' }}>→</div>
              </div>
            </div>

            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-brown-light)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-md) 0',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                borderBottom: '2px solid var(--color-gold)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                ⚙️ Compte
              </h3>

              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  background: 'var(--color-brown)',
                  border: 'none',
                  color: 'white',
                  borderRadius: 'var(--border-radius-lg)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginBottom: 'var(--spacing-sm)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🚪 Se déconnecter
              </button>

              <button style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                background: '#dc3545',
                border: 'none',
                color: 'white',
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🗑️ Supprimer mon compte
              </button>
            </div>

            {/* Admin Panel Access */}
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              border: '2px solid var(--color-friendly)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                margin: '0 0 var(--spacing-xs) 0',
                fontWeight: '700',
                color: 'var(--color-friendly)',
                borderBottom: '2px solid var(--color-friendly)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                🛠️ Développeur
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-md)',
                fontStyle: 'italic'
              }}>
                Accès réservé aux administrateurs et développeurs
              </p>
              <button
                onClick={() => setShowAdminPanel?.(true)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: 'var(--border-radius-lg)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
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
