// Gestion des utilisateurs démo (bots) de l'application
import { enrichedProfiles } from '../data/appData';

/**
 * Initialise les profils démo comme de vrais utilisateurs dans localStorage
 * Ces profils ont un badge 'bot' pour les identifier
 * Met à jour les profils existants avec les nouvelles données
 */
export function initializeDemoUsers() {
  // FORCER LA MISE À JOUR À CHAQUE FOIS (pour debug)
  console.log('🔧 FORÇAGE de la mise à jour des profils démo...');

  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');

  // Vérifier si les profils démo existent déjà
  const demoEmails = [
    'admin@jeutaime.com',
    'sophie@demo.jeutaime.com',
    'emma@demo.jeutaime.com',
    'chloe@demo.jeutaime.com'
  ];

  // Créer/Mettre à jour les profils démo comme vrais users
  const demoUsers = enrichedProfiles.map((profile, index) => {
    const email = demoEmails[index];

    // Vérifier si ce profil existe déjà
    const existing = users.find(u => u.email === email);

    // Créer/Mettre à jour le profil démo avec tous les champs requis
    const demoProfile = {
      // Infos de base (comme ProfileCreation)
      email: email,
      password: 'demo123', // Mot de passe par défaut pour les bots
      name: profile.name,
      pseudo: profile.name,
      age: profile.age,
      city: profile.city,
      postalCode: index === 0 ? '75001' : index === 1 ? '75008' : index === 2 ? '75011' : '75017',
      birthDate: index === 0 ? '1990-05-15' : index === 1 ? '1995-08-22' : index === 2 ? '1993-03-10' : '1992-11-05',
      gender: index === 0 ? 'Homme' : 'Femme',

      // Avatar et photos
      avatar: profile.avatar,
      photos: profile.photos || [],

      // Bio et intérêts
      bio: profile.bio,
      interests: profile.interests?.split(', ') || [],
      job: profile.job || '',

      // Description physique humoristique
      physicalDescription: index === 0 ? 'athletique' :
                          index === 1 ? 'moyenne' :
                          index === 2 ? 'formes-genereuses' :
                          'muscle',

      // Préférences de rencontre
      interestedIn: index === 0 ? 'Femmes' : index === 1 ? 'Hommes' : index === 2 ? 'Hommes' : 'Femmes',
      lookingFor: index === 0 ? 'Relation sérieuse' :
                  index === 1 ? 'Advienne que pourra' :
                  index === 2 ? 'Amitiés' :
                  'Du Fun',
      children: index === 0 ? 'Je n\'ai pas d\'enfant' :
                index === 1 ? 'J\'en veux un jour' :
                index === 2 ? 'Je n\'en veux pas' :
                'Rien n\'est certain',

      // Questions (générer des réponses par défaut)
      question1: {
        text: "Qu'est-ce qui te fait rire ?",
        answer: index === 0 ? "Les bugs corrigés du premier coup" :
                index === 1 ? "Les situations absurdes du quotidien" :
                index === 2 ? "Les vidéos d'animaux drôles" :
                "Les jeux de mots pourris"
      },
      question2: {
        text: "Ton plat préféré ?",
        answer: index === 0 ? "Pizza margherita" :
                index === 1 ? "Pâtes carbonara" :
                index === 2 ? "Sushi" :
                "Raclette"
      },
      question3: {
        text: "Destination de rêve ?",
        answer: index === 0 ? "Silicon Valley" :
                index === 1 ? "Japon" :
                index === 2 ? "Islande" :
                "Nouvelle-Zélande"
      },

      // Système de jeu
      id: existing?.id || 1000 + index, // Garder l'ID existant ou en créer un
      createdAt: existing?.createdAt || new Date().toISOString(),
      coins: existing?.coins || (profile.id === 0 ? 999999 : 500),
      points: existing?.points || (profile.stats.letters * 10 + profile.stats.games * 5 + profile.stats.bars * 15),
      premium: profile.badges.includes('premium'),
      badges: existing?.badges || [...profile.badges, 'bot'],
      stats: existing?.stats || profile.stats,

      // Compatibilité et distance
      compatibility: profile.compatibility,
      distance: profile.distance,
      lastActive: profile.lastActive,

      // Admin flag
      isAdmin: profile.isAdmin || false,
      isBot: true // Marquer comme bot
    };

    return demoProfile;
  });

  // Remplacer ou ajouter les profils démo
  demoUsers.forEach(demoUser => {
    const existingIndex = users.findIndex(u => u.email === demoUser.email);
    if (existingIndex !== -1) {
      // Mettre à jour le profil existant
      users[existingIndex] = { ...users[existingIndex], ...demoUser };
    } else {
      // Ajouter un nouveau profil
      users.push(demoUser);
    }
  });

  localStorage.setItem('jeutaime_users', JSON.stringify(users));
  console.log(`✅ ${demoUsers.length} profil(s) démo FORCÉS à jour !`);
}

/**
 * Récupère tous les utilisateurs (vrais + bots)
 */
export function getAllUsers() {
  return JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
}

/**
 * Récupère uniquement les bots
 */
export function getBots() {
  const users = getAllUsers();
  return users.filter(u => u.isBot === true);
}

/**
 * Récupère uniquement les vrais utilisateurs (pas les bots)
 */
export function getRealUsers() {
  const users = getAllUsers();
  return users.filter(u => !u.isBot);
}

/**
 * Met à jour les stats d'un utilisateur (bot ou réel)
 */
export function updateUserStats(email, statsUpdate) {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) return false;

  // Mettre à jour les stats
  users[userIndex].stats = {
    ...users[userIndex].stats,
    ...statsUpdate
  };

  localStorage.setItem('jeutaime_users', JSON.stringify(users));
  return true;
}

/**
 * Ajoute des pièces à un utilisateur
 */
export function addCoinsToUser(email, coins) {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) return false;

  users[userIndex].coins = (users[userIndex].coins || 0) + coins;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));
  return true;
}

/**
 * Ajoute des points à un utilisateur
 */
export function addPointsToUser(email, points) {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) return false;

  users[userIndex].points = (users[userIndex].points || 0) + points;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));
  return true;
}

/**
 * Récupère un utilisateur par email
 */
export function getUserByEmail(email) {
  const users = getAllUsers();
  return users.find(u => u.email === email);
}

/**
 * Récupère un utilisateur par ID
 */
export function getUserById(id) {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

/**
 * Incrémente le compteur de victoires de duels et vérifie le badge warrior
 */
export function incrementDuelWins(email) {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) return false;

  // Initialiser duelWins si nécessaire
  if (!users[userIndex].duelWins) {
    users[userIndex].duelWins = 0;
  }

  users[userIndex].duelWins += 1;
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  // Retourner le nombre de victoires
  return users[userIndex].duelWins;
}
