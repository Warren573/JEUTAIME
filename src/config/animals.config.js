/**
 * CONFIG — Animaux virtuels
 *
 * Définitions statiques des animaux disponibles à l'adoption,
 * de leurs accessoires, et des animaux adoptables (mock).
 */

export const availableAnimals = [
  { id: 'cat', emoji: '🐱', name: 'Chat', description: 'Indépendant et câlin', personality: 'Mystérieux', power: '🔮 Vision nocturne', price: 0 },
  { id: 'dog', emoji: '🐶', name: 'Chien', description: 'Fidèle et joueur', personality: 'Enthousiaste', power: '🎯 Détection émotions', price: 0 },
  { id: 'rabbit', emoji: '🐰', name: 'Lapin', description: 'Doux et curieux', personality: 'Timide', power: '🌸 Chance en amour', price: 0 },
  { id: 'hamster', emoji: '🐹', name: 'Hamster', description: 'Mignon et actif', personality: 'Énergique', power: '⚡ Énergie contagieuse', price: 0 },
  { id: 'bird', emoji: '🐦', name: 'Oiseau', description: 'Libre et chanteur', personality: 'Joyeux', power: '🎵 Charme vocal', price: 0 },
  { id: 'fox', emoji: '🦊', name: 'Renard', description: 'Rusé et charmant', personality: 'Malin', power: '🧠 Intelligence sociale', price: 0 },
  { id: 'parrot', emoji: '🦜', name: 'Perroquet', description: 'Bavard et coloré', personality: 'Sociable', power: '💬 Communication parfaite', price: 100, premium: true },
  { id: 'panda', emoji: '🐼', name: 'Panda', description: 'Rare et adorable', personality: 'Zen', power: '☮️ Aura de paix', price: 200, premium: true },
  { id: 'dragon', emoji: '🐉', name: 'Dragon', description: 'Légendaire et puissant', personality: 'Noble', power: '🔥 Attraction irrésistible', price: 500, premium: true },
];

export const animalAccessories = [
  { id: 'hat', emoji: '🎩', name: 'Chapeau élégant', price: 50 },
  { id: 'bow', emoji: '🎀', name: 'Nœud papillon', price: 30 },
  { id: 'crown', emoji: '👑', name: 'Couronne royale', price: 100 },
  { id: 'glasses', emoji: '🕶️', name: 'Lunettes cool', price: 40 },
  { id: 'scarf', emoji: '🧣', name: 'Écharpe', price: 35 },
  { id: 'cape', emoji: '🦸', name: 'Cape de super-héros', price: 80 },
];

export const adoptableAnimals = [
  { id: 1, animal: '🐱', name: 'Minou', owner: 'Sophie', age: 28, hunger: 60, happiness: 80, energy: 70, cleanliness: 50, affection: 90 },
  { id: 2, animal: '🐶', name: 'Rex', owner: 'Thomas', age: 31, hunger: 30, happiness: 95, energy: 85, cleanliness: 80, affection: 70 },
  { id: 3, animal: '🐰', name: 'Fluffy', owner: 'Marie', age: 26, hunger: 80, happiness: 60, energy: 40, cleanliness: 90, affection: 85 },
];
