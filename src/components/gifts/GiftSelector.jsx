import React, { useState } from 'react';
import { getAllGifts } from '../../config/giftsConfig';
import { sendGift } from '../../utils/giftsSystem';

export default function GiftSelector({ currentUser, receiverId, onClose, onGiftSent }) {
  const [selectedGift, setSelectedGift] = useState(null);
  const gifts = getAllGifts();

  const handleSendGift = () => {
    if (!selectedGift) {
      alert('Sélectionne un cadeau !');
      return;
    }

    const result = sendGift(currentUser.email, receiverId, selectedGift.id);

    if (result.success) {
      alert(result.message);
      if (onGiftSent) {
        onGiftSent(result.gift, result.coinsRemaining);
      }
      onClose();
    } else {
      alert(result.message);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#9E9E9E';
      case 'uncommon': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'legendary': return '#FFD700';
      default: return '#fff';
    }
  };

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'common': return 'Commun';
      case 'uncommon': return 'Peu commun';
      case 'rare': return 'Rare';
      case 'legendary': return 'Légendaire';
      default: return '';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: 'white' }}>
          🎁 Envoyer un Cadeau
        </h2>
        <button
          onClick={onClose}
          style={{
            background: '#333',
            border: 'none',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Solde */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '15px',
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '5px' }}>
          Ton solde
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>
          {currentUser.coins || 0} 🪙
        </div>
      </div>

      {/* Liste des cadeaux */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {gifts.map((gift) => {
            const canAfford = (currentUser.coins || 0) >= gift.cost;
            const isSelected = selectedGift?.id === gift.id;

            return (
              <div
                key={gift.id}
                onClick={() => canAfford && setSelectedGift(gift)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))'
                    : '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  border: isSelected ? '3px solid #667eea' : '2px solid transparent',
                  opacity: canAfford ? 1 : 0.5,
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
              >
                {/* Badge rareté */}
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  fontSize: '8px',
                  color: getRarityColor(gift.rarity),
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  {getRarityLabel(gift.rarity)}
                </div>

                <div style={{ fontSize: '50px', marginBottom: '10px' }}>
                  {gift.emoji}
                </div>

                <h3 style={{
                  fontSize: '14px',
                  margin: '0 0 8px 0',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  {gift.name}
                </h3>

                <p style={{
                  fontSize: '11px',
                  color: '#999',
                  margin: '0 0 10px 0',
                  lineHeight: '1.3',
                  minHeight: '33px'
                }}>
                  {gift.description}
                </p>

                <div style={{
                  fontSize: '16px',
                  color: gift.color,
                  fontWeight: 'bold'
                }}>
                  {gift.cost} 🪙
                </div>

                {!canAfford && (
                  <div style={{
                    fontSize: '11px',
                    color: '#ff6b6b',
                    marginTop: '5px',
                    fontWeight: '600'
                  }}>
                    Pas assez de pièces
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Détails du cadeau sélectionné */}
      {selectedGift && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
            Cadeau sélectionné :
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '40px' }}>{selectedGift.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>
                {selectedGift.name}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
                {selectedGift.effect}
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
              {selectedGift.cost} 🪙
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'envoi */}
      <button
        onClick={handleSendGift}
        disabled={!selectedGift}
        style={{
          width: '100%',
          padding: '18px',
          background: selectedGift
            ? 'linear-gradient(135deg, #667eea, #764ba2)'
            : '#333',
          border: 'none',
          borderRadius: '15px',
          color: 'white',
          fontSize: '18px',
          fontWeight: '700',
          cursor: selectedGift ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s'
        }}
      >
        {selectedGift ? `Envoyer ${selectedGift.emoji}` : 'Sélectionne un cadeau'}
      </button>
    </div>
  );
}
