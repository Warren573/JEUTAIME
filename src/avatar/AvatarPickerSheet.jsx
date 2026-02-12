/**
 * AVATAR PICKER SHEET
 *
 * Modal/Sheet pour sélectionner un élément d'avatar par catégorie.
 * Affiche une grille d'options avec preview SVG.
 */

import React from 'react';
import manifest from './assets/manifest.json';

/**
 * Récupère les options d'une catégorie depuis le manifest
 * @param {string} category - Catégorie (face, eyes, mouth, etc.)
 * @returns {Array} Liste des assets
 */
function getCategoryOptions(category) {
  return manifest[category] || [];
}

/**
 * Composant de sélection d'asset dans une catégorie
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Sheet visible ou non
 * @param {Function} props.onClose - Callback de fermeture
 * @param {string} props.category - Catégorie à afficher
 * @param {string} props.categoryLabel - Label affiché
 * @param {string} props.selectedId - ID de l'asset actuellement sélectionné
 * @param {Function} props.onSelect - Callback de sélection (assetId)
 * @param {boolean} props.allowNull - Autoriser la sélection "Aucun"
 */
export default function AvatarPickerSheet({
  isOpen,
  onClose,
  category,
  categoryLabel,
  selectedId,
  onSelect,
  allowNull = false
}) {
  if (!isOpen) return null;

  const options = getCategoryOptions(category);

  const handleSelect = (assetId) => {
    onSelect(assetId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Bottom Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '70vh',
          backgroundColor: '#FFF',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          zIndex: 9999,
          animation: 'slideUp 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            {categoryLabel}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Grid d'options */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            flex: 1
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '15px'
            }}
          >
            {/* Option "Aucun" (si autorisé) */}
            {allowNull && (
              <div
                onClick={() => handleSelect(null)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '12px',
                  border: selectedId === null ? '3px solid #667eea' : '2px solid #E0E0E0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selectedId === null ? '#F0F0FF' : '#FFF',
                  transition: 'all 0.2s',
                  fontSize: '32px'
                }}
              >
                ∅
              </div>
            )}

            {/* Options de la catégorie */}
            {options.map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleSelect(asset.id)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '12px',
                  border: selectedId === asset.id ? '3px solid #667eea' : '2px solid #E0E0E0',
                  cursor: 'pointer',
                  padding: '10px',
                  backgroundColor: selectedId === asset.id ? '#F0F0FF' : '#FFF',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={asset.path}
                  alt={asset.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
