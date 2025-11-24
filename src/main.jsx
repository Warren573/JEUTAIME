import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './styles/mobile.css'
import { setupDeviceOptimizations, setupViewport } from './utils/deviceDetection'

// Optimisations spécifiques à l'appareil
setupDeviceOptimizations()
setupViewport()

// Enregistrer le Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker enregistré:', registration);
      })
      .catch((error) => {
        console.log('❌ Erreur Service Worker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
/* Force cache bust for iPhone - Version: 1.4.0 - PWA Configuration ✨📱 */
