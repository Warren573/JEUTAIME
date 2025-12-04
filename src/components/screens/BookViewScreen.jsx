import React, { useEffect, useState } from 'react';
import { loadBookData } from '../../utils/bookSystem';

export default function BookViewScreen({ currentUser, setScreen }) {
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    if (currentUser?.email) {
      const data = loadBookData(currentUser.email);
      setBookData(data);
    }
  }, [currentUser?.email]);

  if (!bookData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-primary)' }}>
        Chargement...
      </div>
    );
  }

  const {
    bio, age, city, job, music, movie, food,
    about, mood, status,
    photos = [],
    backgroundColor = '#1a1a1a',
    textColor = '#ffffff',
    accentColor = '#667eea',
    coverImage,
    song,
    favorites = {},
    topFriends = [],
    gifs = [],
    stickers = [],
    quiz = {},
    visitors = 0
  } = bookData;

  return (
    <div style={{
      minHeight: '100vh',
      background: backgroundColor,
      color: textColor,
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
        padding: '20px',
        borderBottom: '3px solid var(--color-tan)',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => setScreen('home')}
            style={{
              background: 'var(--color-brown)',
              border: 'none',
              color: 'var(--color-cream)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            ←
          </button>
          <h1 style={{
            margin: 0,
            color: 'var(--color-brown-dark)',
            fontSize: '1.5rem',
            fontFamily: 'var(--font-heading)',
            flex: 1
          }}>
            📖 Mon Book
          </h1>
          <button
            onClick={() => setScreen('book-editor')}
            style={{
              background: 'linear-gradient(135deg, var(--color-romantic-light), var(--color-romantic))',
              border: '2px solid var(--color-romantic)',
              color: 'var(--color-cream)',
              padding: '10px 16px',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            ✏️ Éditer
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Cover Image */}
        {coverImage && (
          <div style={{ marginBottom: '20px', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img src={coverImage} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Header avec bio */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--border-radius-lg)',
          border: `2px solid ${accentColor}`,
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', margin: '0 0 15px 0', color: accentColor, fontWeight: '600' }}>
            "{bio}"
          </p>
          {mood && <p style={{ margin: '5px 0', fontSize: '0.95rem' }}>{mood}</p>}
          {status && <p style={{ margin: '5px 0', fontSize: '0.95rem', opacity: 0.8 }}>{status}</p>}
          {stickers.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '1.5rem' }}>
              {stickers.join(' ')}
            </div>
          )}
        </div>

        {/* Infos de base */}
        <Section title="📖 Moi en vrai" accentColor={accentColor}>
          <InfoGrid>
            <InfoItem label="🎂 Âge" value={age} />
            <InfoItem label="📍 Ville" value={city} />
            <InfoItem label="💼 Activité" value={job} />
            <InfoItem label="🎵 Musique" value={music} />
            <InfoItem label="🎬 Film" value={movie} />
            <InfoItem label="🍕 Plat" value={food} />
          </InfoGrid>
        </Section>

        {/* À propos */}
        {about && (
          <Section title="✨ À propos" accentColor={accentColor}>
            <p style={{ lineHeight: '1.6', margin: 0 }}>{about}</p>
          </Section>
        )}

        {/* Citation */}
        {favorites.quote && (
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--border-radius-md)',
            margin: '20px 0',
            borderLeft: `4px solid ${accentColor}`,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', margin: 0 }}>{favorites.quote}</p>
          </div>
        )}

        {/* Mes Favoris */}
        {(favorites.books || favorites.series || favorites.hobbies) && (
          <Section title="💖 Mes favoris" accentColor={accentColor}>
            {favorites.books && <FavoriteItem icon="📚" label="Livres" value={favorites.books} />}
            {favorites.series && <FavoriteItem icon="📺" label="Séries" value={favorites.series} />}
            {favorites.hobbies && <FavoriteItem icon="🎯" label="Hobbies" value={favorites.hobbies} />}
          </Section>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <Section title="📸 Ma galerie" accentColor={accentColor}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {photos.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: 'var(--border-radius-md)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Top Friends */}
        {topFriends.length > 0 && (
          <Section title="👥 Mon Top Friends" accentColor={accentColor}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {topFriends.map((friend, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 16px',
                    background: accentColor,
                    borderRadius: '20px',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {friend}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* GIFs */}
        {gifs.length > 0 && (
          <Section title="🎬 Mes GIFs" accentColor={accentColor}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
              {gifs.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`GIF ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: 'var(--border-radius-md)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Quiz */}
        {(quiz.q1?.question || quiz.q2?.question || quiz.q3?.question) && (
          <Section title="❓ Quiz : Connais-tu bien mon Book ?" accentColor={accentColor}>
            {['q1', 'q2', 'q3'].map((qNum) => {
              const q = quiz[qNum];
              if (!q?.question) return null;
              return (
                <div
                  key={qNum}
                  style={{
                    marginBottom: '15px',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 'var(--border-radius-md)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>{q.question}</p>
                  <details style={{ cursor: 'pointer' }}>
                    <summary style={{ color: accentColor, fontWeight: '600' }}>Voir la réponse</summary>
                    <p style={{ marginTop: '8px', paddingLeft: '10px', borderLeft: `2px solid ${accentColor}` }}>
                      {q.answer}
                    </p>
                  </details>
                </div>
              );
            })}
          </Section>
        )}

        {/* Musique */}
        {song && (
          <Section title="🎵 Ma musique d'ambiance" accentColor={accentColor}>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${song}?autoplay=0`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-md)' }}
            />
          </Section>
        )}

        {/* Compteur de visiteurs */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          marginTop: '40px',
          opacity: 0.7
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>👀 {visitors} visiteurs</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, accentColor }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2
        style={{
          color: accentColor,
          fontSize: '1.3rem',
          marginBottom: '15px',
          borderBottom: `2px solid ${accentColor}`,
          paddingBottom: '8px',
          fontFamily: 'var(--font-heading)'
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoGrid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
      {children}
    </div>
  );
}

function InfoItem({ label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: '0 0 4px 0', fontWeight: '600' }}>{label}</p>
      <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{value}</p>
    </div>
  );
}

function FavoriteItem({ icon, label, value }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: '0 0 4px 0', fontWeight: '600' }}>
        {icon} {label}
      </p>
      <p style={{ margin: 0, lineHeight: '1.5' }}>{value}</p>
    </div>
  );
}
