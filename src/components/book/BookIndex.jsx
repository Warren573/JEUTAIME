import React, { useState } from 'react';
import BookPage1 from './BookPage1';
import BookPage2 from './BookPage2';
import BookPage3 from './BookPage3';
import BookPage4 from './BookPage4';
import BookPage5 from './BookPage5';
import BookPrivate from './BookPrivate';

export default function BookIndex({ user, isOwnBook = true, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    { component: BookPage1, title: '📖 Moi en vrai', locked: false },
    { component: BookPage2, title: '🎥 Vidéos', locked: false },
    { component: BookPage3, title: '📸 Album', locked: false },
    { component: BookPage4, title: '✍️ Notes & Pensées', locked: false },
    { component: BookPage5, title: '🎨 Moodboard', locked: false },
    { component: BookPrivate, title: '🔒 Ultra-Privé', locked: !isOwnBook && !user?.bookUnlocked }
  ];

  const CurrentPageComponent = pages[currentPage].component;
  const isLocked = pages[currentPage].locked;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid rgba(255,255,255,0.1)'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ← Retour
        </button>
        <h2 style={{
          margin: 0,
          color: 'white',
          fontSize: 'clamp(1.2rem, 4vw, 1.8rem)'
        }}>
          📖 Book de {user?.name || 'Utilisateur'}
        </h2>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Navigation des pages */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '15px',
        gap: '10px',
        background: '#1a1a1a',
        borderBottom: '1px solid #333'
      }}>
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            style={{
              padding: '10px 20px',
              background: currentPage === index
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : '#2a2a2a',
              border: currentPage === index ? '2px solid #667eea' : 'none',
              color: 'white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              opacity: page.locked ? 0.5 : 1
            }}
          >
            {page.title} {page.locked && '🔒'}
          </button>
        ))}
      </div>

      {/* Contenu de la page */}
      <div style={{
        flex: 1,
        padding: '20px',
        maxWidth: '768px',
        margin: '0 auto',
        width: '100%',
        animation: 'fadeIn 0.3s ease-in-out'
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {isLocked ? (
          <div style={{
            background: '#2a2a2a',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            border: '2px dashed #667eea'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              Page privée verrouillée
            </h3>
            <p style={{ color: '#888', marginBottom: '25px', lineHeight: '1.6' }}>
              Pour débloquer cette section, écris au moins <strong>10 lettres</strong> à {user?.name}.
              <br />
              Ou deviens membre Premium pour tout débloquer instantanément ! ✨
            </p>
            <button
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                color: '#000',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1rem'
              }}
              onClick={() => alert('🚀 Abonnement Premium - À venir !')}
            >
              👑 Devenir Premium
            </button>
          </div>
        ) : (
          <CurrentPageComponent user={user} isOwnBook={isOwnBook} />
        )}
      </div>

      {/* Pagination dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px',
        background: '#1a1a1a'
      }}>
        {pages.map((_, index) => (
          <div
            key={index}
            onClick={() => !pages[index].locked && setCurrentPage(index)}
            style={{
              width: currentPage === index ? '30px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: currentPage === index
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : '#444',
              cursor: pages[index].locked ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: pages[index].locked ? 0.3 : 1
            }}
          />
        ))}
      </div>
    </div>
  );
}
