/**
 * PetIncarnateCard — Carte d'un animal pour l'onglet Incarnation
 *
 * Extrait de AdoptionScreen.jsx (section adoptionTab === 'incarnate').
 * Affiche la carte avec le badge "Forme actuelle" et le bouton Incarner.
 */

import React from 'react';

const RARITY_COLORS = {
  legendary: { border: '#FFD700', badge: '#FFD700', label: '✨ Légendaire' },
  rare: { border: '#9C27B0', badge: '#9C27B0', label: '💎 Rare' },
  uncommon: { border: '#2196F3', badge: '#2196F3', label: '⭐ Peu commun' },
  common: { border: 'var(--color-brown)', badge: '#757575', label: '🌟 Commun' },
};

export default function PetIncarnateCard({ pet, onIncarnate, isCurrentForm }) {
  const rarity = RARITY_COLORS[pet.rarity] || RARITY_COLORS.common;

  return (
    <div style={{
      background: 'var(--color-cream)',
      borderRadius: 'var(--border-radius-xl)',
      padding: 'var(--spacing-lg)',
      border: isCurrentForm ? '4px solid #f093fb' : `3px solid ${rarity.border}`,
      boxShadow: isCurrentForm
        ? '0 0 20px rgba(240, 147, 251, 0.5)'
        : 'var(--shadow-lg)',
      position: 'relative',
      textAlign: 'center',
    }}>
      {/* Badge "Forme actuelle" */}
      {isCurrentForm && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#f093fb',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          boxShadow: 'var(--shadow-md)',
        }}>
          ✨ Forme actuelle
        </div>
      )}

      {/* Badge rareté */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: rarity.badge,
        color: 'white',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '0.7rem',
        fontWeight: '600',
        textTransform: 'uppercase',
      }}>
        {rarity.label}
      </div>

      {/* Emoji */}
      <div style={{ fontSize: '100px', marginBottom: 'var(--spacing-sm)' }}>
        {pet.emoji}
      </div>

      {/* Nom */}
      <h3 style={{ fontSize: '1.5rem', margin: '0 0 var(--spacing-xs) 0', color: 'var(--color-brown-dark)' }}>
        {pet.name}
      </h3>

      {/* Description */}
      <p style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-sm)', fontStyle: 'italic' }}>
        {pet.description}
      </p>

      {/* Détails */}
      <div style={{
        background: 'var(--color-beige-light)',
        padding: 'var(--spacing-sm)',
        borderRadius: 'var(--border-radius-md)',
        marginBottom: 'var(--spacing-md)',
        textAlign: 'left',
        fontSize: '0.85rem',
        color: 'var(--color-brown-dark)',
      }}>
        <p style={{ margin: '6px 0' }}><strong>Personnalité:</strong> {pet.personality}</p>
        <p style={{ margin: '6px 0' }}><strong>Nourriture préférée:</strong> {pet.favoriteFood}</p>
      </div>

      {/* Bouton incarner */}
      <button
        onClick={() => onIncarnate(pet.id)}
        disabled={isCurrentForm}
        style={{
          width: '100%',
          padding: 'var(--spacing-md)',
          background: isCurrentForm
            ? 'linear-gradient(135deg, #666, #888)'
            : 'linear-gradient(135deg, #f093fb, #f5576c)',
          border: 'none',
          borderRadius: 'var(--border-radius-lg)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: isCurrentForm ? 'default' : 'pointer',
          boxShadow: 'var(--shadow-md)',
          opacity: isCurrentForm ? 0.7 : 1,
        }}
      >
        {isCurrentForm ? '✓ Forme actuelle' : '🎭 Incarner'}
      </button>
    </div>
  );
}
