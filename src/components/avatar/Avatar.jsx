/**
 * Composant Avatar principal (version initiale simplifiée)
 * Affiche un avatar graphique SVG basé sur l'identité générée
 */

import React from 'react';

export default function Avatar({ state, size = 200, animate = true }) {
  if (!state || !state.identity) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#E5E7EB" />
      </svg>
    );
  }

  const { identity, evolution } = state;
  const scale = evolution?.presence || 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ overflow: 'visible' }}
    >
      <g transform={`translate(100, 100) scale(${scale})`}>
        {/* Face */}
        <ellipse
          cx="0"
          cy="0"
          rx="60"
          ry="70"
          fill={identity.skinTone}
          stroke="#00000020"
          strokeWidth="1"
        />

        {/* Eyes */}
        <ellipse cx="-20" cy="-10" rx="8" ry="10" fill={identity.eyeColor} />
        <ellipse cx="20" cy="-10" rx="8" ry="10" fill={identity.eyeColor} />
        <circle cx="-20" cy="-10" r="3" fill="#000" />
        <circle cx="20" cy="-10" r="3" fill="#000" />

        {/* Mouth */}
        <path
          d="M -15 20 Q 0 25 15 20"
          fill="none"
          stroke="#00000040"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
