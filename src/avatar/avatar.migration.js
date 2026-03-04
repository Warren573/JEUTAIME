/**
 * AVATAR MIGRATION UTILITIES
 *
 * Converts legacy avatar data (hairBack/hairFront) to unified model (single hair slot)
 */

/**
 * Converts a legacy avatar identity to the unified model
 *
 * Legacy model had:
 * - hairBack: ID pointing to hair_back_XX_*
 * - hairFront: ID pointing to hair_front_XX_*
 *
 * Unified model has:
 * - hair: Single ID pointing to hair_XX_*
 *
 * Strategy: Prefer hairFront if exists, fallback to hairBack, convert ID format
 *
 * @param {Object} legacyIdentity - Legacy avatar identity
 * @returns {Object} Unified avatar identity
 */
export function migrateLegacyIdentity(legacyIdentity) {
  if (!legacyIdentity) return null;

  const unified = { ...legacyIdentity };

  // Check if this is already a unified identity (has 'hair' property)
  if ('hair' in unified && !('hairBack' in unified) && !('hairFront' in unified)) {
    return unified;
  }

  // Migrate hair: prefer hairFront, fallback to hairBack
  let hairId = null;

  if (legacyIdentity.hairFront) {
    // Convert hair_front_XX_name to hair_XX_name
    hairId = legacyIdentity.hairFront.replace('hair_front_', 'hair_');
  } else if (legacyIdentity.hairBack) {
    // Convert hair_back_XX_name to hair_XX_name
    hairId = legacyIdentity.hairBack.replace('hair_back_', 'hair_');
  }

  // Remove legacy properties
  delete unified.hairBack;
  delete unified.hairFront;

  // Add unified property
  unified.hair = hairId;

  return unified;
}

/**
 * Migrates a complete avatar state from legacy to unified model
 *
 * @param {Object} legacyState - Legacy avatar state
 * @returns {Object} Unified avatar state
 */
export function migrateLegacyAvatarState(legacyState) {
  if (!legacyState) return null;

  return {
    ...legacyState,
    identity: migrateLegacyIdentity(legacyState.identity),
    lastUpdate: Date.now()
  };
}

/**
 * Migrates all stored avatars in localStorage from legacy to unified model
 *
 * @returns {Object} Migration result with counts
 */
export function migrateAllStoredAvatars() {
  try {
    const storageKey = 'jeutaime_avatar_state';
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return { success: true, migrated: 0, message: 'No stored avatars to migrate' };
    }

    const allAvatars = JSON.parse(stored);
    let migratedCount = 0;
    let alreadyUnified = 0;

    for (const userId in allAvatars) {
      const avatarState = allAvatars[userId];

      // Check if needs migration
      if (avatarState.identity &&
          ('hairBack' in avatarState.identity || 'hairFront' in avatarState.identity)) {
        allAvatars[userId] = migrateLegacyAvatarState(avatarState);
        migratedCount++;
      } else {
        alreadyUnified++;
      }
    }

    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(allAvatars));

    return {
      success: true,
      migrated: migratedCount,
      alreadyUnified,
      total: Object.keys(allAvatars).length,
      message: `Successfully migrated ${migratedCount} avatar(s), ${alreadyUnified} already unified`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to migrate stored avatars'
    };
  }
}

/**
 * Checks if an identity needs migration
 *
 * @param {Object} identity - Avatar identity to check
 * @returns {boolean} True if needs migration
 */
export function needsMigration(identity) {
  if (!identity) return false;
  return ('hairBack' in identity) || ('hairFront' in identity);
}
