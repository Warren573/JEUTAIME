/**
 * AVATAR RENDERER
 *
 * Composant de rendu qui superpose des images selon le Z-ORDER.
 * Ordre fixe par slots, keys stables, remplacement strict.
 *
 * RENDERING CONTRACT:
 * 1. Z-Order (back to front): hair → face → eyes → mouth → beard → accessory
 * 2. One layer maximum per slot (no stacking within same slot)
 * 3. Stable keys: slot-{slotName}
 * 4. Absolute positioning: all layers overlay with position:absolute, top:0, left:0
 * 5. Slot transforms: Individual transform corrections per slot (currently neutral)
 * 6. SVG assets must be properly centered in viewBox for correct alignment
 */

import React from 'react';
import { getAssetById } from './avatar.generator.js';
import { Z_ORDER } from './avatar.types.js';

/**
 * Slot-specific transforms for fine-tuning layer alignment
 * Format: { translate: [x, y], scale: number }
 * Currently neutral - calibrate as needed based on asset analysis
 */
const SLOT_TRANSFORMS = {
  hair: { translate: [0, 0], scale: 1.0 },
  face: { translate: [0, 0], scale: 1.0 },
  eyes: { translate: [0, 0], scale: 1.0 },
  mouth: { translate: [0, 0], scale: 1.0 },
  beard: { translate: [0, 0], scale: 1.0 },
  accessory: { translate: [0, 0], scale: 1.0 }
};

/**
 * Charge le chemin d'un asset depuis le manifest
 */
function getAssetPath(assetId) {
  if (!assetId) return null;
  const asset = getAssetById(assetId);
  return asset ? asset.path : null;
}

/**
 * Rend UNE couche d'asset avec key stable basée sur le slot
 * Applies slot-specific transforms for alignment correction
 */
function renderSlot(slotName, assetId) {
  if (!assetId) return null;

  const path = getAssetPath(assetId);
  if (!path) return null;

  // Get transform for this slot
  const transform = SLOT_TRANSFORMS[slotName] || { translate: [0, 0], scale: 1.0 };
  const [translateX, translateY] = transform.translate;
  const scale = transform.scale;

  // Build transform string
  const transformStr = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

  return (
    <img
      key={`slot-${slotName}`}
      src={path}
      alt=""
      draggable={false}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        transform: transformStr,
        transformOrigin: 'center center'
      }}
    />
  );
}

/**
 * Composant principal de rendu d'avatar
 * Z-Order (back to front): hair → face → eyes → mouth → beard → accessory
 *
 * IMPORTANT: Order is FIXED and follows Z_ORDER constant
 * Never conditionally reorder layers - this ensures stable visual rendering
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
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        ...style
      }}
    >
      {/* Z-Order rendering - DO NOT REORDER */}
      {renderSlot('hair', identity.hair)}
      {renderSlot('face', identity.face)}
      {renderSlot('eyes', identity.eyes)}
      {renderSlot('mouth', identity.mouth)}
      {renderSlot('beard', identity.beard)}
      {renderSlot('accessory', identity.accessory)}
    </div>
  );
}
