import React, { useState, useEffect } from 'react';
import { profileBadges } from '../../data/appData';
import { getAllUsers } from '../../utils/demoUsers';
import Avatar from 'avataaars';
import { getUserPhotoBook } from '../../utils/photoBookSystem';
import { getTitleFromPoints } from '../../config/gameConfig';
import AvatarCreator from '../auth/AvatarCreator';

export default function ProfilesScreen({ currentProfile, setCurrentProfile, adminMode, isAdminAuthenticated, currentUser, setCurrentUser }) {
  const [viewMode, setViewMode] = useState('myprofile');
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);

  // Nettoyer les données admin au montage du composant
  useEffect(() => {
    if (!currentUser) return;

    let dataModified = false;

    // Nettoyer les matches - filtrer l'admin par ID et par nom
    const matches = JSON.parse(localStorage.getItem('jeutaime_matches') || '{}');
    if (matches[currentUser.email]) {
      const originalLength = matches[currentUser.email].length;
      matches[currentUser.email] = matches[currentUser.email].filter(match => {
        // Filtrer par ID
        if (match.userId === 0 || match.userId === '0') return false;
        // Filtrer par nom contenant "Admin"
        if (match.userName && match.userName.toLowerCase().includes('admin')) return false;
        return true;
      });

      if (matches[currentUser.email].length !== originalLength) {
        localStorage.setItem('jeutaime_matches', JSON.stringify(matches));
        dataModified = true;
      }
    }

    // Nettoyer les smiles - supprimer l'admin des sentTo
    const smiles = JSON.parse(localStorage.getItem('jeutaime_smiles') || '{}');
    const allUsers = getAllUsers(); // Récupérer tous les utilisateurs (y compris enrichedProfiles)

    Object.keys(smiles).forEach(userId => {
      // Chercher l'utilisateur dans getAllUsers qui inclut enrichedProfiles
      const user = allUsers.find(u => u.email === userId || u.id?.toString() === userId);

      if (user && (user.id === 0 || user.id === '0' || user.isAdmin || (user.name && user.name.toLowerCase().includes('admin')))) {
        // C'est l'admin, supprimer currentUser de ses sentTo
        if (smiles[userId] && smiles[userId].sentTo) {
          const originalLength = smiles[userId].sentTo.length;
          smiles[userId].sentTo = smiles[userId].sentTo.filter(target =>
            target !== currentUser.email && target !== currentUser.id?.toString()
          );
          if (smiles[userId].sentTo.length !== originalLength) {
            dataModified = true;
          }
        }
      }
    });

    if (dataModified) {
      localStorage.setItem('jeutaime_smiles', JSON.stringify(smiles));
      console.log('🧹 Données admin nettoyées du localStorage');
    }
  }, [currentUser]);

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
          fontSize: '2rem',
          fontWeight: '900',
          textAlign: 'center',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-xs)',
          fontFamily: '"Playfair Display", serif',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          📖 Profils
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Explorez et rencontrez de nouvelles personnes
        </p>
      </div>

      {/* Tabs */}
      {(() => {
        // Calculer les compteurs réels (sans l'admin)
        const matches = JSON.parse(localStorage.getItem('jeutaime_matches') || '{}');
        const allMatches = matches[currentUser?.email] || [];
        const matchCount = allMatches.filter(match => {
          if (match.userId === 0 || match.userId === '0') return false;
          if (match.userName && match.userName.toLowerCase().includes('admin')) return false;
          return true;
        }).length;

        const smiles = JSON.parse(localStorage.getItem('jeutaime_smiles') || '{}');
        const allUsers = getAllUsers();
        let likesCount = 0;
        Object.keys(smiles).forEach(userId => {
          const userData = smiles[userId];
          if (userData.sentTo && userData.sentTo.includes(currentUser?.email || currentUser?.id)) {
            // Trouver l'utilisateur qui a envoyé le smile (chercher dans getAllUsers)
            const sender = allUsers.find(u => u.email === userId || u.id?.toString() === userId);
            // Ne compter que si ce n'est pas l'admin
            if (sender && sender.id !== 0 && sender.id !== '0' && !sender.isAdmin && !(sender.name && sender.name.toLowerCase().includes('admin'))) {
              likesCount++;
            }
          }
        });

        return (
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
              💕 Matches ({matchCount})
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
              ❤️ Likes reçus ({likesCount})
            </button>
          </div>
        );
      })()}

      {/* Vue Matches */}
      {viewMode === 'matches' && currentUser && (() => {
        const matches = JSON.parse(localStorage.getItem('jeutaime_matches') || '{}');
        const allMatches = matches[currentUser.email] || [];
        // Filtrer les matches avec l'admin (id = 0 ou nom contenant "admin")
        const userMatches = allMatches.filter(match => {
          if (match.userId === 0 || match.userId === '0') return false;
          if (match.userName && match.userName.toLowerCase().includes('admin')) return false;
          return true;
        });

        return (
          <div style={{
            padding: 'var(--spacing-lg)',
            paddingBottom: '100px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
              textAlign: 'center',
              fontWeight: '700'
            }}>
              💕 Mes Matches ({userMatches.length})
            </h2>

            {userMatches.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)'
              }}>
                {userMatches.map((match, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--color-cream)',
                      borderRadius: 'var(--border-radius-lg)',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--color-gold)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: 'var(--color-text-primary)'
                      }}>
                        💕 {match.userName}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)'
                      }}>
                        {new Date(match.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-md)',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        flex: 1,
                        background: 'var(--color-beige-light)',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-sm)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                          Votre score
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-gold-dark)' }}>
                          {match.userScore}/3
                        </div>
                      </div>
                      <div style={{
                        flex: 1,
                        background: 'var(--color-beige-light)',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-sm)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                          Leur score
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-gold-dark)' }}>
                          {match.otherScore}/3
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-xl)',
                color: 'var(--color-text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>💔</div>
                <p>Aucun match pour le moment...</p>
                <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                  Envoyez des sourires pour créer des matches !
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Vue Likes reçus */}
      {viewMode === 'likes' && currentUser && (() => {
        const smiles = JSON.parse(localStorage.getItem('jeutaime_smiles') || '{}');
        const receivedSmiles = [];
        const allUsers = getAllUsers();

        // Parcourir tous les utilisateurs pour trouver ceux qui ont envoyé des smiles au currentUser
        Object.keys(smiles).forEach(userId => {
          const userData = smiles[userId];
          if (userData.sentTo && userData.sentTo.includes(currentUser.email || currentUser.id)) {
            // Trouver l'utilisateur qui a envoyé le smile (chercher dans getAllUsers)
            const sender = allUsers.find(u => u.email === userId || u.id?.toString() === userId);
            // Filtrer l'admin (id = 0, isAdmin = true, ou nom contenant "admin")
            if (sender && sender.id !== 0 && sender.id !== '0' && !sender.isAdmin && !(sender.name && sender.name.toLowerCase().includes('admin'))) {
              receivedSmiles.push({
                from: sender.pseudo || sender.name || 'Anonyme',
                avatar: sender.avatarOptions,
                date: new Date() // On pourrait stocker la date réelle dans le futur
              });
            }
          }
        });

        return (
          <div style={{
            padding: 'var(--spacing-lg)',
            paddingBottom: '100px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
              textAlign: 'center',
              fontWeight: '700'
            }}>
              ❤️ Likes reçus ({receivedSmiles.length})
            </h2>

            {receivedSmiles.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 'var(--spacing-md)'
              }}>
                {receivedSmiles.map((smile, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--color-cream)',
                      borderRadius: 'var(--border-radius-lg)',
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                      border: '2px solid var(--color-gold-light)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all var(--transition-normal)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    {smile.avatar ? (
                      <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                        <Avatar
                          style={{ width: '100px', height: '100px' }}
                          avatarStyle='Circle'
                          {...smile.avatar}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto var(--spacing-sm)',
                        borderRadius: '50%',
                        background: 'var(--color-beige-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                      }}>
                        👤
                      </div>
                    )}
                    <div style={{
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      {smile.from}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #ff6b9d, #c9378e)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      ❤️ Like
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-xl)',
                color: 'var(--color-text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>💌</div>
                <p>Aucun like reçu pour le moment...</p>
                <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                  Soyez patient, votre profil est peut-être en train d'être découvert !
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Vue Mon Profil */}
      {viewMode === 'myprofile' && currentUser && (() => {
        const myPhotoBook = getUserPhotoBook(currentUser.email);
        const myTitle = getTitleFromPoints(currentUser.points || 0);
        const myAge = currentUser.birthDate
          ? new Date().getFullYear() - new Date(currentUser.birthDate).getFullYear()
          : null;

        return (
          <div style={{ padding: 'var(--spacing-lg)', paddingBottom: '100px' }}>
            {/* Carte profil style découverte */}
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '3px solid var(--color-gold)'
            }}>
              {/* Avatar avec info overlay */}
              <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, var(--color-beige-light), var(--color-cream))',
                padding: 'var(--spacing-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt="Avatar"
                      style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid var(--color-gold)',
                        boxShadow: 'var(--shadow-md)'
                      }}
                    />
                  ) : currentUser.avatarOptions ? (
                    <div style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '4px solid var(--color-gold)',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      <Avatar
                        style={{ width: '200px', height: '200px' }}
                        avatarStyle='Circle'
                        {...currentUser.avatarOptions}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'var(--color-beige-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '5rem',
                      border: '4px solid var(--color-gold)',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      👤
                    </div>
                  )}

                  {/* Bouton modifier l'avatar */}
                  <button
                    onClick={() => setShowAvatarEditor(true)}
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                      border: '3px solid var(--color-cream)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'all var(--transition-normal)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    ✏️
                  </button>
                </div>

                {/* Info profil */}
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {currentUser.pseudo || currentUser.name || 'Utilisateur'}
                    {myAge && <span style={{ fontSize: '1.25rem', fontWeight: '400' }}>, {myAge} ans</span>}
                  </h2>

                  {/* Titre */}
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                    color: 'var(--color-brown-dark)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    {myTitle.icon} {myTitle.name}
                  </div>

                  {/* Points */}
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--spacing-xs)'
                  }}>
                    ⭐ {currentUser.points || 0} points
                  </div>

                  {/* Bio */}
                  {currentUser.bio && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      fontStyle: 'italic',
                      marginTop: 'var(--spacing-sm)',
                      padding: '0 var(--spacing-md)'
                    }}>
                      "{currentUser.bio}"
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-lg)',
                  marginTop: 'var(--spacing-md)',
                  justifyContent: 'center'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold-dark)' }}>
                      {myPhotoBook.photos.length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Photos</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold-dark)' }}>
                      {currentUser.badges?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Badges</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold-dark)' }}>
                      {currentUser.coins || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Pièces</div>
                  </div>
                </div>
              </div>

              {/* Book Photos */}
              {myPhotoBook.photos.length > 0 && (
                <div style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--color-beige-light)',
                  borderTop: '2px solid var(--color-gold-light)'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-md)',
                    textAlign: 'center'
                  }}>
                    📸 Book Photos
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 'var(--spacing-sm)'
                  }}>
                    {myPhotoBook.photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        style={{
                          aspectRatio: '1',
                          borderRadius: 'var(--border-radius-md)',
                          overflow: 'hidden',
                          border: '2px solid var(--color-gold-light)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-normal)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {photo.imageData ? (
                          <img
                            src={photo.imageData}
                            alt={photo.caption || `Photo ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: photo.filter || 'none'
                            }}
                          />
                        ) : photo.avatarOptions ? (
                          <Avatar
                            style={{ width: '100%', height: '100%' }}
                            avatarStyle='Circle'
                            {...photo.avatarOptions}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collection de Badges */}
              {currentUser.badges && currentUser.badges.length > 0 && (
                <div style={{
                  padding: 'var(--spacing-lg)',
                  borderTop: '2px solid var(--color-gold-light)'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-md)',
                    textAlign: 'center'
                  }}>
                    🏆 Collection de Badges
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-sm)',
                    justifyContent: 'center'
                  }}>
                    {currentUser.badges.map((badgeId, index) => {
                      const badge = profileBadges[badgeId];
                      return badge ? (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)',
                            background: badge.color + '22',
                            border: `2px solid ${badge.color}`,
                            borderRadius: 'var(--border-radius-md)',
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            fontSize: '0.875rem'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{badge.emoji}</span>
                          <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            {badge.name}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Avatar Editor Modal */}
      {showAvatarEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-md)',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-xl)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <AvatarCreator
              gender={currentUser.gender === 'man' ? 'M' : currentUser.gender === 'woman' ? 'F' : 'M'}
              onSave={(avatarDataUrl, avatarConfig) => {
                const updatedUser = {
                  ...currentUser,
                  avatar: avatarDataUrl,
                  avatarOptions: avatarConfig
                };

                // Sauvegarder dans localStorage
                const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
                const userIndex = users.findIndex(u => u.email === currentUser.email);
                if (userIndex !== -1) {
                  users[userIndex] = updatedUser;
                  localStorage.setItem('jeutaime_users', JSON.stringify(users));
                }

                localStorage.setItem('jeutaime_current_user', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
                setShowAvatarEditor(false);
              }}
            />
            <button
              onClick={() => setShowAvatarEditor(false)}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                background: 'var(--color-brown)',
                color: 'var(--color-cream)',
                border: 'none',
                borderRadius: '0 0 var(--border-radius-xl) var(--border-radius-xl)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
