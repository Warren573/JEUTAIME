import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './styles/layout-rules.css'
import './components/effects/effects.css'

// Afficher TOUTES les erreurs à l'écran
window.onerror = function(msg, url, lineNo, columnNo, error) {
  document.body.innerHTML = `
    <div style="padding: 20px; background: #ff0000; color: white; font-family: monospace; min-height: 100vh; overflow: auto;">
      <h1>❌ ERREUR JAVASCRIPT</h1>
      <p><strong>Message:</strong> ${msg}</p>
      <p><strong>Fichier:</strong> ${url}</p>
      <p><strong>Ligne:</strong> ${lineNo}:${columnNo}</p>
      <pre style="background: #fff; color: #000; padding: 10px; overflow: auto; white-space: pre-wrap; max-height: 400px;">${error ? error.stack : 'Pas de stack trace'}</pre>
      <hr/>
      <p style="font-size: 12px;">Build v2.0.5-debug | ${new Date().toISOString()}</p>
    </div>
  `;
  return true;
};

// Capturer les erreurs de promesses non gérées
window.addEventListener('unhandledrejection', function(event) {
  document.body.innerHTML = `
    <div style="padding: 20px; background: #ff6b00; color: white; font-family: monospace; min-height: 100vh; overflow: auto;">
      <h1>⚠️ PROMESSE REJETÉE</h1>
      <p><strong>Raison:</strong> ${event.reason}</p>
      <pre style="background: #fff; color: #000; padding: 10px; overflow: auto; white-space: pre-wrap; max-height: 400px;">${event.reason?.stack || JSON.stringify(event.reason, null, 2)}</pre>
      <hr/>
      <p style="font-size: 12px;">Build v2.0.5-debug | ${new Date().toISOString()}</p>
    </div>
  `;
});

// Service Worker désactivé
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
        console.log('🗑️ SW désinscrit');
      }
    });
  });
}

// Error Boundary React
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
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px', background: '#9c27b0', color: 'white', fontFamily: 'monospace', minHeight: '100vh', overflow: 'auto'}}>
          <h1>🛑 ERREUR REACT</h1>
          <p><strong>Message:</strong> {this.state.error?.toString()}</p>
          <pre style={{background: '#fff', color: '#000', padding: '10px', overflow: 'auto', whiteSpace: 'pre-wrap', maxHeight: '300px'}}>
            {this.state.error?.stack}
          </pre>
          <h2 style={{marginTop: '20px'}}>Component Stack:</h2>
          <pre style={{background: '#fff', color: '#000', padding: '10px', overflow: 'auto', whiteSpace: 'pre-wrap', maxHeight: '200px'}}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <hr/>
          <p style={{fontSize: '12px'}}>Build v2.0.5-debug | {new Date().toISOString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Element #root introuvable dans le DOM! Vérifiez index.html');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );

  console.log('✅ Application montée avec succès');

} catch (error) {
  document.body.innerHTML = `
    <div style="padding: 20px; background: #f44336; color: white; font-family: monospace; min-height: 100vh; overflow: auto;">
      <h1>🔥 ERREUR FATALE AU MONTAGE</h1>
      <p><strong>Message:</strong> ${error.message}</p>
      <pre style="background: #fff; color: #000; padding: 10px; overflow: auto; white-space: pre-wrap; max-height: 400px;">${error.stack}</pre>
      <hr/>
      <p style="font-size: 12px;">Build v2.0.5-debug | ${new Date().toISOString()}</p>
    </div>
  `;
  console.error('Erreur fatale:', error);
}
/* v2.0.5-debug */
