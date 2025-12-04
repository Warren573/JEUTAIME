import React, { useState, useEffect } from 'react';
import { loadBookData, saveBookData } from '../../utils/bookSystem';

export default function BookEditor({ user, onClose, onSave }) {
  const [bookData, setBookData] = useState(null);
  const [activeTab, setActiveTab] = useState('infos');
  const [hasChanges, setHasChanges] = useState(false);

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
          <TabButton active={activeTab === 'private'} onClick={() => setActiveTab('private')} icon="🔒" label="Privé" />
        </div>

        <div style={contentStyle}>
          {activeTab === 'infos' && <InfosTab bookData={bookData} onChange={handleChange} />}
          {activeTab === 'about' && <AboutTab bookData={bookData} onChange={handleChange} />}
          {activeTab === 'photos' && <PhotosTab bookData={bookData} onChange={handleChange} setBookData={setBookData} setHasChanges={setHasChanges} />}
          {activeTab === 'private' && <PrivateTab bookData={bookData} onChange={handleChange} />}
        </div>

        <div style={actionsStyle}>
          {hasChanges && (
            <span style={{ color: '#FFA500', fontSize: '0.9rem', marginRight: 'auto' }}>
              ⚠️ Non sauvegardé
            </span>
          )}
          <button onClick={handleClose} style={cancelButtonStyle}>Annuler</button>
          <button onClick={handleSave} style={saveButtonStyle}>💾 Sauvegarder</button>
        </div>
      </div>
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
    <div>
      <label style={labelStyle}>✨ À propos de moi</label>
      <textarea
        value={bookData.about}
        onChange={(e) => onChange('about', e.target.value)}
        placeholder="Écris sur toi..."
        style={{ ...inputStyle, minHeight: '200px', resize: 'vertical', fontFamily: 'inherit' }}
      />
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
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              whiteSpace: 'nowrap'
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
                background: '#2a2a2a',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
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

function PrivateTab({ bookData, onChange }) {
  return (
    <div>
      <label style={labelStyle}>🔒 Contenu ultra-privé</label>
      <textarea
        value={bookData.privateContent}
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
        background: active ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#2a2a2a',
        border: active ? '2px solid #667eea' : '2px solid transparent',
        color: 'white',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 10000, padding: '20px'
};

const modalStyle = {
  background: '#1a1a1a', borderRadius: '16px', maxWidth: '700px',
  width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
  border: '2px solid #667eea'
};

const headerStyle = {
  background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px',
  borderRadius: '14px 14px 0 0', display: 'flex', justifyContent: 'space-between',
  alignItems: 'center'
};

const closeButtonStyle = {
  background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
  width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
  fontSize: '1.5rem'
};

const tabsContainerStyle = {
  display: 'flex', gap: '10px', padding: '15px', background: '#2a2a2a',
  borderBottom: '1px solid #333'
};

const contentStyle = {
  flex: 1, overflowY: 'auto', padding: '25px'
};

const actionsStyle = {
  padding: '20px', borderTop: '1px solid #333', display: 'flex',
  gap: '10px', alignItems: 'center', justifyContent: 'flex-end'
};

const labelStyle = {
  display: 'block', color: '#aaa', fontSize: '0.9rem',
  marginBottom: '8px', fontWeight: '600'
};

const inputStyle = {
  width: '100%', padding: '12px', background: '#2a2a2a',
  border: '2px solid #444', borderRadius: '8px', color: 'white',
  fontSize: '0.95rem', outline: 'none'
};

const cancelButtonStyle = {
  padding: '12px 24px', background: '#2a2a2a', border: '2px solid #444',
  color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: '600'
};

const saveButtonStyle = {
  padding: '12px 24px', background: 'linear-gradient(135deg, #4CAF50, #45a049)',
  border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer',
  fontWeight: '600'
};
