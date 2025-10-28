import React, { useState } from 'react';
import { getActiveSpells, removeSpell } from '../../config/spellsSystem';

// Composant pour gérer ses propres sorts et demander désenvoutement
export default function SpellManager({ currentUser, targetUser, onClose, onSpellRemoved }) {
  const [activeSpells, setActiveSpells] = useState(
    getActiveSpells(targetUser?.email || currentUser.email)
  );

  const isOwnProfile = !targetUser || targetUser.email === currentUser.email;

  const handleRemoveSpell = (spell) => {
    if (!spell.spellData.removeCondition) return;

    const targetEmail = targetUser?.email || currentUser.email;
    const targetPseudo = targetUser?.pseudo || currentUser.pseudo;

    const result = removeSpell(
      targetEmail,
      spell.spellId,
      currentUser.email
    );

    if (result.success) {
      alert(result.message);

      // Mettre à jour la liste
      setActiveSpells(activeSpells.filter(s => s.spellId !== spell.spellId));

      if (onSpellRemoved) onSpellRemoved();

      // Si plus de sorts, fermer
      if (activeSpells.length <= 1) {
        onClose();
      }
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const remaining = expiresAt - Date.now();
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  if (activeSpells.length === 0) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>✨</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>
          {isOwnProfile ? 'Aucun sort actif' : `${targetUser.pseudo} n'a pas de sorts`}
        </h2>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '30px' }}>
          {isOwnProfile ? 'Tu es libre de tout enchantement !' : 'Cette personne n\'est pas ensorcelée'}
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '12px 30px',
            background: '#E91E63',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
            {isOwnProfile ? '🎭 Tes sorts actifs' : `🎭 Sorts sur ${targetUser.pseudo}`}
          </h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
            {activeSpells.length} sort{activeSpells.length > 1 ? 's' : ''} en cours
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#333',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Sorts actifs */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {activeSpells.map((spell, index) => {
          const spellData = spell.spellData;

          return (
            <div
              key={index}
              style={{
                background: '#1a1a1a',
                borderRadius: '15px',
                padding: '20px',
                border: `2px solid ${spellData.color}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Fond décoratif */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                fontSize: '120px',
                opacity: 0.1,
                pointerEvents: 'none'
              }}>
                {spellData.icon}
              </div>

              {/* Contenu */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* En-tête du sort */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ fontSize: '56px', flexShrink: 0 }}>
                    {spellData.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      marginBottom: '5px',
                      color: spellData.color
                    }}>
                      {spellData.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#aaa',
                      marginBottom: '8px'
                    }}>
                      {spellData.curse.message}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      Lancé par <span style={{ color: '#E91E63', fontWeight: '600' }}>{spell.casterPseudo}</span>
                    </div>
                  </div>
                </div>

                {/* Temps restant */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    ⏱️ Temps restant
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: spellData.color
                  }}>
                    {getTimeRemaining(spell.expiresAt)}
                  </div>
                </div>

                {/* Condition de désenvoutement */}
                <div style={{
                  background: spellData.color + '22',
                  border: `1px solid ${spellData.color}`,
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#ccc',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    🔓 Pour briser ce sort :
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>
                    {spellData.removeCondition.description}
                  </div>
                </div>

                {/* Bouton de désenvoutement */}
                {!isOwnProfile && (
                  <button
                    onClick={() => handleRemoveSpell(spell)}
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: `linear-gradient(135deg, ${spellData.color}, ${spellData.color}aa)`,
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {spellData.removeCondition.actionLabel}
                  </button>
                )}

                {isOwnProfile && (
                  <div style={{
                    padding: '15px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#888'
                  }}>
                    💡 Quelqu'un doit t'aider à briser ce sort !
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
