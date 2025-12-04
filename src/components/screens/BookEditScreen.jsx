import React, { useState, useEffect } from 'react';
import { loadBookData, saveBookData } from '../../utils/bookSystem';

export default function BookEditScreen({ user, setScreen }) {
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
      } else {
        alert('❌ Erreur lors de la sauvegarde');
      }
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('Modifications non sauvegardées. Quitter ?')) {
        setScreen('home');
      }
    } else {
      setScreen('home');
    }
  };

  if (!bookData) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: 'white', textAlign: 'center' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '10px'
      }}>
        <button onClick={handleBack} style={headerButtonStyle}>
          ← Retour
        </button>
        <h2 style={{
          margin: 0,
          color: 'white',
          fontSize: 'clamp(1rem, 4vw, 1.5rem)',
          textAlign: 'center',
          flex: 1
        }}>
          ✏️ Éditer mon Book
        </h2>
        <button onClick={handleSave} style={saveHeaderButtonStyle}>
          💾
        </button>
      </div>

      {/* Tabs - Optimisées pour mobile */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '12px 10px',
        gap: '8px',
        background: '#2a2a2a',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: '60px',
        zIndex: 99,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: '#667eea #2a2a2a'
      }}>
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

      {/* Content - Avec scroll si nécessaire */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        maxWidth: '768px',
        margin: '0 auto',
        width: '100%'
      }}>
        <style>{`
          /* Custom scrollbar for tabs */
          div::-webkit-scrollbar {
            height: 4px;
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #1a1a1a;
          }
          div::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 4px;
          }
        `}</style>

        {activeTab === 'infos' && <InfosTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'about' && <AboutTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'private' && <PrivateTab bookData={bookData} onChange={handleChange} />}
      </div>

      {/* Actions footer - Sticky en bas */}
      <div style={{
        padding: '15px',
        borderTop: '1px solid #333',
        background: '#1a1a1a',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        bottom: '60px'
      }}>
        {hasChanges && (
          <span style={{ color: '#FFA500', fontSize: '0.85rem', flex: 1 }}>
            ⚠️ Non sauvegardé
          </span>
        )}
        <button onClick={handleBack} style={cancelButtonStyle}>
          Annuler
        </button>
        <button onClick={handleSave} style={saveButtonStyle}>
          💾 Sauvegarder
        </button>
      </div>
    </div>
  );
}

// Tabs Components
function InfosTab({ bookData, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <InputField label="💬 Phrase d'ambiance" value={bookData.bio} onChange={(v) => onChange('bio', v)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <InputField label="🎂 Âge" value={bookData.age} onChange={(v) => onChange('age', v)} />
        <InputField label="📍 Ville" value={bookData.city} onChange={(v) => onChange('city', v)} />
      </div>
      <InputField label="💼 Activité" value={bookData.job} onChange={(v) => onChange('job', v)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
        style={{ ...inputStyle, minHeight: '300px', resize: 'vertical', fontFamily: 'inherit' }}
      />
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
        style={{ ...inputStyle, minHeight: '300px', resize: 'vertical', fontFamily: 'inherit' }}
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
        padding: '8px 14px',
        background: active ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#1a1a1a',
        border: active ? '2px solid #667eea' : '2px solid transparent',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'all 0.2s'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Styles
const headerButtonStyle = {
  background: 'rgba(255,255,255,0.2)',
  border: 'none',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem'
};

const saveHeaderButtonStyle = {
  background: 'rgba(76, 175, 80, 0.3)',
  border: '2px solid #4CAF50',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1.2rem'
};

const labelStyle = {
  display: 'block',
  color: '#aaa',
  fontSize: '0.85rem',
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
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const cancelButtonStyle = {
  padding: '10px 20px',
  background: '#2a2a2a',
  border: '2px solid #444',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem'
};

const saveButtonStyle = {
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem'
};
