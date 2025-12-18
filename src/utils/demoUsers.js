// Gestion des utilisateurs démo (bots) de l'application
import { enrichedProfiles } from '../data/appData';

/**
 * Initialise les profils démo comme de vrais utilisateurs dans localStorage
 * Ces profils ont un badge 'bot' pour les identifier
 * Met à jour les profils existants avec les nouvelles données
 */
export function initializeDemoUsers() {
  // SUPPRESSION UNIQUEMENT DES PROFILS DÉMO (garder les vrais utilisateurs)
  console.log('💣 SUPPRESSION des anciens profils démo...');
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  localStorage.removeItem('jeutaime_demo_version');

  console.log('🔧 CRÉATION FORCÉE des profils démo avec préférences de rencontre...');

  // Créer 20 profils démo variés
  const botNames = [
    { name: 'Sophie', gender: 'Femme', age: 28, city: 'Paris', bio: 'Adepte de yoga et de bons livres 📚🧘‍♀️', ghoster: false },
    { name: 'Emma', gender: 'Femme', age: 26, city: 'Lyon', bio: 'Photographe amateure, toujours en quête du cliché parfait 📷✨', ghoster: false },
    { name: 'Chloé', gender: 'Femme', age: 24, city: 'Marseille', bio: 'Fan de randonnée et de bons vins 🥾🍷', ghoster: true },
    { name: 'Léa', gender: 'Femme', age: 25, city: 'Bordeaux', bio: 'Passionnée de cuisine et de voyages 🍳✈️', ghoster: false },
    { name: 'Clara', gender: 'Femme', age: 27, city: 'Toulouse', bio: 'Musicienne le jour, rêveuse la nuit 🎵🌙', ghoster: false },
    { name: 'Océane', gender: 'Femme', age: 29, city: 'Nantes', bio: 'Surf, soleil et cocktails en terrasse 🏄‍♀️🍹', ghoster: false },
    { name: 'Marine', gender: 'Femme', age: 24, city: 'Lille', bio: 'Architecte d\'intérieur avec un faible pour le vintage 🏠', ghoster: true },
    { name: 'Zoé', gender: 'Femme', age: 26, city: 'Strasbourg', bio: 'Comédienne et amoureuse des animaux 🎭🐾', ghoster: false },
    { name: 'Amélia', gender: 'Femme', age: 30, city: 'Nice', bio: 'Chef pâtissière, spécialiste des éclairs au chocolat 🍫', ghoster: false },
    { name: 'Victoria', gender: 'Femme', age: 28, city: 'Rennes', bio: 'Développeuse web qui code et jardine 💻🌱', ghoster: false },

    { name: 'Alexandre', gender: 'Homme', age: 32, city: 'Paris', bio: 'Ingénieur passionné de cinéma et de sci-fi 🎬🚀', ghoster: false },
    { name: 'Jules', gender: 'Homme', age: 28, city: 'Lyon', bio: 'Barista et amateur de bières artisanales ☕🍺', ghoster: false },
    { name: 'Lucas', gender: 'Homme', age: 30, city: 'Marseille', bio: 'Guide de montagne, toujours prêt pour l\'aventure ⛰️', ghoster: true },
    { name: 'Kevin', gender: 'Homme', age: 27, city: 'Bordeaux', bio: 'Artiste graffeur et skateur 🎨🛹', ghoster: false },
    { name: 'Xavier', gender: 'Homme', age: 35, city: 'Toulouse', bio: 'Professeur de danse salsa, j\'aime faire tourner les têtes 💃', ghoster: false },
    { name: 'Thomas', gender: 'Homme', age: 29, city: 'Nantes', bio: 'Libraire et écrivain en herbe 📖✍️', ghoster: false },
    { name: 'Maxime', gender: 'Homme', age: 26, city: 'Lille', bio: 'Chef cuisinier, expert en cuisine fusion 🍜', ghoster: true },
    { name: 'Antoine', gender: 'Homme', age: 31, city: 'Strasbourg', bio: 'Photographe de mariage, je capture les émotions 📸💍', ghoster: false },
    { name: 'Hugo', gender: 'Homme', age: 28, city: 'Nice', bio: 'Guitariste dans un groupe de rock indie 🎸', ghoster: false },
    { name: 'Julien', gender: 'Homme', age: 33, city: 'Rennes', bio: 'Astrophysicien et fan de Star Wars 🌌⭐', ghoster: false }
  ];

  const demoEmails = botNames.map((bot, i) => `${bot.name.toLowerCase()}${i}@bot.jeutaime.com`);

  // Garder SEULEMENT les vrais utilisateurs (pas les démos)
  const freshUsers = users.filter(u => !u.isBot);

  // Créer les nouveaux profils démo
  const demoUsers = botNames.map((botData, index) => {
    const email = demoEmails[index];

    const physicalDescriptions = ['filiforme', 'ras-motte', 'athletique', 'moyenne', 'formes-genereuses', 'muscle', 'grande-gigue', 'beaute-interieure'];
    const interests = ['Voyages', 'Cuisine', 'Cinéma', 'Sport', 'Musique', 'Art', 'Lecture', 'Jeux vidéo'];
    const jobs = ['Ingénieur', 'Professeur', 'Chef', 'Artiste', 'Développeur', 'Médecin', 'Designer', 'Entrepreneur'];

    // Créer/Mettre à jour le profil démo avec tous les champs requis
    const demoProfile = {
      // Infos de base
      email: email,
      password: 'demo123',
      name: botData.name,
      pseudo: botData.name,
      age: botData.age,
      city: botData.city,
      postalCode: `${59000 + index}`,
      birthDate: `${1995 - botData.age}-0${(index % 12) + 1}-15`,
      gender: botData.gender,

      // Avatar et photos
      avatar: {},
      photos: [],

      // Bio et intérêts
      bio: botData.bio,
      interests: [interests[index % interests.length], interests[(index + 1) % interests.length]],
      job: jobs[index % jobs.length],

      // Description physique
      physicalDescription: physicalDescriptions[index % physicalDescriptions.length],

      // Préférences de rencontre
      interestedIn: botData.gender === 'Homme' ? 'Femmes' : 'Hommes',
      lookingFor: index % 4 === 0 ? 'Relation sérieuse' : index % 4 === 1 ? 'Advienne que pourra' : index % 4 === 2 ? 'Amitiés' : 'Du Fun',
      children: index % 5 === 0 ? 'Je n\'ai pas d\'enfant' : index % 5 === 1 ? 'J\'en veux un jour' : index % 5 === 2 ? 'Je n\'en veux pas' : index % 5 === 3 ? 'J\'en ai mais pas assez' : 'Rien n\'est certain',

      // Questions avec choix multiples pour le jeu de matching
      question1: {
        text: "Qu'est-ce qui te fait rire ?",
        answerA: "Les blagues nulles",
        answerB: "Les situations absurdes",
        answerC: "Les vidéos d'animaux",
        correctAnswer: "B"
      },
      question2: {
        text: "Ton plat préféré ?",
        answerA: "Pizza",
        answerB: "Sushi",
        answerC: "Cuisine du monde",
        correctAnswer: index % 3 === 0 ? "A" : index % 3 === 1 ? "B" : "C"
      },
      question3: {
        text: "Destination de rêve ?",
        answerA: botData.city === 'Paris' ? 'Tokyo' : 'New York',
        answerB: "Bali",
        answerC: "Islande",
        correctAnswer: "A"
      },

      // Système
      id: 1000 + index,
      createdAt: new Date().toISOString(),
      coins: 500,
      points: Math.floor(Math.random() * 1000) + 100,
      premium: index === 0,
      badges: index === 0 ? ['bot', 'premium'] : ['bot'],
      stats: { letters: Math.floor(Math.random() * 50), games: Math.floor(Math.random() * 30), bars: Math.floor(Math.random() * 20) },

      // Compatibilité
      compatibility: Math.floor(Math.random() * 30) + 70,
      distance: `${Math.floor(Math.random() * 50) + 1}km`,
      lastActive: index % 3 === 0 ? 'En ligne' : index % 3 === 1 ? 'Il y a 5 min' : 'Il y a 1h',

      // Flags
      isAdmin: index === 0,
      isBot: true,
      isGhoster: botData.ghoster, // Certains vont ghoster après quelques messages
      autoReply: !botData.ghoster // Les non-ghosters répondent automatiquement
    };

    return demoProfile;
  });

  // Ajouter les nouveaux profils démo
  const allUsers = [...freshUsers, ...demoUsers];
  localStorage.setItem('jeutaime_users', JSON.stringify(allUsers));

  console.log(`✅ ${demoUsers.length} profil(s) démo CRÉÉS avec succès !`);

  // VÉRIFIER CE QUI A ÉTÉ SAUVEGARDÉ
  demoUsers.forEach(demo => {
    console.log(`✨ ${demo.name}:`, {
      interestedIn: demo.interestedIn,
      lookingFor: demo.lookingFor,
      children: demo.children,
      physicalDescription: demo.physicalDescription
    });
  });
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

/**
 * Génère une réponse automatique pour un bot
 */
export function generateBotReply(botEmail, userMessage, conversationHistory = []) {
  const bot = getUserByEmail(botEmail);
  if (!bot || !bot.isBot) return null;

  // Si c'est un ghoster et qu'il y a déjà 3+ messages, ne pas répondre
  if (bot.isGhoster && conversationHistory.length >= 6) {
    return null; // Ghost après 3 échanges
  }

  // Pool de réponses variées
  const messageLength = userMessage ? userMessage.length : 0;
  const replies = [
    'Salut ! ' + (messageLength > 50 ? 'J\'adore les messages longs, ça montre qu\'on prend le temps 😊' : 'Sympa de m\'écrire !'),
    'Hey ! Merci pour ton message 💕',
    'Coucou ! Content•e de faire ta connaissance 😄',
    'Yo ! Moi aussi j\'adore discuter de tout et de rien',
    'Hello ! Tu as l\'air sympa !',
    'Salut ! On dirait qu\'on a des points communs !',
    'Hey ! 😊 Moi je suis sur ' + bot.city + ', et toi ?',
    'Coucou ! C\'est cool qu\'on puisse discuter comme ça',
    'Salut ! ' + (bot.job ? 'Moi je bosse comme ' + bot.job + ', ' : '') + 'et toi tu fais quoi dans la vie ?',
    'Hello ! Cool ton message !'
  ];

  // Réponses spéciales pour les ghosters (plus froides avant de ghost)
  if (bot.isGhoster && conversationHistory.length >= 4) {
    const coldReplies = ['Ok 👍', 'Ah d\'accord', 'Sympa !', 'Cool', 'Ouais pas mal'];
    return coldReplies[Math.floor(Math.random() * coldReplies.length)];
  }

  return replies[Math.floor(Math.random() * replies.length)];
}

/**
 * Envoie automatiquement une réponse d'un bot après un délai
 */
export function triggerBotAutoReply(botId, userEmail, userMessage) {
  const bot = getUserById(botId);
  if (!bot || !bot.isBot || !bot.autoReply) return;

  // Récupérer la conversation
  const convos = JSON.parse(localStorage.getItem('jeutaime_conversations') || '{}');
  const convKey = [userEmail, bot.email].sort().join('_');
  const conversation = convos[convKey] || { messages: [], unreadCount: 0 };

  // Générer la réponse
  const reply = generateBotReply(bot.email, userMessage, conversation.messages);

  if (!reply) return; // Le bot a ghosté

  // Attendre 2-5 secondes avant de répondre (simulation réaliste)
  const delay = Math.random() * 3000 + 2000;

  setTimeout(() => {
    // Récupérer la conversation à nouveau pour avoir l'état actuel
    const updatedConvos = JSON.parse(localStorage.getItem('jeutaime_conversations') || '{}');
    const updatedConversation = updatedConvos[convKey] || { messages: [], letterCount: { user: 0, matched: 0 } };

    const newMessage = {
      id: Date.now(),
      sender: 'matched', // Format compatible avec ChatScreen
      text: reply,
      timestamp: new Date().toISOString(),
      read: false
    };

    updatedConversation.messages.push(newMessage);
    updatedConversation.letterCount = updatedConversation.letterCount || { user: 0, matched: 0 };
    updatedConversation.letterCount.matched = (updatedConversation.letterCount.matched || 0) + 1;
    updatedConversation.lastUpdate = new Date().toISOString();
    updatedConversation.participants = updatedConversation.participants || { user: userEmail, matched: bot.id };

    updatedConvos[convKey] = updatedConversation;
    localStorage.setItem('jeutaime_conversations', JSON.stringify(updatedConvos));

    // Dispatch event pour rafraîchir l'UI
    window.dispatchEvent(new CustomEvent('bot-reply-received', { detail: { botEmail: bot.email } }));
  }, delay);
}
