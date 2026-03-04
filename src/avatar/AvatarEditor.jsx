/**
 * AVATAR EDITOR
 *
 * Éditeur d'avatar modulaire type notion-avatar.app
 * - Preview central
 * - Sélection par catégories (BottomSheet)
 * - Bouton Random
 * - Bouton Save (localStorage)
 */

import React, { useState, useEffect } from 'react';
import AvatarRenderer from './AvatarRenderer.jsx';
import AvatarPickerSheet from './AvatarPickerSheet.jsx';
import { saveAvatarState, loadAvatarState } from './avatar.storage.js';
import manifest from './assets/manifest.json';

/**
 * Catégories disponibles pour l'édition
 * Updated to use unified hair model (single hair slot)
 */
const CATEGORIES = [
  { key: 'face', label: '👤 Visage', icon: '👤' },
  { key: 'eyes', label: '👁️ Yeux', icon: '👁️' },
  { key: 'mouth', label: '👄 Bouche/Nez', icon: '👄' },
  { key: 'hair', label: '💇 Cheveux', icon: '💇' },
  { key: 'beard', label: '🧔 Barbe', icon: '🧔', allowNull: true },
  { key: 'accessory', label: '🎩 Accessoires', icon: '🎩', allowNull: true }
];

/**
 * Sélectionne un asset aléatoire dans une catégorie
 * @param {string} category - Catégorie
 * @param {boolean} allowNull - Autoriser null
 * @returns {string|null} ID de l'asset
 */
function randomAsset(category, allowNull = false) {
  const options = manifest[category] || [];
  if (options.length === 0) return null;

  // 50% de chance de null si autorisé
  if (allowNull && Math.random() < 0.5) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].id;
}

/**
 * Composant principal de l'éditeur d'avatar
 *
 * @param {Object} props
 * @param {Object} props.currentUser - Utilisateur actuel
 * @param {Function} props.onSave - Callback après sauvegarde (optionnel)
 * @param {Function} props.onBack - Callback pour retour
 */
export default function AvatarEditor({ currentUser, onSave, onBack }) {
  const userId = currentUser?.email || currentUser?.id || 'default';

  // State de l'avatar en cours d'édition
  const [identity, setIdentity] = useState({
    face: null,
    eyes: null,
    mouth: null,
    hair: null,
    beard: null,
    accessory: null
  });

  // State du picker sheet
  const [pickerState, setPickerState] = useState({
    isOpen: false,
    category: null,
    categoryLabel: '',
    allowNull: false
  });

  // Chargement de l'avatar sauvegardé au mount
  useEffect(() => {
    const savedState = loadAvatarState(userId);
    if (savedState && savedState.identity) {
      setIdentity(savedState.identity);
    } else {
      // Génère un avatar aléatoire par défaut
      const newIdentity = {
        face: randomAsset('face'),
        eyes: randomAsset('eyes'),
        mouth: randomAsset('mouth'),
        hair: randomAsset('hair'),
        beard: randomAsset('beard', true),
        accessory: randomAsset('accessory', true)
      };
      setIdentity(newIdentity);
    }
  }, [userId]);

  /**
   * Ouvre le picker pour une catégorie
   */
  const openPicker = (category) => {
    const cat = CATEGORIES.find(c => c.key === category);
    setPickerState({
      isOpen: true,
      category: category,
      categoryLabel: cat?.label || category,
      allowNull: cat?.allowNull || false
    });
  };

  /**
   * Ferme le picker
   */
  const closePicker = () => {
    setPickerState({
      isOpen: false,
      category: null,
      categoryLabel: '',
      allowNull: false
    });
  };

  /**
   * Callback de sélection d'un asset
   */
  const handleSelectAsset = (assetId) => {
    if (!pickerState.category) return;

    setIdentity(prev => ({
      ...prev,
      [pickerState.category]: assetId
    }));
  };

  /**
   * Génère un avatar complètement aléatoire
   */
  const handleRandomize = () => {
    const newIdentity = {
      face: randomAsset('face'),
      eyes: randomAsset('eyes'),
      mouth: randomAsset('mouth'),
      hair: randomAsset('hair'),
      beard: randomAsset('beard', true),
      accessory: randomAsset('accessory', true)
    };
    setIdentity(newIdentity);
  };

  /**
   * Sauvegarde l'avatar
   */
  const handleSave = () => {
    const avatarState = {
      identity,
      extensions: {},
      evolution: {},
      effects: {},
      transformation: null,
      lastUpdate: Date.now()
    };

    const success = saveAvatarState(userId, avatarState);

    if (success) {
      alert('✅ Avatar sauvegardé !');
      if (onSave) onSave(avatarState);
    } else {
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  // État complet pour AvatarRenderer
  const avatarState = {
    identity,
    extensions: {},
    evolution: {},
    effects: {},
    transformation: null
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        paddingBottom: '120px'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          color: '#FFF'
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '12px',
            color: '#FFF',
            fontSize: '24px',
            width: '44px',
            height: '44px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px'
          }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
          Éditeur d'Avatar
        </h1>
      </div>

      {/* Preview Avatar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px'
        }}
      >
        <div
          style={{
            width: '240px',
            height: '240px',
            background: '#FFF',
            borderRadius: '50%',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AvatarRenderer avatarState={avatarState} size={200} />
        </div>
      </div>

      {/* Boutons Catégories */}
      <div
        style={{
          background: '#FFF',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>
          Personnaliser
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => openPicker(cat.key)}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '15px',
                color: '#FFF',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '20px' }}>{cat.icon}</span>
              <span>{cat.label.replace(/^[^\s]+ /, '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Boutons Actions */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        {/* Bouton Random */}
        <button
          onClick={handleRandomize}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #FFA500 0%, #FF6347 100%)',
            border: 'none',
            borderRadius: '15px',
            padding: '18px',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🎲 Aléatoire
        </button>

        {/* Bouton Save */}
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            border: 'none',
            borderRadius: '15px',
            padding: '18px',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          💾 Enregistrer
        </button>
      </div>

      {/* Picker Sheet */}
      <AvatarPickerSheet
        isOpen={pickerState.isOpen}
        onClose={closePicker}
        category={pickerState.category}
        categoryLabel={pickerState.categoryLabel}
        selectedId={identity[pickerState.category]}
        onSelect={handleSelectAsset}
        allowNull={pickerState.allowNull}
      />
    </div>
  );
}
