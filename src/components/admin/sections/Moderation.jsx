import React, { useState, useEffect } from 'react';
import {
  getAllReports,
  getPendingReports,
  getReportsByStatus,
  getReportStats,
  resolveReport,
  dismissReport
} from '../../../services/moderationService';
import { banUser, warnUser, restrictUser } from '../../../services/userService';
import { logReportResolved, logReportDismissed, logUserBan, logUserWarn, logUserRestrict } from '../../../services/adminLogService';

export default function Moderation() {
  const [filterStatus, setFilterStatus] = useState('pending');
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Charger les données
  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = () => {
    const reportsData = getReportsByStatus(filterStatus);
    const statsData = getReportStats();
    setReports(reportsData);
    setStats(statsData);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleAction = async (action, duration = null, note = '') => {
    if (!selectedReport || actionInProgress) return;

    setActionInProgress(true);

    try {
      const report = selectedReport;

      switch (action) {
        case 'ban':
          banUser(report.reportedUserId, report.reason, note);
          resolveReport(report.id, 'banned', note);
          logUserBan(report.reportedUserId, report.reportedUserName, report.reason);
          logReportResolved(report.id, 'banned');
          alert(`✅ ${report.reportedUserName} a été banni`);
          break;

        case 'restrict':
          restrictUser(report.reportedUserId, report.reason, duration || 7, note);
          resolveReport(report.id, 'restricted', note);
          logUserRestrict(report.reportedUserId, report.reportedUserName, report.reason, duration || 7);
          logReportResolved(report.id, 'restricted');
          alert(`✅ ${report.reportedUserName} a été restreint pour ${duration || 7} jours`);
          break;

        case 'warn':
          warnUser(report.reportedUserId, report.reason, note);
          resolveReport(report.id, 'warned', note);
          logUserWarn(report.reportedUserId, report.reportedUserName, report.reason);
          logReportResolved(report.id, 'warned');
          alert(`✅ ${report.reportedUserName} a reçu un avertissement`);
          break;

        case 'dismiss':
          dismissReport(report.id, note);
          logReportDismissed(report.id);
          alert('✅ Signalement rejeté (aucune action prise)');
          break;

        default:
          break;
      }

      setShowDetailModal(false);
      setSelectedReport(null);
      loadData();
    } catch (error) {
      alert('❌ Erreur lors de l\'action');
      console.error(error);
    } finally {
      setActionInProgress(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#FF9800';
      case 'low': return '#FFD700';
      default: return '#888';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      harassment: '🚫 Harcèlement',
      spam: '📧 Spam',
      inappropriate: '🔞 Contenu inapproprié',
      fake: '🤖 Faux profil',
      scam: '💰 Arnaque',
      other: '❓ Autre'
    };
    return labels[type] || type;
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Modération</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Gérer les signalements et prendre des décisions</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Total signalements</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF9800' }}>{stats.total || 0}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: `2px solid ${stats.pending > 0 ? '#dc3545' : '#333'}` }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>⏰ En attente</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545' }}>{stats.pending || 0}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>🔴 Urgents</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF4444' }}>{stats.high || 0}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>✅ Résolus</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>{stats.resolved || 0}</div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['pending', 'resolved', 'dismissed', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '10px 20px',
              background: filterStatus === status ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#1a1a1a',
              border: filterStatus === status ? '2px solid #667eea' : '1px solid #333',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            {status === 'pending' ? '⏰ En attente' :
             status === 'resolved' ? '✅ Résolus' :
             status === 'dismissed' ? '❌ Rejetés' :
             '📋 Tous'}
          </button>
        ))}
      </div>

      {/* Liste des signalements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {reports.length === 0 ? (
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '40px', textAlign: 'center', border: '1px solid #333' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>Aucun signalement</p>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Tout est calme pour le moment</p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              style={{
                background: '#1a1a1a',
                borderRadius: '15px',
                padding: '20px',
                border: `2px solid ${report.severity === 'high' ? '#dc3545' : '#333'}`,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => handleViewReport(report)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                {/* Sévérité */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: `${getSeverityColor(report.severity)}22`,
                  border: `2px solid ${getSeverityColor(report.severity)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {report.severity === 'high' ? '🔴' : report.severity === 'medium' ? '🟠' : '🟡'}
                </div>

                {/* Contenu */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{getTypeLabel(report.type)}</span>
                    <span style={{
                      padding: '4px 10px',
                      background: '#0a0a0a',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: '#888'
                    }}>
                      {report.reportedUserName}
                    </span>
                    <span style={{ fontSize: '11px', color: '#666' }}>
                      signalé par {report.reportedByName}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#ccc' }}>
                    <strong>Raison :</strong> {report.reason}
                  </p>

                  <p style={{ fontSize: '12px', margin: '0 0 10px 0', color: '#888' }}>
                    {report.content}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '11px', color: '#666' }}>
                    <span>📅 {new Date(report.timestamp).toLocaleString('fr-FR')}</span>
                    {report.screenshots > 0 && <span>📸 {report.screenshots} captures</span>}
                    {report.messageContext && <span>💬 {report.messageContext.length} messages</span>}
                  </div>
                </div>

                {/* Badge statut */}
                {report.status !== 'pending' && (
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: report.status === 'resolved' ? '#4CAF5022' : '#88888822',
                    border: report.status === 'resolved' ? '1px solid #4CAF50' : '1px solid #888',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: report.status === 'resolved' ? '#4CAF50' : '#888'
                  }}>
                    {report.status === 'resolved' ? '✅ Résolu' : '❌ Rejeté'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de détail */}
      {showDetailModal && selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedReport(null);
          }}
          onAction={handleAction}
          actionInProgress={actionInProgress}
        />
      )}
    </div>
  );
}

/**
 * Modal de détail du signalement
 */
function ReportDetailModal({ report, onClose, onAction, actionInProgress }) {
  const [note, setNote] = useState('');
  const [restrictDays, setRestrictDays] = useState(7);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '2px solid #333'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #333' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 10px 0' }}>
            📋 Détails du signalement #{report.id}
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '6px 12px',
              background: report.severity === 'high' ? '#dc354522' : report.severity === 'medium' ? '#FF980022' : '#FFD70022',
              border: `1px solid ${report.severity === 'high' ? '#dc3545' : report.severity === 'medium' ? '#FF9800' : '#FFD700'}`,
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              color: report.severity === 'high' ? '#dc3545' : report.severity === 'medium' ? '#FF9800' : '#FFD700'
            }}>
              {report.severity === 'high' ? '🔴 URGENT' : report.severity === 'medium' ? '🟠 Moyen' : '🟡 Faible'}
            </span>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {new Date(report.timestamp).toLocaleString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Utilisateur signalé</div>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>{report.reportedUserName}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Signalé par</div>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>{report.reportedByName}</div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Raison</div>
            <div style={{ fontSize: '14px' }}>{report.reason}</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Description</div>
            <div style={{ fontSize: '13px', color: '#ccc' }}>{report.content}</div>
          </div>
        </div>

        {/* Contexte messages */}
        {report.messageContext && report.messageContext.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>💬 Contexte de conversation</h3>
            <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '15px', maxHeight: '250px', overflowY: 'auto' }}>
              {report.messageContext.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '10px',
                    padding: '10px',
                    background: msg.from === report.reportedUserName ? '#dc354511' : '#33333311',
                    borderRadius: '8px',
                    borderLeft: msg.from === report.reportedUserName ? '3px solid #dc3545' : '3px solid #666'
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                    <strong>{msg.from}</strong> · {msg.timestamp}
                  </div>
                  <div style={{ fontSize: '13px' }}>{msg.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note admin */}
        {report.status === 'pending' && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' }}>
              📝 Note interne (optionnel)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ajoutez une note pour justifier votre décision..."
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '10px',
                color: 'white',
                fontSize: '13px',
                minHeight: '80px',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* Actions */}
        {report.status === 'pending' ? (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>⚖️ Décision</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
              <button
                onClick={() => onAction('ban', null, note)}
                disabled={actionInProgress}
                style={{
                  padding: '15px',
                  background: 'linear-gradient(135deg, #dc3545, #b02a37)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: actionInProgress ? 'not-allowed' : 'pointer',
                  opacity: actionInProgress ? 0.5 : 1
                }}
              >
                🚫 Bannir (permanent)
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => onAction('restrict', restrictDays, note)}
                  disabled={actionInProgress}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: actionInProgress ? 'not-allowed' : 'pointer',
                    opacity: actionInProgress ? 0.5 : 1
                  }}
                >
                  ⏸️ Restreindre ({restrictDays}j)
                </button>
                <input
                  type="number"
                  value={restrictDays}
                  onChange={(e) => setRestrictDays(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="365"
                  style={{
                    position: 'absolute',
                    bottom: '-25px',
                    left: 0,
                    right: 0,
                    padding: '4px 8px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '11px',
                    textAlign: 'center'
                  }}
                />
              </div>

              <button
                onClick={() => onAction('warn', null, note)}
                disabled={actionInProgress}
                style={{
                  padding: '15px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: actionInProgress ? 'not-allowed' : 'pointer',
                  opacity: actionInProgress ? 0.5 : 1
                }}
              >
                ⚠️ Avertir
              </button>

              <button
                onClick={() => onAction('dismiss', null, note)}
                disabled={actionInProgress}
                style={{
                  padding: '15px',
                  background: '#0a0a0a',
                  border: '2px solid #666',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: actionInProgress ? 'not-allowed' : 'pointer',
                  opacity: actionInProgress ? 0.5 : 1
                }}
              >
                ❌ Rejeter
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: 0 }}>
              {report.status === 'resolved' ? '✅ Ce signalement a été résolu' : '❌ Ce signalement a été rejeté'}
            </p>
            {report.adminNote && (
              <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                Note : {report.adminNote}
              </p>
            )}
          </div>
        )}

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '20px',
            background: '#333',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
