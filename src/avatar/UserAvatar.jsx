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
  // DEBUG: Afficher l'ID utilisateur
  const debugId = user?.id || 'NO_ID';

  // Génère l'état de l'avatar de manière déterministe depuis le userId
  const generatedState = useMemo(() => {
    console.log('[UserAvatar] Génération avatar pour user:', user);
    if (!user || !user.id) {
      console.warn('[UserAvatar] Pas de user.id, retour null');
      return null;
    }
    const state = createInitialAvatarState(user.id);
    console.log('[UserAvatar] State généré:', state);
    return state;
  }, [user?.id]);

  // Utilise l'état personnalisé si fourni, sinon l'état généré
  const finalState = avatarState || generatedState;
  console.log('[UserAvatar] Final state:', finalState);

  // ID utilisateur pour les effets (préférer email si disponible pour cohérence)
  const userId = user?.email || user?.id;

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      {/* DEBUG: Afficher l'ID en overlay */}
      <div style={{
        position: 'absolute',
        bottom: -15,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '9px',
        color: '#ff0000',
        fontWeight: 'bold',
        zIndex: 999,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '2px'
      }}>
        ID:{debugId}
      </div>

      <AvatarRenderer
        avatarState={finalState}
        size={size}
        className={className}
        style={style}
      />
      {/* Couche d'effets visuels (invisibilité, lueur, etc.) */}
      {userId && <AvatarEffectsLayer userId={userId} />}
    </div>
  );
}
