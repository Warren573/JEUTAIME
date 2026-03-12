import React from 'react';
import { SALON_BACKGROUNDS, setSalonBackground } from '../../data/salonBackgrounds';

export default function SalonBackgroundPicker({ salonId, currentBgId, onSelect, onClose }) {
  const handleSelect = (bg) => {
    setSalonBackground(salonId, bg.id);
    onSelect(bg.id);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div
        style={{
          width: '100%', background: 'white',
          borderRadius: '20px 20px 0 0',
          padding: '20px 16px 32px',
          maxHeight: '70vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700' }}>🖼️ Arrière-plan du salon</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888' }}>✕</button>
        </div>

        {/* Dégradés */}
        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dégradés</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {SALON_BACKGROUNDS.filter(b => b.type === 'color' || b.type === 'gradient').map(bg => (
            <button
              key={bg.id}
              onClick={() => handleSelect(bg)}
              style={{
                height: '64px', borderRadius: '12px',
                border: currentBgId === bg.id ? '3px solid #667eea' : '2px solid transparent',
                background: bg.value,
                cursor: 'pointer',
                position: 'relative',
                outline: 'none',
              }}
              title={bg.label}
            >
              {currentBgId === bg.id && (
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '18px' }}>✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Photos */}
        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Photos</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {SALON_BACKGROUNDS.filter(b => b.type === 'image').map(bg => (
            <button
              key={bg.id}
              onClick={() => handleSelect(bg)}
              style={{
                height: '90px', borderRadius: '12px',
                border: currentBgId === bg.id ? '3px solid #667eea' : '2px solid transparent',
                backgroundImage: `url(${bg.thumb})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                position: 'relative',
                outline: 'none',
              }}
              title={bg.label}
            >
              {currentBgId === bg.id && (
                <span style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(102,126,234,0.5)', borderRadius: '10px', fontSize: '22px', color: 'white'
                }}>✓</span>
              )}
              <span style={{
                position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '10px',
                padding: '1px 6px', borderRadius: '6px', whiteSpace: 'nowrap',
              }}>{bg.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
