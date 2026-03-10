/**
 * SERVICES — Point d'entrée unique
 *
 * Importe depuis ici pour accéder aux services, jamais directement.
 * Facilite le mock en tests et la migration vers Supabase.
 */

export { storage } from './storage/index.js';
export * from './userService.js';
export * from './moderationService.js';
export * from './adminLogService.js';
