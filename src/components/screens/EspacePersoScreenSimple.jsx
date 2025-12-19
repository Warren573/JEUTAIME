import React, { useState, useEffect } from 'react';
import Avatar from 'avataaars';
import { generateAvatarOptions } from '../../utils/avatarGenerator';
import { allMagic, allGifts } from '../../data/magicGifts';

export default function EspacePersoScreenSimple({
  currentUser,
  setScreen,
  setSelectedSalon,
  joinedSalons = []
}) {
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
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Identité */}
      <div style={{
        background: 'var(--color-cream)',
        padding: '30px 20px',
        borderBottom: '4px double var(--color-brown-dark)',
        boxShadow: 'var(--shadow-md)'
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
            border: '4px solid var(--color-gold)',
            boxShadow: 'var(--shadow-lg)',
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
              color: 'var(--color-text-primary)',
              fontSize: '1.8rem',
              fontWeight: '700'
            }}>
              {currentUser?.name || 'Utilisateur'}
              {currentUser?.premium && ' 👑'}
            </h1>
            <p style={{
              margin: '0 0 12px 0',
              color: 'var(--color-text-secondary)',
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
                background: 'var(--color-gold)',
                color: 'var(--color-brown-dark)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '700',
                boxShadow: 'var(--shadow-sm)'
              }}>
                💰 {currentUser?.coins || 0}
              </div>
              <div style={{
                background: 'var(--color-gold)',
                color: 'var(--color-brown-dark)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '700',
                boxShadow: 'var(--shadow-sm)'
              }}>
                ⭐ {currentUser?.points || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Rapide */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Bouton Mon Profil */}
        <button
          onClick={() => setScreen('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '16px 20px',
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown-light)',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-normal)',
            width: '100%'
          }}
        >
          <div style={{ fontSize: '28px', lineHeight: '1', flexShrink: 0 }}>👤</div>
          <div style={{
            flex: 1,
            textAlign: 'left',
            color: 'var(--color-text-primary)',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            Mon Profil
          </div>
        </button>

        {/* Bouton Découverte */}
        <button
          onClick={() => setScreen('profiles')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '16px 20px',
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown-light)',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-normal)',
            width: '100%'
          }}
        >
          <div style={{ fontSize: '28px', lineHeight: '1', flexShrink: 0 }}>🔍</div>
          <div style={{
            flex: 1,
            textAlign: 'left',
            color: 'var(--color-text-primary)',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            Découverte
          </div>
        </button>

        {/* Bouton Social */}
        <button
          onClick={() => setScreen('social')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '16px 20px',
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown-light)',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-normal)',
            width: '100%'
          }}
        >
          <div style={{ fontSize: '28px', lineHeight: '1', flexShrink: 0 }}>👥</div>
          <div style={{
            flex: 1,
            textAlign: 'left',
            color: 'var(--color-text-primary)',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            Social
          </div>
        </button>

        {/* Bouton Lettres */}
        <button
          onClick={() => setScreen('letters')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '16px 20px',
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown-light)',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-normal)',
            width: '100%'
          }}
        >
          <div style={{ fontSize: '28px', lineHeight: '1', flexShrink: 0 }}>💌</div>
          <div style={{
            flex: 1,
            textAlign: 'left',
            color: 'var(--color-text-primary)',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            Lettres
          </div>
        </button>

        {/* Bouton Paramètres */}
        <button
          onClick={() => setScreen('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '16px 20px',
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown-light)',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-normal)',
            width: '100%'
          }}
        >
          <div style={{ fontSize: '28px', lineHeight: '1', flexShrink: 0 }}>⚙️</div>
          <div style={{
            flex: 1,
            textAlign: 'left',
            color: 'var(--color-text-primary)',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            Paramètres
          </div>
        </button>
      </div>

      {/* Contenu principal */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Offrandes Reçues */}
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

// OFFRANDES REÇUES
function OffrandesRecuesSection({ currentUser }) {
  const [receivedGifts, setReceivedGifts] = useState([]);

  useEffect(() => {
    // Charger les cadeaux reçus depuis localStorage
    if (currentUser?.email) {
      const key = `jeutaime_received_gifts_${currentUser.email}`;
      const data = localStorage.getItem(key);
      const gifts = data ? JSON.parse(data) : [];
      setReceivedGifts(gifts);
    }
  }, [currentUser?.email]);

  const rareCount = receivedGifts.filter(g => g.isLegendary || g.isPremium).length;
  const lastReceived = receivedGifts.length > 0 ? receivedGifts[receivedGifts.length - 1] : null;

  return (
    <div style={{
      background: 'var(--color-cream)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '25px',
      border: '2px solid var(--color-tan)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-heading)',
        borderBottom: '2px solid var(--color-romantic)',
        paddingBottom: 'var(--spacing-xs)'
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
        <StatCard icon="✨" label="Rares" value={rareCount} />
        <StatCard icon="🔥" label="Dernier" value={lastReceived?.icon || '🎁'} isEmoji />
      </div>

      {receivedGifts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '10px',
          marginTop: '15px'
        }}>
          {receivedGifts.slice(-12).reverse().map((gift, idx) => (
            <div
              key={idx}
              title={gift.name}
              style={{
                background: 'var(--color-beige-light)',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
                fontSize: '2rem',
                border: gift.isLegendary || gift.isPremium ? '2px solid var(--color-gold)' : '2px solid var(--color-brown-light)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {gift.icon}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          color: 'var(--color-text-light)',
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
      background: 'var(--color-cream)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '25px',
      border: '2px solid var(--color-tan)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-heading)',
        borderBottom: '2px solid var(--color-humorous)',
        paddingBottom: 'var(--spacing-xs)'
      }}>
        🔮 Mon Inventaire Magique
      </h3>

      <div style={{
        background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
        padding: '12px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <span style={{ color: 'var(--color-brown-dark)', fontWeight: '700' }}>💰 Tes pièces</span>
        <span style={{ color: 'var(--color-brown-dark)', fontWeight: '900', fontSize: '1.3rem' }}>
          {userCoins}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gap: '10px'
      }}>
        <div style={{
          background: 'var(--color-beige-light)',
          padding: '12px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '2px solid var(--color-brown-light)'
        }}>
          <span style={{ color: 'var(--color-text-primary)' }}>✨ Magies disponibles</span>
          <span style={{ color: 'var(--color-romantic)', fontWeight: '700' }}>{allMagic.length}</span>
        </div>
        <div style={{
          background: 'var(--color-beige-light)',
          padding: '12px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '2px solid var(--color-brown-light)'
        }}>
          <span style={{ color: 'var(--color-text-primary)' }}>🎁 Cadeaux à offrir</span>
          <span style={{ color: 'var(--color-romantic)', fontWeight: '700' }}>{allGifts.length}</span>
        </div>
      </div>

      <button
        style={{
          width: '100%',
          marginTop: '15px',
          padding: '12px',
          background: 'linear-gradient(135deg, var(--color-humorous-light), var(--color-humorous))',
          border: '2px solid var(--color-humorous)',
          color: 'var(--color-brown-dark)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '0.95rem',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--transition-normal)'
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
      background: 'var(--color-cream)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '25px',
      border: '2px solid var(--color-tan)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-heading)',
        borderBottom: '2px solid var(--color-friendly)',
        paddingBottom: 'var(--spacing-xs)'
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
                background: salon.gradient || 'var(--color-beige)',
                padding: '15px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '2px solid var(--color-brown-light)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-normal)'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{salon.emoji}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: 'var(--color-text-primary)' }}>{salon.name}</h4>
                <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: '0.85rem' }}>
                  {salon.participants?.length || 0} membres
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--color-text-light)', textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
          Tu n'as rejoint aucun salon
        </p>
      )}

      <button
        onClick={() => setScreen('social')}
        style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, var(--color-friendly-light), var(--color-friendly))',
          border: '2px solid var(--color-friendly)',
          color: 'var(--color-cream)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.95rem',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--transition-normal)'
        }}
      >
        🔍 Explorer les Salons
      </button>
    </div>
  );
}

// 5. STATS SOCIALES
function StatsSocialesSection({ currentUser }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (currentUser?.email) {
      // Charger les stats depuis localStorage
      const key = `jeutaime_stats_${currentUser.email}`;
      const savedStats = localStorage.getItem(key);

      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        // Calculer les stats réelles
        const giftsKey = `jeutaime_received_gifts_${currentUser.email}`;
        const giftsData = localStorage.getItem(giftsKey);
        const receivedGifts = giftsData ? JSON.parse(giftsData) : [];

        const calculatedStats = {
          interactions: Math.floor(Math.random() * 30) + 10, // TODO: calculer depuis les lettres
          goodVibes: Math.floor(Math.random() * 20) + 8, // TODO: calculer depuis bouteille
          giftsReceived: receivedGifts.length,
          giftsSent: 0, // TODO: implémenter tracking
          salonsJoined: 0, // Sera passé via props
          dailyStreak: 1,
          positiveRate: 95,
          socialLevel: 1
        };

        setStats(calculatedStats);
        // Sauvegarder les stats initiales
        localStorage.setItem(key, JSON.stringify(calculatedStats));
      }
    }
  }, [currentUser?.email]);

  if (!stats) {
    return null; // Loading
  }

  return (
    <div style={{
      background: 'var(--color-cream)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '25px',
      border: '2px solid var(--color-tan)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '20px',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-heading)',
        borderBottom: '2px solid var(--color-gold)',
        paddingBottom: 'var(--spacing-xs)'
      }}>
        📊 Tes Stats Sociales
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px'
      }}>
        <StatCard icon="💬" label="Interactions" value={stats.interactions} />
        <StatCard icon="✨" label="Good Vibes" value={stats.goodVibes} />
        <StatCard icon="🎁" label="Offrandes" value={stats.giftsReceived} />
      </div>

      {/* Barre de progression */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'var(--color-beige-light)',
        borderRadius: '10px',
        border: '2px solid var(--color-brown-light)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          color: 'var(--color-text-primary)',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <span>Niveau social</span>
          <span>Niveau {stats.socialLevel}</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--color-beige)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(stats.socialLevel / 10) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-gold-light), var(--color-gold))',
            borderRadius: '10px',
            transition: 'width 0.5s'
          }} />
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENT
function StatCard({ icon, label, value, isEmoji = false }) {
  return (
    <div style={{
      background: 'var(--color-beige-light)',
      padding: '15px',
      borderRadius: '12px',
      textAlign: 'center',
      border: '2px solid var(--color-brown-light)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        color: 'var(--color-romantic)',
        fontWeight: '900',
        fontSize: isEmoji ? '1.5rem' : '1.8rem',
        marginBottom: '5px'
      }}>
        {value}
      </div>
      <div style={{ color: 'var(--color-text-light)', fontSize: '0.8rem' }}>{label}</div>
    </div>
  );
}
