import React, { useState, useEffect } from 'react';
import { loadBookData } from '../../utils/bookSystem';

export default function BookPage1({ user, isOwnBook }) {
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    if (user?.email) {
      const data = loadBookData(user.email);
      setBookData(data);
    }
  }, [user?.email]);

  if (!bookData) {
    return (
      <div style={{
        background: '#2a2a2a',
        borderRadius: '16px',
        padding: '30px',
        color: 'white',
        textAlign: 'center'
      }}>
        <p>Chargement...</p>
      </div>
    );
  }

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
          "{bookData.bio}"
        </p>
      </div>

      {/* Informations de base */}
      <div style={{
        display: 'grid',
        gap: '15px'
      }}>
        <InfoCard label="🎂 Âge" value={bookData.age} />
        <InfoCard label="📍 Ville" value={bookData.city} />
        <InfoCard label="💼 Activité" value={bookData.job} />
        <InfoCard label="🎵 Musique préférée" value={bookData.music} />
        <InfoCard label="🎬 Film préféré" value={bookData.movie} />
        <InfoCard label="🍕 Plat favori" value={bookData.food} />
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
          {bookData.about}
        </p>
      </div>

      {isOwnBook && (
        <div style={{
          marginTop: '25px',
          padding: '15px',
          background: 'linear-gradient(135deg, #667eea20, #764ba220)',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#888',
          fontSize: '0.9rem'
        }}>
          💡 Utilise le bouton "✏️ Éditer" en haut de l'Espace Perso pour modifier tes infos
        </div>
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
