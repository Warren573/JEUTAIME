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
          {/* Introduction */}
          <div style={{ marginBottom: '24px', textAlign: 'center', fontStyle: 'italic', padding: '16px', background: 'var(--color-beige-light)', borderRadius: '10px' }}>
            <p style={{ margin: '8px 0', fontSize: '1.15rem', fontWeight: '700' }}>Bienvenue sur JeuTaime 💖</p>
            <p style={{ margin: '8px 0' }}>JeuTaime, c'est une appli de rencontres qui mise sur les mots, pas sur les photos.</p>
            <p style={{ margin: '8px 0' }}>Ici, tu découvres les gens avant de les voir. Le charme passe par la plume.</p>
          </div>

          {/* But du jeu */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>🎯 LE BUT DU JEU</h4>
            <p style={{ margin: '8px 0' }}>Pas de swipe. Pas de collection de profils. Le vrai but ici :</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>Écrire de belles lettres</li>
              <li>Participer aux salons</li>
              <li>Jouer et gagner des pièces</li>
              <li>Créer de vraies connexions</li>
            </ul>
            <p style={{ margin: '10px 0', fontWeight: '700' }}>👉 Plus tu t'impliques, plus tu progresses — et plus tu deviens visible.</p>
          </div>

          {/* Lettres */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>💌 LES LETTRES — LE CŒUR DE L'APP</h4>
            <p style={{ margin: '8px 0' }}>L'échange de lettres est la mécanique principale. Chaque lettre compte.</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>Envoyer une lettre : <strong>+10 points</strong></li>
              <li>Recevoir une réponse : <strong>+15 points</strong></li>
            </ul>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>🔓 Déverrouillage des photos</p>
            <p style={{ margin: '8px 0' }}>Les photos de profil sont floues au départ. Elles se dévoilent progressivement :</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>Photo 1 : après 10 lettres échangées</li>
              <li>Photo 2 : après 20 lettres échangées</li>
              <li>Photo 3 : après 30 lettres échangées</li>
            </ul>
            <p style={{ margin: '10px 0', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>La personnalité d'abord. L'image ensuite.</p>
          </div>

          {/* Sourires & Grimaces */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>😊 SOURIRES & 😬 GRIMACES</h4>
            <p style={{ margin: '8px 0' }}>En parcourant les profils, tu peux exprimer ta réaction :</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>😊 <strong>Sourire</strong> : ce profil m'attire, j'aime sa vibe</li>
              <li>😬 <strong>Grimace</strong> : pas pour moi, on passe</li>
            </ul>
            <p style={{ margin: '8px 0', fontWeight: '600' }}>Effets sur les points :</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>Tu envoies un sourire : <strong>+5 pts</strong></li>
              <li>Tu reçois un sourire : <strong>+10 pts</strong></li>
              <li>Tu reçois une grimace : <strong>−5 pts</strong></li>
            </ul>
          </div>

          {/* Matchs */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>💘 LES MATCHS</h4>
            <p style={{ margin: '8px 0' }}>Deux sourires mutuels = un match ! Un questionnaire de compatibilité le confirme.</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>Bonus match : <strong>+50 pts chacun</strong></li>
              <li>Le questionnaire permet de découvrir si vous vous correspondez vraiment</li>
            </ul>
          </div>

          {/* Salons */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>🏛️ LES SALONS DE DISCUSSION</h4>
            <p style={{ margin: '8px 0' }}>5 salons thématiques pour rencontrer la communauté :</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>🌹 Salon Romantique — pour les cœurs tendres</li>
              <li>😄 Salon Humoristique — rires et légèreté</li>
              <li>🏴‍☠️ Salon Pirates — esprit aventurier</li>
              <li>📅 Salon Hebdomadaire — événements de la semaine</li>
              <li>👑 Salon Caché — accès Premium uniquement</li>
            </ul>
            <p style={{ margin: '8px 0', fontWeight: '600' }}>📖 Histoires collectives :</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>Ajouter une phrase : <strong>+5 pts</strong></li>
              <li>Histoire complétée : <strong>+50 pts</strong> pour tous les participants</li>
            </ul>
          </div>

          {/* Mini-jeux */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>🎮 LES MINI-JEUX</h4>
            <p style={{ margin: '8px 0' }}>6 jeux pour gagner des pièces et passer du bon temps :</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>🐭 <strong>Tape Taupe</strong> — réflexes solo (30 secondes)</li>
              <li>🏓 <strong>Pong</strong> — classique à 2 joueurs</li>
              <li>❌ <strong>Morpion</strong> — stratégie à 2 joueurs</li>
              <li>🃏 <strong>Jeu des Cartes</strong> — hasard, tout risquer ou tout gagner</li>
              <li>📖 <strong>Continue l'Histoire</strong> — narration collaborative</li>
              <li>🧱 <strong>Casse-Brique</strong> — arcade solo</li>
            </ul>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>Victoire : <strong>+50 pts</strong></li>
              <li>Défaite : <strong>−10 pts</strong></li>
            </ul>
          </div>

          {/* Animal virtuel */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>🐾 TON COMPAGNON VIRTUEL</h4>
            <p style={{ margin: '8px 0' }}>Adopte un animal et prends soin de lui — il rend ton profil vivant.</p>
            <p style={{ margin: '8px 0' }}>4 jauges à surveiller : 🍽️ Faim · 😊 Bonheur · ⚡ Énergie · 🧼 Propreté</p>
            <p style={{ margin: '8px 0', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>Ton compagnon réagit à tes actions et s'exprime sur ton profil public.</p>
          </div>

          {/* Points & Badges */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>🏅 POINTS, NIVEAUX & BADGES</h4>
            <p style={{ margin: '8px 0' }}>Chaque interaction te rapporte des points. Les points font monter ton niveau et débloquent des badges.</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>Lettre envoyée : <strong>+10 pts</strong></li>
              <li>Participation salon : <strong>+15 pts</strong></li>
              <li>Partie jouée : <strong>+5 pts</strong></li>
              <li>Match validé : <strong>+50 pts</strong></li>
            </ul>
            <p style={{ margin: '8px 0', fontWeight: '600' }}>🌟 Profil de la semaine</p>
            <p style={{ margin: '8px 0' }}>Chaque semaine, 1 profil féminin et 1 profil masculin sont mis en avant par la communauté.</p>
          </div>

          {/* Cadeaux */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.15rem', marginBottom: '10px' }}>🎁 OFFRANDES & MAGIE</h4>
            <p style={{ margin: '8px 0' }}>Utilise tes pièces pour envoyer des offrandes et marquer les esprits :</p>
            <ul style={{ marginLeft: '20px', margin: '8px 0 8px 20px' }}>
              <li>🌹 Rose — 50 pièces</li>
              <li>💜 Philtre d'amour — 100 pièces</li>
              <li>💐 Bouquet — 150 pièces</li>
              <li>🍾 Champagne — 200 pièces</li>
              <li>🍫 Chocolats — 75 pièces</li>
            </ul>
            <p style={{ margin: '8px 0', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>Les sorts magiques ajoutent une touche de fantaisie dans les salons.</p>
          </div>

          {/* Esprit */}
          <div style={{
            marginTop: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, #fff5f8, #ffeef5)',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid var(--color-tan)'
          }}>
            <h4 style={{ color: 'var(--color-romantic)', fontSize: '1.2rem', marginBottom: '14px' }}>❤️ L'ESPRIT JEUTAIME</h4>
            <p style={{ margin: '8px 0', fontWeight: '600' }}>✍️ Prendre le temps d'écrire</p>
            <p style={{ margin: '8px 0', fontWeight: '600' }}>🤝 Interagir avec sincérité</p>
            <p style={{ margin: '8px 0', fontWeight: '600' }}>🎲 Jouer pour créer du lien</p>
            <p style={{ margin: '8px 0', fontWeight: '600' }}>🌱 Laisser la relation se construire naturellement</p>
            <p style={{ margin: '18px 0 0', fontSize: '1.1rem' }}>Bienvenue dans le jeu 💖</p>
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
