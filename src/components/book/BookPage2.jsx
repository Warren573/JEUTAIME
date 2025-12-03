import React from 'react';

export default function BookPage2({ user, isOwnBook }) {
  const videos = user?.videos || [
    { id: 1, title: 'Mon dernier voyage 🌍', thumbnail: '🎥', duration: '2:34' },
    { id: 2, title: 'Ma passion en vidéo 🎨', thumbnail: '🎬', duration: '1:45' },
    { id: 3, title: 'Un moment fun 😂', thumbnail: '📹', duration: '0:52' }
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
        🎥 Mes Vidéos
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              border: '2px solid #333'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              {video.thumbnail}
            </div>
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>
                {video.title}
              </h4>
              <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                ⏱️ {video.duration}
              </p>
            </div>
          </div>
        ))}

        {isOwnBook && (
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              border: '2px dashed #667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => alert('📹 Ajouter une vidéo - À venir !')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#252525'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>➕</div>
              <p style={{ color: '#667eea', fontWeight: '600', margin: 0 }}>
                Ajouter une vidéo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
