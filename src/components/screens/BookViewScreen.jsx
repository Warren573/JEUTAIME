import React, { useState } from 'react';
import BookPage1 from '../book/BookPage1';
import BookPage2 from '../book/BookPage2';
import BookPage3 from '../book/BookPage3';
import BookPage4 from '../book/BookPage4';
import BookPage5 from '../book/BookPage5';
import BookPrivate from '../book/BookPrivate';

export default function BookViewScreen({ user, isOwnBook = true, setScreen }) {
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
      width: '100%',
      minHeight: '100vh',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '3px double var(--color-brown-dark)',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button
          onClick={() => setScreen('home')}
          style={{
            background: 'rgba(74, 55, 40, 0.3)',
            border: '2px solid var(--color-brown-dark)',
            color: 'var(--color-brown-dark)',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}
        >
          ← Retour
        </button>
        <h2 style={{
          margin: 0,
          color: 'var(--color-brown-dark)',
          fontSize: 'clamp(1rem, 4vw, 1.5rem)',
          textAlign: 'center',
          flex: 1,
          paddingLeft: '10px',
          paddingRight: '10px',
          fontWeight: '700'
        }}>
          📖 Book de {user?.name || 'Utilisateur'}
        </h2>
        <div style={{ width: '70px' }}></div>
      </div>

      {/* Navigation des pages - Optimisée mobile */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '12px 10px',
        gap: '8px',
        background: 'var(--color-cream)',
        borderBottom: '2px solid var(--color-brown-light)',
        position: 'sticky',
        top: '60px',
        zIndex: 99,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-gold) var(--color-cream)'
      }}>
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            style={{
              padding: '8px 14px',
              background: currentPage === index
                ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                : 'var(--color-beige)',
              border: currentPage === index
                ? '2px solid var(--color-gold-dark)'
                : '2px solid var(--color-brown-light)',
              color: currentPage === index ? 'var(--color-brown-dark)' : 'var(--color-text-primary)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              opacity: page.locked ? 0.5 : 1,
              flexShrink: 0,
              boxShadow: currentPage === index ? 'var(--shadow-sm)' : 'none'
            }}
          >
            {page.title} {page.locked && '🔒'}
          </button>
        ))}
      </div>

      {/* Contenu de la page */}
      <div style={{
        flex: 1,
        padding: '15px',
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

          /* Custom scrollbar for tabs */
          div::-webkit-scrollbar {
            height: 4px;
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: var(--color-beige-light);
          }
          div::-webkit-scrollbar-thumb {
            background: var(--color-gold);
            border-radius: 2px;
          }
        `}</style>

        {isLocked ? (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: '16px',
            padding: '30px 20px',
            textAlign: 'center',
            border: '2px dashed var(--color-gold)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '15px', fontSize: '1.2rem' }}>
              Page privée verrouillée
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '25px', lineHeight: '1.6', fontSize: '0.9rem' }}>
              Pour débloquer cette section, écris au moins <strong>10 lettres</strong> à {user?.name}.
              <br />
              Ou deviens membre Premium pour tout débloquer instantanément ! ✨
            </p>
            <button
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                border: 'none',
                color: 'var(--color-brown-dark)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem',
                boxShadow: 'var(--shadow-sm)'
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
        gap: '8px',
        padding: '15px',
        background: 'var(--color-cream)',
        position: 'sticky',
        bottom: '60px',
        borderTop: '2px solid var(--color-brown-light)'
      }}>
        {pages.map((_, index) => (
          <div
            key={index}
            onClick={() => !pages[index].locked && setCurrentPage(index)}
            style={{
              width: currentPage === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentPage === index
                ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                : 'var(--color-brown-light)',
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
