import React from 'react';

export default function BookPage3({ user, isOwnBook }) {
  const photos = user?.photos || [
    { id: 1, emoji: '🌅', caption: 'Lever de soleil magique' },
    { id: 2, emoji: '🎉', caption: 'Soirée inoubliable' },
    { id: 3, emoji: '🏔️', caption: 'Aventure en montagne' },
    { id: 4, emoji: '🍜', caption: 'Food porn' },
    { id: 5, emoji: '✈️', caption: 'Mode voyage' },
    { id: 6, emoji: '🎨', caption: 'Créativité' }
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
        📸 Mon Album Photo
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px'
      }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              aspectRatio: '1',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              padding: '15px',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
              {photo.emoji}
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              color: 'white',
              fontWeight: '600'
            }}>
              {photo.caption}
            </p>
          </div>
        ))}

        {isOwnBook && (
          <div
            style={{
              aspectRatio: '1',
              background: '#1a1a1a',
              borderRadius: '12px',
              border: '2px dashed #667eea',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => alert('📷 Ajouter une photo - À venir !')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#252525'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>➕</div>
            <p style={{ color: '#667eea', fontWeight: '600', margin: 0, fontSize: '0.85rem' }}>
              Ajouter
            </p>
          </div>
        )}
      </div>

      <p style={{
        marginTop: '25px',
        textAlign: 'center',
        color: '#888',
        fontSize: '0.9rem'
      }}>
        {photos.length} photo{photos.length > 1 ? 's' : ''} • {isOwnBook ? 'Ton album' : `Album de ${user?.name}`}
      </p>
    </div>
  );
}
