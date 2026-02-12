import React from 'react';
import { getLayerPath } from './avatarManifest.ts';

const CATEGORY_ORDER = ['head', 'eyes', 'nose', 'mouth', 'hair', 'beard', 'accessories'];

export default function AvatarRenderer({ selection, size = 280 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: 24,
        background: 'linear-gradient(180deg, #fff 0%, #f3f4f6 100%)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
        overflow: 'hidden'
      }}
    >
      {CATEGORY_ORDER.map((category) => {
        const id = selection?.[category];
        if (!id) return null;
        const src = getLayerPath(category, id);
        if (!src) return null;

        return (
          <img
            key={`${category}-${id}`}
            src={src}
            alt={`${category}-${id}`}
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />
        );
      })}
    </div>
  );
}
