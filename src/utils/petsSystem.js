/**
 * Système d'adoption et de gestion d'animaux virtuels
 * Architecture extensible pour faciliter l'ajout de nouvelles espèces
 */

import { awardPoints } from './pointsSystem';
import { addCoinsToUser } from './demoUsers';

// Définition de tous les animaux disponibles
export const PETS = {
  CAT: {
    id: 'cat',
    name: 'Chat',
    emoji: '🐱',
    rarity: 'common',
    adoptionCost: 500,
    description: 'Câlin et indépendant',
    personality: 'Dort beaucoup et aime jouer avec des ficelles',
    favoriteFood: '🐟 Poisson',
    evolutions: ['🐱', '😺', '😸', '😻'] // Étapes d'évolution
  },
  DOG: {
    id: 'dog',
    name: 'Chien',
    emoji: '🐶',
    rarity: 'common',
    adoptionCost: 500,
    description: 'Fidèle et joueur',
    personality: 'Toujours joyeux et adore jouer',
    favoriteFood: '🦴 Os',
    evolutions: ['🐶', '🐕', '🐕‍🦺', '🦮']
  },
  RABBIT: {
    id: 'rabbit',
    name: 'Lapin',
    emoji: '🐰',
    rarity: 'common',
    adoptionCost: 400,
    description: 'Doux et timide',
    personality: 'Adore les carottes et sauter partout',
    favoriteFood: '🥕 Carotte',
    evolutions: ['🐰', '🐇', '🐰', '🐇']
  },
  HAMSTER: {
    id: 'hamster',
    name: 'Hamster',
    emoji: '🐹',
    rarity: 'common',
    adoptionCost: 300,
    description: 'Mignon et actif',
    personality: 'Court dans sa roue toute la nuit',
    favoriteFood: '🌰 Graines',
    evolutions: ['🐹', '🐹', '🐹', '🐹']
  },
  PANDA: {
    id: 'panda',
    name: 'Panda',
    emoji: '🐼',
    rarity: 'rare',
    adoptionCost: 1500,
    description: 'Rare et adorable',
    personality: 'Mange du bambou et fait des acrobaties',
    favoriteFood: '🎋 Bambou',
    evolutions: ['🐼', '🐼', '🐼', '🐼']
  },
  UNICORN: {
    id: 'unicorn',
    name: 'Licorne',
    emoji: '🦄',
    rarity: 'legendary',
    adoptionCost: 3000,
    description: 'Légendaire et magique',
    personality: 'Répand des paillettes et fait des arcs-en-ciel',
    favoriteFood: '⭐ Étoiles',
    evolutions: ['🦄', '🦄', '🦄', '✨']
  },
  IGUANA: {
    id: 'iguana',
    name: 'Iguane',
    emoji: '🦎',
    rarity: 'uncommon',
    adoptionCost: 800,
    description: 'Exotique et calme',
    personality: 'Aime bronzer au soleil et grimper',
    favoriteFood: '🥬 Salade',
    evolutions: ['🦎', '🦎', '🦎', '🐉']
  },
  PENGUIN: {
    id: 'penguin',
    name: 'Pingouin',
    emoji: '🐧',
    rarity: 'uncommon',
    adoptionCost: 900,
    description: 'Élégant et joueur',
    personality: 'Adore nager et glisser sur la glace',
    favoriteFood: '🐟 Poisson frais',
    evolutions: ['🐧', '🐧', '🐧', '🐧']
  },
  FOX: {
    id: 'fox',
    name: 'Renard',
    emoji: '🦊',
    rarity: 'uncommon',
    adoptionCost: 1000,
    description: 'Rusé et agile',
    personality: 'Curieux et aime explorer',
    favoriteFood: '🍗 Poulet',
    evolutions: ['🦊', '🦊', '🦊', '🦊']
  },
  DRAGON: {
    id: 'dragon',
    name: 'Dragon',
    emoji: '🐉',
    rarity: 'legendary',
    adoptionCost: 5000,
    description: 'Mythique et puissant',
    personality: 'Crache du feu et vole dans le ciel',
    favoriteFood: '🔥 Flammes',
    evolutions: ['🥚', '🐉', '🐲', '🔥']
  }
};

// Configuration des stats et de leur dégradation
const STATS_CONFIG = {
  hunger: {
    max: 100,
    decreaseRate: 5, // Points perdus par heure
    criticalThreshold: 20
  },
  happiness: {
    max: 100,
    decreaseRate: 3,
    criticalThreshold: 30
  },
  energy: {
    max: 100,
    decreaseRate: 4,
    criticalThreshold: 25
  },
  cleanliness: {
    max: 100,
    decreaseRate: 2,
    criticalThreshold: 40
  }
};

// Récompenses pour prendre soin de son animal
const CARE_REWARDS = {
  FEED: { points: 2, coins: 5 },
  PLAY: { points: 3, coins: 8 },
  CLEAN: { points: 2, coins: 5 },
  SLEEP: { points: 2, coins: 5 },
  DAILY_CARE: { points: 20, coins: 50 } // Bonus si toutes les stats > 80%
};

/**
 * Adopter un animal
 */
export function adoptPet(userEmail, petId) {
  const pet = PETS[petId.toUpperCase()];
  if (!pet) {
    return { success: false, error: 'Animal non trouvé' };
  }

  // Vérifier si l'utilisateur a déjà un animal
  const userPets = JSON.parse(localStorage.getItem(`jeutaime_pets_${userEmail}`) || '[]');
  if (userPets.length >= 3) {
    return { success: false, error: 'Vous avez déjà 3 animaux (maximum)' };
  }

  // Vérifier si l'utilisateur a assez de coins
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const user = users.find(u => u.email === userEmail);
  if (!user || (user.coins || 0) < pet.adoptionCost) {
    return { success: false, error: 'Pas assez de coins' };
  }

  // Créer le nouvel animal
  const newPet = {
    id: Date.now(),
    type: pet.id,
    name: pet.name,
    emoji: pet.emoji,
    adoptedAt: Date.now(),
    lastUpdated: Date.now(),
    level: 1,
    experience: 0,
    stats: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      cleanliness: 100
    },
    interactions: {
      fed: 0,
      played: 0,
      cleaned: 0,
      slept: 0
    }
  };

  // Ajouter l'animal
  userPets.push(newPet);
  localStorage.setItem(`jeutaime_pets_${userEmail}`, JSON.stringify(userPets));

  // Déduire les coins
  const userIndex = users.findIndex(u => u.email === userEmail);
  users[userIndex].coins = (users[userIndex].coins || 0) - pet.adoptionCost;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  // Mettre à jour current_user
  const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
  if (currentUser && currentUser.email === userEmail) {
    currentUser.coins = users[userIndex].coins;
    localStorage.setItem('jeutaime_current_user', JSON.stringify(currentUser));
  }

  return { success: true, pet: newPet, coinsRemaining: users[userIndex].coins };
}

/**
 * Mettre à jour les stats d'un animal en fonction du temps écoulé
 */
export function updatePetStats(pet) {
  const now = Date.now();
  const hoursPassed = (now - pet.lastUpdated) / (1000 * 60 * 60);

  const updatedStats = { ...pet.stats };

  // Diminuer chaque stat
  Object.keys(STATS_CONFIG).forEach(stat => {
    const decrease = STATS_CONFIG[stat].decreaseRate * hoursPassed;
    updatedStats[stat] = Math.max(0, updatedStats[stat] - decrease);
  });

  return {
    ...pet,
    stats: updatedStats,
    lastUpdated: now
  };
}

/**
 * Récupérer les animaux d'un utilisateur avec stats à jour
 */
export function getUserPets(userEmail) {
  const pets = JSON.parse(localStorage.getItem(`jeutaime_pets_${userEmail}`) || '[]');
  return pets.map(pet => updatePetStats(pet));
}

/**
 * Nourrir un animal
 */
export function feedPet(userEmail, petId) {
  const pets = getUserPets(userEmail);
  const petIndex = pets.findIndex(p => p.id === petId);

  if (petIndex === -1) return { success: false };

  pets[petIndex].stats.hunger = Math.min(100, pets[petIndex].stats.hunger + 40);
  pets[petIndex].stats.happiness = Math.min(100, pets[petIndex].stats.happiness + 10);
  pets[petIndex].interactions.fed += 1;
  pets[petIndex].lastUpdated = Date.now();

  // Gagner de l'expérience
  pets[petIndex].experience += 5;
  checkLevelUp(pets[petIndex]);

  savePets(userEmail, pets);

  // Récompenser l'utilisateur
  awardPoints(userEmail, 'PET_CARE');
  addCoinsToUser(userEmail, CARE_REWARDS.FEED.coins);

  checkDailyCareBonus(userEmail, pets[petIndex]);

  return { success: true, pet: pets[petIndex] };
}

/**
 * Jouer avec un animal
 */
export function playWithPet(userEmail, petId) {
  const pets = getUserPets(userEmail);
  const petIndex = pets.findIndex(p => p.id === petId);

  if (petIndex === -1) return { success: false };

  pets[petIndex].stats.happiness = Math.min(100, pets[petIndex].stats.happiness + 30);
  pets[petIndex].stats.energy = Math.max(0, pets[petIndex].stats.energy - 15);
  pets[petIndex].interactions.played += 1;
  pets[petIndex].lastUpdated = Date.now();

  // Gagner de l'expérience
  pets[petIndex].experience += 8;
  checkLevelUp(pets[petIndex]);

  savePets(userEmail, pets);

  // Récompenser l'utilisateur
  awardPoints(userEmail, 'PET_PLAY');
  addCoinsToUser(userEmail, CARE_REWARDS.PLAY.coins);

  checkDailyCareBonus(userEmail, pets[petIndex]);

  return { success: true, pet: pets[petIndex] };
}

/**
 * Nettoyer un animal
 */
export function cleanPet(userEmail, petId) {
  const pets = getUserPets(userEmail);
  const petIndex = pets.findIndex(p => p.id === petId);

  if (petIndex === -1) return { success: false };

  pets[petIndex].stats.cleanliness = 100;
  pets[petIndex].stats.happiness = Math.min(100, pets[petIndex].stats.happiness + 15);
  pets[petIndex].interactions.cleaned += 1;
  pets[petIndex].lastUpdated = Date.now();

  // Gagner de l'expérience
  pets[petIndex].experience += 5;
  checkLevelUp(pets[petIndex]);

  savePets(userEmail, pets);

  // Récompenser l'utilisateur
  awardPoints(userEmail, 'PET_CARE');
  addCoinsToUser(userEmail, CARE_REWARDS.CLEAN.coins);

  checkDailyCareBonus(userEmail, pets[petIndex]);

  return { success: true, pet: pets[petIndex] };
}

/**
 * Faire dormir un animal
 */
export function putPetToSleep(userEmail, petId) {
  const pets = getUserPets(userEmail);
  const petIndex = pets.findIndex(p => p.id === petId);

  if (petIndex === -1) return { success: false };

  pets[petIndex].stats.energy = 100;
  pets[petIndex].interactions.slept += 1;
  pets[petIndex].lastUpdated = Date.now();

  // Gagner de l'expérience
  pets[petIndex].experience += 5;
  checkLevelUp(pets[petIndex]);

  savePets(userEmail, pets);

  // Récompenser l'utilisateur
  awardPoints(userEmail, 'PET_CARE');
  addCoinsToUser(userEmail, CARE_REWARDS.SLEEP.coins);

  checkDailyCareBonus(userEmail, pets[petIndex]);

  return { success: true, pet: pets[petIndex] };
}

/**
 * Vérifier le niveau et faire évoluer l'animal
 */
function checkLevelUp(pet) {
  const expForNextLevel = pet.level * 50;
  if (pet.experience >= expForNextLevel) {
    pet.level += 1;
    pet.experience -= expForNextLevel;

    // Évolution visuelle tous les 5 niveaux
    const petData = Object.values(PETS).find(p => p.id === pet.type);
    if (petData && petData.evolutions) {
      const evolutionStage = Math.min(
        Math.floor(pet.level / 5),
        petData.evolutions.length - 1
      );
      pet.emoji = petData.evolutions[evolutionStage];
    }
  }
}

/**
 * Vérifier le bonus de soins quotidiens
 */
function checkDailyCareBonus(userEmail, pet) {
  const allStatsHigh = Object.values(pet.stats).every(stat => stat >= 80);

  if (allStatsHigh) {
    const today = new Date().toDateString();
    const lastBonus = localStorage.getItem(`jeutaime_pet_bonus_${userEmail}_${pet.id}`);

    if (lastBonus !== today) {
      awardPoints(userEmail, 'PET_DAILY_CARE');
      addCoinsToUser(userEmail, CARE_REWARDS.DAILY_CARE.coins);
      localStorage.setItem(`jeutaime_pet_bonus_${userEmail}_${pet.id}`, today);
      return true;
    }
  }
  return false;
}

/**
 * Sauvegarder les animaux
 */
function savePets(userEmail, pets) {
  localStorage.setItem(`jeutaime_pets_${userEmail}`, JSON.stringify(pets));
}

/**
 * Obtenir le statut général d'un animal
 */
export function getPetStatus(pet) {
  const avgStats = Object.values(pet.stats).reduce((a, b) => a + b, 0) / 4;

  if (avgStats >= 80) return { status: 'Excellent', emoji: '😄', color: '#4CAF50' };
  if (avgStats >= 60) return { status: 'Bien', emoji: '😊', color: '#8BC34A' };
  if (avgStats >= 40) return { status: 'Moyen', emoji: '😐', color: '#FFC107' };
  if (avgStats >= 20) return { status: 'Mal', emoji: '😟', color: '#FF9800' };
  return { status: 'Critique', emoji: '😢', color: '#F44336' };
}

/**
 * Obtenir des interactions amusantes selon le type d'animal
 */
export function getPetInteraction(petType) {
  const interactions = {
    cat: [
      '🐱 Miaou ! Ton chat ronronne de bonheur',
      '🐱 Il te regarde avec des yeux de velours',
      '🐱 Il fait sa toilette en t\'ignorant royalement',
      '🐱 Il court après un point laser imaginaire'
    ],
    dog: [
      '🐶 Wouaf ! Ton chien remue la queue frénétiquement',
      '🐶 Il te lèche le visage avec joie',
      '🐶 Il court chercher sa balle préférée',
      '🐶 Il fait le beau pour une friandise'
    ],
    unicorn: [
      '🦄 Ta licorne fait apparaître un arc-en-ciel',
      '🦄 Des paillettes magiques tombent autour d\'elle',
      '🦄 Elle hennit mélodieusement',
      '🦄 Sa corne brille de mille feux'
    ],
    panda: [
      '🐼 Ton panda grignote du bambou tranquillement',
      '🐼 Il fait une roulade adorable',
      '🐼 Il grimpe maladroitement à un arbre',
      '🐼 Il te fait un câlin géant'
    ],
    iguana: [
      '🦎 Ton iguane prend le soleil paresseusement',
      '🦎 Il change de couleur légèrement',
      '🦎 Il grimpe sur ton épaule',
      '🦎 Il cligne lentement des yeux'
    ],
    hamster: [
      '🐹 Ton hamster court dans sa roue à toute vitesse',
      '🐹 Il remplit ses joues de nourriture',
      '🐹 Il creuse frénétiquement dans sa litière',
      '🐹 Il fait sa toilette avec ses petites pattes'
    ],
    rabbit: [
      '🐰 Ton lapin fait des bonds de joie',
      '🐰 Il grignote une carotte avec délice',
      '🐰 Ses oreilles tressaillent curieusement',
      '🐰 Il se frotte contre ta jambe'
    ],
    penguin: [
      '🐧 Ton pingouin glisse sur son ventre',
      '🐧 Il bat des ailes joyeusement',
      '🐧 Il fait des petits bruits adorables',
      '🐧 Il se dandine en marchant'
    ],
    fox: [
      '🦊 Ton renard fait une petite danse',
      '🦊 Il renifle partout avec curiosité',
      '🦊 Il pousse un petit glapissement',
      '🦊 Il cache quelque chose de brillant'
    ],
    dragon: [
      '🐉 Ton dragon crache un petit nuage de fumée',
      '🐉 Ses écailles scintillent majestueusement',
      '🐉 Il bat des ailes puissamment',
      '🐉 Il rugit fièrement'
    ]
  };

  const petInteractions = interactions[petType] || ['Ton animal te regarde avec affection'];
  return petInteractions[Math.floor(Math.random() * petInteractions.length)];
}

/**
 * Initialiser des animaux de démo pour tester l'application
 */
export function initializeDemoPets() {
  // Vérifier si déjà initialisé
  const demoVersion = localStorage.getItem('jeutaime_demo_pets_version');
  console.log('🐾 Version actuelle des pets:', demoVersion);

  if (demoVersion === '1.2') {
    console.log('✅ Pets déjà initialisés en version 1.2');
    return;
  }

  console.log('🐾 Initialisation des animaux de démo (version 1.2)...');

  // Trouver l'utilisateur de démo (le premier utilisateur non-bot)
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  console.log('👥 Nombre total d\'utilisateurs:', users.length);
  const demoUser = users.find(u => !u.isBot);

  if (!demoUser) {
    console.log('❌ Aucun utilisateur de démo trouvé');
    console.log('   Utilisateurs disponibles:', users.map(u => `${u.name} (bot: ${u.isBot})`));
    return;
  }

  console.log('✅ Utilisateur de démo trouvé:', demoUser.name, '/', demoUser.email);

  // Créer 1 seul animal adopté et incarné
  const demoPets = [
    {
      id: Date.now(),
      type: 'cat',
      name: 'Chat',
      emoji: '🐱',
      adoptedAt: Date.now() - (86400000 * 5), // Adopté il y a 5 jours
      lastUpdated: Date.now(),
      level: 3,
      experience: 45,
      stats: {
        hunger: 75,
        happiness: 85,
        energy: 60,
        cleanliness: 90
      },
      interactions: {
        fed: 15,
        played: 12,
        cleaned: 8,
        slept: 10
      }
    }
  ];

  // Sauvegarder les pets
  localStorage.setItem(`jeutaime_pets_${demoUser.email}`, JSON.stringify(demoPets));

  // Incarner le chat
  const userIndex = users.findIndex(u => u.email === demoUser.email);
  if (userIndex !== -1) {
    users[userIndex].incarnatedAs = {
      petId: 'cat',
      emoji: '🐱',
      name: 'Chat',
      since: new Date().toISOString()
    };
    localStorage.setItem('jeutaime_users', JSON.stringify(users));

    // Mettre à jour current_user si c'est celui-là
    const currentUser = JSON.parse(localStorage.getItem('jeutaime_current_user') || 'null');
    if (currentUser && currentUser.email === demoUser.email) {
      currentUser.incarnatedAs = users[userIndex].incarnatedAs;
      localStorage.setItem('jeutaime_current_user', JSON.stringify(currentUser));
    }
  }

  localStorage.setItem('jeutaime_demo_pets_version', '1.2');
  console.log('✅ Animal de démo initialisé v1.2: Chat (incarné)');
  console.log('📧 Email utilisateur:', demoUser.email);
  console.log('🐾 Pets sauvegardés:', demoPets.length);
}
