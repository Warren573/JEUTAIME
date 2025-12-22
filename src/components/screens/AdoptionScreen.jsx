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

export default function AdoptionScreen({ currentUser, userCoins, setUserCoins, setCurrentUser, isEmbedded = false }) {
  const [adoptionTab, setAdoptionTab] = useState('mypets'); // 'mypets', 'adopt', 'incarnate'
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

  // Barre de stat stylée
  const StatBar = ({ label, value, color, icon }) => (
    <div style={{ marginBottom: 'var(--spacing-sm)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: '0.85rem',
        fontWeight: '600'
      }}>
        <span>{icon} {label}</span>
        <span style={{ color: color }}>{Math.round(value)}%</span>
      </div>
      <div style={{
        background: 'var(--color-tan)',
        borderRadius: '10px',
        height: '12px',
        overflow: 'hidden',
        border: '2px solid var(--color-brown-light)'
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );

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
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
    background: 'var(--color-beige-light)',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div style={containerStyle}>
      {/* En-tête */}
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
          borderBottom: '2px solid var(--color-text-primary)',
          paddingBottom: 'var(--spacing-xs)'
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
            minWidth: '130px',
            maxWidth: '180px',
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
            minWidth: '130px',
            maxWidth: '180px',
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
                <div
                  key={pet.id}
                  style={{
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--border-radius-xl)',
                    padding: 'var(--spacing-lg)',
                    border: pet.rarity === 'legendary'
                      ? '3px solid #FFD700'
                      : pet.rarity === 'rare'
                      ? '3px solid #9C27B0'
                      : pet.rarity === 'uncommon'
                      ? '3px solid #2196F3'
                      : '3px solid var(--color-brown)',
                    boxShadow: 'var(--shadow-lg)',
                    position: 'relative',
                    textAlign: 'center'
                  }}
                >
                  {/* Badge rareté */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: pet.rarity === 'legendary'
                      ? '#FFD700'
                      : pet.rarity === 'rare'
                      ? '#9C27B0'
                      : pet.rarity === 'uncommon'
                      ? '#2196F3'
                      : '#757575',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {pet.rarity === 'legendary' ? '✨ Légendaire' :
                     pet.rarity === 'rare' ? '💎 Rare' :
                     pet.rarity === 'uncommon' ? '⭐ Peu commun' :
                     '🌟 Commun'}
                  </div>

                  <div style={{ fontSize: '100px', marginBottom: 'var(--spacing-sm)' }}>
                    {pet.emoji}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    margin: '0 0 var(--spacing-xs) 0',
                    color: 'var(--color-brown-dark)'
                  }}>
                    {pet.name}
                  </h3>
                  <p style={{
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    marginBottom: 'var(--spacing-sm)',
                    fontStyle: 'italic'
                  }}>
                    {pet.description}
                  </p>
                  <div style={{
                    background: 'var(--color-beige-light)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    marginBottom: 'var(--spacing-md)',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    color: 'var(--color-brown-dark)'
                  }}>
                    <p style={{ margin: '6px 0', color: 'var(--color-brown-dark)' }}>
                      <strong style={{ color: 'var(--color-brown-darker)' }}>Personnalité:</strong> {pet.personality}
                    </p>
                    <p style={{ margin: '6px 0', color: 'var(--color-brown-dark)' }}>
                      <strong style={{ color: 'var(--color-brown-darker)' }}>Nourriture préférée:</strong> {pet.favoriteFood}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-md)',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--color-gold-dark)'
                  }}>
                    <span className="currency-icon" style={{
                      width: '28px',
                      height: '28px',
                      background: 'var(--color-gold)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-cream)',
                      fontSize: '0.9rem',
                      fontWeight: '700'
                    }}>
                      J
                    </span>
                    {pet.adoptionCost} coins
                  </div>

                  <button
                    onClick={() => handleAdopt(pet.id)}
                    disabled={myPets.length >= 3}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      background: myPets.length >= 3
                        ? '#ccc'
                        : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-lg)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: myPets.length >= 3 ? 'not-allowed' : 'pointer',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseDown={(e) => {
                      if (myPets.length < 3) e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {myPets.length >= 3 ? '❌ Maximum atteint' : '🐾 Adopter'}
                  </button>
                </div>
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
                <div
                  key={pet.id}
                  style={{
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--border-radius-xl)',
                    padding: 'var(--spacing-lg)',
                    border: currentUser?.incarnatedAs?.petId === pet.id
                      ? '4px solid #f093fb'
                      : pet.rarity === 'legendary'
                      ? '3px solid #FFD700'
                      : pet.rarity === 'rare'
                      ? '3px solid #9C27B0'
                      : pet.rarity === 'uncommon'
                      ? '3px solid #2196F3'
                      : '3px solid var(--color-brown)',
                    boxShadow: currentUser?.incarnatedAs?.petId === pet.id
                      ? '0 0 20px rgba(240, 147, 251, 0.5)'
                      : 'var(--shadow-lg)',
                    position: 'relative',
                    textAlign: 'center'
                  }}
                >
                  {currentUser?.incarnatedAs?.petId === pet.id && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#f093fb',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      ✨ Forme actuelle
                    </div>
                  )}

                  {/* Badge rareté */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: pet.rarity === 'legendary'
                      ? '#FFD700'
                      : pet.rarity === 'rare'
                      ? '#9C27B0'
                      : pet.rarity === 'uncommon'
                      ? '#2196F3'
                      : '#757575',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {pet.rarity === 'legendary' ? '✨ Légendaire' :
                     pet.rarity === 'rare' ? '💎 Rare' :
                     pet.rarity === 'uncommon' ? '⭐ Peu commun' :
                     '🌟 Commun'}
                  </div>

                  <div style={{ fontSize: '100px', marginBottom: 'var(--spacing-sm)' }}>
                    {pet.emoji}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    margin: '0 0 var(--spacing-xs) 0',
                    color: 'var(--color-brown-dark)'
                  }}>
                    {pet.name}
                  </h3>
                  <p style={{
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    marginBottom: 'var(--spacing-sm)',
                    fontStyle: 'italic'
                  }}>
                    {pet.description}
                  </p>
                  <div style={{
                    background: 'var(--color-beige-light)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    marginBottom: 'var(--spacing-md)',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    color: 'var(--color-brown-dark)'
                  }}>
                    <p style={{ margin: '6px 0', color: 'var(--color-brown-dark)' }}>
                      <strong style={{ color: 'var(--color-brown-darker)' }}>Personnalité:</strong> {pet.personality}
                    </p>
                    <p style={{ margin: '6px 0', color: 'var(--color-brown-dark)' }}>
                      <strong style={{ color: 'var(--color-brown-darker)' }}>Nourriture préférée:</strong> {pet.favoriteFood}
                    </p>
                  </div>

                  <button
                    onClick={() => handleIncarnate(pet.id)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      background: currentUser?.incarnatedAs?.petId === pet.id
                        ? 'linear-gradient(135deg, #666, #888)'
                        : 'linear-gradient(135deg, #f093fb, #f5576c)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-lg)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: currentUser?.incarnatedAs?.petId === pet.id ? 'default' : 'pointer',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'transform 0.2s',
                      opacity: currentUser?.incarnatedAs?.petId === pet.id ? 0.7 : 1
                    }}
                    onMouseDown={(e) => {
                      if (currentUser?.incarnatedAs?.petId !== pet.id) e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {currentUser?.incarnatedAs?.petId === pet.id ? '✓ Forme actuelle' : '🎭 Incarner'}
                  </button>
                </div>
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
