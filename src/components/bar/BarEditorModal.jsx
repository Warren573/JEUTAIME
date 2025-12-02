import React, { useState } from 'react';

/**
 * Modal d'édition de salon - Interface Admin
 * Permet de modifier les propriétés d'un salon (images, nom, description, couleurs)
 */
export default function BarEditorModal({ bar, onClose, onSave }) {
  const [name, setName] = useState(bar.name);
  const [desc, setDesc] = useState(bar.desc);
  const [icon, setIcon] = useState(bar.icon);
  const [backgroundImage, setBackgroundImage] = useState(bar.backgroundImage || '');
  const [bgGradient, setBgGradient] = useState(bar.bgGradient || '');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Seules les images sont acceptées');
      return;
    }

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 2MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setBackgroundImage(base64);
      setUploading(false);
    };
    reader.onerror = () => {
      alert('Erreur lors du chargement de l\'image');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updatedBar = {
      ...bar,
      name,
      desc,
      icon,
      backgroundImage,
      bgGradient
    };
    onSave(updatedBar);
  };

  const resetToDefault = () => {
    if (confirm('Réinitialiser toutes les modifications ?')) {
      // Récupérer les données originales depuis appData
      const { bars } = require('../../data/appData');
      const originalBar = bars.find(b => b.id === bar.id);
      if (originalBar) {
        setName(originalBar.name);
        setDesc(originalBar.desc);
        setIcon(originalBar.icon);
        setBackgroundImage(originalBar.backgroundImage || '');
        setBgGradient(originalBar.bgGradient || '');
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '20px',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
            🛠️ Éditer Salon
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Aperçu */}
          <div style={{
            marginBottom: '24px',
            padding: '20px',
            borderRadius: '12px',
            background: backgroundImage
              ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${backgroundImage})`
              : bgGradient || '#E0E0E0',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            border: '3px solid rgba(255,255,255,0.5)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{icon}</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '700' }}>{name}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{desc}</p>
          </div>

          {/* Nom */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              📝 Nom du salon
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Ex: Piscine"
            />
          </div>

          {/* Icône */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              🎨 Icône (emoji)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '2rem',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}
              placeholder="🏊"
              maxLength="2"
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              📄 Description
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Ex: 2H/2F - Ambiance aquatique"
            />
          </div>

          {/* Image de fond */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              🖼️ Image de fond
            </label>
            <input
              type="text"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginBottom: '8px',
                boxSizing: 'border-box'
              }}
              placeholder="URL de l'image ou base64"
            />
            <label
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              {uploading ? '⏳ Chargement...' : '📤 Uploader une image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#666' }}>
              Max 2MB - JPG, PNG, GIF, WEBP
            </p>
          </div>

          {/* Gradient de fond (fallback) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              🎨 Gradient CSS (si pas d'image)
            </label>
            <input
              type="text"
              value={bgGradient}
              onChange={(e) => setBgGradient(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
              placeholder="linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%)"
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px'
          }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                minHeight: '48px'
              }}
            >
              ✅ Sauvegarder
            </button>
            <button
              onClick={resetToDefault}
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                minHeight: '48px'
              }}
            >
              🔄 Réinitialiser
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '12px',
              background: '#E0E0E0',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              minHeight: '48px'
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
