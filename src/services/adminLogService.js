/**
 * ADMIN LOG SERVICE
 *
 * Journal des actions admin pour traçabilité et sécurité.
 */

const LOGS_KEY = 'jeutaime_admin_logs';

/**
 * Récupère tous les logs
 */
export function getAllLogs() {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Récupère les logs filtrés
 */
export function getLogsByType(type) {
  const logs = getAllLogs();
  return type === 'all'
    ? logs
    : logs.filter(l => l.type === type);
}

/**
 * Récupère les logs d'un admin
 */
export function getLogsByAdmin(adminId) {
  const logs = getAllLogs();
  return logs.filter(l => l.adminId === adminId);
}

/**
 * Récupère les logs concernant un utilisateur
 */
export function getLogsByUser(userId) {
  const logs = getAllLogs();
  return logs.filter(l => l.targetUserId === userId);
}

/**
 * Crée un nouveau log
 */
export function createLog(logData) {
  const logs = getAllLogs();

  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    adminId: 'admin', // TODO: utiliser le vrai admin ID
    ...logData
  };

  logs.unshift(newLog); // Ajoute en début de tableau (plus récent en premier)
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  return newLog;
}

/**
 * Types de logs pré-définis
 */

export function logUserBan(userId, userName, reason) {
  return createLog({
    type: 'user_ban',
    action: 'Utilisateur banni',
    targetUserId: userId,
    targetUserName: userName,
    details: reason
  });
}

export function logUserWarn(userId, userName, reason) {
  return createLog({
    type: 'user_warn',
    action: 'Utilisateur averti',
    targetUserId: userId,
    targetUserName: userName,
    details: reason
  });
}

export function logUserRestrict(userId, userName, reason, durationDays) {
  return createLog({
    type: 'user_restrict',
    action: `Utilisateur restreint (${durationDays} jours)`,
    targetUserId: userId,
    targetUserName: userName,
    details: reason
  });
}

export function logSanctionRemoved(userId, userName, sanctionType) {
  return createLog({
    type: 'sanction_removed',
    action: 'Sanction levée',
    targetUserId: userId,
    targetUserName: userName,
    details: `Type: ${sanctionType}`
  });
}

export function logReportResolved(reportId, decision) {
  return createLog({
    type: 'report_resolved',
    action: 'Signalement résolu',
    details: `Décision: ${decision}`,
    reportId
  });
}

export function logReportDismissed(reportId) {
  return createLog({
    type: 'report_dismissed',
    action: 'Signalement rejeté',
    reportId
  });
}

/**
 * Stats des logs
 */
export function getLogStats(days = 7) {
  const logs = getAllLogs();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentLogs = logs.filter(l => new Date(l.timestamp) > cutoff);

  return {
    total: recentLogs.length,
    bans: recentLogs.filter(l => l.type === 'user_ban').length,
    warns: recentLogs.filter(l => l.type === 'user_warn').length,
    restricts: recentLogs.filter(l => l.type === 'user_restrict').length,
    reportsResolved: recentLogs.filter(l => l.type === 'report_resolved').length
  };
}
