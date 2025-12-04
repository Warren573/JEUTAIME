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
        background: 'var(--color-beige-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: 'var(--color-text-primary)', textAlign: 'center' }}>Chargement...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'infos', icon: '📖', label: 'Infos' },
    { id: 'about', icon: '✨', label: 'À propos' },
    { id: 'videos', icon: '🎥', label: 'Vidéos' },
    { id: 'photos', icon: '📸', label: 'Photos' },
    { id: 'notes', icon: '✍️', label: 'Notes' },
    { id: 'moodboard', icon: '🎨', label: 'Moodboard' },
    { id: 'private', icon: '🔒', label: 'Privé' }
  ];

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
        zIndex: 100,
        gap: '10px'
      }}>
        <button onClick={handleBack} style={headerButtonStyle}>
          ← Retour
        </button>
        <h2 style={{
          margin: 0,
          color: 'var(--color-brown-dark)',
          fontSize: 'clamp(1rem, 4vw, 1.5rem)',
          textAlign: 'center',
          flex: 1,
          fontWeight: '700'
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
        background: 'var(--color-cream)',
        borderBottom: '2px solid var(--color-brown-light)',
        position: 'sticky',
        top: '60px',
        zIndex: 99,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-gold) var(--color-cream)'
      }}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
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
            background: var(--color-beige-light);
          }
          div::-webkit-scrollbar-thumb {
            background: var(--color-gold);
            border-radius: 4px;
          }
        `}</style>

        {activeTab === 'infos' && <InfosTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'about' && <AboutTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'videos' && <VideosTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'photos' && <PhotosTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'notes' && <NotesTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'moodboard' && <MoodboardTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'private' && <PrivateTab bookData={bookData} onChange={handleChange} />}
      </div>

      {/* Actions footer - Sticky en bas */}
      <div style={{
        padding: '15px',
        borderTop: '2px solid var(--color-brown-light)',
        background: 'var(--color-cream)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        bottom: '60px',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)'
      }}>
        {hasChanges && (
          <span style={{ color: 'var(--color-romantic)', fontSize: '0.85rem', flex: 1, fontWeight: '600' }}>
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

// ===== TABS COMPONENTS =====

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

function VideosTab({ bookData, onChange }) {
  return (
    <div>
      <label style={labelStyle}>🎥 Gérer mes vidéos</label>
      <div style={{
        background: 'var(--color-cream)',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '2px dashed var(--color-gold)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎥</div>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '15px' }}>
          Fonctionnalité d'ajout de vidéos à venir
        </p>
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>
          Tu pourras bientôt ajouter des liens YouTube, Vimeo, etc.
        </p>
      </div>
    </div>
  );
}

function PhotosTab({ bookData, onChange }) {
  return (
    <div>
      <label style={labelStyle}>📸 Gérer mon album photo</label>
      <div style={{
        background: 'var(--color-cream)',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '2px dashed var(--color-gold)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📸</div>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '15px' }}>
          Upload de photos à venir
        </p>
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>
          Tu pourras bientôt télécharger tes meilleures photos
        </p>
      </div>
    </div>
  );
}

function NotesTab({ bookData, onChange }) {
  return (
    <div>
      <label style={labelStyle}>✍️ Mes notes & pensées</label>
      <textarea
        value={bookData.notes || ''}
        onChange={(e) => onChange('notes', e.target.value)}
        placeholder="Écris tes pensées, citations préférées, réflexions..."
        style={{ ...inputStyle, minHeight: '300px', resize: 'vertical', fontFamily: 'inherit' }}
      />
      <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginTop: '10px', fontStyle: 'italic' }}>
        💡 Partage tes réflexions, citations favorites, mood du moment...
      </p>
    </div>
  );
}

function MoodboardTab({ bookData, onChange }) {
  return (
    <div>
      <label style={labelStyle}>🎨 Mon moodboard / style</label>
      <textarea
        value={bookData.moodboard || ''}
        onChange={(e) => onChange('moodboard', e.target.value)}
        placeholder="Tags qui te définissent : Créatif, Authentique, Fun, Deep, Aventurier..."
        style={{ ...inputStyle, minHeight: '200px', resize: 'vertical', fontFamily: 'inherit' }}
      />
      <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginTop: '10px', fontStyle: 'italic' }}>
        🎭 Décris ton style, ton univers, tes vibes...
      </p>
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
      <div style={{
        marginTop: '15px',
        padding: '15px',
        background: 'var(--color-cream)',
        borderRadius: '8px',
        border: '2px solid var(--color-romantic)'
      }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          🔒 <strong>Confidentialité :</strong> Ce contenu n'est visible que par toi et les personnes qui ont débloqué ton Book (après 10 lettres échangées ou via Premium).
        </p>
      </div>
    </div>
  );
}

// ===== HELPER COMPONENTS =====

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
        background: active
          ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
          : 'var(--color-beige)',
        border: active ? '2px solid var(--color-gold-dark)' : '2px solid var(--color-brown-light)',
        color: active ? 'var(--color-brown-dark)' : 'var(--color-text-primary)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'all 0.2s',
        boxShadow: active ? 'var(--shadow-sm)' : 'none'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ===== STYLES =====

const headerButtonStyle = {
  background: 'rgba(74, 55, 40, 0.3)',
  border: '2px solid var(--color-brown-dark)',
  color: 'var(--color-brown-dark)',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem'
};

const saveHeaderButtonStyle = {
  background: 'var(--color-success)',
  border: '2px solid var(--color-brown-dark)',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1.2rem'
};

const labelStyle = {
  display: 'block',
  color: 'var(--color-text-secondary)',
  fontSize: '0.85rem',
  marginBottom: '8px',
  fontWeight: '600'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: 'var(--color-cream)',
  border: '2px solid var(--color-brown-light)',
  borderRadius: '8px',
  color: 'var(--color-text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s'
};

const cancelButtonStyle = {
  padding: '10px 20px',
  background: 'var(--color-beige)',
  border: '2px solid var(--color-brown-light)',
  color: 'var(--color-text-primary)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem'
};

const saveButtonStyle = {
  padding: '10px 20px',
  background: 'linear-gradient(135deg, var(--color-success), var(--color-friendly))',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem',
  boxShadow: 'var(--shadow-sm)'
};
