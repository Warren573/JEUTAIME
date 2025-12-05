import React, { useState, useEffect } from 'react';
import { loadBookData, saveBookData } from '../../utils/bookSystem';

export default function BookEditScreen({ user, setScreen, setCurrentUser }) {
  const [bookData, setBookData] = useState(null);
  const [activeTab, setActiveTab] = useState('infos');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user?.email) {
      const data = loadBookData(user.email);
      // Initialiser les styles personnalisés s'ils n'existent pas
      if (!data.bookStyles) {
        data.bookStyles = {
          backgroundColor: '#F5E6D3',
          backgroundImage: '',
          primaryColor: '#DAA520',
          secondaryColor: '#B8860B'
        };
      }
      setBookData(data);
    }
  }, [user?.email]);

  const handleChange = (field, value) => {
    setBookData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleStyleChange = (field, value) => {
    setBookData(prev => ({
      ...prev,
      bookStyles: { ...prev.bookStyles, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (user?.email && bookData) {
      const success = saveBookData(user.email, bookData);
      if (success) {
        setHasChanges(false);
        // Mettre à jour l'utilisateur courant avec les nouveaux styles
        const updatedUser = { ...user, bookStyles: bookData.bookStyles };
        localStorage.setItem('jeutaime_current_user', JSON.stringify(updatedUser));
        if (setCurrentUser) setCurrentUser(updatedUser);
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
    { id: 'style', icon: '🌈', label: 'Style' },
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

      {/* Tabs - Grid multi-ligne */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        padding: '12px 10px',
        gap: '8px',
        background: 'var(--color-cream)',
        borderBottom: '2px solid var(--color-brown-light)',
        position: 'sticky',
        top: '60px',
        zIndex: 99
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
        {activeTab === 'infos' && <InfosTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'about' && <AboutTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'videos' && <VideosTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'photos' && <PhotosTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'notes' && <NotesTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'moodboard' && <MoodboardTab bookData={bookData} onChange={handleChange} />}
        {activeTab === 'style' && <StyleTab bookData={bookData} onStyleChange={handleStyleChange} />}
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

function StyleTab({ bookData, onStyleChange }) {
  const styles = bookData.bookStyles || {};

  const presetColors = [
    { name: 'Or (défaut)', primary: '#DAA520', secondary: '#B8860B', bg: '#F5E6D3' },
    { name: 'Rose romantique', primary: '#E67E73', secondary: '#C85A54', bg: '#FFE5E5' },
    { name: 'Vert nature', primary: '#8BA569', secondary: '#6B8E4E', bg: '#E8F5E8' },
    { name: 'Bleu océan', primary: '#6B8E8E', secondary: '#4A6B6B', bg: '#E0F2F7' },
    { name: 'Violet mystique', primary: '#9B7EBD', secondary: '#7B5E9D', bg: '#F3E5F5' },
    { name: 'Orange soleil', primary: '#FFB84D', secondary: '#F4A460', bg: '#FFF4E5' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '15px', fontSize: '1.2rem' }}>
          🌈 Personnalise ton Book
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Choisis les couleurs et l'image de fond de ton Book personnel
        </p>
      </div>

      {/* Couleurs prédéfinies */}
      <div>
        <label style={labelStyle}>🎨 Thèmes de couleurs</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                onStyleChange('primaryColor', preset.primary);
                onStyleChange('secondaryColor', preset.secondary);
                onStyleChange('backgroundColor', preset.bg);
              }}
              style={{
                padding: '12px',
                background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                border: styles.primaryColor === preset.primary ? '3px solid var(--color-brown-dark)' : '2px solid var(--color-brown-light)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                transition: 'all 0.2s'
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Couleurs personnalisées */}
      <div>
        <label style={labelStyle}>🎨 Couleurs personnalisées</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <ColorPicker
            label="Couleur principale"
            value={styles.primaryColor || '#DAA520'}
            onChange={(v) => onStyleChange('primaryColor', v)}
          />
          <ColorPicker
            label="Couleur secondaire"
            value={styles.secondaryColor || '#B8860B'}
            onChange={(v) => onStyleChange('secondaryColor', v)}
          />
        </div>
      </div>

      {/* Couleur de fond */}
      <div>
        <label style={labelStyle}>🎨 Couleur de fond</label>
        <ColorPicker
          label="Fond du Book"
          value={styles.backgroundColor || '#F5E6D3'}
          onChange={(v) => onStyleChange('backgroundColor', v)}
        />
      </div>

      {/* Image de fond */}
      <div>
        <label style={labelStyle}>🖼️ Image de fond</label>
        <input
          type="text"
          value={styles.backgroundImage || ''}
          onChange={(e) => onStyleChange('backgroundImage', e.target.value)}
          placeholder="URL de l'image (https://...)"
          style={inputStyle}
        />
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', marginTop: '8px', fontStyle: 'italic' }}>
          💡 Colle l'URL d'une image (par ex. depuis Unsplash, Imgur, etc.)
        </p>
        {styles.backgroundImage && (
          <div style={{ marginTop: '15px' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
              Aperçu :
            </p>
            <div style={{
              width: '100%',
              height: '150px',
              borderRadius: '8px',
              background: `linear-gradient(rgba(255,248,231,0.85), rgba(255,248,231,0.85)), url(${styles.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid var(--color-brown-light)'
            }} />
          </div>
        )}
      </div>

      {/* Note */}
      <div style={{
        padding: '15px',
        background: 'var(--color-cream)',
        borderRadius: '8px',
        border: '2px solid var(--color-gold)'
      }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          💡 <strong>Astuce :</strong> Les styles s'appliquent à toutes les pages de ton Book. N'oublie pas de sauvegarder !
        </p>
      </div>
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

function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <label style={{ ...labelStyle, marginBottom: '6px' }}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '50px',
            height: '40px',
            border: '2px solid var(--color-brown-light)',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#DAA520"
          style={{ ...inputStyle, flex: 1 }}
        />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 6px',
        background: active
          ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
          : 'var(--color-beige)',
        border: active ? '2px solid var(--color-gold-dark)' : '2px solid var(--color-brown-light)',
        color: active ? 'var(--color-brown-dark)' : 'var(--color-text-primary)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.2s',
        boxShadow: active ? 'var(--shadow-sm)' : 'none',
        textAlign: 'center'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
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
