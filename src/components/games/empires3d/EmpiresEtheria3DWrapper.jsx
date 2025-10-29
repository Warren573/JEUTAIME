// Wrapper sécurisé pour Empires 3D
import React, { Suspense, lazy, useState, useEffect } from 'react';

// Lazy loading du composant 3D pour éviter les erreurs de build
const EmpiresEtheria3DLazy = lazy(() =>
  import('./EmpiresEtheria3D').catch(err => {
    console.error('❌ Erreur chargement 3D:', err);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    return { default: (props) => <Fallback3D error={err} {...props} /> };
  })
);

function Fallback3D({ error, setGameScreen }) {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      <button
        onClick={() => setGameScreen && setGameScreen(null)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          background: '#1a1a1a',
          border: '1px solid #333',
          color: 'white',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        ← Retour
      </button>

      <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
      <h2 style={{ marginBottom: '10px' }}>Erreur de chargement 3D</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        Le mode 3D n'a pas pu se charger.
      </p>

      {error && (
        <div style={{
          maxWidth: '600px',
          padding: '15px',
          background: '#1a1a1a',
          borderRadius: '10px',
          border: '1px solid #333',
          fontSize: '12px',
          color: '#ff6b6b',
          textAlign: 'left',
          marginTop: '20px',
          fontFamily: 'monospace',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Détails de l'erreur:</div>
          <div>{error.message || error.toString()}</div>
        </div>
      )}

      <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
        Essayez la version 2D depuis le menu Jeux.
      </p>
      <p style={{ fontSize: '12px', color: '#444', marginTop: '10px' }}>
        Ouvrez la console (F12) pour plus de détails.
      </p>
    </div>
  );
}

export default function EmpiresEtheria3DWrapper(props) {
  return (
    <Suspense fallback={
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: 'white'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏰</div>
          <div>Chargement du mode 3D...</div>
        </div>
      </div>
    }>
      <EmpiresEtheria3DLazy {...props} />
    </Suspense>
  );
}
