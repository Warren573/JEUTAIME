/**
 * USER AVATAR - WRAPPER D'INTÉGRATION
 *
 * Composant wrapper qui intègre le système d'avatars dans l'application.
 * Accepte un objet user et génère automatiquement son avatar.
 */

import React, { useMemo } from 'react';
import AvatarRenderer from './AvatarRenderer.jsx';
import { createInitialAvatarState } from './avatar.generator.js';
import AvatarEffectsLayer from '../components/effects/AvatarEffectsLayer.jsx';

/**
 * Wrapper d'avatar pour l'application
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
    if (!user) {
      return null;
    }
    // Utiliser id ou email comme identifiant
    const userId = user.id || user.email || 'default';
    return createInitialAvatarState(userId);
  }, [user?.id, user?.email]);

  // Utilise l'état personnalisé si fourni, sinon l'état généré
  const finalState = avatarState || generatedState;

  // ID utilisateur pour les effets (préférer email si disponible pour cohérence)
  const userId = user?.email || user?.id;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
    >
      <AvatarRenderer
        avatarState={finalState}
        size={size}
      />
      {userId && <AvatarEffectsLayer userId={userId} />}
    </div>
  );
}
