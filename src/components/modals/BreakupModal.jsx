import React, { useState } from 'react';
import { getBreakupTypeInfo, archiveConversation } from '../../utils/memoriesSystem';

export default function BreakupModal({ currentUser, profile, messages, onClose, onBreakup }) {
  const [selectedType, setSelectedType] = useState('aurevoir');
  const [reason, setReason] = useState('');

  const breakupTypes = [
    { type: 'gifle', ...getBreakupTypeInfo('gifle') },
    { type: 'sayonara', ...getBreakupTypeInfo('sayonara') },
    { type: 'adieux', ...getBreakupTypeInfo('adieux') },
    { type: 'salut', ...getBreakupTypeInfo('salut') },
    { type: 'aurevoir', ...getBreakupTypeInfo('aurevoir') }
  ];

  const handleConfirm = () => {
    if (!currentUser?.email) {
      alert('Erreur : utilisateur non connecté');
      return;
    }

    // Archiver la conversation
    const memory = archiveConversation(
      currentUser.email,
      profile,
      messages,
      selectedType,
      reason
    );

    if (memory) {
      // Notifier le parent
      if (onBreakup) {
        onBreakup(memory);
      }

      // Afficher un message de confirmation
      const breakupInfo = getBreakupTypeInfo(selectedType);
      alert(`${breakupInfo.emoji} Conversation archivée dans votre boîte à souvenirs.\n\nVous pourrez la reprendre si vous re-matchez avec ${profile.name || profile.pseudo}.`);

      onClose();
    } else {
      alert('Erreur lors de l\'archivage de la conversation');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 'var(--spacing-lg)'
    }}>
      <div style={{
        background: 'var(--color-cream)',
        borderRadius: 'var(--border-radius-xl)',
        padding: 'var(--spacing-xl)',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        border: '4px solid var(--color-brown-dark)',
        position: 'relative'
      }}>
        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>💔</div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--spacing-xs) 0'
          }}>
            Archiver la conversation
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
            fontStyle: 'italic'
          }}>
            avec {profile.name || profile.pseudo}
          </p>
        </div>

        {/* Sélection du type de rupture */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            Type de séparation :
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacing-sm)'
          }}>
            {breakupTypes.map((bt) => (
              <div
                key={bt.type}
                onClick={() => setSelectedType(bt.type)}
                style={{
                  padding: 'var(--spacing-md)',
                  background: selectedType === bt.type ? bt.color : 'var(--color-beige-light)',
                  color: selectedType === bt.type ? 'white' : 'var(--color-text-primary)',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedType === bt.type ? '3px solid rgba(255,255,255,0.5)' : '2px solid var(--color-brown-light)',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transform: selectedType === bt.type ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedType === bt.type ? 'var(--shadow-md)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedType !== bt.type) {
                    e.target.style.background = 'var(--color-beige)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedType !== bt.type) {
                    e.target.style.background = 'var(--color-beige-light)';
                  }
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{bt.emoji}</div>
                <div style={{ fontSize: '0.85rem' }}>{bt.label}</div>
                <div style={{
                  fontSize: '0.7rem',
                  marginTop: '4px',
                  opacity: selectedType === bt.type ? 1 : 0.7
                }}>
                  {bt.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Raison (optionnelle) */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            Raison (optionnelle) :
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Pourquoi souhaitez-vous archiver cette conversation ?"
            maxLength={200}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: 'var(--spacing-sm)',
              border: '2px solid var(--color-brown-light)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-light)',
            marginTop: '4px',
            textAlign: 'right'
          }}>
            {reason.length} / 200
          </div>
        </div>

        {/* Info importante */}
        <div style={{
          background: 'var(--color-beige-light)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--border-radius-md)',
          border: '2px solid var(--color-gold)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
            <strong>📦 Que se passe-t-il ?</strong>
            <ul style={{ margin: 'var(--spacing-xs) 0 0 0', paddingLeft: 'var(--spacing-lg)' }}>
              <li>La conversation sera archivée dans votre boîte à souvenirs</li>
              <li>Les messages seront conservés</li>
              <li>Les photos seront à nouveau masquées</li>
              <li>Si vous re-matchez, vous pourrez reprendre la conversation</li>
            </ul>
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          marginTop: 'var(--spacing-lg)'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              background: 'var(--color-beige)',
              color: 'var(--color-text-primary)',
              border: '2px solid var(--color-brown-light)',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-beige-light)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-beige)';
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              background: getBreakupTypeInfo(selectedType).color,
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            {getBreakupTypeInfo(selectedType).emoji} Archiver
          </button>
        </div>
      </div>
    </div>
  );
}
