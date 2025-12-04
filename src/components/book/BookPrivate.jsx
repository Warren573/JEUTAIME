import React from 'react';

export default function BookPrivate({ user, isOwnBook }) {
  const privateContent = user?.privateContent || {
    secretPassions: ['Écriture nocturne 📝', 'Philosophie 🤔', 'Astrologie ✨'],
    deepThoughts: 'Ce que peu de gens savent sur moi : j\'adore les conversations profondes à 3h du matin, quand tout le monde dort et que les masques tombent.',
    dreams: 'Voyager en van aménagé pendant 6 mois',
    fears: 'La routine qui endort les rêves',
    secrets: '3 secrets que seuls mes proches connaissent'
  };

  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '30px',
      color: 'white'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{ fontSize: '2.5rem' }}>🔒</div>
        <div>
          <h2 style={{
            fontSize: '1.8rem',
            margin: 0,
            color: '#667eea'
          }}>
            Section Ultra-Privée
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '0.9rem' }}>
            {isOwnBook ? 'Tes secrets les mieux gardés' : `Débloqué après 10 lettres ✨`}
          </p>
        </div>
      </div>

      {/* Passions secrètes */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        borderLeft: '4px solid #FFD700'
      }}>
        <h4 style={{ color: '#FFD700', marginBottom: '15px', fontSize: '1.1rem' }}>
          ✨ Mes passions secrètes
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {privateContent.secretPassions.map((passion, index) => (
            <div
              key={index}
              style={{
                background: '#2a2a2a',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            >
              {passion}
            </div>
          ))}
        </div>
      </div>

      {/* Pensées profondes */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        borderLeft: '4px solid #764ba2'
      }}>
        <h4 style={{ color: '#764ba2', marginBottom: '15px', fontSize: '1.1rem' }}>
          💭 Pensées profondes
        </h4>
        <p style={{
          margin: 0,
          color: '#ddd',
          lineHeight: '1.7',
          fontStyle: 'italic'
        }}>
          "{privateContent.deepThoughts}"
        </p>
      </div>

      {/* Rêves & Objectifs */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        borderLeft: '4px solid #4ECDC4'
      }}>
        <h4 style={{ color: '#4ECDC4', marginBottom: '15px', fontSize: '1.1rem' }}>
          🌟 Mon rêve secret
        </h4>
        <p style={{
          margin: 0,
          color: '#ddd',
          fontSize: '1rem'
        }}>
          {privateContent.dreams}
        </p>
      </div>

      {/* Peurs */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        borderLeft: '4px solid #FF6B6B'
      }}>
        <h4 style={{ color: '#FF6B6B', marginBottom: '15px', fontSize: '1.1rem' }}>
          😰 Ce qui me fait peur
        </h4>
        <p style={{
          margin: 0,
          color: '#ddd',
          fontSize: '1rem'
        }}>
          {privateContent.fears}
        </p>
      </div>

      {/* Secrets */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea20, #764ba220)',
        borderRadius: '12px',
        padding: '20px',
        border: '2px solid #667eea'
      }}>
        <h4 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.1rem' }}>
          🤫 Mes secrets
        </h4>
        <p style={{
          margin: 0,
          color: '#ddd',
          fontSize: '0.95rem',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          {privateContent.secrets}
        </p>
      </div>

      {isOwnBook && (
        <button
          style={{
            marginTop: '25px',
            padding: '15px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%',
            fontSize: '1rem'
          }}
          onClick={() => alert('🔒 Modifier section privée - À venir !')}
        >
          ✏️ Modifier ma section privée
        </button>
      )}

      {!isOwnBook && (
        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: '#1a1a1a',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px dashed #FFD700'
        }}>
          <p style={{ margin: 0, color: '#FFD700', fontWeight: '600' }}>
            🔓 Cette section a été débloquée grâce à vos échanges ! ✨
          </p>
        </div>
      )}
    </div>
  );
}
