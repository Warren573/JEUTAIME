/**
 * PetAdoptCard — Carte d'un animal adoptable
 *
 * Affiche les infos d'un animal avec bouton d'adoption.
 * Extrait de AdoptionScreen.jsx pour réduire sa taille.
 */

import React from 'react';

const RARITY_COLORS = {
  legendary: { border: '#FFD700', badge: '#FFD700', label: '✨ Légendaire' },
  rare: { border: '#9C27B0', badge: '#9C27B0', label: '💎 Rare' },
  uncommon: { border: '#2196F3', badge: '#2196F3', label: '⭐ Peu commun' },
  common: { border: 'var(--color-brown)', badge: '#757575', label: '🌟 Commun' },
};

export default function PetAdoptCard({ pet, onAdopt, canAdopt, userCoins }) {
  const rarity = RARITY_COLORS[pet.rarity] || RARITY_COLORS.common;
  const canAfford = userCoins >= pet.adoptionCost;
  const disabled = !canAdopt || !canAfford;

  return (
    <div style={{
      background: 'var(--color-cream)',
      borderRadius: 'var(--border-radius-xl)',
      padding: 'var(--spacing-lg)',
      border: `3px solid ${rarity.border}`,
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
      textAlign: 'center',
    }}>
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

      {/* Emoji animal */}
      <div style={{ fontSize: '100px', marginBottom: 'var(--spacing-sm)' }}>
        {pet.emoji}
      </div>

      {/* Nom */}
      <h3 style={{
        fontSize: '1.5rem',
        margin: '0 0 var(--spacing-xs) 0',
        color: 'var(--color-brown-dark)',
      }}>
        {pet.name}
      </h3>

      {/* Description */}
      <p style={{
        color: 'var(--color-text-primary)',
        fontSize: '0.9rem',
        marginBottom: 'var(--spacing-sm)',
        fontStyle: 'italic',
      }}>
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
        <p style={{ margin: '6px 0' }}>
          <strong>Personnalité:</strong> {pet.personality}
        </p>
        <p style={{ margin: '6px 0' }}>
          <strong>Nourriture préférée:</strong> {pet.favoriteFood}
        </p>
      </div>

      {/* Prix */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-md)',
        fontSize: '1.2rem',
        fontWeight: '700',
        color: 'var(--color-gold-dark)',
      }}>
        <span style={{
          width: '28px',
          height: '28px',
          background: 'var(--color-gold)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-cream)',
          fontSize: '0.9rem',
          fontWeight: '700',
        }}>J</span>
        {pet.adoptionCost} coins
      </div>

      {!canAfford && (
        <p style={{
          color: 'var(--color-romantic)',
          fontSize: '0.8rem',
          marginBottom: '8px',
        }}>
          Il te manque {pet.adoptionCost - userCoins} coins
        </p>
      )}

      {/* Bouton adoption */}
      <button
        onClick={() => onAdopt(pet.id)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: 'var(--spacing-md)',
          background: disabled ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
          border: 'none',
          borderRadius: 'var(--border-radius-lg)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {!canAdopt ? '3 animaux max' : !canAfford ? 'Coins insuffisants' : `Adopter ${pet.name}`}
      </button>
    </div>
  );
}
