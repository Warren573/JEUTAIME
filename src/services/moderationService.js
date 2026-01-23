/**
 * MODERATION SERVICE
 *
 * Gère les signalements et la modération.
 * Architecture backend-ready : toute la logique est ici, pas dans les composants.
 */

const STORAGE_KEY = 'jeutaime_reports';

/**
 * Récupère tous les signalements
 */
export function getAllReports() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : getInitialReports();
}

/**
 * Récupère un signalement par ID
 */
export function getReportById(id) {
  const reports = getAllReports();
  return reports.find(r => r.id === id);
}

/**
 * Récupère les signalements filtrés par statut
 */
export function getReportsByStatus(status) {
  const reports = getAllReports();
  return status === 'all'
    ? reports
    : reports.filter(r => r.status === status);
}

/**
 * Récupère les signalements en attente (priorité)
 */
export function getPendingReports() {
  const reports = getAllReports();
  return reports
    .filter(r => r.status === 'pending')
    .sort((a, b) => {
      // Tri par sévérité puis par date
      const severityOrder = { high: 0, medium: 1, low: 2 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
}

/**
 * Compte les signalements par statut
 */
export function getReportStats() {
  const reports = getAllReports();
  return {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length,
    high: reports.filter(r => r.severity === 'high' && r.status === 'pending').length
  };
}

/**
 * Met à jour un signalement
 */
export function updateReport(id, updates) {
  const reports = getAllReports();
  const index = reports.findIndex(r => r.id === id);

  if (index === -1) return false;

  reports[index] = {
    ...reports[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return reports[index];
}

/**
 * Résout un signalement avec une décision admin
 */
export function resolveReport(id, decision, adminNote = '') {
  return updateReport(id, {
    status: 'resolved',
    decision,
    adminNote,
    resolvedBy: 'admin', // TODO: utiliser le vrai admin ID
    resolvedAt: new Date().toISOString()
  });
}

/**
 * Rejette un signalement (pas de sanction)
 */
export function dismissReport(id, adminNote = '') {
  return updateReport(id, {
    status: 'dismissed',
    adminNote,
    resolvedBy: 'admin',
    resolvedAt: new Date().toISOString()
  });
}

/**
 * Crée un nouveau signalement
 */
export function createReport(reportData) {
  const reports = getAllReports();
  const newReport = {
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...reportData
  };

  reports.push(newReport);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return newReport;
}

/**
 * Données initiales pour le MVP
 */
function getInitialReports() {
  const initial = [
    {
      id: 1,
      type: 'harassment',
      reportedUserId: '102',
      reportedUserName: 'BadUser123',
      reportedByUserId: '1',
      reportedByName: 'Sophie_Paris',
      reason: 'Messages inappropriés et insistants',
      content: 'Envoie des messages répétitifs et dérangeants malgré les refus',
      status: 'pending',
      severity: 'high',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      screenshots: 3,
      messageContext: [
        { from: 'BadUser123', text: 'Salut ma belle', timestamp: '14:00' },
        { from: 'Sophie_Paris', text: 'Bonjour', timestamp: '14:01' },
        { from: 'BadUser123', text: 'Tu fais quoi ce soir ?', timestamp: '14:01' },
        { from: 'Sophie_Paris', text: 'Je suis occupée désolée', timestamp: '14:05' },
        { from: 'BadUser123', text: 'Allez juste un verre', timestamp: '14:05' },
        { from: 'Sophie_Paris', text: 'Non merci', timestamp: '14:10' },
        { from: 'BadUser123', text: 'Tu te la pètes ou quoi', timestamp: '14:11' },
        { from: 'BadUser123', text: 'Réponds moi', timestamp: '14:15' },
        { from: 'BadUser123', text: 'Salut ?', timestamp: '14:20' }
      ]
    },
    {
      id: 2,
      type: 'spam',
      reportedUserId: '103',
      reportedUserName: 'Promo_King',
      reportedByUserId: '5',
      reportedByName: 'MaxCoeur',
      reason: 'Spam publicitaire',
      content: 'Envoie des liens vers des sites externes de rencontre',
      status: 'pending',
      severity: 'medium',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      screenshots: 1,
      messageContext: [
        { from: 'Promo_King', text: 'Hey! Regarde ce site génial pour les rencontres', timestamp: '13:00' },
        { from: 'Promo_King', text: 'www.fake-dating-site.com', timestamp: '13:00' },
        { from: 'Promo_King', text: 'Code promo: LOVE2024', timestamp: '13:01' }
      ]
    },
    {
      id: 3,
      type: 'inappropriate',
      reportedUserId: '104',
      reportedUserName: 'WeirdGuy',
      reportedByUserId: '3',
      reportedByName: 'Emma_Lyon',
      reason: 'Contenu explicite non sollicité',
      content: 'Photo de profil inappropriée',
      status: 'pending',
      severity: 'high',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      screenshots: 2,
      messageContext: [
        { from: 'WeirdGuy', text: 'Salut', timestamp: '12:00' },
        { from: 'Emma_Lyon', text: 'Bonjour', timestamp: '12:05' },
        { from: 'WeirdGuy', text: '[Photo inappropriée envoyée]', timestamp: '12:06' }
      ]
    }
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}
