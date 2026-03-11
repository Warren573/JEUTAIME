/**
 * CONTENT REGISTRY
 *
 * Registre centralisé de tout le contenu du système Offrandes / Pouvoirs.
 * Charge les catalogues et fournit des helpers de lookup.
 *
 * Pour ajouter du contenu : éditer offerings.js, powers.js ou visualEffects.js.
 * Ce fichier n'a PAS besoin d'être modifié.
 */

import { offerings } from '../data/offerings';
import { powers } from '../data/powers';
import { visualEffects } from '../data/visualEffects';

// Catalogue fusionné offrandes + pouvoirs
const allItems = [...offerings, ...powers];

// ─── LOOKUP HELPERS ───────────────────────────────────────────────────────────

/**
 * Retourne une offrande par son id, ou undefined.
 */
export function getOfferingById(id) {
  return offerings.find(o => o.id === id);
}

/**
 * Retourne un pouvoir par son id, ou undefined.
 */
export function getPowerById(id) {
  return powers.find(p => p.id === id);
}

/**
 * Retourne un effet visuel par son id, ou undefined.
 */
export function getEffectById(id) {
  return visualEffects.find(e => e.id === id);
}

/**
 * Retourne un item (offrande ou pouvoir) par son id, ou undefined.
 */
export function getItemById(id) {
  return allItems.find(i => i.id === id);
}

/**
 * Retourne tous les items disponibles dans un salon donné.
 * Un item est disponible si salonTags contient le tag ou "global".
 *
 * @param {string} tag - identifiant du salon (ex: "metal", "romantique")
 */
export function getItemsForSalon(tag) {
  return allItems.filter(item =>
    item.salonTags?.includes('global') || item.salonTags?.includes(tag)
  );
}

/**
 * Retourne uniquement les offrandes disponibles dans un salon.
 */
export function getOfferingsForSalon(tag) {
  return offerings.filter(item =>
    item.salonTags?.includes('global') || item.salonTags?.includes(tag)
  );
}

/**
 * Retourne uniquement les pouvoirs disponibles dans un salon.
 */
export function getPowersForSalon(tag) {
  return powers.filter(item =>
    item.salonTags?.includes('global') || item.salonTags?.includes(tag)
  );
}

/**
 * Retourne tous les effets visuels.
 */
export function getAllVisualEffects() {
  return visualEffects;
}

/**
 * Retourne toutes les offrandes.
 */
export function getAllOfferings() {
  return offerings;
}

/**
 * Retourne tous les pouvoirs.
 */
export function getAllPowers() {
  return powers;
}

/**
 * Formate le message salon d'un item en remplaçant {sender} et {target}.
 */
export function formatSalonMessage(item, senderName, targetName) {
  return (item.salonMessage || '')
    .replace('{sender}', senderName)
    .replace('{target}', targetName);
}

export default {
  getOfferingById,
  getPowerById,
  getEffectById,
  getItemById,
  getItemsForSalon,
  getOfferingsForSalon,
  getPowersForSalon,
  getAllOfferings,
  getAllPowers,
  getAllVisualEffects,
  formatSalonMessage,
};

// ─── ALIASES (compatibilité) ──────────────────────────────────────────────────
export const getOfferings = getAllOfferings;
export const getPowers    = getAllPowers;
export const getSalons    = () => [];   // stub — les salons sont dans appData
