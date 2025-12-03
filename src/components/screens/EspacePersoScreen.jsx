import React, { useState } from 'react';
import Avatar from 'avataaars';
import { generateAvatarOptions } from '../../utils/avatarGenerator';
import BookIndex from '../book/BookIndex';
import ReceivedGifts from '../personal/ReceivedGifts';
import SocialStats from '../personal/SocialStats';
import MagicInventory from '../magic/MagicInventory';
import { salons } from '../../data/appData';

export default function EspacePersoScreen({
  currentUser,
  setScreen,
  setSelectedSalon,
  joinedSalons = []
}) {
  const [showBook, setShowBook] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const avatarOptions = currentUser?.avatarData || generateAvatarOptions(currentUser?.name, currentUser?.gender);

  // Salons actifs de l'utilisateur
  const activeSalons = salons.filter(s => joinedSalons.includes(s.id));

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '80px',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #000 100%)'
    }}>
      {/* Header Identité */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '30px 20px',
        borderBottom: '4px solid rgba(255,255,255,0.1)'
      }}>
        {/* Avatar et info principale */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid white',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            flexShrink: 0,
            background: 'white'
          }}>
            <Avatar
              style={{ width: '100px', height: '100px' }}
              {...avatarOptions}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{
              margin: '0 0 8px 0',
              color: 'white',
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: '700'
            }}>
              {currentUser?.name || 'Utilisateur'}
              {currentUser?.premium && ' 👑'}
            </h1>
            <p style={{
              margin: '0 0 12px 0',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              lineHeight: '1.4'
            }}>
              "{currentUser?.bio || 'Ma phrase d\'ambiance style Skyblog ✨'}"
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <Badge icon="💰" value={currentUser?.coins || 0} />
              <Badge icon="⭐" value={currentUser?.points || 0} label="pts" />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <ActionButton
            onClick={() => setShowBook(true)}
            gradient="linear-gradient(135deg, #FFD700, #FFA500)"
            textColor="#000"
          >
            📖 Voir mon Book
          </ActionButton>
          <ActionButton
            onClick={() => alert('✏️ Éditeur de Book - À venir !')}
            gradient="linear-gradient(135deg, #4CAF50, #45a049)"
          >
            ✏️ Éditer
          </ActionButton>
          <ActionButton
            onClick={() => alert('🎨 Personnalisation - À venir !')}
            gradient="linear-gradient(135deg, #FF6B6B, #FF8E53)"
          >
            🎨 Thème
          </ActionButton>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Aperçu du Book */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '16px',
          padding: '25px',
          border: '2px solid #667eea',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onClick={() => setShowBook(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{
              margin: 0,
              color: '#667eea',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📖 Mon Book Privé
            </h3>
            <span style={{ fontSize: '1.5rem' }}>→</span>
          </div>
          <p style={{ margin: '0 0 15px 0', color: '#aaa', fontSize: '0.95rem' }}>
            Ton espace personnel façon Skyblog moderne ✨
          </p>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {['📖 Moi en vrai', '🎥 Vidéos', '📸 Album', '✍️ Notes', '🎨 Moodboard', '🔒 Ultra-Privé'].map((page) => (
              <div
                key={page}
                style={{
                  background: '#1a1a1a',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'white',
                  border: '1px solid #444'
                }}
              >
                {page}
              </div>
            ))}
          </div>
        </div>

        {/* Offrandes reçues */}
        <ReceivedGifts currentUser={currentUser} />

        {/* Inventaire Magie & Objets */}
        <MagicInventory
          currentUser={currentUser}
          onUseItem={(item) => alert(`✨ ${item.name} - Fonctionnalité à venir !`)}
        />

        {/* Mes Salons Actifs */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '16px',
          padding: '25px'
        }}>
          <h3 style={{
            fontSize: '1.6rem',
            marginBottom: '20px',
            color: '#667eea',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            💬 Mes Salons Actifs
          </h3>

          {activeSalons.length > 0 ? (
            <div style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '15px'
            }}>
              {activeSalons.map((salon) => (
                <div
                  key={salon.id}
                  onClick={() => {
                    setSelectedSalon(salon.id);
                    setScreen('bars');
                  }}
                  style={{
                    background: salon.gradient || '#1a1a1a',
                    padding: '15px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ fontSize: '2rem' }}>{salon.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>
                      {salon.name}
                    </h4>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                      {salon.participants?.length || 0} membres
                    </p>
                  </div>
                  <span style={{ fontSize: '1.2rem' }}>→</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
              Tu n'as rejoint aucun salon pour le moment
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setScreen('bars')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                color: 'white',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}
            >
              🔍 Explorer les Salons
            </button>
          </div>
        </div>

        {/* Statistiques Sociales */}
        <SocialStats currentUser={currentUser} />

        {/* Paramètres rapides */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '16px',
          padding: '25px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            color: '#667eea'
          }}>
            ⚙️ Paramètres Rapides
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <QuickSettingButton
              onClick={() => alert('🎨 Thèmes - À venir !')}
              icon="🎨"
              label="Personnaliser le thème"
            />
            <QuickSettingButton
              onClick={() => alert('🔔 Notifications - À venir !')}
              icon="🔔"
              label="Gérer les notifications"
            />
            <QuickSettingButton
              onClick={() => alert('🔒 Confidentialité - À venir !')}
              icon="🔒"
              label="Confidentialité & Sécurité"
            />
            <QuickSettingButton
              onClick={() => setScreen('settings')}
              icon="⚙️"
              label="Tous les paramètres"
            />
          </div>
        </div>
      </div>

      {/* Modal du Book */}
      {showBook && (
        <BookIndex
          user={currentUser}
          isOwnBook={true}
          onClose={() => setShowBook(false)}
        />
      )}
    </div>
  );
}

function Badge({ icon, value, label = '' }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      padding: '6px 12px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.9rem',
      fontWeight: '700'
    }}>
      <span>{icon}</span>
      <span>{value}{label}</span>
    </div>
  );
}

function ActionButton({ onClick, gradient, textColor = 'white', children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        background: gradient,
        border: 'none',
        color: textColor,
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}
      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
    >
      {children}
    </button>
  );
}

function QuickSettingButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '15px',
        background: '#1a1a1a',
        border: '2px solid #444',
        color: 'white',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#252525';
        e.target.style.borderColor = '#667eea';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = '#1a1a1a';
        e.target.style.borderColor = '#444';
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
