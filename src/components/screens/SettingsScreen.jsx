import React, { useState } from 'react';

export default function SettingsScreen({ setShowAdminPanel, currentUser, onLogout }) {
  const [settingsTab, setSettingsTab] = useState('profile');

  // Questions state for editing
  const [questions, setQuestions] = useState({
    question1: currentUser?.question1 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question2: currentUser?.question2 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question3: currentUser?.question3 || { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' }
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

  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: '600' }}>⚙️ Paramètres</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
        {['profile', 'shop', 'notifications', 'privacy', 'account'].map((tab) => (
          <button key={tab} onClick={() => setSettingsTab(tab)} style={{ padding: '10px 18px', background: settingsTab === tab ? '#E91E63' : '#1a1a1a', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>
            {tab === 'profile' ? '👤 Profil' : tab === 'shop' ? '🛍️ Boutique' : tab === 'notifications' ? '🔔 Notifs' : tab === 'privacy' ? '🔒 Confidentialité' : '⚙️ Compte'}
          </button>
        ))}
      </div>

      {/* PROFIL */}
      {settingsTab === 'profile' && (
        <div>
          {/* Bio obligatoire */}
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid #E91E63' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '24px' }}>❓</div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '600', color: '#E91E63' }}>Bio (Obligatoire - Min 50 caractères)</h3>
            </div>
            <textarea
              placeholder="Décrivez-vous de manière authentique. C'est la première chose que les autres verront..."
              style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #E91E63', borderRadius: '8px', color: 'white', fontSize: '14px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}>
            </textarea>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>0 / 500 caractères <span style={{ color: '#E91E63' }}>(minimum 50)</span></div>
          </div>

          {/* Informations Personnelles */}
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', fontWeight: '600' }}>Informations Personnelles</h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Code Postal</label>
              <input type="text" placeholder="75001" style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Ville</label>
              <input type="text" placeholder="Paris" style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Date de naissance</label>
              <input type="date" style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Genre</label>
              <select style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px' }}>
                <option>Sélectionnez votre genre</option>
                <option>Homme</option>
                <option>Femme</option>
              </select>
            </div>
          </div>

          {/* Tes 3 Questions */}
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '15px', border: '2px solid #667eea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '24px' }}>🎯</div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '600', color: '#667eea' }}>Tes 3 Questions</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px' }}>Les autres devront y répondre après un sourire mutuel</p>

            {/* Question 1 */}
            <div style={{ marginBottom: '20px', padding: '15px', background: '#0a0a0a', borderRadius: '10px', border: '1px solid #667eea' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#667eea' }}>Question 1</h4>
              <input
                type="text"
                placeholder="Ex: Aimes-tu le fromage ?"
                value={questions.question1.text}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, text: e.target.value } })}
                style={{ width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question1.answerA}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question1.answerB}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question1.answerC}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <select
                value={questions.question1.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question1: { ...questions.question1, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px' }}
              >
                <option value="">Bonne réponse ?</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            {/* Question 2 */}
            <div style={{ marginBottom: '20px', padding: '15px', background: '#0a0a0a', borderRadius: '10px', border: '1px solid #764ba2' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#764ba2' }}>Question 2</h4>
              <input
                type="text"
                placeholder="Ex: Préfères-tu la mer ou la montagne ?"
                value={questions.question2.text}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, text: e.target.value } })}
                style={{ width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question2.answerA}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question2.answerB}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question2.answerC}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <select
                value={questions.question2.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question2: { ...questions.question2, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px' }}
              >
                <option value="">Bonne réponse ?</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            {/* Question 3 */}
            <div style={{ marginBottom: '15px', padding: '15px', background: '#0a0a0a', borderRadius: '10px', border: '1px solid #f093fb' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#f093fb' }}>Question 3</h4>
              <input
                type="text"
                placeholder="Ex: Quel est ton super-pouvoir idéal ?"
                value={questions.question3.text}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, text: e.target.value } })}
                style={{ width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="A. Réponse A"
                value={questions.question3.answerA}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerA: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="B. Réponse B"
                value={questions.question3.answerB}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerB: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <input
                type="text"
                placeholder="C. Réponse C"
                value={questions.question3.answerC}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, answerC: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px', marginBottom: '8px' }}
              />
              <select
                value={questions.question3.correctAnswer}
                onChange={(e) => setQuestions({ ...questions, question3: { ...questions.question3, correctAnswer: e.target.value } })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '13px' }}
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
          <button style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)' }}>
            💾 Enregistrer mon profil
          </button>
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
            <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '2px solid #333', cursor: 'pointer' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px', color: '#FFD700' }}>1 000</div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>pièces</div>
              <button style={{ width: '100%', padding: '8px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>2,99€</button>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '2px solid #E91E63', cursor: 'pointer', position: 'relative' }}>
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
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚧</div>
          <h3 style={{ fontSize: '18px', marginBottom: '10px', fontWeight: '600' }}>Section en construction</h3>
          <p style={{ fontSize: '14px', color: '#888' }}>Cette section sera disponible prochainement</p>
        </div>
      )}

      {/* ACCOUNT */}
      {settingsTab === 'account' && (
        <div>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '15px' }}>
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
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333' }}>
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
  );
}
