import React, { useState, useEffect, useRef } from 'react';
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

const FILTERS = {
  none: { name: 'Original', filter: 'none' },
  bw: { name: 'Noir & Blanc', filter: 'grayscale(100%)' },
  sepia: { name: 'Sépia', filter: 'sepia(100%)' },
  vintage: { name: 'Vintage', filter: 'sepia(50%) contrast(120%) brightness(90%)' },
  warm: { name: 'Chaleureux', filter: 'saturate(150%) hue-rotate(-10deg)' },
  cool: { name: 'Froid', filter: 'saturate(120%) hue-rotate(10deg)' },
  dramatic: { name: 'Dramatique', filter: 'contrast(150%) brightness(90%)' },
  soft: { name: 'Doux', filter: 'brightness(110%) saturate(80%)' }
};

export default function PhotoBookScreen({ currentUser, setScreen }) {
  const [tab, setTab] = useState('photos');
  const [photoBook, setPhotoBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('LOVE');
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [editCaption, setEditCaption] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser?.email) {
      loadPhotoBook();
    }
  }, [currentUser]);

  const loadPhotoBook = () => {
    const book = getUserPhotoBook(currentUser.email);
    setPhotoBook(book);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
        setShowAddPhotoModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUploadedPhoto = () => {
    if (uploadPreview) {
      const result = addPhoto(currentUser.email, {
        type: 'uploaded',
        imageData: uploadPreview,
        filter: selectedFilter,
        caption: editCaption || 'Ma photo'
      });

      if (result.success) {
        loadPhotoBook();
        setShowAddPhotoModal(false);
        setUploadPreview(null);
        setSelectedFilter('none');
        setEditCaption('');
      } else {
        alert(result.error);
      }
    }
  };

  const handleAddRandomAvatar = () => {
    const randomStyles = ['Circle', 'Transparent', 'Transparent'];
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

  const handleEditPhoto = (photo) => {
    setSelectedPhoto(photo);
    setEditCaption(photo.caption || '');
    setSelectedFilter(photo.filter || 'none');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedPhoto) {
      updatePhoto(currentUser.email, selectedPhoto.id, {
        caption: editCaption,
        filter: selectedFilter
      });
      loadPhotoBook();
      setShowEditModal(false);
      setSelectedPhoto(null);
      setEditCaption('');
      setSelectedFilter('none');
    }
  };

  const handleOpenLightbox = (photo) => {
    setLightboxPhoto(photo);
    setShowLightbox(true);
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
    return (
      <div style={{
        padding: '20px',
        color: 'var(--color-text-primary)',
        background: 'var(--color-beige-light)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Chargement...
      </div>
    );
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
          Ta galerie personnelle avec filtres et stickers
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
            {/* Boutons ajouter photo */}
            {photoBook.photos.length < photoBook.settings.maxPhotos && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: 'var(--spacing-md)',
                    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-xs)',
                    flexDirection: 'column'
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
                  <span style={{ fontSize: '1.5rem' }}>📤</span>
                  <span>Uploader une photo</span>
                </button>

                <button
                  onClick={handleAddRandomAvatar}
                  style={{
                    padding: 'var(--spacing-md)',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-xs)',
                    flexDirection: 'column'
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
                  <span style={{ fontSize: '1.5rem' }}>👤</span>
                  <span>Générer un avatar</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

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
                  Ajoute des photos ou des avatars pour personnaliser ton profil !<br />
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
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleOpenLightbox(photo)}
                  >
                    {/* Photo */}
                    <div style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: photo.type === 'avatar'
                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                        : '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {photo.type === 'avatar' && photo.avatarOptions && (
                        <Avatar
                          style={{ width: '100%', height: '100%' }}
                          {...photo.avatarOptions}
                        />
                      )}
                      {photo.type === 'uploaded' && photo.imageData && (
                        <img
                          src={photo.imageData}
                          alt={photo.caption}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: FILTERS[photo.filter || 'none'].filter
                          }}
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

                    {/* Bouton éditer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPhoto(photo);
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(52, 152, 219, 0.9)',
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
                        e.target.style.background = 'rgba(41, 128, 185, 1)';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(52, 152, 219, 0.9)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ✏️
                    </button>

                    {/* Bouton supprimer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
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

                    {/* Badge filtre */}
                    {photo.filter && photo.filter !== 'none' && (
                      <div style={{
                        position: 'absolute',
                        bottom: photo.caption ? '40px' : '8px',
                        left: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                      }}>
                        🎨 {FILTERS[photo.filter].name}
                      </div>
                    )}
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

      {/* Modal Ajout Photo */}
      {showAddPhotoModal && uploadPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: 'var(--spacing-lg)'
        }}>
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--color-text-primary)',
              fontWeight: '700'
            }}>
              📸 Ajouter une photo
            </h3>

            {/* Preview */}
            <div style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 'var(--border-radius-md)',
              overflow: 'hidden',
              marginBottom: 'var(--spacing-md)',
              border: '3px solid var(--color-tan)'
            }}>
              <img
                src={uploadPreview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: FILTERS[selectedFilter].filter
                }}
              />
            </div>

            {/* Filtres */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
              }}>
                🎨 Filtre
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--spacing-xs)'
              }}>
                {Object.entries(FILTERS).map(([key, filter]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    style={{
                      padding: 'var(--spacing-xs)',
                      background: selectedFilter === key
                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                        : 'var(--color-beige)',
                      color: selectedFilter === key ? 'white' : 'var(--color-text-primary)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Légende */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
              }}>
                💬 Légende
              </label>
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Ajoute une légende..."
                maxLength={50}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-light)',
                marginTop: 'var(--spacing-xs)'
              }}>
                {editCaption.length}/50 caractères
              </div>
            </div>

            {/* Boutons */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)'
            }}>
              <button
                onClick={() => {
                  setShowAddPhotoModal(false);
                  setUploadPreview(null);
                  setSelectedFilter('none');
                  setEditCaption('');
                }}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  background: 'var(--color-beige)',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleAddUploadedPhoto}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                ✓ Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition Photo */}
      {showEditModal && selectedPhoto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: 'var(--spacing-lg)'
        }}>
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-lg)',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--color-text-primary)',
              fontWeight: '700'
            }}>
              ✏️ Éditer la photo
            </h3>

            {/* Preview */}
            <div style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 'var(--border-radius-md)',
              overflow: 'hidden',
              marginBottom: 'var(--spacing-md)',
              border: '3px solid var(--color-tan)',
              background: selectedPhoto.type === 'avatar'
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : '#f0f0f0'
            }}>
              {selectedPhoto.type === 'avatar' && selectedPhoto.avatarOptions && (
                <Avatar
                  style={{ width: '100%', height: '100%' }}
                  {...selectedPhoto.avatarOptions}
                />
              )}
              {selectedPhoto.type === 'uploaded' && selectedPhoto.imageData && (
                <img
                  src={selectedPhoto.imageData}
                  alt={selectedPhoto.caption}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: FILTERS[selectedFilter].filter
                  }}
                />
              )}
            </div>

            {/* Filtres (seulement pour photos uploadées) */}
            {selectedPhoto.type === 'uploaded' && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--color-text-primary)'
                }}>
                  🎨 Filtre
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 'var(--spacing-xs)'
                }}>
                  {Object.entries(FILTERS).map(([key, filter]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFilter(key)}
                      style={{
                        padding: 'var(--spacing-xs)',
                        background: selectedFilter === key
                          ? 'linear-gradient(135deg, #667eea, #764ba2)'
                          : 'var(--color-beige)',
                        color: selectedFilter === key ? 'white' : 'var(--color-text-primary)',
                        border: 'none',
                        borderRadius: 'var(--border-radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Légende */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
              }}>
                💬 Légende
              </label>
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Ajoute une légende..."
                maxLength={50}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-light)',
                marginTop: 'var(--spacing-xs)'
              }}>
                {editCaption.length}/50 caractères
              </div>
            </div>

            {/* Boutons */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)'
            }}>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPhoto(null);
                  setEditCaption('');
                  setSelectedFilter('none');
                }}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  background: 'var(--color-beige)',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                ✓ Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && lightboxPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 'var(--spacing-lg)'
          }}
          onClick={() => setShowLightbox(false)}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setShowLightbox(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid white',
              cursor: 'pointer',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>

          {/* Photo en grand */}
          <div style={{
            maxWidth: '90%',
            maxHeight: '80%',
            background: lightboxPhoto.type === 'avatar'
              ? 'linear-gradient(135deg, #667eea, #764ba2)'
              : 'transparent',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            {lightboxPhoto.type === 'avatar' && lightboxPhoto.avatarOptions && (
              <Avatar
                style={{ width: '400px', height: '400px', maxWidth: '90vw', maxHeight: '80vh' }}
                {...lightboxPhoto.avatarOptions}
              />
            )}
            {lightboxPhoto.type === 'uploaded' && lightboxPhoto.imageData && (
              <img
                src={lightboxPhoto.imageData}
                alt={lightboxPhoto.caption}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: FILTERS[lightboxPhoto.filter || 'none'].filter
                }}
              />
            )}
          </div>

          {/* Légende */}
          {lightboxPhoto.caption && (
            <div style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--border-radius-lg)',
              color: 'white',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: '80%'
            }}>
              {lightboxPhoto.caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
