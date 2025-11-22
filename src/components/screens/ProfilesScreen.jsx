import React, { useState, useEffect } from 'react';
import { profileBadges } from '../../data/appData';
import { getAllUsers } from '../../utils/demoUsers';
import QuestionGame from '../matching/QuestionGame';
import { awardPoints, checkAndAwardBadge } from '../../utils/pointsSystem';
import UserAvatar from '../avatar/UserAvatar';
import Avatar from 'avataaars';
import GiftSelector from '../gifts/GiftSelector';
import MagicEffect from '../effects/MagicEffect';
import { getReceivedGifts } from '../../utils/giftsSystem';
import { getUserPhotoBook, STICKER_CATEGORIES } from '../../utils/photoBookSystem';
import { getTitleFromPoints } from '../../config/gameConfig';

export default function ProfilesScreen({ currentProfile, setCurrentProfile, adminMode, isAdminAuthenticated, currentUser }) {
  const [viewMode, setViewMode] = useState('discover');
  const [selectedPhoto, setSelectedPhoto] = useState(-1); // -1 = afficher avatar, 0+ = afficher photo
  const [showQuestionGame, setShowQuestionGame] = useState(false);
  const [mutualSmileUser, setMutualSmileUser] = useState(null);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [magicEffect, setMagicEffect] = useState(null);

  // Récupérer tous les utilisateurs sauf le currentUser
  const allProfiles = getAllUsers().filter(u => u.email !== currentUser?.email);
  const currentProfileData = allProfiles[currentProfile];

  // Calculer le nombre de lettres échangées avec ce profil
  const getLettersCount = (targetId) => {
    const convos = JSON.parse(localStorage.getItem('jeutaime_conversations') || '{}');
    const userId = currentUser?.email || 'guest';
    const convKey = [userId, targetId].sort().join('_');
    const convo = convos[convKey];
    return convo?.messages?.length || 0;
  };

  // Vérifier si une photo est défloutée - PAR DÉFAUT TOUT EST VERROUILLÉ
  const isPhotoUnblurred = (photoIndex) => {
    // Si c'est l'avatar (index -1), retourner false
    if (photoIndex < 0) return false;

    // TOUJOURS verrouillé par défaut - l'avatar doit s'afficher
    // Les photos ne se débloquent qu'après échange de lettres

    // Si premium, toutes les photos sont débloquées
    if (currentUser?.premium) return true;

    // Calculer le nombre de lettres échangées
    const lettersCount = getLettersCount(currentProfileData.id);

    // Chaque photo nécessite 10 lettres (10, 20, 30)
    const requiredLetters = (photoIndex + 1) * 10;
    return lettersCount >= requiredLetters;
  };

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

    // Automatiquement déclencher le sourire mutuel pour les bots
    // Dans une vraie app avec de vrais utilisateurs, il faudrait attendre que l'autre personne sourie en retour

    // Récupérer le profil cible (maintenant tous les profils sont dans localStorage)
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

      // Vérifier badge heartbreaker (50 grimaces)
      if (smiles[userId].grimaces.length >= 50) {
        checkAndAwardBadge(userId, 'heartbreaker');
      }
    }

    saveSmiles(smiles);

    // Move to next profile
    setCurrentProfile((currentProfile + 1) % allProfiles.length);
  };

  const handleSendGift = () => {
    setShowGiftSelector(true);
  };

  const handleGiftSent = (gift, coinsRemaining) => {
    // Afficher l'effet magique
    setMagicEffect(gift);
    setShowGiftSelector(false);
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
    setCurrentProfile((currentProfile + 1) % allProfiles.length);
  };

  const handleMatchFail = () => {
    // Close game and move to next profile
    setShowQuestionGame(false);
    setMutualSmileUser(null);
    setCurrentProfile((currentProfile + 1) % allProfiles.length);
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
          👥 Découverte
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 0
        }}>
          Explorez et rencontrez de nouvelles personnes
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-xs)',
        marginBottom: 'var(--spacing-lg)',
        padding: '0 var(--spacing-md)',
        justifyContent: 'center'
      }}>
        <button onClick={() => setViewMode('myprofile')} style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: viewMode === 'myprofile' ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'var(--color-brown)',
          border: viewMode === 'myprofile' ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
          color: viewMode === 'myprofile' ? 'var(--color-brown-dark)' : 'var(--color-cream)',
          borderRadius: 'var(--border-radius-md)',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          minWidth: 'fit-content',
          transition: 'all var(--transition-normal)',
          boxShadow: viewMode === 'myprofile' ? 'var(--shadow-md)' : 'var(--shadow-sm)'
        }}>
          👤 Mon Profil
        </button>
        <button onClick={() => setViewMode('discover')} style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: viewMode === 'discover' ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'var(--color-brown)',
          border: viewMode === 'discover' ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
          color: viewMode === 'discover' ? 'var(--color-brown-dark)' : 'var(--color-cream)',
          borderRadius: 'var(--border-radius-md)',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          minWidth: 'fit-content',
          transition: 'all var(--transition-normal)',
          boxShadow: viewMode === 'discover' ? 'var(--shadow-md)' : 'var(--shadow-sm)'
        }}>
          🔍 Découvrir
        </button>
        <button onClick={() => setViewMode('matches')} style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: viewMode === 'matches' ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'var(--color-brown)',
          border: viewMode === 'matches' ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
          color: viewMode === 'matches' ? 'var(--color-brown-dark)' : 'var(--color-cream)',
          borderRadius: 'var(--border-radius-md)',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          minWidth: 'fit-content',
          transition: 'all var(--transition-normal)',
          boxShadow: viewMode === 'matches' ? 'var(--shadow-md)' : 'var(--shadow-sm)'
        }}>
          💕 Matches (3)
        </button>
        <button onClick={() => setViewMode('likes')} style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: viewMode === 'likes' ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'var(--color-brown)',
          border: viewMode === 'likes' ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
          color: viewMode === 'likes' ? 'var(--color-brown-dark)' : 'var(--color-cream)',
          borderRadius: 'var(--border-radius-md)',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          minWidth: 'fit-content',
          transition: 'all var(--transition-normal)',
          boxShadow: viewMode === 'likes' ? 'var(--shadow-md)' : 'var(--shadow-sm)'
        }}>
          ❤️ Likes reçus (12)
        </button>
      </div>

      {/* Vue Mon Profil */}
      {viewMode === 'myprofile' && currentUser && (() => {
        const myPhotoBook = getUserPhotoBook(currentUser.email);
        const myTitle = getTitleFromPoints(currentUser.points || 0);

        return (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: '0',
            overflow: 'hidden',
            marginBottom: '0',
            border: 'none',
            borderBottom: '4px solid var(--color-brown-light)',
            boxShadow: 'none',
            padding: 'var(--spacing-lg)'
          }}>
            {/* Header Mon Profil */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-lg)',
              padding: 'var(--spacing-md)',
              background: 'var(--color-beige-light)',
              borderRadius: 'var(--border-radius-lg)',
              border: '2px solid var(--color-gold)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--color-text-primary)',
                fontWeight: '700'
              }}>
                📸 Aperçu de mon profil
              </h2>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                fontStyle: 'italic'
              }}>
                Voici comment les autres te voient
              </p>
            </div>

            {/* Section Avatar & Infos */}
            <div style={{
              background: 'var(--color-beige-light)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
              border: '2px solid var(--color-brown-light)'
            }}>
              {/* Avatar */}
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'var(--color-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid var(--color-gold)',
                margin: '0 auto var(--spacing-md) auto',
                overflow: 'hidden'
              }}>
                {currentUser.avatarOptions ? (
                  <Avatar
                    style={{ width: '150px', height: '150px' }}
                    avatarStyle="Circle"
                    {...currentUser.avatarOptions}
                  />
                ) : (
                  <div style={{ fontSize: '4rem' }}>👤</div>
                )}
              </div>

              {/* Nom & Titre */}
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  margin: '0 0 var(--spacing-xs) 0',
                  color: 'var(--color-text-primary)',
                  fontWeight: '700'
                }}>
                  {currentUser.pseudo || currentUser.name || 'Utilisateur'}
                </h3>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-gold)',
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {myTitle.icon} {myTitle.name}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  ⭐ {currentUser.points || 0} points
                </div>
              </div>

              {/* Bio */}
              {currentUser.bio && (
                <div style={{
                  background: 'white',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-tan)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    📝 Ma bio
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)',
                    fontStyle: 'italic',
                    lineHeight: '1.5'
                  }}>
                    {currentUser.bio}
                  </div>
                </div>
              )}

              {/* Infos personnelles */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-md)'
              }}>
                {currentUser.city && (
                  <div style={{
                    background: 'white',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '2px solid var(--color-tan)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>📍</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Ville</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
                      {currentUser.city}
                    </div>
                  </div>
                )}
                {currentUser.birthDate && (
                  <div style={{
                    background: 'white',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '2px solid var(--color-tan)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🎂</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Âge</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
                      {new Date().getFullYear() - new Date(currentUser.birthDate).getFullYear()} ans
                    </div>
                  </div>
                )}
                {currentUser.gender && (
                  <div style={{
                    background: 'white',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '2px solid var(--color-tan)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>
                      {currentUser.gender === 'man' ? '👨' : currentUser.gender === 'woman' ? '👩' : '👤'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Genre</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
                      {currentUser.gender === 'man' ? 'Homme' : currentUser.gender === 'woman' ? 'Femme' : 'Autre'}
                    </div>
                  </div>
                )}
                <div style={{
                  background: 'white',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-tan)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>💰</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Pièces</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
                    {currentUser.coins || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Book Photos */}
            <div style={{
              background: 'var(--color-beige-light)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
              border: '2px solid var(--color-brown-light)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                margin: '0 0 var(--spacing-md) 0',
                color: 'var(--color-text-primary)',
                fontWeight: '700',
                borderBottom: '2px solid var(--color-gold)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                📸 Mon Book Photos
              </h3>

              {myPhotoBook.photos.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 'var(--spacing-sm)'
                }}>
                  {myPhotoBook.photos.map((photo) => {
                    const FILTERS = {
                      none: { filter: 'none' },
                      bw: { filter: 'grayscale(100%)' },
                      sepia: { filter: 'sepia(100%)' },
                      vintage: { filter: 'sepia(50%) contrast(120%) brightness(90%)' },
                      warm: { filter: 'saturate(150%) hue-rotate(-10deg)' },
                      cool: { filter: 'saturate(120%) hue-rotate(10deg)' },
                      dramatic: { filter: 'contrast(150%) brightness(90%)' },
                      soft: { filter: 'brightness(110%) saturate(80%)' }
                    };

                    return (
                      <div
                        key={photo.id}
                        style={{
                          position: 'relative',
                          aspectRatio: '1',
                          borderRadius: 'var(--border-radius-md)',
                          overflow: 'hidden',
                          border: '3px solid var(--color-gold)',
                          boxShadow: 'var(--shadow-md)',
                          background: 'var(--color-cream)'
                        }}
                      >
                        {photo.type === 'uploaded' && photo.imageData ? (
                          <img
                            src={photo.imageData}
                            alt={photo.caption || 'Photo'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: FILTERS[photo.filter || 'none'].filter
                            }}
                          />
                        ) : photo.type === 'avatar' && photo.avatarOptions ? (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--color-cream)'
                          }}>
                            <Avatar
                              style={{ width: '100%', height: '100%' }}
                              avatarStyle="Circle"
                              {...photo.avatarOptions}
                            />
                          </div>
                        ) : null}

                        {/* Caption overlay */}
                        {photo.caption && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: 'var(--spacing-xs)',
                            fontSize: '0.7rem',
                            textAlign: 'center'
                          }}>
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-xl)',
                  background: 'white',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-tan)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📸</div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    fontStyle: 'italic'
                  }}>
                    Aucune photo dans ton book pour le moment
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-light)',
                    marginTop: 'var(--spacing-xs)'
                  }}>
                    Va dans "Book Photos" pour en ajouter !
                  </div>
                </div>
              )}
            </div>

            {/* Collection de Stickers */}
            <div style={{
              background: 'var(--color-beige-light)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              border: '2px solid var(--color-brown-light)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                margin: '0 0 var(--spacing-md) 0',
                color: 'var(--color-text-primary)',
                fontWeight: '700',
                borderBottom: '2px solid var(--color-gold)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                ✨ Ma Collection de Stickers
              </h3>

              {myPhotoBook.stickers.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-xs)',
                  justifyContent: 'center'
                }}>
                  {myPhotoBook.stickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      style={{
                        fontSize: '2rem',
                        padding: 'var(--spacing-xs)',
                        background: sticker.favorite ? 'var(--color-gold)' : 'white',
                        borderRadius: 'var(--border-radius-md)',
                        border: sticker.favorite ? '3px solid var(--color-gold-dark)' : '2px solid var(--color-tan)',
                        boxShadow: 'var(--shadow-sm)',
                        position: 'relative'
                      }}
                      title={sticker.favorite ? '⭐ Favori' : ''}
                    >
                      {sticker.emoji}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-xl)',
                  background: 'white',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-tan)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>✨</div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    fontStyle: 'italic'
                  }}>
                    Aucun sticker dans ta collection
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-light)',
                    marginTop: 'var(--spacing-xs)'
                  }}>
                    Va dans "Book Photos" pour en ajouter !
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Carte profil (autres vues) */}
      {viewMode !== 'myprofile' && (
      <div style={{
        background: 'var(--color-cream)',
        borderRadius: '0',
        overflow: 'hidden',
        marginBottom: '0',
        border: 'none',
        borderBottom: '4px solid var(--color-brown-light)',
        boxShadow: 'none'
      }}>
        {/* Avatar ou Photos carousel */}
        <div style={{ position: 'relative', height: '400px', background: 'var(--color-beige-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selectedPhoto === -1 ? (
            // Afficher l'avatar si photo non débloquée
            <div style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: '140px' // Espace pour les infos en bas
            }}>
              {/* AVATAR STYLISÉ AVATAAARS */}
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'var(--color-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid var(--color-gold)',
                margin: '0 auto',
                overflow: 'hidden'
              }}>
                <Avatar
                  style={{ width: '200px', height: '200px' }}
                  avatarStyle="Circle"
                  topType={currentProfile === 0 ? "ShortHairShortFlat" : currentProfile === 1 ? "LongHairStraight" : currentProfile === 2 ? "LongHairBun" : "LongHairCurly"}
                  accessoriesType="Blank"
                  hairColor={currentProfile === 0 ? "Brown" : currentProfile === 1 ? "BrownDark" : currentProfile === 2 ? "Blonde" : "Auburn"}
                  facialHairType="Blank"
                  clotheType={currentProfile === 0 ? "Hoodie" : "BlazerShirt"}
                  eyeType="Happy"
                  eyebrowType="Default"
                  mouthType="Smile"
                  skinColor="Light"
                />
              </div>

              {/* Message photo verrouillée - AU CENTRE */}
              <div style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 'var(--border-radius-md)',
                border: '2px solid var(--color-gold)',
                maxWidth: '280px'
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  fontWeight: '600'
                }}>
                  🔒 Photos verrouillées
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  margin: '4px 0 0 0'
                }}>
                  {currentUser?.premium
                    ? '✨ Débloquée avec Premium'
                    : 'Échangez des lettres pour débloquer'}
                </p>
              </div>
            </div>
          ) : selectedPhoto >= 0 && isPhotoUnblurred(selectedPhoto) ? (
            // Afficher la photo si débloquée
            <>
              <img
                src={currentProfileData.photos[selectedPhoto]}
                alt={currentProfileData.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </>
          ) : (
            // Photo verrouillée - afficher avatar
            <div style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: '140px' // Espace pour les infos en bas
            }}>
              {/* AVATAR STYLISÉ AVATAAARS */}
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'var(--color-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid var(--color-gold)',
                margin: '0 auto',
                overflow: 'hidden'
              }}>
                <Avatar
                  style={{ width: '200px', height: '200px' }}
                  avatarStyle="Circle"
                  topType={currentProfile === 0 ? "ShortHairShortFlat" : currentProfile === 1 ? "LongHairStraight" : currentProfile === 2 ? "LongHairBun" : "LongHairCurly"}
                  accessoriesType="Blank"
                  hairColor={currentProfile === 0 ? "Brown" : currentProfile === 1 ? "BrownDark" : currentProfile === 2 ? "Blonde" : "Auburn"}
                  facialHairType="Blank"
                  clotheType={currentProfile === 0 ? "Hoodie" : "BlazerShirt"}
                  eyeType="Happy"
                  eyebrowType="Default"
                  mouthType="Smile"
                  skinColor="Light"
                />
              </div>

              {/* Message photo spécifique verrouillée */}
              <div style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 'var(--border-radius-md)',
                border: '2px solid var(--color-gold)',
                maxWidth: '280px'
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  fontWeight: '600'
                }}>
                  🔒 Photo {selectedPhoto + 1} verrouillée
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  margin: '4px 0 0 0'
                }}>
                  {currentUser?.premium
                    ? '✨ Débloquée avec Premium'
                    : `${(selectedPhoto + 1) * 10} lettres requises`}
                </p>
                <p style={{
                  fontSize: '0.7rem',
                  color: 'var(--color-text-light)',
                  margin: '4px 0 0 0'
                }}>
                  {getLettersCount(currentProfileData.id)} lettres échangées
                </p>
              </div>
            </div>
          )}

          {/* Infos overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, var(--color-brown-darker))', padding: '60px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: 'var(--color-cream)' }}>{currentProfileData.name}, {currentProfileData.age}</h2>
              <div style={{ display: 'flex', gap: '5px' }}>
                {currentProfileData.badges.map(badgeId => (
                  <div key={badgeId} title={profileBadges[badgeId].name} style={{ fontSize: '18px' }}>
                    {profileBadges[badgeId].emoji}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-cream)', marginBottom: '5px' }}>
              📍 {currentProfileData.city} • {currentProfileData.distance}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-tan)' }}>
              🟢 {currentProfileData.lastActive}
            </div>
          </div>
        </div>

        {/* Infos détaillées */}
        <div style={{ padding: 'var(--spacing-lg)', background: 'var(--color-beige-light)' }}>
          {/* Bio */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: 'var(--color-text-primary)',
              fontStyle: 'italic'
            }}>
              {currentProfileData.bio}
            </div>
          </div>

          {/* Compatibilité */}
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)',
            border: '2px solid var(--color-gold-light)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xs)' }}>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'var(--color-text-primary)'
              }}>💚 Compatibilité</span>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'var(--color-friendly)'
              }}>{currentProfileData.compatibility}%</span>
            </div>
            <div style={{
              background: 'var(--color-tan)',
              borderRadius: 'var(--border-radius-sm)',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${currentProfileData.compatibility}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-friendly), var(--color-friendly-light))'
              }} />
            </div>
          </div>

          {/* Intérêts */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>Intérêts</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>💼 {currentProfileData.job}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-xs)' }}>❤️ {currentProfileData.interests}</div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-sm)',
              textAlign: 'center',
              border: '2px solid var(--color-brown-light)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>✉️</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{currentProfileData.stats.letters}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>Lettres</div>
            </div>
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-sm)',
              textAlign: 'center',
              border: '2px solid var(--color-brown-light)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>🎮</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{currentProfileData.stats.games}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>Parties</div>
            </div>
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-sm)',
              textAlign: 'center',
              border: '2px solid var(--color-brown-light)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>🍸</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{currentProfileData.stats.bars}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>Bars</div>
            </div>
          </div>

          {/* Actions - Sourire / Grimace / Cadeau */}
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>
            <button
              onClick={handleGrimace}
              style={{
                flex: 1,
                padding: 'var(--spacing-lg)',
                background: 'linear-gradient(135deg, var(--color-romantic), var(--color-romantic-light))',
                border: '3px solid var(--color-brown)',
                color: 'white',
                borderRadius: 'var(--border-radius-xl)',
                cursor: 'pointer',
                fontSize: '2.5rem',
                boxShadow: 'var(--shadow-lg)',
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
                padding: 'var(--spacing-lg)',
                background: 'linear-gradient(135deg, var(--color-friendly), var(--color-friendly-light))',
                border: '3px solid var(--color-brown)',
                color: 'white',
                borderRadius: 'var(--border-radius-xl)',
                cursor: 'pointer',
                fontSize: '2.5rem',
                boxShadow: 'var(--shadow-lg)',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              😊
            </button>
          </div>

          {/* Bouton Envoyer un Cadeau Magique */}
          <button
            onClick={handleSendGift}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: '3px solid var(--color-brown)',
              color: '#000',
              borderRadius: 'var(--border-radius-lg)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '700',
              boxShadow: '0 6px 16px rgba(255,215,0,0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,215,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,215,0,0.4)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🎁</span>
            Envoyer un Cadeau Magique
            <span style={{ fontSize: '1.5rem' }}>✨</span>
          </button>

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
      )}

      {/* Question Game Modal */}
      {showQuestionGame && mutualSmileUser && (
        <QuestionGame
          currentUser={currentUser}
          matchedUser={mutualSmileUser}
          onMatchSuccess={handleMatchSuccess}
          onMatchFail={handleMatchFail}
        />
      )}

      {/* Gift Selector Modal */}
      {showGiftSelector && (
        <GiftSelector
          currentUser={currentUser}
          receiverId={currentProfileData.id}
          onClose={() => setShowGiftSelector(false)}
          onGiftSent={handleGiftSent}
        />
      )}

      {/* Magic Effect Animation */}
      {magicEffect && (
        <MagicEffect
          gift={magicEffect}
          onComplete={() => setMagicEffect(null)}
        />
      )}
    </div>
  );
}
