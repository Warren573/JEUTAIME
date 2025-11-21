import React, { useState, useEffect } from 'react';
import { getUserMemories, getMemory, deleteMemory, getBreakupTypeInfo } from '../../utils/memoriesSystem';
import { generateAvatarOptions } from '../../utils/avatarGenerator';
import Avatar from 'avataaars';

export default function MemoriesScreen({ currentUser, setScreen }) {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [memories, setMemories] = useState([]);

  // Charger les souvenirs au montage
  useEffect(() => {
    if (currentUser?.email) {
      const userMemories = getUserMemories(currentUser.email);
      setMemories(userMemories);
    }
  }, [currentUser]);

  const handleDeleteMemory = (memoryId, e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce souvenir ? Cette action est irréversible.')) {
      deleteMemory(memoryId);
      setMemories(memories.filter(m => m.id !== memoryId));
      if (selectedMemory?.id === memoryId) {
        setSelectedMemory(null);
      }
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
    return `Il y a ${Math.floor(days / 365)} ans`;
  };

  const handleOpenMemory = (memory) => {
    if (!memory.locked) {
      setSelectedMemory(memory);
    }
  };

  if (selectedMemory) {
    const breakupInfo = getBreakupTypeInfo(selectedMemory.breakupType);
    const avatarOptions = generateAvatarOptions(selectedMemory.profileName, selectedMemory.profileGender);

    return (
      <div style={{
        height: '100vh',
        overflowY: 'auto',
        paddingBottom: '80px',
        background: 'var(--color-brown-dark)'
      }}>
        {/* Bouton retour */}
        <div style={{
          padding: 'var(--spacing-lg)',
          background: 'var(--color-brown-darker)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <button
            onClick={() => setSelectedMemory(null)}
            className="btn-secondary"
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontSize: '0.9rem'
            }}
          >
            ← Retour
          </button>
        </div>

        {/* Contenu du souvenir */}
        <div style={{ padding: 'var(--spacing-lg)' }}>
          <div className="card" style={{
            background: 'var(--color-cream)',
            padding: 'var(--spacing-xl)',
            border: '3px solid var(--color-tan)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            {/* Avatar et infos profil */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto var(--spacing-md)',
                border: '4px solid var(--color-tan)',
                boxShadow: 'var(--shadow-lg)',
                filter: 'grayscale(0.3)' // Légèrement désaturé pour effet souvenir
              }}>
                <Avatar
                  style={{ width: '120px', height: '120px' }}
                  {...avatarOptions}
                />
              </div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Conversation avec {selectedMemory.profileName}
              </h2>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                background: breakupInfo.color,
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-sm)'
              }}>
                {breakupInfo.emoji} {breakupInfo.label}
              </div>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-light)',
                margin: 0
              }}>
                Archivé {formatDate(selectedMemory.archivedDate)}
              </p>
            </div>

            {/* Raison de la rupture */}
            {selectedMemory.breakupReason && (
              <div style={{
                background: 'var(--color-beige-light)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                border: '2px solid var(--color-brown-light)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  💭 Raison :
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-primary)',
                  fontStyle: 'italic',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  "{selectedMemory.breakupReason}"
                </p>
              </div>
            )}

            {/* Statistiques de la conversation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{
                background: 'var(--color-beige)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>💌</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                  {selectedMemory.messageCount}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Messages</div>
              </div>
              <div style={{
                background: 'var(--color-beige)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                border: '2px solid var(--color-tan)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>📸</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                  🔒
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Photos masquées</div>
              </div>
            </div>

            {/* Historique des messages */}
            <div style={{
              background: 'var(--color-beige-light)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              border: '2px solid var(--color-brown-light)',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-md)',
                textAlign: 'center'
              }}>
                📜 Historique des messages
              </div>
              {selectedMemory.messages && selectedMemory.messages.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {selectedMemory.messages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        background: msg.sender === currentUser?.email ? 'var(--color-cream)' : 'white',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid var(--color-brown-light)',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <div style={{ fontWeight: '600', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        {msg.sender === currentUser?.email ? 'Vous' : selectedMemory.profileName}
                      </div>
                      {msg.text}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{
                  textAlign: 'center',
                  color: 'var(--color-text-light)',
                  fontStyle: 'italic',
                  fontSize: '0.9rem'
                }}>
                  Aucun message archivé
                </p>
              )}
            </div>

            {/* Note finale */}
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-lg)',
              background: 'var(--color-beige)',
              borderRadius: 'var(--border-radius-md)',
              border: '2px solid var(--color-gold)'
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                fontWeight: '500'
              }}>
                📦 Ce souvenir restera précieux pour toujours
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-light)',
                margin: 'var(--spacing-xs) 0 0 0',
                fontStyle: 'italic'
              }}>
                Si vous re-matchez, vous pourrez reprendre cette conversation
              </p>
            </div>

            {/* Bouton supprimer */}
            <button
              onClick={(e) => handleDeleteMemory(selectedMemory.id, e)}
              style={{
                width: '100%',
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-md)',
                background: '#E74C3C',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#C0392B'}
              onMouseLeave={(e) => e.target.style.background = '#E74C3C'}
            >
              🗑️ Supprimer ce souvenir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '80px',
      background: 'var(--color-brown-dark)'
    }}>
      {/* En-tête Boîte à souvenirs */}
      <div style={{
        background: 'var(--color-brown-darker)',
        padding: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-lg)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: 'var(--spacing-md)',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}>
          🕯️
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          color: 'var(--color-cream)',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Boîte à souvenirs
        </h1>
        <p style={{
          fontSize: '1rem',
          color: 'var(--color-tan)',
          margin: 'var(--spacing-sm) 0 0 0',
          fontStyle: 'italic'
        }}>
          Garde précieusement tes moments magiques
        </p>
      </div>

      {/* Grille de souvenirs */}
      <div style={{ padding: '0 var(--spacing-lg)' }}>
        {memories.length === 0 ? (
          <div className="card" style={{
            padding: 'var(--spacing-xl)',
            background: 'var(--color-cream)',
            border: '2px solid var(--color-tan)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📦</div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Votre boîte à souvenirs est vide
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-lg)',
              lineHeight: '1.6'
            }}>
              Les conversations que vous archiverez<br />
              seront conservées ici précieusement.
            </p>
            <button
              onClick={() => setScreen && setScreen('profiles')}
              className="btn-primary"
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                fontSize: '1rem'
              }}
            >
              Découvrir des profils
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--spacing-md)'
          }}>
            {memories.map((memory) => {
              const breakupInfo = getBreakupTypeInfo(memory.breakupType);
              const avatarOptions = generateAvatarOptions(memory.profileName, memory.profileGender);

              return (
                <div
                  key={memory.id}
                  onClick={() => setSelectedMemory(memory)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    padding: 'var(--spacing-lg)',
                    background: 'var(--color-cream)',
                    border: '3px solid var(--color-tan)',
                    boxShadow: 'var(--shadow-lg)',
                    transition: 'all var(--transition-normal)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)'
                  }}>
                    {/* Avatar du profil */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid var(--color-tan)',
                      boxShadow: 'var(--shadow-sm)',
                      flexShrink: 0,
                      filter: 'grayscale(0.3)'
                    }}>
                      <Avatar
                        style={{ width: '80px', height: '80px' }}
                        {...avatarOptions}
                      />
                    </div>

                    {/* Contenu du souvenir */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.15rem',
                        margin: '0 0 var(--spacing-xs) 0',
                        color: 'var(--color-text-primary)',
                        fontWeight: '700'
                      }}>
                        {memory.profileName}
                      </h3>

                      {/* Badge type de rupture */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        background: breakupInfo.color,
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginBottom: 'var(--spacing-xs)'
                      }}>
                        {breakupInfo.emoji} {breakupInfo.label}
                      </div>

                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--spacing-xs)'
                      }}>
                        💌 {memory.messageCount} message{memory.messageCount > 1 ? 's' : ''}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)'
                      }}>
                        <span>📦</span>
                        <span>{formatDate(memory.archivedDate)}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--color-romantic)', fontWeight: '600' }}>
                          Ouvrir →
                        </span>
                      </div>
                    </div>

                    {/* Bouton supprimer (visible au survol) */}
                    <button
                      onClick={(e) => handleDeleteMemory(memory.id, e)}
                      style={{
                        padding: '8px',
                        background: '#E74C3C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        e.target.style.background = '#C0392B';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#E74C3C';
                        e.target.style.transform = 'scale(1)';
                      }}
                      title="Supprimer ce souvenir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Statistiques et info */}
        {memories.length > 0 && (
          <div className="card" style={{
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            background: 'var(--color-cream)',
            border: '2px solid var(--color-gold)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>✨</div>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: '1.6'
            }}>
              Vous avez {memories.length} souvenir{memories.length > 1 ? 's' : ''} archivé{memories.length > 1 ? 's' : ''}<br />
              Ces conversations pourront être reprises si vous re-matchez !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
