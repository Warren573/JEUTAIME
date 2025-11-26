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

export default function AdoptionScreen({ currentUser, userCoins, setUserCoins, setCurrentUser }) {
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

  // Adopter un animal
  const handleAdopt = (petId) => {
    const result = adoptPet(currentUser.email, petId);

    if (result.success) {
      setUserCoins(result.coinsRemaining);
      setRefreshKey(prev => prev + 1);
      alert(`🎉 Félicitations ! Vous avez adopté un ${result.pet.name} !\n\nPrenez-en bien soin en le nourrissant, jouant avec lui, et en le gardant propre et reposé.`);
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

  return (
    <div style={{
      width: '100%',
      boxSizing: 'border-box',
      overflowY: 'auto',
      paddingBottom: '80px',
      background: 'var(--color-beige-light)'
    }}>
      {/* En-tête */}
      <div style={{
        background: 'var(--color-cream)',
        borderBottom: '4px double var(--color-brown-dark)',
        padding: '0',
        paddingTop: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-md)',
        width: '100%',
        boxSizing: 'border-box'
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
          onClick={() => setAdoptionTab('mypets')}
          style={{
            flex: 1,
            minWidth: '130px',
            maxWidth: '180px',
            padding: 'var(--spacing-md)',
            background: adoptionTab === 'mypets'
              ? 'linear-gradient(135deg, #667eea, #764ba2)'
              : 'var(--color-brown-light)',
            border: 'none',
            borderRadius: 'var(--border-radius-lg)',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: adoptionTab === 'mypets' ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
        >
          🐾 Mes Animaux ({myPets.length}/3)
        </button>
        <button
          onClick={() => setAdoptionTab('adopt')}
          style={{
            flex: 1,
            minWidth: '130px',
            maxWidth: '180px',
            padding: 'var(--spacing-md)',
            background: adoptionTab === 'adopt'
              ? 'linear-gradient(135deg, #FFD700, #FFA500)'
              : 'var(--color-brown-light)',
            border: 'none',
            borderRadius: 'var(--border-radius-lg)',
            color: adoptionTab === 'adopt' ? '#000' : 'white',
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

      <div style={{ padding: '0 var(--spacing-sm)' }}>
        {/* MES ANIMAUX */}
        {adoptionTab === 'mypets' && (
          <>
            {myPets.length === 0 ? (
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-xl)',
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                border: '3px solid var(--color-brown)'
              }}>
                <div style={{ fontSize: '80px', marginBottom: 'var(--spacing-md)' }}>🐾</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-brown-dark)'
                }}>
                  Aucun animal adopté
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Rendez-vous dans le refuge pour adopter votre premier compagnon !
                </p>
                <button
                  onClick={() => setAdoptionTab('adopt')}
                  style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    border: 'none',
                    borderRadius: 'var(--border-radius-lg)',
                    color: '#000',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  🏠 Adopter un compagnon
                </button>
              </div>
            ) : (
              <>
                {/* Sélecteur d'animal */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  marginBottom: 'var(--spacing-lg)',
                  overflowX: 'auto',
                  padding: 'var(--spacing-xs)'
                }}>
                  {myPets.map((pet) => {
                    const status = getPetStatus(pet);
                    return (
                      <button
                        key={pet.id}
                        onClick={() => setSelectedPet(pet)}
                        style={{
                          minWidth: '100px',
                          padding: 'var(--spacing-sm)',
                          background: selectedPet?.id === pet.id
                            ? 'linear-gradient(135deg, #667eea, #764ba2)'
                            : 'var(--color-cream)',
                          border: `3px solid ${selectedPet?.id === pet.id ? '#667eea' : 'var(--color-brown)'}`,
                          borderRadius: 'var(--border-radius-lg)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                      >
                        <div style={{ fontSize: '40px' }}>{pet.emoji}</div>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: selectedPet?.id === pet.id ? 'white' : 'var(--color-text-primary)',
                          marginTop: '4px'
                        }}>
                          Niv. {pet.level}
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          fontSize: '12px'
                        }}>
                          {status.emoji}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Affichage de l'animal sélectionné */}
                {selectedPet && (
                  <div style={{
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--border-radius-xl)',
                    padding: 'var(--spacing-lg)',
                    border: '3px solid var(--color-brown)',
                    boxShadow: 'var(--shadow-lg)',
                    marginBottom: 'var(--spacing-lg)'
                  }}>
                    {/* Message d'interaction */}
                    {interactionMessage && (
                      <div style={{
                        background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                        color: 'white',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--border-radius-lg)',
                        marginBottom: 'var(--spacing-md)',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        whiteSpace: 'pre-line',
                        animation: 'fadeIn 0.3s ease'
                      }}>
                        {interactionMessage}
                      </div>
                    )}

                    {/* Animal affiché */}
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                      <div style={{ fontSize: '120px', marginBottom: 'var(--spacing-sm)' }}>
                        {selectedPet.emoji}
                      </div>
                      <h2 style={{
                        fontSize: '1.8rem',
                        margin: '0 0 var(--spacing-xs) 0',
                        color: 'var(--color-brown-dark)'
                      }}>
                        {selectedPet.name}
                      </h2>
                      <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-secondary)'
                      }}>
                        <span>⭐ Niveau {selectedPet.level}</span>
                        <span>📊 {selectedPet.experience} exp</span>
                        <span style={{ color: getPetStatus(selectedPet).color, fontWeight: '600' }}>
                          {getPetStatus(selectedPet).emoji} {getPetStatus(selectedPet).status}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-text-light)',
                        marginTop: 'var(--spacing-xs)',
                        fontStyle: 'italic'
                      }}>
                        {getPetData(selectedPet.type)?.personality}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                      background: 'var(--color-beige-light)',
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--border-radius-lg)',
                      border: '2px solid var(--color-brown-light)',
                      marginBottom: 'var(--spacing-lg)'
                    }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-brown-dark)',
                        textAlign: 'center'
                      }}>
                        📊 Statistiques
                      </h3>
                      <StatBar label="Faim" value={selectedPet.stats.hunger} color="#FF9800" icon="🍽️" />
                      <StatBar label="Bonheur" value={selectedPet.stats.happiness} color="#E91E63" icon="😊" />
                      <StatBar label="Énergie" value={selectedPet.stats.energy} color="#2196F3" icon="⚡" />
                      <StatBar label="Propreté" value={selectedPet.stats.cleanliness} color="#4CAF50" icon="✨" />
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'var(--spacing-sm)'
                    }}>
                      <button
                        onClick={handleFeed}
                        style={{
                          padding: 'var(--spacing-md)',
                          background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-lg)',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-md)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🍽️ Nourrir
                      </button>
                      <button
                        onClick={handlePlay}
                        style={{
                          padding: 'var(--spacing-md)',
                          background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-lg)',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-md)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🎮 Jouer
                      </button>
                      <button
                        onClick={handleClean}
                        style={{
                          padding: 'var(--spacing-md)',
                          background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-lg)',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-md)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🧼 Nettoyer
                      </button>
                      <button
                        onClick={handleSleep}
                        style={{
                          padding: 'var(--spacing-md)',
                          background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-lg)',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-md)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        😴 Dormir
                      </button>
                    </div>

                    {/* Stats d'interactions */}
                    <div style={{
                      marginTop: 'var(--spacing-lg)',
                      padding: 'var(--spacing-md)',
                      background: 'var(--color-beige-light)',
                      borderRadius: 'var(--border-radius-md)',
                      border: '2px solid var(--color-brown-light)'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gap: 'var(--spacing-sm)',
                        textAlign: 'center',
                        fontSize: '0.8rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🍽️</div>
                          <div style={{ fontWeight: '600' }}>{selectedPet.interactions.fed}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🎮</div>
                          <div style={{ fontWeight: '600' }}>{selectedPet.interactions.played}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🧼</div>
                          <div style={{ fontWeight: '600' }}>{selectedPet.interactions.cleaned}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>😴</div>
                          <div style={{ fontWeight: '600' }}>{selectedPet.interactions.slept}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ADOPTER */}
        {adoptionTab === 'adopt' && (
          <>
            {myPets.length >= 3 && (
              <div style={{
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
                  ⚠️ Vous avez déjà 3 animaux (maximum). Vous ne pouvez plus en adopter.
                </p>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-md)'
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
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    {pet.description}
                  </p>
                  <div style={{
                    background: 'var(--color-beige-light)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    marginBottom: 'var(--spacing-md)',
                    textAlign: 'left',
                    fontSize: '0.85rem'
                  }}>
                    <p style={{ margin: '6px 0' }}>
                      <strong>Personnalité:</strong> {pet.personality}
                    </p>
                    <p style={{ margin: '6px 0' }}>
                      <strong>Nourriture préférée:</strong> {pet.favoriteFood}
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
              gap: 'var(--spacing-md)'
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
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    {pet.description}
                  </p>
                  <div style={{
                    background: 'var(--color-beige-light)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    marginBottom: 'var(--spacing-md)',
                    textAlign: 'left',
                    fontSize: '0.85rem'
                  }}>
                    <p style={{ margin: '6px 0' }}>
                      <strong>Personnalité:</strong> {pet.personality}
                    </p>
                    <p style={{ margin: '6px 0' }}>
                      <strong>Nourriture préférée:</strong> {pet.favoriteFood}
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
