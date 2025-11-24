// Générateur de bots pour tester l'application
import { initializeDemoUsers } from './demoUsers';

// Noms et profils variés pour les bots
const botProfiles = [
  // Femmes
  {
    name: 'Sophie', age: 28, city: 'Paris', gender: 'F',
    bio: 'Designer passionnée de voyages et de photographie 📸✈️',
    interests: ['Voyage', 'Photo', 'Yoga', 'Cuisine'],
    job: 'Designer graphique'
  },
  {
    name: 'Emma', age: 26, city: 'Lyon', gender: 'F',
    bio: 'Vétérinaire amoureuse des animaux 🐶❤️',
    interests: ['Animaux', 'Randonnée', 'Lecture', 'Musique'],
    job: 'Vétérinaire'
  },
  {
    name: 'Chloé', age: 29, city: 'Marseille', gender: 'F',
    bio: 'Adore la mer, le soleil et les soirées entre amis 🌊☀️',
    interests: ['Mer', 'Danse', 'Cocktails', 'Voyages'],
    job: 'Architecte'
  },
  {
    name: 'Léa', age: 25, city: 'Bordeaux', gender: 'F',
    bio: 'Étudiante en droit, passionnée de musique classique 🎵',
    interests: ['Musique', 'Littérature', 'Vin', 'Histoire'],
    job: 'Étudiante'
  },
  {
    name: 'Clara', age: 27, city: 'Toulouse', gender: 'F',
    bio: 'Prof de yoga, j\'aime la nature et la méditation 🧘‍♀️',
    interests: ['Yoga', 'Nature', 'Méditation', 'Végétarien'],
    job: 'Professeur de yoga'
  },
  {
    name: 'Océane', age: 24, city: 'Nantes', gender: 'F',
    bio: 'Blogueuse lifestyle, toujours à la recherche de nouveautés 💄',
    interests: ['Mode', 'Beauté', 'Voyage', 'Instagram'],
    job: 'Influenceuse'
  },
  {
    name: 'Marine', age: 30, city: 'Lille', gender: 'F',
    bio: 'Infirmière dévouée, j\'adore les séries et le chocolat 🍫',
    interests: ['Séries', 'Chocolat', 'Cinéma', 'Sorties'],
    job: 'Infirmière'
  },
  {
    name: 'Zoé', age: 26, city: 'Strasbourg', gender: 'F',
    bio: 'Artiste peintre, amoureuse de l\'art sous toutes ses formes 🎨',
    interests: ['Art', 'Peinture', 'Musées', 'Photographie'],
    job: 'Artiste'
  },
  {
    name: 'Amélie', age: 31, city: 'Rennes', gender: 'F',
    bio: 'Chef cuisinière, la gastronomie est ma passion 👩‍🍳',
    interests: ['Cuisine', 'Gastronomie', 'Vin', 'Voyages'],
    job: 'Chef cuisinière'
  },
  {
    name: 'Julie', age: 27, city: 'Montpellier', gender: 'F',
    bio: 'Développeuse web, geek assumée et fière de l\'être 💻',
    interests: ['Tech', 'Jeux vidéo', 'Manga', 'Café'],
    job: 'Développeuse'
  },

  // Hommes
  {
    name: 'Alexandre', age: 32, city: 'Paris', gender: 'M',
    bio: 'Entrepreneur dans la tech, passionné de sport et de voyages 🚀',
    interests: ['Sport', 'Tech', 'Voyages', 'Startup'],
    job: 'Entrepreneur'
  },
  {
    name: 'Lucas', age: 30, city: 'Lyon', gender: 'M',
    bio: 'Architecte, j\'aime créer et dessiner 📐',
    interests: ['Architecture', 'Design', 'Art', 'Musique'],
    job: 'Architecte'
  },
  {
    name: 'Jules', age: 28, city: 'Bordeaux', gender: 'M',
    bio: 'Sommelier, passionné de vin et de gastronomie 🍷',
    interests: ['Vin', 'Gastronomie', 'Voyages', 'Culture'],
    job: 'Sommelier'
  },
  {
    name: 'Thomas', age: 29, city: 'Toulouse', gender: 'M',
    bio: 'Pilote de ligne, toujours entre deux destinations ✈️',
    interests: ['Voyage', 'Aviation', 'Sport', 'Photographie'],
    job: 'Pilote'
  },
  {
    name: 'Kevin', age: 27, city: 'Marseille', gender: 'M',
    bio: 'Personal trainer, fan de fitness et de healthy food 💪',
    interests: ['Sport', 'Fitness', 'Nutrition', 'Motivation'],
    job: 'Coach sportif'
  },
  {
    name: 'Maxime', age: 33, city: 'Nice', gender: 'M',
    bio: 'Médecin urgentiste, adrénaline au quotidien 🚑',
    interests: ['Médecine', 'Sport', 'Voyages', 'Musique'],
    job: 'Médecin'
  },
  {
    name: 'Antoine', age: 26, city: 'Nantes', gender: 'M',
    bio: 'Musicien, guitariste dans un groupe de rock 🎸',
    interests: ['Musique', 'Rock', 'Concerts', 'Voyages'],
    job: 'Musicien'
  },
  {
    name: 'Julien', age: 31, city: 'Lille', gender: 'M',
    bio: 'Avocat passionné de justice et de débats intellectuels ⚖️',
    interests: ['Droit', 'Politique', 'Lecture', 'Échecs'],
    job: 'Avocat'
  }
];

// Questions par défaut variées
const questionsTemplates = [
  {
    question1: {
      text: "Qu'est-ce qui te fait rire ?",
      answerA: "Les blagues pourries",
      answerB: "Les vidéos d'animaux",
      answerC: "Les situations absurdes",
      correctAnswer: "B"
    },
    question2: {
      text: "Ton plat préféré ?",
      answerA: "Pizza",
      answerB: "Sushi",
      answerC: "Burger",
      correctAnswer: "A"
    },
    question3: {
      text: "Destination de rêve ?",
      answerA: "Japon",
      answerB: "Nouvelle-Zélande",
      answerC: "Islande",
      correctAnswer: "C"
    }
  },
  {
    question1: {
      text: "Ton genre de film préféré ?",
      answerA: "Comédie romantique",
      answerB: "Action",
      answerC: "Thriller psychologique",
      correctAnswer: "A"
    },
    question2: {
      text: "Le matin tu es plutôt ?",
      answerA: "Café noir fort",
      answerB: "Thé vert",
      answerC: "Chocolat chaud",
      correctAnswer: "A"
    },
    question3: {
      text: "Soirée idéale ?",
      answerA: "Netflix & chill",
      answerB: "Restaurant gastronomique",
      answerC: "Concert ou festival",
      correctAnswer: "B"
    }
  }
];

// Générer un avatar aléatoire (config pour avataaars)
function generateRandomAvatar(gender) {
  const skinColors = ['Light', 'Brown', 'DarkBrown', 'Black'];
  const hairColors = ['Auburn', 'Black', 'Blonde', 'Brown', 'BrownDark', 'PastelPink', 'Red'];

  const maleHairTypes = ['ShortHairShortFlat', 'ShortHairShortWaved', 'ShortHairShortCurly', 'ShortHairDreads01'];
  const femaleHairTypes = ['LongHairStraight', 'LongHairCurly', 'LongHairBun', 'LongHairStraight2'];

  const clotheTypes = ['Hoodie', 'BlazerShirt', 'BlazerSweater', 'CollarSweater', 'ShirtCrewNeck'];
  const eyeTypes = ['Default', 'Happy', 'Surprised', 'Side', 'Wink'];

  return {
    avatarStyle: 'Circle',
    topType: gender === 'M' ?
      maleHairTypes[Math.floor(Math.random() * maleHairTypes.length)] :
      femaleHairTypes[Math.floor(Math.random() * femaleHairTypes.length)],
    accessoriesType: 'Blank',
    hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
    facialHairType: gender === 'M' && Math.random() > 0.7 ? 'BeardLight' : 'Blank',
    clotheType: clotheTypes[Math.floor(Math.random() * clotheTypes.length)],
    eyeType: eyeTypes[Math.floor(Math.random() * eyeTypes.length)],
    eyebrowType: 'Default',
    mouthType: 'Smile',
    skinColor: skinColors[Math.floor(Math.random() * skinColors.length)]
  };
}

// Générer des statistiques réalistes
function generateStats() {
  return {
    letters: Math.floor(Math.random() * 50) + 5,
    games: Math.floor(Math.random() * 100) + 10,
    bars: Math.floor(Math.random() * 30) + 3,
    likes_sent: Math.floor(Math.random() * 40) + 5,
    likes_received: Math.floor(Math.random() * 60) + 10,
    matches: Math.floor(Math.random() * 20) + 2,
    messages_sent: Math.floor(Math.random() * 200) + 20
  };
}

// Fonction principale pour initialiser tous les bots
export function initializeAllBots() {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');

  const newBots = botProfiles.map((profile, index) => {
    const email = `${profile.name.toLowerCase()}@bot.jeutaime.com`;

    // Vérifier si ce bot existe déjà
    const existing = users.find(u => u.email === email);
    if (existing) return null;

    const stats = generateStats();
    const questions = questionsTemplates[index % questionsTemplates.length];

    return {
      // Infos de base
      email: email,
      password: 'bot123',
      name: profile.name,
      pseudo: profile.name,
      age: profile.age,
      ville: profile.city,
      city: profile.city,
      genre: profile.gender === 'M' ? 'Homme' : 'Femme',
      gender: profile.gender,

      // Avatar généré
      avatar: generateRandomAvatar(profile.gender),

      // Bio et profil
      bio: profile.bio,
      interests: profile.interests,
      job: profile.job,

      // Questions
      question1: questions.question1,
      question2: questions.question2,
      question3: questions.question3,

      // Système de jeu
      id: 2000 + index,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      coins: Math.floor(Math.random() * 1000) + 200,
      points: stats.games * 5 + stats.bars * 15 + stats.letters * 10,
      premium: Math.random() > 0.8, // 20% premium
      badges: ['bot'],
      stats: stats,

      // Compatibilité
      compatibility: Math.floor(Math.random() * 30) + 70, // 70-100%
      distance: `${Math.floor(Math.random() * 20) + 1} km`,
      lastActive: Math.random() > 0.5 ? 'En ligne' : `Il y a ${Math.floor(Math.random() * 60) + 1} min`,

      // Flags
      isBot: true,
      isOnline: Math.random() > 0.3 // 70% en ligne
    };
  }).filter(bot => bot !== null);

  // Ajouter les bots
  if (newBots.length > 0) {
    const updatedUsers = [...users, ...newBots];
    localStorage.setItem('jeutaime_users', JSON.stringify(updatedUsers));
    console.log(`✅ ${newBots.length} bot(s) créé(s) avec succès!`);
    return newBots;
  }

  console.log('ℹ️ Tous les bots existent déjà');
  return [];
}

// Générer des messages de salon pour les bots
export function generateBarMessages(barId, currentUserEmail) {
  const bots = JSON.parse(localStorage.getItem('jeutaime_users') || '[]')
    .filter(u => u.isBot && u.isOnline);

  if (bots.length === 0) return [];

  const messageTemplates = [
    "Salut tout le monde ! Comment ça va ? 😊",
    "Quelqu'un veut jouer à un jeu ? 🎮",
    "Super ambiance ici ! 🎉",
    "Qui est partant pour un duel ? ⚔️",
    "J'adore cet endroit ! ❤️",
    "Quelqu'un a vu le dernier match ? 🏆",
    "Café ou thé ? ☕🍵",
    "Quelle belle journée ! ☀️",
    "On fait un quiz ensemble ? 🧠",
    "Prêt pour l'aventure ? 🗺️"
  ];

  const messages = [];
  const numMessages = Math.floor(Math.random() * 5) + 3; // 3-7 messages

  for (let i = 0; i < numMessages && i < bots.length; i++) {
    const bot = bots[i];
    const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];

    messages.push({
      id: Date.now() + i,
      barId: barId,
      sender: bot.email,
      senderName: bot.pseudo,
      senderAvatar: bot.avatar,
      message: template,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Dernière heure
      type: 'text'
    });
  }

  return messages;
}

// Générer des likes/matches pour le joueur
export function generateMatchesForUser(userEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const currentUser = users.find(u => u.email === userEmail);
  if (!currentUser) return;

  const bots = users.filter(u => u.isBot && u.isOnline);

  // Générer 3-5 likes reçus
  const numLikes = Math.floor(Math.random() * 3) + 3;
  const likes = [];

  for (let i = 0; i < numLikes && i < bots.length; i++) {
    likes.push({
      from: bots[i].email,
      to: userEmail,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type: 'like'
    });
  }

  // Sauvegarder les likes
  const existingLikes = JSON.parse(localStorage.getItem('jeutaime_likes') || '[]');
  localStorage.setItem('jeutaime_likes', JSON.stringify([...existingLikes, ...likes]));

  console.log(`✅ ${likes.length} like(s) généré(s) pour ${userEmail}`);
}

// Fonction complète d'initialisation
export function setupCompleteTestEnvironment(currentUserEmail) {
  console.log('🚀 Initialisation de l\'environnement de test...');

  // 1. Créer tous les bots
  const bots = initializeAllBots();
  console.log(`✅ ${bots.length} bots créés`);

  // 2. Générer des matches et likes
  if (currentUserEmail) {
    generateMatchesForUser(currentUserEmail);
  }

  console.log('🎉 Environnement de test prêt !');
  return {
    botsCreated: bots.length,
    success: true
  };
}
