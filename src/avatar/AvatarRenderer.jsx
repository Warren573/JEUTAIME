/**
 * AVATAR RENDERER
 *
 * Composant de rendu qui superpose des SVG dans un seul élément SVG.
 * Garantit un alignement parfait de tous les layers.
 */

import React, { useState, useEffect } from 'react';
import { getAssetById } from './avatar.generator.js';

/**
 * Charge le contenu SVG d'un asset
 */
async function fetchSVGContent(path) {
  try {
    const response = await fetch(path);
    const text = await response.text();
    // Extraire le contenu entre les balises <svg>
    const match = text.match(/<svg[^>]*>(.*?)<\/svg>/s);
    return match ? match[1] : '';
  } catch (error) {
    console.error('Erreur chargement SVG:', path, error);
    return '';
  }
}

/**
 * Composant de rendu d'un slot avec fetch du SVG
 */
function SVGLayer({ assetId, onLoad }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!assetId) {
      setContent('');
      return;
    }

    const asset = getAssetById(assetId);
    if (!asset) {
      setContent('');
      return;
    }

    fetchSVGContent(asset.path).then(svgContent => {
      setContent(svgContent);
      if (onLoad) onLoad();
    });
  }, [assetId, onLoad]);

  return <g dangerouslySetInnerHTML={{ __html: content }} />;
}

/**
 * Composant principal de rendu d'avatar
 * Tous les SVG sont combinés dans un seul élément SVG pour alignement parfait
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
      <SVGLayer key="face" assetId={identity.face} />
      <SVGLayer key="eyes" assetId={identity.eyes} />
      <SVGLayer key="mouth" assetId={identity.mouth} />
      <SVGLayer key="beard" assetId={identity.beard} />
      <SVGLayer key="hairFront" assetId={identity.hairFront} />
      <SVGLayer key="accessory" assetId={identity.accessory} />
    </svg>
  );
}
