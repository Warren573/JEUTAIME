/**
 * USER AVATAR - WRAPPER D'INTÉGRATION
 *
 * Composant wrapper qui intègre le système d'avatars dans l'application.
 * Accepte un objet user et génère automatiquement son avatar.
 */

import React, { useMemo } from 'react';
import AvatarRenderer from './AvatarRenderer.jsx';
import { createInitialAvatarState } from './avatar.generator.js';

/**
 * Wrapper d'avatar pour l'application
 *
 * @param {Object} props
 * @param {Object} props.user - Objet utilisateur
 * @param {string} props.user.id - ID unique de l'utilisateur
 * @param {number} [props.size=50] - Taille en pixels
 * @param {string} [props.className] - Classe CSS optionnelle
 * @param {Object} [props.style] - Styles inline optionnels
 * @param {Object} [props.avatarState] - État d'avatar personnalisé (optionnel)
 */
export default function UserAvatar({
  user,
  size = 50,
  className,
  style,
  avatarState
}) {
  // Génère l'état de l'avatar de manière déterministe depuis le userId
  const generatedState = useMemo(() => {
    if (!user || !user.id) return null;
    return createInitialAvatarState(user.id);
  }, [user?.id]);

  // Utilise l'état personnalisé si fourni, sinon l'état généré
  const finalState = avatarState || generatedState;

  return (
    <AvatarRenderer
      avatarState={finalState}
      size={size}
      className={className}
      style={style}
    />
  );
}
