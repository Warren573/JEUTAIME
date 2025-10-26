import React, { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    // General
    appName: 'JeuTaime',
    maintenanceMode: false,
    registrationEnabled: true,

    // Economy
    startingCoins: 100,
    dailyBonusCoins: 50,
    letterCostCoins: 20,
    premiumPriceMonthly: 9.99,
    premiumPriceYearly: 89.99,

    // Games
    minGameReward: 5,
    maxGameReward: 150,
    gameCooldownMinutes: 0,

    // Moderation
    autoModeration: true,
    maxReportsBeforeReview: 3,
    banDurationDays: 30,

    // Social
    maxDailyLetters: 10,
    maxBarParticipants: 100,
    messageRateLimit: 60,

    // Security
    requireEmailVerification: false,
    minPasswordLength: 8,
    sessionTimeoutHours: 24,

    // Notifications
    emailNotifications: true,
    pushNotifications: true
  });

  const [activeSection, setActiveSection] = useState('general');

  const handleSave = (section) => {
    console.log('Saving settings for section:', section, settings);
    // Ici on enverrait les données au backend
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    { id: 'general', icon: '⚙️', label: 'Général', color: '#667eea' },
    { id: 'economy', icon: '💰', label: 'Économie', color: '#FFD700' },
    { id: 'games', icon: '🎮', label: 'Jeux', color: '#9C27B0' },
    { id: 'moderation', icon: '🛡️', label: 'Modération', color: '#E91E63' },
    { id: 'social', icon: '💬', label: 'Social', color: '#2196F3' },
    { id: 'security', icon: '🔒', label: 'Sécurité', color: '#FF9800' },
    { id: 'notifications', icon: '🔔', label: 'Notifications', color: '#4CAF50' }
  ];

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Paramètres</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Configuration de l'application</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px' }}>
        {/* Sidebar menu */}
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333', height: 'fit-content' }}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: activeSection === section.id ? `${section.color}22` : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeSection === section.id ? section.color : '#ccc',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '20px' }}>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '30px', border: '1px solid #333' }}>
          {/* General Settings */}
          {activeSection === 'general' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                ⚙️ Paramètres généraux
              </h2>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Nom de l'application
                </label>
                <input
                  type="text"
                  value={settings.appName}
                  onChange={(e) => handleChange('appName', e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ccc' }}>Mode maintenance</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Désactive l'accès pour les utilisateurs</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.registrationEnabled}
                    onChange={(e) => handleChange('registrationEnabled', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ccc' }}>Inscriptions activées</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Autoriser les nouveaux comptes</div>
                  </div>
                </label>
              </div>

              <button
                onClick={() => handleSave('general')}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* Economy Settings */}
          {activeSection === 'economy' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                💰 Paramètres économiques
              </h2>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Pièces de départ
                </label>
                <input
                  type="number"
                  value={settings.startingCoins}
                  onChange={(e) => handleChange('startingCoins', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Pièces données à l'inscription
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Bonus quotidien
                </label>
                <input
                  type="number"
                  value={settings.dailyBonusCoins}
                  onChange={(e) => handleChange('dailyBonusCoins', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Pièces données chaque jour
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Coût d'une lettre
                </label>
                <input
                  type="number"
                  value={settings.letterCostCoins}
                  onChange={(e) => handleChange('letterCostCoins', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Pièces nécessaires pour envoyer une lettre
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                    Premium mensuel (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.premiumPriceMonthly}
                    onChange={(e) => handleChange('premiumPriceMonthly', parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                    Premium annuel (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.premiumPriceYearly}
                    onChange={(e) => handleChange('premiumPriceYearly', parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave('economy')}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* Games Settings */}
          {activeSection === 'games' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                🎮 Paramètres des jeux
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                    Récompense minimale
                  </label>
                  <input
                    type="number"
                    value={settings.minGameReward}
                    onChange={(e) => handleChange('minGameReward', parseInt(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                    Récompense maximale
                  </label>
                  <input
                    type="number"
                    value={settings.maxGameReward}
                    onChange={(e) => handleChange('maxGameReward', parseInt(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Cooldown entre parties (minutes)
                </label>
                <input
                  type="number"
                  value={settings.gameCooldownMinutes}
                  onChange={(e) => handleChange('gameCooldownMinutes', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  0 = pas de cooldown
                </div>
              </div>

              <button
                onClick={() => handleSave('games')}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* Moderation Settings */}
          {activeSection === 'moderation' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                🛡️ Paramètres de modération
              </h2>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.autoModeration}
                    onChange={(e) => handleChange('autoModeration', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ccc' }}>Modération automatique</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Bannir automatiquement après X signalements</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Seuil de signalements
                </label>
                <input
                  type="number"
                  value={settings.maxReportsBeforeReview}
                  onChange={(e) => handleChange('maxReportsBeforeReview', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Nombre de signalements avant révision
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Durée du bannissement (jours)
                </label>
                <input
                  type="number"
                  value={settings.banDurationDays}
                  onChange={(e) => handleChange('banDurationDays', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  0 = bannissement permanent
                </div>
              </div>

              <button
                onClick={() => handleSave('moderation')}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* Social Settings */}
          {activeSection === 'social' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                💬 Paramètres sociaux
              </h2>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Lettres max par jour
                </label>
                <input
                  type="number"
                  value={settings.maxDailyLetters}
                  onChange={(e) => handleChange('maxDailyLetters', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Participants max par bar
                </label>
                <input
                  type="number"
                  value={settings.maxBarParticipants}
                  onChange={(e) => handleChange('maxBarParticipants', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Rate limit messages (secondes)
                </label>
                <input
                  type="number"
                  value={settings.messageRateLimit}
                  onChange={(e) => handleChange('messageRateLimit', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Délai entre les messages
                </div>
              </div>

              <button
                onClick={() => handleSave('social')}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                🔒 Paramètres de sécurité
              </h2>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ccc' }}>Vérification email requise</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Obliger la vérification de l'email</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Longueur minimale du mot de passe
                </label>
                <input
                  type="number"
                  value={settings.minPasswordLength}
                  onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Timeout de session (heures)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeoutHours}
                  onChange={(e) => handleChange('sessionTimeoutHours', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>

              <button
                onClick={() => handleSave('security')}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                🔔 Paramètres de notifications
              </h2>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ccc' }}>Notifications par email</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Envoyer des emails aux utilisateurs</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ccc' }}>Notifications push</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Envoyer des notifications push</div>
                  </div>
                </label>
              </div>

              <button
                onClick={() => handleSave('notifications')}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                💾 Enregistrer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
