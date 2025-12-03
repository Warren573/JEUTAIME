import React, { useState, useEffect } from 'react';
import { loadBookData } from '../../utils/bookSystem';

export default function BookPrivate({ user, isOwnBook }) {
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

  const privateContent = bookData.privateContent ||
    'Ce que peu de gens savent sur moi : j\'adore les conversations profondes à 3h du matin, ' +
    'quand tout le monde dort et que les masques tombent. ✨\n\n' +
    'Mes passions secrètes, mes rêves, mes peurs... Tout ce qui fait de moi qui je suis vraiment.';

  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '30px',
      color: 'white'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{ fontSize: '2.5rem' }}>🔒</div>
        <div>
          <h2 style={{
            fontSize: '1.8rem',
            margin: 0,
            color: '#667eea'
          }}>
            Section Ultra-Privée
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '0.9rem' }}>
            {isOwnBook ? 'Tes secrets les mieux gardés' : `Débloqué après 10 lettres ✨`}
          </p>
        </div>
      </div>

      {/* Contenu privé */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '20px',
        borderLeft: '4px solid #667eea'
      }}>
        <p style={{
          margin: 0,
          color: '#ddd',
          lineHeight: '1.8',
          fontSize: '1rem',
          whiteSpace: 'pre-wrap'
        }}>
          {privateContent}
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
          💡 Utilise le bouton "✏️ Éditer" en haut de l'Espace Perso pour modifier cette section
        </div>
      )}

      {!isOwnBook && (
        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: '#1a1a1a',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px dashed #FFD700'
        }}>
          <p style={{ margin: 0, color: '#FFD700', fontWeight: '600' }}>
            🔓 Cette section a été débloquée grâce à vos échanges ! ✨
          </p>
        </div>
      )}
    </div>
  );
}
