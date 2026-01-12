import React from 'react';
import { getPreviousLevel } from '../../lib/avatarEngine';

/**
 * Composant d'avatar typographique
 * Affiche un avatar basé sur la typographie qui évolue avec le comportement
 *
 * @param {Object} avatar - L'objet avatar typographique
 * @param {boolean} isOwn - Si c'est le profil de l'utilisateur actuel (affiche niveau N-1)
 * @param {string} size - Taille de l'avatar ('small', 'medium', 'large')
 */
export default function TypographicAvatar({ avatar, isOwn = false, size = 'medium' }) {
  if (!avatar) {
    // Fallback : affiche une initiale par défaut
    return (
      <div style={styles.fallback}>
        A
      </div>
    );
  }

  // Si c'est son propre avatar, on affiche le niveau N-1 (décalage volontaire)
  const displayLevel = isOwn ? getPreviousLevel(avatar.level) : avatar.level;

  // Récupère le contenu pour le niveau à afficher
  let displayContent = avatar.content;
  if (isOwn && displayLevel !== avatar.level) {
    // Pour l'affichage "soi", on doit recalculer le contenu du niveau précédent
    // En attendant une vraie implémentation, on affiche un symbole générique
    if (displayLevel === 'initial') displayContent = avatar.content[0] || 'A';
    if (displayLevel === 'symbol') displayContent = '·';
    if (displayLevel === 'word' && avatar.level === 'phrase') displayContent = 'Cherche';
  }

  // Ajuste la taille selon le prop
  const sizeMultiplier = {
    small: 0.6,
    medium: 1,
    large: 1.4
  };

  const multiplier = sizeMultiplier[size] || 1;

  // Calcule la taille en fonction du niveau et du multiplier
  const getFontSize = () => {
    const baseSizes = {
      initial: 3,
      symbol: 2.5,
      word: 1.2,
      phrase: 0.9
    };
    return `${(baseSizes[displayLevel] || 1.2) * multiplier}rem`;
  };

  const containerStyle = {
    ...styles.container,
    fontWeight: avatar.visualState.fontWeight,
    letterSpacing: avatar.visualState.letterSpacing,
    opacity: avatar.visualState.opacity,
    fontSize: getFontSize(),
    fontStyle: avatar.visualState.fontStyle || 'normal',
    minHeight: size === 'small' ? '40px' : size === 'large' ? '120px' : '80px',
    padding: size === 'small' ? '0.5rem' : '1rem',
  };

  return (
    <div
      className="typographic-avatar"
      style={containerStyle}
    >
      {displayContent}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Georgia, serif',
    color: 'var(--color-text-primary, #1a1a1a)',
    userSelect: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
    lineHeight: 1.4,
    maxWidth: '100%',
    wordWrap: 'break-word',
  },
  fallback: {
    fontFamily: 'Georgia, serif',
    color: 'var(--color-text-primary, #1a1a1a)',
    fontSize: '2rem',
    fontWeight: 300,
    opacity: 0.5,
    textAlign: 'center',
    padding: '1rem',
    userSelect: 'none',
  }
};
