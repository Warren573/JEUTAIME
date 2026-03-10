import React, { useState } from 'react';
import { allMagic, allGifts } from '../../data/magicGifts';

export default function MagicInventory({ currentUser, onUseItem }) {
  const [activeTab, setActiveTab] = useState('magic');

  const userCoins = currentUser?.coins || 0;

  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '20px',
      color: 'white'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '15px',
        color: '#667eea',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🔮 Mon Inventaire Magique
      </h3>

      {/* Affichage des pièces */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
        padding: '12px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: '#000', fontWeight: '700', fontSize: '1.1rem' }}>
          💰 Tes pièces
        </span>
        <span style={{ color: '#000', fontWeight: '900', fontSize: '1.3rem' }}>
          {userCoins}
        </span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('magic')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'magic'
              ? 'linear-gradient(135deg, #667eea, #764ba2)'
              : '#1a1a1a',
            border: activeTab === 'magic' ? '2px solid #667eea' : 'none',
            color: 'white',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
            transition: 'all 0.2s'
          }}
        >
          ✨ Magies ({allMagic.length})
        </button>
        <button
          onClick={() => setActiveTab('gifts')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'gifts'
              ? 'linear-gradient(135deg, #667eea, #764ba2)'
              : '#1a1a1a',
            border: activeTab === 'gifts' ? '2px solid #667eea' : 'none',
            color: 'white',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
            transition: 'all 0.2s'
          }}
        >
          🎁 Cadeaux ({allGifts.length})
        </button>
      </div>

      {/* Liste des items */}
      <div style={{
        display: 'grid',
        gap: '12px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {activeTab === 'magic' ? (
          allMagic.map((magic) => (
            <ItemCard
              key={magic.id}
              item={magic}
              userCoins={userCoins}
              onUse={() => onUseItem && onUseItem(magic)}
            />
          ))
        ) : (
          allGifts.map((gift) => (
            <ItemCard
              key={gift.id}
              item={gift}
              userCoins={userCoins}
              onUse={() => onUseItem && onUseItem(gift)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ItemCard({ item, userCoins, onUse }) {
  const canAfford = userCoins >= item.cost;
  const isPremium = item.isPremium || false;
  const isLegendary = item.isLegendary || false;

  let borderColor = '#444';
  if (isLegendary) borderColor = '#FFD700';
  else if (isPremium) borderColor = '#FF6B6B';

  return (
    <div style={{
      background: '#1a1a1a',
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '15px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '15px',
      transition: 'all 0.2s',
      opacity: canAfford ? 1 : 0.6
    }}>
      <div style={{
        flexShrink: 0
      }}>
        {item.gifUrl ? (
          <img
            src={item.gifUrl}
            alt={item.name}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          />
        ) : (
          <div style={{ fontSize: '2.5rem' }}>{item.icon}</div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <h4 style={{
            margin: 0,
            fontSize: '1rem',
            color: 'white'
          }}>
            {item.name}
            {isPremium && ' 🔥'}
            {isLegendary && ' 👑'}
          </h4>
          <span style={{
            background: canAfford ? '#4CAF50' : '#666',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            marginLeft: '10px'
          }}>
            💰 {item.cost}
          </span>
        </div>

        <p style={{
          margin: '0 0 12px 0',
          fontSize: '0.9rem',
          color: '#aaa',
          lineHeight: '1.4'
        }}>
          {item.description}
        </p>

        <button
          onClick={onUse}
          disabled={!canAfford}
          style={{
            padding: '8px 16px',
            background: canAfford
              ? 'linear-gradient(135deg, #667eea, #764ba2)'
              : '#555',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            cursor: canAfford ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            fontSize: '0.9rem',
            width: '100%',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (canAfford) e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          {canAfford ? 'Utiliser ✨' : 'Pas assez de pièces'}
        </button>
      </div>
    </div>
  );
}
