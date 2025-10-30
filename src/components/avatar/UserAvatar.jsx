import React from 'react';

/**
 * Composant pour afficher l'avatar d'un utilisateur
 * Affiche l'image avatar si disponible, sinon un emoji par défaut
 */
export default function UserAvatar({ avatar, user, size = 50, emoji = '👤' }) {
  // Priority 1: Use avatar URL if provided directly
  const avatarUrl = avatar || user?.avatar;

  if (avatarUrl) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--color-gold)',
        background: 'var(--color-beige-light)'
      }}>
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Fallback to emoji if image fails to load
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: ${size * 0.5}px; background: linear-gradient(135deg, #667eea, #764ba2);">${emoji}</div>`;
          }}
        />
      </div>
    );
  }

  // Fallback: emoji
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${size * 0.5}px`,
      border: '2px solid var(--color-gold)'
    }}>
      {emoji}
    </div>
  );
}
