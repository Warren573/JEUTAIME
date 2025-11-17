// Interface utilisateur overlay pour Empires d'Étheria 3D
import React from 'react';

export default function UI3D({
  gameState,
  currentPlayer,
  totalGames,
  totalVictories,
  bestMana,
  onRollDice,
  onBuyCity,
  onPassCity,
  onReset,
  showStats,
  setShowStats
}) {
  const victoryRate = totalGames > 0 ? Math.round((totalVictories / totalGames) * 100) : 0;

  return (
    <>
      {/* Header - Stats */}
      {showStats && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '20px',
          right: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '10px',
          zIndex: 50,
          pointerEvents: 'none'
        }}>
          <StatCard title="Parties" value={totalGames} color="#667eea" />
          <StatCard title="Victoires" value={totalVictories} color="#10b981" />
          <StatCard title="Taux" value={`${victoryRate}%`} color="#f59e0b" />
          <StatCard title="Best Mana" value={bestMana} color="#ec4899" />
        </div>
      )}

      {/* Toggle Stats Button */}
      <button
        onClick={() => setShowStats(!showStats)}
        style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          zIndex: 100,
          padding: '8px 12px',
          background: 'rgba(26, 26, 26, 0.9)',
          border: '1px solid #333',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          backdropFilter: 'blur(10px)'
        }}
      >
        {showStats ? '📊 ✕' : '📊'}
      </button>

      {/* Info Panel - Current Player */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(15, 15, 30, 0.95)',
        borderRadius: '20px',
        padding: '20px',
        border: '2px solid rgba(139, 92, 246, 0.5)',
        backdropFilter: 'blur(20px)',
        zIndex: 50
      }}>
        {/* Player Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: currentPlayer.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              border: '3px solid white',
              boxShadow: '0 0 20px ' + currentPlayer.color
            }}>
              {currentPlayer.name[0]}
            </div>

            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
                {currentPlayer.name}
              </div>
              <div style={{ fontSize: '14px', color: '#a0a0b0' }}>
                Tour {gameState.currentPlayerIndex + 1}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#a0a0b0', marginBottom: '4px' }}>
              Mana
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#22d3ee', fontFamily: 'monospace' }}>
              {currentPlayer.mana} 💎
            </div>
          </div>
        </div>

        {/* Message */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '15px',
          fontSize: '14px',
          color: '#e0e0ff',
          textAlign: 'center',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          {gameState.message}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {gameState.phase === 'roll' && (
            <ActionButton
              onClick={onRollDice}
              label="🎲 Lancer le dé"
              color="#8b5cf6"
              glow
            />
          )}

          {gameState.phase === 'buy' && (
            <>
              <ActionButton
                onClick={onBuyCity}
                label={`💰 Acheter (${gameState.selectedCell.cost} mana)`}
                color="#10b981"
              />
              <ActionButton
                onClick={onPassCity}
                label="❌ Passer"
                color="#ef4444"
              />
            </>
          )}

          {gameState.phase === 'victory' && (
            <ActionButton
              onClick={onReset}
              label="🔄 Nouvelle partie"
              color="#f59e0b"
              glow
            />
          )}

          {/* Info Button */}
          <ActionButton
            onClick={() => alert('Empires d\'Étheria 3D\n\nObjectif: Atteindre 100 mana OU contrôler 3 villes légendaires (coût ≥ 20).\n\n🏰 Villes: Achète et perçois des loyers\n⚡ Événements: Effets aléatoires\n🔮 Artefacts: Bonus permanents\n🌀 Portails: Gains de mana')}
            label="❓ Info"
            color="#6b7280"
            small
          />
        </div>

        {/* Artifacts */}
        {currentPlayer.artifacts && currentPlayer.artifacts.length > 0 && (
          <div style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ fontSize: '12px', color: '#a0a0b0', marginBottom: '8px' }}>
              🔮 Artefacts actifs
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {currentPlayer.artifacts.map((artifact, index) => (
                <div
                  key={index}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#e0e0ff',
                    border: '1px solid rgba(139, 92, 246, 0.5)'
                  }}
                >
                  {artifact.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Other Players Info (Top Right) */}
      <div style={{
        position: 'absolute',
        top: '180px',
        right: '20px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {gameState.players.map((player, index) => {
          if (index === gameState.currentPlayerIndex) return null;

          return (
            <div
              key={player.id}
              style={{
                background: 'rgba(15, 15, 30, 0.9)',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(10px)',
                minWidth: '150px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: player.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'white',
                  border: '2px solid white'
                }}>
                  {player.name[0]}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                    {player.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#22d3ee', fontFamily: 'monospace' }}>
                    {player.mana} 💎
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: 'rgba(15, 15, 30, 0.9)',
      borderRadius: '12px',
      padding: '12px',
      border: '1px solid ' + color + '50',
      backdropFilter: 'blur(10px)',
      pointerEvents: 'auto'
    }}>
      <div style={{ fontSize: '10px', color: '#a0a0b0', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '18px', fontWeight: '700', color: color }}>
        {value}
      </div>
    </div>
  );
}

function ActionButton({ onClick, label, color, glow, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? '8px 12px' : '12px 24px',
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        border: 'none',
        color: 'white',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: small ? '12px' : '14px',
        boxShadow: glow ? `0 0 20px ${color}80` : 'none',
        transition: 'all 0.2s',
        flex: small ? '0' : '1'
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = `0 0 30px ${color}`;
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = glow ? `0 0 20px ${color}80` : 'none';
      }}
    >
      {label}
    </button>
  );
}
