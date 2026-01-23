import React, { useState, useEffect } from 'react';
import { salons as defaultSalons } from '../../../data/appData';

const SALONS_KEY = 'jeutaime_salons';

// Fonctions helper pour gérer les salons
function getSalons() {
  const stored = localStorage.getItem(SALONS_KEY);
  if (!stored) {
    // Initialiser avec les salons par défaut
    localStorage.setItem(SALONS_KEY, JSON.stringify(defaultSalons));
    return defaultSalons;
  }
  return JSON.parse(stored);
}

function saveSalons(salons) {
  localStorage.setItem(SALONS_KEY, JSON.stringify(salons));
}

function getSalonStats(salonId) {
  // Récupérer les stats réelles depuis les stories LocalStorage
  const stories = JSON.parse(localStorage.getItem('jeutaime_bar_stories') || '[]');
  const salonStories = stories.filter(s => s.salonId === salonId);

  // Compter les participants uniques
  const uniqueUsers = new Set(salonStories.map(s => s.userEmail));

  return {
    participants: uniqueUsers.size,
    messages: salonStories.length
  };
}

export default function Salons() {
  const [salons, setSalons] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSalon, setEditingSalon] = useState(null);
  const [newSalon, setNewSalon] = useState({
    name: '',
    desc: '',
    icon: '',
    bgGradient: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    magicAction: {
      name: '',
      emoji: '',
      animation: 'default',
      message: ''
    }
  });

  useEffect(() => {
    loadSalons();
  }, []);

  const loadSalons = () => {
    const loadedSalons = getSalons();
    setSalons(loadedSalons);
  };

  const handleCreateSalon = () => {
    const salonsData = getSalons();
    const newId = Math.max(...salonsData.map(s => s.id), 0) + 1;

    const salon = {
      id: newId,
      ...newSalon,
      participants: [],
      active: true,
      created: new Date().toISOString()
    };

    const updatedSalons = [...salonsData, salon];
    saveSalons(updatedSalons);
    loadSalons();
    closeModal();
    alert('✅ Salon créé avec succès !');
  };

  const handleUpdateSalon = () => {
    const salonsData = getSalons();
    const index = salonsData.findIndex(s => s.id === editingSalon.id);
    if (index !== -1) {
      salonsData[index] = { ...salonsData[index], ...newSalon };
      saveSalons(salonsData);
      loadSalons();
      closeModal();
      alert('✅ Salon modifié avec succès !');
    }
  };

  const handleToggleActive = (salonId) => {
    const salonsData = getSalons();
    const index = salonsData.findIndex(s => s.id === salonId);
    if (index !== -1) {
      salonsData[index].active = !salonsData[index].active;
      saveSalons(salonsData);
      loadSalons();
    }
  };

  const handleDeleteSalon = (salonId) => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce salon ?')) return;

    const salonsData = getSalons();
    const filtered = salonsData.filter(s => s.id !== salonId);
    saveSalons(filtered);
    loadSalons();
    alert('✅ Salon supprimé');
  };

  const openEditModal = (salon) => {
    setEditingSalon(salon);
    setNewSalon({
      name: salon.name,
      desc: salon.desc,
      icon: salon.icon,
      bgGradient: salon.bgGradient,
      magicAction: salon.magicAction || {
        name: '',
        emoji: '',
        animation: 'default',
        message: ''
      }
    });
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingSalon(null);
    setNewSalon({
      name: '',
      desc: '',
      icon: '',
      bgGradient: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      magicAction: {
        name: '',
        emoji: '',
        animation: 'default',
        message: ''
      }
    });
  };

  const totalParticipants = salons.reduce((sum, salon) => {
    const stats = getSalonStats(salon.id);
    return sum + stats.participants;
  }, 0);

  const totalMessages = salons.reduce((sum, salon) => {
    const stats = getSalonStats(salon.id);
    return sum + stats.messages;
  }, 0);

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Gestion des Salons</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Créer et gérer les salons thématiques</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ➕ Nouveau Salon
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Total salons</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#E91E63' }}>{salons.length}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Actifs</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>
            {salons.filter(s => s.active !== false).length}
          </div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Participants total</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2196F3' }}>{totalParticipants}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Messages total</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#9C27B0' }}>{totalMessages}</div>
        </div>
      </div>

      {/* Salons grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {salons.map(salon => {
          const stats = getSalonStats(salon.id);
          const isActive = salon.active !== false;

          return (
            <div
              key={salon.id}
              style={{
                background: salon.bgGradient || '#1a1a1a',
                borderRadius: '15px',
                padding: '20px',
                border: '1px solid #333',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Overlay pour rendre le texte lisible */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                zIndex: 0
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Status badge */}
                <div style={{ position: 'absolute', top: '-5px', right: '-5px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: isActive ? '#4CAF5022' : '#66666622',
                    color: isActive ? '#4CAF50' : '#666',
                    border: `1px solid ${isActive ? '#4CAF50' : '#666'}`
                  }}>
                    {isActive ? '✓ Actif' : '✗ Inactif'}
                  </span>
                </div>

                {/* Icon and title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', marginTop: '10px' }}>
                  <div style={{ fontSize: '48px' }}>{salon.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: 'white' }}>
                      {salon.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#ddd', margin: 0 }}>{salon.desc}</p>
                  </div>
                </div>

                {/* Magic Action */}
                {salon.magicAction && (
                  <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '10px',
                    marginBottom: '15px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ fontSize: '11px', color: '#ddd', marginBottom: '4px' }}>⚡ Action magique</div>
                    <div style={{ fontSize: '13px', color: 'white', fontWeight: '600' }}>
                      {salon.magicAction.emoji} {salon.magicAction.name}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#E91E63' }}>{stats.participants}</div>
                    <div style={{ fontSize: '10px', color: '#ddd' }}>Participants</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#2196F3' }}>{stats.messages}</div>
                    <div style={{ fontSize: '10px', color: '#ddd' }}>Messages</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEditModal(salon)}
                    style={{ flex: 1, padding: '10px', background: '#2196F3', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleToggleActive(salon.id)}
                    style={{ flex: 1, padding: '10px', background: isActive ? '#FF9800' : '#4CAF50', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {isActive ? '⏸️ Désactiver' : '▶️ Activer'}
                  </button>
                  <button
                    onClick={() => handleDeleteSalon(salon.id)}
                    style={{ padding: '10px 15px', background: '#dc3545', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={closeModal}>
          <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '500px', border: '1px solid #333', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 20px 0' }}>
              {editingSalon ? 'Modifier le salon' : 'Créer un nouveau salon'}
            </h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Nom du salon
              </label>
              <input
                type="text"
                value={newSalon.name}
                onChange={(e) => setNewSalon({ ...newSalon, name: e.target.value })}
                placeholder="Ex: Salon Musical"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Description
              </label>
              <input
                type="text"
                value={newSalon.desc}
                onChange={(e) => setNewSalon({ ...newSalon, desc: e.target.value })}
                placeholder="Ex: Pour les mélomanes"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Icône (emoji)
              </label>
              <input
                type="text"
                value={newSalon.icon}
                onChange={(e) => setNewSalon({ ...newSalon, icon: e.target.value })}
                placeholder="Ex: 🎵"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Gradient de fond (CSS)
              </label>
              <input
                type="text"
                value={newSalon.bgGradient}
                onChange={(e) => setNewSalon({ ...newSalon, bgGradient: e.target.value })}
                placeholder="linear-gradient(180deg, #color1 0%, #color2 100%)"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px', padding: '15px', background: '#0a0a0a', borderRadius: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#ccc' }}>
                ⚡ Action magique
              </label>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#888' }}>Nom</label>
                <input
                  type="text"
                  value={newSalon.magicAction.name}
                  onChange={(e) => setNewSalon({ ...newSalon, magicAction: { ...newSalon.magicAction, name: e.target.value } })}
                  placeholder="Ex: Offrir un café"
                  style={{ width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#888' }}>Emoji</label>
                <input
                  type="text"
                  value={newSalon.magicAction.emoji}
                  onChange={(e) => setNewSalon({ ...newSalon, magicAction: { ...newSalon.magicAction, emoji: e.target.value } })}
                  placeholder="☕"
                  style={{ width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#888' }}>Message</label>
                <input
                  type="text"
                  value={newSalon.magicAction.message}
                  onChange={(e) => setNewSalon({ ...newSalon, magicAction: { ...newSalon.magicAction, message: e.target.value } })}
                  placeholder="Tu as offert un délicieux café! ☕✨"
                  style={{ width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={closeModal}
                style={{ flex: 1, padding: '12px', background: '#666', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                onClick={editingSalon ? handleUpdateSalon : handleCreateSalon}
                disabled={!newSalon.name || !newSalon.icon}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: (!newSalon.name || !newSalon.icon) ? '#444' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: (!newSalon.name || !newSalon.icon) ? 'not-allowed' : 'pointer'
                }}
              >
                {editingSalon ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
