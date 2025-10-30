import React, { useState, useEffect } from 'react';
import { availableAnimals, adoptableAnimals } from '../../data/appData';

export default function AdoptionScreen({ currentUser, userCoins, setUserCoins }) {
  const [adoptionTab, setAdoptionTab] = useState('status'); // 'status', 'incarnate', 'adopt'
  const [userStatus, setUserStatus] = useState(null); // null, {type: 'animal', animalId}, {type: 'adoptedBy', userId}

  // Charger le statut utilisateur
  useEffect(() => {
    const savedStatus = localStorage.getItem(`jeutaime_adoption_${currentUser?.email || 'guest'}`);
    if (savedStatus) {
      setUserStatus(JSON.parse(savedStatus));
    }
  }, [currentUser]);

  // Sauvegarder le statut
  const saveStatus = (status) => {
    localStorage.setItem(`jeutaime_adoption_${currentUser?.email || 'guest'}`, JSON.stringify(status));
    setUserStatus(status);
  };

  // Incarner un animal
  const handleIncarnate = (animal) => {
    if (userStatus) {
      alert('Vous avez déjà un statut ! Annulez-le d\'abord.');
      return;
    }

    if (animal.premium && !currentUser?.premium) {
      alert('Cet animal nécessite un abonnement Premium !');
      return;
    }

    if (animal.price > userCoins) {
      alert(`Pas assez de coins ! Il vous faut ${animal.price} coins.`);
      return;
    }

    const newStatus = {
      type: 'animal',
      animalId: animal.id,
      animalData: animal,
      since: new Date().toISOString()
    };

    saveStatus(newStatus);
    setUserCoins(userCoins - animal.price);
    alert(`Vous incarnez maintenant un ${animal.name} ! 🎭`);
    setAdoptionTab('status');
  };

  // Adopter un utilisateur-animal
  const handleAdopt = (animalUser) => {
    if (userStatus) {
      alert('Vous avez déjà un statut ! Annulez-le d\'abord.');
      return;
    }

    const newStatus = {
      type: 'adopted',
      adoptedUserId: animalUser.id,
      adoptedData: animalUser,
      since: new Date().toISOString()
    };

    saveStatus(newStatus);
    alert(`Vous avez adopté ${animalUser.name} ! 💕`);
    setAdoptionTab('status');
  };

  // Annuler le statut
  const handleCancel = () => {
    if (confirm('Êtes-vous sûr de vouloir annuler votre statut ?')) {
      localStorage.removeItem(`jeutaime_adoption_${currentUser?.email || 'guest'}`);
      setUserStatus(null);
      alert('Statut annulé avec succès !');
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-xs)',
        marginBottom: 'var(--spacing-lg)',
        padding: '0 var(--spacing-md)',
        justifyContent: 'center'
      }}>
        {['status', 'incarnate', 'adopt'].map(tab => (
          <button
            key={tab}
            onClick={() => setAdoptionTab(tab)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: adoptionTab === tab ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'var(--color-brown)',
              border: adoptionTab === tab ? '2px solid var(--color-gold-light)' : '2px solid var(--color-brown-dark)',
              color: adoptionTab === tab ? 'var(--color-brown-dark)' : 'var(--color-cream)',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all var(--transition-normal)',
              boxShadow: adoptionTab === tab ? 'var(--shadow-md)' : 'var(--shadow-sm)'
            }}
          >
            {tab === 'status' ? '👤 Mon Statut' :
             tab === 'incarnate' ? '🎭 Incarner' :
             '💕 Adopter'}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 var(--spacing-md)' }}>
        {/* Mon Statut */}
        {adoptionTab === 'status' && (
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: 'var(--border-radius-xl)',
            padding: 'var(--spacing-xl)',
            border: '3px solid var(--color-brown)',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            {!userStatus ? (
              <>
                <div style={{ fontSize: '80px', marginBottom: 'var(--spacing-md)' }}>🤷</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-brown-dark)'
                }}>
                  Aucun statut
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-lg)',
                  fontSize: '0.95rem'
                }}>
                  Vous pouvez choisir d'incarner un animal OU d'adopter un autre utilisateur-animal.
                </p>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setAdoptionTab('incarnate')}
                    style={{
                      padding: 'var(--spacing-md) var(--spacing-lg)',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: '2px solid var(--color-brown)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    🎭 Incarner un animal
                  </button>
                  <button
                    onClick={() => setAdoptionTab('adopt')}
                    style={{
                      padding: 'var(--spacing-md) var(--spacing-lg)',
                      background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                      border: '2px solid var(--color-brown)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    💕 Adopter quelqu'un
                  </button>
                </div>
              </>
            ) : userStatus.type === 'animal' ? (
              <>
                <div style={{ fontSize: '100px', marginBottom: 'var(--spacing-md)' }}>
                  {userStatus.animalData.emoji}
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--color-brown-dark)'
                }}>
                  Vous incarnez un {userStatus.animalData.name}
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  {userStatus.animalData.description}
                </p>
                <div style={{
                  background: 'var(--color-beige-light)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-brown)',
                  marginBottom: 'var(--spacing-lg)',
                  textAlign: 'left'
                }}>
                  <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
                    <strong>Personnalité:</strong> {userStatus.animalData.personality}
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
                    <strong>Pouvoir:</strong> {userStatus.animalData.power}
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                    <strong>Depuis le:</strong> {new Date(userStatus.since).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    background: '#f44336',
                    border: '2px solid #c62828',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  ❌ Annuler mon statut
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '100px', marginBottom: 'var(--spacing-md)' }}>
                  {userStatus.adoptedData.animal}
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--color-brown-dark)'
                }}>
                  Vous avez adopté {userStatus.adoptedData.name}
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  {userStatus.adoptedData.name} est votre compagnon adopté depuis le{' '}
                  {new Date(userStatus.since).toLocaleDateString('fr-FR')}
                </p>
                <div style={{
                  background: 'var(--color-beige-light)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-brown)',
                  marginBottom: 'var(--spacing-lg)',
                  textAlign: 'left'
                }}>
                  <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
                    <strong>Propriétaire:</strong> {userStatus.adoptedData.owner}
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
                    <strong>Bonheur:</strong> {userStatus.adoptedData.happiness}%
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
                    <strong>Affection:</strong> {userStatus.adoptedData.affection}%
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    background: '#f44336',
                    border: '2px solid #c62828',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  💔 Abandonner
                </button>
              </>
            )}
          </div>
        )}

        {/* Incarner un animal */}
        {adoptionTab === 'incarnate' && (
          <>
            {userStatus && (
              <div style={{
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
                  ⚠️ Vous avez déjà un statut. Annulez-le d'abord pour incarner un animal.
                </p>
              </div>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
                    position: 'relative',
                    textAlign: 'center'
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
                    onClick={() => handleIncarnate(animal)}
                    disabled={userStatus !== null}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: userStatus ? '#ccc' : (animal.price === 0 ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'),
                      border: '2px solid var(--color-brown)',
                      borderRadius: 'var(--border-radius-md)',
                      color: userStatus ? '#666' : 'white',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: userStatus ? 'not-allowed' : 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {userStatus ? '✓ Déjà un statut' : (animal.price === 0 ? '🎭 Incarner (Gratuit)' : `🎭 Incarner (${animal.price} coins)`)}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Adopter un utilisateur-animal */}
        {adoptionTab === 'adopt' && (
          <>
            {userStatus && (
              <div style={{
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
                  ⚠️ Vous avez déjà un statut. Annulez-le d'abord pour adopter quelqu'un.
                </p>
              </div>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--spacing-md)'
            }}>
              {adoptableAnimals.map(animalUser => (
                <div
                  key={animalUser.id}
                  style={{
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: 'var(--spacing-lg)',
                    border: '3px solid var(--color-brown)',
                    boxShadow: 'var(--shadow-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '80px', marginBottom: 'var(--spacing-sm)' }}>
                    {animalUser.animal}
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    margin: '0 0 var(--spacing-xs) 0',
                    color: 'var(--color-brown-dark)'
                  }}>
                    {animalUser.name}
                  </h3>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--spacing-md)'
                  }}>
                    Utilisateur de {animalUser.owner}, {animalUser.age} ans
                  </p>
                  <div style={{
                    background: 'var(--color-beige-light)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--color-brown)',
                    marginBottom: 'var(--spacing-md)',
                    textAlign: 'left',
                    fontSize: '0.85rem'
                  }}>
                    <p style={{ margin: '4px 0' }}><strong>Bonheur:</strong> {animalUser.happiness}%</p>
                    <p style={{ margin: '4px 0' }}><strong>Affection:</strong> {animalUser.affection}%</p>
                    <p style={{ margin: '4px 0' }}><strong>Énergie:</strong> {animalUser.energy}%</p>
                  </div>
                  <button
                    onClick={() => handleAdopt(animalUser)}
                    disabled={userStatus !== null}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      background: userStatus ? '#ccc' : 'linear-gradient(135deg, #E91E63, #C2185B)',
                      border: '2px solid var(--color-brown)',
                      borderRadius: 'var(--border-radius-md)',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: userStatus ? 'not-allowed' : 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {userStatus ? '✓ Déjà un statut' : '💕 Adopter (Gratuit)'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
