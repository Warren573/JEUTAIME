import React, { useState } from 'react';
import Avatar from 'avataaars';
import { generateAvatarOptions } from '../../utils/avatarGenerator';

export default function EspacePersoScreenSimple({
  currentUser,
  setScreen
}) {
  // Générer les options d'avatar de manière sécurisée
  const avatarOptions = currentUser?.avatarData || generateAvatarOptions(
    currentUser?.name || 'User',
    currentUser?.gender || 'homme'
  );

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '80px',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #000 100%)'
    }}>
      {/* Header Identité */}
      <div style={{
        background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
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
              fontSize: '1.8rem',
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
              "{currentUser?.bio || 'Ma phrase d\'ambiance ✨'}"
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
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
                <span>💰</span>
                <span>{currentUser?.coins || 0}</span>
              </div>
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
                <span>⭐</span>
                <span>{currentUser?.points || 0} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Message temporaire */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '16px',
          padding: '30px',
          textAlign: 'center',
          border: '2px solid #4FC3F7'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚧</div>
          <h2 style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '15px'
          }}>
            Espace Perso en construction
          </h2>
          <p style={{
            color: '#aaa',
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            Le nouvel Espace Perso arrive bientôt avec :<br />
            📖 Book personnel • 🎁 Offrandes reçues<br />
            🔮 Inventaire magique • 📊 Stats sociales
          </p>

          {/* Boutons d'accès rapide */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '25px'
          }}>
            <button
              onClick={() => setScreen('profiles')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
                border: 'none',
                color: 'white',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}
            >
              👤 Voir les Profils
            </button>
            <button
              onClick={() => setScreen('social')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                border: 'none',
                color: 'white',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}
            >
              💬 Rejoindre un Salon
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '16px',
          padding: '25px'
        }}>
          <h3 style={{
            color: '#4FC3F7',
            fontSize: '1.3rem',
            marginBottom: '20px'
          }}>
            📊 Tes Stats
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '15px'
          }}>
            <div style={{
              background: '#1a1a1a',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '1.5rem' }}>
                {currentUser?.points || 0}
              </div>
              <div style={{ color: '#888', fontSize: '0.8rem' }}>Points</div>
            </div>
            <div style={{
              background: '#1a1a1a',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '1.5rem' }}>
                {currentUser?.coins || 0}
              </div>
              <div style={{ color: '#888', fontSize: '0.8rem' }}>Pièces</div>
            </div>
            <div style={{
              background: '#1a1a1a',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💌</div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '1.5rem' }}>
                {currentUser?.matches || 0}
              </div>
              <div style={{ color: '#888', fontSize: '0.8rem' }}>Matchs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
