import React, { useState } from 'react';
import {
  getOfferingsForSalon,
  getPowersForSalon,
  getPowerById,
  formatSalonMessage,
} from '../../engine/contentRegistry.js';
import { applyItemToTarget } from '../../engine/effectEngine.js';
import UserAvatar from '../../avatar/UserAvatar.jsx';

/**
 * OFFRANDES PANEL — UI/UX premium
 *
 * Props :
 *   onClose          () => void
 *   currentUser      { id, name, coins, ... }
 *   salonMembers     [{ id, name, ... }]
 *   salonTag         string
 *   initialTab       "offrandes" | "pouvoirs"
 *   onSalonMessage   (text: string) => void
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
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleUse = (item) => {
    if (userCoins < item.priceCoins) {
      showFeedback(`💰 Il te faut ${item.priceCoins} pièces`, true);
      return;
    }
    if (!selectedTarget) {
      showFeedback('👆 Choisis un destinataire', true);
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

    const msg = formatSalonMessage(
      item,
      currentUser?.name ?? 'Quelqu\'un',
      selectedTarget.name
    );
    if (onSalonMessage) onSalonMessage(msg);
    showFeedback(`${item.emoji} Envoyé à ${selectedTarget.name} !`);
  };

  const currentItems = activeTab === 'offrandes' ? offrandes : pouvoirs;

  // Libellé de durée lisible
  const fmtDuration = (sec) => {
    if (!sec) return null;
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.round(sec / 60)}min`;
    return `${Math.round(sec / 3600)}h`;
  };

  // Noms des contre-sorts (pour les pouvoirs)
  const getCancelByLabel = (cancelBy) => {
    if (!cancelBy?.length) return null;
    return cancelBy.map(id => getPowerById(id)?.label ?? id).join(', ');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 1000,
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: '600px', maxHeight: '86vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -12px 40px rgba(0,0,0,0.2)',
      }}>

        {/* ── DRAG HANDLE ── */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 36, height: 4, background: '#e0e0e0', borderRadius: 99 }} />
        </div>

        {/* ── HEADER ── */}
        <div style={{
          padding: '0 18px 12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0, borderBottom: '1px solid #f0f0f0',
        }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1a1a1a', letterSpacing: '-0.3px' }}>
              Offrandes & Pouvoirs
            </div>
            <div style={{ fontSize: '0.75rem', color: '#C2185B', marginTop: 2, fontWeight: '600' }}>
              💰 {userCoins} pièces
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5', border: 'none', borderRadius: '50%',
              width: 34, height: 34, fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666',
            }}
          >✕</button>
        </div>

        {/* ── ONGLETS ── */}
        <div style={{
          display: 'flex', margin: '10px 16px 0',
          background: '#f5f5f5', borderRadius: 12, padding: 3,
          flexShrink: 0,
        }}>
          {[
            { id: 'offrandes', label: '🎁 Offrandes', count: offrandes.length },
            { id: 'pouvoirs',  label: '✨ Pouvoirs',   count: pouvoirs.length  },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '7px 0', border: 'none', borderRadius: 10,
                cursor: 'pointer', fontSize: '0.85rem',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #C2185B, #E91E63)'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#888',
                fontWeight: activeTab === tab.id ? '700' : '500',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(194,24,91,0.3)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 5, fontSize: '0.68rem', opacity: 0.75,
                background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                borderRadius: 20, padding: '1px 6px',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── SÉLECTEUR DE DESTINATAIRE ── */}
        {salonMembers.length > 1 && (
          <div style={{ padding: '10px 16px 0', flexShrink: 0 }}>
            <div style={{
              fontSize: '0.65rem', fontWeight: '700', color: '#bbb',
              marginBottom: 8, letterSpacing: '0.8px', textTransform: 'uppercase',
            }}>
              Envoyer à
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {salonMembers.map(member => {
                const isSelected = selectedTarget?.id === member.id;
                return (
                  <button
                    key={member.id ?? member.name}
                    onClick={() => setSelectedTarget(isSelected ? null : member)}
                    style={{
                      flexShrink: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: '6px 10px', borderRadius: 12,
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #C2185B' : '2px solid #eee',
                      background: isSelected ? '#FCE4EC' : '#fafafa',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      border: isSelected ? '2px solid #C2185B' : '2px solid transparent',
                      borderRadius: '50%',
                    }}>
                      <UserAvatar user={member} size={38} />
                      {member.online !== false && (
                        <div style={{
                          position: 'absolute', bottom: 0, right: 0,
                          width: 9, height: 9, background: '#4CAF50',
                          borderRadius: '50%', border: '1.5px solid white',
                        }} />
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.72rem', fontWeight: '700',
                      color: isSelected ? '#C2185B' : '#555',
                      maxWidth: 56, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {member.name}
                    </div>
                    {isSelected && (
                      <div style={{
                        fontSize: '0.6rem', background: '#C2185B', color: 'white',
                        borderRadius: 20, padding: '1px 6px', fontWeight: '700',
                      }}>✓</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {feedback && (
          <div style={{
            margin: '8px 16px 0',
            padding: '7px 14px',
            borderRadius: 10,
            background: feedback.isError ? '#FFEBEE' : '#E8F5E9',
            color: feedback.isError ? '#C62828' : '#2E7D32',
            fontSize: '0.82rem', fontWeight: '600', textAlign: 'center',
            flexShrink: 0,
          }}>
            {feedback.msg}
          </div>
        )}

        {/* ── GRILLE D'ITEMS ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '10px 12px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
          alignContent: 'start',
        }}>
          {currentItems.length === 0 ? (
            <div style={{
              gridColumn: '1/-1', textAlign: 'center',
              padding: '40px 0', color: '#bbb', fontSize: '0.88rem',
            }}>
              Aucun item dans ce salon
            </div>
          ) : currentItems.map(item => {
            const canAfford = userCoins >= item.priceCoins;
            const needsTarget = !selectedTarget && salonMembers.length > 1;
            const isClickable = canAfford && !needsTarget;
            const duration = fmtDuration(item.effect?.durationSec);
            const cancelLabel = getCancelByLabel(item.cancelBy);

            return (
              <div
                key={item.id}
                style={{
                  background: canAfford ? '#fff' : '#fafafa',
                  borderRadius: 14,
                  border: `1.5px solid ${canAfford ? '#f0e0e8' : '#ebebeb'}`,
                  padding: '10px 10px 8px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 4,
                  opacity: canAfford ? 1 : 0.5,
                }}
              >
                {/* Emoji */}
                <div style={{ fontSize: '1.9rem', lineHeight: 1, marginBottom: 1 }}>
                  {item.emoji}
                </div>

                {/* Nom */}
                <div style={{
                  fontSize: '0.76rem', fontWeight: '700',
                  textAlign: 'center', color: '#1a1a1a', lineHeight: 1.2,
                }}>
                  {item.label}
                </div>

                {/* Méta : durée + annulation */}
                {(duration || cancelLabel) && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                    {duration && (
                      <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: '500' }}>
                        ⏱ {duration}
                      </div>
                    )}
                    {cancelLabel && (
                      <div style={{
                        fontSize: '0.6rem', color: '#C2185B', fontWeight: '600',
                        background: '#FCE4EC', borderRadius: 20, padding: '1px 7px',
                        textAlign: 'center', maxWidth: '100%',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        💋 {cancelLabel}
                      </div>
                    )}
                  </div>
                )}

                {/* Prix */}
                <div style={{
                  fontSize: '0.72rem',
                  color: canAfford ? '#C2185B' : '#bbb',
                  fontWeight: '700',
                  textDecoration: canAfford ? 'none' : 'line-through',
                }}>
                  💰 {item.priceCoins}
                </div>

                {/* CTA */}
                <button
                  onClick={() => isClickable && handleUse(item)}
                  style={{
                    width: '100%', padding: '7px 0', marginTop: 2,
                    border: 'none', borderRadius: 10,
                    cursor: isClickable ? 'pointer' : 'default',
                    fontSize: '0.76rem', fontWeight: '700',
                    transition: 'opacity 0.15s',
                    ...(isClickable ? {
                      background: 'linear-gradient(135deg, #C2185B, #E91E63)',
                      color: 'white',
                      boxShadow: '0 3px 10px rgba(194,24,91,0.3)',
                    } : needsTarget ? {
                      background: '#f5f5f5',
                      color: '#aaa',
                      border: '1.5px dashed #ddd',
                    } : {
                      background: '#f0f0f0',
                      color: '#bbb',
                    }),
                  }}
                >
                  {!canAfford
                    ? '❌ Insuffisant'
                    : needsTarget
                      ? '👆 Choisir cible'
                      : activeTab === 'pouvoirs' ? '✨ Activer' : '🎁 Envoyer'
                  }
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
