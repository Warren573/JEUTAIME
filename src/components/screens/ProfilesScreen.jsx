import React, { useState, useEffect } from 'react';
import { enrichedProfiles, profileBadges } from '../../data/appData';
import QuestionGame from '../matching/QuestionGame';

export default function ProfilesScreen({ currentProfile, setCurrentProfile, adminMode, isAdminAuthenticated, currentUser }) {
  const [viewMode, setViewMode] = useState('discover');
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showQuestionGame, setShowQuestionGame] = useState(false);
  const [mutualSmileUser, setMutualSmileUser] = useState(null);

  const currentProfileData = enrichedProfiles[currentProfile];

  // Load smiles data from localStorage
  const getSmiles = () => {
    return JSON.parse(localStorage.getItem('jeutaime_smiles') || '{}');
  };

  const saveSmiles = (smiles) => {
    localStorage.setItem('jeutaime_smiles', JSON.stringify(smiles));
  };

  const handleSmile = () => {
    const smiles = getSmiles();
    const userId = currentUser?.email || 'guest';
    const targetId = currentProfileData.id;

    if (!smiles[userId]) {
      smiles[userId] = { sentTo: [], receivedFrom: [], grimaces: [] };
    }

    // Add smile
    if (!smiles[userId].sentTo.includes(targetId)) {
      smiles[userId].sentTo.push(targetId);
    }

    saveSmiles(smiles);

    // FOR DEMO: Since enrichedProfiles are not real users, automatically trigger mutual smile
    // In a real app, this would wait for the other person to smile back

    // Check if target has questions defined (from real users in localStorage)
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const realTargetUser = users.find(u => u.id === targetId);

    if (realTargetUser && realTargetUser.question1?.text) {
      // Real user with questions - show question game
      setMutualSmileUser(realTargetUser);
      setShowQuestionGame(true);
    } else {
      // Demo profile - simulate mutual smile and show game with demo profile
      // Add dummy questions for demo profiles if they don't have them
      const demoUser = {
        ...currentProfileData,
        question1: {
          text: "Aimes-tu le fromage ?",
          answerA: "Oui, j'adore",
          answerB: "Non, je déteste",
          answerC: "Seulement le camembert",
          correctAnswer: "A"
        },
        question2: {
          text: "Préfères-tu la mer ou la montagne ?",
          answerA: "La mer",
          answerB: "La montagne",
          answerC: "Les deux !",
          correctAnswer: "C"
        },
        question3: {
          text: "Pizza ou sushi ?",
          answerA: "Pizza !",
          answerB: "Sushi !",
          answerC: "J'aime les deux",
          correctAnswer: "A"
        }
      };

      setMutualSmileUser(demoUser);
      setShowQuestionGame(true);
    }
  };

  const handleGrimace = () => {
    const smiles = getSmiles();
    const userId = currentUser?.email || 'guest';
    const targetId = currentProfileData.id;

    if (!smiles[userId]) {
      smiles[userId] = { sentTo: [], receivedFrom: [], grimaces: [] };
    }

    // Add grimace
    if (!smiles[userId].grimaces.includes(targetId)) {
      smiles[userId].grimaces.push(targetId);
    }

    saveSmiles(smiles);

    // Move to next profile
    setCurrentProfile((currentProfile + 1) % enrichedProfiles.length);
  };

  const handleMatchSuccess = (matchedUser, userScore, otherScore) => {
    // Save match to localStorage
    const matches = JSON.parse(localStorage.getItem('jeutaime_matches') || '{}');
    const userId = currentUser?.email || 'guest';

    if (!matches[userId]) {
      matches[userId] = [];
    }

    const matchData = {
      userId: matchedUser.id,
      userName: matchedUser.name,
      userScore: userScore,
      otherScore: otherScore,
      date: new Date().toISOString()
    };

    matches[userId].push(matchData);
    localStorage.setItem('jeutaime_matches', JSON.stringify(matches));

    // Close game and move to next profile
    setShowQuestionGame(false);
    setMutualSmileUser(null);
    setCurrentProfile((currentProfile + 1) % enrichedProfiles.length);
  };

  const handleMatchFail = () => {
    // Close game and move to next profile
    setShowQuestionGame(false);
    setMutualSmileUser(null);
    setCurrentProfile((currentProfile + 1) % enrichedProfiles.length);
  };

  const handleAdminEditProfile = () => {
    alert(`Éditer profil: ${currentProfileData.name}`);
  };

  const handleAdminBanUser = () => {
    if (confirm(`Bannir ${currentProfileData.name} ?`)) {
      alert(`${currentProfileData.name} a été banni`);
    }
  };

  const handleAdminDeleteProfile = () => {
    if (confirm(`Supprimer le profil de ${currentProfileData.name} ?`)) {
      alert(`Profil supprimé`);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: '600' }}>👥 Découverte</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
        <button onClick={() => setViewMode('discover')} style={{ padding: '10px 20px', background: viewMode === 'discover' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#1a1a1a', border: 'none', color: 'white', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>
          🔍 Découvrir
        </button>
        <button onClick={() => setViewMode('matches')} style={{ padding: '10px 20px', background: viewMode === 'matches' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#1a1a1a', border: 'none', color: 'white', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>
          💕 Matches (3)
        </button>
        <button onClick={() => setViewMode('likes')} style={{ padding: '10px 20px', background: viewMode === 'likes' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#1a1a1a', border: 'none', color: 'white', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>
          ❤️ Likes reçus (12)
        </button>
      </div>

      {/* Carte profil */}
      <div style={{ background: '#1a1a1a', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
        {/* Photos carousel */}
        <div style={{ position: 'relative', height: '400px', background: '#0a0a0a' }}>
          <img
            src={currentProfileData.photos[selectedPhoto]}
            alt={currentProfileData.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Dots indicateur */}
          {currentProfileData.photos.length > 1 && (
            <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
              {currentProfileData.photos.map((_, idx) => (
                <div key={idx} onClick={() => setSelectedPhoto(idx)} style={{ width: '40px', height: '4px', background: selectedPhoto === idx ? '#fff' : 'rgba(255,255,255,0.3)', borderRadius: '2px', cursor: 'pointer' }} />
              ))}
            </div>
          )}

          {/* Infos overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '60px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{currentProfileData.name}, {currentProfileData.age}</h2>
              <div style={{ display: 'flex', gap: '5px' }}>
                {currentProfileData.badges.map(badgeId => (
                  <div key={badgeId} title={profileBadges[badgeId].name} style={{ fontSize: '18px' }}>
                    {profileBadges[badgeId].emoji}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#ddd', marginBottom: '5px' }}>
              📍 {currentProfileData.city} • {currentProfileData.distance}
            </div>
            <div style={{ fontSize: '13px', color: '#aaa' }}>
              🟢 {currentProfileData.lastActive}
            </div>
          </div>
        </div>

        {/* Infos détaillées */}
        <div style={{ padding: '20px' }}>
          {/* Bio */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>
              {currentProfileData.bio}
            </div>
          </div>

          {/* Compatibilité */}
          <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>💚 Compatibilité</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>{currentProfileData.compatibility}%</span>
            </div>
            <div style={{ background: '#333', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${currentProfileData.compatibility}%`, height: '100%', background: 'linear-gradient(90deg, #4CAF50, #45a049)' }} />
            </div>
          </div>

          {/* Intérêts */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>INTÉRÊTS</div>
            <div style={{ fontSize: '14px' }}>💼 {currentProfileData.job}</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>❤️ {currentProfileData.interests}</div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>✉️</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentProfileData.stats.letters}</div>
              <div style={{ fontSize: '10px', color: '#888' }}>Lettres</div>
            </div>
            <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>🎮</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentProfileData.stats.games}</div>
              <div style={{ fontSize: '10px', color: '#888' }}>Parties</div>
            </div>
            <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>🍸</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentProfileData.stats.bars}</div>
              <div style={{ fontSize: '10px', color: '#888' }}>Bars</div>
            </div>
          </div>

          {/* Actions - Sourire / Grimace */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={handleGrimace}
              style={{
                flex: 1,
                padding: '20px',
                background: 'linear-gradient(135deg, #FF6B6B, #C92A2A)',
                border: 'none',
                color: 'white',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '36px',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              😝
            </button>
            <button
              onClick={handleSmile}
              style={{
                flex: 1,
                padding: '20px',
                background: 'linear-gradient(135deg, #51CF66, #37B24D)',
                border: 'none',
                color: 'white',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '36px',
                boxShadow: '0 4px 15px rgba(81, 207, 102, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              😊
            </button>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12px', fontSize: '13px', color: '#888' }}>
            <div>😝 = Grimace (non)</div>
            <div>😊 = Sourire (oui)</div>
          </div>

          {/* Admin Actions */}
          {adminMode && isAdminAuthenticated && (
            <div style={{ marginTop: '20px', padding: '15px', background: 'linear-gradient(135deg, #667eea22, #764ba222)', border: '2px solid #667eea', borderRadius: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>🛡️</span>
                <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#667eea' }}>Actions Admin</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={handleAdminEditProfile}
                  style={{ padding: '10px', background: '#2196F3', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  ✏️ Éditer
                </button>
                <button
                  onClick={handleAdminBanUser}
                  style={{ padding: '10px', background: '#FF9800', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  🚫 Bannir
                </button>
                <button
                  onClick={handleAdminDeleteProfile}
                  style={{ padding: '10px', background: '#dc3545', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  🗑️ Supprimer
                </button>
                <button
                  onClick={() => alert(`Stats détaillées:\nID: ${currentProfileData.id}\nInscription: 01/09/2024\nDernière connexion: ${currentProfileData.lastActive}\nSignalements: 0`)}
                  style={{ padding: '10px', background: '#9C27B0', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  📊 Stats
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question Game Modal */}
      {showQuestionGame && mutualSmileUser && (
        <QuestionGame
          currentUser={currentUser}
          matchedUser={mutualSmileUser}
          onMatchSuccess={handleMatchSuccess}
          onMatchFail={handleMatchFail}
        />
      )}
    </div>
  );
}
