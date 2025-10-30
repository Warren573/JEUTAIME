import React from 'react';
import { bars } from '../../data/appData';
import RankingScreen from './RankingScreen';
import AdoptionScreen from './AdoptionScreen';

export default function SocialScreen({ socialTab, setSocialTab, setGameScreen, setSelectedBar, adminMode, isAdminAuthenticated, currentUser, userCoins, setUserCoins }) {
  const handleAdminEditBar = (bar, e) => {
    e.stopPropagation();
    alert(`Éditer bar: ${bar.name}`);
  };

  const handleAdminDeleteBar = (bar, e) => {
    e.stopPropagation();
    if (confirm(`Supprimer le bar "${bar.name}" ?`)) {
      alert(`Bar supprimé`);
    }
  };

  const handleAdminCreateBar = () => {
    alert('Créer un nouveau bar');
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: '100px',
      background: 'var(--color-beige-light)'
    }}>
      {/* En-tête style Journal */}
      <div style={{
        background: 'var(--color-cream)',
        borderBottom: '4px double var(--color-brown-dark)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          textAlign: 'center',
          margin: '0 0 var(--spacing-xs) 0',
          color: 'var(--color-brown-dark)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          borderBottom: '2px solid var(--color-gold)',
          paddingBottom: 'var(--spacing-xs)'
        }}>
          👥 Social
        </h1>
        {adminMode && isAdminAuthenticated && socialTab === 'bars' && (
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
            <button
              onClick={handleAdminCreateBar}
              className="btn-primary"
              style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: '0.875rem' }}
            >
              ➕ Nouveau Bar
            </button>
          </div>
        )}
      </div>

      {/* Onglets - Corrigé pour éviter le débordement */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-xs)',
        padding: '0 var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        justifyContent: 'center'
      }}>
        {['bars', 'ranking', 'games', 'adoption'].map((tab) => {
          const isActive = socialTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setSocialTab(tab)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: isActive
                  ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                  : 'var(--color-brown)',
                border: isActive ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
                color: isActive ? 'var(--color-brown-dark)' : 'var(--color-cream)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all var(--transition-normal)',
                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                minWidth: 'fit-content'
              }}
            >
              {tab === 'bars' && '🍸 Bars'}
              {tab === 'ranking' && '🏆 Classement'}
              {tab === 'games' && '🎮 Jeux'}
              {tab === 'adoption' && '🐾 Adoption'}
            </button>
          );
        })}
      </div>

      {/* Section Bars - Carte stylisée selon BARS.png */}
      {socialTab === 'bars' && (
        <div style={{
          padding: '0 var(--spacing-lg)',
          position: 'relative'
        }}>
          {/* Titre section */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-lg)',
            background: 'linear-gradient(180deg, var(--color-gold-light), var(--color-gold))',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              color: 'var(--color-brown-dark)',
              margin: 0,
              textShadow: '1px 1px 2px rgba(255,255,255,0.5)'
            }}>
              ☀️ CARTE DES BARS ☀️
            </h2>
          </div>

          {/* Grille des bars - Style carte illustrée */}
          <div style={{
            background: 'linear-gradient(180deg, var(--color-gold-light), var(--color-tan))',
            borderRadius: 'var(--border-radius-xl)',
            padding: 'var(--spacing-xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '4px solid var(--color-brown)',
            position: 'relative',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139, 111, 71, 0.05) 10px, rgba(139, 111, 71, 0.05) 20px)'
          }}>
            {bars.map((bar, index) => {
              // Positionnement différent pour chaque bar (effet carte)
              const positions = [
                { top: '10%', left: '15%' },
                { top: '45%', right: '15%' },
                { bottom: '15%', left: '20%' }
              ];
              const pos = positions[index % 3];

              return (
                <div
                  key={bar.id}
                  onClick={() => setSelectedBar(bar.id)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    marginBottom: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-cream)',
                    border: '3px solid var(--color-brown)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    transition: 'all var(--transition-normal)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                >
                  {/* Ligne 1: Icône + Infos */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-md)'
                  }}>
                    {/* Icône du bar */}
                    <div style={{
                      fontSize: '2.5rem',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      flexShrink: 0
                    }}>
                      {bar.icon}
                    </div>

                    {/* Infos du bar */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        margin: '0 0 var(--spacing-xs) 0',
                        color: 'var(--color-text-primary)',
                        fontWeight: '700'
                      }}>
                        {bar.name}
                      </h3>
                      <p style={{
                        color: 'var(--color-text-light)',
                        fontSize: '0.875rem',
                        margin: '0 0 var(--spacing-sm) 0'
                      }}>
                        {bar.desc}
                      </p>

                      {/* Participants */}
                      <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-xs)',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        {bar.participants.slice(0, 5).map((p, idx) => (
                          <div
                            key={idx}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: p.online
                                ? 'linear-gradient(135deg, var(--color-friendly-light), var(--color-friendly))'
                                : 'var(--color-brown-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1rem',
                              border: '2px solid var(--color-cream)',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            {p.gender === 'F' ? '👩' : '👨'}
                          </div>
                        ))}
                        {bar.participants.length > 5 && (
                          <div style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-light)',
                            fontWeight: '600'
                          }}>
                            +{bar.participants.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ligne 2: Bouton Discuter */}
                  <button
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      fontSize: '0.875rem',
                      fontWeight: '700'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBar(bar.id);
                    }}
                  >
                    💬 Discuter
                  </button>

                  {/* Admin Actions */}
                  {adminMode && isAdminAuthenticated && (
                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-xs)',
                      marginTop: 'var(--spacing-sm)',
                      paddingTop: 'var(--spacing-sm)',
                      borderTop: '2px solid var(--color-tan)'
                    }}>
                      <button
                        onClick={(e) => handleAdminEditBar(bar, e)}
                        style={{
                          flex: 1,
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          background: 'var(--color-info)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-sm)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Éditer
                      </button>
                      <button
                        onClick={(e) => handleAdminDeleteBar(bar, e)}
                        style={{
                          flex: 1,
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          background: 'var(--color-error)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-sm)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {socialTab === 'ranking' && (
        <RankingScreen currentUser={currentUser} />
      )}

      {socialTab === 'adoption' && (
        <AdoptionScreen currentUser={currentUser} userCoins={userCoins} setUserCoins={setUserCoins} />
      )}

      {socialTab === 'games' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div onClick={() => setGameScreen('reactivity')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚡</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Tape la Taupe</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Solo</p>
          </div>
          <div onClick={() => setGameScreen('pong')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎮</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Pong</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>2 joueurs</p>
          </div>
          <div onClick={() => setGameScreen('brickbreaker')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🧱</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Casse Brique</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Solo</p>
          </div>
          <div onClick={() => setGameScreen('morpion')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>⭕</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Morpion</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>2 joueurs</p>
          </div>
          <div onClick={() => setGameScreen('storytime')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📖</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Continue l'histoire</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Solo, 2 joueurs ou multijoueurs</p>
          </div>
          <div onClick={() => setGameScreen('cards')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎴</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Jeu des Cartes</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Solo - Gagne des pièces!</p>
          </div>
          <div onClick={() => setGameScreen('herolove')} style={{ background: 'linear-gradient(135deg, #E91E63, #C2185B)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1', border: '3px solid #FFD700', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '5px', right: '5px', background: '#FFD700', color: '#000', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold' }}>NEW!</div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎮</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>HeroLove Quest</h4>
            <p style={{ fontSize: '11px', color: '#fff', margin: 0 }}>Aventure RPG romantique - Gagne des pièces!</p>
          </div>
          <div onClick={() => setGameScreen('empires-iso')} style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1', border: '3px solid #fef3c7', position: 'relative', boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)' }}>
            <div style={{ position: 'absolute', top: '5px', right: '5px', background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold' }}>FANTASY</div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏰✨</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '700', color: '#fff' }}>Empires d'Étheria</h4>
            <p style={{ fontSize: '11px', color: '#fef3c7', margin: 0, fontWeight: '500' }}>Plateau isométrique fantasy - Multi-joueurs asynchrone!</p>
          </div>
          <div onClick={() => setGameScreen('piratemonopoly')} style={{ background: 'linear-gradient(135deg, #8B4513, #2c1810)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1', border: '3px solid #FFD700', position: 'relative', boxShadow: '0 10px 30px rgba(139, 69, 19, 0.4)' }}>
            <div style={{ position: 'absolute', top: '5px', right: '5px', background: '#FFD700', color: '#000', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold' }}>NEW!</div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏴‍☠️💰</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '700', color: '#FFD700' }}>Monopoly Pirate</h4>
            <p style={{ fontSize: '11px', color: '#f4e8d0', margin: 0, fontWeight: '500' }}>Jeu de plateau pirate - 2 à 4 joueurs!</p>
          </div>
        </div>
      )}

      {socialTab === 'adoption' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🐱</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Minou</h4>
            <button style={{ width: '100%', padding: '6px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Adopter</button>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🐶</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Chouchou</h4>
            <button style={{ width: '100%', padding: '6px', background: '#2196F3', border: 'none', color: 'white', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Adopter</button>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🦜</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Perroquets</h4>
            <button style={{ width: '100%', padding: '6px', background: '#9C27B0', border: 'none', color: 'white', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Adopter</button>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🦆</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Cancan</h4>
            <button style={{ width: '100%', padding: '6px', background: '#FF9800', border: 'none', color: 'white', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Adopter</button>
          </div>
        </div>
      )}

      {socialTab === 'contest' && (
        <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '25px' }}>
          <div style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', borderRadius: '12px', padding: '15px', marginBottom: '20px', textAlign: 'center', color: '#000', fontWeight: 'bold' }}>
            📅 Semaine du 14-20 Octobre
          </div>

          <div style={{ background: '#0a0a0a', borderRadius: '15px', padding: '15px', marginBottom: '15px', border: '2px solid #E91E63', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👸</div>
            <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', fontWeight: '600' }}>⭐ La Plus Captivante</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: '0 0 12px 0' }}>Sophie Lauren • 1,247 votes 🔥</p>
            <button style={{ width: '100%', padding: '10px', background: '#E91E63', border: 'none', color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
              💬 Découvrir
            </button>
          </div>

          <div style={{ background: '#0a0a0a', borderRadius: '15px', padding: '15px', border: '2px solid #2196F3', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🤴</div>
            <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', fontWeight: '600' }}>⭐ Le Plus Séduisant</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: '0 0 12px 0' }}>Thomas Architects • 987 votes 🔥</p>
            <button style={{ width: '100%', padding: '10px', background: '#2196F3', border: 'none', color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
              💬 Découvrir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
