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
        alert('✅ Book sauvegardé avec succès !');
        if (onSave) onSave(bookData);
      } else {
        alert('❌ Erreur lors de la sauvegarde');
      }
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
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
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>
            ✏️ Éditer mon Book
          </h2>
          <button onClick={handleClose} style={closeButtonStyle}>✕</button>
        </div>

        {/* Tabs */}
        <div style={tabsContainerStyle}>
          <TabButton
            active={activeTab === 'infos'}
            onClick={() => setActiveTab('infos')}
            icon="📖"
            label="Infos"
          />
          <TabButton
            active={activeTab === 'about'}
            onClick={() => setActiveTab('about')}
            icon="✨"
            label="À propos"
          />
          <TabButton
            active={activeTab === 'private'}
            onClick={() => setActiveTab('private')}
            icon="🔒"
            label="Privé"
          />
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {activeTab === 'infos' && (
            <InfosTab bookData={bookData} onChange={handleChange} />
          )}
          {activeTab === 'about' && (
            <AboutTab bookData={bookData} onChange={handleChange} />
          )}
          {activeTab === 'private' && (
            <PrivateTab bookData={bookData} onChange={handleChange} />
          )}
        </div>

        {/* Actions */}
        <div style={actionsStyle}>
          {hasChanges && (
            <span style={{ color: '#FFA500', fontSize: '0.9rem', marginRight: 'auto' }}>
              ⚠️ Modifications non sauvegardées
            </span>
          )}
          <button onClick={handleClose} style={cancelButtonStyle}>
            Annuler
          </button>
          <button onClick={handleSave} style={saveButtonStyle}>
            💾 Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

function InfosTab({ bookData, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <InputField
        label="💬 Phrase d'ambiance"
        value={bookData.bio}
        onChange={(v) => onChange('bio', v)}
        placeholder="Ma phrase d'ambiance style Skyblog ✨"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <InputField
          label="🎂 Âge"
          value={bookData.age}
          onChange={(v) => onChange('age', v)}
          placeholder="25 ans"
        />
        <InputField
          label="📍 Ville"
          value={bookData.city}
          onChange={(v) => onChange('city', v)}
          placeholder="Paris"
        />
      </div>
      <InputField
        label="💼 Activité"
        value={bookData.job}
        onChange={(v) => onChange('job', v)}
        placeholder="Étudiant·e"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <InputField
          label="🎵 Musique"
          value={bookData.music}
          onChange={(v) => onChange('music', v)}
          placeholder="Indé / Électro"
        />
        <InputField
          label="🎬 Film"
          value={bookData.movie}
          onChange={(v) => onChange('movie', v)}
          placeholder="Ton film préféré"
        />
      </div>
      <InputField
        label="🍕 Plat favori"
        value={bookData.food}
        onChange={(v) => onChange('food', v)}
        placeholder="Pizza 🍕"
      />
    </div>
  );
}

function AboutTab({ bookData, onChange }) {
  return (
    <div>
      <label style={labelStyle}>
        ✨ À propos de moi
      </label>
      <textarea
        value={bookData.about}
        onChange={(e) => onChange('about', e.target.value)}
        placeholder="Écris quelque chose sur toi, tes passions, ce qui te rend unique..."
        style={{
          ...inputStyle,
          minHeight: '200px',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />
      <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '10px' }}>
        💡 Conseil : Sois authentique et montre ta personnalité !
      </p>
    </div>
  );
}

function PrivateTab({ bookData, onChange }) {
  return (
    <div>
      <label style={labelStyle}>
        🔒 Contenu ultra-privé
      </label>
      <textarea
        value={bookData.privateContent}
        onChange={(e) => onChange('privateContent', e.target.value)}
        placeholder="Ce contenu n'est visible que par toi et les personnes qui ont débloqué ton Book..."
        style={{
          ...inputStyle,
          minHeight: '200px',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />
      <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '10px' }}>
        🔐 Cette section est débloquée après 10 lettres échangées
      </p>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
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
        transition: 'all 0.2s',
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

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '20px'
};

const modalStyle = {
  background: '#1a1a1a',
  borderRadius: '16px',
  maxWidth: '700px',
  width: '100%',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  border: '2px solid #667eea'
};

const headerStyle = {
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  padding: '20px',
  borderRadius: '14px 14px 0 0',
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
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s'
};

const tabsContainerStyle = {
  display: 'flex',
  gap: '10px',
  padding: '15px',
  background: '#2a2a2a',
  borderBottom: '1px solid #333'
};

const contentStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '25px'
};

const actionsStyle = {
  padding: '20px',
  borderTop: '1px solid #333',
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-end'
};

const labelStyle = {
  display: 'block',
  color: '#aaa',
  fontSize: '0.9rem',
  marginBottom: '8px',
  fontWeight: '600'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: '#2a2a2a',
  border: '2px solid #444',
  borderRadius: '8px',
  color: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'all 0.2s'
};

const cancelButtonStyle = {
  padding: '12px 24px',
  background: '#2a2a2a',
  border: '2px solid #444',
  color: 'white',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.2s'
};

const saveButtonStyle = {
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
  border: 'none',
  color: 'white',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.2s'
};
