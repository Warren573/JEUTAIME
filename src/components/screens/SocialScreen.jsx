import React from 'react';
import { bars } from '../../data/appData';

export default function SocialScreen({ socialTab, setSocialTab, setGameScreen, setSelectedBar }) {
  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '25px', fontWeight: '600' }}>👥 Social</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '25px' }}>
        {['bars', 'games', 'adoption', 'contest'].map((tab) => (
          <button key={tab} onClick={() => setSocialTab(tab)} style={{ padding: '12px 20px', background: socialTab === tab ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#1a1a1a', border: 'none', color: 'white', borderRadius: '15px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', whiteSpace: 'nowrap' }}>
            {tab === 'bars' && '🍸 Bars'}
            {tab === 'games' && '🎮 Jeux'}
            {tab === 'adoption' && '💝 Adoption'}
            {tab === 'contest' && '🏆 Concours'}
          </button>
        ))}
      </div>

      {socialTab === 'bars' && (
        <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '25px' }}>
          {bars.map((bar) => (
            <div key={bar.id} onClick={() => setSelectedBar(bar.id)} style={{ background: '#0a0a0a', borderRadius: '15px', padding: '15px', marginBottom: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '40px' }}>{bar.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontWeight: '600' }}>{bar.name}</h3>
                  <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{bar.desc}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    {bar.participants.map((p, idx) => (
                      <div key={idx} style={{ width: '24px', height: '24px', borderRadius: '50%', background: p.online ? '#4CAF50' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                        {p.gender === 'F' ? '👩' : '👨'}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '20px' }}>→</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {socialTab === 'games' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div onClick={() => setGameScreen('reactivity')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚡</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Tape la Taupe</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Solo</p>
          </div>
          <div onClick={() => setGameScreen('pong')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎮</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Pong</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>2 joueurs</p>
          </div>
          <div onClick={() => setGameScreen('brickbreaker')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🧱</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Casse Brique</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Solo</p>
          </div>
          <div onClick={() => setGameScreen('morpion')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>⭕</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Morpion</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>2 joueurs</p>
          </div>
          <div onClick={() => setGameScreen('storytime')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📖</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Continue l'histoire</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Solo, 2 joueurs ou multijoueurs</p>
          </div>
          <div onClick={() => setGameScreen('cards')} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎴</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Jeu des Cartes</h4>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Solo - Gagne des pièces!</p>
          </div>
          <div onClick={() => setGameScreen('herolove')} style={{ background: 'linear-gradient(135deg, #E91E63, #C2185B)', borderRadius: '15px', padding: '15px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1', border: '3px solid #FFD700', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '5px', right: '5px', background: '#FFD700', color: '#000', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold' }}>NEW!</div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎮</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>HeroLove Quest</h4>
            <p style={{ fontSize: '11px', color: '#fff', margin: 0 }}>Aventure RPG romantique - Gagne des pièces!</p>
          </div>
        </div>
      )}

      {socialTab === 'adoption' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🐱</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Minou</h4>
            <button style={{ width: '100%', padding: '6px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Adopter</button>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🐶</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Chouchou</h4>
            <button style={{ width: '100%', padding: '6px', background: '#2196F3', border: 'none', color: 'white', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Adopter</button>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🦜</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Perroquets</h4>
            <button style={{ width: '100%', padding: '6px', background: '#9C27B0', border: 'none', color: 'white', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Adopter</button>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🦆</div>
            <h4 style={{ fontSize: '13px', margin: '0 0 4px 0', fontWeight: '600' }}>Cancan</h4>
            <button style={{ width: '100%', padding: '6px', background: '#FF9800', border: 'none', color: 'white', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Adopter</button>
          </div>
        </div>
      )}

      {socialTab === 'contest' && (
        <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '25px' }}>
          <div style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', borderRadius: '12px', padding: '15px', marginBottom: '20px', textAlign: 'center', color: '#000', fontWeight: 'bold' }}>
            📅 Semaine du 14-20 Octobre
          </div>

          <div style={{ background: '#0a0a0a', borderRadius: '15px', padding: '15px', marginBottom: '15px', border: '2px solid #E91E63', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👸</div>
            <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', fontWeight: '600' }}>⭐ La Plus Captivante</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: '0 0 12px 0' }}>Sophie Lauren • 1,247 votes 🔥</p>
            <button style={{ width: '100%', padding: '10px', background: '#E91E63', border: 'none', color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
              💬 Découvrir
            </button>
          </div>

          <div style={{ background: '#0a0a0a', borderRadius: '15px', padding: '15px', border: '2px solid #2196F3', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🤴</div>
            <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', fontWeight: '600' }}>⭐ Le Plus Séduisant</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: '0 0 12px 0' }}>Thomas Architects • 987 votes 🔥</p>
            <button style={{ width: '100%', padding: '10px', background: '#2196F3', border: 'none', color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
              💬 Découvrir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
