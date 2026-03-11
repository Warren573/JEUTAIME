import React, { useState } from 'react';
import {
  getOfferingsForSalon,
  getPowersForSalon,
  formatSalonMessage,
} from '../../engine/contentRegistry.js';
import { applyItemToTarget } from '../../engine/effectEngine.js';

/**
 * OFFRANDES PANEL
 *
 * Panneau de jeu pour envoyer des offrandes et pouvoirs.
 * Entièrement data-driven — aucune logique hardcodée.
 *
 * Props :
 *   onClose          () => void
 *   currentUser      { id, name, coins, ... }
 *   salonMembers     [{ id, name, ... }]
 *   salonTag         string  (ex: "metal", "romantique")
 *   initialTab       "offrandes" | "pouvoirs"
 *   onSalonMessage   (text: string) => void  — pour afficher dans le chat salon
 */
export default function OffrandesPanel({
  onClose,
  currentUser,
  salonMembers = [],
  salonTag = 'global',
  initialTab = 'offrandes',
  onSalonMessage,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedTarget, setSelectedTarget] = useState(
    salonMembers.length === 1 ? salonMembers[0] : null
  );
  const [feedback, setFeedback] = useState(null);

  const offrandes = getOfferingsForSalon(salonTag);
  const pouvoirs  = getPowersForSalon(salonTag);
  const userCoins = currentUser?.coins ?? 0;

  const showFeedback = (msg, isError = false) => {
    setFeedback({ msg, isError });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUse = (item) => {
    if (userCoins < item.priceCoins) {
      showFeedback(`💰 Il te faut ${item.priceCoins} pièces !`, true);
      return;
    }
    if (!selectedTarget) {
      showFeedback('👆 Choisis d\'abord un destinataire', true);
      return;
    }

    const result = applyItemToTarget(
      item.id,
      currentUser?.id ?? currentUser?.email ?? 'player',
      selectedTarget.id ?? selectedTarget.name
    );

    if (!result.ok) {
      showFeedback(result.message || 'Erreur', true);
      return;
    }

    // Message salon
    const msg = formatSalonMessage(
      item,
      currentUser?.name ?? 'Quelqu\'un',
      selectedTarget.name
    );
    if (onSalonMessage) onSalonMessage(msg);

    showFeedback(`${item.emoji} ${item.label} → ${selectedTarget.name} !`);
  };

  const tabs = [
    { id: 'offrandes', label: '🎁 Offrandes', items: offrandes },
    { id: 'pouvoirs',  label: '✨ Pouvoirs',   items: pouvoirs  },
  ];
  const currentItems = activeTab === 'offrandes' ? offrandes : pouvoirs;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--color-cream, #FFF8F0)',
        borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: '600px', maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        border: '2px solid var(--color-brown, #8B5E3C)',
        borderBottom: 'none',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.25)',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          padding: '16px 20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#333' }}>
              ✨ Offrandes & Pouvoirs
            </div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 2 }}>
              💰 {userCoins} pièces disponibles
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, fontSize: '1.1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* ── FEEDBACK ── */}
        {feedback && (
          <div style={{
            margin: '8px 16px 0',
            padding: '8px 14px',
            borderRadius: 10,
            background: feedback.isError ? '#FFEBEE' : '#E8F5E9',
            color: feedback.isError ? '#C62828' : '#2E7D32',
            fontSize: '0.85rem', fontWeight: '600', textAlign: 'center',
            flexShrink: 0,
          }}>
            {feedback.msg}
          </div>
        )}

        {/* ── ONGLETS ── */}
        <div style={{
          display: 'flex', margin: '12px 16px 0',
          background: 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 4,
          flexShrink: 0,
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '8px 0', border: 'none', borderRadius: 8,
                cursor: 'pointer', fontSize: '0.9rem',
                background: activeTab === tab.id ? 'white' : 'transparent',
                fontWeight: activeTab === tab.id ? '700' : '500',
                boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 5, fontSize: '0.72rem',
                background: 'rgba(0,0,0,0.08)', borderRadius: 20, padding: '1px 6px',
              }}>
                {tab.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* ── SÉLECTEUR DE DESTINATAIRE ── */}
        {salonMembers.length > 1 && (
          <div style={{ padding: '10px 16px 0', flexShrink: 0 }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: '700', color: '#888',
              marginBottom: 6, letterSpacing: '0.5px',
            }}>
              ENVOYER À :
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {salonMembers.map(member => (
                <button
                  key={member.id ?? member.name}
                  onClick={() => setSelectedTarget(
                    selectedTarget?.id === member.id ? null : member
                  )}
                  style={{
                    flexShrink: 0, padding: '5px 12px', borderRadius: 20,
                    cursor: 'pointer',
                    border: selectedTarget?.id === member.id
                      ? '2px solid #C2185B' : '2px solid #ddd',
                    background: selectedTarget?.id === member.id
                      ? '#FCE4EC' : 'white',
                    fontSize: '0.82rem', fontWeight: '600',
                    color: selectedTarget?.id === member.id ? '#C2185B' : '#555',
                    transition: 'all 0.15s',
                  }}
                >
                  {member.online !== false ? '🟢' : '⚫'} {member.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── GRILLE D'ITEMS ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '12px 16px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          alignContent: 'start',
        }}>
          {currentItems.length === 0 ? (
            <div style={{
              gridColumn: '1/-1', textAlign: 'center',
              padding: '40px 0', color: '#aaa', fontSize: '0.9rem',
            }}>
              Aucun item disponible dans ce salon
            </div>
          ) : currentItems.map(item => {
            const canAfford = userCoins >= item.priceCoins;
            const needsTarget = !selectedTarget && salonMembers.length > 1;

            return (
              <div
                key={item.id}
                style={{
                  background: canAfford ? 'white' : '#f5f5f5',
                  borderRadius: 14,
                  border: `2px solid ${canAfford ? '#f0e0d0' : '#e0e0e0'}`,
                  padding: '12px 10px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 5,
                  opacity: canAfford ? 1 : 0.55,
                }}
              >
                {/* Emoji item */}
                <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>
                  {item.emoji}
                </div>

                {/* Nom */}
                <div style={{
                  fontSize: '0.78rem', fontWeight: '700',
                  textAlign: 'center', color: '#333', lineHeight: 1.2,
                }}>
                  {item.label}
                </div>

                {/* Badge catégorie si metal */}
                {item.salonTags?.includes('metal') && !item.salonTags?.includes('global') && (
                  <span style={{
                    fontSize: '0.6rem', background: '#212121',
                    color: 'white', borderRadius: 20, padding: '2px 7px',
                    fontWeight: '700',
                  }}>
                    MÉTAL
                  </span>
                )}

                {/* Prix */}
                <div style={{
                  fontSize: '0.74rem',
                  color: canAfford ? '#E65100' : '#aaa',
                  fontWeight: '700',
                }}>
                  💰 {item.priceCoins} pièces
                </div>

                {/* Bouton */}
                <button
                  disabled={!canAfford}
                  onClick={() => handleUse(item)}
                  style={{
                    width: '100%', padding: '7px 0',
                    border: 'none', borderRadius: 10,
                    cursor: !canAfford ? 'not-allowed' : 'pointer',
                    background: !canAfford
                      ? '#e0e0e0'
                      : needsTarget
                        ? '#bbb'
                        : 'linear-gradient(135deg, #C2185B, #E91E63)',
                    color: 'white',
                    fontSize: '0.78rem', fontWeight: '700',
                    transition: 'opacity 0.15s',
                  }}
                >
                  {activeTab === 'pouvoirs' ? '✨ Activer' : '🎁 Envoyer'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
