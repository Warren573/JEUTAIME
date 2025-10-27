import React, { useState } from 'react';
import AvatarCreator from './AvatarCreator';

export default function ProfileCreation({ email, onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    email,
    pseudo: '',
    birthdate: '',
    age: '',
    gender: '',
    city: '',
    zipCode: '',
    avatar: null,
    avatarConfig: null,
    bio: '',
    job: '',
    interests: '',
    lookingFor: 'friendship', // friendship, relationship, both
    interestedIn: 'all', // men, women, all, other
    children: 'discuss', // yes, no, later, discuss
    physicalDescription: '', // funny description
    // User creates 3 questions with answers
    question1: { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question2: { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    question3: { text: '', answerA: '', answerB: '', answerC: '', correctAnswer: '' },
    // Progression system
    loveXP: 0,
    level: 1,
    title: 'Novice du Cœur',
    items: [],
    // Points and ranking system
    points: 0,
    coins: 100,
    premium: false,
    badges: []
  });
  const [error, setError] = useState('');

  const totalSteps = 7;

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    setError('');

    // Validation par étape
    if (step === 1) {
      if (!profile.pseudo || !profile.birthdate || !profile.gender || !profile.zipCode) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      const age = calculateAge(profile.birthdate);
      if (age < 18 || age > 99) {
        setError('Vous devez avoir entre 18 et 99 ans');
        return;
      }
      // Calculate and save age
      setProfile({ ...profile, age });
    }

    if (step === 2) {
      if (!profile.city) {
        setError('Veuillez indiquer votre ville');
        return;
      }
    }

    if (step === 3) {
      if (!profile.avatar) {
        setError('Créez votre avatar avant de continuer');
        return;
      }
    }

    if (step === 4) {
      if (!profile.bio || profile.bio.length < 50) {
        setError('La bio doit contenir au moins 50 caractères');
        return;
      }
    }

    if (step === 5) {
      if (!profile.job || !profile.interests) {
        setError('Veuillez remplir tous les champs');
        return;
      }
    }

    if (step === 6) {
      if (!profile.physicalDescription) {
        setError('Choisis une description physique');
        return;
      }
    }

    if (step === 7) {
      // Validate all 3 questions are complete
      const q1 = profile.question1;
      const q2 = profile.question2;
      const q3 = profile.question3;

      if (!q1.text || !q1.answerA || !q1.answerB || !q1.answerC || !q1.correctAnswer) {
        setError('Complète la question 1 avec le libellé, les 3 réponses et la bonne réponse');
        return;
      }
      if (!q2.text || !q2.answerA || !q2.answerB || !q2.answerC || !q2.correctAnswer) {
        setError('Complète la question 2 avec le libellé, les 3 réponses et la bonne réponse');
        return;
      }
      if (!q3.text || !q3.answerA || !q3.answerB || !q3.answerC || !q3.correctAnswer) {
        setError('Complète la question 3 avec le libellé, les 3 réponses et la bonne réponse');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Créer le profil
      const newUser = {
        ...profile,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        coins: 100, // Pièces de départ
        premium: false,
        badges: ['verified'],
        stats: {
          letters: 0,
          games: 0,
          bars: 0
        }
      };

      // Sauvegarder l'utilisateur
      const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
      users.push(newUser);
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      localStorage.setItem('jeutaime_current_user', JSON.stringify(newUser));

      onComplete(newUser);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Étape {step}/{totalSteps}</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ background: 'white', height: '100%', width: `${(step / totalSteps) * 100}%`, transition: 'width 0.3s' }} />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '40px' }}>
          {/* Étape 1: Infos de base */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Qui êtes-vous ?</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Commençons par les bases</p>

              {error && (
                <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Pseudo
                </label>
                <input
                  type="text"
                  value={profile.pseudo}
                  onChange={(e) => setProfile({ ...profile, pseudo: e.target.value })}
                  placeholder="Sophie92"
                  style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={profile.birthdate}
                  onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Code postal
                </label>
                <input
                  type="text"
                  value={profile.zipCode}
                  onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                  placeholder="75001"
                  maxLength="5"
                  style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Genre
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setProfile({ ...profile, gender: 'F' })}
                    style={{
                      padding: '14px',
                      background: profile.gender === 'F' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                      border: 'none',
                      borderRadius: '10px',
                      color: profile.gender === 'F' ? 'white' : '#333',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    👩 Femme
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, gender: 'M' })}
                    style={{
                      padding: '14px',
                      background: profile.gender === 'M' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                      border: 'none',
                      borderRadius: '10px',
                      color: profile.gender === 'M' ? 'white' : '#333',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    👨 Homme
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Étape 2: Localisation */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Où habitez-vous ?</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Pour vous proposer des profils près de chez vous</p>

              {error && (
                <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Ville
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder="Paris"
                  style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
                />
              </div>
            </>
          )}

          {/* Étape 3: Avatar */}
          {step === 3 && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Ton avatar</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>Personnalise ton apparence</p>

              {error && (
                <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <AvatarCreator
                gender={profile.gender}
                onSave={(avatarUrl, avatarConfig) => {
                  setProfile({ ...profile, avatar: avatarUrl, avatarConfig });
                  setError('');
                }}
              />

              {profile.avatar && (
                <div style={{ marginTop: '15px', background: '#e8f5e9', border: '1px solid #81c784', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#2e7d32', textAlign: 'center' }}>
                  ✓ Avatar créé ! Tu peux continuer ou le modifier avant de passer à l'étape suivante.
                </div>
              )}
            </>
          )}

          {/* Étape 4: Bio */}
          {step === 4 && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Parlez de vous</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Une bio authentique et détaillée (min. 50 caractères)</p>

              {error && (
                <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Votre bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Décrivez-vous de manière authentique. Parlez de vos passions, ce que vous aimez faire, ce que vous cherchez..."
                  style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px', minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }}
                />
                <div style={{ textAlign: 'right', fontSize: '13px', color: profile.bio.length >= 50 ? '#4CAF50' : '#666', marginTop: '5px' }}>
                  {profile.bio.length} / 500 caractères {profile.bio.length >= 50 ? '✓' : `(minimum 50)`}
                </div>
              </div>
            </>
          )}

          {/* Étape 5: Intérêts */}
          {step === 5 && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Dernières touches</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Pour mieux vous matcher</p>

              {error && (
                <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Métier
                </label>
                <input
                  type="text"
                  value={profile.job}
                  onChange={(e) => setProfile({ ...profile, job: e.target.value })}
                  placeholder="Designer graphique"
                  style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Centres d'intérêt
                </label>
                <input
                  type="text"
                  value={profile.interests}
                  onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                  placeholder="Lecture, voyages, cuisine italienne"
                  style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
                  Vous recherchez...
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => setProfile({ ...profile, lookingFor: 'friendship' })}
                    style={{
                      padding: '14px',
                      background: profile.lookingFor === 'friendship' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                      border: 'none',
                      borderRadius: '10px',
                      color: profile.lookingFor === 'friendship' ? 'white' : '#333',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    🤝 De l'amitié
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, lookingFor: 'relationship' })}
                    style={{
                      padding: '14px',
                      background: profile.lookingFor === 'relationship' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                      border: 'none',
                      borderRadius: '10px',
                      color: profile.lookingFor === 'relationship' ? 'white' : '#333',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    💕 Une relation sérieuse
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, lookingFor: 'both' })}
                    style={{
                      padding: '14px',
                      background: profile.lookingFor === 'both' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                      border: 'none',
                      borderRadius: '10px',
                      color: profile.lookingFor === 'both' ? 'white' : '#333',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    ✨ Les deux, je suis ouvert(e)
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, lookingFor: 'game-duo' })}
                    style={{
                      padding: '14px',
                      background: profile.lookingFor === 'game-duo' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                      border: 'none',
                      borderRadius: '10px',
                      color: profile.lookingFor === 'game-duo' ? 'white' : '#333',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    🎮 Un(e) partenaire de jeu
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, lookingFor: 'flirt' })}
                    style={{
                      padding: '14px',
                      background: profile.lookingFor === 'flirt' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                      border: 'none',
                      borderRadius: '10px',
                      color: profile.lookingFor === 'flirt' ? 'white' : '#333',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    😘 Du flirt
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
                  Intéressé(e) par...
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['men', 'women', 'all', 'other'].map(option => (
                    <button
                      key={option}
                      onClick={() => setProfile({ ...profile, interestedIn: option })}
                      style={{
                        padding: '12px',
                        background: profile.interestedIn === option ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                        border: 'none',
                        borderRadius: '10px',
                        color: profile.interestedIn === option ? 'white' : '#333',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {option === 'men' && '👨 Hommes'}
                      {option === 'women' && '👩 Femmes'}
                      {option === 'all' && '🌈 Tous'}
                      {option === 'other' && '✨ Autre'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
                  Enfants ?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['yes', 'no', 'later', 'discuss'].map(option => (
                    <button
                      key={option}
                      onClick={() => setProfile({ ...profile, children: option })}
                      style={{
                        padding: '12px',
                        background: profile.children === option ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                        border: 'none',
                        borderRadius: '10px',
                        color: profile.children === option ? 'white' : '#333',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {option === 'yes' && '✅ Oui'}
                      {option === 'no' && '❌ Non'}
                      {option === 'later' && '⏳ Plus tard'}
                      {option === 'discuss' && '💬 À discuter'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Étape 6: Description physique amusante */}
          {step === 6 && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Comment te décrire ? 😄</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>Choisis ta description avec humour !</p>

              {error && (
                <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {[
                  { id: 'spaghetti', emoji: '🍝', label: 'Filiforme (comme un spaghetti)' },
                  { id: 'petite', emoji: '🌱', label: 'Ras motte (petite taille)' },
                  { id: 'grande', emoji: '🦒', label: 'Grande gigue (très grand·e)' },
                  { id: 'costaud', emoji: '🌳', label: 'Costaud(e) comme un chêne' },
                  { id: 'mignon', emoji: '🍪', label: 'Mignon·ne comme un cookie' },
                  { id: 'mysterieux', emoji: '🕶️', label: 'Mystérieux·se sous la capuche' },
                  { id: 'athle', emoji: '💪', label: 'Athlétique et dynamique' },
                  { id: 'doux', emoji: '🧸', label: 'Doux·ce comme une peluche' }
                ].map(desc => (
                  <button
                    key={desc.id}
                    onClick={() => setProfile({ ...profile, physicalDescription: desc.id })}
                    style={{
                      padding: '16px',
                      background: profile.physicalDescription === desc.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                      border: 'none',
                      borderRadius: '12px',
                      color: profile.physicalDescription === desc.id ? 'white' : '#333',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{desc.emoji}</span>
                    {desc.label}
                  </button>
                ))}
              </div>

              <div style={{ background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#1976d2' }}>
                💡 Ces descriptions sont là pour rire et briser la glace, pas pour juger !
              </div>
            </>
          )}

          {/* Étape 7: Créer tes 3 Questions */}
          {step === 7 && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Tes 3 Questions 🎯</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>Crée 3 questions que les autres devront répondre pour matcher avec toi</p>

              {error && (
                <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              {/* Question 1 */}
              <div style={{ marginBottom: '25px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #667eea' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#667eea' }}>Question 1</h3>

                <input
                  type="text"
                  placeholder="Ex: Aimes-tu le fromage ?"
                  value={profile.question1.text}
                  onChange={(e) => setProfile({ ...profile, question1: { ...profile.question1, text: e.target.value } })}
                  style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '15px', marginBottom: '12px' }}
                />

                <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="A. Réponse A"
                    value={profile.question1.answerA}
                    onChange={(e) => setProfile({ ...profile, question1: { ...profile.question1, answerA: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="B. Réponse B"
                    value={profile.question1.answerB}
                    onChange={(e) => setProfile({ ...profile, question1: { ...profile.question1, answerB: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="C. Réponse C"
                    value={profile.question1.answerC}
                    onChange={(e) => setProfile({ ...profile, question1: { ...profile.question1, answerC: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                  Quelle est LA bonne réponse ?
                </label>
                <select
                  value={profile.question1.correctAnswer}
                  onChange={(e) => setProfile({ ...profile, question1: { ...profile.question1, correctAnswer: e.target.value } })}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white' }}
                >
                  <option value="">Choisis...</option>
                  <option value="A">A - {profile.question1.answerA || 'Réponse A'}</option>
                  <option value="B">B - {profile.question1.answerB || 'Réponse B'}</option>
                  <option value="C">C - {profile.question1.answerC || 'Réponse C'}</option>
                </select>
              </div>

              {/* Question 2 */}
              <div style={{ marginBottom: '25px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #764ba2' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#764ba2' }}>Question 2</h3>

                <input
                  type="text"
                  placeholder="Ex: Préfères-tu la mer ou la montagne ?"
                  value={profile.question2.text}
                  onChange={(e) => setProfile({ ...profile, question2: { ...profile.question2, text: e.target.value } })}
                  style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '15px', marginBottom: '12px' }}
                />

                <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="A. Réponse A"
                    value={profile.question2.answerA}
                    onChange={(e) => setProfile({ ...profile, question2: { ...profile.question2, answerA: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="B. Réponse B"
                    value={profile.question2.answerB}
                    onChange={(e) => setProfile({ ...profile, question2: { ...profile.question2, answerB: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="C. Réponse C"
                    value={profile.question2.answerC}
                    onChange={(e) => setProfile({ ...profile, question2: { ...profile.question2, answerC: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                  Quelle est LA bonne réponse ?
                </label>
                <select
                  value={profile.question2.correctAnswer}
                  onChange={(e) => setProfile({ ...profile, question2: { ...profile.question2, correctAnswer: e.target.value } })}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white' }}
                >
                  <option value="">Choisis...</option>
                  <option value="A">A - {profile.question2.answerA || 'Réponse A'}</option>
                  <option value="B">B - {profile.question2.answerB || 'Réponse B'}</option>
                  <option value="C">C - {profile.question2.answerC || 'Réponse C'}</option>
                </select>
              </div>

              {/* Question 3 */}
              <div style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #f093fb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#f093fb' }}>Question 3</h3>

                <input
                  type="text"
                  placeholder="Ex: Quel est ton super-pouvoir idéal ?"
                  value={profile.question3.text}
                  onChange={(e) => setProfile({ ...profile, question3: { ...profile.question3, text: e.target.value } })}
                  style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '15px', marginBottom: '12px' }}
                />

                <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="A. Réponse A"
                    value={profile.question3.answerA}
                    onChange={(e) => setProfile({ ...profile, question3: { ...profile.question3, answerA: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="B. Réponse B"
                    value={profile.question3.answerB}
                    onChange={(e) => setProfile({ ...profile, question3: { ...profile.question3, answerB: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="C. Réponse C"
                    value={profile.question3.answerC}
                    onChange={(e) => setProfile({ ...profile, question3: { ...profile.question3, answerC: e.target.value } })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                  Quelle est LA bonne réponse ?
                </label>
                <select
                  value={profile.question3.correctAnswer}
                  onChange={(e) => setProfile({ ...profile, question3: { ...profile.question3, correctAnswer: e.target.value } })}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white' }}
                >
                  <option value="">Choisis...</option>
                  <option value="A">A - {profile.question3.answerA || 'Réponse A'}</option>
                  <option value="B">B - {profile.question3.answerB || 'Réponse B'}</option>
                  <option value="C">C - {profile.question3.answerC || 'Réponse C'}</option>
                </select>
              </div>

              <div style={{ background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#1565c0' }}>
                💡 Après un sourire mutuel, l'autre personne répondra à tes questions. S'il y a au moins 1 bonne réponse de chaque côté, vous pourrez discuter !
              </div>
            </>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{ flex: 1, padding: '16px', background: '#f5f5f5', border: 'none', borderRadius: '12px', color: '#333', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
              >
                Retour
              </button>
            )}
            <button
              onClick={handleNext}
              style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
            >
              {step === totalSteps ? 'Créer mon profil' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
