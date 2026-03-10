import React, { useState, useEffect } from 'react';
import UserAvatar from '../../avatar/UserAvatar';
import { allMagic, allGifts } from '../../data/magicGifts';

export default function EspacePersoScreenSimple({
  currentUser,
  setScreen,
  setSelectedSalon,
  joinedSalons = []
}) {

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
      paddingTop: 'env(safe-area-inset-top)',
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
          <UserAvatar
            user={currentUser}
            size={100}
            style={{
              border: '4px solid var(--color-gold)',
              boxShadow: 'var(--shadow-lg)',
              background: 'white'
            }}
          />

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

      {/* Contenu principal */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* 1. Règles du jeu */}
        <ReglesSection />

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

// 6. RÈGLES DU JEU
function ReglesSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      background: 'var(--color-cream)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '25px',
      border: '2px solid var(--color-tan)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <h3 style={{
          fontSize: '1.5rem',
          marginBottom: isExpanded ? '20px' : 0,
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-heading)',
          borderBottom: '2px solid var(--color-gold)',
          paddingBottom: 'var(--spacing-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>📖 Règles du Jeu</span>
          <span style={{ fontSize: '1rem' }}>{isExpanded ? '▼' : '▶'}</span>
        </h3>
      </button>

      {isExpanded && (
        <div style={{
          color: 'var(--color-text-primary)',
          fontSize: '0.95rem',
          lineHeight: '1.6'
        }}>
          <div style={{ marginBottom: '20px', textAlign: 'center', fontStyle: 'italic' }}>
            <p style={{ margin: '10px 0', fontSize: '1.1rem', fontWeight: '600' }}>Bienvenue sur JeuTaime 💖</p>
            <p style={{ margin: '10px 0' }}>JeuTaime est une application de rencontres sous forme de jeu social.</p>
            <p style={{ margin: '10px 0' }}>Le principe est simple : interagir avec les autres pour créer des échanges, s'amuser et, pourquoi pas, faire de vraies rencontres.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>🎯 LE BUT DU JEU</h4>
            <p style={{ margin: '10px 0' }}>Sur JeuTaime, le but n'est pas de collectionner des profils. Le but est de :</p>
            <ul style={{ marginLeft: '20px' }}>
              <li>discuter</li>
              <li>réagir</li>
              <li>jouer</li>
              <li>écrire</li>
              <li>créer du lien</li>
            </ul>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>👉 Plus tu interagis, plus tu progresses.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>💌 LES LETTRES (CŒUR DE L'APP)</h4>
            <p style={{ margin: '10px 0' }}>Les lettres sont au centre de JeuTaime.</p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Envoyer une lettre : +10 points</li>
              <li>Recevoir une lettre : +15 points</li>
            </ul>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>🔓 Photos de profil</p>
            <p style={{ margin: '10px 0' }}>Les photos sont floues au départ. Pour les déverrouiller : au minimum 10 lettres échangées chacun.</p>
            <p style={{ margin: '10px 0', fontStyle: 'italic' }}>👉 JeuTaime privilégie la personnalité, les mots et les échanges avant l'image.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>😊 SOURIRES & 😬 GRIMACES</h4>
            <ul style={{ marginLeft: '20px' }}>
              <li>😊 Sourire : le profil te plaît (style, humour, vibe)</li>
              <li>😬 Grimace : le profil ne te correspond pas</li>
            </ul>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>Effets :</p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Sourire envoyé : +5 points</li>
              <li>Sourire reçu : +10 points</li>
              <li>Grimace reçue : -5 points</li>
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>💘 MATCHS</h4>
            <p style={{ margin: '10px 0' }}>Un match se crée lorsque deux personnes se sourient mutuellement.</p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Bonus : +50 points chacun</li>
              <li>Un petit questionnaire de compatibilité valide le match</li>
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>🏛️ LES SALONS DE DISCUSSION</h4>
            <p style={{ margin: '10px 0' }}>Dans un salon, tu peux :</p>
            <ul style={{ marginLeft: '20px' }}>
              <li>discuter librement</li>
              <li>observer avant de participer</li>
              <li>rencontrer plusieurs personnes en même temps</li>
              <li>participer à une histoire collective</li>
            </ul>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>📖 Histoire collective :</p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Ajouter une phrase : +5 points</li>
              <li>Histoire complétée : bonus collectif +50 points</li>
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>🎮 LES MINI-JEUX</h4>
            <p style={{ margin: '10px 0' }}>Jeux disponibles : Pong, Morpion, Memory, Whack-a-mole</p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Victoire : +50 points</li>
              <li>Défaite : -10 points</li>
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>🐾 L'ANIMAL VIRTUEL</h4>
            <p style={{ margin: '10px 0' }}>Tu peux adopter un seul animal à la fois.</p>
            <p style={{ margin: '10px 0' }}>Ton animal a 4 jauges simples : 🍽️ Faim, 😊 Bonheur, ⚡ Énergie, 🧼 Propreté</p>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>🐶 Réactions de l'animal</p>
            <p style={{ margin: '10px 0' }}>Ton animal est vivant et expressif. Ces réactions sont visibles par les autres et rendent ton profil plus vivant.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>🏅 POINTS, NIVEAUX & BADGES</h4>
            <p style={{ margin: '10px 0' }}>Chaque action te fait gagner des points pour monter de niveau et débloquer des titres.</p>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>🌟 Profil de la semaine</p>
            <p style={{ margin: '10px 0' }}>Chaque semaine, la communauté met en avant 1 profil féminin et 1 profil masculin pour leur originalité et implication.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '10px' }}>🎁 CADEAUX & 🔮 MAGIE</h4>
            <p style={{ margin: '10px 0' }}>Les cadeaux servent à faire plaisir et marquer les esprits. Les sorts ajoutent du fun dans les salons.</p>
          </div>

          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'var(--color-beige-light)',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.3rem', marginBottom: '15px' }}>❤️ L'ESPRIT JEUTAIME</h4>
            <p style={{ margin: '10px 0', fontWeight: '600', fontSize: '1.1rem' }}>👉 Prendre le temps</p>
            <p style={{ margin: '10px 0', fontWeight: '600', fontSize: '1.1rem' }}>👉 Interagir sincèrement</p>
            <p style={{ margin: '10px 0', fontWeight: '600', fontSize: '1.1rem' }}>👉 Jouer pour créer du lien</p>
            <p style={{ margin: '20px 0', fontSize: '1.2rem' }}>Bienvenue dans le jeu 💖</p>
          </div>
        </div>
      )}
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

      <p style={{
        marginTop: '15px',
        padding: '10px',
        background: 'var(--color-beige-light)',
        border: '2px dashed var(--color-humorous)',
        borderRadius: '10px',
        color: 'var(--color-text-secondary)',
        fontSize: '0.85rem',
        textAlign: 'center'
      }}>
        💡 Utilise tes magies et cadeaux directement dans les salons
      </p>
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

        // Calculer les interactions depuis les conversations localStorage
        const convsKey = `jeutaime_conversations_${currentUser.email}`;
        const convsData = localStorage.getItem(convsKey);
        const convs = convsData ? JSON.parse(convsData) : {};
        const msgCount = Object.values(convs).reduce((acc, msgs) => acc + (Array.isArray(msgs) ? msgs.length : 0), 0);

        const calculatedStats = {
          interactions: msgCount,
          goodVibes: 0, // TODO: calculer depuis le système de bouteilles
          giftsReceived: receivedGifts.length,
          giftsSent: 0,
          salonsJoined: 0,
          dailyStreak: 1,
          positiveRate: 95,
          socialLevel: Math.max(1, Math.floor((currentUser?.points || 0) / 100) + 1)
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
