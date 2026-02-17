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
      key={`layer-${index}`}
      src={path}
      alt=""
      onError={(e) => console.error('[Avatar] Erreur chargement:', path)}
      onLoad={() => console.log('[Avatar] Image chargée:', path)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: size,
        height: size,
        objectFit: 'contain',
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
  console.log('[AvatarRenderer] Called with:', { avatarState, size });

  if (!avatarState || !avatarState.identity) {
    console.warn('[AvatarRenderer] ❌ Pas d\'avatarState ou pas d\'identity, affichage placeholder');
    console.log('[AvatarRenderer] avatarState:', avatarState);
    // Avatar vide par défaut (placeholder)
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#E0E0E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9E9E9E',
          fontSize: size * 0.4,
          fontWeight: 'bold',
          ...style
        }}
      >
        ?
      </div>
    );
  }

  console.log('[AvatarRenderer] ✅ Identity:', avatarState.identity);

  const { identity, extensions } = avatarState;
  const layers = [];

  // Rendu des couches principales selon Z-ORDER
  // hairBack (0)
  if (identity.hairBack) {
    layers.push(renderAssetLayer(identity.hairBack, 0, size));
  }

  // face (1)
  if (identity.face) {
    layers.push(renderAssetLayer(identity.face, 1, size));
  }

  // eyes (2)
  if (identity.eyes) {
    layers.push(renderAssetLayer(identity.eyes, 2, size));
  }

  // mouth (3)
  if (identity.mouth) {
    layers.push(renderAssetLayer(identity.mouth, 3, size));
  }

  // beard (4)
  if (identity.beard) {
    layers.push(renderAssetLayer(identity.beard, 4, size));
  }

  // hairFront (5)
  if (identity.hairFront) {
    layers.push(renderAssetLayer(identity.hairFront, 5, size));
  }

  // accessory (6)
  if (identity.accessory) {
    layers.push(renderAssetLayer(identity.accessory, 6, size));
  }

  // Extensions (7-9) - Pour l'instant vides
  // expression (7)
  // aging (8)
  // emotion (9)

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        ...style
      }}
    >
      {layers}
    </div>
  );
}
