import React from 'react';
import { getActiveSpells } from '../../config/spellsSystem';

// Overlay pour afficher les sorts actifs sur un avatar
export default function SpellOverlay({ userEmail, size = 'normal' }) {
  const activeSpells = getActiveSpells(userEmail);

  if (activeSpells.length === 0) return null;

  // Prendre le sort le plus récent
  const latestSpell = activeSpells[activeSpells.length - 1];
  const spell = latestSpell.spellData;

  if (!spell) return null;

  const sizeMap = {
    small: { overlay: '32px', badge: '10px', badgePadding: '4px 8px' },
    normal: { overlay: '64px', badge: '11px', badgePadding: '5px 10px' },
    large: { overlay: '96px', badge: '13px', badgePadding: '6px 12px' }
  };

  const styles = sizeMap[size] || sizeMap.normal;

  return (
    <>
      {/* Overlay emoji */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: styles.overlay,
        zIndex: 10,
        pointerEvents: 'none',
        animation: 'spellPulse 2s ease-in-out infinite',
        textShadow: '0 0 10px rgba(0,0,0,0.5)'
      }}>
        {spell.transformation.overlay}
      </div>

      {/* Badge en haut */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: spell.color,
        color: 'white',
        fontSize: styles.badge,
        fontWeight: '700',
        padding: styles.badgePadding,
        borderRadius: '8px',
        whiteSpace: 'nowrap',
        zIndex: 11,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255,255,255,0.3)'
      }}>
        {spell.transformation.badge}
      </div>

      <style>{`
        @keyframes spellPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// Composant pour appliquer le filtre CSS sur l'avatar
export function SpellAvatarFilter({ userEmail, children, style = {} }) {
  const activeSpells = getActiveSpells(userEmail);

  if (activeSpells.length === 0) {
    return <div style={style}>{children}</div>;
  }

  const latestSpell = activeSpells[activeSpells.length - 1];
  const spell = latestSpell.spellData;

  const filterStyle = spell ? {
    ...style,
    filter: spell.transformation.avatarFilter,
    transition: 'filter 0.5s ease'
  } : style;

  return (
    <div style={filterStyle}>
      {children}
    </div>
  );
}
