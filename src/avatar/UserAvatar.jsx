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
  // Génère l'état de l'avatar de manière déterministe depuis le userId
  const generatedState = useMemo(() => {
    console.log('[UserAvatar] =================================');
    console.log('[UserAvatar] User complet:', JSON.stringify(user, null, 2));
    console.log('[UserAvatar] user.id =', user?.id);
    console.log('[UserAvatar] user.email =', user?.email);
    console.log('[UserAvatar] user.pseudo =', user?.pseudo);

    if (!user || !user.id) {
      console.warn('[UserAvatar] ❌ PAS DE USER.ID ! user:', user);
      return null;
    }

    console.log('[UserAvatar] ✅ Génération avec ID:', user.id);
    const state = createInitialAvatarState(user.id);
    console.log('[UserAvatar] State identity:', state?.identity);
    return state;
  }, [user?.id]);

  // Utilise l'état personnalisé si fourni, sinon l'état généré
  const finalState = avatarState || generatedState;
  console.log('[UserAvatar] Final state:', finalState);

  // DEBUG: Variables pour l'overlay
  const debugId = user?.id !== undefined ? user.id : 'NO_ID';
  const debugEmail = user?.email ? user.email.substring(0, 10) : 'NO_EMAIL';
  const debugIdentity = finalState?.identity ?
    `${finalState.identity.eyes?.substring(0, 10) || 'no-eyes'}/${finalState.identity.mouth?.substring(0, 10) || 'no-mouth'}` :
    'NULL_STATE';
  const debugHasFinalState = finalState ? 'YES' : 'NO';
  const debugHasIdentity = finalState?.identity ? 'YES' : 'NO';

  // ID utilisateur pour les effets (préférer email si disponible pour cohérence)
  const userId = user?.email || user?.id;

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      {/* DEBUG: Afficher l'ID en overlay */}
      <div style={{
        position: 'absolute',
        bottom: -45,
        left: -10,
        right: -10,
        textAlign: 'center',
        fontSize: '7px',
        color: '#ff0000',
        fontWeight: 'bold',
        zIndex: 999,
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: '4px',
        border: '2px solid red',
        borderRadius: '4px',
        lineHeight: '1.3'
      }}>
        ID:{debugId}<br/>
        {debugEmail}<br/>
        {debugIdentity}<br/>
        State:{debugHasFinalState} Id:{debugHasIdentity}
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
