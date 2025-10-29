// Configuration Firebase pour Empires d'Étheria
// À installer: npm install firebase

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuration Firebase (à compléter avec vos propres clés)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Mode démo si pas de config Firebase
const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY;

let app, db, auth;

if (!isDemoMode) {
  try {
    // Initialiser Firebase
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('✅ Firebase initialisé pour Empires d\'Étheria');
  } catch (error) {
    console.error('❌ Erreur Firebase:', error);
  }
}

export { db, auth, isDemoMode };
export default app;
