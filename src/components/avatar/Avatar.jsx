/**
 * Composant Avatar principal (version réaliste détaillée)
 * Affiche un avatar graphique SVG avec détails, textures et gradients
 */

import React from 'react';

// Fonction utilitaire pour assombrir une couleur
const darkenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};

// Styles de cheveux avec détails et texture
const renderHair = (hairType, hairColor, scale = 1) => {
  const darkHair = darkenColor(hairColor, 20);
  const lightHair = hairColor + 'DD'; // Légère transparence

  const styles = {
    'short-1': (
      <g>
        {/* Base cheveux courts */}
        <ellipse cx="0" cy="-35" rx="68" ry="48" fill={hairColor} />
        <rect x="-68" y="-35" width="136" height="35" fill={hairColor} />
        {/* Mèches individuelles */}
        <path d="M -50 -60 Q -45 -70 -40 -65 L -42 -50" fill={darkHair} opacity="0.6" />
        <path d="M -30 -65 Q -25 -75 -20 -70 L -22 -55" fill={darkHair} opacity="0.6" />
        <path d="M -10 -68 Q -5 -78 0 -73 L -2 -58" fill={darkHair} opacity="0.6" />
        <path d="M 10 -68 Q 15 -78 20 -70 L 18 -55" fill={darkHair} opacity="0.6" />
        <path d="M 30 -65 Q 35 -75 40 -65 L 38 -50" fill={darkHair} opacity="0.6" />
        <path d="M 50 -60 Q 55 -70 60 -65 L 58 -50" fill={darkHair} opacity="0.6" />
        {/* Reflets */}
        <ellipse cx="-25" cy="-55" rx="15" ry="8" fill="white" opacity="0.15" />
        <ellipse cx="20" cy="-55" rx="15" ry="8" fill="white" opacity="0.15" />
      </g>
    ),
    'short-2': (
      <g>
        {/* Coupe courte ébouriffée */}
        <path d="M -60 -20 Q -50 -60 -30 -50 Q 0 -70 30 -50 Q 50 -60 60 -20 Z" fill={hairColor} />
        {/* Mèches ébouriffées */}
        <path d="M -45 -50 L -50 -65 Q -48 -68 -46 -65 Z" fill={darkHair} />
        <path d="M -30 -55 L -32 -72 Q -30 -75 -28 -72 Z" fill={darkHair} />
        <path d="M -10 -60 L -8 -75 Q -5 -77 -6 -74 Z" fill={darkHair} />
        <path d="M 10 -62 L 12 -77 Q 15 -79 14 -76 Z" fill={darkHair} />
        <path d="M 30 -58 L 34 -73 Q 36 -76 35 -73 Z" fill={darkHair} />
        <path d="M 45 -52 L 50 -67 Q 52 -70 51 -67 Z" fill={darkHair} />
        {/* Texture */}
        {Array.from({length: 8}).map((_, i) => (
          <line
            key={i}
            x1={-40 + i * 10}
            y1={-50 + Math.sin(i) * 5}
            x2={-40 + i * 10}
            y2={-35 + Math.sin(i) * 5}
            stroke={darkHair}
            strokeWidth="1.5"
            opacity="0.3"
          />
        ))}
      </g>
    ),
    'medium-1': (
      <g>
        {/* Cheveux mi-longs avec volume */}
        <ellipse cx="0" cy="-30" rx="72" ry="52" fill={hairColor} />
        <path d="M -72 0 Q -77 35 -65 55 L -60 58 Q -70 40 -68 10 Z" fill={hairColor} />
        <path d="M 72 0 Q 77 35 65 55 L 60 58 Q 70 40 68 10 Z" fill={hairColor} />
        {/* Mèches sur les côtés */}
        <path d="M -70 5 Q -75 25 -70 45 Q -68 35 -67 15" fill={darkHair} opacity="0.5" />
        <path d="M -60 8 Q -63 28 -58 48 Q -57 38 -56 18" fill={darkHair} opacity="0.5" />
        <path d="M 70 5 Q 75 25 70 45 Q 68 35 67 15" fill={darkHair} opacity="0.5" />
        <path d="M 60 8 Q 63 28 58 48 Q 57 38 56 18" fill={darkHair} opacity="0.5" />
        {/* Frange partielle */}
        <path d="M -35 -40 Q -30 -25 -25 -35 Q -20 -45 -15 -35" fill={hairColor} />
        <path d="M -10 -42 Q -5 -27 0 -37 Q 5 -47 10 -37" fill={hairColor} />
        <path d="M 15 -40 Q 20 -25 25 -35 Q 30 -45 35 -35" fill={hairColor} />
        {/* Reflets */}
        <ellipse cx="-30" cy="-45" rx="20" ry="10" fill="white" opacity="0.2" />
        <ellipse cx="25" cy="-45" rx="20" ry="10" fill="white" opacity="0.2" />
      </g>
    ),
    'long-1': (
      <g>
        {/* Cheveux longs avec détails */}
        <ellipse cx="0" cy="-30" rx="75" ry="52" fill={hairColor} />
        {/* Mèches longues gauche */}
        <path d="M -72 10 Q -82 65 -75 95 L -70 98 Q -75 70 -70 15 Z" fill={hairColor} />
        <path d="M -60 12 Q -68 68 -62 98 L -58 100 Q -63 72 -58 17 Z" fill={darkHair} opacity="0.7" />
        <path d="M -50 15 Q -56 70 -50 100 L -46 102 Q -52 74 -48 20 Z" fill={lightHair} />
        {/* Mèches longues droite */}
        <path d="M 72 10 Q 82 65 75 95 L 70 98 Q 75 70 70 15 Z" fill={hairColor} />
        <path d="M 60 12 Q 68 68 62 98 L 58 100 Q 63 72 58 17 Z" fill={darkHair} opacity="0.7" />
        <path d="M 50 15 Q 56 70 50 100 L 46 102 Q 52 74 48 20 Z" fill={lightHair} />
        {/* Texture sur les mèches */}
        {Array.from({length: 6}).map((_, i) => (
          <path
            key={`left-${i}`}
            d={`M ${-70 + i * 4} ${20 + i * 10} Q ${-72 + i * 4} ${40 + i * 12} ${-70 + i * 4} ${60 + i * 10}`}
            stroke={darkHair}
            strokeWidth="0.8"
            fill="none"
            opacity="0.4"
          />
        ))}
        {Array.from({length: 6}).map((_, i) => (
          <path
            key={`right-${i}`}
            d={`M ${70 - i * 4} ${20 + i * 10} Q ${72 - i * 4} ${40 + i * 12} ${70 - i * 4} ${60 + i * 10}`}
            stroke={darkHair}
            strokeWidth="0.8"
            fill="none"
            opacity="0.4"
          />
        ))}
        {/* Reflets */}
        <ellipse cx="-35" cy="-40" rx="18" ry="12" fill="white" opacity="0.25" />
        <ellipse cx="30" cy="-40" rx="18" ry="12" fill="white" opacity="0.25" />
      </g>
    ),
    'minimal': (
      <g>
        {/* Cheveux très courts / rasés */}
        <path d="M -60 -25 Q -45 -52 -25 -48 Q 0 -58 25 -48 Q 45 -52 60 -25 L 60 -10 Q 50 -20 30 -25 Q 0 -30 -30 -25 Q -50 -20 -60 -10 Z"
          fill={hairColor} />
        {/* Texture rasée */}
        {Array.from({length: 15}).map((_, i) => (
          <circle
            key={i}
            cx={-50 + (i % 5) * 25}
            cy={-40 + Math.floor(i / 5) * 8}
            r="0.5"
            fill={darkHair}
            opacity="0.4"
          />
        ))}
      </g>
    )
  };

  return styles[hairType] || styles['short-1'];
};

// Sourcils avec texture de poils
const renderEyebrows = (eyebrowType, hairColor, scale = 1) => {
  const browColor = darkenColor(hairColor, 30);

  const styles = {
    'straight': (
      <>
        {/* Base du sourcil */}
        <path d="M -35 -20 L -15 -20" stroke={browColor} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M 15 -20 L 35 -20" stroke={browColor} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        {/* Poils individuels */}
        {Array.from({length: 5}).map((_, i) => (
          <line key={`left-${i}`} x1={-35 + i * 5} y1={-20} x2={-34 + i * 5} y2={-22} stroke={browColor} strokeWidth="0.8" opacity="0.6" />
        ))}
        {Array.from({length: 5}).map((_, i) => (
          <line key={`right-${i}`} x1={15 + i * 5} y1={-20} x2={16 + i * 5} y2={-22} stroke={browColor} strokeWidth="0.8" opacity="0.6" />
        ))}
      </>
    ),
    'arched': (
      <>
        <path d="M -35 -18 Q -25 -23 -15 -18" stroke={browColor} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M 15 -18 Q 25 -23 35 -18" stroke={browColor} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
        {/* Poils sur sourcil arqué */}
        {Array.from({length: 5}).map((_, i) => {
          const x = -35 + i * 5;
          const y = -18 + (i === 2 ? -5 : i === 1 || i === 3 ? -3 : 0);
          return <line key={`left-${i}`} x1={x} y1={y} x2={x + 1} y2={y - 2} stroke={browColor} strokeWidth="0.8" opacity="0.6" />;
        })}
        {Array.from({length: 5}).map((_, i) => {
          const x = 15 + i * 5;
          const y = -18 + (i === 2 ? -5 : i === 1 || i === 3 ? -3 : 0);
          return <line key={`right-${i}`} x1={x} y1={y} x2={x + 1} y2={y - 2} stroke={browColor} strokeWidth="0.8" opacity="0.6" />;
        })}
      </>
    ),
    'soft': (
      <>
        <path d="M -35 -20 Q -25 -21 -15 -20" stroke={browColor} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
        <path d="M 15 -20 Q 25 -21 35 -20" stroke={browColor} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
        {/* Poils fins */}
        {Array.from({length: 6}).map((_, i) => (
          <line key={`left-${i}`} x1={-35 + i * 4} y1={-20} x2={-34 + i * 4} y2={-21.5} stroke={browColor} strokeWidth="0.6" opacity="0.5" />
        ))}
        {Array.from({length: 6}).map((_, i) => (
          <line key={`right-${i}`} x1={15 + i * 4} y1={-20} x2={16 + i * 4} y2={-21.5} stroke={browColor} strokeWidth="0.6" opacity="0.5" />
        ))}
      </>
    )
  };

  return styles[eyebrowType] || styles['straight'];
};

// Yeux détaillés avec cils et reflets
const renderEyes = (eyeType, eyeColor, scale = 1) => {
  const leftEyeX = -25;
  const rightEyeX = 25;
  const eyeY = -10;
  const darkIris = darkenColor(eyeColor, 15);

  const styles = {
    'almond': (
      <>
        {/* Forme de l'œil en amande avec ombre */}
        <ellipse cx={leftEyeX} cy={eyeY + 1} rx="11" ry="13" fill="#00000010" />
        <ellipse cx={rightEyeX} cy={eyeY + 1} rx="11" ry="13" fill="#00000010" />

        {/* Blanc de l'œil */}
        <ellipse cx={leftEyeX} cy={eyeY} rx="10" ry="12" fill="white" />
        <ellipse cx={rightEyeX} cy={eyeY} rx="10" ry="12" fill="white" />

        {/* Contour de l'œil */}
        <ellipse cx={leftEyeX} cy={eyeY} rx="10" ry="12" fill="none" stroke="#3a3a3a" strokeWidth="1.2" />
        <ellipse cx={rightEyeX} cy={eyeY} rx="10" ry="12" fill="none" stroke="#3a3a3a" strokeWidth="1.2" />

        {/* Iris avec dégradé */}
        <circle cx={leftEyeX} cy={eyeY} r="6.5" fill={eyeColor} />
        <circle cx={rightEyeX} cy={eyeY} r="6.5" fill={eyeColor} />
        <circle cx={leftEyeX} cy={eyeY} r="6.5" fill={darkIris} opacity="0.3" />
        <circle cx={rightEyeX} cy={eyeY} r="6.5" fill={darkIris} opacity="0.3" />

        {/* Motif de l'iris */}
        {Array.from({length: 8}).map((_, i) => (
          <line
            key={`left-iris-${i}`}
            x1={leftEyeX + Math.cos(i * Math.PI / 4) * 2}
            y1={eyeY + Math.sin(i * Math.PI / 4) * 2}
            x2={leftEyeX + Math.cos(i * Math.PI / 4) * 5}
            y2={eyeY + Math.sin(i * Math.PI / 4) * 5}
            stroke={darkIris}
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        {Array.from({length: 8}).map((_, i) => (
          <line
            key={`right-iris-${i}`}
            x1={rightEyeX + Math.cos(i * Math.PI / 4) * 2}
            y1={eyeY + Math.sin(i * Math.PI / 4) * 2}
            x2={rightEyeX + Math.cos(i * Math.PI / 4) * 5}
            y2={eyeY + Math.sin(i * Math.PI / 4) * 5}
            stroke={darkIris}
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}

        {/* Pupille */}
        <circle cx={leftEyeX} cy={eyeY} r="3.5" fill="#0a0a0a" />
        <circle cx={rightEyeX} cy={eyeY} r="3.5" fill="#0a0a0a" />

        {/* Reflets multiples */}
        <circle cx={leftEyeX + 2} cy={eyeY - 2} r="2" fill="white" opacity="0.95" />
        <circle cx={rightEyeX + 2} cy={eyeY - 2} r="2" fill="white" opacity="0.95" />
        <circle cx={leftEyeX - 1.5} cy={eyeY + 2} r="1" fill="white" opacity="0.6" />
        <circle cx={rightEyeX - 1.5} cy={eyeY + 2} r="1" fill="white" opacity="0.6" />

        {/* Cils supérieurs */}
        {Array.from({length: 5}).map((_, i) => {
          const angle = -0.6 + (i * 0.3);
          return (
            <path
              key={`left-lash-top-${i}`}
              d={`M ${leftEyeX - 8 + i * 4} ${eyeY - 11} Q ${leftEyeX - 8 + i * 4 + Math.sin(angle)} ${eyeY - 15} ${leftEyeX - 7 + i * 4} ${eyeY - 14}`}
              stroke="#2a2a2a"
              strokeWidth="0.6"
              fill="none"
              opacity="0.7"
            />
          );
        })}
        {Array.from({length: 5}).map((_, i) => {
          const angle = -0.6 + (i * 0.3);
          return (
            <path
              key={`right-lash-top-${i}`}
              d={`M ${rightEyeX - 8 + i * 4} ${eyeY - 11} Q ${rightEyeX - 8 + i * 4 + Math.sin(angle)} ${eyeY - 15} ${rightEyeX - 7 + i * 4} ${eyeY - 14}`}
              stroke="#2a2a2a"
              strokeWidth="0.6"
              fill="none"
              opacity="0.7"
            />
          );
        })}
      </>
    ),
    'round': (
      <>
        {/* Ombre */}
        <circle cx={leftEyeX} cy={eyeY + 1} r="12" fill="#00000010" />
        <circle cx={rightEyeX} cy={eyeY + 1} r="12" fill="#00000010" />

        {/* Blanc de l'œil */}
        <circle cx={leftEyeX} cy={eyeY} r="11" fill="white" />
        <circle cx={rightEyeX} cy={eyeY} r="11" fill="white" />

        {/* Contour */}
        <circle cx={leftEyeX} cy={eyeY} r="11" fill="none" stroke="#3a3a3a" strokeWidth="1.2" />
        <circle cx={rightEyeX} cy={eyeY} r="11" fill="none" stroke="#3a3a3a" strokeWidth="1.2" />

        {/* Iris */}
        <circle cx={leftEyeX} cy={eyeY} r="6.5" fill={eyeColor} />
        <circle cx={rightEyeX} cy={eyeY} r="6.5" fill={eyeColor} />
        <circle cx={leftEyeX} cy={eyeY + 1} r="6" fill={darkIris} opacity="0.3" />
        <circle cx={rightEyeX} cy={eyeY + 1} r="6" fill={darkIris} opacity="0.3" />

        {/* Motif iris */}
        {Array.from({length: 12}).map((_, i) => (
          <line
            key={`left-${i}`}
            x1={leftEyeX}
            y1={eyeY}
            x2={leftEyeX + Math.cos(i * Math.PI / 6) * 5.5}
            y2={eyeY + Math.sin(i * Math.PI / 6) * 5.5}
            stroke={darkIris}
            strokeWidth="0.4"
            opacity="0.3"
          />
        ))}
        {Array.from({length: 12}).map((_, i) => (
          <line
            key={`right-${i}`}
            x1={rightEyeX}
            y1={eyeY}
            x2={rightEyeX + Math.cos(i * Math.PI / 6) * 5.5}
            y2={eyeY + Math.sin(i * Math.PI / 6) * 5.5}
            stroke={darkIris}
            strokeWidth="0.4"
            opacity="0.3"
          />
        ))}

        {/* Pupille */}
        <circle cx={leftEyeX} cy={eyeY} r="3.5" fill="#0a0a0a" />
        <circle cx={rightEyeX} cy={eyeY} r="3.5" fill="#0a0a0a" />

        {/* Reflets */}
        <circle cx={leftEyeX + 2.5} cy={eyeY - 2.5} r="2.2" fill="white" opacity="0.95" />
        <circle cx={rightEyeX + 2.5} cy={eyeY - 2.5} r="2.2" fill="white" opacity="0.95" />
        <circle cx={leftEyeX - 2} cy={eyeY + 2} r="1.2" fill="white" opacity="0.6" />
        <circle cx={rightEyeX - 2} cy={eyeY + 2} r="1.2" fill="white" opacity="0.6" />

        {/* Cils */}
        {Array.from({length: 6}).map((_, i) => {
          const angle = (i - 2.5) * 0.5;
          return (
            <path
              key={`left-lash-${i}`}
              d={`M ${leftEyeX + Math.cos(angle - Math.PI / 2) * 11} ${eyeY + Math.sin(angle - Math.PI / 2) * 11} L ${leftEyeX + Math.cos(angle - Math.PI / 2) * 15} ${eyeY + Math.sin(angle - Math.PI / 2) * 15}`}
              stroke="#2a2a2a"
              strokeWidth="0.7"
              opacity="0.7"
            />
          );
        })}
        {Array.from({length: 6}).map((_, i) => {
          const angle = (i - 2.5) * 0.5;
          return (
            <path
              key={`right-lash-${i}`}
              d={`M ${rightEyeX + Math.cos(angle - Math.PI / 2) * 11} ${eyeY + Math.sin(angle - Math.PI / 2) * 11} L ${rightEyeX + Math.cos(angle - Math.PI / 2) * 15} ${eyeY + Math.sin(angle - Math.PI / 2) * 15}`}
              stroke="#2a2a2a"
              strokeWidth="0.7"
              opacity="0.7"
            />
          );
        })}
      </>
    )
  };

  return styles[eyeType] || styles['almond'];
};

// Bouche détaillée avec lèvres
const renderMouth = (mouthType, skinTone, scale = 1) => {
  const lipColor = '#C88B8B';
  const darkLip = darkenColor(lipColor, 15);

  const styles = {
    'neutral': (
      <g>
        {/* Lèvre inférieure */}
        <path d="M -15 26 Q -8 28 0 28 Q 8 28 15 26" fill={lipColor} opacity="0.7" />
        <path d="M -15 26 Q -8 28 0 28 Q 8 28 15 26" fill="none" stroke={darkLip} strokeWidth="1.2" />
        {/* Lèvre supérieure */}
        <path d="M -15 25 Q -10 23 -5 23.5 Q 0 22 5 23.5 Q 10 23 15 25" fill={lipColor} opacity="0.6" />
        <path d="M -15 25 Q -10 23 -5 23.5 Q 0 22 5 23.5 Q 10 23 15 25" fill="none" stroke={darkLip} strokeWidth="1.2" />
        {/* Arc de Cupidon */}
        <path d="M -3 22 Q 0 21 3 22" fill="none" stroke={darkLip} strokeWidth="0.8" opacity="0.6" />
        {/* Reflet sur lèvre inférieure */}
        <ellipse cx="0" cy="27" rx="8" ry="1.5" fill="white" opacity="0.25" />
      </g>
    ),
    'slight-smile': (
      <g>
        {/* Lèvre inférieure souriante */}
        <path d="M -18 23 Q -10 27 0 28 Q 10 27 18 23" fill={lipColor} opacity="0.7" />
        <path d="M -18 23 Q -10 27 0 28 Q 10 27 18 23" fill="none" stroke={darkLip} strokeWidth="1.2" />
        {/* Lèvre supérieure */}
        <path d="M -18 22 Q -12 20 -6 21 Q 0 19 6 21 Q 12 20 18 22" fill={lipColor} opacity="0.6" />
        <path d="M -18 22 Q -12 20 -6 21 Q 0 19 6 21 Q 12 20 18 22" fill="none" stroke={darkLip} strokeWidth="1.2" />
        {/* Arc de Cupidon */}
        <path d="M -4 19 Q 0 18 4 19" fill="none" stroke={darkLip} strokeWidth="0.8" opacity="0.6" />
        {/* Reflet */}
        <ellipse cx="0" cy="26" rx="10" ry="1.8" fill="white" opacity="0.25" />
        {/* Coins de la bouche relevés */}
        <path d="M -18 22 Q -20 24 -19 25" fill="none" stroke={darkLip} strokeWidth="0.8" opacity="0.4" />
        <path d="M 18 22 Q 20 24 19 25" fill="none" stroke={darkLip} strokeWidth="0.8" opacity="0.4" />
      </g>
    ),
    'closed': (
      <g>
        {/* Bouche fermée simple */}
        <path d="M -15 24 Q 0 25 15 24" fill="none" stroke={darkLip} strokeWidth="1.8" strokeLinecap="round" />
        {/* Lèvres pressées */}
        <path d="M -15 24 Q -8 23.5 0 23.5 Q 8 23.5 15 24" fill={lipColor} opacity="0.5" />
        <path d="M -15 24 Q -8 24.5 0 24.5 Q 8 24.5 15 24" fill={lipColor} opacity="0.5" />
      </g>
    )
  };

  return styles[mouthType] || styles['neutral'];
};

// Forme de visage avec détails et texture
const renderFace = (faceShape, skinTone, scale = 1) => {
  const shadowTone = darkenColor(skinTone, 8);
  const highlightTone = skinTone + 'AA';

  const shapes = {
    'oval': (
      <>
        {/* Ombre portée */}
        <ellipse cx="0" cy="7" rx="63" ry="76" fill="#00000012" />

        {/* Base du visage */}
        <ellipse cx="0" cy="5" rx="62" ry="75" fill={skinTone} />

        {/* Gradient subtil */}
        <defs>
          <radialGradient id="faceGradientOval" cx="50%" cy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="70%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="0" cy="5" rx="62" ry="75" fill="url(#faceGradientOval)" />

        {/* Contour du visage */}
        <ellipse cx="0" cy="5" rx="62" ry="75" fill="none" stroke="#00000018" strokeWidth="1.5" />

        {/* Pommettes avec dégradé */}
        <ellipse cx="-32" cy="15" rx="14" ry="20" fill={shadowTone} opacity="0.4" />
        <ellipse cx="32" cy="15" rx="14" ry="20" fill={shadowTone} opacity="0.4" />
        <ellipse cx="-30" cy="13" rx="10" ry="14" fill="#FF9999" opacity="0.15" />
        <ellipse cx="30" cy="13" rx="10" ry="14" fill="#FF9999" opacity="0.15" />

        {/* Ombre sous le nez */}
        <ellipse cx="0" cy="12" rx="8" ry="4" fill={shadowTone} opacity="0.12" />

        {/* Ombre du menton */}
        <ellipse cx="0" cy="55" rx="25" ry="18" fill={shadowTone} opacity="0.08" />

        {/* Ombre des yeux (orbites) */}
        <ellipse cx="-25" cy="-8" rx="13" ry="8" fill={shadowTone} opacity="0.08" />
        <ellipse cx="25" cy="-8" rx="13" ry="8" fill={shadowTone} opacity="0.08" />

        {/* Reflets sur le front et le nez */}
        <ellipse cx="0" cy="-25" rx="20" ry="12" fill="white" opacity="0.12" />
        <ellipse cx="0" cy="2" rx="4" ry="8" fill="white" opacity="0.1" />
      </>
    ),
    'round': (
      <>
        {/* Ombre portée */}
        <circle cx="0" cy="7" r="69" fill="#00000012" />

        {/* Base du visage */}
        <circle cx="0" cy="5" r="68" fill={skinTone} />

        {/* Gradient */}
        <defs>
          <radialGradient id="faceGradientRound" cx="50%" cy="35%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="65%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="5" r="68" fill="url(#faceGradientRound)" />

        {/* Contour */}
        <circle cx="0" cy="5" r="68" fill="none" stroke="#00000018" strokeWidth="1.5" />

        {/* Pommettes rondes */}
        <ellipse cx="-30" cy="18" rx="16" ry="22" fill={shadowTone} opacity="0.4" />
        <ellipse cx="30" cy="18" rx="16" ry="22" fill={shadowTone} opacity="0.4" />
        <circle cx="-28" cy="16" r="12" fill="#FF9999" opacity="0.18" />
        <circle cx="28" cy="16" r="12" fill="#FF9999" opacity="0.18" />

        {/* Autres détails */}
        <ellipse cx="0" cy="12" rx="8" ry="4" fill={shadowTone} opacity="0.12" />
        <circle cx="0" cy="50" r="22" fill={shadowTone} opacity="0.08" />
        <ellipse cx="-25" cy="-7" rx="14" ry="9" fill={shadowTone} opacity="0.08" />
        <ellipse cx="25" cy="-7" rx="14" ry="9" fill={shadowTone} opacity="0.08" />

        {/* Reflets */}
        <ellipse cx="0" cy="-22" rx="22" ry="14" fill="white" opacity="0.13" />
        <ellipse cx="0" cy="2" rx="4" ry="8" fill="white" opacity="0.1" />
      </>
    ),
    'square': (
      <>
        {/* Ombre portée */}
        <rect x="-57" y="-58" width="116" height="130" rx="18" fill="#00000012" />

        {/* Base du visage */}
        <rect x="-58" y="-60" width="116" height="130" rx="18" fill={skinTone} />

        {/* Gradient */}
        <defs>
          <radialGradient id="faceGradientSquare" cx="50%" cy="25%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="75%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="-58" y="-60" width="116" height="130" rx="18" fill="url(#faceGradientSquare)" />

        {/* Contour */}
        <rect x="-58" y="-60" width="116" height="130" rx="18" fill="none" stroke="#00000018" strokeWidth="1.5" />

        {/* Pommettes angulaires */}
        <ellipse cx="-28" cy="15" rx="14" ry="20" fill={shadowTone} opacity="0.4" />
        <ellipse cx="28" cy="15" rx="14" ry="20" fill={shadowTone} opacity="0.4" />
        <ellipse cx="-26" cy="13" rx="10" ry="14" fill="#FF9999" opacity="0.15" />
        <ellipse cx="26" cy="13" rx="10" ry="14" fill="#FF9999" opacity="0.15" />

        {/* Mâchoire définie */}
        <path d="M -40 45 L -35 60 L -20 65 L 0 68 L 20 65 L 35 60 L 40 45"
          fill="none" stroke={shadowTone} strokeWidth="1" opacity="0.15" />

        {/* Autres détails */}
        <ellipse cx="0" cy="12" rx="8" ry="4" fill={shadowTone} opacity="0.12" />
        <ellipse cx="-25" cy="-8" rx="13" ry="8" fill={shadowTone} opacity="0.08" />
        <ellipse cx="25" cy="-8" rx="13" ry="8" fill={shadowTone} opacity="0.08" />

        {/* Reflets */}
        <rect x="-18" y="-45" width="36" height="20" rx="5" fill="white" opacity="0.12" />
        <ellipse cx="0" cy="2" rx="4" ry="8" fill="white" opacity="0.1" />
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

        {/* Visage avec détails */}
        {renderFace(identity.faceShape, identity.skinTone, scale)}

        {/* Sourcils détaillés */}
        {renderEyebrows(identity.eyebrowType, identity.hairColor, scale)}

        {/* Yeux détaillés */}
        {renderEyes(identity.eyeType, identity.eyeColor, scale)}

        {/* Nez avec structure */}
        <g opacity="0.6">
          <ellipse cx="0" cy="8" rx="4" ry="7" fill="#00000010" />
          <ellipse cx="-2" cy="12" rx="2.5" ry="3" fill="#00000008" />
          <ellipse cx="2" cy="12" rx="2.5" ry="3" fill="#00000008" />
        </g>

        {/* Bouche détaillée */}
        {renderMouth(identity.mouthType, identity.skinTone, scale)}

        {/* Cheveux avant (frange si applicable) */}
        {identity.hairType.includes('long') && (
          <g>
            <path d="M -40 -30 Q -30 -20 -20 -25 Q -10 -30 0 -25 Q 10 -30 20 -25 Q 30 -20 40 -30"
              fill={identity.hairColor} opacity="0.9" />
            {/* Mèches de frange */}
            <path d="M -35 -28 L -33 -18" stroke={darkenColor(identity.hairColor, 20)} strokeWidth="1.5" opacity="0.6" />
            <path d="M -20 -26 L -18 -16" stroke={darkenColor(identity.hairColor, 20)} strokeWidth="1.5" opacity="0.6" />
            <path d="M 0 -27 L 0 -17" stroke={darkenColor(identity.hairColor, 20)} strokeWidth="1.5" opacity="0.6" />
            <path d="M 20 -26 L 18 -16" stroke={darkenColor(identity.hairColor, 20)} strokeWidth="1.5" opacity="0.6" />
            <path d="M 35 -28 L 33 -18" stroke={darkenColor(identity.hairColor, 20)} strokeWidth="1.5" opacity="0.6" />
          </g>
        )}
      </g>
    </svg>
  );
}
