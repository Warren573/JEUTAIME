import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './styles/layout-rules.css'
import './components/effects/effects.css'

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
/* Force cache bust for iPhone - Version: 1.3.0 - PWA Ready 📱✨ */
