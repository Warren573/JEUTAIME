/**
 * AVATAR RENDERER
 *
 * Composant de rendu qui superpose des images selon le Z-ORDER.
 * Ne contient AUCUNE logique métier, AUCUN dessin, AUCUNE génération.
 *
 * Rôle unique : afficher des images dans le bon ordre.
 */

import React from 'react';
import { Z_ORDER } from './avatar.types.js';
import { getAssetById } from './avatar.generator.js';
import manifest from './assets/manifest.json';

/**
 * Charge le chemin d'un asset depuis le manifest
 * @param {string} assetId - ID de l'asset
 * @returns {string|null} Chemin vers l'asset ou null
 */
function getAssetPath(assetId) {
  if (!assetId) return null;
  const asset = getAssetById(assetId);
  return asset ? asset.path : null;
}

/**
 * Charge le chemin d'une extension
 * @param {string} extensionCategory - Catégorie (expressions/emotions/aging)
 * @param {string} value - Valeur spécifique (ex: "smile", "calm")
 * @returns {string|null} Chemin vers l'overlay ou null
 */
function getExtensionPath(extensionCategory, value) {
  // Pour l'instant, le manifest des extensions n'existe pas encore
  // Cette fonction sera étendue quand les extensions seront ajoutées
  return null;
}

/**
 * Rend une couche d'asset (image)
 * @param {string} assetId - ID de l'asset à rendre
 * @param {number} index - Index de la couche (pour key)
 * @param {number} size - Taille de l'avatar
 * @returns {JSX.Element|null} Image ou null
 */
function renderAssetLayer(assetId, index, size) {
  const path = getAssetPath(assetId);
  if (!path) {
    console.warn(`[Avatar] Pas de path pour assetId=${assetId}`);
    return null;
  }

  return (
    <img
      key={`${assetId}-${index}`}
      src={path}
      alt=""
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: size,
        height: size,
        display: 'block',
        pointerEvents: 'none'
      }}
    />
  );
}

/**
 * Composant principal de rendu d'avatar
 *
 * @param {Object} props
 * @param {Object} props.avatarState - État complet de l'avatar
 * @param {number} [props.size=100] - Taille en pixels
 * @param {string} [props.className] - Classe CSS optionnelle
 * @param {Object} [props.style] - Styles inline optionnels
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
          ...style
        }}
      />
    );
  }

  const { identity } = avatarState;
  const layers = [];

  // Z-ORDER : hairBack → face → eyes → mouth → beard → hairFront → accessory
  // Note: hairBack et hairFront pointent vers les mêmes SVG → on utilise hairFront uniquement
  if (identity.face)      layers.push(renderAssetLayer(identity.face,      0, size));
  if (identity.eyes)      layers.push(renderAssetLayer(identity.eyes,      1, size));
  if (identity.mouth)     layers.push(renderAssetLayer(identity.mouth,     2, size));
  if (identity.beard)     layers.push(renderAssetLayer(identity.beard,     3, size));
  if (identity.hairFront) layers.push(renderAssetLayer(identity.hairFront, 4, size));
  if (identity.accessory) layers.push(renderAssetLayer(identity.accessory, 5, size));

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        ...style
      }}
    >
      {layers}
    </div>
  );
}
