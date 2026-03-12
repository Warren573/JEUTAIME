import React from 'react';
import ScreenHeader from '../common/ScreenHeader';

export default function StoryTimeGame({ setGameScreen, storyText, setStoryText, storyInput, setStoryInput }) {
  return (
    <div style={{
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <ScreenHeader
        icon="📖"
        title="Continue l'histoire"
        subtitle="Ajoute ta phrase à l'histoire collective !"
        onBack={() => setGameScreen(null)}
      />

      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '0 var(--spacing-md) var(--spacing-md) var(--spacing-md)'
      }}>
        <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px' }}>
          <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '15px', marginBottom: '15px', minHeight: '150px', maxHeight: '200px', overflowY: 'auto' }}>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>{storyText}</p>
          </div>
          <textarea value={storyInput} onChange={(e) => setStoryInput(e.target.value)} placeholder="Ajoute une phrase..." style={{ width: '100%', padding: '12px', background: '#0a0a0a', color: 'white', border: '1px solid #333', borderRadius: '8px', marginBottom: '12px', fontSize: '14px', resize: 'none', height: '80px' }} />
          <button onClick={() => { if (storyInput.trim()) { setStoryText(storyText + ' ' + storyInput); setStoryInput(''); } }} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}
