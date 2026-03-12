/**
 * StatBar — Barre de statistique pour les animaux
 *
 * Extrait de AdoptionScreen.jsx (défini inline à la ligne 156).
 */

import React from 'react';

export default function StatBar({ label, value, color, icon }) {
  return (
    <div style={{ marginBottom: 'var(--spacing-sm)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: '0.85rem',
        fontWeight: '600',
      }}>
        <span>{icon} {label}</span>
        <span style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div style={{
        background: 'var(--color-tan)',
        borderRadius: '10px',
        height: '12px',
        overflow: 'hidden',
        border: '2px solid var(--color-brown-light)',
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}
