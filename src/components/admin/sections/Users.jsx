import React, { useState, useEffect } from 'react';
import {
  getAllUsers,
  searchUsers,
  getUsersByStatus,
  getUserStats,
  getUserSanctions,
  getActiveSanction,
  warnUser,
  restrictUser,
  banUser,
  removeAllUserSanctions
} from '../../../services/userService';
import {
  logUserBan,
  logUserWarn,
  logUserRestrict,
  logSanctionRemoved
} from '../../../services/adminLogService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, premium: 0, banned: 0, restricted: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [restrictDuration, setRestrictDuration] = useState(7);
  const [warnReason, setWarnReason] = useState('');

  // Chargement initial
  useEffect(() => {
    loadData();
  }, []);

  // Rechargement quand filtre change
  useEffect(() => {
    loadData();
  }, [filterStatus, searchTerm]);

  const loadData = () => {
    // Charger stats
    setStats(getUserStats());

    // Charger users selon filtres
    let loadedUsers = [];
    if (searchTerm.trim()) {
      loadedUsers = searchUsers(searchTerm);
      // Appliquer le filtre de statut sur les résultats de recherche
      if (filterStatus !== 'all') {
        loadedUsers = loadedUsers.filter(u => {
          const sanctions = getUserSanctions(u.id || u.email);
          const activeSanction = sanctions.find(s => s.active);

          switch (filterStatus) {
            case 'active':
              return !activeSanction;
            case 'banned':
              return activeSanction && activeSanction.type === 'ban';
            case 'restricted':
              return activeSanction && activeSanction.type === 'restrict';
            case 'warned':
              return sanctions.some(s => s.type === 'warning');
            case 'premium':
              return u.premium === true;
            default:
              return true;
          }
        });
      }
    } else {
      loadedUsers = getUsersByStatus(filterStatus);
    }

    setUsers(loadedUsers);
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setAdminNote('');
    setWarnReason('');
    setRestrictDuration(7);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setAdminNote('');
    setWarnReason('');
  };

  const handleWarn = async () => {
    if (!warnReason.trim()) {
      alert('Veuillez indiquer une raison pour l\'avertissement');
      return;
    }

    setActionInProgress(true);
    try {
      const userId = selectedUser.id || selectedUser.email;
      const userName = selectedUser.name || selectedUser.email;

      warnUser(userId, warnReason, adminNote);
      logUserWarn(userId, userName, warnReason);

      alert('✓ Avertissement envoyé');
      loadData();
      closeModal();
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRestrict = async () => {
    if (!restrictDuration || restrictDuration < 1) {
      alert('Veuillez indiquer une durée valide');
      return;
    }

    setActionInProgress(true);
    try {
      const userId = selectedUser.id || selectedUser.email;
      const userName = selectedUser.name || selectedUser.email;
      const reason = adminNote || 'Compte restreint';

      restrictUser(userId, reason, restrictDuration, adminNote);
      logUserRestrict(userId, userName, reason, restrictDuration);

      alert(`✓ Utilisateur restreint pour ${restrictDuration} jours`);
      loadData();
      closeModal();
    } finally {
      setActionInProgress(false);
    }
  };

  const handleBan = async () => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir BANNIR cet utilisateur définitivement ?')) {
      return;
    }

    setActionInProgress(true);
    try {
      const userId = selectedUser.id || selectedUser.email;
      const userName = selectedUser.name || selectedUser.email;
      const reason = adminNote || 'Compte banni';

      banUser(userId, reason, adminNote);
      logUserBan(userId, userName, reason);

      alert('✓ Utilisateur banni');
      loadData();
      closeModal();
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRemoveSanctions = async () => {
    if (!confirm('Êtes-vous sûr de vouloir lever toutes les sanctions de cet utilisateur ?')) {
      return;
    }

    setActionInProgress(true);
    try {
      const userId = selectedUser.id || selectedUser.email;
      const userName = selectedUser.name || selectedUser.email;

      const removed = removeAllUserSanctions(userId);
      if (removed) {
        logSanctionRemoved(userId, userName, 'all');
        alert('✓ Sanctions levées');
        loadData();
        closeModal();
      } else {
        alert('Aucune sanction active à lever');
      }
    } finally {
      setActionInProgress(false);
    }
  };

  const getUserStatusBadge = (user) => {
    const userId = user.id || user.email;
    const sanctions = getUserSanctions(userId);
    const activeSanction = sanctions.find(s => s.active);

    if (!activeSanction) {
      return { text: '✓ Actif', bg: '#4CAF5022', color: '#4CAF50' };
    }

    if (activeSanction.type === 'ban') {
      return { text: '✗ Banni', bg: '#dc354522', color: '#dc3545' };
    }

    if (activeSanction.type === 'restrict') {
      return { text: '⚠ Restreint', bg: '#FF980022', color: '#FF9800' };
    }

    return { text: '✓ Actif', bg: '#4CAF5022', color: '#4CAF50' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Gestion des utilisateurs</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Gérer les comptes et sanctions</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Total utilisateurs</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>{stats.total}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Actifs</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2196F3' }}>{stats.active}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Premium</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFD700' }}>{stats.premium}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Bannis</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545' }}>{stats.banned}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Restreints</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF9800' }}>{stats.restricted}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '20px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Rechercher par nom, email ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { value: 'all', label: 'Tous' },
              { value: 'active', label: 'Actifs' },
              { value: 'banned', label: 'Bannis' },
              { value: 'restricted', label: 'Restreints' },
              { value: 'warned', label: 'Avertis' },
              { value: 'premium', label: 'Premium' }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                style={{
                  padding: '12px 20px',
                  background: filterStatus === status.value ? '#667eea' : '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users list */}
      <div style={{ background: '#1a1a1a', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr 1fr 150px',
          gap: '15px',
          padding: '15px 20px',
          background: '#0a0a0a',
          fontSize: '12px',
          fontWeight: '700',
          color: '#888',
          borderBottom: '1px solid #333'
        }}>
          <div>UTILISATEUR</div>
          <div>EMAIL</div>
          <div>INSCRIT</div>
          <div>STATUT</div>
          <div>ACTIONS</div>
        </div>

        {users.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Aucun utilisateur trouvé
          </div>
        ) : (
          users.map(user => {
            const statusBadge = getUserStatusBadge(user);
            const userId = user.id || user.email;
            const sanctions = getUserSanctions(userId);

            return (
              <div
                key={userId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 150px',
                  gap: '15px',
                  padding: '15px 20px',
                  borderBottom: '1px solid #222',
                  alignItems: 'center',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onClick={() => openUserModal(user)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#222'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user.name || 'Sans nom'}
                    {user.premium && <span style={{ padding: '2px 6px', background: '#FFD700', color: '#000', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>👑</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>ID: {userId}</div>
                </div>
                <div style={{ color: '#888' }}>{user.email || 'N/A'}</div>
                <div style={{ color: '#888' }}>{formatDate(user.createdAt)}</div>
                <div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: statusBadge.bg,
                    color: statusBadge.color
                  }}>
                    {statusBadge.text}
                  </span>
                  {sanctions.length > 0 && (
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                      {sanctions.length} sanction{sanctions.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openUserModal(user)}
                    style={{
                      padding: '8px 16px',
                      background: '#2196F3',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    👁️ Voir
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal détails utilisateur */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid #333'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '25px', borderBottom: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {selectedUser.name || 'Sans nom'}
                    {selectedUser.premium && <span style={{ padding: '4px 10px', background: '#FFD700', color: '#000', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>👑 PREMIUM</span>}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#888' }}>{selectedUser.email}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>ID: {selectedUser.id || selectedUser.email}</div>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    background: '#333',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Statut actuel */}
              <div style={{ marginTop: '15px' }}>
                {(() => {
                  const statusBadge = getUserStatusBadge(selectedUser);
                  return (
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: statusBadge.bg,
                      color: statusBadge.color,
                      display: 'inline-block'
                    }}>
                      {statusBadge.text}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Sanctions actives */}
            {(() => {
              const userId = selectedUser.id || selectedUser.email;
              const activeSanction = getActiveSanction(userId);

              if (activeSanction) {
                return (
                  <div style={{ padding: '20px', borderBottom: '1px solid #333', background: '#dc354511' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#dc3545', marginBottom: '10px' }}>
                      ⚠️ SANCTION ACTIVE
                    </div>
                    <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '15px', border: '1px solid #dc3545' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                            {activeSanction.type === 'ban' ? '🚫 Banni' : activeSanction.type === 'restrict' ? '⚠️ Restreint' : '⚠️ Avertissement'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#888' }}>
                            Depuis le {formatDateTime(activeSanction.createdAt)}
                          </div>
                        </div>
                        {activeSanction.expiresAt && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '11px', color: '#888' }}>Expire le</div>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#FF9800' }}>
                              {formatDateTime(activeSanction.expiresAt)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '8px' }}>
                        <strong>Raison:</strong> {activeSanction.reason}
                      </div>
                      {activeSanction.adminNote && (
                        <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>
                          Note admin: {activeSanction.adminNote}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Historique des sanctions */}
            {(() => {
              const userId = selectedUser.id || selectedUser.email;
              const sanctions = getUserSanctions(userId);
              const inactiveSanctions = sanctions.filter(s => !s.active);

              if (inactiveSanctions.length > 0) {
                return (
                  <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#888' }}>
                      📋 Historique des sanctions ({inactiveSanctions.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflow: 'auto' }}>
                      {inactiveSanctions.map(sanction => (
                        <div key={sanction.id} style={{ background: '#0a0a0a', borderRadius: '8px', padding: '12px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div style={{ fontWeight: '600' }}>
                              {sanction.type === 'ban' ? '🚫 Ban' : sanction.type === 'restrict' ? '⚠️ Restriction' : '⚠️ Avertissement'}
                            </div>
                            <div style={{ color: '#888', fontSize: '11px' }}>
                              {formatDate(sanction.createdAt)}
                            </div>
                          </div>
                          <div style={{ color: '#ccc', fontSize: '11px' }}>
                            {sanction.reason}
                          </div>
                          {sanction.removedAt && (
                            <div style={{ color: '#4CAF50', fontSize: '10px', marginTop: '6px' }}>
                              ✓ Levée le {formatDate(sanction.removedAt)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Actions admin */}
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '15px' }}>
                ⚡ Actions administrateur
              </div>

              {/* Note admin */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
                  Note admin (optionnel)
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Note interne pour justifier l'action..."
                  disabled={actionInProgress}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px',
                    minHeight: '60px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Avertir */}
              <div style={{ marginBottom: '15px', padding: '15px', background: '#FF980011', borderRadius: '10px', border: '1px solid #FF980033' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>⚠️ Avertir l'utilisateur</div>
                <input
                  type="text"
                  value={warnReason}
                  onChange={(e) => setWarnReason(e.target.value)}
                  placeholder="Raison de l'avertissement..."
                  disabled={actionInProgress}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px',
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={handleWarn}
                  disabled={actionInProgress || !warnReason.trim()}
                  style={{
                    padding: '10px 20px',
                    background: !warnReason.trim() ? '#444' : '#FF9800',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: !warnReason.trim() ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {actionInProgress ? 'Traitement...' : '⚠️ Envoyer l\'avertissement'}
                </button>
              </div>

              {/* Restreindre */}
              <div style={{ marginBottom: '15px', padding: '15px', background: '#FF980011', borderRadius: '10px', border: '1px solid #FF980033' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>🔒 Restreindre temporairement</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <input
                    type="number"
                    value={restrictDuration}
                    onChange={(e) => setRestrictDuration(parseInt(e.target.value) || 1)}
                    min="1"
                    max="365"
                    disabled={actionInProgress}
                    style={{
                      padding: '10px',
                      background: '#0a0a0a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '13px',
                      width: '80px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '12px', color: '#888' }}>jours</span>
                  <div style={{ flex: 1, display: 'flex', gap: '5px' }}>
                    {[7, 14, 30].map(days => (
                      <button
                        key={days}
                        onClick={() => setRestrictDuration(days)}
                        disabled={actionInProgress}
                        style={{
                          padding: '6px 10px',
                          background: restrictDuration === days ? '#667eea' : '#0a0a0a',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {days}j
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleRestrict}
                  disabled={actionInProgress}
                  style={{
                    padding: '10px 20px',
                    background: '#FF9800',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  {actionInProgress ? 'Traitement...' : `🔒 Restreindre ${restrictDuration} jours`}
                </button>
              </div>

              {/* Bannir */}
              <div style={{ marginBottom: '15px', padding: '15px', background: '#dc354511', borderRadius: '10px', border: '1px solid #dc354533' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#dc3545' }}>🚫 Bannir définitivement</div>
                <button
                  onClick={handleBan}
                  disabled={actionInProgress}
                  style={{
                    padding: '10px 20px',
                    background: '#dc3545',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  {actionInProgress ? 'Traitement...' : '🚫 Bannir cet utilisateur'}
                </button>
              </div>

              {/* Lever sanctions */}
              {(() => {
                const userId = selectedUser.id || selectedUser.email;
                const activeSanction = getActiveSanction(userId);

                if (activeSanction) {
                  return (
                    <div style={{ padding: '15px', background: '#4CAF5011', borderRadius: '10px', border: '1px solid #4CAF5033' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#4CAF50' }}>✓ Lever les sanctions</div>
                      <button
                        onClick={handleRemoveSanctions}
                        disabled={actionInProgress}
                        style={{
                          padding: '10px 20px',
                          background: '#4CAF50',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        {actionInProgress ? 'Traitement...' : '✓ Lever toutes les sanctions'}
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
