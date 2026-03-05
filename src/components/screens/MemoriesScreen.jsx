import React, { useState } from 'react';

export default function MemoriesScreen({ currentUser, setScreen }) {
  const [selectedMemory, setSelectedMemory] = useState(null);

  // Souvenirs - certains verrouillés, d'autres débloqués
  const memories = [
    {
      id: 1,
      title: 'Lettre touchante de Camille',
      icon: '✉️',
      locked: false,
      date: 'Il y a 3 jours',
      content: 'Cette lettre magnifique où Camille m\'a ouvert son cœur...',
      fullContent: 'Je me souviens encore de cette conversation tardive où nous avons partagé nos rêves les plus fous. Camille a une façon unique de voir le monde, et cette lettre en est la preuve éclatante.'
    },
    {
      id: 2,
      title: 'Notre première discussion',
      icon: '💬',
      locked: false,
      date: 'Il y a 1 semaine',
      content: 'Le début d\'une belle histoire...',
      fullContent: 'Cette première conversation au Salon Romantique restera gravée dans ma mémoire. Les mots coulaient naturellement, comme si nous nous connaissions depuis toujours.'
    },
    {
      id: 3,
      title: 'Elle me remonte le moral',
      icon: '💝',
      locked: true,
      date: 'Bientôt débloqué',
      requirement: 'Échange 5 lettres de plus'
    },
    {
      id: 4,
      title: 'Il me lit ses poèmes',
      icon: '📜',
      locked: true,
      date: 'Bientôt débloqué',
      requirement: 'Atteindre 1000 points'
    }
  ];

  const handleOpenMemory = (memory) => {
    if (!memory.locked) {
      setSelectedMemory(memory);
    }
  };

  if (selectedMemory) {
    return (
      <div style={{
        minHeight: '100dvh',
        maxHeight: '100dvh',
        overflowY: 'auto',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
        background: 'var(--color-brown-dark)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Bouton retour */}
        <div style={{
          padding: 'var(--spacing-lg)',
          paddingTop: 'calc(var(--spacing-lg) + env(safe-area-inset-top))',
          background: 'var(--color-brown-darker)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}>
          <button
            onClick={() => setSelectedMemory(null)}
            style={{
              position: 'absolute',
              top: 'calc(env(safe-area-inset-top) + 12px)',
              left: '12px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '3px solid var(--color-gold)',
              background: 'white',
              color: 'var(--color-brown-dark)',
              fontSize: '20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 100,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-gold)';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ←
          </button>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            color: 'var(--color-gold)',
            textAlign: 'center',
            margin: 0,
            paddingLeft: '50px',
            paddingRight: '50px'
          }}>
            📖 Souvenir
          </h2>
        </div>

        {/* Contenu du souvenir */}
        <div style={{ padding: 'var(--spacing-lg)' }}>
          <div className="card" style={{
            background: 'var(--color-cream)',
            padding: 'var(--spacing-xl)',
            border: '3px solid var(--color-tan)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{
              fontSize: '4rem',
              textAlign: 'center',
              marginBottom: 'var(--spacing-lg)'
            }}>
              {selectedMemory.icon}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              textAlign: 'center',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
              borderBottom: '2px solid var(--color-text-primary)',
              paddingBottom: 'var(--spacing-sm)'
            }}>
              {selectedMemory.title}
            </h2>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-light)',
              textAlign: 'center',
              marginBottom: 'var(--spacing-lg)'
            }}>
              {selectedMemory.date}
            </p>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.8',
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              textAlign: 'justify'
            }}>
              {selectedMemory.fullContent}
            </p>
            <div style={{
              marginTop: 'var(--spacing-xl)',
              textAlign: 'center',
              padding: 'var(--spacing-lg)',
              background: 'var(--color-beige)',
              borderRadius: 'var(--border-radius-md)',
              border: '2px solid var(--color-tan)'
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                fontWeight: '500'
              }}>
                ❤️ Ce souvenir restera précieux pour toujours
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
      background: 'var(--color-brown-dark)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* En-tête Boîte à souvenirs */}
      <div style={{
        background: 'var(--color-brown-darker)',
        padding: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-lg)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        {setScreen && (
          <button
            onClick={() => setScreen('letters')}
            style={{
              position: 'absolute',
              top: 'var(--spacing-md)',
              left: 'var(--spacing-md)',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-cream)',
              fontSize: '22px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ←
          </button>
        )}
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--spacing-md)'
        }}>
          {memories.map((memory) => (
            <div
              key={memory.id}
              onClick={() => handleOpenMemory(memory)}
              className="card"
              style={{
                cursor: memory.locked ? 'not-allowed' : 'pointer',
                padding: 'var(--spacing-lg)',
                background: memory.locked
                  ? 'var(--color-brown)'
                  : 'var(--color-cream)',
                border: memory.locked
                  ? '3px dashed var(--color-brown-light)'
                  : '3px solid var(--color-tan)',
                boxShadow: memory.locked ? 'var(--shadow-sm)' : 'var(--shadow-lg)',
                transition: 'all var(--transition-normal)',
                position: 'relative',
                opacity: memory.locked ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!memory.locked) {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }
              }}
              onMouseLeave={(e) => {
                if (!memory.locked) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-lg)'
              }}>
                {/* Icône du souvenir */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: memory.locked
                    ? 'var(--color-brown-light)'
                    : 'var(--color-beige)',
                  borderRadius: 'var(--border-radius-md)',
                  border: memory.locked
                    ? '2px solid var(--color-brown-dark)'
                    : '2px solid var(--color-tan)',
                  fontSize: '2.5rem',
                  position: 'relative',
                  filter: memory.locked ? 'grayscale(1)' : 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {memory.locked && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '2rem',
                      background: 'var(--color-brown-darker)',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid var(--color-gold)'
                    }}>
                      🔒
                    </div>
                  )}
                  {!memory.locked && memory.icon}
                </div>

                {/* Contenu du souvenir */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.15rem',
                    margin: '0 0 var(--spacing-xs) 0',
                    color: memory.locked ? 'var(--color-tan)' : 'var(--color-text-primary)',
                    fontWeight: '700'
                  }}>
                    {memory.title}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: memory.locked ? 'var(--color-brown-light)' : 'var(--color-text-secondary)',
                    margin: '0 0 var(--spacing-xs) 0',
                    lineHeight: '1.4',
                    fontStyle: 'italic'
                  }}>
                    {memory.locked ? memory.requirement : memory.content}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    fontSize: '0.8rem',
                    color: memory.locked ? 'var(--color-brown-light)' : 'var(--color-text-light)'
                  }}>
                    {memory.locked ? (
                      <>
                        <span>🔒</span>
                        <span>{memory.date}</span>
                      </>
                    ) : (
                      <>
                        <span>❤️</span>
                        <span>{memory.date}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--color-romantic)', fontWeight: '600' }}>
                          Voir le souvenir →
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message encourageant */}
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
            Continue d'échanger des lettres et de gagner des points<br />
            pour débloquer de nouveaux souvenirs précieux !
          </p>
        </div>
      </div>
    </div>
  );
}
