import React, { useState, useEffect } from 'react';
import { getUserStats } from '../../../services/userService';
import { getReportStats, getPendingReports } from '../../../services/moderationService';
import { getLogStats } from '../../../services/adminLogService';

export default function Dashboard() {
  const [userStats, setUserStats] = useState({ total: 0, active: 0, premium: 0, banned: 0, restricted: 0 });
  const [reportStats, setReportStats] = useState({ total: 0, pending: 0, resolved: 0, dismissed: 0, high: 0 });
  const [logStats, setLogStats] = useState({ total: 0, bans: 0, warns: 0, restricts: 0, reportsResolved: 0 });
  const [urgentReports, setUrgentReports] = useState([]);

  useEffect(() => {
    loadData();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setUserStats(getUserStats());
    setReportStats(getReportStats());
    setLogStats(getLogStats(7)); // Stats des 7 derniers jours

    // Charger seulement les signalements haute priorité
    const pending = getPendingReports();
    const urgent = pending.filter(r => r.severity === 'high').slice(0, 5);
    setUrgentReports(urgent);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  const navigateToModeration = () => {
    // L'utilisateur peut cliquer sur l'onglet Modération manuellement
    // On pourrait implémenter une navigation programmatique mais pour le MVP on reste simple
    alert('Veuillez cliquer sur l\'onglet "Modération" pour voir tous les signalements');
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Dashboard Admin</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
          Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
        </p>
      </div>

      {/* Alertes urgentes */}
      {urgentReports.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #dc354522 0%, #dc354511 100%)',
          borderRadius: '15px',
          padding: '20px',
          border: '2px solid #dc3545',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#dc3545', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🚨 Alertes urgentes ({urgentReports.length})
            </h2>
            <button
              onClick={navigateToModeration}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Voir tout →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {urgentReports.map(report => (
              <div
                key={report.id}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  padding: '15px',
                  border: '1px solid #dc3545'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: '#dc3545',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      URGENT
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {report.type === 'harassment' ? '😡 Harcèlement' :
                       report.type === 'spam' ? '📧 Spam' :
                       report.type === 'inappropriate' ? '🔞 Contenu inapproprié' :
                       report.type === 'fake' ? '🎭 Faux profil' :
                       '⚠️ Autre'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#888' }}>
                    {formatTimeAgo(report.timestamp)}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '8px' }}>
                  <strong>{report.reportedUserName}</strong> signalé par <strong>{report.reportedByName}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {report.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>👥 Utilisateurs</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>{userStats.total}</div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>{userStats.active} actifs</div>
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>⚠️ Signalements en attente</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: reportStats.pending > 0 ? '#FF9800' : '#4CAF50' }}>
            {reportStats.pending}
          </div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
            {reportStats.high} prioritaire{reportStats.high > 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>🚫 Bannis</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545' }}>{userStats.banned}</div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>{userStats.restricted} restreints</div>
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>👑 Premium</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFD700' }}>{userStats.premium}</div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
            {userStats.total > 0 ? Math.round((userStats.premium / userStats.total) * 100) : 0}% du total
          </div>
        </div>
      </div>

      {/* Stats d'activité admin (7 derniers jours) */}
      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 15px 0' }}>
          📊 Activité admin (7 derniers jours)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '12px', background: '#0a0a0a', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Total actions</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#667eea' }}>{logStats.total}</div>
          </div>
          <div style={{ padding: '12px', background: '#0a0a0a', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Bans</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#dc3545' }}>{logStats.bans}</div>
          </div>
          <div style={{ padding: '12px', background: '#0a0a0a', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Restrictions</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#FF9800' }}>{logStats.restricts}</div>
          </div>
          <div style={{ padding: '12px', background: '#0a0a0a', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Avertissements</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#FFD700' }}>{logStats.warns}</div>
          </div>
          <div style={{ padding: '12px', background: '#0a0a0a', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Reports résolus</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#4CAF50' }}>{logStats.reportsResolved}</div>
          </div>
        </div>
      </div>

      {/* Vue d'ensemble des signalements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 15px 0' }}>
            📋 État des signalements
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0a0a0a', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', color: '#888' }}>Total</div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>{reportStats.total}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#FF980011', borderRadius: '8px', border: '1px solid #FF980033' }}>
              <div style={{ fontSize: '13px', color: '#FF9800' }}>En attente</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#FF9800' }}>{reportStats.pending}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#4CAF5011', borderRadius: '8px', border: '1px solid #4CAF5033' }}>
              <div style={{ fontSize: '13px', color: '#4CAF50' }}>Résolus</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#4CAF50' }}>{reportStats.resolved}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0a0a0a', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', color: '#666' }}>Rejetés</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#666' }}>{reportStats.dismissed}</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 15px 0' }}>
            🔗 Actions rapides
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={navigateToModeration}
              style={{
                padding: '15px',
                background: reportStats.pending > 0 ? '#FF9800' : '#667eea',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>⚠️ Queue de modération</span>
              {reportStats.pending > 0 && (
                <span style={{
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {reportStats.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => alert('Veuillez cliquer sur l\'onglet "Utilisateurs"')}
              style={{
                padding: '15px',
                background: '#667eea',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              👥 Gestion des utilisateurs
            </button>

            <button
              onClick={() => alert('Veuillez cliquer sur l\'onglet "Logs"')}
              style={{
                padding: '15px',
                background: '#667eea',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              📋 Journal d'activité
            </button>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: '#0a0a0a', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>💡 Conseil</div>
            <div style={{ fontSize: '12px', color: '#ccc' }}>
              {reportStats.high > 0
                ? `Vous avez ${reportStats.high} signalement${reportStats.high > 1 ? 's' : ''} prioritaire${reportStats.high > 1 ? 's' : ''} à traiter.`
                : reportStats.pending > 0
                ? `${reportStats.pending} signalement${reportStats.pending > 1 ? 's' : ''} en attente de traitement.`
                : 'Aucun signalement en attente. Tout est sous contrôle !'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
