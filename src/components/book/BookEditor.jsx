import React, { useState, useEffect } from 'react';
import { loadBookData, saveBookData } from '../../utils/bookSystem';
import BookPreview from './BookPreview';

export default function BookEditor({ user, onClose, onSave }) {
  const [bookData, setBookData] = useState(null);
  const [activeTab, setActiveTab] = useState('infos');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (user?.email) {
      const data = loadBookData(user.email);
      setBookData(data);
    }
  }, [user?.email]);

  const handleChange = (field, value) => {
    setBookData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (user?.email && bookData) {
      const success = saveBookData(user.email, bookData);
      if (success) {
        setHasChanges(false);
        alert('✅ Book sauvegardé !');
        if (onSave) onSave(bookData);
      } else {
        alert('❌ Erreur lors de la sauvegarde');
      }
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('Modifications non sauvegardées. Quitter ?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!bookData) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <p style={{ color: 'white', textAlign: 'center' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>✏️ Éditer mon Book</h2>
          <button onClick={handleClose} style={closeButtonStyle}>✕</button>
        </div>

        <div style={tabsContainerStyle}>
          <TabButton active={activeTab === 'infos'} onClick={() => setActiveTab('infos')} icon="📖" label="Infos" />
          <TabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon="✨" label="À propos" />
          <TabButton active={activeTab === 'photos'} onClick={() => setActiveTab('photos')} icon="📸" label="Photos" />
          <TabButton active={activeTab === 'style'} onClick={() => setActiveTab('style')} icon="🎨" label="Style" />
          <TabButton active={activeTab === 'extras'} onClick={() => setActiveTab('extras')} icon="🎁" label="Extras" />
          <TabButton active={activeTab === 'private'} onClick={() => setActiveTab('private')} icon="🔒" label="Privé" />
        </div>

        <div style={contentStyle}>
          {activeTab === 'infos' && <InfosTab bookData={bookData} onChange={handleChange} />}
          {activeTab === 'about' && <AboutTab bookData={bookData} onChange={handleChange} />}
          {activeTab === 'photos' && <PhotosTab bookData={bookData} setBookData={setBookData} setHasChanges={setHasChanges} />}
          {activeTab === 'style' && <StyleTab bookData={bookData} onChange={handleChange} />}
          {activeTab === 'extras' && <ExtrasTab bookData={bookData} onChange={handleChange} setBookData={setBookData} setHasChanges={setHasChanges} />}
          {activeTab === 'private' && <PrivateTab bookData={bookData} onChange={handleChange} />}
        </div>

        <div style={actionsStyle}>
          {hasChanges && (
            <span style={{ color: '#FFA500', fontSize: '0.9rem', marginRight: 'auto' }}>
              ⚠️ Non sauvegardé
            </span>
          )}
          <button onClick={() => setShowPreview(true)} style={previewButtonStyle}>👁️ Aperçu</button>
          <button onClick={handleClose} style={cancelButtonStyle}>Annuler</button>
          <button onClick={handleSave} style={saveButtonStyle}>💾 Sauvegarder</button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <BookPreview
          bookData={bookData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

function InfosTab({ bookData, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <InputField label="💬 Phrase d'ambiance" value={bookData.bio} onChange={(v) => onChange('bio', v)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <InputField label="🎂 Âge" value={bookData.age} onChange={(v) => onChange('age', v)} />
        <InputField label="📍 Ville" value={bookData.city} onChange={(v) => onChange('city', v)} />
      </div>
      <InputField label="💼 Activité" value={bookData.job} onChange={(v) => onChange('job', v)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <InputField label="🎵 Musique" value={bookData.music} onChange={(v) => onChange('music', v)} />
        <InputField label="🎬 Film" value={bookData.movie} onChange={(v) => onChange('movie', v)} />
      </div>
      <InputField label="🍕 Plat favori" value={bookData.food} onChange={(v) => onChange('food', v)} />
    </div>
  );
}

function AboutTab({ bookData, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={labelStyle}>✨ À propos de moi</label>
        <textarea
          value={bookData.about || ''}
          onChange={(e) => onChange('about', e.target.value)}
          placeholder="Écris sur toi..."
          style={{ ...inputStyle, minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <InputField label="😊 Mon humeur" value={bookData.mood || ''} onChange={(v) => onChange('mood', v)} />
        <InputField label="💭 Mon statut" value={bookData.status || ''} onChange={(v) => onChange('status', v)} />
      </div>

      <div>
        <label style={labelStyle}>💬 Ma citation favorite</label>
        <textarea
          value={bookData.favorites?.quote || ''}
          onChange={(e) => {
            const newFavorites = { ...(bookData.favorites || {}), quote: e.target.value };
            onChange('favorites', newFavorites);
          }}
          placeholder="Une citation qui te représente..."
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={labelStyle}>📚 Mes livres préférés</label>
          <textarea
            value={bookData.favorites?.books || ''}
            onChange={(e) => {
              const newFavorites = { ...(bookData.favorites || {}), books: e.target.value };
              onChange('favorites', newFavorites);
            }}
            placeholder="Ex: Harry Potter, 1984..."
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
        <div>
          <label style={labelStyle}>📺 Mes séries favorites</label>
          <textarea
            value={bookData.favorites?.series || ''}
            onChange={(e) => {
              const newFavorites = { ...(bookData.favorites || {}), series: e.target.value };
              onChange('favorites', newFavorites);
            }}
            placeholder="Ex: Breaking Bad, Friends..."
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>🎯 Mes hobbies / passions</label>
        <textarea
          value={bookData.favorites?.hobbies || ''}
          onChange={(e) => {
            const newFavorites = { ...(bookData.favorites || {}), hobbies: e.target.value };
            onChange('favorites', newFavorites);
          }}
          placeholder="Ce que j'aime faire..."
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>
    </div>
  );
}

function PhotosTab({ bookData, setBookData, setHasChanges }) {
  const [newPhotoUrl, setNewPhotoUrl] = React.useState('');

  const photos = bookData.photos || [];

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setBookData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), newPhotoUrl.trim()]
      }));
      setHasChanges(true);
      setNewPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index) => {
    setBookData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={labelStyle}>📸 Ajouter une photo (URL)</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPhoto()}
            placeholder="https://exemple.com/photo.jpg"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={handleAddPhoto}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold-dark))',
              border: '2px solid var(--color-gold-dark)',
              color: 'var(--color-brown-dark)',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--transition-normal)'
            }}
          >
            ➕ Ajouter
          </button>
        </div>
      </div>

      {photos.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '15px',
          marginTop: '10px'
        }}>
          {photos.map((url, index) => (
            <div key={index} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{
                display: 'none',
                width: '100%',
                height: '150px',
                background: 'var(--color-beige)',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-light)',
                fontSize: '0.85rem'
              }}>
                ❌ Image non disponible
              </div>
              <button
                onClick={() => handleRemovePhoto(index)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontSize: '0.95rem'
        }}>
          📸 Aucune photo pour le moment. Ajoute l'URL d'une image !
        </div>
      )}
    </div>
  );
}

function StyleTab({ bookData, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={labelStyle}>🖼️ Image de couverture (URL)</label>
        <input
          type="text"
          value={bookData.coverImage || ''}
          onChange={(e) => onChange('coverImage', e.target.value)}
          placeholder="https://exemple.com/cover.jpg"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
        <div>
          <label style={labelStyle}>🎨 Couleur de fond</label>
          <input
            type="color"
            value={bookData.backgroundColor || '#1a1a1a'}
            onChange={(e) => onChange('backgroundColor', e.target.value)}
            style={{ ...inputStyle, height: '50px', cursor: 'pointer' }}
          />
        </div>
        <div>
          <label style={labelStyle}>📝 Couleur du texte</label>
          <input
            type="color"
            value={bookData.textColor || '#ffffff'}
            onChange={(e) => onChange('textColor', e.target.value)}
            style={{ ...inputStyle, height: '50px', cursor: 'pointer' }}
          />
        </div>
        <div>
          <label style={labelStyle}>✨ Couleur d'accent</label>
          <input
            type="color"
            value={bookData.accentColor || '#667eea'}
            onChange={(e) => onChange('accentColor', e.target.value)}
            style={{ ...inputStyle, height: '50px', cursor: 'pointer' }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>🎵 Musique d'ambiance (YouTube ID)</label>
        <input
          type="text"
          value={bookData.song || ''}
          onChange={(e) => onChange('song', e.target.value)}
          placeholder="Ex: dQw4w9WgXcQ"
          style={inputStyle}
        />
        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>
          Copie juste l'ID après "v=" dans l'URL YouTube
        </p>
      </div>

      <div>
        <label style={labelStyle}>🎪 Mes stickers/emojis favoris</label>
        <input
          type="text"
          value={bookData.stickers?.join(' ') || ''}
          onChange={(e) => onChange('stickers', e.target.value.split(' '))}
          placeholder="😎 🔥 💎 ✨ 🎮"
          style={inputStyle}
        />
      </div>
    </div>
  );
}

function ExtrasTab({ bookData, setBookData, setHasChanges }) {
  const [newFriend, setNewFriend] = React.useState('');
  const [newGif, setNewGif] = React.useState('');

  const topFriends = bookData.topFriends || [];
  const gifs = bookData.gifs || [];
  const quiz = bookData.quiz || {};

  const handleAddFriend = () => {
    if (newFriend.trim()) {
      setBookData(prev => ({
        ...prev,
        topFriends: [...(prev.topFriends || []), newFriend.trim()]
      }));
      setHasChanges(true);
      setNewFriend('');
    }
  };

  const handleRemoveFriend = (index) => {
    setBookData(prev => ({
      ...prev,
      topFriends: prev.topFriends.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleAddGif = () => {
    if (newGif.trim()) {
      setBookData(prev => ({
        ...prev,
        gifs: [...(prev.gifs || []), newGif.trim()]
      }));
      setHasChanges(true);
      setNewGif('');
    }
  };

  const handleRemoveGif = (index) => {
    setBookData(prev => ({
      ...prev,
      gifs: prev.gifs.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleQuizChange = (qNum, field, value) => {
    setBookData(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        [qNum]: {
          ...(prev.quiz?.[qNum] || {}),
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Friends */}
      <div>
        <label style={labelStyle}>👥 Mon Top Friends (max 8)</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
            placeholder="Nom ou @pseudo"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={handleAddFriend} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold-dark))', border: '2px solid var(--color-gold-dark)', color: 'var(--color-brown-dark)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', fontWeight: '600', boxShadow: 'var(--shadow-sm)', transition: 'all var(--transition-normal)' }}>
            ➕
          </button>
        </div>
        {topFriends.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {topFriends.map((friend, index) => (
              <div key={index} style={{ background: 'var(--color-tan)', padding: '8px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '2px solid var(--color-brown-light)', boxShadow: 'var(--shadow-sm)' }}>
                <span>{friend}</span>
                <button onClick={() => handleRemoveFriend(index)} style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GIFs */}
      <div>
        <label style={labelStyle}>🎬 Mes GIFs animés</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={newGif}
            onChange={(e) => setNewGif(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddGif()}
            placeholder="URL du GIF"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={handleAddGif} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold-dark))', border: '2px solid var(--color-gold-dark)', color: 'var(--color-brown-dark)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', fontWeight: '600', boxShadow: 'var(--shadow-sm)', transition: 'all var(--transition-normal)' }}>
            ➕
          </button>
        </div>
        {gifs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
            {gifs.map((url, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img src={url} alt={`GIF ${index + 1}`} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                <button onClick={() => handleRemoveGif(index)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz */}
      <div>
        <label style={labelStyle}>❓ Mon Quiz Perso</label>
        {['q1', 'q2', 'q3'].map((qNum, idx) => (
          <div key={qNum} style={{ marginBottom: '15px', padding: '15px', background: 'var(--color-beige-light)', borderRadius: 'var(--border-radius-md)', border: '2px solid var(--color-tan)', boxShadow: 'var(--shadow-sm)' }}>
            <input
              type="text"
              value={quiz[qNum]?.question || ''}
              onChange={(e) => handleQuizChange(qNum, 'question', e.target.value)}
              placeholder={`Question ${idx + 1}`}
              style={{ ...inputStyle, marginBottom: '8px' }}
            />
            <input
              type="text"
              value={quiz[qNum]?.answer || ''}
              onChange={(e) => handleQuizChange(qNum, 'answer', e.target.value)}
              placeholder="Réponse"
              style={inputStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PrivateTab({ bookData, onChange }) {
  return (
    <div>
      <label style={labelStyle}>🔒 Contenu ultra-privé</label>
      <textarea
        value={bookData.privateContent || ''}
        onChange={(e) => onChange('privateContent', e.target.value)}
        placeholder="Contenu visible seulement pour toi et ceux qui ont débloqué..."
        style={{ ...inputStyle, minHeight: '200px', resize: 'vertical', fontFamily: 'inherit' }}
      />
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        background: active ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'var(--color-tan)',
        border: active ? '2px solid var(--color-gold-dark)' : '2px solid var(--color-brown-light)',
        color: active ? 'var(--color-brown-dark)' : 'var(--color-text-primary)',
        borderRadius: 'var(--border-radius-md)',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all var(--transition-normal)',
        boxShadow: active ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        whiteSpace: 'nowrap'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(58, 40, 24, 0.95)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 10000, padding: '20px'
};

const modalStyle = {
  background: 'var(--color-cream)', borderRadius: 'var(--border-radius-lg)', maxWidth: '750px',
  width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
  border: '3px solid var(--color-tan)', boxShadow: 'var(--shadow-xl)'
};

const headerStyle = {
  background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
  padding: '20px',
  borderRadius: 'var(--border-radius-md) var(--border-radius-md) 0 0',
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '2px solid var(--color-tan)'
};

const closeButtonStyle = {
  background: 'var(--color-brown)', border: 'none', color: 'var(--color-cream)',
  width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
  fontSize: '1.5rem', transition: 'all var(--transition-normal)',
  boxShadow: 'var(--shadow-sm)'
};

const tabsContainerStyle = {
  display: 'flex', gap: '8px', padding: '15px', background: 'var(--color-beige)',
  borderBottom: '2px solid var(--color-tan)', overflowX: 'auto'
};

const contentStyle = {
  flex: 1, overflowY: 'auto', padding: '25px', background: 'var(--color-cream)'
};

const actionsStyle = {
  padding: '20px', borderTop: '2px solid var(--color-tan)', display: 'flex',
  gap: '10px', alignItems: 'center', justifyContent: 'flex-end',
  background: 'var(--color-beige-light)'
};

const labelStyle = {
  display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.9rem',
  marginBottom: '8px', fontWeight: '600', fontFamily: 'var(--font-heading)'
};

const inputStyle = {
  width: '100%', padding: '12px', background: 'var(--color-beige-light)',
  border: '2px solid var(--color-tan)', borderRadius: 'var(--border-radius-md)',
  color: 'var(--color-text-primary)',
  fontSize: '0.95rem', outline: 'none', transition: 'all var(--transition-normal)'
};

const previewButtonStyle = {
  padding: '12px 24px',
  background: 'linear-gradient(135deg, var(--color-romantic-light), var(--color-romantic))',
  border: '2px solid var(--color-romantic)', color: 'var(--color-cream)',
  borderRadius: 'var(--border-radius-md)', cursor: 'pointer',
  fontWeight: '600', transition: 'all var(--transition-normal)',
  boxShadow: 'var(--shadow-sm)'
};

const cancelButtonStyle = {
  padding: '12px 24px', background: 'var(--color-tan)',
  border: '2px solid var(--color-brown-light)',
  color: 'var(--color-text-primary)', borderRadius: 'var(--border-radius-md)',
  cursor: 'pointer', fontWeight: '600',
  transition: 'all var(--transition-normal)', boxShadow: 'var(--shadow-sm)'
};

const saveButtonStyle = {
  padding: '12px 24px',
  background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold-dark))',
  border: '2px solid var(--color-gold-dark)', color: 'var(--color-brown-dark)',
  borderRadius: 'var(--border-radius-md)', cursor: 'pointer',
  fontWeight: '600', transition: 'all var(--transition-normal)',
  boxShadow: 'var(--shadow-sm)'
};
