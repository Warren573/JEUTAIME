import React, { useState } from 'react';
import { targetedSpells, applySpell, getAvailableTargets } from '../../config/spellsSystem';

export default function SpellCaster({ currentUser, onClose, onSpellCast }) {
  const [step, setStep] = useState('spell'); // 'spell' | 'target'
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [targets, setTargets] = useState(getAvailableTargets(currentUser.email));

  const handleSelectSpell = (spellId) => {
    const spell = targetedSpells[spellId];

    // Vérifier le coût
    if (spell.cost > (currentUser.coins || 0)) {
      alert(`❌ Pas assez de pièces ! Il te faut ${spell.cost} 🪙`);
      return;
    }

    setSelectedSpell(spell);
    setStep('target');
  };

  const handleCastSpell = (targetEmail, targetPseudo) => {
    const result = applySpell(
      selectedSpell.id,
      targetEmail,
      currentUser.email,
      currentUser.pseudo
    );

    if (result.success) {
      // Déduire le coût
      const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex].coins = (users[userIndex].coins || 0) - selectedSpell.cost;
        localStorage.setItem('jeutaime_users', JSON.stringify(users));

        // Mettre à jour le currentUser dans localStorage aussi
        localStorage.setItem('jeutaime_current_user', JSON.stringify(users[userIndex]));
      }

      alert(`${result.message}\n\n💰 -${selectedSpell.cost} pièces`);

      if (onSpellCast) onSpellCast();
      onClose();
    } else {
      alert(`❌ Erreur : ${result.error}`);
    }
  };

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
            ✨ Lancer un sort
          </h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
            {step === 'spell' ? 'Choisis ton sort' : 'Choisis ta victime'}
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

      {/* Solde */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '2px solid #FFC107'
      }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
          Ton solde
        </div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFC107' }}>
          {currentUser.coins || 0} 🪙
        </div>
      </div>

      {/* Étape 1 : Choix du sort */}
      {step === 'spell' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px'
        }}>
          {Object.values(targetedSpells).map(spell => {
            const canAfford = spell.cost <= (currentUser.coins || 0);

            return (
              <button
                key={spell.id}
                onClick={() => canAfford && handleSelectSpell(spell.id)}
                disabled={!canAfford}
                style={{
                  background: canAfford ? '#1a1a1a' : '#0a0a0a',
                  border: `2px solid ${canAfford ? spell.color : '#333'}`,
                  borderRadius: '15px',
                  padding: '20px',
                  color: canAfford ? 'white' : '#666',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                  opacity: canAfford ? 1 : 0.5,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => canAfford && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{ fontSize: '48px', flexShrink: 0 }}>
                    {spell.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      {spell.name}
                      <span style={{
                        fontSize: '14px',
                        background: spell.color,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: '700'
                      }}>
                        {spell.cost} 🪙
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '8px' }}>
                      {spell.description}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#888',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '8px',
                      borderRadius: '6px'
                    }}>
                      🔓 {spell.removeCondition.description}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#666',
                      marginTop: '8px'
                    }}>
                      ⏱️ Durée: {Math.round(spell.duration / 3600000)}h
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Étape 2 : Choix de la cible */}
      {step === 'target' && selectedSpell && (
        <>
          <div style={{
            background: 'linear-gradient(135deg, ' + selectedSpell.color + ', ' + selectedSpell.color + 'aa)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '10px' }}>
              {selectedSpell.icon}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '5px' }}>
              {selectedSpell.name}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>
              {selectedSpell.curse.message}
            </div>
          </div>

          <button
            onClick={() => setStep('spell')}
            style={{
              width: '100%',
              padding: '12px',
              background: '#333',
              border: '1px solid #666',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Changer de sort
          </button>

          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#ccc' }}>
            Choisis ta victime :
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '10px'
          }}>
            {targets.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>😕</div>
                <div>Aucun utilisateur disponible</div>
              </div>
            )}

            {targets.map(target => (
              <button
                key={target.email}
                onClick={() => handleCastSpell(target.email, target.pseudo)}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '15px',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = selectedSpell.color + '22';
                  e.currentTarget.style.borderColor = selectedSpell.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1a1a1a';
                  e.currentTarget.style.borderColor = '#333';
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  👤
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                    {target.pseudo}
                  </div>
                  {target.activeSpells.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {target.activeSpells.map(s => s.spellData.icon).join(' ')} Déjà ensorcelé(e)
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '24px' }}>
                  {selectedSpell.icon}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
