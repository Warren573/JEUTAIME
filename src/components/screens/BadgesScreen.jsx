import React from 'react';
import { getTitleFromPoints } from '../../config/gameConfig';

export default function BadgesScreen({ currentUser }) {
  const userPoints = currentUser?.points || 0;
  const userTitle = getTitleFromPoints(userPoints);

  // Définition des badges disponibles
  const badges = [
    {
      id: 1,
      icon: '❤️',
      name: 'Cœur tendre',
      description: 'Objectif : tu reçois 5 compliments anonymes',
      unlocked: userPoints >= 100,
      requirement: '5 compliments',
      color: 'var(--color-romantic)'
    },
    {
      id: 2,
      icon: '⭐',
      name: 'Étoile montante',
      description: 'Objectif : atteindre le top 10 du classement',
      unlocked: userPoints >= 500,
      requirement: 'Top 10',
      color: 'var(--color-gold)'
    },
    {
      id: 3,
      icon: '🏆',
      name: 'Champion',
      description: 'Objectif : gagner 10 parties',
      unlocked: userPoints >= 300,
      requirement: '10 victoires',
      color: 'var(--color-gold-light)'
    },
    {
      id: 4,
      icon: '💰',
      name: 'Riche collectionneur',
      description: 'Objectif : accumuler 5000 Julien',
      unlocked: false,
      requirement: '5000 Julien',
      color: 'var(--color-gold)'
    },
    {
      id: 5,
      icon: '🎁',
      name: 'Généreux donateur',
      description: 'Objectif : offrir 20 cadeaux',
      unlocked: userPoints >= 200,
      requirement: '20 cadeaux',
      color: 'var(--color-humorous)'
    },
    {
      id: 6,
      icon: '🏹',
      name: 'Cupidon',
      description: 'Objectif : créer 5 matchs réussis',
      unlocked: false,
      requirement: '5 matchs',
      color: 'var(--color-romantic-light)'
    },
    {
      id: 7,
      icon: '😊',
      name: 'Humoriste',
      description: 'Objectif : faire rire 100 fois',
      unlocked: false,
      requirement: '100 rires',
      color: 'var(--color-humorous-light)'
    },
    {
      id: 8,
      icon: '📝',
      name: 'Écrivain passionné',
      description: 'Objectif : écrire 50 lettres',
      unlocked: userPoints >= 150,
      requirement: '50 lettres',
      color: 'var(--color-brown-light)'
    },
    {
      id: 9,
      icon: '🌹',
      name: 'Romantique incurable',
      description: 'Objectif : échanger 100 lettres romantiques',
      unlocked: false,
      requirement: '100 lettres',
      color: 'var(--color-romantic)'
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  // Calcul du niveau et de la progression
  const level = Math.floor(userPoints / 200) + 1;
  const pointsInLevel = userPoints % 200;
  const progressPercentage = (pointsInLevel / 200) * 100;

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '80px',
      background: 'var(--color-beige-light)'
    }}>
      {/* Section Badges */}
      <div style={{
        background: 'var(--color-brown)',
        padding: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          textAlign: 'center',
          color: 'var(--color-cream)',
          margin: '0 0 var(--spacing-xs) 0',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          BADGES
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-cream)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: '0 0 var(--spacing-sm) 0',
          opacity: 0.9
        }}>
          Collectionnez des badges en accomplissant des défis
        </p>
        <p style={{
          textAlign: 'center',
          fontSize: '1rem',
          color: 'var(--color-tan)',
          margin: 0
        }}>
          {unlockedCount} / {badges.length} badges débloqués
        </p>
      </div>

      {/* Grille de badges */}
      <div style={{ padding: '0 var(--spacing-lg)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)',
          maxWidth: '900px',
          margin: '0 auto var(--spacing-xl) auto'
        }}>
          {badges.map((badge, index) => {
            // Première badge débloqué aura une notification
            const isFirstUnlocked = badge.unlocked && badges.filter((b, i) => b.unlocked && i < index).length === 0;

            return (
              <div
                key={badge.id}
                style={{
                  position: 'relative'
                }}
              >
                {/* Badge notification */}
                {isFirstUnlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '30px',
                    height: '30px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#000',
                    fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                    zIndex: 10,
                    border: '3px solid var(--color-beige-light)'
                  }}>
                    1
                  </div>
                )}

                <div
                  className="card"
                  style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'center',
                    background: badge.unlocked ? badge.color : 'var(--color-brown-light)',
                    border: badge.unlocked
                      ? '3px solid var(--color-gold)'
                      : '3px dashed var(--color-brown)',
                    opacity: badge.unlocked ? 1 : 0.5,
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (badge.unlocked) {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (badge.unlocked) {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }
                  }}
                >
                  {/* Icône du badge */}
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: 'var(--spacing-xs)',
                    filter: badge.unlocked ? 'none' : 'grayscale(1)',
                    position: 'relative'
                  }}>
                    {badge.icon}
                    {!badge.unlocked && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '1.5rem',
                        background: 'var(--color-brown-darker)',
                        borderRadius: '50%',
                        width: '35px',
                        height: '35px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--color-gold)'
                      }}>
                        🔒
                      </div>
                    )}
                  </div>

                  {/* Nom du badge */}
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    margin: 0,
                    color: badge.unlocked ? 'var(--color-brown-dark)' : 'var(--color-tan)',
                    fontWeight: '700',
                    minHeight: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1.2',
                    textAlign: 'center'
                  }}>
                    {badge.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Description du badge sélectionné (exemple pour le premier badge débloqué) */}
        {badges.filter(b => b.unlocked).length > 0 && (
          <div className="card" style={{
            background: 'var(--color-cream)',
            padding: 'var(--spacing-lg)',
            border: '2px solid var(--color-brown-light)',
            marginBottom: 'var(--spacing-xl)',
            maxWidth: '900px',
            margin: '0 auto var(--spacing-xl) auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <div style={{ fontSize: '2.5rem' }}>
                {badges.find(b => b.unlocked)?.icon}
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  margin: 0,
                  color: 'var(--color-text-primary)',
                  fontWeight: '700'
                }}>
                  {badges.find(b => b.unlocked)?.name}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-light)',
                  margin: 0
                }}>
                  Badge débloqué !
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: '1.5',
              fontStyle: 'italic'
            }}>
              {badges.find(b => b.unlocked)?.description}
            </p>
          </div>
        )}

        {/* Section Profil */}
        <div style={{
          background: 'var(--color-friendly)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-xl)',
          border: '3px solid var(--color-friendly-light)',
          boxShadow: 'var(--shadow-xl)',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            textAlign: 'center',
            color: 'var(--color-cream)',
            margin: '0 0 var(--spacing-lg) 0',
            textTransform: 'uppercase'
          }}>
            PROFIL
          </h2>

          {/* Avatar et niveau */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              border: '4px solid var(--color-cream)',
              boxShadow: 'var(--shadow-xl)',
              marginBottom: 'var(--spacing-md)'
            }}>
              {userTitle.emoji}
            </div>

            {/* Niveau */}
            <div style={{
              background: 'var(--color-gold)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              borderRadius: 'var(--border-radius-xl)',
              marginBottom: 'var(--spacing-sm)',
              boxShadow: 'var(--shadow-md)',
              border: '2px solid var(--color-gold-dark)'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                margin: 0,
                color: 'var(--color-brown-dark)',
                fontWeight: '700',
                textAlign: 'center'
              }}>
                NIVEAU {level}
              </h3>
            </div>

            {/* Titre */}
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              color: 'var(--color-cream)',
              margin: 0,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {userTitle.title}
            </h3>
          </div>

          {/* Jauge de progression */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--border-radius-xl)',
            padding: 'var(--spacing-md)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)',
              fontSize: '0.9rem',
              color: 'var(--color-cream)',
              fontWeight: '600'
            }}>
              <span>Progression</span>
              <span>{pointsInLevel} / 200</span>
            </div>
            <div style={{
              width: '100%',
              height: '20px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 'var(--border-radius-xl)',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-gold-light), var(--color-gold))',
                transition: 'width var(--transition-slow)',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
              }} />
            </div>
            <p style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--color-cream)',
              margin: 'var(--spacing-sm) 0 0 0',
              opacity: 0.9
            }}>
              {200 - pointsInLevel} points pour le niveau {level + 1}
            </p>
          </div>

          {/* Stats */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              textAlign: 'center',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: 'var(--color-gold)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {userPoints}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--color-cream)',
                fontWeight: '600'
              }}>
                Points totaux
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              textAlign: 'center',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: 'var(--color-gold)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {unlockedCount}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--color-cream)',
                fontWeight: '600'
              }}>
                Badges gagnés
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
