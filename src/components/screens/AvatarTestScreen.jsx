import React, { useState } from 'react';
import Avatar from '../avatar/Avatar';
import { createInitialState } from '../../lib/avatar/generator';

export default function AvatarTestScreen() {
  // Générer quelques avatars de test
  const testUsers = [
    { id: 'user1', name: 'Sophie' },
    { id: 'user2', name: 'Emma' },
    { id: 'user3', name: 'Alexandre' },
    { id: 'user4', name: 'Lucas' },
    { id: 'user5', name: 'Chloé' },
    { id: 'user6', name: 'Thomas' },
  ];

  const [selectedSize, setSelectedSize] = useState(200);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '10px',
          color: '#333'
        }}>
          🎨 Test Avatars SVG
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Aperçu des avatars graphiques générés aléatoirement
        </p>

        {/* Contrôle taille */}
        <div style={{
          background: '#f5f5f5',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#333'
          }}>
            Taille des avatars: {selectedSize}px
          </label>
          <input
            type="range"
            min="50"
            max="400"
            value={selectedSize}
            onChange={(e) => setSelectedSize(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Grille d'avatars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginTop: '40px'
        }}>
          {testUsers.map(user => {
            const avatarState = createInitialState(user.id);

            return (
              <div
                key={user.id}
                style={{
                  background: '#f9fafb',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '2px solid #e5e7eb'
                }}
              >
                <div style={{
                  width: selectedSize,
                  height: selectedSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  background: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <Avatar
                    state={avatarState}
                    size={selectedSize}
                    animate={true}
                  />
                </div>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                  color: '#1f2937'
                }}>
                  {user.name}
                </h3>

                {/* Détails de l'avatar */}
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  textAlign: 'left',
                  width: '100%',
                  background: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  fontFamily: 'monospace'
                }}>
                  <div><strong>Face:</strong> {avatarState.identity.faceShape}</div>
                  <div><strong>Eyes:</strong> {avatarState.identity.eyeType}</div>
                  <div><strong>Mouth:</strong> {avatarState.identity.mouthType}</div>
                  <div><strong>Hair:</strong> {avatarState.identity.hairType}</div>
                  <div><strong>Stage:</strong> {avatarState.evolution.stage}/7</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informations */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#eff6ff',
          borderRadius: '12px',
          border: '2px solid #3b82f6'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1e40af' }}>
            ℹ️ À propos des avatars
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af' }}>
            <li>Chaque avatar est unique et généré à partir d'un seed (userId)</li>
            <li>Le même utilisateur aura toujours le même avatar</li>
            <li>Version actuelle : basique (visage + yeux + bouche)</li>
            <li>À venir : cheveux, sourcils, accessoires, évolution, effets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
