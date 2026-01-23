/**
 * ContentRegistry - Registre centralisé du contenu
 *
 * Unifie les sources de données existantes sans les modifier.
 * Permet d'activer/désactiver des éléments sans toucher à l'UI.
 *
 * Architecture backend-ready : structure prête pour API migration.
 */

import { allMagic, allGifts } from '../data/magicGifts';
import { GIFTS, SPELLS } from '../config/giftsConfig';
import { salons } from '../data/appData';

// ============================================================================
// STORAGE KEYS
// ============================================================================
const STORAGE_KEYS = {
  DISABLED_ITEMS: 'jeutaime_disabled_content', // IDs des éléments désactivés
  CUSTOM_CONTENT: 'jeutaime_custom_content'    // Contenu custom ajouté par admin
};

// ============================================================================
// REGISTRY - Unifie toutes les sources
// ============================================================================

/**
 * Récupère toutes les offrandes disponibles
 * Fusionne magicGifts.js et giftsConfig.js en évitant les doublons
 */
export function getOfferings() {
  const disabled = getDisabledItems();

  // Fusionner les deux sources
  const fromMagicGifts = allGifts.map(g => ({
    id: g.id,
    name: g.name,
    icon: g.icon,
    gifUrl: g.gifUrl,
    description: g.description,
    cost: g.cost,
    category: g.category || 'classic',
    isPremium: g.isPremium || false,
    isLegendary: g.isLegendary || false,
    source: 'magicGifts'
  }));

  const fromGiftsConfig = Object.values(GIFTS).map(g => ({
    id: g.id,
    name: g.name,
    icon: g.emoji,
    gifUrl: g.gifUrl,
    description: g.description,
    cost: g.cost,
    category: g.rarity || 'common',
    effect: g.effect,
    color: g.color,
    source: 'giftsConfig'
  }));

  // Fusionner en évitant les doublons (priorité à magicGifts)
  const merged = [...fromMagicGifts];
  const existingIds = new Set(fromMagicGifts.map(g => g.id));

  fromGiftsConfig.forEach(g => {
    if (!existingIds.has(g.id)) {
      merged.push(g);
    }
  });

  // Filtrer les éléments désactivés
  return merged.filter(item => !disabled.has(item.id));
}

/**
 * Récupère tous les pouvoirs magiques disponibles
 */
export function getPowers() {
  const disabled = getDisabledItems();

  // Magies individuelles et de salon
  const fromMagicGifts = allMagic.map(m => ({
    id: m.id,
    name: m.name,
    icon: m.icon,
    gifUrl: m.gifUrl,
    description: m.description,
    type: m.type, // 'individual' ou 'salon'
    cost: m.cost,
    duration: m.duration || 0,
    source: 'magicGifts'
  }));

  // Sorts de giftsConfig
  const fromSpells = Object.values(SPELLS).map(s => ({
    id: s.id,
    name: s.name,
    icon: s.emoji,
    gifUrl: s.gifUrl,
    description: s.description,
    cost: s.cost,
    duration: s.duration || 0,
    effect: s.effect,
    type: 'individual',
    source: 'giftsConfig'
  }));

  // Fusionner
  const merged = [...fromMagicGifts];
  const existingIds = new Set(fromMagicGifts.map(m => m.id));

  fromSpells.forEach(s => {
    if (!existingIds.has(s.id)) {
      merged.push(s);
    }
  });

  return merged.filter(item => !disabled.has(item.id));
}

/**
 * Récupère tous les salons disponibles
 */
export function getSalons() {
  const disabled = getDisabledItems();
  const customSalons = getCustomContent('salons');

  // Salons de base depuis appData
  const baseSalons = salons.map(s => ({
    id: s.id,
    icon: s.icon,
    name: s.name,
    desc: s.desc,
    bgGradient: s.bgGradient,
    magicAction: s.magicAction,
    participants: s.participants || [],
    source: 'default'
  }));

  // Ajouter les salons custom
  const allSalons = [...baseSalons, ...customSalons];

  // Filtrer désactivés
  return allSalons.filter(salon => !disabled.has(`salon-${salon.id}`));
}

/**
 * Récupère le thème d'un salon
 */
export function getSalonTheme(salonId) {
  const salon = getSalons().find(s => s.id === salonId);
  if (!salon) return null;

  return {
    id: salonId,
    name: salon.name,
    icon: salon.icon,
    bgGradient: salon.bgGradient,
    magicAction: salon.magicAction
  };
}

/**
 * Récupère un élément par ID (cherche dans toutes les sources)
 */
export function getItemById(id) {
  // Chercher dans offrandes
  const offering = getOfferings().find(o => o.id === id);
  if (offering) return { ...offering, type: 'offering' };

  // Chercher dans pouvoirs
  const power = getPowers().find(p => p.id === id);
  if (power) return { ...power, type: 'power' };

  // Chercher dans salons
  const salon = getSalons().find(s => s.id === id);
  if (salon) return { ...salon, type: 'salon' };

  return null;
}

// ============================================================================
// ADMIN - Activer/Désactiver du contenu
// ============================================================================

/**
 * Désactive un élément (ne l'affiche plus dans l'UI)
 */
export function disableItem(itemId) {
  const disabled = getDisabledItems();
  disabled.add(itemId);
  saveDisabledItems(disabled);
}

/**
 * Réactive un élément
 */
export function enableItem(itemId) {
  const disabled = getDisabledItems();
  disabled.delete(itemId);
  saveDisabledItems(disabled);
}

/**
 * Vérifie si un élément est désactivé
 */
export function isItemDisabled(itemId) {
  return getDisabledItems().has(itemId);
}

// ============================================================================
// ADMIN - Ajouter du contenu custom
// ============================================================================

/**
 * Ajoute un salon custom
 * Utile pour admin panel sans modifier appData.js
 */
export function addCustomSalon(salonData) {
  const customContent = getCustomContent('salons');
  const newId = Math.max(...customContent.map(s => s.id), 0, ...salons.map(s => s.id)) + 1;

  const newSalon = {
    id: newId,
    ...salonData,
    source: 'custom',
    createdAt: new Date().toISOString()
  };

  customContent.push(newSalon);
  saveCustomContent('salons', customContent);

  return newSalon;
}

/**
 * Supprime un salon custom
 */
export function removeCustomSalon(salonId) {
  let customContent = getCustomContent('salons');
  customContent = customContent.filter(s => s.id !== salonId);
  saveCustomContent('salons', customContent);
}

// ============================================================================
// STORAGE HELPERS (backend-ready)
// ============================================================================

function getDisabledItems() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DISABLED_ITEMS);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch (e) {
    console.error('ContentRegistry: Error loading disabled items', e);
    return new Set();
  }
}

function saveDisabledItems(disabledSet) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.DISABLED_ITEMS,
      JSON.stringify([...disabledSet])
    );
  } catch (e) {
    console.error('ContentRegistry: Error saving disabled items', e);
  }
}

function getCustomContent(type) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_CONTENT);
    const allCustom = data ? JSON.parse(data) : {};
    return allCustom[type] || [];
  } catch (e) {
    console.error('ContentRegistry: Error loading custom content', e);
    return [];
  }
}

function saveCustomContent(type, content) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_CONTENT);
    const allCustom = data ? JSON.parse(data) : {};
    allCustom[type] = content;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CONTENT, JSON.stringify(allCustom));
  } catch (e) {
    console.error('ContentRegistry: Error saving custom content', e);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getOfferings,
  getPowers,
  getSalons,
  getSalonTheme,
  getItemById,
  disableItem,
  enableItem,
  isItemDisabled,
  addCustomSalon,
  removeCustomSalon
};
