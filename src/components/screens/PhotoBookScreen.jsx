import React, { useState, useEffect } from 'react';
import {
  getUserPhotoBook,
  addPhoto,
  deletePhoto,
  updatePhoto,
  addSticker,
  removeSticker,
  toggleStickerFavorite,
  STICKER_CATEGORIES
} from '../../utils/photoBookSystem';
import { generateAvatarOptions } from '../../utils/avatarGenerator';
import Avatar from 'avataaars';

export default function PhotoBookScreen({ currentUser, setScreen }) {
  const [tab, setTab] = useState('photos'); // 'photos' ou 'stickers'
  const [photoBook, setPhotoBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('LOVE');
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

  useEffect(() => {
    if (currentUser?.email) {
      loadPhotoBook();
    }
  }, [currentUser]);

  const loadPhotoBook = () => {
    const book = getUserPhotoBook(currentUser.email);
    setPhotoBook(book);
  };

  const handleAddRandomAvatar = () => {
    const randomStyles = [
      'Circle', 'Transparent', 'Transparent'
    ];

    const randomAvatarOptions = {
      ...generateAvatarOptions(`Random${Date.now()}`, Math.random() > 0.5 ? 'M' : 'F'),
      avatarStyle: randomStyles[Math.floor(Math.random() * randomStyles.length)]
    };

    const result = addPhoto(currentUser.email, {
      type: 'avatar',
      avatarOptions: randomAvatarOptions,
      caption: 'Mon avatar ' + (photoBook.photos.length + 1)
    });

    if (result.success) {
      loadPhotoBook();
    } else {
      alert(result.error);
    }
  };

  const handleDeletePhoto = (photoId) => {
    if (window.confirm('Supprimer cette photo ?')) {
      deletePhoto(currentUser.email, photoId);
      loadPhotoBook();
    }
  };

  const handleAddSticker = (emoji, category) => {
    const result = addSticker(currentUser.email, emoji, category);
    if (result.success) {
      loadPhotoBook();
    } else {
      alert(result.error);
    }
  };

  const handleRemoveSticker = (stickerId) => {
    removeSticker(currentUser.email, stickerId);
    loadPhotoBook();
  };

  const handleToggleFavorite = (stickerId) => {
    toggleStickerFavorite(currentUser.email, stickerId);
    loadPhotoBook();
  };

  if (!photoBook) {
    return <div style={{ padding: '20px', color: 'white' }}>Chargement...</div>;
  }

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
          📸 Book Photos
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 0
        }}>
          Ta galerie personnelle et ta collection de stickers
        </p>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-md)'
        }}>
          <button
            onClick={() => setTab('photos')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              background: tab === 'photos'
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : 'var(--color-beige)',
              color: tab === 'photos' ? 'white' : 'var(--color-text-primary)',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              transition: 'all 0.2s',
              boxShadow: tab === 'photos' ? 'var(--shadow-md)' : 'none'
            }}
          >
            📷 Photos ({photoBook.photos.length}/{photoBook.settings.maxPhotos})
          </button>
          <button
            onClick={() => setTab('stickers')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              background: tab === 'stickers'
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : 'var(--color-beige)',
              color: tab === 'stickers' ? 'white' : 'var(--color-text-primary)',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              transition: 'all 0.2s',
              boxShadow: tab === 'stickers' ? 'var(--shadow-md)' : 'none'
            }}
          >
            🎨 Stickers ({photoBook.stickers.length})
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: '0 var(--spacing-lg)' }}>
        {/* ONGLET PHOTOS */}
        {tab === 'photos' && (
          <div>
            {/* Bouton ajouter photo */}
            {photoBook.photos.length < photoBook.settings.maxPhotos && (
              <button
                onClick={handleAddRandomAvatar}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginBottom: 'var(--spacing-lg)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-sm)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                ➕ Ajouter une photo d'avatar
              </button>
            )}

            {/* Grille de photos */}
            {photoBook.photos.length === 0 ? (
              <div className="card" style={{
                padding: 'var(--spacing-xl)',
                background: 'var(--color-cream)',
                border: '2px solid var(--color-tan)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📸</div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  Ton album est vide
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                  Ajoute des avatars pour personnaliser ton profil !<br />
                  Tu peux en ajouter jusqu'à {photoBook.settings.maxPhotos}.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'var(--spacing-md)'
              }}>
                {photoBook.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="card"
                    style={{
                      background: 'var(--color-cream)',
                      borderRadius: 'var(--border-radius-lg)',
                      overflow: 'hidden',
                      border: '3px solid var(--color-tan)',
                      boxShadow: 'var(--shadow-lg)',
                      position: 'relative'
                    }}
                  >
                    {/* Photo */}
                    <div style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {photo.type === 'avatar' && photo.avatarOptions && (
                        <Avatar
                          style={{ width: '100%', height: '100%' }}
                          {...photo.avatarOptions}
                        />
                      )}
                    </div>

                    {/* Caption */}
                    {photo.caption && (
                      <div style={{
                        padding: 'var(--spacing-sm)',
                        background: 'var(--color-beige-light)',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}>
                        {photo.caption}
                      </div>
                    )}

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(231, 76, 60, 0.9)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(192, 57, 43, 1)';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(231, 76, 60, 0.9)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONGLET STICKERS */}
        {tab === 'stickers' && (
          <div>
            {/* Ma collection */}
            {photoBook.stickers.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  ⭐ Ma collection
                </h3>
                <div className="card" style={{
                  background: 'var(--color-cream)',
                  padding: 'var(--spacing-md)',
                  border: '3px solid var(--color-gold)',
                  boxShadow: 'var(--shadow-lg)',
                  marginBottom: 'var(--spacing-lg)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
                    gap: 'var(--spacing-sm)',
                    maxWidth: '100%'
                  }}>
                    {photoBook.stickers.map((sticker) => (
                      <div
                        key={sticker.id}
                        style={{
                          position: 'relative',
                          aspectRatio: '1',
                          background: sticker.favorite
                            ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                            : 'var(--color-beige-light)',
                          borderRadius: 'var(--border-radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: sticker.favorite ? '2px solid #FFD700' : '2px solid var(--color-brown-light)',
                          boxShadow: sticker.favorite ? 'var(--shadow-md)' : 'none'
                        }}
                        onClick={() => handleToggleFavorite(sticker.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleRemoveSticker(sticker.id);
                        }}
                        title={sticker.favorite ? 'Clic droit pour retirer' : 'Clic pour marquer en favori'}
                      >
                        {sticker.emoji}
                        {sticker.favorite && (
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            fontSize: '0.8rem'
                          }}>
                            ⭐
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-light)',
                    textAlign: 'center',
                    marginTop: 'var(--spacing-sm)',
                    marginBottom: 0
                  }}>
                    Clic pour marquer en favori • Clic droit pour retirer
                  </p>
                </div>
              </div>
            )}

            {/* Sélecteur de catégories */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-xs)',
              marginBottom: 'var(--spacing-md)',
              overflowX: 'auto',
              paddingBottom: 'var(--spacing-xs)'
            }}>
              {Object.entries(STICKER_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    background: selectedCategory === key
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : 'var(--color-beige)',
                    color: selectedCategory === key ? 'white' : 'var(--color-text-primary)',
                    border: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    boxShadow: selectedCategory === key ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Grille de stickers disponibles */}
            <div className="card" style={{
              background: 'var(--color-cream)',
              padding: 'var(--spacing-md)',
              border: '2px solid var(--color-tan)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden'
            }}>
              <h4 style={{
                fontSize: '1rem',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
                fontWeight: '600'
              }}>
                {STICKER_CATEGORIES[selectedCategory].name}
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
                gap: 'var(--spacing-sm)',
                maxWidth: '100%'
              }}>
                {STICKER_CATEGORIES[selectedCategory].emojis.map((emoji) => {
                  const isInCollection = photoBook.stickers.some(s => s.emoji === emoji);
                  return (
                    <button
                      key={emoji}
                      onClick={() => !isInCollection && handleAddSticker(emoji, selectedCategory)}
                      disabled={isInCollection}
                      style={{
                        aspectRatio: '1',
                        background: isInCollection
                          ? 'var(--color-beige)'
                          : 'var(--color-beige-light)',
                        borderRadius: 'var(--border-radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        cursor: isInCollection ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        border: isInCollection
                          ? '2px dashed var(--color-brown-light)'
                          : '2px solid var(--color-brown-light)',
                        opacity: isInCollection ? 0.4 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isInCollection) {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = 'var(--shadow-md)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                      title={isInCollection ? 'Déjà dans la collection' : 'Ajouter à ma collection'}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
