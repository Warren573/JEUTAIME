import React from 'react';

export default function BookPage1({ user, isOwnBook }) {
  return (
    <div style={{
      background: '#2a2a2a',
      borderRadius: '16px',
      padding: '30px',
      color: 'white'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        marginBottom: '20px',
        color: '#667eea'
      }}>
        📖 Moi en vrai
      </h2>

      {/* Phrase d'ambiance */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea20, #764ba220)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        borderLeft: '4px solid #667eea'
      }}>
        <p style={{
          fontStyle: 'italic',
          fontSize: '1.1rem',
          margin: 0,
          color: '#ddd'
        }}>
          "{user?.bio || 'Ma phrase d\'ambiance à personnaliser...'}"
        </p>
      </div>

      {/* Informations de base */}
      <div style={{
        display: 'grid',
        gap: '15px'
      }}>
        <InfoCard label="🎂 Âge" value={`${user?.age || '25'} ans`} />
        <InfoCard label="📍 Ville" value={user?.city || 'Paris'} />
        <InfoCard label="⚧ Genre" value={user?.gender || 'Non renseigné'} />
      </div>

      {/* Description Physique */}
      {user?.physicalDescription && (
        <div style={{
          marginTop: '25px',
          background: 'linear-gradient(135deg, #FF6B9D20, #C2185B20)',
          padding: '20px',
          borderRadius: '12px',
          borderLeft: '4px solid #FF6B9D'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            marginBottom: '12px',
            color: '#FF6B9D'
          }}>
            😄 Description Physique
          </h3>
          <p style={{
            fontSize: '1.05rem',
            color: '#ddd',
            fontStyle: 'italic',
            margin: 0
          }}>
            {user.physicalDescription === 'filiforme' && '🍝 Filiforme (comme un spaghetti)'}
            {user.physicalDescription === 'ras-motte' && '🐭 Ras motte (petite taille)'}
            {user.physicalDescription === 'grande-gigue' && '🦒 Grande gigue (très grand•e)'}
            {user.physicalDescription === 'beaute-interieure' && '✨ Grande beauté intérieure (ce qui compte vraiment)'}
            {user.physicalDescription === 'athletique' && '🏃 Athlétique (toujours en mouvement)'}
            {user.physicalDescription === 'formes-genereuses' && '🍑 En formes généreuses (que de courbes !)'}
            {user.physicalDescription === 'moyenne' && '⚖️ Moyenne (le juste milieu parfait)'}
            {user.physicalDescription === 'muscle' && '💪 Musclé•e (ça se voit sous le t-shirt)'}
          </p>
        </div>
      )}

      {/* Préférences de Rencontre */}
      {(user?.interestedIn || user?.lookingFor || user?.children) && (
        <div style={{
          marginTop: '25px',
          background: 'linear-gradient(135deg, #9C27B020, #7B1FA220)',
          padding: '20px',
          borderRadius: '12px',
          borderLeft: '4px solid #9C27B0'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            marginBottom: '15px',
            color: '#9C27B0'
          }}>
            💕 Préférences de Rencontre
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {user?.interestedIn && (
              <div style={{ color: '#ddd' }}>
                <strong style={{ color: '#aaa' }}>💑 Intéressé•e par :</strong> {user.interestedIn}
              </div>
            )}
            {user?.lookingFor && (
              <div style={{ color: '#ddd' }}>
                <strong style={{ color: '#aaa' }}>🔍 Recherche :</strong> {user.lookingFor}
              </div>
            )}
            {user?.children && (
              <div style={{ color: '#ddd' }}>
                <strong style={{ color: '#aaa' }}>👶 Enfants :</strong> {user.children}
              </div>
            )}
          </div>
        </div>
      )}

      {isOwnBook && (
        <button
          style={{
            marginTop: '25px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%'
          }}
          onClick={() => alert('✏️ Éditeur de profil - À venir !')}
        >
          ✏️ Modifier mes informations
        </button>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '15px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ color: '#888', fontWeight: '600' }}>{label}</span>
      <span style={{ color: 'white', fontWeight: '600' }}>{value}</span>
    </div>
  );
}
