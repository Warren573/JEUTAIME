/**
 * AVATAR RENDERER
 */

import React from 'react';
import { getAssetById } from './avatar.generator.js';

function renderSlot(slotName, assetId) {
  if (!assetId) return null;
  const asset = getAssetById(assetId);
  if (!asset) return null;

  return (
    <img
      key={`slot-${slotName}`}
      src={asset.path}
      alt=""
      draggable={false}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'fill',
        display: 'block'
      }}
    />
  );
}

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
        position: 'absolute',
        top: 0,
        left: 0,
        width: size,
        height: size,
        ...style
      }}
    >
      {renderSlot('face', identity.face)}
      {renderSlot('eyes', identity.eyes)}
      {renderSlot('mouth', identity.mouth)}
      {renderSlot('beard', identity.beard)}
      {renderSlot('hairFront', identity.hairFront)}
      {renderSlot('accessory', identity.accessory)}
    </div>
  );
}
