/**
 * Composant Avatar principal (version améliorée)
 * Affiche un avatar graphique SVG semi-réaliste
 */

import React from 'react';

// Styles de cheveux simplifiés
const renderHair = (hairType, hairColor, scale = 1) => {
  const styles = {
    'short-1': (
      <g>
        {/* Cheveux courts style 1 */}
        <ellipse cx="0" cy="-35" rx="65" ry="45" fill={hairColor} />
        <rect x="-65" y="-35" width="130" height="30" fill={hairColor} />
      </g>
    ),
    'short-2': (
      <g>
        {/* Cheveux courts style 2 */}
        <path d="M -60 -20 Q -50 -60 -30 -50 Q 0 -70 30 -50 Q 50 -60 60 -20 Z" fill={hairColor} />
      </g>
    ),
    'medium-1': (
      <g>
        {/* Cheveux mi-longs */}
        <ellipse cx="0" cy="-30" rx="70" ry="50" fill={hairColor} />
        <path d="M -70 0 Q -75 30 -60 50 M 70 0 Q 75 30 60 50" stroke={hairColor} strokeWidth="20" fill="none" strokeLinecap="round" />
      </g>
    ),
    'long-1': (
      <g>
        {/* Cheveux longs */}
        <ellipse cx="0" cy="-30" rx="72" ry="50" fill={hairColor} />
        <path d="M -70 10 Q -80 60 -70 90 M -50 10 Q -55 65 -50 95 M 70 10 Q 80 60 70 90 M 50 10 Q 55 65 50 95"
          stroke={hairColor} strokeWidth="18" fill="none" strokeLinecap="round" />
      </g>
    ),
    'minimal': (
      <g>
        {/* Cheveux minimaux */}
        <path d="M -55 -20 Q -40 -50 -20 -45 Q 0 -55 20 -45 Q 40 -50 55 -20"
          fill={hairColor} stroke={hairColor} strokeWidth="2" />
      </g>
    )
  };

  return styles[hairType] || styles['short-1'];
};

// Sourcils
const renderEyebrows = (eyebrowType, scale = 1) => {
  const styles = {
    'straight': (
      <>
        <path d="M -35 -20 L -15 -20" stroke="#4A4A4A" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <path d="M 15 -20 L 35 -20" stroke="#4A4A4A" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </>
    ),
    'arched': (
      <>
        <path d="M -35 -18 Q -25 -22 -15 -18" stroke="#4A4A4A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M 15 -18 Q 25 -22 35 -18" stroke="#4A4A4A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
      </>
    ),
    'soft': (
      <>
        <path d="M -35 -20 Q -25 -21 -15 -20" stroke="#4A4A4A" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
        <path d="M 15 -20 Q 25 -21 35 -20" stroke="#4A4A4A" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
      </>
    )
  };

  return styles[eyebrowType] || styles['straight'];
};

// Yeux
const renderEyes = (eyeType, eyeColor, scale = 1) => {
  const leftEyeX = -25;
  const rightEyeX = 25;
  const eyeY = -10;

  const styles = {
    'almond': (
      <>
        {/* Yeux en amande */}
        <ellipse cx={leftEyeX} cy={eyeY} rx="10" ry="12" fill="white" stroke="#4A4A4A" strokeWidth="1" />
        <ellipse cx={rightEyeX} cy={eyeY} rx="10" ry="12" fill="white" stroke="#4A4A4A" strokeWidth="1" />
        <circle cx={leftEyeX} cy={eyeY} r="6" fill={eyeColor} />
        <circle cx={rightEyeX} cy={eyeY} r="6" fill={eyeColor} />
        <circle cx={leftEyeX - 1} cy={eyeY} r="3" fill="#1a1a1a" />
        <circle cx={rightEyeX - 1} cy={eyeY} r="3" fill="#1a1a1a" />
        {/* Reflets */}
        <circle cx={leftEyeX + 2} cy={eyeY - 2} r="1.5" fill="white" opacity="0.9" />
        <circle cx={rightEyeX + 2} cy={eyeY - 2} r="1.5" fill="white" opacity="0.9" />
      </>
    ),
    'round': (
      <>
        <circle cx={leftEyeX} cy={eyeY} r="11" fill="white" stroke="#4A4A4A" strokeWidth="1" />
        <circle cx={rightEyeX} cy={eyeY} r="11" fill="white" stroke="#4A4A4A" strokeWidth="1" />
        <circle cx={leftEyeX} cy={eyeY} r="6" fill={eyeColor} />
        <circle cx={rightEyeX} cy={eyeY} r="6" fill={eyeColor} />
        <circle cx={leftEyeX} cy={eyeY} r="3" fill="#1a1a1a" />
        <circle cx={rightEyeX} cy={eyeY} r="3" fill="#1a1a1a" />
        <circle cx={leftEyeX + 2} cy={eyeY - 2} r="1.5" fill="white" opacity="0.9" />
        <circle cx={rightEyeX + 2} cy={eyeY - 2} r="1.5" fill="white" opacity="0.9" />
      </>
    )
  };

  return styles[eyeType] || styles['almond'];
};

// Bouche
const renderMouth = (mouthType, scale = 1) => {
  const styles = {
    'neutral': (
      <path d="M -15 25 Q 0 27 15 25" fill="none" stroke="#D4A5A5" strokeWidth="2.5" strokeLinecap="round" />
    ),
    'slight-smile': (
      <path d="M -18 22 Q 0 28 18 22" fill="none" stroke="#D4A5A5" strokeWidth="2.5" strokeLinecap="round" />
    ),
    'closed': (
      <line x1="-15" y1="24" x2="15" y2="24" stroke="#D4A5A5" strokeWidth="2" strokeLinecap="round" />
    )
  };

  return styles[mouthType] || styles['neutral'];
};

// Forme de visage
const renderFace = (faceShape, skinTone, scale = 1) => {
  const shapes = {
    'oval': (
      <>
        <ellipse cx="0" cy="5" rx="62" ry="75" fill={skinTone} stroke="#00000015" strokeWidth="2" />
        {/* Ombres pour relief */}
        <ellipse cx="-30" cy="15" rx="12" ry="18" fill="#00000008" />
        <ellipse cx="30" cy="15" rx="12" ry="18" fill="#00000008" />
      </>
    ),
    'round': (
      <>
        <circle cx="0" cy="5" r="68" fill={skinTone} stroke="#00000015" strokeWidth="2" />
        <ellipse cx="-28" cy="15" rx="14" ry="20" fill="#00000008" />
        <ellipse cx="28" cy="15" rx="14" ry="20" fill="#00000008" />
      </>
    ),
    'square': (
      <>
        <rect x="-58" y="-60" width="116" height="130" rx="18" fill={skinTone} stroke="#00000015" strokeWidth="2" />
        <ellipse cx="-25" cy="15" rx="12" ry="18" fill="#00000008" />
        <ellipse cx="25" cy="15" rx="12" ry="18" fill="#00000008" />
      </>
    )
  };

  return shapes[faceShape] || shapes['oval'];
};

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
        {/* Cheveux arrière */}
        <g opacity="0.95">
          {renderHair(identity.hairType, identity.hairColor, scale)}
        </g>

        {/* Visage */}
        {renderFace(identity.faceShape, identity.skinTone, scale)}

        {/* Sourcils */}
        {renderEyebrows(identity.eyebrowType, scale)}

        {/* Yeux */}
        {renderEyes(identity.eyeType, identity.eyeColor, scale)}

        {/* Nez (discret) */}
        <ellipse cx="0" cy="8" rx="4" ry="6" fill="#00000008" />

        {/* Bouche */}
        {renderMouth(identity.mouthType, scale)}

        {/* Cheveux avant (frange si applicable) */}
        {identity.hairType.includes('long') && (
          <path d="M -40 -30 Q -30 -20 -20 -25 Q -10 -30 0 -25 Q 10 -30 20 -25 Q 30 -20 40 -30"
            fill={identity.hairColor} opacity="0.9" />
        )}
      </g>
    </svg>
  );
}
