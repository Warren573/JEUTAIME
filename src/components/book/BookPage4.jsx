import React from 'react';

export default function BookPage4({ user, isOwnBook }) {
  const notes = user?.notes || [
    { id: 1, date: '2025-03-15', title: 'Réflexions du jour', content: 'Parfois, les meilleures conversations sont celles qui commencent sans raison et qui finissent à 4h du matin...' },
    { id: 2, date: '2025-03-10', title: 'Citation favorite', content: '"La vie, c\'est comme une bicyclette, il faut avancer pour ne pas perdre l\'équilibre." - Albert Einstein' },
    { id: 3, date: '2025-03-05', title: 'Mood actuel', content: 'Envie de nouveauté, de rencontres authentiques et de moments qui marquent. ✨' }
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
        ✍️ Notes & Pensées
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '20px',
              borderLeft: '4px solid #667eea',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h4 style={{
                margin: 0,
                color: '#FFA500',
                fontSize: '1.1rem'
              }}>
                {note.title}
              </h4>
              <span style={{
                color: '#888',
                fontSize: '0.85rem'
              }}>
                📅 {note.date}
              </span>
            </div>
            <p style={{
              margin: 0,
              color: '#ddd',
              lineHeight: '1.7',
              fontSize: '0.95rem'
            }}>
              {note.content}
            </p>
          </div>
        ))}

        {isOwnBook && (
          <button
            style={{
              padding: '15px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onClick={() => alert('✍️ Ajouter une note - À venir !')}
          >
            <span style={{ fontSize: '1.5rem' }}>➕</span>
            Ajouter une note
          </button>
        )}
      </div>

      {!isOwnBook && notes.length === 0 && (
        <p style={{
          textAlign: 'center',
          color: '#888',
          fontStyle: 'italic',
          padding: '40px 20px'
        }}>
          Aucune note pour le moment...
        </p>
      )}
    </div>
  );
}
