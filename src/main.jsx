import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './styles/layout-rules.css'
import './components/effects/effects.css'

// Service Worker désactivé - causait des problèmes de cache sur Vercel
// Les utilisateurs peuvent toujours utiliser l'app en offline via le cache du navigateur
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
/* v2.0.4 - Avatar paths fixed */
