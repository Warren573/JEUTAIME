// Système de gestion des publicités au lancement
const AD_KEY = 'jeutaime_last_ad_shown';
const AD_COOLDOWN = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

/**
 * Vérifier si l'utilisateur doit voir une publicité
 * @returns {boolean} true si l'utilisateur doit voir une pub, false sinon
 */
export function shouldShowAd() {
  const lastAdShown = localStorage.getItem(AD_KEY);

  if (!lastAdShown) {
    return true; // Première visite
  }

  const lastAdTime = parseInt(lastAdShown, 10);
  const now = Date.now();
  const timeSinceLastAd = now - lastAdTime;

  return timeSinceLastAd >= AD_COOLDOWN;
}

/**
 * Marquer qu'une publicité a été montrée
 */
export function markAdAsShown() {
  localStorage.setItem(AD_KEY, Date.now().toString());
}

/**
 * Obtenir le temps restant avant la prochaine pub (pour debug)
 * @returns {number} Temps en millisecondes avant la prochaine pub
 */
export function getTimeUntilNextAd() {
  const lastAdShown = localStorage.getItem(AD_KEY);

  if (!lastAdShown) {
    return 0; // Peut voir une pub maintenant
  }

  const lastAdTime = parseInt(lastAdShown, 10);
  const now = Date.now();
  const timeSinceLastAd = now - lastAdTime;
  const timeRemaining = AD_COOLDOWN - timeSinceLastAd;

  return Math.max(0, timeRemaining);
}

/**
 * Obtenir une publicité aléatoire parmi la liste disponible
 * @returns {object} Objet contenant les informations de la pub
 */
export function getRandomAd() {
  const ads = [
    {
      id: 'premium_features',
      title: '👑 Découvre Premium',
      message: 'Débloque toutes les fonctionnalités exclusives !',
      emoji: '✨',
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      duration: 5000
    },
    {
      id: 'invite_friends',
      title: '🎁 Parraine des amis',
      message: 'Gagne 50 pièces par ami invité !',
      emoji: '🤝',
      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
      duration: 5000
    },
    {
      id: 'new_games',
      title: '🎮 Nouveaux jeux',
      message: 'Bataille navale et Pierre-Feuille-Ciseaux disponibles !',
      emoji: '⚓',
      background: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)',
      duration: 5000
    },
    {
      id: 'daily_bonus',
      title: '🔥 Bonus quotidien',
      message: 'Connecte-toi chaque jour pour gagner des points !',
      emoji: '💰',
      background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
      duration: 5000
    },
    {
      id: 'collaborations',
      title: '🤝 Collaborations',
      message: 'Participe aux événements éphémères entre bars !',
      emoji: '🎉',
      background: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)',
      duration: 5000
    }
  ];

  return ads[Math.floor(Math.random() * ads.length)];
}
