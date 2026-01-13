/**
 * Composant Avatar ultra-réaliste avec filtres SVG avancés
 */

import React from 'react';

// Utilitaires de couleur
const darkenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) - amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) - amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
  return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
};

const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
};

// Définitions des filtres et effets SVG globaux
const SVGDefs = ({ skinTone, hairColor, eyeColor }) => {
  const skinLight = lightenColor(skinTone, 20);
  const skinDark = darkenColor(skinTone, 15);
  const hairDark = darkenColor(hairColor, 25);
  const hairLight = lightenColor(hairColor, 15);

  return (
    <defs>
      {/* Filtre de flou pour ombres douces */}
      <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="0" dy="2" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      {/* Filtre pour effet de profondeur */}
      <filter id="depth">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
        <feOffset dx="0" dy="1" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.25"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      {/* Gradient de peau réaliste */}
      <radialGradient id="skinGradient" cx="50%" cy="30%">
        <stop offset="0%" stopColor={skinLight} />
        <stop offset="40%" stopColor={skinTone} />
        <stop offset="80%" stopColor={skinDark} />
        <stop offset="100%" stopColor={darkenColor(skinTone, 25)} />
      </radialGradient>

      {/* Gradient pour cheveux brillants */}
      <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={hairLight} />
        <stop offset="30%" stopColor={hairColor} />
        <stop offset="70%" stopColor={hairColor} />
        <stop offset="100%" stopColor={hairDark} />
      </linearGradient>

      {/* Gradient pour reflet des cheveux */}
      <linearGradient id="hairShine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="40%" stopColor="white" stopOpacity="0.4" />
        <stop offset="60%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>

      {/* Gradient iris détaillé */}
      <radialGradient id="irisGradient" cx="50%" cy="50%">
        <stop offset="0%" stopColor={lightenColor(eyeColor, 30)} />
        <stop offset="30%" stopColor={eyeColor} />
        <stop offset="70%" stopColor={darkenColor(eyeColor, 20)} />
        <stop offset="100%" stopColor={darkenColor(eyeColor, 40)} />
      </radialGradient>

      {/* Pattern texture peau */}
      <pattern id="skinTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.3" fill={skinDark} opacity="0.05" />
        <circle cx="3" cy="3" r="0.3" fill={skinDark} opacity="0.05" />
      </pattern>

      {/* Gradient pour pommettes rosées */}
      <radialGradient id="blushGradient" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#FF6B9D" stopOpacity="0.25" />
        <stop offset="60%" stopColor="#FF8BA7" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#FFB3C6" stopOpacity="0" />
      </radialGradient>

      {/* Gradient lèvres */}
      <linearGradient id="lipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D4999F" />
        <stop offset="50%" stopColor="#C88B8B" />
        <stop offset="100%" stopColor="#B67878" />
      </linearGradient>
    </defs>
  );
};

// Rendu du visage avec anatomie détaillée
const renderFace = (faceShape, skinTone) => {
  const shadowTone = darkenColor(skinTone, 12);

  return (
    <g id="face">
      {/* Ombre portée du visage */}
      <ellipse cx="0" cy="8" rx="64" ry="77" fill="#00000020" filter="url(#softShadow)" />

      {/* Base du visage avec gradient */}
      <ellipse cx="0" cy="5" rx="62" ry="75" fill="url(#skinGradient)" />

      {/* Texture de peau */}
      <ellipse cx="0" cy="5" rx="62" ry="75" fill="url(#skinTexture)" opacity="0.3" />

      {/* Structure osseuse - pommettes */}
      <ellipse cx="-32" cy="12" rx="16" ry="22" fill={shadowTone} opacity="0.15" filter="url(#softShadow)" />
      <ellipse cx="32" cy="12" rx="16" ry="22" fill={shadowTone} opacity="0.15" filter="url(#softShadow)" />

      {/* Pommettes rosées (blush naturel) */}
      <ellipse cx="-30" cy="15" rx="14" ry="18" fill="url(#blushGradient)" />
      <ellipse cx="30" cy="15" rx="14" ry="18" fill="url(#blushGradient)" />

      {/* Orbites des yeux (creux) */}
      <ellipse cx="-26" cy="-12" rx="15" ry="10" fill={shadowTone} opacity="0.12" />
      <ellipse cx="26" cy="-12" rx="15" ry="10" fill={shadowTone} opacity="0.12" />

      {/* Arête du nez (highlight) */}
      <ellipse cx="0" cy="0" rx="5" ry="20" fill="white" opacity="0.18" />

      {/* Côtés du nez (ombres) */}
      <ellipse cx="-8" cy="8" rx="4" ry="12" fill={shadowTone} opacity="0.1" />
      <ellipse cx="8" cy="8" rx="4" ry="12" fill={shadowTone} opacity="0.1" />

      {/* Ombre sous le nez */}
      <ellipse cx="0" cy="18" rx="10" ry="4" fill={shadowTone} opacity="0.18" />

      {/* Philtrum (sillon naso-labial) */}
      <path d="M 0 18 L 0 22" stroke={shadowTone} strokeWidth="1.5" opacity="0.15" />
      <path d="M -2 18 Q -1 20 -1 22" stroke={shadowTone} strokeWidth="0.8" opacity="0.1" />
      <path d="M 2 18 Q 1 20 1 22" stroke={shadowTone} strokeWidth="0.8" opacity="0.1" />

      {/* Ombre du menton */}
      <ellipse cx="0" cy="58" rx="28" ry="16" fill={shadowTone} opacity="0.1" filter="url(#softShadow)" />

      {/* Mâchoire (structure) */}
      <path d="M -45 25 Q -50 40 -42 52 Q -35 58 -20 62 Q 0 64 20 62 Q 35 58 42 52 Q 50 40 45 25"
        stroke={shadowTone} strokeWidth="0.5" fill="none" opacity="0.08" />

      {/* Highlight front */}
      <ellipse cx="-15" cy="-28" rx="18" ry="14" fill="white" opacity="0.15" />
      <ellipse cx="15" cy="-28" rx="18" ry="14" fill="white" opacity="0.15" />

      {/* Highlight pommettes supérieures */}
      <ellipse cx="-28" cy="8" rx="12" ry="10" fill="white" opacity="0.12" />
      <ellipse cx="28" cy="8" rx="12" ry="10" fill="white" opacity="0.12" />

      {/* Contour du visage */}
      <ellipse cx="0" cy="5" rx="62" ry="75" fill="none" stroke={darkenColor(skinTone, 20)} strokeWidth="0.8" opacity="0.3" />
    </g>
  );
};

// Nez détaillé 3D
const renderNose = (skinTone) => {
  const shadowTone = darkenColor(skinTone, 15);
  const highlightTone = lightenColor(skinTone, 25);

  return (
    <g id="nose">
      {/* Arête du nez - highlight central */}
      <ellipse cx="0" cy="5" rx="3.5" ry="15" fill={highlightTone} opacity="0.6" />

      {/* Structure osseuse du nez */}
      <path d="M -6 -2 Q -3 0 -2 5 Q -1 8 -3 10 M 6 -2 Q 3 0 2 5 Q 1 8 3 10"
        stroke={shadowTone} strokeWidth="0.8" fill="none" opacity="0.15" />

      {/* Narines */}
      <ellipse cx="-4.5" cy="14" rx="3" ry="3.5" fill={shadowTone} opacity="0.3" />
      <ellipse cx="4.5" cy="14" rx="3" ry="3.5" fill={shadowTone} opacity="0.3" />

      {/* Intérieur des narines (ombre profonde) */}
      <ellipse cx="-4" cy="15" rx="2" ry="2.5" fill="#00000030" />
      <ellipse cx="4" cy="15" rx="2" ry="2.5" fill="#00000030" />

      {/* Bout du nez (highlight) */}
      <ellipse cx="0" cy="13" rx="5" ry="4" fill={highlightTone} opacity="0.25" />

      {/* Pointe du nez */}
      <circle cx="0" cy="14" r="3.5" fill="white" opacity="0.1" />

      {/* Ailes du nez */}
      <path d="M -7 12 Q -5 14 -3 13" fill={shadowTone} opacity="0.1" />
      <path d="M 7 12 Q 5 14 3 13" fill={shadowTone} opacity="0.1" />
    </g>
  );
};

// Yeux ultra-détaillés
const renderEyes = (eyeType, eyeColor) => {
  const darkIris = darkenColor(eyeColor, 25);

  return (
    <g id="eyes">
      {/* ŒIL GAUCHE */}
      <g id="leftEye">
        {/* Ombre de l'œil */}
        <ellipse cx="-26" cy="-9" rx="12" ry="14" fill="#00000015" filter="url(#softShadow)" />

        {/* Blanc de l'œil (sclère) avec volume */}
        <ellipse cx="-26" cy="-10" rx="11" ry="13" fill="#FFFFFF" />
        <ellipse cx="-26" cy="-10" rx="11" ry="13" fill="url(#skinGradient)" opacity="0.05" />

        {/* Veinules subtiles */}
        <path d="M -35 -10 Q -30 -8 -28 -10" stroke="#FF000008" strokeWidth="0.4" />
        <path d="M -33 -15 Q -29 -12 -26 -14" stroke="#FF000006" strokeWidth="0.4" />
        <path d="M -30 -5 Q -28 -8 -25 -6" stroke="#FF000006" strokeWidth="0.4" />

        {/* Limbe (anneau sombre autour de l'iris) */}
        <circle cx="-26" cy="-10" r="7.5" fill={darkIris} opacity="0.6" />

        {/* Iris avec gradient radial */}
        <circle cx="-26" cy="-10" r="7" fill="url(#irisGradient)" />

        {/* Motif cryptes de l'iris (lignes radiales) */}
        {Array.from({length: 16}).map((_, i) => {
          const angle = (i * Math.PI * 2) / 16;
          const x1 = -26 + Math.cos(angle) * 2.5;
          const y1 = -10 + Math.sin(angle) * 2.5;
          const x2 = -26 + Math.cos(angle) * 6;
          const y2 = -10 + Math.sin(angle) * 6;
          return (
            <line key={`left-crypt-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={darkIris} strokeWidth="0.5" opacity="0.4" />
          );
        })}

        {/* Collerette de l'iris (cercle intermédiaire) */}
        <circle cx="-26" cy="-10" r="4" fill="none" stroke={darkIris} strokeWidth="0.6" opacity="0.3" />

        {/* Pupille */}
        <circle cx="-26" cy="-10" r="3.5" fill="#0a0a0a" />

        {/* Reflets dans la pupille */}
        <circle cx="-24.5" cy="-11.5" r="2" fill="white" opacity="0.9" />
        <circle cx="-27" cy="-8" r="1" fill="white" opacity="0.6" />
        <ellipse cx="-24" cy="-7" rx="1.2" ry="0.8" fill="white" opacity="0.4" />

        {/* Contour de l'œil (paupière supérieure) */}
        <path d="M -37 -10 Q -32 -15 -26 -15 Q -20 -15 -15 -10"
          stroke="#3a3a3a" strokeWidth="1.5" fill="none" opacity="0.8" />

        {/* Paupière inférieure */}
        <path d="M -37 -10 Q -32 -6 -26 -5 Q -20 -6 -15 -10"
          stroke="#3a3a3a" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Cils supérieurs */}
        {Array.from({length: 8}).map((_, i) => {
          const x = -35 + i * 2.8;
          const startY = -10 - Math.abs(4 - i) * 1.2;
          const endY = startY - 4 - Math.random() * 2;
          const curvature = (i - 4) * 0.5;
          return (
            <path key={`left-lash-top-${i}`}
              d={`M ${x} ${startY} Q ${x + curvature} ${endY - 1} ${x + curvature * 0.5} ${endY}`}
              stroke="#1a1a1a" strokeWidth="0.6" fill="none" opacity="0.8"
              strokeLinecap="round" />
          );
        })}

        {/* Cils inférieurs */}
        {Array.from({length: 5}).map((_, i) => {
          const x = -33 + i * 3.5;
          const startY = -10 + Math.abs(2 - i) * 0.8;
          const endY = startY + 2 + Math.random();
          return (
            <path key={`left-lash-bottom-${i}`}
              d={`M ${x} ${startY} L ${x + (i - 2) * 0.3} ${endY}`}
              stroke="#1a1a1a" strokeWidth="0.4" fill="none" opacity="0.5"
              strokeLinecap="round" />
          );
        })}
      </g>

      {/* ŒIL DROIT (symétrique) */}
      <g id="rightEye">
        {/* Ombre */}
        <ellipse cx="26" cy="-9" rx="12" ry="14" fill="#00000015" filter="url(#softShadow)" />

        {/* Sclère */}
        <ellipse cx="26" cy="-10" rx="11" ry="13" fill="#FFFFFF" />
        <ellipse cx="26" cy="-10" rx="11" ry="13" fill="url(#skinGradient)" opacity="0.05" />

        {/* Veinules */}
        <path d="M 35 -10 Q 30 -8 28 -10" stroke="#FF000008" strokeWidth="0.4" />
        <path d="M 33 -15 Q 29 -12 26 -14" stroke="#FF000006" strokeWidth="0.4" />
        <path d="M 30 -5 Q 28 -8 25 -6" stroke="#FF000006" strokeWidth="0.4" />

        {/* Limbe */}
        <circle cx="26" cy="-10" r="7.5" fill={darkIris} opacity="0.6" />

        {/* Iris */}
        <circle cx="26" cy="-10" r="7" fill="url(#irisGradient)" />

        {/* Cryptes */}
        {Array.from({length: 16}).map((_, i) => {
          const angle = (i * Math.PI * 2) / 16;
          const x1 = 26 + Math.cos(angle) * 2.5;
          const y1 = -10 + Math.sin(angle) * 2.5;
          const x2 = 26 + Math.cos(angle) * 6;
          const y2 = -10 + Math.sin(angle) * 6;
          return (
            <line key={`right-crypt-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={darkIris} strokeWidth="0.5" opacity="0.4" />
          );
        })}

        {/* Collerette */}
        <circle cx="26" cy="-10" r="4" fill="none" stroke={darkIris} strokeWidth="0.6" opacity="0.3" />

        {/* Pupille */}
        <circle cx="26" cy="-10" r="3.5" fill="#0a0a0a" />

        {/* Reflets */}
        <circle cx="27.5" cy="-11.5" r="2" fill="white" opacity="0.9" />
        <circle cx="25" cy="-8" r="1" fill="white" opacity="0.6" />
        <ellipse cx="28" cy="-7" rx="1.2" ry="0.8" fill="white" opacity="0.4" />

        {/* Paupières */}
        <path d="M 15 -10 Q 20 -15 26 -15 Q 32 -15 37 -10"
          stroke="#3a3a3a" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M 15 -10 Q 20 -6 26 -5 Q 32 -6 37 -10"
          stroke="#3a3a3a" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Cils supérieurs */}
        {Array.from({length: 8}).map((_, i) => {
          const x = 17 + i * 2.8;
          const startY = -10 - Math.abs(4 - i) * 1.2;
          const endY = startY - 4 - Math.random() * 2;
          const curvature = (i - 4) * 0.5;
          return (
            <path key={`right-lash-top-${i}`}
              d={`M ${x} ${startY} Q ${x + curvature} ${endY - 1} ${x + curvature * 0.5} ${endY}`}
              stroke="#1a1a1a" strokeWidth="0.6" fill="none" opacity="0.8"
              strokeLinecap="round" />
          );
        })}

        {/* Cils inférieurs */}
        {Array.from({length: 5}).map((_, i) => {
          const x = 19 + i * 3.5;
          const startY = -10 + Math.abs(2 - i) * 0.8;
          const endY = startY + 2 + Math.random();
          return (
            <path key={`right-lash-bottom-${i}`}
              d={`M ${x} ${startY} L ${x + (i - 2) * 0.3} ${endY}`}
              stroke="#1a1a1a" strokeWidth="0.4" fill="none" opacity="0.5"
              strokeLinecap="round" />
          );
        })}
      </g>
    </g>
  );
};

// Sourcils réalistes
const renderEyebrows = (eyebrowType, hairColor) => {
  const browColor = darkenColor(hairColor, 30);
  const browDark = darkenColor(hairColor, 45);

  return (
    <g id="eyebrows">
      {/* Sourcil gauche */}
      <g id="leftBrow">
        {/* Base du sourcil (ombre) */}
        <path d="M -38 -21 Q -30 -24 -18 -21"
          stroke={browColor} strokeWidth="4" strokeLinecap="round" opacity="0.4" filter="url(#softShadow)" />

        {/* Couche principale */}
        <path d="M -38 -21 Q -30 -24 -18 -21"
          stroke={browColor} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />

        {/* Poils individuels (couche 1 - base) */}
        {Array.from({length: 12}).map((_, i) => {
          const x = -38 + i * 1.8;
          const baseY = -21 + (i < 6 ? (6 - i) * 0.5 : (i - 6) * 0.4);
          const angle = (i - 6) * 5;
          const length = 3 + Math.random() * 2;
          return (
            <path key={`left-hair-base-${i}`}
              d={`M ${x} ${baseY} l ${Math.sin(angle * Math.PI / 180) * length} ${-Math.cos(angle * Math.PI / 180) * length}`}
              stroke={browDark} strokeWidth="0.6" opacity="0.5" strokeLinecap="round" />
          );
        })}

        {/* Poils individuels (couche 2 - détails) */}
        {Array.from({length: 15}).map((_, i) => {
          const x = -38 + i * 1.4;
          const baseY = -21 + (i < 7 ? (7 - i) * 0.5 : (i - 7) * 0.4);
          const angle = (i - 7) * 6 + (Math.random() - 0.5) * 10;
          const length = 2.5 + Math.random() * 1.5;
          return (
            <path key={`left-hair-detail-${i}`}
              d={`M ${x} ${baseY} l ${Math.sin(angle * Math.PI / 180) * length} ${-Math.cos(angle * Math.PI / 180) * length}`}
              stroke={browColor} strokeWidth="0.5" opacity="0.7" strokeLinecap="round" />
          );
        })}
      </g>

      {/* Sourcil droit */}
      <g id="rightBrow">
        {/* Base du sourcil */}
        <path d="M 18 -21 Q 30 -24 38 -21"
          stroke={browColor} strokeWidth="4" strokeLinecap="round" opacity="0.4" filter="url(#softShadow)" />

        <path d="M 18 -21 Q 30 -24 38 -21"
          stroke={browColor} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />

        {/* Poils individuels (couche 1) */}
        {Array.from({length: 12}).map((_, i) => {
          const x = 18 + i * 1.8;
          const baseY = -21 + (i < 6 ? i * 0.4 : (12 - i) * 0.5);
          const angle = (6 - i) * 5;
          const length = 3 + Math.random() * 2;
          return (
            <path key={`right-hair-base-${i}`}
              d={`M ${x} ${baseY} l ${Math.sin(angle * Math.PI / 180) * length} ${-Math.cos(angle * Math.PI / 180) * length}`}
              stroke={browDark} strokeWidth="0.6" opacity="0.5" strokeLinecap="round" />
          );
        })}

        {/* Poils individuels (couche 2) */}
        {Array.from({length: 15}).map((_, i) => {
          const x = 18 + i * 1.4;
          const baseY = -21 + (i < 7 ? i * 0.4 : (14 - i) * 0.5);
          const angle = (7 - i) * 6 + (Math.random() - 0.5) * 10;
          const length = 2.5 + Math.random() * 1.5;
          return (
            <path key={`right-hair-detail-${i}`}
              d={`M ${x} ${baseY} l ${Math.sin(angle * Math.PI / 180) * length} ${-Math.cos(angle * Math.PI / 180) * length}`}
              stroke={browColor} strokeWidth="0.5" opacity="0.7" strokeLinecap="round" />
          );
        })}
      </g>
    </g>
  );
};

// Bouche détaillée avec anatomie
const renderMouth = (mouthType, skinTone) => {
  const lipColor = '#C88B8B';
  const lipDark = darkenColor(lipColor, 20);
  const lipLight = lightenColor(lipColor, 15);

  return (
    <g id="mouth">
      {/* Ombre sous la lèvre inférieure */}
      <ellipse cx="0" cy="30" rx="16" ry="3" fill={darkenColor(skinTone, 10)} opacity="0.2" filter="url(#softShadow)" />

      {/* Lèvre inférieure - volume */}
      <path d="M -16 25 Q -10 28 0 29 Q 10 28 16 25 Q 12 27 8 28 Q 4 28.5 0 28.5 Q -4 28.5 -8 28 Q -12 27 -16 25 Z"
        fill="url(#lipGradient)" opacity="0.85" />

      {/* Lèvre inférieure - contour */}
      <path d="M -16 25 Q -10 28 0 29 Q 10 28 16 25"
        stroke={lipDark} strokeWidth="1" fill="none" opacity="0.6" />

      {/* Highlight lèvre inférieure (humidité) */}
      <ellipse cx="0" cy="27.5" rx="10" ry="2" fill="white" opacity="0.35" />
      <ellipse cx="-6" cy="27" rx="4" ry="1.5" fill="white" opacity="0.25" />
      <ellipse cx="6" cy="27" rx="4" ry="1.5" fill="white" opacity="0.25" />

      {/* Lèvre supérieure - forme */}
      <path d="M -16 24 Q -12 22 -6 22.5 Q -3 21.5 0 21 Q 3 21.5 6 22.5 Q 12 22 16 24"
        fill="url(#lipGradient)" opacity="0.75" />

      {/* Lèvre supérieure - contour */}
      <path d="M -16 24 Q -12 22 -6 22.5 Q -3 21.5 0 21 Q 3 21.5 6 22.5 Q 12 22 16 24"
        stroke={lipDark} strokeWidth="1" fill="none" opacity="0.6" />

      {/* Arc de Cupidon (détaillé) */}
      <path d="M -4 21 Q -2 20 0 19.5 Q 2 20 4 21"
        stroke={lipDark} strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M -3 21 L -3 20.5 M 3 21 L 3 20.5"
        stroke={lipDark} strokeWidth="0.5" opacity="0.3" />

      {/* Ligne centrale de la bouche */}
      <path d="M -16 24.5 Q -8 25.5 0 26 Q 8 25.5 16 24.5"
        stroke={lipDark} strokeWidth="1.2" fill="none" opacity="0.4" />

      {/* Commissures (coins) de la bouche */}
      <circle cx="-16" cy="24.5" r="1.2" fill={darkenColor(skinTone, 15)} opacity="0.3" />
      <circle cx="16" cy="24.5" r="1.2" fill={darkenColor(skinTone, 15)} opacity="0.3" />

      {/* Plis nasogéniens (sillons du sourire) subtils */}
      <path d="M -12 10 Q -14 16 -15 22"
        stroke={darkenColor(skinTone, 8)} strokeWidth="0.6" fill="none" opacity="0.08" />
      <path d="M 12 10 Q 14 16 15 22"
        stroke={darkenColor(skinTone, 8)} strokeWidth="0.6" fill="none" opacity="0.08" />
    </g>
  );
};

// Cheveux ultra-détaillés avec texture réaliste
const renderHair = (hairType, hairColor) => {
  const hairDark = darkenColor(hairColor, 30);
  const hairMid = darkenColor(hairColor, 15);
  const hairLight = lightenColor(hairColor, 10);

  return (
    <g id="hair">
      <g filter="url(#depth)">
        {/* Cheveux courts style réaliste */}
        <ellipse cx="0" cy="-32" rx="70" ry="50" fill="url(#hairGradient)" />
        <rect x="-70" y="-32" width="140" height="32" fill="url(#hairGradient)" />

        {/* Mèches de cheveux individuelles (couche arrière) */}
        {Array.from({length: 25}).map((_, i) => {
          const x = -65 + (i * 5.5);
          const startY = -50 - Math.random() * 15;
          const controlY = -40 - Math.random() * 10;
          const endY = -20 - Math.random() * 15;
          const width = 2 + Math.random() * 2;

          return (
            <path key={`hair-back-${i}`}
              d={`M ${x} ${startY} Q ${x + (Math.random() - 0.5) * 5} ${controlY} ${x + (Math.random() - 0.5) * 8} ${endY}`}
              stroke={hairDark} strokeWidth={width} fill="none" opacity={0.6}
              strokeLinecap="round" />
          );
        })}

        {/* Mèches moyennes */}
        {Array.from({length: 30}).map((_, i) => {
          const x = -68 + (i * 4.6);
          const startY = -55 - Math.random() * 12;
          const controlY = -42 - Math.random() * 8;
          const endY = -25 - Math.random() * 12;
          const width = 1.5 + Math.random() * 1.5;

          return (
            <path key={`hair-mid-${i}`}
              d={`M ${x} ${startY} Q ${x + (Math.random() - 0.5) * 6} ${controlY} ${x + (Math.random() - 0.5) * 10} ${endY}`}
              stroke={hairMid} strokeWidth={width} fill="none" opacity={0.7}
              strokeLinecap="round" />
          );
        })}

        {/* Mèches avant (détails fins) */}
        {Array.from({length: 35}).map((_, i) => {
          const x = -70 + (i * 4);
          const startY = -60 - Math.random() * 10;
          const controlY = -45 - Math.random() * 7;
          const endY = -30 - Math.random() * 10;
          const width = 0.8 + Math.random();

          return (
            <path key={`hair-front-${i}`}
              d={`M ${x} ${startY} Q ${x + (Math.random() - 0.5) * 4} ${controlY} ${x + (Math.random() - 0.5) * 6} ${endY}`}
              stroke={hairColor} strokeWidth={width} fill="none" opacity={0.8}
              strokeLinecap="round" />
          );
        })}

        {/* Reflets de lumière sur les cheveux */}
        <ellipse cx="-25" cy="-48" rx="22" ry="12" fill="url(#hairShine)" opacity="0.5" />
        <ellipse cx="18" cy="-50" rx="20" ry="10" fill="url(#hairShine)" opacity="0.45" />
        <ellipse cx="0" cy="-55" rx="15" ry="8" fill="white" opacity="0.2" />

        {/* Mèches fines au niveau du front */}
        {Array.from({length: 12}).map((_, i) => {
          const x = -30 + (i * 5);
          const startY = -35;
          const endY = -20 - Math.random() * 5;

          return (
            <path key={`hair-forehead-${i}`}
              d={`M ${x} ${startY} Q ${x + (Math.random() - 0.5) * 3} ${(startY + endY) / 2} ${x + (Math.random() - 0.5) * 4} ${endY}`}
              stroke={hairLight} strokeWidth={0.8} fill="none" opacity={0.7}
              strokeLinecap="round" />
          );
        })}
      </g>
    </g>
  );
};

// Composant principal Avatar
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
      {/* Définitions SVG globales */}
      <SVGDefs
        skinTone={identity.skinTone}
        hairColor={identity.hairColor}
        eyeColor={identity.eyeColor}
      />

      <g transform={`translate(100, 100) scale(${scale})`}>
        {/* Couche 1: Cheveux arrière */}
        {renderHair(identity.hairType, identity.hairColor)}

        {/* Couche 2: Visage avec anatomie détaillée */}
        {renderFace(identity.faceShape, identity.skinTone)}

        {/* Couche 3: Sourcils */}
        {renderEyebrows(identity.eyebrowType, identity.hairColor)}

        {/* Couche 4: Yeux ultra-détaillés */}
        {renderEyes(identity.eyeType, identity.eyeColor)}

        {/* Couche 5: Nez 3D */}
        {renderNose(identity.skinTone)}

        {/* Couche 6: Bouche détaillée */}
        {renderMouth(identity.mouthType, identity.skinTone)}
      </g>
    </svg>
  );
}
