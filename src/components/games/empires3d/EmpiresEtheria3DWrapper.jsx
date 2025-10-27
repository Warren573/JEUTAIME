// Wrapper sécurisé pour Empires 3D
import React, { Suspense, lazy } from 'react';

// Lazy loading du composant 3D pour éviter les erreurs de build
const EmpiresEtheria3DLazy = lazy(() =>
  import('./EmpiresEtheria3D').catch(err => {
    console.error('Erreur chargement 3D:', err);
    return { default: () => <Fallback3D /> };
  })
);

function Fallback3D() {
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
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏰</div>
      <h2 style={{ marginBottom: '10px' }}>Empires d'Étheria 3D</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        Le mode 3D n'est pas disponible sur cet appareil.
      </p>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Essayez la version 2D depuis le menu Jeux.
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
