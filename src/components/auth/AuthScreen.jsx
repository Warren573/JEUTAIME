import React, { useState } from 'react';

export default function AuthScreen({ onLogin, onSignup }) {
  const [mode, setMode] = useState('welcome'); // welcome, login, signup
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Simple validation
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

    if (user) {
      onLogin(user);
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleSignup = () => {
    setError('');

    if (!signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    if (users.find(u => u.email === signupData.email)) {
      setError('Cet email est déjà utilisé');
      return;
    }

    // Go to profile creation
    onSignup(signupData.email, signupData.password);
  };

  if (mode === 'welcome') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>💕</div>
          <h1 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 10px 0', color: 'white' }}>JeuTaime</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '50px' }}>
            L'app de rencontres anti-superficielle
          </p>

          {/* Features */}
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '25px', marginBottom: '40px', textAlign: 'left' }}>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '28px' }}>📝</span>
              <div>
                <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>Profils authentiques</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Bio obligatoire de 50 caractères minimum</div>
              </div>
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '28px' }}>🎮</span>
              <div>
                <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>Mini-jeux</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Gagnez des pièces en jouant</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '28px' }}>💌</span>
              <div>
                <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>Lettres romantiques</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Photos révélées après 10 lettres</div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={() => setMode('signup')}
            style={{ width: '100%', padding: '18px', background: 'white', border: 'none', borderRadius: '15px', color: '#667eea', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginBottom: '15px' }}
          >
            Créer un compte
          </button>
          <button
            onClick={() => setMode('login')}
            style={{ width: '100%', padding: '18px', background: 'rgba(255,255,255,0.2)', border: '2px solid white', borderRadius: '15px', color: 'white', fontSize: '18px', fontWeight: '700', cursor: 'pointer' }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <button
            onClick={() => setMode('welcome')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', fontWeight: '600' }}
          >
            ← Retour
          </button>

          <div style={{ background: 'white', borderRadius: '20px', padding: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Connexion</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Bon retour sur JeuTaime !</p>

            {error && (
              <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Email
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="votre@email.com"
                style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="••••••••"
                style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
              />
            </div>

            <button
              onClick={handleLogin}
              style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '15px', color: 'white', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginBottom: '15px' }}
            >
              Se connecter
            </button>

            <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
              Pas encore de compte ?{' '}
              <span onClick={() => setMode('signup')} style={{ color: '#667eea', fontWeight: '600', cursor: 'pointer' }}>
                S'inscrire
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'signup') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <button
            onClick={() => setMode('welcome')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', fontWeight: '600' }}
          >
            ← Retour
          </button>

          <div style={{ background: 'white', borderRadius: '20px', padding: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 10px 0', color: '#333' }}>Inscription</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Créez votre compte JeuTaime</p>

            {error && (
              <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Email
              </label>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder="votre@email.com"
                style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                placeholder="••••••••"
                style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                style={{ width: '100%', padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px' }}
              />
            </div>

            <button
              onClick={handleSignup}
              style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '15px', color: 'white', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginBottom: '15px' }}
            >
              Continuer
            </button>

            <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
              Déjà un compte ?{' '}
              <span onClick={() => setMode('login')} style={{ color: '#667eea', fontWeight: '600', cursor: 'pointer' }}>
                Se connecter
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
