import React, { useState } from 'react';
import { getOfferings, getPowers } from '../../engine/ContentRegistry';
import {
  activateEffect,
  activateAvatarOverlay,
  activateScreenEffect,
  EFFECT_TYPES
} from '../../engine/EffectEngine';

/**
 * OffrandesPanel - Panneau Offrandes & Pouvoirs
 *
 * Utilise ContentRegistry pour les données et EffectEngine pour les effets.
 * Remplace MagicGiftsPanel avec une architecture data-driven.
 */
export default function OffrandesPanel({
  onClose,
  currentUser,
  salonMembers = [],
  onUsePower,
  onSendOffering
}) {
  const [activeTab, setActiveTab] = useState('offrandes');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const offerings = getOfferings();
  const powers = getPowers();
  const userCoins = currentUser?.coins || 0;

  const showFeedback = (msg, isError = false) => {
    setFeedback({ msg, isError });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleUsePower = (power) => {
    if (userCoins < power.cost) {
      showFeedback(`Il te faut ${power.cost} pièces !`, true);
      return;
    }

    // Appliquer l'effet via EffectEngine
    const userId = currentUser?.id || currentUser?.email || 'user';
    const durationMs = power.duration ? power.duration * 1000 : 0;

    if (power.type === 'salon') {
      // Effet plein écran pour le salon
      activateScreenEffect(userId, power.id, durationMs || 10000);
    } else {
      // Effet sur l'avatar
      activateAvatarOverlay(userId, { emoji: power.icon }, durationMs || 30000);
    }

    if (onUsePower) {
      onUsePower(power);
    }

    showFeedback(`${power.icon} ${power.name} activé !`);
  };

  const handleSendOffering = (offering) => {
    if (userCoins < offering.cost) {
      showFeedback(`Il te faut ${offering.cost} pièces !`, true);
      return;
    }
    if (!selectedRecipient) {
      showFeedback('Choisis d\'abord un destinataire !', true);
      return;
    }

    // Appliquer un effet badge sur le destinataire
    const targetId = selectedRecipient?.id || selectedRecipient?.email || selectedRecipient?.name;
    if (targetId) {
      activateEffect(
        EFFECT_TYPES.PROFILE_BADGE,
        String(targetId),
        30000,
        { text: offering.name, icon: offering.icon, color: '#FF69B4' }
      );
    }

    if (onSendOffering) {
      onSendOffering(offering, selectedRecipient);
    }

    showFeedback(`${offering.icon} ${offering.name} envoyé à ${selectedRecipient.name} !`);
    setSelectedRecipient(null);
  };

  const tabs = [
    { id: 'offrandes', label: '🎁 Offrandes', items: offerings },
    { id: 'pouvoirs', label: '✨ Pouvoirs', items: powers }
  ];

  const currentItems = activeTab === 'offrandes' ? offerings : powers;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--color-cream, #FFF8F0)',
        borderRadius: '20px 20px 0 0',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        border: '2px solid var(--color-brown, #8B5E3C)',
        borderBottom: 'none'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>
              ✨ Magie & Offrandes
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>
              💰 {userCoins} pièces
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, fontSize: '1.2rem', cursor: 'pointer'
            }}
          >✕</button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div style={{
            margin: '8px 20px 0',
            padding: '8px 14px',
            borderRadius: 10,
            background: feedback.isError ? '#FFE0E0' : '#E0FFE8',
            color: feedback.isError ? '#C62828' : '#2E7D32',
            fontSize: '0.85rem', fontWeight: '600', textAlign: 'center'
          }}>
            {feedback.msg}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex', margin: '12px 20px 0',
          background: 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 4
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, cursor: 'pointer',
                background: activeTab === tab.id ? 'white' : 'transparent',
                fontWeight: activeTab === tab.id ? '700' : '500',
                fontSize: '0.9rem',
                boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 6, fontSize: '0.75rem',
                background: 'rgba(0,0,0,0.08)', borderRadius: 20,
                padding: '1px 7px'
              }}>
                {tab.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Sélection destinataire (offrandes seulement) */}
        {activeTab === 'offrandes' && salonMembers.length > 0 && (
          <div style={{ padding: '10px 20px 0' }}>
            <div style={{ fontSize: '0.78rem', color: '#666', marginBottom: 6, fontWeight: '600' }}>
              ENVOYER À :
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {salonMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => setSelectedRecipient(
                    selectedRecipient?.id === member.id ? null : member
                  )}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                    border: selectedRecipient?.id === member.id
                      ? '2px solid #C2185B' : '2px solid #ddd',
                    background: selectedRecipient?.id === member.id
                      ? '#FCE4EC' : 'white',
                    fontSize: '0.82rem', fontWeight: '600',
                    color: selectedRecipient?.id === member.id ? '#C2185B' : '#555'
                  }}
                >
                  {member.online ? '🟢' : '⚫'} {member.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Liste des items */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '12px 20px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10
        }}>
          {currentItems.length === 0 ? (
            <div style={{
              gridColumn: '1/-1', textAlign: 'center',
              padding: '40px 0', color: '#aaa'
            }}>
              Aucun élément disponible
            </div>
          ) : currentItems.map(item => {
            const canAfford = userCoins >= item.cost;
            const needsRecipient = activeTab === 'offrandes' && !selectedRecipient;
            const isDisabled = !canAfford;
            const isPower = activeTab === 'pouvoirs';
            const isSalon = item.type === 'salon';

            return (
              <div
                key={item.id}
                style={{
                  background: isDisabled ? '#f5f5f5' : 'white',
                  borderRadius: 14,
                  border: `2px solid ${isDisabled ? '#e0e0e0' : '#f0e0d0'}`,
                  padding: '12px 10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 6, opacity: isDisabled ? 0.6 : 1
                }}
              >
                <div style={{ fontSize: '2rem', lineHeight: 1 }}>{item.icon}</div>
                <div style={{
                  fontSize: '0.78rem', fontWeight: '700', textAlign: 'center',
                  color: '#333', lineHeight: 1.2
                }}>
                  {item.name}
                </div>
                {isSalon && (
                  <span style={{
                    fontSize: '0.65rem', background: '#E8F5E9',
                    color: '#388E3C', borderRadius: 20, padding: '2px 8px', fontWeight: '700'
                  }}>
                    SALON
                  </span>
                )}
                {item.duration > 0 && (
                  <span style={{
                    fontSize: '0.65rem', color: '#9C27B0', fontWeight: '600'
                  }}>
                    ⏱ {item.duration}s
                  </span>
                )}
                <div style={{
                  fontSize: '0.75rem', color: canAfford ? '#FF6B35' : '#aaa',
                  fontWeight: '700'
                }}>
                  💰 {item.cost} pièces
                </div>
                <button
                  disabled={isDisabled}
                  onClick={() => isPower
                    ? handleUsePower(item)
                    : handleSendOffering(item)
                  }
                  style={{
                    width: '100%', padding: '7px 0', border: 'none', borderRadius: 10,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    background: isDisabled
                      ? '#e0e0e0'
                      : needsRecipient && !isPower
                        ? 'linear-gradient(135deg, #ccc, #aaa)'
                        : 'linear-gradient(135deg, #C2185B, #E91E63)',
                    color: 'white', fontSize: '0.78rem', fontWeight: '700'
                  }}
                >
                  {isPower
                    ? '✨ Activer'
                    : needsRecipient ? 'Choisir destinataire' : '🎁 Envoyer'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
