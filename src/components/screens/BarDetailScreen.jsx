import React, { useState, useEffect, useRef } from 'react';
import { bars } from '../../data/appData';
import { magicSpells, getSpellMessage, canUseSpell } from '../../config/magicSystem';
import MagicEffect, { MiniMagicEffect } from '../bars/MagicEffect';
import ClashGame from '../bars/games/ClashGame';
import SpeedQuiz from '../bars/games/SpeedQuiz';
import WouldYouRather from '../bars/games/WouldYouRather';

export default function BarDetailScreen({ selectedBar, setSelectedBar, barTab, setBarTab, currentUser, setUserCoins }) {
  const bar = bars.find(b => b.id === selectedBar);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSpells, setShowSpells] = useState(false);
  const [activeEffect, setActiveEffect] = useState(null);
  const [recentSpell, setRecentSpell] = useState(null);
  const [activeGame, setActiveGame] = useState(null); // 'clash' | 'quiz' | 'wyr' | null
  const chatRef = useRef(null);

  // Charger les messages du bar depuis localStorage
  useEffect(() => {
    if (bar) {
      const savedMessages = localStorage.getItem(`bar_${bar.id}_messages`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Messages initiaux
        const initialMessages = [
          { id: 1, sender: 'Sophie', text: 'Coucou les gens! 😊', time: Date.now() - 600000 },
          { id: 2, sender: 'Alexandre', text: 'Salut! Ça va?', time: Date.now() - 300000 },
          { id: 3, sender: 'Emma', text: 'Super ambiance ce soir!', time: Date.now() - 120000 }
        ];
        setMessages(initialMessages);
      }
    }
  }, [bar]);

  // Sauvegarder les messages
  useEffect(() => {
    if (bar && messages.length > 0) {
      localStorage.setItem(`bar_${bar.id}_messages`, JSON.stringify(messages));
    }
  }, [messages, bar]);

  // Scroll auto en bas
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (!bar) return null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: currentUser?.pseudo || 'Moi',
      text: newMessage,
      time: Date.now(),
      isMe: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleSendSpell = (spellId) => {
    const spell = magicSpells[spellId];
    const userCoins = currentUser?.coins || 0;
    const isPremium = currentUser?.isPremium || false;

    const check = canUseSpell(spell, userCoins, isPremium);
    if (!check.canUse) {
      alert(check.reason);
      return;
    }

    // Déduire le coût
    if (setUserCoins && spell.cost > 0) {
      setUserCoins(userCoins - spell.cost);
    }

    // Afficher l'effet
    setActiveEffect(spell);
    setRecentSpell(spell);

    // Ajouter message magique
    const spellMessage = {
      id: Date.now(),
      sender: currentUser?.pseudo || 'Moi',
      text: getSpellMessage(spellId, currentUser?.pseudo || 'Moi'),
      time: Date.now(),
      isMe: true,
      spell: spell
    };

    setTimeout(() => {
      setMessages([...messages, spellMessage]);
      setActiveEffect(null);
    }, 1000);

    setShowSpells(false);
  };

  return (
    <div>
      <button onClick={() => setSelectedBar(null)} style={{ padding: '10px 20px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>← Retour</button>

      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
          <div style={{ fontSize: '40px' }}>{bar.icon}</div>
          <div>
            <h2 style={{ fontSize: '24px', margin: '0 0 4px 0', fontWeight: '600' }}>{bar.name}</h2>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{bar.desc}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {bar.participants.map((p, idx) => (
            <div key={idx} style={{ background: '#0a0a0a', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{p.gender === 'F' ? '👩' : '👨'}</div>
              <p style={{ fontSize: '11px', fontWeight: '600', margin: '0 0 2px 0' }}>{p.name}</p>
              <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>{p.age}ans</p>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.online ? '#4CAF50' : '#666', margin: '4px auto 0' }}></div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => setBarTab('discuss')} style={{ padding: '10px', background: barTab === 'discuss' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#0a0a0a', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💬 Discuter</button>
          <button onClick={() => setBarTab('challenges')} style={{ padding: '10px', background: barTab === 'challenges' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#0a0a0a', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>⚡ Défis</button>
          <button onClick={() => setBarTab('games')} style={{ padding: '10px', background: barTab === 'games' ? 'linear-gradient(135deg, #E91E63, #C2185B)' : '#0a0a0a', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>🎮 Jeux</button>
        </div>

        {barTab === 'discuss' && (
          <div>
            {/* Chat messages */}
            <div
              ref={chatRef}
              style={{
                background: '#0a0a0a',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '15px',
                minHeight: '200px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: '12px',
                    position: 'relative',
                    background: msg.spell ? `${msg.spell.color}22` : 'transparent',
                    padding: msg.spell ? '8px' : '0',
                    borderRadius: msg.spell ? '8px' : '0',
                    border: msg.spell ? `1px solid ${msg.spell.color}` : 'none'
                  }}
                >
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: msg.isMe ? '#E91E63' : '#2196F3',
                    marginBottom: '2px'
                  }}>
                    {msg.sender}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: msg.spell ? 'white' : '#ccc',
                    fontWeight: msg.spell ? '600' : 'normal'
                  }}>
                    {msg.spell && <span style={{ marginRight: '6px' }}>{msg.spell.icon}</span>}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input avec boutons de sorts */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '8px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setShowSpells(!showSpells)}
                  style={{
                    padding: '8px 12px',
                    background: showSpells ? 'linear-gradient(135deg, #9C27B0, #7B1FA2)' : '#1a1a1a',
                    border: '1px solid #9C27B0',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  ✨ Sorts magiques
                </button>
                <div style={{ fontSize: '11px', color: '#666', padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                  {currentUser?.coins || 0} 🪙
                </div>
              </div>

              {/* Menu des sorts */}
              {showSpells && (
                <div style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {Object.values(magicSpells).map((spell) => (
                    <button
                      key={spell.id}
                      onClick={() => handleSendSpell(spell.id)}
                      style={{
                        padding: '10px 6px',
                        background: '#0a0a0a',
                        border: `1px solid ${spell.color}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.background = spell.color + '22';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = '#0a0a0a';
                      }}
                    >
                      <div style={{ fontSize: '24px' }}>{spell.icon}</div>
                      <div style={{ fontSize: '9px', color: '#888', fontWeight: '600' }}>
                        {spell.cost > 0 ? `${spell.cost} 🪙` : 'Gratuit'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input message */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Écris un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px'
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  padding: '10px 20px',
                  background: '#E91E63',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Envoyer
              </button>
            </div>
          </div>
        )}

        {barTab === 'challenges' && (
          <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '600' }}>Défis disponibles</h3>
            <p style={{ fontSize: '13px', color: '#888' }}>Fonctionnalité à venir...</p>
          </div>
        )}

        {barTab === 'games' && (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '15px',
              color: '#ccc'
            }}>
              Mini-jeux brise-glace 🎮
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '12px'
            }}>
              {/* Clash Game */}
              <button
                onClick={() => setActiveGame('clash')}
                style={{
                  background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '48px' }}>🔥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                    Clash Game
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    Débats rapides avec votes du groupe
                  </div>
                </div>
              </button>

              {/* Speed Quiz */}
              <button
                onClick={() => setActiveGame('quiz')}
                style={{
                  background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '48px' }}>⚡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                    Speed Quiz
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    Questions rapides avec chrono
                  </div>
                </div>
              </button>

              {/* Would You Rather */}
              <button
                onClick={() => setActiveGame('wyr')}
                style={{
                  background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '48px' }}>🎲</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                    Tu préfères...
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    Choix impossibles et décalés
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Effet magique fullscreen */}
      {activeEffect && (
        <MagicEffect spell={activeEffect} onComplete={() => setActiveEffect(null)} />
      )}

      {/* Mini-jeux */}
      {activeGame === 'clash' && (
        <ClashGame onClose={() => setActiveGame(null)} currentUser={currentUser} />
      )}
      {activeGame === 'quiz' && (
        <SpeedQuiz onClose={() => setActiveGame(null)} currentUser={currentUser} />
      )}
      {activeGame === 'wyr' && (
        <WouldYouRather onClose={() => setActiveGame(null)} currentUser={currentUser} />
      )}
    </div>
  );
}
