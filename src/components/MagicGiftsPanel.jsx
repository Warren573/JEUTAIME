import React, { useState } from 'react';
import { allMagic, allGifts } from '../data/magicGifts';

export default function MagicGiftsPanel({
  onClose,
  currentUser,
  salonMembers = [],
  onUseMagic,
  onSendGift
}) {
  const [activeTab, setActiveTab] = useState('magic'); // 'magic' ou 'gifts'
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const userCoins = currentUser?.coins || 0;

  const handleUseMagic = (magic) => {
    if (userCoins < magic.cost) {
      alert(`💰 Il te faut ${magic.cost} pièces pour utiliser cette magie !`);
      return;
    }

    if (onUseMagic) {
      onUseMagic(magic);
    } else {
      // Placeholder
      alert(`✨ ${magic.name} activé !`);
    }
  };

  const handleSendGift = (gift) => {
    if (userCoins < gift.cost) {
      alert(`💰 Il te faut ${gift.cost} pièces pour envoyer ce cadeau !`);
      return;
    }

    if (!selectedRecipient) {
      alert('🎁 Choisis d\'abord quelqu\'un dans le salon !');
      return;
    }

    if (onSendGift) {
      onSendGift(gift, selectedRecipient);
    } else {
      // Placeholder
      alert(`🎁 ${gift.name} envoyé à ${selectedRecipient.name} !`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--spacing-md)'
    }}>
      <div style={{
        background: 'var(--color-cream)',
        borderRadius: 'var(--border-radius-lg)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '3px solid var(--color-brown)',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '2px solid var(--color-brown-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            margin: 0,
            color: 'var(--color-text-primary)'
          }}>
            ✨ Magie & Offrandes
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: 'var(--spacing-xs)',
              color: 'var(--color-text-secondary)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Solde de pièces */}
        <div style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          background: 'var(--color-beige-light)',
          borderBottom: '1px solid var(--color-brown-light)',
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-xs)',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.2rem' }}>💰</span>
          <span style={{
            fontWeight: '700',
            color: 'var(--color-gold-dark)',
            fontSize: '1.1rem'
          }}>
            {userCoins} pièces
          </span>
        </div>

        {/* Onglets */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--color-brown-light)',
          background: 'var(--color-beige)'
        }}>
          <button
            onClick={() => setActiveTab('magic')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              background: activeTab === 'magic' ? 'var(--color-cream)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'magic' ? '3px solid var(--color-gold)' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'magic' ? '700' : '400',
              fontSize: '1rem',
              color: 'var(--color-text-primary)',
              transition: 'all 0.2s'
            }}
          >
            🔮 Magie
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              background: activeTab === 'gifts' ? 'var(--color-cream)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'gifts' ? '3px solid var(--color-gold)' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'gifts' ? '700' : '400',
              fontSize: '1rem',
              color: 'var(--color-text-primary)',
              transition: 'all 0.2s'
            }}
          >
            🎁 Offrandes
          </button>
        </div>

        {/* Contenu scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--spacing-lg)'
        }}>
          {activeTab === 'magic' ? (
            // TAB MAGIE
            <div>
              <h3 style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-light)',
                marginBottom: 'var(--spacing-md)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Choisis ta magie
              </h3>
              <div style={{
                display: 'grid',
                gap: 'var(--spacing-md)',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
              }}>
                {allMagic.map((magic) => (
                  <div
                    key={magic.id}
                    className="card"
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'var(--color-beige-light)',
                      border: '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      marginBottom: 'var(--spacing-xs)',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {magic.gifUrl ? (
                        <img
                          src={magic.gifUrl}
                          alt={magic.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '2px solid rgba(139, 69, 19, 0.3)'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '2.5rem' }}>{magic.icon}</div>
                      )}
                    </div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      margin: '0 0 var(--spacing-xs) 0',
                      color: 'var(--color-text-primary)',
                      textAlign: 'center'
                    }}>
                      {magic.name}
                    </h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      margin: '0 0 var(--spacing-sm) 0',
                      lineHeight: '1.4',
                      textAlign: 'center'
                    }}>
                      {magic.description}
                    </p>
                    <button
                      onClick={() => handleUseMagic(magic)}
                      className="btn-primary"
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-sm)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-xs)'
                      }}
                    >
                      <span>💰 {magic.cost}</span>
                      <span>Utiliser</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // TAB OFFRANDES
            <div>
              <h3 style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-light)',
                marginBottom: 'var(--spacing-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Sélectionne un destinataire
              </h3>

              {/* Sélection du destinataire */}
              <div style={{
                marginBottom: 'var(--spacing-lg)',
                padding: 'var(--spacing-sm)',
                background: 'var(--color-beige)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid var(--color-brown-light)'
              }}>
                <select
                  value={selectedRecipient?.id || ''}
                  onChange={(e) => {
                    const member = salonMembers.find(m => m.id === parseInt(e.target.value));
                    setSelectedRecipient(member);
                  }}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: '2px solid var(--color-brown-light)',
                    borderRadius: 'var(--border-radius-sm)',
                    background: 'white',
                    fontSize: '1rem',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- Choisir quelqu'un --</option>
                  {salonMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <h3 style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-light)',
                marginBottom: 'var(--spacing-md)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Choisis ton cadeau
              </h3>

              <div style={{
                display: 'grid',
                gap: 'var(--spacing-md)',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
              }}>
                {allGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="card"
                    style={{
                      padding: 'var(--spacing-md)',
                      background: gift.isPremium ? 'linear-gradient(135deg, #FFE5B4, #FFD700)' : 'var(--color-beige-light)',
                      border: gift.isPremium ? '2px solid var(--color-gold)' : '2px solid var(--color-brown-light)',
                      borderRadius: 'var(--border-radius-md)',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {gift.isLegendary && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: 'var(--color-gold)',
                        color: 'var(--color-brown-dark)',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        boxShadow: 'var(--shadow-md)'
                      }}>
                        LÉGENDAIRE
                      </div>
                    )}
                    <div style={{
                      marginBottom: 'var(--spacing-xs)',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {gift.gifUrl ? (
                        <img
                          src={gift.gifUrl}
                          alt={gift.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '2px solid rgba(139, 69, 19, 0.3)'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '2.5rem' }}>{gift.icon}</div>
                      )}
                    </div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      margin: '0 0 var(--spacing-xs) 0',
                      color: 'var(--color-text-primary)',
                      textAlign: 'center'
                    }}>
                      {gift.name}
                    </h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      margin: '0 0 var(--spacing-sm) 0',
                      lineHeight: '1.4',
                      textAlign: 'center'
                    }}>
                      {gift.description}
                    </p>
                    <button
                      onClick={() => handleSendGift(gift)}
                      className="btn-primary"
                      disabled={!selectedRecipient}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-sm)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-xs)',
                        opacity: selectedRecipient ? 1 : 0.5,
                        cursor: selectedRecipient ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <span>💰 {gift.cost}</span>
                      <span>Envoyer</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
