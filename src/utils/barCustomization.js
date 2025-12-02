// Système de personnalisation des salons pour les admins
// Permet de sauvegarder des modifications en localStorage qui overrident appData.js

const STORAGE_KEY = 'jeutaime_bar_customizations';

/**
 * Obtenir toutes les personnalisations de salons
 * @returns {Object} Objet avec barId comme clé
 */
export function getBarCustomizations() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

/**
 * Sauvegarder une personnalisation de salon
 * @param {number} barId - ID du salon
 * @param {Object} customizations - Propriétés personnalisées
 */
export function saveBarCustomization(barId, customizations) {
  const allCustomizations = getBarCustomizations();
  allCustomizations[barId] = {
    ...customizations,
    updatedAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allCustomizations));
}

/**
 * Supprimer une personnalisation (retour aux valeurs par défaut)
 * @param {number} barId - ID du salon
 */
export function removeBarCustomization(barId) {
  const allCustomizations = getBarCustomizations();
  delete allCustomizations[barId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allCustomizations));
}

/**
 * Appliquer les personnalisations aux bars
 * @param {Array} bars - Liste des bars depuis appData
 * @returns {Array} Bars avec personnalisations appliquées
 */
export function applyBarCustomizations(bars) {
  const customizations = getBarCustomizations();

  return bars.map(bar => {
    const custom = customizations[bar.id];
    if (custom) {
      return {
        ...bar,
        ...custom,
        id: bar.id, // Conserver l'ID original
        participants: bar.participants, // Conserver les participants
        magicAction: bar.magicAction // Conserver l'action magique
      };
    }
    return bar;
  });
}

/**
 * Vérifier si un bar a des personnalisations
 * @param {number} barId - ID du salon
 * @returns {boolean}
 */
export function hasBarCustomization(barId) {
  const customizations = getBarCustomizations();
  return !!customizations[barId];
}
