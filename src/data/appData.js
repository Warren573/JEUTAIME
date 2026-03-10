/**
 * DONNÉES STATIQUES — Point d'entrée rétrocompatible
 *
 * Les exports sont maintenant dans src/mocks/ et src/config/.
 * Ce fichier re-exporte tout pour éviter de casser les imports existants.
 */

export { salons } from '../mocks/salons.mock.js';
export { receivedOfferings } from '../mocks/offerings.mock.js';
export { journalNews } from '../mocks/journalNews.mock.js';
export { enrichedProfiles, profileBadges } from '../mocks/profiles.mock.js';
export { availableAnimals, animalAccessories, adoptableAnimals } from '../config/animals.config.js';
