import React from 'react';

export default function StoryTimeGame({ setGameScreen, storyText, setStoryText, storyInput, setStoryInput }) {
  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '100px',
      background: 'var(--color-beige-light)',
      padding: 'var(--spacing-md)'
    }}>
      <button
        onClick={() => setGameScreen(null)}
        style={{
          padding: '12px 24px',
          background: 'var(--color-brown)',
          border: '2px solid var(--color-gold)',
          color: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-md)',
          marginBottom: '20px',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '1rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        ← Retour aux jeux
      </button>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600', color: 'var(--color-brown-dark)' }}>📖 Continue l'histoire</h2>
      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px' }}>
        <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '15px', marginBottom: '15px', minHeight: '150px', maxHeight: '200px', overflowY: 'auto' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>{storyText}</p>
        </div>
        <textarea value={storyInput} onChange={(e) => setStoryInput(e.target.value)} placeholder="Ajoute une phrase..." style={{ width: '100%', padding: '12px', background: '#0a0a0a', color: 'white', border: '1px solid #333', borderRadius: '8px', marginBottom: '12px', fontSize: '14px', resize: 'none', height: '80px' }} />
        <button onClick={() => { if (storyInput.trim()) { setStoryText(storyText + ' ' + storyInput); setStoryInput(''); } }} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Ajouter</button>
      </div>
    </div>
  );
}
