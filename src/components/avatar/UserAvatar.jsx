/**
 * Wrapper UserAvatar - Compatible avec l'interface existante de l'app
 * Génère et affiche un avatar graphique
 */

import React, { useMemo } from 'react';
import Avatar from './Avatar';
import { createInitialState } from '../../lib/avatar/generator';

export default function UserAvatar({ user, isOwn = false, size = 50 }) {
  const avatarState = useMemo(() => {
    if (!user) return null;
    const userId = user.id || user.email || user.name || 'default';
    return createInitialState(userId);
  }, [user]);

  if (!avatarState) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontSize: `${size * 0.4}px`, color: '#9CA3AF' }}>?</span>
      </div>
    );
  }

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <Avatar state={avatarState} size={size} animate={true} />
    </div>
  );
}
