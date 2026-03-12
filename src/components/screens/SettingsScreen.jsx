import React, { useState, useEffect } from 'react';
import { getReferralStats, copyReferralCode } from '../../utils/referralSystem';
import ScreenHeader from '../common/ScreenHeader';
import SettingsTabButton from '../settings/SettingsTabButton';

export default function SettingsScreen({ setShowAdminPanel, currentUser, onLogout, setScreen, setCurrentUser }) {
  const [settingsTab, setSettingsTab] = useState('profile');
  const [referralStats, setReferralStats] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fonction de diagnostic
  const forceMigration = () => {
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    let migrated = 0;

    users.forEach((user, index) => {
      if (!user.id) {
        const hash = user.email.split('').reduce((acc, char) => {
          return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);
        user.id = Math.abs(hash) + index;
        migrated++;
      }
    });

    localStorage.setItem('jeutaime_users', JSON.stringify(users));

    // Mettre à jour currentUser aussi
    const updatedCurrent = users.find(u => u.email === currentUser.email);
    if (updatedCurrent) {
      localStorage.setItem('jeutaime_current_user', JSON.stringify(updatedCurrent));
    }

    alert(`✅ Migration forcée : ${migrated} utilisateur(s) ont reçu un ID.\n\nL'application va se recharger.`);
    window.location.reload();
  };

  // Profile state for editing
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    postalCode: currentUser?.postalCode || '',
    city: currentUser?.city || '',
    birthDate: currentUser?.birthDate || '',
    gender: currentUser?.gender || '',
    physicalDescription: currentUser?.physicalDescription || '',
    interestedIn: currentUser?.interestedIn || '',
    lookingFor: currentUser?.lookingFor || '',
    children: currentUser?.children || ''
  });

  // Questions state for editing
  const [questions, setQuestions] = useState({
    question1: currentUser?.question1 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question2: currentUser?.question2 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question3: currentUser?.question3 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' }
  });

  const handleSaveProfile = () => {
    // Validate bio length
    if (profileData.bio.length < 50) {
      alert('⚠️ La bio doit contenir au moins 50 caractères !');
      return;
    }

    // Save profile to localStorage
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...profileData };
      users[userIndex] = updatedUser;
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      localStorage.setItem('jeutaime_current_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      alert('✅ Ton profil a été mis à jour !');
    }
  };

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
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ScreenHeader
        icon="⚙️"
        title="Paramètres"
        subtitle="Personnalisez votre expérience"
        onBack={() => setScreen('home')}
      />

      {/* Tabs */}
      <div style={{ padding: '0 var(--spacing-sm)' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-xs)',
          marginBottom: 'var(--spacing-lg)',
          justifyContent: 'center'
        }}>
          {[
            { id: 'profile', icon: '👤', label: 'Profil' },
            { id: 'referral', icon: '🎁', label: 'Parrainage' },
            { id: 'diagnostic', icon: '🔧', label: 'Diagnostic' },
            { id: 'shop', icon: '🛍️', label: 'Boutique' },
            { id: 'notifications', icon: '🔔', label: 'Notifs' },
            { id: 'privacy', icon: '🔒', label: 'Confidentialité' },
            { id: 'account', icon: '⚙️', label: 'Compte' },
          ].map(tab => (
            <SettingsTabButton
              key={tab.id}
              tabId={tab.id}
              activeTab={settingsTab}
              onClick={setSettingsTab}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>

      {/* PROFIL */}
      {settingsTab === 'profile' && (
        <div>
          {/* Bio obligatoire */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid #E91E63', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '24px' }}>✨</div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '600', color: '#E91E63' }}>Bio (Obligatoire - Min 50 caractères)</h3>
            </div>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Décrivez-vous de manière authentique. C'est la première chose que les autres verront..."
              maxLength={500}
              style={{ width: '100%', padding: '12px', background: 'var(--color-beige)', border: `1px solid ${profileData.bio.length >= 50 ? '#4CAF50' : '#E91E63'}`, borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: '12px', color: profileData.bio.length >= 50 ? '#4CAF50' : '#888', marginTop: '8px' }}>
              {profileData.bio.length} / 500 caractères
              <span style={{ color: profileData.bio.length >= 50 ? '#4CAF50' : '#E91E63', fontWeight: '600' }}>
                {profileData.bio.length >= 50 ? ' ✓' : ` (minimum 50)`}
              </span>
            </div>
          </div>

          {/* Informations Personnelles */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid var(--color-gold)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '24px' }}>👤</div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '600', color: 'var(--color-gold-dark)' }}>Informations Personnelles</h3>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px', fontWeight: '600' }}>📛 Nom / Prénom</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Ex: Sophie Martin"
                style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px', fontWeight: '600' }}>📮 Code Postal</label>
              <input
                type="text"
                value={profileData.postalCode}
                onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                placeholder="75001"
                maxLength={5}
                style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px', fontWeight: '600' }}>📍 Ville</label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                placeholder="Paris"
                style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px', fontWeight: '600' }}>🎂 Date de naissance</label>
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                style={{ width: '100%', maxWidth: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px', fontWeight: '600' }}>⚧ Genre</label>
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="">Sélectionnez votre genre</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Non-binaire">Non-binaire</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          {/* Description physique */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid #FF6B9D', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '24px' }}>😄</div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '600', color: '#FF6B9D' }}>Description physique (avec humour)</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
              Comment te décrirais-tu physiquement ? Choisis l'option qui te correspond le mieux !
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                { value: 'filiforme', label: 'Filiforme', emoji: '🍝', desc: 'comme un spaghetti' },
                { value: 'ras-motte', label: 'Ras motte', emoji: '🐭', desc: 'petite taille' },
                { value: 'grande-gigue', label: 'Grande gigue', emoji: '🦒', desc: 'très grand•e' },
                { value: 'beaute-interieure', label: 'Grande beauté intérieure', emoji: '✨', desc: 'ce qui compte vraiment' },
                { value: 'athletique', label: 'Athlétique', emoji: '🏃', desc: 'toujours en mouvement' },
                { value: 'formes-genereuses', label: 'En formes généreuses', emoji: '🍑', desc: 'que de courbes !' },
                { value: 'moyenne', label: 'Moyenne', emoji: '⚖️', desc: 'le juste milieu parfait' },
                { value: 'muscle', label: 'Musclé•e', emoji: '💪', desc: 'ça se voit sous le t-shirt' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setProfileData({ ...profileData, physicalDescription: option.value })}
                  style={{
                    padding: '15px',
                    background: profileData.physicalDescription === option.value
                      ? 'linear-gradient(135deg, #FF6B9D, #C2185B)'
                      : 'var(--color-beige)',
                    border: profileData.physicalDescription === option.value
                      ? '2px solid #FF6B9D'
                      : '2px solid var(--color-brown-light)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    color: profileData.physicalDescription === option.value
                      ? 'white'
                      : 'var(--color-text-primary)'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>{option.emoji}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>{option.label}</div>
                  <div style={{
                    fontSize: '11px',
                    fontStyle: 'italic',
                    opacity: profileData.physicalDescription === option.value ? 0.9 : 0.7
                  }}>
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Préférences de Rencontre */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid #9C27B0', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '24px' }}>💕</div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '600', color: '#9C27B0' }}>Préférences de Rencontre</h3>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px', fontWeight: '600' }}>💑 Intéressé•e par</label>
              <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px', fontStyle: 'italic' }}>Qui cherchez-vous ?</p>
              <select
                value={profileData.interestedIn}
                onChange={(e) => setProfileData({ ...profileData, interestedIn: e.target.value })}
                style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="">Sélectionnez...</option>
                <option value="Femmes">Femmes</option>
                <option value="Hommes">Hommes</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px', fontWeight: '600' }}>🔍 Recherche</label>
              <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px', fontStyle: 'italic' }}>Que recherchez-vous ?</p>
              <select
                value={profileData.lookingFor}
                onChange={(e) => setProfileData({ ...profileData, lookingFor: e.target.value })}
                style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="">Sélectionnez...</option>
                <option value="Relation sérieuse">Relation sérieuse</option>
                <option value="Du Fun">Du Fun</option>
                <option value="Amitiés">Amitiés</option>
                <option value="Advienne que pourra">Advienne que pourra</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px', fontWeight: '600' }}>👶 Enfants</label>
              <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px', fontStyle: 'italic' }}>Votre situation</p>
              <select
                value={profileData.children}
                onChange={(e) => setProfileData({ ...profileData, children: e.target.value })}
                style={{ width: '100%', padding: '10px', background: 'var(--color-beige)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="">Sélectionnez...</option>
                <option value="Je n'ai pas d'enfant">Je n'ai pas d'enfant</option>
                <option value="J'ai des enfants">J'ai des enfants</option>
                <option value="J'en veux un jour">J'en veux un jour</option>
                <option value="J'en ai mais pas assez">J'en ai mais pas assez</option>
                <option value="Je n'en veux pas">Je n'en veux pas</option>
                <option value="Rien n'est certain">Rien n'est certain</option>
              </select>
            </div>
          </div>

          {/* Tes 3 Questions */}
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid #667eea', boxSizing: 'border-box' }}>
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
                style={{ width: '100%', padding: '10px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question1.answerA}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question1.answerB}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question1.answerC}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <select
                value={questions.question1.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
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
                style={{ width: '100%', padding: '10px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question2.answerA}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question2.answerB}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question2.answerC}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <select
                value={questions.question2.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
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
                style={{ width: '100%', padding: '10px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question3.answerA}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question3.answerB}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question3.answerC}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <select
                value={questions.question3.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
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
            style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #4CAF50, #45a049)', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)', transition: 'transform 0.2s' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            💾 Enregistrer mon profil
          </button>
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

      {/* DIAGNOSTIC AVATARS */}
      {settingsTab === 'diagnostic' && (
        <div>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '15px', color: '#00ff00', fontFamily: 'monospace', fontSize: '13px', border: '3px solid #00ff00' }}>
            <h3 style={{ color: '#ffffff', marginTop: 0 }}>🔍 DIAGNOSTIC AVATARS</h3>

            <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #ffff00' }}>
              <strong style={{ color: '#ffff00' }}>👤 UTILISATEUR ACTUEL</strong><br />
              <div style={{ marginTop: '10px' }}>
                Pseudo: {currentUser?.pseudo || 'N/A'}<br />
                Email: {currentUser?.email || 'N/A'}<br />
                <span style={{ fontSize: '16px', color: currentUser?.id ? '#00ff00' : '#ff0000' }}>
                  ID: {currentUser?.id !== undefined ? currentUser.id : '❌ MANQUANT'}
                </span>
              </div>
            </div>

            {(() => {
              const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
              const withoutId = users.filter(u => !u.id).length;
              const withId = users.filter(u => u.id).length;
              const bots = users.filter(u => u.isBot).length;
              const real = users.filter(u => !u.isBot).length;

              return (
                <>
                  <div style={{ background: '#1a3a1a', padding: '15px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #00ff00' }}>
                    <strong>📊 STATISTIQUES</strong><br />
                    <div style={{ marginTop: '10px' }}>
                      Total: {users.length} utilisateurs<br />
                      🤖 Bots: {bots}<br />
                      👤 Réels: {real}<br />
                      ✅ Avec ID: {withId}<br />
                      <span style={{ color: withoutId > 0 ? '#ff0000' : '#00ff00', fontWeight: 'bold' }}>
                        ❌ Sans ID: {withoutId}
                      </span>
                    </div>
                  </div>

                  {withoutId > 0 && (
                    <div style={{ background: '#3a1a1a', padding: '15px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #ff0000' }}>
                      <strong style={{ color: '#ff0000' }}>⚠️ PROBLÈME DÉTECTÉ</strong><br />
                      <div style={{ marginTop: '10px', color: '#ffffff' }}>
                        {withoutId} utilisateur(s) n'ont pas d'ID.<br />
                        Cela cause des avatars identiques.<br /><br />
                        <button
                          onClick={forceMigration}
                          style={{
                            background: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            padding: '14px 20px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            width: '100%',
                            fontFamily: 'inherit'
                          }}
                        >
                          🔧 FORCER LA MIGRATION
                        </button>
                      </div>
                    </div>
                  )}

                  {withoutId === 0 && (
                    <div style={{ background: '#1a3a1a', padding: '15px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #00ff00' }}>
                      <strong style={{ color: '#00ff00' }}>✅ TOUT EST OK</strong><br />
                      <div style={{ marginTop: '10px', color: '#ffffff' }}>
                        Tous les utilisateurs ont un ID unique.<br />
                        Les avatars devraient être différents.
                      </div>
                    </div>
                  )}

                  <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '10px' }}>
                    <strong>👥 PREMIERS UTILISATEURS</strong><br />
                    <div style={{ marginTop: '10px', fontSize: '11px' }}>
                      {users.slice(0, 5).map((u, i) => (
                        <div key={i} style={{
                          marginBottom: '8px',
                          paddingBottom: '8px',
                          borderBottom: i < 4 ? '1px solid #3a3a3a' : 'none',
                          color: u.id ? '#00ff00' : '#ff0000'
                        }}>
                          {i+1}. {u.pseudo} - ID: {u.id !== undefined ? u.id : '❌'}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
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
              <li>Priorité dans les Salons</li>
            </ul>
            <button style={{ width: '100%', padding: '12px', background: '#000', border: 'none', color: '#FFD700', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>✨ Activer Premium</button>
          </div>

          <h3 style={{ fontSize: '18px', margin: '0 0 15px 0', fontWeight: '600' }}>💰 Packs de pièces</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '2px solid var(--color-brown-light)', cursor: 'pointer', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px', color: '#FFD700' }}>1 000</div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>pièces</div>
              <button style={{ width: '100%', padding: '8px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxSizing: 'border-box' }}>2,99€</button>
            </div>
            <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '2px solid #E91E63', cursor: 'pointer', position: 'relative', boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', top: '5px', right: '5px', background: '#E91E63', color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold' }}>+20%</div>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>💎</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px', color: '#FFD700' }}>2 500</div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>pièces</div>
              <button style={{ width: '100%', padding: '8px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxSizing: 'border-box' }}>6,99€</button>
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

          {/* Éditeur d'Avatar */}
          <div
            onClick={() => setScreen('avatar-editor')}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.2s',
              border: '2px solid #8B9FEE'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>👤</span>
                <div>
                  <h3 style={{ fontSize: '16px', margin: '0 0 4px 0', fontWeight: '700', color: 'white' }}>
                    Éditeur d'Avatar
                  </h3>
                  <p style={{ fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                    Créez votre avatar personnalisé modulaire
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '20px', color: 'white' }}>→</div>
            </div>
          </div>

          {/* Démo Effets Visuels */}
          <div
            onClick={() => setScreen('demo-effects')}
            style={{
              background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
              transition: 'transform 0.2s',
              border: '2px solid #BA68C8'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>🎨</span>
                <div>
                  <h3 style={{ fontSize: '16px', margin: '0 0 4px 0', fontWeight: '700', color: 'white' }}>
                    Démo Effets Visuels
                  </h3>
                  <p style={{ fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                    Testez l'EffectEngine et le ThemeEngine
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '20px', color: 'white' }}>→</div>
            </div>
          </div>

          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', marginBottom: '15px', boxSizing: 'border-box' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', fontWeight: '600' }}>Compte</h3>

            <button style={{ width: '100%', padding: '15px', background: '#dc3545', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }}>
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
          <div style={{ background: 'var(--color-cream)', borderRadius: '15px', padding: '20px', border: '2px solid var(--color-brown-light)', boxSizing: 'border-box' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', fontWeight: '600', color: '#667eea' }}>🛠️ Développeur</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
              Accès réservé aux administrateurs et développeurs
            </p>
            <button
              onClick={() => setScreen('avatar-test')}
              style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }}
            >
              🎨 Test Avatars SVG
            </button>
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
