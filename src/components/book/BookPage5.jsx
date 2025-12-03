import React from 'react';

export default function BookPage5({ user, isOwnBook }) {
  const moodItems = user?.moodboard || [
    { id: 1, type: 'quote', content: '"Vibes cosmiques only ✨"', color: '#667eea' },
    { id: 2, type: 'emoji', content: '🌙💫⭐', color: '#764ba2' },
    { id: 3, type: 'quote', content: 'Good vibes attract good tribes', color: '#FFA500' },
    { id: 4, type: 'emoji', content: '🎨🎭🎪', color: '#FF6B6B' },
    { id: 5, type: 'quote', content: 'Toujours authentique, jamais basique', color: '#4ECDC4' },
    { id: 6, type: 'emoji', content: '☕🍕🎧', color: '#95E1D3' }
  ];

  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '30px',
      color: 'white'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        marginBottom: '20px',
        color: '#667eea'
      }}>
        🎨 Mon Moodboard
      </h2>

      <p style={{
        color: '#888',
        marginBottom: '25px',
        fontSize: '0.95rem'
      }}>
        Un aperçu de mon univers, mes vibes et ce qui me définit ✨
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        {moodItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: item.color + '20',
              border: `2px solid ${item.color}`,
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 8px 20px ${item.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {item.type === 'emoji' ? (
              <div style={{ fontSize: '2rem' }}>{item.content}</div>
            ) : (
              <p style={{
                margin: 0,
                color: 'white',
                fontWeight: '600',
                fontSize: '0.95rem',
                fontStyle: 'italic'
              }}>
                {item.content}
              </p>
            )}
          </div>
        ))}

        {isOwnBook && (
          <div
            style={{
              background: '#1a1a1a',
              border: '2px dashed #667eea',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => alert('🎨 Ajouter un élément - À venir !')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#252525'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '5px' }}>➕</div>
              <p style={{ color: '#667eea', fontWeight: '600', margin: 0, fontSize: '0.85rem' }}>
                Ajouter
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Style indicators */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h4 style={{ color: '#FFA500', marginBottom: '15px' }}>
          🎭 Mon style
        </h4>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {['Créatif', 'Authentique', 'Fun', 'Deep', 'Aventurier'].map((tag) => (
            <span
              key={tag}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
