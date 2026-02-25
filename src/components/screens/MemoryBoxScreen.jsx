import React, { useState, useEffect } from 'react';
import {
  getUserMemories,
  getTotalSlots,
  getPurchasedSlots,
  getMemoriesStats,
  purchaseSlots,
  deleteMemory,
  toggleFavorite,
  filterMemories,
  MEMORIES_CONFIG,
  MEMORY_TYPES,
  initDemoMemories
} from '../../utils/memoriesSystem';

export default function MemoryBoxScreen({ currentUser, setCurrentUser }) {
  const [viewMode, setViewMode] = useState('gallery'); // gallery, timeline, chest
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    loadMemories();
    // Initialiser les souvenirs de démo si nécessaire
    initDemoMemories(currentUser?.email);
  }, [currentUser]);

  const loadMemories = () => {
    if (!currentUser) return;

    const allMemories = getUserMemories(currentUser.email);
    const memStats = getMemoriesStats(currentUser.email);

    setMemories(allMemories);
    setStats(memStats);
  };

  const handleToggleFavorite = (memoryId) => {
    toggleFavorite(currentUser.email, memoryId);
    loadMemories();
  };

  const handleDeleteMemory = (memoryId) => {
    if (confirm('Supprimer ce souvenir définitivement ?')) {
      deleteMemory(currentUser.email, memoryId);
      loadMemories();
      setSelectedMemory(null);
    }
  };

  const handlePurchaseSlots = (count) => {
    const result = purchaseSlots(currentUser.email, count, currentUser.coins || 0);

    if (result.success) {
      alert(`✅ ${count} emplacement${count > 1 ? 's' : ''} acheté${count > 1 ? 's' : ''} pour ${result.spent} pièces !`);

      // Mettre à jour currentUser avec les nouvelles pièces
      const updatedUser = JSON.parse(localStorage.getItem('jeutaime_current_user'));
      setCurrentUser(updatedUser);

      loadMemories();
      setShowUpgrade(false);
    } else {
      alert(`❌ ${result.error}`);
    }
  };

  const getMemoryIcon = (type) => {
    const icons = {
      [MEMORY_TYPES.CONVERSATION_PRIVATE]: '💬',
      [MEMORY_TYPES.CONVERSATION_SALON]: '🍸',
      [MEMORY_TYPES.PHOTO]: '📸',
      [MEMORY_TYPES.MESSAGE]: '💌',
      [MEMORY_TYPES.MOMENT]: '✨'
    };
    return icons[type] || '📦';
  };

  const getMemoryColor = (type) => {
    const colors = {
      [MEMORY_TYPES.CONVERSATION_PRIVATE]: '#E91E63',
      [MEMORY_TYPES.CONVERSATION_SALON]: '#667eea',
      [MEMORY_TYPES.PHOTO]: '#00BCD4',
      [MEMORY_TYPES.MESSAGE]: '#FF6B9D',
      [MEMORY_TYPES.MOMENT]: '#FFD700'
    };
    return colors[type] || 'var(--color-brown)';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredMemories = filterType === 'all'
    ? memories
    : memories.filter(m => m.type === filterType);

  if (!stats) return null;

  return (
    <div>
      {/* En-tête avec stats */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-md)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>🎁</div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: '0 0 var(--spacing-sm) 0'
        }}>
          Boîte à Souvenirs
        </h2>
        <p style={{
          fontSize: '0.95rem',
          opacity: 0.9,
          margin: '0 0 var(--spacing-md) 0'
        }}>
          Conserve tes meilleurs moments, conversations et photos
        </p>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-sm)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.total}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Souvenirs</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-sm)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalSlots}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Emplacements</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-sm)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.favorites}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Favoris</div>
          </div>
        </div>

        {/* Barre de progression */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          height: '10px',
          overflow: 'hidden',
          marginBottom: 'var(--spacing-xs)'
        }}>
          <div style={{
            background: stats.freeSlots > 0 ? '#4CAF50' : '#FF9800',
            height: '100%',
            width: `${(stats.total / stats.totalSlots) * 100}%`,
            transition: 'width 0.3s'
          }} />
        </div>
        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
          {stats.freeSlots} emplacement{stats.freeSlots > 1 ? 's' : ''} disponible{stats.freeSlots > 1 ? 's' : ''}
        </div>

        {stats.freeSlots === 0 && (
          <button
            onClick={() => setShowUpgrade(true)}
            style={{
              marginTop: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              background: '#FFD700',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              color: '#000',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🔓 Acheter plus d'espace
          </button>
        )}
      </div>

      {/* Modes de vue */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        marginBottom: 'var(--spacing-md)',
        background: 'var(--color-cream)',
        padding: 'var(--spacing-xs)',
        borderRadius: 'var(--border-radius-lg)',
        border: '2px solid var(--color-brown-light)'
      }}>
        <button
          onClick={() => setViewMode('gallery')}
          style={{
            flex: 1,
            padding: 'var(--spacing-sm)',
            background: viewMode === 'gallery'
              ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
              : 'transparent',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            color: viewMode === 'gallery' ? 'var(--color-brown-dark)' : 'var(--color-text-secondary)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🖼️ Galerie
        </button>
        <button
          onClick={() => setViewMode('timeline')}
          style={{
            flex: 1,
            padding: 'var(--spacing-sm)',
            background: viewMode === 'timeline'
              ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
              : 'transparent',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            color: viewMode === 'timeline' ? 'var(--color-brown-dark)' : 'var(--color-text-secondary)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📅 Timeline
        </button>
        <button
          onClick={() => setViewMode('chest')}
          style={{
            flex: 1,
            padding: 'var(--spacing-sm)',
            background: viewMode === 'chest'
              ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
              : 'transparent',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            color: viewMode === 'chest' ? 'var(--color-brown-dark)' : 'var(--color-text-secondary)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📦 Coffre
        </button>
      </div>

      {/* Filtres */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        marginBottom: 'var(--spacing-lg)',
        overflowX: 'auto',
        padding: '0 2px'
      }}>
        {[
          { id: 'all', label: 'Tous', icon: '📦' },
          { id: MEMORY_TYPES.CONVERSATION_PRIVATE, label: 'Convos', icon: '💬' },
          { id: MEMORY_TYPES.CONVERSATION_SALON, label: 'Salons', icon: '🍸' },
          { id: MEMORY_TYPES.PHOTO, label: 'Photos', icon: '📸' },
          { id: MEMORY_TYPES.MESSAGE, label: 'Messages', icon: '💌' },
          { id: MEMORY_TYPES.MOMENT, label: 'Moments', icon: '✨' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id)}
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: filterType === filter.id
                ? 'var(--color-brown)'
                : 'var(--color-beige)',
              border: `2px solid ${filterType === filter.id ? 'var(--color-brown-dark)' : 'var(--color-brown-light)'}`,
              borderRadius: '50%',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
            {filter.icon}
          </button>
        ))}
      </div>

      {/* État vide */}
      {filteredMemories.length === 0 && (
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-xl)',
          textAlign: 'center',
          border: '2px solid var(--color-brown-light)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📭</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            Aucun souvenir {filterType !== 'all' ? 'de ce type' : ''}
          </h3>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.5'
          }}>
            Sauvegarde tes meilleures conversations, photos et moments depuis<br />
            l'écran de chat en cliquant sur "Sauvegarder" !
          </p>
        </div>
      )}

      {/* Vue Galerie */}
      {viewMode === 'gallery' && filteredMemories.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--spacing-md)'
        }}>
          {filteredMemories.map(memory => (
            <div
              key={memory.id}
              onClick={() => setSelectedMemory(memory)}
              style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-md)',
                border: `3px solid ${getMemoryColor(memory.type)}`,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {memory.isFavorite && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  fontSize: '1.2rem'
                }}>
                  ⭐
                </div>
              )}
              <div style={{
                fontSize: '2.5rem',
                textAlign: 'center',
                marginBottom: 'var(--spacing-sm)'
              }}>
                {memory.data?.icon || getMemoryIcon(memory.type)}
              </div>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--color-text-primary)',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {memory.title}
              </h4>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                margin: '0 0 var(--spacing-xs) 0',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {memory.description}
              </p>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-light)',
                textAlign: 'center'
              }}>
                {formatDate(memory.date)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue Timeline */}
      {viewMode === 'timeline' && filteredMemories.length > 0 && (
        <div style={{ position: 'relative' }}>
          {/* Ligne verticale */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '0',
            bottom: '0',
            width: '3px',
            background: 'linear-gradient(180deg, var(--color-gold), var(--color-gold-dark))',
            borderRadius: '10px'
          }} />

          {filteredMemories.map((memory, index) => (
            <div
              key={memory.id}
              onClick={() => setSelectedMemory(memory)}
              style={{
                marginBottom: 'var(--spacing-lg)',
                marginLeft: '50px',
                position: 'relative'
              }}
            >
              {/* Point sur la timeline */}
              <div style={{
                position: 'absolute',
                left: '-42px',
                top: '10px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: getMemoryColor(memory.type),
                border: '3px solid white',
                boxShadow: '0 0 0 3px ' + getMemoryColor(memory.type)
              }} />

              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-md)',
                border: `2px solid ${getMemoryColor(memory.type)}`,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-md)',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>
                    {memory.data?.icon || getMemoryIcon(memory.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        margin: 0,
                        color: 'var(--color-text-primary)'
                      }}>
                        {memory.title}
                      </h4>
                      {memory.isFavorite && <span>⭐</span>}
                    </div>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      margin: '0 0 var(--spacing-xs) 0',
                      lineHeight: '1.4'
                    }}>
                      {memory.description}
                    </p>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-light)'
                    }}>
                      📅 {formatDate(memory.date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue Coffre */}
      {viewMode === 'chest' && filteredMemories.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--spacing-sm)'
        }}>
          {filteredMemories.map(memory => (
            <div
              key={memory.id}
              onClick={() => setSelectedMemory(memory)}
              style={{
                aspectRatio: '1',
                background: `linear-gradient(135deg, ${getMemoryColor(memory.type)}22, ${getMemoryColor(memory.type)}44)`,
                borderRadius: 'var(--border-radius-md)',
                border: `2px solid ${getMemoryColor(memory.type)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative',
                padding: 'var(--spacing-xs)'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {memory.isFavorite && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  fontSize: '0.9rem'
                }}>
                  ⭐
                </div>
              )}
              <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
                {memory.data?.icon || getMemoryIcon(memory.type)}
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: 'var(--color-text-primary)',
                textAlign: 'center',
                fontWeight: '600',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                padding: '0 4px'
              }}>
                {memory.title.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal détails du souvenir */}
      {selectedMemory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedMemory(null)}
        >
          <div
            style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: `4px solid ${getMemoryColor(selectedMemory.type)}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              textAlign: 'center',
              fontSize: '4rem',
              marginBottom: 'var(--spacing-md)'
            }}>
              {selectedMemory.data?.icon || getMemoryIcon(selectedMemory.type)}
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0 0 var(--spacing-sm) 0',
              color: 'var(--color-text-primary)',
              textAlign: 'center'
            }}>
              {selectedMemory.title}
            </h2>

            <div style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--color-text-light)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              📅 {formatDate(selectedMemory.date)}
            </div>

            <div style={{
              background: 'var(--color-beige)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-primary)',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {selectedMemory.data?.content || selectedMemory.description}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              marginTop: 'var(--spacing-md)'
            }}>
              <button
                onClick={() => handleToggleFavorite(selectedMemory.id)}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-sm)',
                  background: selectedMemory.isFavorite
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                    : 'var(--color-beige)',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: 'var(--border-radius-md)',
                  color: selectedMemory.isFavorite ? '#000' : 'var(--color-text-primary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {selectedMemory.isFavorite ? '⭐ Favori' : '☆ Ajouter aux favoris'}
              </button>
              <button
                onClick={() => handleDeleteMemory(selectedMemory.id)}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: 'var(--color-error)',
                  border: '2px solid var(--color-brown-dark)',
                  borderRadius: 'var(--border-radius-md)',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🗑️
              </button>
            </div>

            <button
              onClick={() => setSelectedMemory(null)}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                background: 'var(--color-brown)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: 'var(--spacing-sm)'
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Upgrade */}
      {showUpgrade && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowUpgrade(false)}
        >
          <div
            style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-lg)',
              maxWidth: '400px',
              width: '100%',
              border: '4px solid #FFD700'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              textAlign: 'center',
              fontSize: '4rem',
              marginBottom: 'var(--spacing-md)'
            }}>
              🔓
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0 0 var(--spacing-sm) 0',
              color: 'var(--color-text-primary)',
              textAlign: 'center'
            }}>
              Acheter de l'espace
            </h2>

            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              marginBottom: 'var(--spacing-lg)',
              lineHeight: '1.5'
            }}>
              Ta Boîte à Souvenirs est pleine !<br />
              Achète plus d'espace pour sauvegarder d'autres moments.
            </p>

            <div style={{
              background: 'var(--color-beige)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
                fontSize: '0.9rem'
              }}>
                <span>Gratuit:</span>
                <strong>{MEMORIES_CONFIG.FREE_SLOTS} emplacements</strong>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
                fontSize: '0.9rem'
              }}>
                <span>Achetés:</span>
                <strong>{getPurchasedSlots(currentUser.email)} emplacements</strong>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
                paddingTop: 'var(--spacing-sm)',
                borderTop: '2px solid var(--color-tan)'
              }}>
                <span>Prix:</span>
                <strong>{MEMORIES_CONFIG.PRICE_PER_SLOT} 🪙 / emplacement</strong>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)'
            }}>
              {[5, 10, 20].map(count => (
                <button
                  key={count}
                  onClick={() => handlePurchaseSlots(count)}
                  style={{
                    padding: 'var(--spacing-md)',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    border: '2px solid #FF8C00',
                    borderRadius: 'var(--border-radius-md)',
                    color: '#000',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>+{count} emplacements</span>
                  <span>{count * MEMORIES_CONFIG.PRICE_PER_SLOT} 🪙</span>
                </button>
              ))}
            </div>

            <div style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Tes pièces: <strong>{currentUser.coins || 0} 🪙</strong>
            </div>

            <button
              onClick={() => setShowUpgrade(false)}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                background: 'var(--color-brown)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer'
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
