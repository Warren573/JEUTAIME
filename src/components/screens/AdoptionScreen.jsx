import React, { useState, useEffect } from 'react';
import {
  PETS,
  getUserPets,
  adoptPet,
  feedPet,
  playWithPet,
  cleanPet,
  putPetToSleep,
  getPetStatus,
  getPetInteraction
} from '../../utils/petsSystem';
import PetAdoptCard from '../pets/PetAdoptCard';
import PetIncarnateCard from '../pets/PetIncarnateCard';
import StatBar from '../pets/StatBar';

export default function AdoptionScreen({ currentUser, userCoins, setUserCoins, setCurrentUser, isEmbedded = false, onBack }) {
  const [adoptionTab, setAdoptionTab] = useState('adopt'); // 'adopt', 'incarnate'
  const [myPets, setMyPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [interactionMessage, setInteractionMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Charger les animaux de l'utilisateur
  useEffect(() => {
    if (currentUser?.email) {
      const pets = getUserPets(currentUser.email);
      setMyPets(pets);
      if (pets.length > 0 && !selectedPet) {
        setSelectedPet(pets[0]);
      }
    }
  }, [currentUser, refreshKey]);

  // Rafraîchir toutes les 30 secondes pour mettre à jour les stats
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Incarner un animal (adopter + incarner en une seule action)
  const handleAdopt = (petId) => {
    // Vérifier qu'on n'a pas déjà un animal
    if (myPets.length >= 1) {
      alert('❌ Tu ne peux avoir qu\'une seule incarnation à la fois !\n\nDésincarne-toi d\'abord avant de choisir une nouvelle forme.');
      return;
    }

    const result = adoptPet(currentUser.email, petId);

    if (result.success) {
      setUserCoins(result.coinsRemaining);

      // Incarner automatiquement l'animal adopté
      const pet = PETS[petId];
      const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
      const userIndex = users.findIndex(u => u.email === currentUser.email);

      if (userIndex !== -1) {
        users[userIndex].incarnatedAs = {
          petId: pet.id,
          emoji: pet.emoji,
          name: pet.name,
          since: new Date().toISOString()
        };
        localStorage.setItem('jeutaime_users', JSON.stringify(users));

        if (setCurrentUser) {
          setCurrentUser({...users[userIndex]});
        }
      }

      setRefreshKey(prev => prev + 1);
      alert(`🎭 Transformation réussie !\n\nTu es maintenant incarné en ${result.pet.name} ${pet.emoji}\n\nPrends-en bien soin en le nourrissant, jouant avec lui, et en le gardant propre et reposé.`);
      setAdoptionTab('mypets');
      setSelectedPet(result.pet);
    } else {
      alert(`❌ ${result.error}`);
    }
  };

  // Actions sur l'animal
  const handleFeed = () => {
    const result = feedPet(currentUser.email, selectedPet.id);
    if (result.success) {
      setSelectedPet(result.pet);
      setRefreshKey(prev => prev + 1);
      const message = getPetInteraction(result.pet.type);
      setInteractionMessage(`${message}\n\n🍽️ +40 Faim | +10 Bonheur | +5 Exp\n💰 +2 points +5 coins`);
      setTimeout(() => setInteractionMessage(''), 4000);
    }
  };

  const handlePlay = () => {
    const result = playWithPet(currentUser.email, selectedPet.id);
    if (result.success) {
      setSelectedPet(result.pet);
      setRefreshKey(prev => prev + 1);
      const message = getPetInteraction(result.pet.type);
      setInteractionMessage(`${message}\n\n🎮 +30 Bonheur | -15 Énergie | +8 Exp\n💰 +3 points +8 coins`);
      setTimeout(() => setInteractionMessage(''), 4000);
    }
  };

  const handleClean = () => {
    const result = cleanPet(currentUser.email, selectedPet.id);
    if (result.success) {
      setSelectedPet(result.pet);
      setRefreshKey(prev => prev + 1);
      const message = getPetInteraction(result.pet.type);
      setInteractionMessage(`${message}\n\n🧼 +100 Propreté | +15 Bonheur | +5 Exp\n💰 +2 points +5 coins`);
      setTimeout(() => setInteractionMessage(''), 4000);
    }
  };

  const handleSleep = () => {
    const result = putPetToSleep(currentUser.email, selectedPet.id);
    if (result.success) {
      setSelectedPet(result.pet);
      setRefreshKey(prev => prev + 1);
      const message = getPetInteraction(result.pet.type);
      setInteractionMessage(`${message}\n\n😴 +100 Énergie | +5 Exp\n💰 +2 points +5 coins`);
      setTimeout(() => setInteractionMessage(''), 4000);
    }
  };

  // Incarner un animal (devenir l'animal)
  const handleIncarnate = (petId) => {
    const pet = PETS[petId];
    if (!pet) return;

    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      // Changer l'avatar de l'utilisateur pour l'emoji de l'animal
      users[userIndex].incarnatedAs = {
        petId: pet.id,
        emoji: pet.emoji,
        name: pet.name,
        since: new Date().toISOString()
      };

      localStorage.setItem('jeutaime_users', JSON.stringify(users));

      // Mettre à jour currentUser
      if (setCurrentUser) {
        setCurrentUser({...users[userIndex]});
      }

      alert(`🎭 Transformation réussie !\n\nVous êtes maintenant un ${pet.name} ${pet.emoji}\n\nVotre avatar et votre profil reflètent maintenant votre nouvelle forme !`);
      setAdoptionTab('mypets');
    }
  };

  // StatBar est importé depuis ../pets/StatBar

  const getPetData = (petType) => {
    return Object.values(PETS).find(p => p.id === petType);
  };

  // Style pour le container principal
  const containerStyle = isEmbedded ? {
    height: '100%',
    overflowY: 'auto',
    background: 'var(--color-beige-light)'
  } : {
    minHeight: '100dvh',
    maxHeight: '100dvh',
    overflowY: 'auto',
    paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
    background: 'var(--color-beige-light)',
    display: 'flex',
    flexDirection: 'column'
  };

  // Style pour le header selon le mode
  const headerStyle = {
    background: 'var(--color-cream)',
    borderBottom: '4px double var(--color-brown-dark)',
    padding: isEmbedded ? 'var(--spacing-lg)' : 'var(--spacing-lg)',
    paddingTop: isEmbedded ? 'var(--spacing-lg)' : 'calc(var(--spacing-lg) + env(safe-area-inset-top))',
    marginBottom: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-md)'
  };

  return (
    <div style={containerStyle}>
      {/* En-tête */}
      <div style={{...headerStyle, position: 'relative'}}>
        {/* Bouton retour optionnel */}
        {isEmbedded && onBack && (
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '3px solid var(--color-brown-dark)',
              background: 'white',
              color: 'var(--color-brown-dark)',
              fontSize: '20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 100,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-gold)';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ←
          </button>
        )}

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          textAlign: 'center',
          margin: '0 0 var(--spacing-xs) 0',
          color: 'var(--color-brown-dark)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          borderBottom: '2px solid var(--color-text-primary)',
          paddingBottom: 'var(--spacing-xs)',
          paddingLeft: (isEmbedded && onBack) ? '50px' : '0',
          paddingRight: (isEmbedded && onBack) ? '50px' : '0'
        }}>
          🐾 Adoption
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          margin: 'var(--spacing-sm) 0 0 0'
        }}>
          Adoptez et prenez soin de vos compagnons virtuels
        </p>
      </div>

      {/* Section d'introduction et règles */}
      <div style={{
        padding: '0 var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
          borderRadius: 'var(--border-radius-xl)',
          padding: 'var(--spacing-lg)',
          border: '3px solid var(--color-brown-light)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Illustration SPA style */}
          <div style={{
            textAlign: 'center',
            fontSize: '4rem',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <span>🐶</span>
            <span>🐱</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--color-brown-dark)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-md)',
            borderBottom: '2px solid var(--color-brown-light)',
            paddingBottom: 'var(--spacing-sm)'
          }}>
            🏠 Refuge d'Animaux Virtuels
          </h2>

          <div style={{
            background: 'white',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)'
          }}>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--spacing-sm) 0'
            }}>
              Bienvenue au refuge ! Ici, tu peux adopter un compagnon virtuel et en prendre soin.
              Chaque animal a sa personnalité et ses besoins uniques.
            </p>
          </div>

          <div style={{
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            borderLeft: '4px solid #667eea'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--color-brown-dark)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              📋 Règles du jeu
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: 'var(--color-text-primary)',
              fontSize: '0.9rem',
              lineHeight: '1.8'
            }}>
              <li><strong>Adopte</strong> un animal avec tes pièces 🪙</li>
              <li><strong>Incarne-toi</strong> en ton animal préféré pour changer d'avatar 🎭</li>
              <li><strong>Nourris, joue et nettoie</strong> ton animal pour maintenir ses stats 💪</li>
              <li><strong>Gagne de l'XP</strong> et fais monter ton animal de niveau ⭐</li>
              <li><strong>Attention !</strong> Les stats baissent avec le temps - reviens régulièrement ⏰</li>
              <li>Tu ne peux avoir qu'<strong>une seule incarnation</strong> à la fois 🐾</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-lg)',
        padding: '0 var(--spacing-sm)',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setAdoptionTab('adopt')}
          style={{
            flex: 1,
            minWidth: '150px',
            maxWidth: '200px',
            padding: 'var(--spacing-md)',
            background: adoptionTab === 'adopt'
              ? 'linear-gradient(135deg, #667eea, #764ba2)'
              : 'var(--color-brown-light)',
            border: 'none',
            borderRadius: 'var(--border-radius-lg)',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: adoptionTab === 'adopt' ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
        >
          🏠 Adopter
        </button>
        <button
          onClick={() => setAdoptionTab('incarnate')}
          style={{
            flex: 1,
            minWidth: '150px',
            maxWidth: '200px',
            padding: 'var(--spacing-md)',
            background: adoptionTab === 'incarnate'
              ? 'linear-gradient(135deg, #f093fb, #f5576c)'
              : 'var(--color-brown-light)',
            border: 'none',
            borderRadius: 'var(--border-radius-lg)',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: adoptionTab === 'incarnate' ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
        >
          🎭 Incarner
        </button>
      </div>

      {/* Mon animal adopté/incarné - toujours visible */}
      {myPets.length > 0 && selectedPet && (
        <div style={{ padding: '0 var(--spacing-sm)', width: '100%', boxSizing: 'border-box', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-xl)',
            padding: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-lg)',
            border: '3px solid var(--color-brown)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background décoratif */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15), transparent)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            {/* Header avec animal */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-lg)',
              position: 'relative'
            }}>
              {currentUser?.incarnatedAs?.petId === selectedPet.type && (
                <div style={{
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  marginBottom: 'var(--spacing-sm)',
                  boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  🎭 Tu es incarné
                </div>
              )}

              <div style={{ fontSize: '100px', marginBottom: 'var(--spacing-xs)', lineHeight: 1 }}>
                {selectedPet.emoji}
              </div>

              <h3 style={{
                margin: '0 0 var(--spacing-xs) 0',
                fontSize: '1.8rem',
                color: 'var(--color-brown-dark)',
                fontWeight: '700'
              }}>
                {selectedPet.name}
              </h3>

              <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'center',
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                fontWeight: '600'
              }}>
                <span>⭐ Niveau {selectedPet.level}</span>
                <span>✨ {selectedPet.experience} XP</span>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              background: 'var(--color-tan)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)',
              border: '2px solid var(--color-brown-light)'
            }}>
                  <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      <span>🍽️ Faim</span>
                      <span style={{ color: selectedPet.stats.hunger >= 70 ? '#28a745' : selectedPet.stats.hunger >= 40 ? '#FFA500' : '#dc3545' }}>{Math.round(selectedPet.stats.hunger)}%</span>
                    </div>
                    <div style={{
                      background: 'var(--color-tan)',
                      borderRadius: '10px',
                      height: '12px',
                      overflow: 'hidden',
                      border: '2px solid var(--color-brown-light)'
                    }}>
                      <div style={{
                        width: `${selectedPet.stats.hunger}%`,
                        height: '100%',
                        background: selectedPet.stats.hunger >= 70 ? '#28a745' : selectedPet.stats.hunger >= 40 ? '#FFA500' : '#dc3545',
                        borderRadius: '8px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      <span>😊 Bonheur</span>
                      <span style={{ color: selectedPet.stats.happiness >= 70 ? '#28a745' : selectedPet.stats.happiness >= 40 ? '#FFA500' : '#dc3545' }}>{Math.round(selectedPet.stats.happiness)}%</span>
                    </div>
                    <div style={{
                      background: 'var(--color-tan)',
                      borderRadius: '10px',
                      height: '12px',
                      overflow: 'hidden',
                      border: '2px solid var(--color-brown-light)'
                    }}>
                      <div style={{
                        width: `${selectedPet.stats.happiness}%`,
                        height: '100%',
                        background: selectedPet.stats.happiness >= 70 ? '#28a745' : selectedPet.stats.happiness >= 40 ? '#FFA500' : '#dc3545',
                        borderRadius: '8px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      <span>⚡ Énergie</span>
                      <span style={{ color: selectedPet.stats.energy >= 70 ? '#28a745' : selectedPet.stats.energy >= 40 ? '#FFA500' : '#dc3545' }}>{Math.round(selectedPet.stats.energy)}%</span>
                    </div>
                    <div style={{
                      background: 'var(--color-tan)',
                      borderRadius: '10px',
                      height: '12px',
                      overflow: 'hidden',
                      border: '2px solid var(--color-brown-light)'
                    }}>
                      <div style={{
                        width: `${selectedPet.stats.energy}%`,
                        height: '100%',
                        background: selectedPet.stats.energy >= 70 ? '#28a745' : selectedPet.stats.energy >= 40 ? '#FFA500' : '#dc3545',
                        borderRadius: '8px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      <span>🧼 Propreté</span>
                      <span style={{ color: selectedPet.stats.cleanliness >= 70 ? '#28a745' : selectedPet.stats.cleanliness >= 40 ? '#FFA500' : '#dc3545' }}>{Math.round(selectedPet.stats.cleanliness)}%</span>
                    </div>
                    <div style={{
                      background: 'var(--color-tan)',
                      borderRadius: '10px',
                      height: '12px',
                      overflow: 'hidden',
                      border: '2px solid var(--color-brown-light)'
                    }}>
                      <div style={{
                        width: `${selectedPet.stats.cleanliness}%`,
                        height: '100%',
                        background: selectedPet.stats.cleanliness >= 70 ? '#28a745' : selectedPet.stats.cleanliness >= 40 ? '#FFA500' : '#dc3545',
                        borderRadius: '8px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'var(--spacing-sm)'
                }}>
                  <button
                    onClick={handleFeed}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-lg)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    🍽️ Nourrir
                  </button>
                  <button
                    onClick={handlePlay}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-lg)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    🎮 Jouer
                  </button>
                  <button
                    onClick={handleClean}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, #17a2b8, #138496)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-lg)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    🧼 Nettoyer
                  </button>
                  <button
                    onClick={handleSleep}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, #6c757d, #5a6268)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-lg)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    😴 Dormir
                  </button>
                </div>

            {interactionMessage && (
              <div style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
                border: '2px solid #28a745',
                borderRadius: 'var(--border-radius-lg)',
                color: '#155724',
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: '700',
                whiteSpace: 'pre-line',
                animation: 'fadeIn 0.3s',
                boxShadow: '0 2px 8px rgba(40, 167, 69, 0.2)'
              }}>
                {interactionMessage}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '0 var(--spacing-sm)', width: '100%', boxSizing: 'border-box' }}>
        {/* ADOPTER */}
        {adoptionTab === 'adopt' && (
          <>
            {myPets.length >= 1 && (
              <div style={{
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
                  ⚠️ Tu as déjà une incarnation. Tu ne peux en avoir qu'une seule à la fois !
                </p>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-md)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {Object.values(PETS).filter(pet => !myPets.find(p => p.type === pet.id)).map((pet) => (
                <PetAdoptCard
                  key={pet.id}
                  pet={pet}
                  onAdopt={handleAdopt}
                  canAdopt={myPets.length < 3}
                  userCoins={userCoins}
                />
              ))}
            </div>
          </>
        )}

        {/* INCARNER */}
        {adoptionTab === 'incarnate' && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              borderRadius: 'var(--border-radius-xl)',
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '1.3rem' }}>
                🎭 Incarnez un animal
              </h3>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.95 }}>
                Transformez-vous en animal ! Votre avatar changera et vous deviendrez cet animal dans l'app.
              </p>
            </div>

            {currentUser?.incarnatedAs && (
              <div style={{
                background: '#d4edda',
                border: '2px solid #28a745',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#155724', fontSize: '1rem' }}>
                  ✨ Vous êtes actuellement incarné en <strong>{currentUser.incarnatedAs.name} {currentUser.incarnatedAs.emoji}</strong>
                </p>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-md)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {Object.values(PETS).map((pet) => (
                <PetIncarnateCard
                  key={pet.id}
                  pet={pet}
                  onIncarnate={handleIncarnate}
                  isCurrentForm={currentUser?.incarnatedAs?.petId === pet.id}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
