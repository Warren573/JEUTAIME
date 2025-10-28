// Système de sorts ciblés avec transformations et désenvoutement

export const targetedSpells = {
  frog: {
    id: 'frog',
    name: 'Grenouille',
    icon: '🐸',
    color: '#4CAF50',
    cost: 50,
    duration: 24 * 60 * 60 * 1000, // 24 heures
    description: 'Transforme l\'avatar en grenouille',
    effect: 'transform',
    transformation: {
      overlay: '🐸',
      badge: 'Ensorcelé(e) !',
      avatarFilter: 'hue-rotate(120deg) saturate(2)',
    },
    curse: {
      type: 'visual',
      message: '💚 Tu as été transformé(e) en grenouille ! Seul un bisou 💋 peut te sauver...'
    },
    removeCondition: {
      type: 'action',
      action: 'kiss',
      actionLabel: 'Embrasser 💋',
      successMessage: '💋 Le sort est brisé ! Tu redeviens normal(e) !',
      description: 'Quelqu\'un doit t\'embrasser pour te désenvoutement'
    }
  },

  unicorn: {
    id: 'unicorn',
    name: 'Licorne',
    icon: '🦄',
    color: '#E91E63',
    cost: 60,
    duration: 12 * 60 * 60 * 1000, // 12 heures
    description: 'Transforme en licorne magique',
    effect: 'transform',
    transformation: {
      overlay: '🦄',
      badge: 'Licornifié(e) !',
      avatarFilter: 'hue-rotate(300deg) saturate(2) brightness(1.2)',
    },
    curse: {
      type: 'visual',
      message: '🦄 Tu es devenu(e) une licorne magique ! Un câlin 🤗 te sauvera !'
    },
    removeCondition: {
      type: 'action',
      action: 'hug',
      actionLabel: 'Faire un câlin 🤗',
      successMessage: '🤗 La magie s\'estompe ! Tu redeviens toi-même !',
      description: 'Quelqu\'un doit te faire un câlin'
    }
  },

  ghost: {
    id: 'ghost',
    name: 'Fantôme',
    icon: '👻',
    color: '#9E9E9E',
    cost: 70,
    duration: 6 * 60 * 60 * 1000, // 6 heures
    description: 'Rend le profil transparent',
    effect: 'transform',
    transformation: {
      overlay: '👻',
      badge: 'Fantomatique',
      avatarFilter: 'opacity(0.4) grayscale(1)',
    },
    curse: {
      type: 'visibility',
      message: '👻 Tu es devenu(e) un fantôme ! Besoin d\'attention 👀 pour réapparaître !'
    },
    removeCondition: {
      type: 'action',
      action: 'attention',
      actionLabel: 'Donner de l\'attention 👀',
      successMessage: '👀 Tu redeviens visible ! Le sort est levé !',
      description: 'Quelqu\'un doit te donner de l\'attention'
    }
  },

  pig: {
    id: 'pig',
    name: 'Cochon',
    icon: '🐷',
    color: '#FF9800',
    cost: 40,
    duration: 8 * 60 * 60 * 1000, // 8 heures
    description: 'Transforme en petit cochon',
    effect: 'transform',
    transformation: {
      overlay: '🐷',
      badge: 'Oink oink !',
      avatarFilter: 'hue-rotate(30deg) saturate(1.5)',
    },
    curse: {
      type: 'visual',
      message: '🐷 Tu as été transformé(e) en cochon ! Un compliment 🌹 te libérera !'
    },
    removeCondition: {
      type: 'action',
      action: 'compliment',
      actionLabel: 'Faire un compliment 🌹',
      successMessage: '🌹 Merci ! Le charme est rompu !',
      description: 'Quelqu\'un doit te complimenter'
    }
  },

  bat: {
    id: 'bat',
    name: 'Chauve-souris',
    icon: '🦇',
    color: '#5E35B1',
    cost: 80,
    duration: 6 * 60 * 60 * 1000, // 6 heures
    description: 'Transforme en chauve-souris nocturne',
    effect: 'transform',
    transformation: {
      overlay: '🦇',
      badge: 'Nocturne',
      avatarFilter: 'invert(1) hue-rotate(180deg)',
    },
    curse: {
      type: 'visual',
      message: '🦇 Tu es une chauve-souris ! Attends 6h ou trouve la lumière ☀️ du jour !'
    },
    removeCondition: {
      type: 'time',
      hours: 6,
      actionLabel: 'Lumière du jour ☀️',
      successMessage: '☀️ Le soleil te libère ! Tu redeviens normal(e) !',
      description: 'Attendre 6 heures ou recevoir la lumière du jour'
    }
  },

  cupid: {
    id: 'cupid',
    name: 'Flèche de Cupidon',
    icon: '💘',
    color: '#E91E63',
    cost: 100,
    duration: 4 * 60 * 60 * 1000, // 4 heures
    description: 'Force à envoyer un message romantique',
    effect: 'behavior',
    transformation: {
      overlay: '💘',
      badge: 'Ensorcelé d\'amour',
      avatarFilter: 'hue-rotate(330deg) saturate(2) contrast(1.2)',
    },
    curse: {
      type: 'forced_action',
      message: '💘 Tu es sous le charme de Cupidon ! Tu DOIS envoyer un message romantique !',
      forcedAction: 'romantic_message'
    },
    removeCondition: {
      type: 'action',
      action: 'refuse',
      actionLabel: 'Refuser sentiment ❌',
      successMessage: '❌ Le charme est brisé ! Tu es libre !',
      description: 'Quelqu\'un doit refuser tes avances'
    }
  },

  frozen: {
    id: 'frozen',
    name: 'Congelé',
    icon: '❄️',
    color: '#03A9F4',
    cost: 75,
    duration: 3 * 60 * 60 * 1000, // 3 heures
    description: 'Empêche d\'envoyer des messages',
    effect: 'restriction',
    transformation: {
      overlay: '❄️',
      badge: 'Congelé(e)',
      avatarFilter: 'hue-rotate(180deg) saturate(0.5) brightness(1.3)',
    },
    curse: {
      type: 'chat_blocked',
      message: '❄️ Tu es congelé(e) ! Impossible d\'écrire ! Besoin de chaleur 🔥 !'
    },
    removeCondition: {
      type: 'action',
      action: 'warmth',
      actionLabel: 'Réchauffer 🔥',
      successMessage: '🔥 La glace fond ! Tu peux à nouveau parler !',
      description: 'Quelqu\'un doit te réchauffer'
    }
  },

  fire: {
    id: 'fire',
    name: 'Enflammé',
    icon: '🔥',
    color: '#FF5722',
    cost: 60,
    duration: 2 * 60 * 60 * 1000, // 2 heures
    description: 'Tous les messages en MAJUSCULES',
    effect: 'behavior',
    transformation: {
      overlay: '🔥',
      badge: 'EN FEU !',
      avatarFilter: 'hue-rotate(0deg) saturate(3) brightness(1.2)',
    },
    curse: {
      type: 'text_transform',
      message: '🔥 TU ES EN FEU ! TOUS TES MESSAGES SONT EN MAJUSCULES ! BESOIN D\'EAU 💧 !',
      transform: 'uppercase'
    },
    removeCondition: {
      type: 'action',
      action: 'water',
      actionLabel: 'Arroser 💧',
      successMessage: '💧 Les flammes sont éteintes ! Tu parles normalement !',
      description: 'Quelqu\'un doit t\'arroser'
    }
  },

  star: {
    id: 'star',
    name: 'Starification',
    icon: '⭐',
    color: '#FFC107',
    cost: 90,
    duration: 12 * 60 * 60 * 1000, // 12 heures
    description: 'Profil mis en avant partout',
    effect: 'visibility',
    transformation: {
      overlay: '⭐',
      badge: '⭐ STAR ⭐',
      avatarFilter: 'brightness(1.3) saturate(1.5)',
    },
    curse: {
      type: 'visibility_boost',
      message: '⭐ Tu es une STAR ! Ton profil est partout ! Demande l\'anonymat pour te cacher !'
    },
    removeCondition: {
      type: 'action',
      action: 'anonymity',
      actionLabel: 'Demander anonymat 🕶️',
      successMessage: '🕶️ Tu retournes dans l\'ombre ! Discrétion retrouvée !',
      description: 'Quelqu\'un doit te rendre anonyme'
    }
  },

  sleep: {
    id: 'sleep',
    name: 'Sommeil',
    icon: '🌙',
    color: '#5C6BC0',
    cost: 50,
    duration: 2 * 60 * 60 * 1000, // 2 heures
    description: 'Profil grisé et inactif',
    effect: 'restriction',
    transformation: {
      overlay: '🌙',
      badge: 'Zzz...',
      avatarFilter: 'grayscale(1) brightness(0.6)',
    },
    curse: {
      type: 'inactive',
      message: '🌙 Tu dors profondément ! Quelqu\'un doit te réveiller avec un café ☕ !'
    },
    removeCondition: {
      type: 'action',
      action: 'wakeup',
      actionLabel: 'Réveiller ☕',
      successMessage: '☕ Tu te réveilles ! Bonjour le monde !',
      description: 'Quelqu\'un doit te réveiller avec un café'
    }
  }
};

// Fonction pour appliquer un sort à un utilisateur
export function applySpell(spellId, targetEmail, casterEmail, casterPseudo) {
  const spell = targetedSpells[spellId];
  if (!spell) return { success: false, error: 'Sort inconnu' };

  // Récupérer le profil cible
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const targetIndex = users.findIndex(u => u.email === targetEmail);

  if (targetIndex === -1) {
    return { success: false, error: 'Utilisateur introuvable' };
  }

  // Créer l'enchantement
  const enchantment = {
    spellId: spell.id,
    caster: casterEmail,
    casterPseudo: casterPseudo,
    appliedAt: Date.now(),
    expiresAt: Date.now() + spell.duration,
    active: true
  };

  // Appliquer l'enchantement
  if (!users[targetIndex].activeSpells) {
    users[targetIndex].activeSpells = [];
  }
  users[targetIndex].activeSpells.push(enchantment);

  // Sauvegarder
  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  return {
    success: true,
    message: `${spell.icon} Sort "${spell.name}" lancé sur ${users[targetIndex].pseudo} !`,
    enchantment
  };
}

// Fonction pour retirer un sort
export function removeSpell(targetEmail, spellId, removerEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const targetIndex = users.findIndex(u => u.email === targetEmail);

  if (targetIndex === -1) return { success: false };

  if (!users[targetIndex].activeSpells) {
    return { success: false };
  }

  // Trouver et retirer le sort
  const spellIndex = users[targetIndex].activeSpells.findIndex(s => s.spellId === spellId && s.active);

  if (spellIndex === -1) {
    return { success: false };
  }

  users[targetIndex].activeSpells[spellIndex].active = false;
  users[targetIndex].activeSpells[spellIndex].removedAt = Date.now();
  users[targetIndex].activeSpells[spellIndex].remover = removerEmail;

  localStorage.setItem('jeutaime_users', JSON.stringify(users));

  const spell = targetedSpells[spellId];
  return {
    success: true,
    message: spell.removeCondition.successMessage
  };
}

// Fonction pour obtenir les sorts actifs d'un utilisateur
export function getActiveSpells(userEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  const user = users.find(u => u.email === userEmail);

  if (!user || !user.activeSpells) return [];

  const now = Date.now();

  // Filtrer les sorts expirés
  const activeSpells = user.activeSpells.filter(spell => {
    return spell.active && spell.expiresAt > now;
  });

  // Auto-nettoyer les sorts expirés
  if (activeSpells.length !== user.activeSpells.length) {
    user.activeSpells = activeSpells;
    const userIndex = users.findIndex(u => u.email === userEmail);
    users[userIndex] = user;
    localStorage.setItem('jeutaime_users', JSON.stringify(users));
  }

  return activeSpells.map(spell => ({
    ...spell,
    spellData: targetedSpells[spell.spellId]
  }));
}

// Fonction pour vérifier si un sort est actif
export function hasActiveSpell(userEmail, spellId) {
  const activeSpells = getActiveSpells(userEmail);
  return activeSpells.some(s => s.spellId === spellId);
}

// Fonction pour obtenir tous les utilisateurs disponibles pour cibler
export function getAvailableTargets(currentUserEmail) {
  const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
  return users
    .filter(u => u.email !== currentUserEmail && u.pseudo)
    .map(u => ({
      email: u.email,
      pseudo: u.pseudo,
      activeSpells: getActiveSpells(u.email)
    }));
}
