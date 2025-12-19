/**
 * Système d'onboarding progressif - STRICT
 * Jour 0-3 : Débloque progressivement les features
 */

/**
 * Récupère le jour actuel de l'utilisateur (0-3+)
 */
export function getUserDay(userEmail) {
  if (!userEmail) return 0;

  const key = `jeutaime_user_day_${userEmail}`;
  const data = localStorage.getItem(key);

  if (!data) {
    // Premier jour = Jour 0
    const startData = {
      currentDay: 0,
      startDate: new Date().toISOString(),
      lastCheck: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(startData));
    return 0;
  }

  const parsed = JSON.parse(data);
  const startDate = new Date(parsed.startDate);
  const now = new Date();

  // Calculer le nombre de jours écoulés
  const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

  // Maximum Jour 3
  const currentDay = Math.min(daysPassed, 3);

  // Mettre à jour si changement
  if (currentDay !== parsed.currentDay) {
    parsed.currentDay = currentDay;
    parsed.lastCheck = now.toISOString();
    localStorage.setItem(key, JSON.stringify(parsed));
  }

  return currentDay;
}

/**
 * Force le passage au jour suivant (pour tests)
 */
export function advanceUserDay(userEmail) {
  if (!userEmail) return 0;

  const key = `jeutaime_user_day_${userEmail}`;
  const data = localStorage.getItem(key);

  if (!data) return 0;

  const parsed = JSON.parse(data);
  const newDay = Math.min(parsed.currentDay + 1, 3);

  parsed.currentDay = newDay;
  parsed.lastCheck = new Date().toISOString();
  localStorage.setItem(key, JSON.stringify(parsed));

  return newDay;
}

/**
 * Vérifie si une feature est débloquée selon le jour
 */
export function isFeatureUnlocked(userEmail, feature) {
  const day = getUserDay(userEmail);

  const features = {
    // JOUR 0 - Arrivée (LETTRES dès le début)
    'letters': 0,
    'profiles_basic': 0,
    'profile_creation': 0,
    'one_salon': 0,
    'animal_preview': 0,

    // JOUR 1 - Immersion
    'smiles_grimaces': 1,
    'points_levels': 1,
    'animal_adoption': 1,
    'matches': 1,

    // JOUR 2 - Engagement
    'badges': 2,
    'mini_games': 2,
    'multiple_salons': 2,
    'gifts': 2,

    // JOUR 3 - Profondeur
    'magic_spells': 3,
    'duels': 3,
    'animal_incarnation': 3,
    'advanced_progression': 3
  };

  const requiredDay = features[feature];

  if (requiredDay === undefined) {
    console.warn(`Feature inconnue: ${feature}`);
    return true; // Par défaut, débloqué
  }

  return day >= requiredDay;
}

/**
 * Récupère la liste des salons accessibles selon le jour
 */
export function getAccessibleSalons(userEmail, allSalons) {
  const day = getUserDay(userEmail);

  if (day === 0) {
    // Jour 0 : 1 seul salon (le premier)
    return allSalons.slice(0, 1);
  }

  // Jour 1+ : Tous les salons
  return allSalons;
}

/**
 * Récupère le message d'onboarding selon le jour
 */
export function getOnboardingMessage(day) {
  const messages = {
    0: {
      title: '🌟 Bienvenue !',
      message: 'Découvre les bases : crée ton profil et envoie tes premières lettres !',
      features: ['💌 Lettres', '👤 Profils', '🏛️ 1 Salon']
    },
    1: {
      title: '✨ Jour 1 - Nouveautés débloquées !',
      message: 'Tu peux maintenant sourire, matcher et adopter ton premier animal !',
      features: ['😊 Sourires & Grimaces', '🎯 Matches', '🐾 Adoption animal', '⭐ Points & Niveaux']
    },
    2: {
      title: '🚀 Jour 2 - Encore plus !',
      message: 'Mini-jeux, badges, salons supplémentaires et cadeaux t\'attendent !',
      features: ['🏆 Badges', '🎮 Mini-jeux', '🏛️ Plus de salons', '🎁 Cadeaux']
    },
    3: {
      title: '🔥 Jour 3 - Tout débloqué !',
      message: 'Magie, duels, incarnation... Toutes les fonctionnalités sont accessibles !',
      features: ['🔮 Magie & Sorts', '⚔️ Duels', '🎭 Incarnation animale']
    }
  };

  return messages[day] || messages[3];
}
