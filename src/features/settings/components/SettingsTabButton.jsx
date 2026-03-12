/**
 * SettingsTabButton — Bouton d'onglet dans SettingsScreen
 *
 * Extrait de SettingsScreen.jsx pour réduire la répétition
 * des boutons d'onglets (profile / referral / diagnostic / shop / etc.).
 */

import React from 'react';

export default function SettingsTabButton({ tabId, activeTab, onClick, icon, label }) {
  const isActive = tabId === activeTab;

  return (
    <button
      onClick={() => onClick(tabId)}
      style={{
        padding: '10px 16px',
        background: isActive
          ? 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))'
          : 'var(--color-cream)',
        border: isActive
          ? '2px solid var(--color-gold)'
          : '2px solid var(--color-brown-light)',
        borderRadius: 'var(--border-radius-md)',
        color: isActive ? 'var(--color-brown-dark)' : 'var(--color-text-secondary)',
        fontWeight: isActive ? '700' : '500',
        fontSize: '0.85rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'all 0.2s',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
