import React from 'react';

export default function BookPreview({ bookData, onClose }) {
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
  } = bookData || {};

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={previewContainerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>👁️ Aperçu du Book</h2>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <div style={{ ...contentStyle, background: backgroundColor, color: textColor }}>
          {/* Cover Image */}
          {coverImage && (
            <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={coverImage} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            </div>
          )}

          {/* Header avec bio */}
          <div style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', margin: '0 0 15px 0', color: accentColor }}>"{bio}"</p>
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
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', margin: '20px 0', borderLeft: `4px solid ${accentColor}` }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                {photos.map((url, index) => (
                  <img key={index} src={url} alt={`Photo ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                ))}
              </div>
            </Section>
          )}

          {/* Top Friends */}
          {topFriends.length > 0 && (
            <Section title="👥 Mon Top Friends" accentColor={accentColor}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {topFriends.map((friend, index) => (
                  <div key={index} style={{ padding: '8px 16px', background: accentColor, borderRadius: '20px', fontWeight: '600' }}>
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
                  <img key={index} src={url} alt={`GIF ${index + 1}`} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
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
                  <div key={qNum} style={{ marginBottom: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                    <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>{q.question}</p>
                    <details style={{ cursor: 'pointer' }}>
                      <summary style={{ color: accentColor, fontWeight: '600' }}>Voir la réponse</summary>
                      <p style={{ marginTop: '8px', paddingLeft: '10px', borderLeft: `2px solid ${accentColor}` }}>{q.answer}</p>
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
                style={{ borderRadius: '8px' }}
              />
            </Section>
          )}

          {/* Compteur de visiteurs */}
          <div style={{ textAlign: 'center', padding: '20px', marginTop: '20px', opacity: 0.7 }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>👀 {visitors} visiteurs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, accentColor }) {
  return (
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ color: accentColor, fontSize: '1.2rem', marginBottom: '15px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '8px' }}>
        {title}
      </h3>
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
    <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '0 0 4px 0' }}>{label}</p>
      <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{value}</p>
    </div>
  );
}

function FavoriteItem({ icon, label, value }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <p style={{ fontSize: '0.9rem', opacity: 0.7, margin: '0 0 4px 0' }}>{icon} {label}</p>
      <p style={{ margin: 0, lineHeight: '1.5' }}>{value}</p>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10001,
  padding: '20px'
};

const previewContainerStyle = {
  width: '100%',
  maxWidth: '800px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
};

const headerStyle = {
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const closeButtonStyle = {
  background: 'rgba(255,255,255,0.2)',
  border: 'none',
  color: 'white',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '1.5rem'
};

const contentStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '30px'
};
