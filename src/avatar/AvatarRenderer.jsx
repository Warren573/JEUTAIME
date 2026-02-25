/**
 * AVATAR RENDERER
 */

import React from 'react';
import { getAssetById } from './avatar.generator.js';

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

  const face = identity.face ? getAssetById(identity.face)?.path : null;
  const eyes = identity.eyes ? getAssetById(identity.eyes)?.path : null;
  const mouth = identity.mouth ? getAssetById(identity.mouth)?.path : null;
  const beard = identity.beard ? getAssetById(identity.beard)?.path : null;
  const hair = identity.hairFront ? getAssetById(identity.hairFront)?.path : null;
  const accessory = identity.accessory ? getAssetById(identity.accessory)?.path : null;

  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      width={size}
      height={size}
      style={{
        display: 'block',
        ...style
      }}
    >
      {face && <image href={face} width="512" height="512" />}
      {eyes && <image href={eyes} width="512" height="512" />}
      {mouth && <image href={mouth} width="512" height="512" />}
      {beard && <image href={beard} width="512" height="512" />}
      {hair && <image href={hair} width="512" height="512" />}
      {accessory && <image href={accessory} width="512" height="512" />}
    </svg>
  );
}
