import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import './styles/layout-rules.css'
import './components/effects/effects.css'

// Afficher les erreurs directement à l'écran pour déboguer
window.addEventListener('error', (e) => {
  document.body.innerHTML = `
    <div style="padding: 20px; background: #ff0000; color: white; font-family: monospace;">
      <h1>❌ ERREUR DÉTECTÉE</h1>
      <p><strong>Message:</strong> ${e.message}</p>
      <p><strong>Fichier:</strong> ${e.filename}</p>
      <p><strong>Ligne:</strong> ${e.lineno}:${e.colno}</p>
      <pre style="background: #fff; color: #000; padding: 10px; overflow: auto;">${e.error?.stack || 'Pas de stack trace'}</pre>
    </div>
  `;
});

// Service Worker désactivé temporairement pour déboguer l'écran blanc
// Désinscrire tous les Service Workers existants
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
        console.log('🗑️ Service Worker désinscrit:', registration.scope);
      }
    });
  });
}

// Wrapper pour attraper les erreurs React
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px', background: '#ff6b00', color: 'white', fontFamily: 'monospace', minHeight: '100vh'}}>
          <h1>🛑 ERREUR REACT</h1>
          <p><strong>Message:</strong> {this.state.error?.toString()}</p>
          <pre style={{background: '#fff', color: '#000', padding: '10px', overflow: 'auto', whiteSpace: 'pre-wrap'}}>
            {this.state.error?.stack}
          </pre>
          <h2>Component Stack:</h2>
          <pre style={{background: '#fff', color: '#000', padding: '10px', overflow: 'auto', whiteSpace: 'pre-wrap'}}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  // Import dynamique pour capturer les erreurs d'import
  import('./App.jsx').then((module) => {
    const App = module.default;
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    );
  }).catch((error) => {
    document.body.innerHTML = `
      <div style="padding: 20px; background: #9c27b0; color: white; font-family: monospace; min-height: 100vh;">
        <h1>💥 ERREUR DE CHARGEMENT</h1>
        <p><strong>Impossible de charger App.jsx</strong></p>
        <p><strong>Message:</strong> ${error.message}</p>
        <pre style="background: #fff; color: #000; padding: 10px; overflow: auto; white-space: pre-wrap;">${error.stack}</pre>
      </div>
    `;
  });
} catch (error) {
  document.body.innerHTML = `
    <div style="padding: 20px; background: #f44336; color: white; font-family: monospace; min-height: 100vh;">
      <h1>🔥 ERREUR CRITIQUE</h1>
      <p><strong>Message:</strong> ${error.message}</p>
      <pre style="background: #fff; color: #000; padding: 10px; overflow: auto; white-space: pre-wrap;">${error.stack}</pre>
    </div>
  `;
}
/* Debug version - Will show errors on screen */
