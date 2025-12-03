import React, { useState } from 'react';
import Avatar from 'avataaars';
import { generateAvatarOptions } from '../../utils/avatarGenerator';
import { allMagic, allGifts } from '../../data/magicGifts';

export default function EspacePersoScreenSimple({
  currentUser,
  setScreen,
  setSelectedSalon,
  joinedSalons = []
}) {
  const [showBookPreview, setShowBookPreview] = useState(false);

  // Générer les options d'avatar de manière sécurisée
  const avatarOptions = currentUser?.avatarData || generateAvatarOptions(
    currentUser?.name || 'User',
    currentUser?.gender || 'homme'
  );

  // Récupérer les salons depuis appData de manière sécurisée
  const salons = [];
  try {
    const appData = require('../../data/appData');
    if (appData && appData.salons) {
      salons.push(...appData.salons);
    }
  } catch (e) {
    console.log('Salons non chargés');
  }

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
        background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
        padding: '30px 20px',
        borderBottom: '4px solid rgba(255,255,255,0.1)'
      }}>
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
                fontSize: '0.9rem',
                fontWeight: '700'
              }}>
                💰 {currentUser?.coins || 0}
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '700'
              }}>
                ⭐ {currentUser?.points || 0}
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
        {/* 1. Book Personnel */}
        <BookPersonnelSection />

        {/* 2. Offrandes Reçues */}
        <OffrandesRecuesSection currentUser={currentUser} />

        {/* 3. Inventaire Magique */}
        <InventaireMagiqueSection currentUser={currentUser} />

        {/* 4. Mes Salons Actifs */}
        <MesSalonsSection
          activeSalons={activeSalons}
          setScreen={setScreen}
          setSelectedSalon={setSelectedSalon}
        />

        {/* 5. Stats Sociales */}
        <StatsSocialesSection currentUser={currentUser} />
      </div>
    </div>
  );
}

// 1. BOOK PERSONNEL
function BookPersonnelSection() {
  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '25px',
      border: '2px solid #4FC3F7'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: '#4FC3F7'
      }}>
        📖 Mon Book Personnel
      </h3>
      <p style={{
        color: '#aaa',
        marginBottom: '20px',
        fontSize: '0.95rem'
      }}>
        Ton espace perso style Skyblog moderne
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {['📖 Moi en vrai', '🎥 Vidéos', '📸 Album', '✍️ Notes', '🎨 Moodboard', '🔒 Ultra-Privé'].map((page) => (
          <div
            key={page}
            style={{
              background: '#1a1a1a',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              textAlign: 'center',
              color: 'white',
              border: '1px solid #444'
            }}
          >
            {page}
          </div>
        ))}
      </div>
      <button
        style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
          border: 'none',
          color: 'white',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.95rem'
        }}
        onClick={() => alert('📖 Book complet - À venir !')}
      >
        📖 Voir mon Book complet
      </button>
    </div>
  );
}

// 2. OFFRANDES REÇUES
function OffrandesRecuesSection({ currentUser }) {
  const receivedGifts = []; // TODO: charger depuis localStorage

  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '25px'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: '#4FC3F7'
      }}>
        🎁 Tes Offrandes Reçues
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '15px'
      }}>
        <StatCard icon="📦" label="Total" value={receivedGifts.length} />
        <StatCard icon="✨" label="Rares" value={0} />
        <StatCard icon="🔥" label="Dernier" value="🎁" isEmoji />
      </div>

      {receivedGifts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          color: '#888',
          fontStyle: 'italic'
        }}>
          <p style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>🎁</p>
          <p style={{ margin: 0 }}>Aucune offrande reçue pour le moment...</p>
        </div>
      )}
    </div>
  );
}

// 3. INVENTAIRE MAGIQUE
function InventaireMagiqueSection({ currentUser }) {
  const userCoins = currentUser?.coins || 0;

  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '25px'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: '#4FC3F7'
      }}>
        🔮 Mon Inventaire Magique
      </h3>

      <div style={{
        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
        padding: '12px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: '#000', fontWeight: '700' }}>💰 Tes pièces</span>
        <span style={{ color: '#000', fontWeight: '900', fontSize: '1.3rem' }}>
          {userCoins}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gap: '10px'
      }}>
        <div style={{
          background: '#1a1a1a',
          padding: '12px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: 'white' }}>✨ Magies disponibles</span>
          <span style={{ color: '#4FC3F7', fontWeight: '700' }}>{allMagic.length}</span>
        </div>
        <div style={{
          background: '#1a1a1a',
          padding: '12px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: 'white' }}>🎁 Cadeaux à offrir</span>
          <span style={{ color: '#4FC3F7', fontWeight: '700' }}>{allGifts.length}</span>
        </div>
      </div>

      <button
        style={{
          width: '100%',
          marginTop: '15px',
          padding: '12px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          border: 'none',
          color: '#000',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '0.95rem'
        }}
        onClick={() => alert('🔮 Inventaire complet - Utilise Magie & Offrandes dans les salons !')}
      >
        🔮 Voir tout l'inventaire
      </button>
    </div>
  );
}

// 4. MES SALONS ACTIFS
function MesSalonsSection({ activeSalons, setScreen, setSelectedSalon }) {
  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '25px'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: '#4FC3F7'
      }}>
        💬 Mes Salons Actifs
      </h3>

      {activeSalons && activeSalons.length > 0 ? (
        <div style={{ display: 'grid', gap: '12px', marginBottom: '15px' }}>
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
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{salon.emoji}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: 'white' }}>{salon.name}</h4>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                  {salon.participants?.length || 0} membres
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#888', textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
          Tu n'as rejoint aucun salon
        </p>
      )}

      <button
        onClick={() => setScreen('social')}
        style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
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
  );
}

// 5. STATS SOCIALES
function StatsSocialesSection({ currentUser }) {
  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '25px'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '20px',
        color: '#4FC3F7'
      }}>
        📊 Tes Stats Sociales
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px'
      }}>
        <StatCard icon="💬" label="Interactions" value={Math.floor(Math.random() * 30) + 10} />
        <StatCard icon="📖" label="Visites Book" value={Math.floor(Math.random() * 15) + 5} />
        <StatCard icon="✨" label="Good Vibes" value={Math.floor(Math.random() * 20) + 8} />
        <StatCard icon="🎁" label="Offrandes" value={Math.floor(Math.random() * 10) + 3} />
      </div>
    </div>
  );
}

// HELPER COMPONENT
function StatCard({ icon, label, value, isEmoji = false }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '15px',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        color: '#4FC3F7',
        fontWeight: '900',
        fontSize: isEmoji ? '1.5rem' : '1.8rem',
        marginBottom: '5px'
      }}>
        {value}
      </div>
      <div style={{ color: '#888', fontSize: '0.8rem' }}>{label}</div>
    </div>
  );
}
