import React, { useState, useEffect } from 'react';
import { enrichedProfiles, profileBadges } from '../../data/appData';
import QuestionGame from '../matching/QuestionGame';
import { awardPoints, checkAndAwardBadge } from '../../utils/pointsSystem';
import SpellOverlay, { SpellAvatarFilter } from '../spells/SpellOverlay';
import SpellCaster from '../spells/SpellCaster';
import SpellManager from '../spells/SpellManager';
import { getActiveSpells } from '../../config/spellsSystem';
import UserAvatar, { profileAvatars } from '../avatar/UserAvatar';

export default function ProfilesScreen({ currentProfile, setCurrentProfile, adminMode, isAdminAuthenticated, currentUser }) {
  const [viewMode, setViewMode] = useState('discover');
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showQuestionGame, setShowQuestionGame] = useState(false);
  const [mutualSmileUser, setMutualSmileUser] = useState(null);
  const [showSpellCaster, setShowSpellCaster] = useState(false);
  const [showSpellManager, setShowSpellManager] = useState(false);
  const [userActiveSpells, setUserActiveSpells] = useState([]);

  const currentProfileData = enrichedProfiles[currentProfile];

  // Load active spells for current profile
  useEffect(() => {
    if (currentProfileData && currentProfileData.id !== 0) {
      // Get email from enriched profiles (demo data)
      const email = `user${currentProfileData.id}@demo.com`;
      const spells = getActiveSpells(email);
      setUserActiveSpells(spells);
    }
  }, [currentProfile, currentProfileData]);

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

      // Award points for sending smile
      if (currentUser) {
        awardPoints(currentUser.email, 'SMILE_SENT');

        // Check if this is the first smile (badge)
        if (smiles[userId].sentTo.length === 1) {
          checkAndAwardBadge(currentUser.email, 'first_smile');
        }

        // Check if popular badge (received 10 smiles)
        if (smiles[userId].receivedFrom?.length >= 10) {
          checkAndAwardBadge(currentUser.email, 'popular');
        }
      }
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

    // Award points for successful match
    if (currentUser) {
      awardPoints(currentUser.email, 'MATCH_SUCCESS');

      // Check if this is the first match (badge)
      if (matches[userId].length === 1) {
        checkAndAwardBadge(currentUser.email, 'first_match');
      }
    }

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
        {/* Avatar principal */}
        <div style={{ position: 'relative', height: '400px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SpellAvatarFilter
            userEmail={`user${currentProfileData.id}@demo.com`}
            style={{ width: '300px', height: '300px', position: 'relative', zIndex: 1 }}
          >
            <UserAvatar
              avatarConfig={profileAvatars[currentProfileData.id]}
              size={300}
            />
          </SpellAvatarFilter>

          {/* Spell Overlay */}
          {userActiveSpells.length > 0 && (
            <SpellOverlay
              userEmail={`user${currentProfileData.id}@demo.com`}
              size="large"
            />
          )}

          {/* Badge "Avatar" */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            background: 'rgba(0,0,0,0.7)',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            💖 Avatar
          </div>

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

          {/* Photos verrouillées */}
          <div style={{ marginBottom: '20px', background: '#0a0a0a', borderRadius: '12px', padding: '20px', border: '2px dashed #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '24px' }}>🔒</div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0, marginBottom: '4px' }}>Photos verrouillées</h4>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                    Échangez 10 lettres ou passez Premium
                  </p>
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#000',
                cursor: 'pointer'
              }}>
                👑 Premium
              </div>
            </div>

            {/* Galerie floutée */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {currentProfileData.photos.slice(0, 3).map((photo, idx) => (
                <div key={idx} style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                  <img
                    src={photo}
                    alt="Verrouillé"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'blur(30px)',
                      opacity: 0.3
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '32px',
                    zIndex: 1
                  }}>
                    🔒
                  </div>
                </div>
              ))}
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

          {/* Sorts magiques - Boutons */}
          {currentUser && currentProfileData.id !== 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <button
                onClick={() => setShowSpellCaster(true)}
                style={{
                  padding: '15px',
                  background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✨ Lancer un sort
              </button>
              {userActiveSpells.length > 0 && (
                <button
                  onClick={() => setShowSpellManager(true)}
                  style={{
                    padding: '15px',
                    background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {userActiveSpells[0].spellData.icon} Désenvoutement ({userActiveSpells.length})
                </button>
              )}
            </div>
          )}

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

      {/* Spell Caster Modal */}
      {showSpellCaster && currentUser && (
        <SpellCaster
          currentUser={currentUser}
          onClose={() => setShowSpellCaster(false)}
          onSpellCast={() => {
            // Recharger les sorts actifs
            const email = `user${currentProfileData.id}@demo.com`;
            const spells = getActiveSpells(email);
            setUserActiveSpells(spells);
          }}
        />
      )}

      {/* Spell Manager Modal */}
      {showSpellManager && currentUser && (
        <SpellManager
          currentUser={currentUser}
          targetUser={{
            email: `user${currentProfileData.id}@demo.com`,
            pseudo: currentProfileData.name
          }}
          onClose={() => setShowSpellManager(false)}
          onSpellRemoved={() => {
            // Recharger les sorts actifs
            const email = `user${currentProfileData.id}@demo.com`;
            const spells = getActiveSpells(email);
            setUserActiveSpells(spells);
          }}
        />
      )}
    </div>
  );
}
