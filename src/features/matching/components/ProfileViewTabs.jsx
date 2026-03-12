/**
 * ProfileViewTabs — Navigation entre les vues de ProfilesScreen
 *
 * Extrait de ProfilesScreen.jsx (tabs répétitifs ~285-330).
 * Les 3 boutons "Découvrir / Matches / Sourires reçus".
 */

import React from 'react';

const TAB_STYLE_BASE = {
  padding: 'var(--spacing-sm) var(--spacing-md)',
  border: '2px solid var(--color-brown-dark)',
  borderRadius: 'var(--border-radius-md)',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.875rem',
  minWidth: 'fit-content',
  transition: 'all var(--transition-normal)',
};

const activeStyle = {
  ...TAB_STYLE_BASE,
  background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
  border: '2px solid var(--color-gold-light)',
  color: 'var(--color-brown-dark)',
  boxShadow: 'var(--shadow-md)',
};

const inactiveStyle = {
  ...TAB_STYLE_BASE,
  background: 'var(--color-brown)',
  color: 'var(--color-cream)',
  boxShadow: 'var(--shadow-sm)',
};

export default function ProfileViewTabs({ viewMode, onChangeView, matchCount, smileCount }) {
  const tabs = [
    { id: 'discover', label: '🔍 Découvrir' },
    { id: 'matches', label: `💕 Matches (${matchCount})` },
    { id: 'smiles', label: `😊 Sourires reçus (${smileCount})` },
  ];

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--spacing-xs)',
      marginBottom: 'var(--spacing-lg)',
      padding: '0 var(--spacing-md)',
      justifyContent: 'center',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChangeView(tab.id)}
          style={viewMode === tab.id ? activeStyle : inactiveStyle}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
