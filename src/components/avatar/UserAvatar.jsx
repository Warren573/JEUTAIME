import React from 'react';
import TypographicAvatar from './TypographicAvatar';
import { useAvatarEvolution } from '../../hooks/useAvatarEvolution';

/**
 * Composant pour afficher l'avatar typographique d'un utilisateur
 * Remplace complètement l'ancien système d'images/avataaars
 *
 * @param {Object} user - L'utilisateur
 * @param {boolean} isOwn - Si c'est le profil de l'utilisateur actuel
 * @param {number} size - Taille de l'avatar en pixels
 */
export default function UserAvatar({ user, isOwn = false, size = 50 }) {
  // Calcule l'avatar typographique basé sur le comportement
  const avatar = useAvatarEvolution(user);

  // Détermine la taille relative
  const sizeCategory = size < 60 ? 'small' : size > 100 ? 'large' : 'medium';

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <TypographicAvatar
        avatar={avatar}
        isOwn={isOwn}
        size={sizeCategory}
      />
    </div>
  );
}
