import React, { useState } from 'react';

export default function Moderation() {
  const [filterType, setFilterType] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    {
      id: 1,
      type: 'harassment',
      reportedUser: 'BadUser123',
      reportedBy: 'Sophie_Paris',
      reason: 'Messages inappropriés et insistants',
      content: 'Envoie des messages répétitifs et dérangeants malgré les refus',
      status: 'pending',
      severity: 'high',
      timestamp: '2024-10-25 14:23',
      screenshots: 3
    },
    {
      id: 2,
      type: 'spam',
      reportedUser: 'Promo_King',
      reportedBy: 'MaxCoeur',
      reason: 'Spam publicitaire',
      content: 'Envoie des liens vers des sites externes de rencontre',
      status: 'pending',
      severity: 'medium',
      timestamp: '2024-10-25 13:45',
      screenshots: 1
    },
    {
      id: 3,
      type: 'inappropriate',
      reportedUser: 'WeirdGuy',
      reportedBy: 'Emma_Lyon',
      reason: 'Contenu explicite non sollicité',
      content: 'Photo de profil inappropriée',
      status: 'pending',
      severity: 'high',
      timestamp: '2024-10-25 12:10',
      screenshots: 2
    },
    {
      id: 4,
      type: 'fake',
      reportedUser: 'FakeProfile99',
      reportedBy: 'Thomas_92',
      reason: 'Faux profil / Bot',
      content: 'Profil suspect avec photos volées',
      status: 'resolved',
      severity: 'medium',
      timestamp: '2024-10-25 10:30',
      screenshots: 4,
      action: 'banned',
      resolvedBy: 'admin'
    },
    {
      id: 5,
      type: 'scam',
      reportedUser: 'MoneyHunter',
      reportedBy: 'LoveSeeker',
      reason: 'Tentative d\'arnaque',
      content: 'Demande d\'argent avec histoire inventée',
      status: 'resolved',
      severity: 'high',
      timestamp: '2024-10-25 09:15',
      screenshots: 5,
      action: 'banned',
      resolvedBy: 'admin'
    },
    {
      id: 6,
      type: 'harassment',
      reportedUser: 'AnnoyingDude',
      reportedBy: 'Julie_Nice',
      reason: 'Harcèlement verbal',
      content: 'Insultes dans le Salon Romantique',
      status: 'investigating',
      severity: 'medium',
      timestamp: '2024-10-25 08:50',
      screenshots: 2
    }
  ];

  const stats = {
    pending: reports.filter(r => r.status === 'pending').length,
    investigating: reports.filter(r => r.status === 'investigating').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    total: reports.length
  };

  const getTypeLabel = (type) => {
    const labels = {
      harassment: 'Harcèlement',
      spam: 'Spam',
      inappropriate: 'Contenu inapproprié',
      fake: 'Faux profil',
      scam: 'Arnaque'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      harassment: '⚠️',
      spam: '📧',
      inappropriate: '🔞',
      fake: '🎭',
      scam: '💸'
    };
    return icons[type] || '📝';
  };

  const getTypeColor = (type) => {
    const colors = {
      harassment: '#E91E63',
      spam: '#FF9800',
      inappropriate: '#dc3545',
      fake: '#9C27B0',
      scam: '#F44336'
    };
    return colors[type] || '#666';
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FF9800';
      case 'investigating': return '#2196F3';
      case 'resolved': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      investigating: 'En cours',
      resolved: 'Résolu'
    };
    return labels[status] || status;
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleAction = (reportId, action) => {
    console.log(`Action ${action} sur le rapport ${reportId}`);
  };

  const filteredReports = filterType === 'all'
    ? reports
    : reports.filter(r => r.type === filterType);

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Modération</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Gérer les signalements et actions de modération</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Total signalements</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>{stats.total}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>En attente</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF9800' }}>{stats.pending}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>En cours</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2196F3' }}>{stats.investigating}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Résolus</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>{stats.resolved}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterType('all')}
          style={{
            padding: '10px 20px',
            background: filterType === 'all' ? '#667eea' : '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Tous
        </button>
        <button
          onClick={() => setFilterType('harassment')}
          style={{
            padding: '10px 20px',
            background: filterType === 'harassment' ? '#E91E63' : '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ⚠️ Harcèlement
        </button>
        <button
          onClick={() => setFilterType('spam')}
          style={{
            padding: '10px 20px',
            background: filterType === 'spam' ? '#FF9800' : '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📧 Spam
        </button>
        <button
          onClick={() => setFilterType('inappropriate')}
          style={{
            padding: '10px 20px',
            background: filterType === 'inappropriate' ? '#dc3545' : '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔞 Inapproprié
        </button>
        <button
          onClick={() => setFilterType('fake')}
          style={{
            padding: '10px 20px',
            background: filterType === 'fake' ? '#9C27B0' : '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🎭 Faux profil
        </button>
        <button
          onClick={() => setFilterType('scam')}
          style={{
            padding: '10px 20px',
            background: filterType === 'scam' ? '#F44336' : '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          💸 Arnaque
        </button>
      </div>

      {/* Reports list */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredReports.map(report => (
          <div key={report.id} style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
              {/* Left side */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{getTypeIcon(report.type)}</span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>
                      {getTypeLabel(report.type)} - #{report.id}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{report.timestamp}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '4px' }}>
                    <span style={{ color: '#888' }}>Utilisateur signalé:</span>{' '}
                    <span style={{ fontWeight: '600', color: '#E91E63' }}>{report.reportedUser}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '4px' }}>
                    <span style={{ color: '#888' }}>Signalé par:</span>{' '}
                    <span style={{ fontWeight: '600' }}>{report.reportedBy}</span>
                  </div>
                </div>

                <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#ccc', marginBottom: '6px' }}>
                    Raison:
                  </div>
                  <div style={{ fontSize: '13px', color: '#fff', marginBottom: '8px' }}>
                    {report.reason}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {report.content}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: `${getSeverityColor(report.severity)}22`,
                    color: getSeverityColor(report.severity)
                  }}>
                    {report.severity === 'high' ? '🔴 Haute' : report.severity === 'medium' ? '🟠 Moyenne' : '🟢 Faible'}
                  </span>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: `${getStatusColor(report.status)}22`,
                    color: getStatusColor(report.status)
                  }}>
                    {getStatusLabel(report.status)}
                  </span>
                  {report.screenshots > 0 && (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: '#667eea22',
                      color: '#667eea'
                    }}>
                      📸 {report.screenshots} capture{report.screenshots > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {report.status === 'resolved' && report.action && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#4CAF50' }}>
                    ✓ Action prise: {report.action === 'banned' ? 'Utilisateur banni' : report.action} par {report.resolvedBy}
                  </div>
                )}
              </div>

              {/* Right side - Actions */}
              {report.status === 'pending' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '20px' }}>
                  <button
                    onClick={() => handleViewDetails(report)}
                    style={{
                      padding: '8px 16px',
                      background: '#2196F3',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🔍 Détails
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'investigate')}
                    style={{
                      padding: '8px 16px',
                      background: '#FF9800',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🔎 Enquêter
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'ban')}
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🚫 Bannir
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'dismiss')}
                    style={{
                      padding: '8px 16px',
                      background: '#666',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ✗ Rejeter
                  </button>
                </div>
              )}

              {report.status === 'investigating' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '20px' }}>
                  <button
                    onClick={() => handleViewDetails(report)}
                    style={{
                      padding: '8px 16px',
                      background: '#2196F3',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🔍 Détails
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'ban')}
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🚫 Bannir
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'resolve')}
                    style={{
                      padding: '8px 16px',
                      background: '#4CAF50',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ✓ Résoudre
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {showDetailModal && selectedReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '600px', border: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 20px 0' }}>
              Détails du signalement #{selectedReport.id}
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Type</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: getTypeColor(selectedReport.type) }}>
                {getTypeIcon(selectedReport.type)} {getTypeLabel(selectedReport.type)}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Utilisateur signalé</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#E91E63' }}>
                {selectedReport.reportedUser}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Signalé par</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                {selectedReport.reportedBy}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Raison</div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                {selectedReport.reason}
              </div>
              <div style={{ fontSize: '13px', color: '#ccc' }}>
                {selectedReport.content}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Captures d'écran</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {Array(selectedReport.screenshots).fill(0).map((_, idx) => (
                  <div key={idx} style={{ aspectRatio: '1', background: '#0a0a0a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: '1px solid #333' }}>
                    📸
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              style={{ width: '100%', padding: '12px', background: '#666', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
