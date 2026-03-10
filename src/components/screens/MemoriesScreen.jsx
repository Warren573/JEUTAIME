import React, { useState } from 'react';

const FILTER_CATEGORIES = [
  { id: 'all', icon: '📦' },
  { id: 'messages', icon: '💬' },
  { id: 'cocktails', icon: '🍸' },
  { id: 'photos', icon: '📷' },
  { id: 'lettres', icon: '💌' },
  { id: 'moments', icon: '✨' },
];

const MEMORIES = [
  {
    id: 1,
    icon: '🎉',
    title: '🎉 Bienvenue sur JeuTaime',
    description: 'Premier souvenir enregistré automatiquement',
    date: '25 févr. 2026',
    borderColor: '#f5c842',
    background: '#fffde7',
    category: 'moments',
    favorite: false,
  },
  {
    id: 2,
    icon: '💌',
    title: 'Message de Sophie',
    description: 'Merci pour cette belle conversation...',
    date: '26 févr. 2026',
    borderColor: '#f48fb1',
    background: '#fce4ec',
    category: 'lettres',
    favorite: false,
  },
];

const TOTAL_SLOTS = 10;

export default function MemoriesScreen({ currentUser, setScreen }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [memories, setMemories] = useState(MEMORIES);

  const favorisCount = memories.filter(m => m.favorite).length;
  const usedSlots = memories.length;
  const availableSlots = TOTAL_SLOTS - usedSlots;
  const progressPct = (usedSlots / TOTAL_SLOTS) * 100;

  const filteredMemories = activeFilter === 'all'
    ? memories
    : memories.filter(m => m.category === activeFilter);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setMemories(prev => prev.map(m => m.id === id ? { ...m, favorite: !m.favorite } : m));
  };

  if (selectedMemory) {
    return (
      <div style={{
        minHeight: '100dvh',
        maxHeight: '100dvh',
        overflowY: 'auto',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
        background: 'var(--color-beige-light)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header souvenir detail */}
        <div style={{
          background: 'linear-gradient(135deg, #7b6cb0 0%, #a78bca 100%)',
          padding: 'var(--spacing-lg)',
          paddingTop: 'calc(var(--spacing-lg) + env(safe-area-inset-top))',
          position: 'relative',
          textAlign: 'center',
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
              border: '2px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{selectedMemory.icon}</div>
          <h2 style={{ color: 'white', fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.4rem' }}>
            {selectedMemory.title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.85rem' }}>
            {selectedMemory.date}
          </p>
        </div>

        {/* Contenu */}
        <div style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{
            background: selectedMemory.background,
            border: `3px solid ${selectedMemory.borderColor}`,
            borderRadius: '16px',
            padding: 'var(--spacing-xl)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.8',
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              margin: 0,
            }}>
              {selectedMemory.description}
            </p>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <button
              onClick={() => toggleFavorite(selectedMemory.id, { stopPropagation: () => {} })}
              style={{
                background: selectedMemory.favorite ? '#f48fb1' : 'white',
                border: '2px solid #f48fb1',
                borderRadius: '24px',
                padding: '10px 24px',
                cursor: 'pointer',
                color: selectedMemory.favorite ? 'white' : '#f48fb1',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}
            >
              {selectedMemory.favorite ? '❤️ Retiré des favoris' : '🤍 Ajouter aux favoris'}
            </button>
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
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ===== HEADER VIOLET ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #7b6cb0 0%, #a78bca 100%)',
        padding: 'var(--spacing-lg) var(--spacing-md)',
        paddingTop: 'calc(var(--spacing-lg) + env(safe-area-inset-top))',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎁</div>
        <h1 style={{
          color: 'white',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.75rem',
          margin: '0 0 6px',
        }}>
          Boîte à Souvenirs
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.9rem',
          margin: '0 0 var(--spacing-lg)',
          lineHeight: '1.4',
        }}>
          Conserve tes meilleurs moments,<br />conversations et photos
        </p>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          marginBottom: 'var(--spacing-md)',
        }}>
          {[
            { label: 'Souvenirs', value: usedSlots },
            { label: 'Emplacements', value: TOTAL_SLOTS },
            { label: 'Favoris', value: favorisCount },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '10px 6px',
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Barre de progression */}
        <div style={{
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '8px',
          height: '8px',
          overflow: 'hidden',
          marginBottom: '6px',
        }}>
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            background: '#4caf50',
            borderRadius: '8px',
            transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: 0 }}>
          {availableSlots} emplacements disponibles
        </p>
      </div>

      {/* Galerie header */}
      <div style={{
        margin: 'var(--spacing-md) var(--spacing-md) 0',
        padding: '10px 16px',
        background: '#c8860a',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '700',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span>🖼</span> Galerie
      </div>

      {/* ===== CONTENU GALERIE ===== */}
      <div style={{ padding: 'var(--spacing-md)' }}>

          {/* Titre section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: 'var(--spacing-sm)',
          }}>
            <span style={{ fontSize: '1.2rem' }}>📦</span>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              margin: 0,
              color: 'var(--color-text-primary)',
            }}>
              Tous les souvenirs
            </h2>
          </div>

          {/* Filtres catégories */}
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: 'var(--spacing-md)',
            scrollbarWidth: 'none',
          }}>
            {FILTER_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: `2px solid ${activeFilter === cat.id ? 'var(--color-brown-dark)' : 'var(--color-tan)'}`,
                  background: activeFilter === cat.id ? 'var(--color-brown-dark)' : 'white',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {cat.icon}
              </button>
            ))}
          </div>

          {/* Grille de cartes */}
          {filteredMemories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-light)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📭</div>
              <p style={{ margin: 0 }}>Aucun souvenir dans cette catégorie</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              {filteredMemories.map(memory => (
                <div
                  key={memory.id}
                  onClick={() => setSelectedMemory(memory)}
                  style={{
                    background: memory.background,
                    border: `3px solid ${memory.borderColor}`,
                    borderRadius: '16px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    minHeight: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Bouton favori */}
                  <button
                    onClick={e => toggleFavorite(memory.id, e)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(255,255,255,0.7)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {memory.favorite ? '❤️' : '🤍'}
                  </button>

                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{memory.icon}</div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    margin: '0 0 6px',
                    lineHeight: '1.3',
                  }}>
                    {memory.title}
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 6px',
                    lineHeight: '1.3',
                  }}>
                    {memory.description}
                  </p>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-text-light)',
                    fontWeight: '500',
                  }}>
                    {memory.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

    </div>
  );
}
