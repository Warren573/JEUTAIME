import React, { useState, useEffect } from 'react';
import { availableAnimals, animalAccessories, adoptableAnimals } from '../../data/appData';

export default function AdoptionScreen({ currentUser, userCoins, setUserCoins }) {
  const [adoptionMode, setAdoptionMode] = useState('myPet'); // 'myPet', 'adopt', 'shop', 'others'
  const [myPet, setMyPet] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // Charger l'animal adopté depuis localStorage
  useEffect(() => {
    const savedPet = localStorage.getItem('jeutaime_my_pet');
    if (savedPet) {
      setMyPet(JSON.parse(savedPet));
    }
  }, []);

  // Sauvegarder l'animal adopté
  const savePet = (pet) => {
    localStorage.setItem('jeutaime_my_pet', JSON.stringify(pet));
    setMyPet(pet);
  };

  // Adopter un animal
  const handleAdopt = (animal) => {
    if (animal.price > userCoins) {
      alert(`Pas assez de coins ! Il vous faut ${animal.price} coins.`);
      return;
    }

    if (animal.premium && !currentUser?.premium) {
      alert('Cet animal nécessite un abonnement Premium !');
      return;
    }

    const newPet = {
      ...animal,
      adoptedAt: new Date().toISOString(),
      hunger: 50,
      happiness: 80,
      energy: 70,
      cleanliness: 100,
      affection: 60,
      accessories: []
    };

    savePet(newPet);
    setUserCoins(userCoins - animal.price);
    setAdoptionMode('myPet');
  };

  // Nourrir l'animal
  const feedPet = () => {
    if (!myPet) return;
    const updatedPet = {
      ...myPet,
      hunger: Math.max(0, myPet.hunger - 30),
      happiness: Math.min(100, myPet.happiness + 10),
      energy: Math.min(100, myPet.energy + 5)
    };
    savePet(updatedPet);
  };

  // Jouer avec l'animal
  const playWithPet = () => {
    if (!myPet) return;
    const updatedPet = {
      ...myPet,
      happiness: Math.min(100, myPet.happiness + 20),
      energy: Math.max(0, myPet.energy - 15),
      hunger: Math.min(100, myPet.hunger + 10),
      affection: Math.min(100, myPet.affection + 15)
    };
    savePet(updatedPet);
  };

  // Laver l'animal
  const washPet = () => {
    if (!myPet) return;
    const updatedPet = {
      ...myPet,
      cleanliness: 100,
      happiness: Math.min(100, myPet.happiness + 5)
    };
    savePet(updatedPet);
  };

  // Câliner l'animal
  const cuddlePet = () => {
    if (!myPet) return;
    const updatedPet = {
      ...myPet,
      affection: Math.min(100, myPet.affection + 20),
      happiness: Math.min(100, myPet.happiness + 15),
      energy: Math.max(0, myPet.energy - 5)
    };
    savePet(updatedPet);
  };

  // Acheter un accessoire
  const buyAccessory = (accessory) => {
    if (!myPet) {
      alert('Adoptez un animal d\'abord !');
      return;
    }

    if (accessory.price > userCoins) {
      alert(`Pas assez de coins ! Il vous faut ${accessory.price} coins.`);
      return;
    }

    if (myPet.accessories.includes(accessory.id)) {
      alert('Vous possédez déjà cet accessoire !');
      return;
    }

    const updatedPet = {
      ...myPet,
      accessories: [...myPet.accessories, accessory.id]
    };
    savePet(updatedPet);
    setUserCoins(userCoins - accessory.price);
  };

  // Barre de statistique
  const StatBar = ({ label, value, color }) => (
    <div style={{ marginBottom: 'var(--spacing-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color }}>{value}%</span>
      </div>
      <div style={{
        height: '8px',
        background: 'var(--color-beige-light)',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid var(--color-brown)'
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          background: color,
          transition: 'width 0.3s'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-beige-light)',
      paddingBottom: '80px'
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
          🐾 Adoption
        </h1>
        <p style={{ textAlign: 'center', margin: '8px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Adoptez et prenez soin de votre compagnon virtuel
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-xs)',
        marginBottom: 'var(--spacing-lg)',
        padding: '0 var(--spacing-md)',
        justifyContent: 'center'
      }}>
        {['myPet', 'adopt', 'shop', 'others'].map(mode => (
          <button
            key={mode}
            onClick={() => setAdoptionMode(mode)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: adoptionMode === mode ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'var(--color-brown)',
              border: adoptionMode === mode ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
              color: adoptionMode === mode ? 'var(--color-brown-dark)' : 'var(--color-cream)',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all var(--transition-normal)',
              boxShadow: adoptionMode === mode ? 'var(--shadow-md)' : 'var(--shadow-sm)'
            }}
          >
            {mode === 'myPet' ? '🏠 Mon Compagnon' :
             mode === 'adopt' ? '🐾 Adopter' :
             mode === 'shop' ? '🛍️ Boutique' :
             '👥 Autres Animaux'}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 var(--spacing-md)' }}>
        {/* Mon Compagnon */}
        {adoptionMode === 'myPet' && (
          <>
            {myPet ? (
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-xl)',
                padding: 'var(--spacing-lg)',
                border: '3px solid var(--color-brown)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                {/* Avatar de l'animal */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <div style={{
                    fontSize: '120px',
                    marginBottom: 'var(--spacing-sm)',
                    position: 'relative',
                    display: 'inline-block'
                  }}>
                    {myPet.emoji}
                    {/* Accessoires */}
                    {myPet.accessories.map(accId => {
                      const acc = animalAccessories.find(a => a.id === accId);
                      return acc ? (
                        <span key={accId} style={{
                          position: 'absolute',
                          top: accId === 'hat' || accId === 'crown' ? '-20px' : '10px',
                          right: accId === 'glasses' ? '10px' : 'auto',
                          left: accId === 'scarf' || accId === 'bow' ? '50%' : 'auto',
                          transform: accId === 'scarf' || accId === 'bow' ? 'translateX(-50%)' : 'none',
                          fontSize: '40px'
                        }}>
                          {acc.emoji}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <h2 style={{
                    fontSize: '1.8rem',
                    margin: '0 0 var(--spacing-xs) 0',
                    color: 'var(--color-brown-dark)'
                  }}>
                    {myPet.name}
                  </h2>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    margin: '4px 0'
                  }}>
                    {myPet.personality} • {myPet.power}
                  </p>
                </div>

                {/* Statistiques */}
                <div style={{
                  background: 'var(--color-beige-light)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-brown)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    margin: '0 0 var(--spacing-md) 0',
                    color: 'var(--color-brown-dark)',
                    textAlign: 'center'
                  }}>
                    📊 Statistiques
                  </h3>
                  <StatBar label="🍽️ Faim" value={100 - myPet.hunger} color="#4CAF50" />
                  <StatBar label="😊 Bonheur" value={myPet.happiness} color="#FFD700" />
                  <StatBar label="⚡ Énergie" value={myPet.energy} color="#2196F3" />
                  <StatBar label="🧼 Propreté" value={myPet.cleanliness} color="#00BCD4" />
                  <StatBar label="💕 Affection" value={myPet.affection} color="#E91E63" />
                </div>

                {/* Actions */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'var(--spacing-sm)'
                }}>
                  <button
                    onClick={feedPet}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      border: '2px solid #2e7d32',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    🍖 Nourrir
                  </button>
                  <button
                    onClick={playWithPet}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, #FFD700, #FFC107)',
                      border: '2px solid #F57C00',
                      borderRadius: 'var(--border-radius-md)',
                      color: '#333',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    🎾 Jouer
                  </button>
                  <button
                    onClick={washPet}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, #00BCD4, #0097A7)',
                      border: '2px solid #006064',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    🛁 Laver
                  </button>
                  <button
                    onClick={cuddlePet}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                      border: '2px solid #880E4F',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    💝 Câliner
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--border-radius-xl)',
                padding: 'var(--spacing-xl)',
                border: '3px solid var(--color-brown)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '80px', marginBottom: 'var(--spacing-md)' }}>🐾</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-brown-dark)' }}>
                  Aucun compagnon adopté
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                  Adoptez votre premier animal virtuel !
                </p>
                <button
                  onClick={() => setAdoptionMode('adopt')}
                  style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                    border: '2px solid var(--color-brown)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-brown-dark)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  🐾 Adopter maintenant
                </button>
              </div>
            )}
          </>
        )}

        {/* Adopter */}
        {adoptionMode === 'adopt' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            {availableAnimals.map(animal => (
              <div
                key={animal.id}
                style={{
                  background: 'var(--color-cream)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: 'var(--spacing-lg)',
                  border: animal.premium ? '3px solid var(--color-gold)' : '3px solid var(--color-brown)',
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative'
                }}
              >
                {animal.premium && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'var(--color-gold)',
                    color: 'var(--color-brown-dark)',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    👑 Premium
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '80px', marginBottom: 'var(--spacing-sm)' }}>
                    {animal.emoji}
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    margin: '0 0 var(--spacing-xs) 0',
                    color: 'var(--color-brown-dark)'
                  }}>
                    {animal.name}
                  </h3>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {animal.description}
                  </p>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-light)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    <strong>Personnalité:</strong> {animal.personality}<br />
                    <strong>Pouvoir:</strong> {animal.power}
                  </p>
                  <button
                    onClick={() => handleAdopt(animal)}
                    disabled={myPet !== null}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: myPet ? '#ccc' : (animal.price === 0 ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'),
                      border: '2px solid var(--color-brown)',
                      borderRadius: 'var(--border-radius-md)',
                      color: myPet ? '#666' : (animal.price === 0 ? 'white' : 'var(--color-brown-dark)'),
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: myPet ? 'not-allowed' : 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {myPet ? '✓ Déjà adopté' : (animal.price === 0 ? '💚 Gratuit' : `💰 ${animal.price} coins`)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Boutique */}
        {adoptionMode === 'shop' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            {animalAccessories.map(accessory => (
              <div
                key={accessory.id}
                style={{
                  background: 'var(--color-cream)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: 'var(--spacing-lg)',
                  border: myPet?.accessories.includes(accessory.id) ? '3px solid #4CAF50' : '3px solid var(--color-brown)',
                  boxShadow: 'var(--shadow-md)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '60px', marginBottom: 'var(--spacing-sm)' }}>
                  {accessory.emoji}
                </div>
                <h4 style={{
                  fontSize: '1rem',
                  margin: '0 0 var(--spacing-xs) 0',
                  color: 'var(--color-brown-dark)'
                }}>
                  {accessory.name}
                </h4>
                <button
                  onClick={() => buyAccessory(accessory)}
                  disabled={!myPet || myPet.accessories.includes(accessory.id)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    background: myPet?.accessories.includes(accessory.id) ? '#4CAF50' : 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                    border: '2px solid var(--color-brown)',
                    borderRadius: 'var(--border-radius-md)',
                    color: myPet?.accessories.includes(accessory.id) ? 'white' : 'var(--color-brown-dark)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: (!myPet || myPet.accessories.includes(accessory.id)) ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {myPet?.accessories.includes(accessory.id) ? '✓ Possédé' : `💰 ${accessory.price} coins`}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Autres Animaux */}
        {adoptionMode === 'others' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            {adoptableAnimals.map(pet => (
              <div
                key={pet.id}
                style={{
                  background: 'var(--color-cream)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: 'var(--spacing-lg)',
                  border: '3px solid var(--color-brown)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ fontSize: '70px', marginBottom: 'var(--spacing-xs)' }}>
                    {pet.animal}
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    margin: '0 0 var(--spacing-xs) 0',
                    color: 'var(--color-brown-dark)'
                  }}>
                    {pet.name}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    Compagnon de {pet.owner}, {pet.age} ans
                  </p>
                </div>
                <div style={{
                  background: 'var(--color-beige-light)',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-brown)'
                }}>
                  <StatBar label="😊 Bonheur" value={pet.happiness} color="#FFD700" />
                  <StatBar label="💕 Affection" value={pet.affection} color="#E91E63" />
                  <StatBar label="⚡ Énergie" value={pet.energy} color="#2196F3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
