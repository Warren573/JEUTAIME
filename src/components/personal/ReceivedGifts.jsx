import React, { useState, useEffect } from 'react';
import { getReceivedGifts } from '../../utils/giftsSystem';
import { getGiftById } from '../../config/giftsConfig';

export default function ReceivedGifts({ currentUser }) {
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);

  useEffect(() => {
    // Charger les cadeaux reçus depuis localStorage
    loadReceivedGifts();
  }, [currentUser]);

  const loadReceivedGifts = () => {
    if (!currentUser?.email) {
      setReceivedGifts([]);
      return;
    }

    // Récupérer les cadeaux depuis giftsSystem
    const rawGifts = getReceivedGifts(currentUser.email);

    // Transformer en format d'affichage avec détails du cadeau
    const enrichedGifts = rawGifts.map(gift => {
      const giftDetails = getGiftById(gift.giftId);
      return {
        id: gift.giftId,
        icon: gift.giftEmoji || giftDetails?.emoji || '🎁',
        name: gift.giftName || giftDetails?.name || 'Cadeau',
        description: giftDetails?.description || '',
        from: gift.from || 'Anonyme',
        message: gift.message,
        timestamp: gift.timestamp,
        isLegendary: giftDetails?.isLegendary || false,
        isPremium: giftDetails?.isPremium || false,
        count: 1
      };
    });

    // Grouper les cadeaux identiques
    const grouped = {};
    enrichedGifts.forEach(gift => {
      const key = `${gift.id}_${gift.from}`;
      if (grouped[key]) {
        grouped[key].count++;
      } else {
        grouped[key] = { ...gift };
      }
    });

    setReceivedGifts(Object.values(grouped));
  };

  const stats = {
    total: receivedGifts.length,
    lastReceived: receivedGifts.length > 0 ? receivedGifts[receivedGifts.length - 1] : null,
    mostFrequent: getMostFrequentGift(receivedGifts),
    rareReceived: receivedGifts.filter(g => g.isLegendary || g.isPremium).length
  };

  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '25px',
      color: 'white'
    }}>
      <h3 style={{
        fontSize: '1.6rem',
        marginBottom: '20px',
        color: '#667eea',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🎁 Tes Offrandes Reçues
      </h3>

      {/* Statistiques rapides */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '25px'
      }}>
        <StatCard
          icon="📦"
          label="Total reçu"
          value={stats.total}
        />
        <StatCard
          icon="✨"
          label="Rare / Premium"
          value={stats.rareReceived}
        />
        <StatCard
          icon="🔥"
          label="Plus fréquent"
          value={stats.mostFrequent?.icon || '🎁'}
          isEmoji={true}
        />
      </div>

      {/* Dernière reçue */}
      {stats.lastReceived && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea20, #764ba220)',
          border: '2px solid #667eea',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '0.85rem' }}>
            Dernière offrande reçue :
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }}>{stats.lastReceived.icon}</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0', color: 'white' }}>
                {stats.lastReceived.name}
              </h4>
              {stats.lastReceived.from && (
                <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>
                  De : <strong>{stats.lastReceived.from}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grille des cadeaux reçus */}
      {receivedGifts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '12px'
        }}>
          {receivedGifts.map((gift, index) => (
            <div
              key={index}
              onClick={() => setSelectedGift(gift)}
              style={{
                aspectRatio: '1',
                background: gift.isLegendary
                  ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                  : gift.isPremium
                  ? 'linear-gradient(135deg, #FF6B6B, #FF8E53)'
                  : '#1a1a1a',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid rgba(255,255,255,0.1)',
                position: 'relative',
                animation: 'popIn 0.3s ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.5rem' }}>{gift.icon}</div>
              {gift.count > 1 && (
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: '#FF6B6B',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {gift.count}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#888',
          fontStyle: 'italic'
        }}>
          <p style={{ fontSize: '3rem', margin: '0 0 15px 0' }}>🎁</p>
          <p style={{ margin: 0 }}>Aucune offrande reçue pour le moment...</p>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>
            Commence à échanger dans les salons ! ✨
          </p>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Modal pour afficher les détails */}
      {selectedGift && (
        <GiftModal gift={selectedGift} onClose={() => setSelectedGift(null)} />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, isEmoji = false }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '15px',
      borderRadius: '10px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '5px' }}>
        {label}
      </div>
      <div style={{
        color: 'white',
        fontWeight: '700',
        fontSize: isEmoji ? '1.5rem' : '1.3rem'
      }}>
        {value}
      </div>
    </div>
  );
}

function GiftModal({ gift, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#2a2a2a',
          borderRadius: '16px',
          padding: '30px',
          maxWidth: '400px',
          width: '100%',
          border: '2px solid #667eea'
        }}
      >
        <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '15px' }}>
          {gift.icon}
        </div>
        <h3 style={{
          margin: '0 0 15px 0',
          color: 'white',
          textAlign: 'center',
          fontSize: '1.5rem'
        }}>
          {gift.name}
        </h3>
        <p style={{
          margin: '0 0 20px 0',
          color: '#aaa',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          {gift.description}
        </p>
        {gift.from && (
          <p style={{
            margin: '0 0 20px 0',
            color: '#667eea',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Envoyé par : <strong>{gift.from}</strong>
          </p>
        )}
        {gift.message && (
          <div style={{
            background: '#1a1a1a',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            borderLeft: '4px solid #667eea'
          }}>
            <p style={{ margin: 0, color: '#ddd', fontStyle: 'italic' }}>
              "{gift.message}"
            </p>
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

// Helper function
function getMostFrequentGift(gifts) {
  if (!gifts || gifts.length === 0) return null;

  const counts = {};
  gifts.forEach(gift => {
    const key = gift.id || gift.icon;
    counts[key] = (counts[key] || 0) + (gift.count || 1);
  });

  const mostFrequent = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  );

  return gifts.find(g => (g.id || g.icon) === mostFrequent);
}
