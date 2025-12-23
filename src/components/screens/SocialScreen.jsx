import React, { useState } from 'react';
import { salons } from '../../data/appData';
import RankingScreen from './RankingScreen';
import AdoptionScreen from './AdoptionScreen';
import MessageBottleModal from '../bottle/MessageBottleModal';
import { getUnreadCount } from '../../utils/bottleSystem';
import {
  proposeExchange,
  getActiveExchangeForBar,
  getUserPendingExchange,
  cancelPendingExchange,
  getBarName,
  getTimeRemaining
} from '../../utils/barExchangeSystem';
import ScreenHeader from '../common/ScreenHeader';

export default function SocialScreen({ socialTab, setSocialTab, setGameScreen, setSelectedSalon, adminMode, isAdminAuthenticated, currentUser, userCoins, setUserCoins, setScreen, setCurrentUser }) {
  const [magicStates, setMagicStates] = useState({});
  const [animatingSalons, setAnimatingSalons] = useState({});
  const [showBottleModal, setShowBottleModal] = useState(false);
  const unreadBottles = getUnreadCount(currentUser?.email);
  const [exchangeRefresh, setExchangeRefresh] = useState(0); // Pour forcer le refresh

  const handleMagicAction = (salon, e) => {
    e.stopPropagation();
    setAnimatingSalons(prev => ({ ...prev, [salon.id]: true }));
    setTimeout(() => {
      setAnimatingSalons(prev => ({ ...prev, [salon.id]: false }));
    }, 1500);

    if (salon.id === 4) {
      const currentState = magicStates[salon.id] || 'normal';
      if (currentState === 'normal') {
        setMagicStates(prev => ({ ...prev, [salon.id]: 'frog' }));
        alert(salon.magicAction.message);
      } else {
        setMagicStates(prev => ({ ...prev, [salon.id]: 'normal' }));
        alert(salon.magicAction.message2);
      }
    } else {
      alert(salon.magicAction.message);
      if (salon.id === 3 && setUserCoins) {
        setUserCoins(prev => prev + 50);
      }
    }
  };

  const handleAdminEditSalon = (salon, e) => {
    e.stopPropagation();
    alert(`Éditer salon: ${salon.name}`);
  };

  const handleAdminDeleteSalon = (salon, e) => {
    e.stopPropagation();
    if (confirm(`Supprimer le salon "${salon.name}" ?`)) {
      alert(`Salon supprimé`);
    }
  };

  const handleAdminCreateSalon = () => {
    alert('Créer un nouveau salon');
  };

  const handleExchange = (salon, e) => {
    e.stopPropagation();

    if (!currentUser) {
      alert('Tu dois être connecté pour proposer un échange !');
      return;
    }

    const result = proposeExchange(salon.id, currentUser.email);

    if (!result.success) {
      alert(result.error);
      return;
    }

    if (result.matchedExchange) {
      // Match trouvé !
      const otherSalon = getBarName(result.matchedExchange.barId);
      alert(`🌀 ÉCHANGE MAGIQUE ! Tu es maintenant dans "${otherSalon}" pour 24h ! Un membre de ce salon rejoint temporairement "${salon.name}" !`);
      setExchangeRefresh(prev => prev + 1); // Forcer le refresh
    } else {
      // En attente
      alert(`🌀 Demande d'échange enregistrée ! Si un autre salon propose un échange, tu seras automatiquement transféré pour 24h ! 🎭`);
      setExchangeRefresh(prev => prev + 1);
    }
  };

  const handleCancelExchange = (pendingExchange, e) => {
    e.stopPropagation();
    cancelPendingExchange(pendingExchange.id, currentUser.email);
    alert('❌ Demande d\'échange annulée');
    setExchangeRefresh(prev => prev + 1);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      {/* Logo Social - Affiché uniquement quand aucun onglet actif */}
      {socialTab === null && (
        <>
          <div style={{ padding: '0 var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
            <ScreenHeader
              icon="👥"
              title="SOCIAL"
              subtitle="Rencontres, jeux et animations"
            />
          </div>

          {/* Bouteille à la mer */}
          <div style={{
            padding: '0 var(--spacing-sm)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <button
              onClick={() => setShowBottleModal(true)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
                border: '2px solid #0277BD',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2,136,209,0.3)',
                position: 'relative',
                minHeight: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📜</span>
              <span>Bouteille à la mer</span>
              {unreadBottles > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#E91E63',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(233,30,99,0.4)'
                }}>
                  {unreadBottles}
                </span>
              )}
            </button>
            {currentUser?.premium && (
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
                <button
                  onClick={handleAdminCreateSalon}
                  className="btn-primary"
                  style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}
                >
                  ➕ Nouveau Salon
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Onglets - Grille uniforme 2x2 - Affichés seulement si pas de tab actif */}
      {socialTab === null && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-sm)',
          overflow: 'hidden',
          minHeight: 0
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 'var(--spacing-sm)',
            width: '100%',
            maxWidth: '600px',
            height: '100%',
            maxHeight: '100%'
          }}>
            {['bars', 'ranking', 'games', 'adoption'].map((tab) => {
              const icons = {
                bars: '✨',
                ranking: '🏆',
                games: '🎮',
                adoption: '🐾'
              };
              const labels = {
                bars: 'Salons',
                ranking: 'Classement',
                games: 'Jeux',
                adoption: 'Adoption'
              };
              return (
                <button
                  key={tab}
                  onClick={() => setSocialTab(tab)}
                  style={{
                    padding: 'var(--spacing-md)',
                    background: 'linear-gradient(135deg, var(--color-brown), var(--color-brown-dark))',
                    border: '3px solid var(--color-gold)',
                    color: 'var(--color-cream)',
                    borderRadius: 'var(--border-radius-xl)',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    transition: 'all var(--transition-normal)',
                    boxShadow: 'var(--shadow-lg)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ fontSize: '3rem' }}>{icons[tab]}</div>
                  <div>{labels[tab]}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bouton retour quand un onglet est sélectionné */}

      {/* Section Bars */}
      {socialTab === 'bars' && (
        <div style={{
          padding: '0 var(--spacing-sm)',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          flex: 1,
          overflow: 'auto'
        }}>
          <ScreenHeader
            icon="✨"
            title="SALONS"
            subtitle="Écrivez des histoires ensemble • Une phrase chacun • Timer 24h"
          />

          {/* Bouton vers liste complète des salons magiques */}
          <button
            onClick={() => setScreen('bars')}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)',
              background: 'linear-gradient(135deg, #7B1FA2, #4A148C)',
              border: '3px solid #FFD700',
              borderRadius: 'var(--border-radius-lg)',
              color: '#FFD700',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(123, 31, 162, 0.4)',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxSizing: 'border-box'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            Voir tous les Salons Magiques
            <span style={{
              background: '#FFD700',
              color: '#000',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>NOUVEAU</span>
          </button>

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
              ✨ CARTE DES SALONS ✨
            </h2>
          </div>

          {/* Grille des salons */}
          <div style={{
            background: 'linear-gradient(180deg, var(--color-gold-light), var(--color-tan))',
            borderRadius: 'var(--border-radius-xl)',
            padding: 'var(--spacing-xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '4px solid var(--color-brown)',
            position: 'relative',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139, 111, 71, 0.05) 10px, rgba(139, 111, 71, 0.05) 20px)'
          }}>
            {salons.map((salon, index) => {
              const positions = [
                { top: '10%', left: '15%' },
                { top: '45%', right: '15%' },
                { bottom: '15%', left: '20%' }
              ];
              const pos = positions[index % 3];

              return (
                <div
                  key={salon.id}
                  onClick={() => setSelectedSalon(salon.id)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    marginBottom: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: salon.bgGradient || 'var(--color-cream)',
                    border: '3px solid rgba(255,255,255,0.5)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: animatingSalons[salon.id]
                      ? '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)'
                      : 'var(--shadow-lg)',
                    transition: 'all var(--transition-normal)',
                    position: 'relative',
                    transform: animatingSalons[salon.id] ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!animatingSalons[salon.id]) {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!animatingSalons[salon.id]) {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-md)'
                  }}>
                    <div style={{
                      fontSize: '2.5rem',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      flexShrink: 0
                    }}>
                      {salon.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        margin: '0 0 var(--spacing-xs) 0',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                      }}>
                        {salon.name}
                      </h3>
                      <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '0.875rem',
                        margin: '0 0 var(--spacing-sm) 0',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}>
                        {salon.desc}
                      </p>

                      {salon.magicAction && (
                        <button
                          onClick={(e) => handleMagicAction(salon, e)}
                          style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '3px solid rgba(255, 215, 0, 0.8)',
                            borderRadius: 'var(--border-radius-md)',
                            padding: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-xs)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            color: '#000',
                            minHeight: '48px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,215,0,0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                          }}
                        >
                          <span style={{ fontSize: '2rem' }}>
                            {magicStates[salon.id] === 'frog' ? salon.magicAction.secondEmoji : salon.magicAction.emoji}
                          </span>
                          <div style={{ flex: 1, textAlign: 'left' }}>
                            {magicStates[salon.id] === 'frog' ? 'Donner un bisou 💋' : salon.magicAction.name}
                          </div>
                          <span style={{ fontSize: '1.5rem' }}>✨</span>
                        </button>
                      )}

                      {/* Bouton Échanger */}
                      {(() => {
                        const activeExchange = getActiveExchangeForBar(salon.id);
                        const pendingExchange = getUserPendingExchange(currentUser?.email);

                        if (activeExchange) {
                          return (
                            <div style={{
                              width: '100%',
                              background: 'rgba(76, 175, 80, 0.95)',
                              border: '3px solid rgba(46, 125, 50, 0.8)',
                              borderRadius: 'var(--border-radius-md)',
                              padding: 'var(--spacing-sm)',
                              marginBottom: 'var(--spacing-sm)',
                              textAlign: 'center',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '0.85rem'
                            }}>
                              🌀 Échange actif avec {getBarName(activeExchange.bar1Id === salon.id ? activeExchange.bar2Id : activeExchange.bar1Id)}
                              <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.9 }}>
                                Temps restant : {getTimeRemaining(activeExchange)}
                              </div>
                            </div>
                          );
                        }

                        if (pendingExchange && pendingExchange.barId === salon.id) {
                          return (
                            <button
                              onClick={(e) => handleCancelExchange(pendingExchange, e)}
                              style={{
                                width: '100%',
                                background: 'rgba(255, 152, 0, 0.95)',
                                border: '3px solid rgba(230, 81, 0, 0.8)',
                                borderRadius: 'var(--border-radius-md)',
                                padding: 'var(--spacing-sm)',
                                marginBottom: 'var(--spacing-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                color: 'white',
                                minHeight: '48px'
                              }}
                            >
                              <span style={{ fontSize: '1.5rem' }}>⏳</span>
                              <div style={{ flex: 1, textAlign: 'left' }}>
                                En attente d'un match...
                              </div>
                              <span style={{ fontSize: '1.2rem' }}>❌</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={(e) => handleExchange(salon, e)}
                            style={{
                              width: '100%',
                              background: 'rgba(156, 39, 176, 0.95)',
                              border: '3px solid rgba(123, 31, 162, 0.8)',
                              borderRadius: 'var(--border-radius-md)',
                              padding: 'var(--spacing-sm)',
                              marginBottom: 'var(--spacing-sm)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-sm)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                              color: 'white',
                              minHeight: '48px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(156,39,176,0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                          >
                            <span style={{ fontSize: '2rem' }}>🌀</span>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                              Échanger de salon
                            </div>
                            <span style={{ fontSize: '1.5rem' }}>🎭</span>
                          </button>
                        );
                      })()}

                      <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-xs)',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        {salon.participants.slice(0, 5).map((p, idx) => (
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
                        {salon.participants.length > 5 && (
                          <div style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-light)',
                            fontWeight: '600'
                          }}>
                            +{salon.participants.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

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
                      setSelectedSalon(salon.id);
                    }}
                  >
                    💬 Discuter
                  </button>

                  {adminMode && isAdminAuthenticated && (
                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-xs)',
                      marginTop: 'var(--spacing-sm)',
                      paddingTop: 'var(--spacing-sm)',
                      borderTop: '2px solid var(--color-tan)'
                    }}>
                      <button
                        onClick={(e) => handleAdminEditSalon(salon, e)}
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
                        onClick={(e) => handleAdminDeleteSalon(salon, e)}
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
        <div style={{ flex: 1, overflow: 'auto' }}>
          <RankingScreen currentUser={currentUser} isEmbedded={true} />
        </div>
      )}

      {socialTab === 'adoption' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <AdoptionScreen currentUser={currentUser} userCoins={userCoins} setUserCoins={setUserCoins} setCurrentUser={setCurrentUser} isEmbedded={true} />
        </div>
      )}

      {socialTab === 'games' && (
        <div style={{
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 var(--spacing-sm)',
          boxSizing: 'border-box'
        }}>
          <div style={{ flexShrink: 0 }}>
            <ScreenHeader
              icon="🎮"
              title="JEUX"
              subtitle="Joue et gagne des pièces !"
            />
          </div>

          <div style={{
            flex: 1,
            overflow: 'auto',
            paddingBottom: 'var(--spacing-sm)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
            <div onClick={() => setGameScreen('reactivity')} style={{ background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚡</div>
              <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Tape Taupe</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>Solo</p>
            </div>
            <div onClick={() => setGameScreen('pong')} style={{ background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎮</div>
              <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Pong</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>2 joueurs</p>
            </div>
            <div onClick={() => setGameScreen('brickbreaker')} style={{ background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🧱</div>
              <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Casse Brique</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>Solo</p>
            </div>
            <div onClick={() => setGameScreen('morpion')} style={{ background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>⭕</div>
              <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Morpion</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>2 joueurs</p>
            </div>
            <div onClick={() => setGameScreen('storytime')} style={{ background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>📖</div>
              <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Continue l'histoire</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>Solo, 2 joueurs ou multijoueurs</p>
            </div>
            <div onClick={() => setGameScreen('cards')} style={{ background: 'var(--color-cream)', border: '2px solid var(--color-brown-light)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎴</div>
              <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>Jeu des Cartes</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>Solo - Gagne des pièces!</p>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bouteille à la mer */}
      {showBottleModal && (
        <MessageBottleModal
          currentUser={currentUser}
          onClose={() => setShowBottleModal(false)}
        />
      )}
    </div>
  );
}
