/**
 * AVATAR RENDERER
 *
 * Composant de rendu qui superpose des images selon le Z-ORDER.
 * Ordre fixe par slots, keys stables, remplacement strict.
 */

import React from 'react';
import { getAssetById } from './avatar.generator.js';

/**
 * Charge le chemin d'un asset depuis le manifest
 */
function getAssetPath(assetId) {
  if (!assetId) return null;
  const asset = getAssetById(assetId);
  return asset ? asset.path : null;
}

/**
 * Rend UNE couche d'asset avec key stable basée sur le slot
 */
function renderSlot(slotName, assetId, size) {
  if (!assetId) return null;

  const path = getAssetPath(assetId);
  if (!path) return null;

  return (
    <img
      key={`slot-${slotName}`}
      src={path}
      alt=""
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none'
      }}
    />
  );
}

/**
 * Composant principal de rendu d'avatar
 * Ordre fixe: face → eyes → mouth → beard → hairFront → accessory
 */
export default function AvatarRenderer({ avatarState, size = 100, className, style }) {
  if (!avatarState || !avatarState.identity) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          backgroundColor: '#E0E0E0',
          borderRadius: '50%',
          ...style
        }}
      />
    );
  }

  const { identity } = avatarState;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {renderSlot('face', identity.face, size)}
      {renderSlot('eyes', identity.eyes, size)}
      {renderSlot('mouth', identity.mouth, size)}
      {renderSlot('beard', identity.beard, size)}
      {renderSlot('hairFront', identity.hairFront, size)}
      {renderSlot('accessory', identity.accessory, size)}
    </div>
  );
}
