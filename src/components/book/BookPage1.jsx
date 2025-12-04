import React from 'react';

export default function BookPage1({ user, isOwnBook }) {
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
        📖 Moi en vrai
      </h2>

      {/* Phrase d'ambiance */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea20, #764ba220)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        borderLeft: '4px solid #667eea'
      }}>
        <p style={{
          fontStyle: 'italic',
          fontSize: '1.1rem',
          margin: 0,
          color: '#ddd'
        }}>
          "{user?.bio || 'Ma phrase d\'ambiance à personnaliser...'}"
        </p>
      </div>

      {/* Informations de base */}
      <div style={{
        display: 'grid',
        gap: '15px'
      }}>
        <InfoCard label="🎂 Âge" value={user?.age || '25 ans'} />
        <InfoCard label="📍 Ville" value={user?.city || 'Paris'} />
        <InfoCard label="💼 Activité" value={user?.job || 'Étudiant·e'} />
        <InfoCard label="🎵 Musique préférée" value={user?.music || 'Indé / Électro'} />
        <InfoCard label="🎬 Film préféré" value={user?.movie || 'À compléter'} />
        <InfoCard label="🍕 Plat favori" value={user?.food || 'Pizza 🍕'} />
      </div>

      {/* Section "À propos de moi" */}
      <div style={{
        marginTop: '30px',
        background: '#1a1a1a',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '15px',
          color: '#FFA500'
        }}>
          ✨ À propos de moi
        </h3>
        <p style={{
          lineHeight: '1.7',
          color: '#ccc'
        }}>
          {user?.about ||
            'Passionné·e par la vie, les rencontres et les moments authentiques. ' +
            'Toujours partant·e pour une discussion deep à 3h du matin ou une aventure improvisée. ' +
            'J\'adore les gens qui assument leur bizarrerie ✨'}
        </p>
      </div>

      {isOwnBook && (
        <button
          style={{
            marginTop: '25px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%'
          }}
          onClick={() => alert('✏️ Éditeur de profil - À venir !')}
        >
          ✏️ Modifier mes informations
        </button>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '15px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ color: '#888', fontWeight: '600' }}>{label}</span>
      <span style={{ color: 'white', fontWeight: '600' }}>{value}</span>
    </div>
  );
}
