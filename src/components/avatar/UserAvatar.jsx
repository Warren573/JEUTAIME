import React from 'react';
import Avatar from 'avataaars';

/**
 * Composant pour afficher l'avatar d'un utilisateur
 * Si avatarConfig existe, affiche l'avatar personnalisé
 * Sinon affiche un emoji par défaut
 */
export default function UserAvatar({ avatarConfig, size = 50, emoji = '👤' }) {
  if (avatarConfig && typeof avatarConfig === 'object') {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Avatar
          style={{ width: `${size}px`, height: `${size}px` }}
          avatarStyle="Circle"
          {...avatarConfig}
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
      fontSize: `${size * 0.5}px`
    }}>
      {emoji}
    </div>
  );
}
