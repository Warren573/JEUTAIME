import React, { useState } from 'react';
import AvatarCreator from './AvatarCreator';

export default function ProfileCreation({ email, onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    email,
    name: '',
    age: '',
    gender: '',
    city: '',
    zipCode: '',
    avatar: null,
    avatarConfig: null,
    bio: '',
    job: '',
    interests: '',
    lookingFor: 'friendship' // friendship, relationship, both
  });
  const [error, setError] = useState('');

  const totalSteps = 5;

  const handleNext = () => {
    setError('');

    // Validation par étape
    if (step === 1) {
      if (!profile.name || !profile.age || !profile.gender) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      if (profile.age < 18 || profile.age > 99) {
        setError('Vous devez avoir entre 18 et 99 ans');
        return;
      }
    }

    if (step === 2) {
      if (!profile.city || !profile.zipCode) {
        setError('Veuillez remplir tous les champs');
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
                  Prénom
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Sophie"
                  style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Âge
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="28"
                  min="18"
                  max="99"
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

              <div style={{ marginBottom: '20px' }}>
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

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  Code postal
                </label>
                <input
                  type="text"
                  value={profile.zipCode}
                  onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                  placeholder="75001"
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
                </div>
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
