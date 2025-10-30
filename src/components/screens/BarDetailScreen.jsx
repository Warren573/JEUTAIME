import React, { useState, useEffect, useRef } from 'react';
import { bars } from '../../data/appData';

export default function BarDetailScreen({ selectedBar, setSelectedBar, barTab, setBarTab, currentUser }) {
  const bar = bars.find(b => b.id === selectedBar);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  if (!bar) return null;

  // Charger les messages du bar depuis localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`jeutaime_bar_chat_${bar.id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Messages par défaut
      const defaultMessages = [
        {
          id: 1,
          username: 'Sophie',
          text: 'Coucou les gens! 😊',
          timestamp: new Date().toISOString(),
          isSystem: false
        },
        {
          id: 2,
          username: 'Alexandre',
          text: 'Salut! Ça va?',
          timestamp: new Date().toISOString(),
          isSystem: false
        },
        {
          id: 3,
          username: 'Emma',
          text: 'Super ambiance ce soir!',
          timestamp: new Date().toISOString(),
          isSystem: false
        }
      ];
      setMessages(defaultMessages);
      localStorage.setItem(`jeutaime_bar_chat_${bar.id}`, JSON.stringify(defaultMessages));
    }
  }, [bar.id]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envoyer un message
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      username: currentUser?.name || 'Invité',
      text: messageInput,
      timestamp: new Date().toISOString(),
      isSystem: false
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`jeutaime_bar_chat_${bar.id}`, JSON.stringify(updatedMessages));
    setMessageInput('');
  };

  // Formater l'heure
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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
            <div style={{
              background: '#0a0a0a',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '15px',
              minHeight: '300px',
              maxHeight: '400px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {messages.map((msg) => {
                const isOwnMessage = msg.username === (currentUser?.name || 'Invité');
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                      marginBottom: '5px'
                    }}
                  >
                    <div style={{
                      fontSize: '10px',
                      color: '#666',
                      marginBottom: '3px',
                      paddingLeft: '5px',
                      paddingRight: '5px'
                    }}>
                      {msg.username} • {formatTime(msg.timestamp)}
                    </div>
                    <div style={{
                      background: isOwnMessage
                        ? 'linear-gradient(135deg, #E91E63, #C2185B)'
                        : '#2a2a2a',
                      padding: '10px 15px',
                      borderRadius: isOwnMessage ? '15px 15px 5px 15px' : '15px 15px 15px 5px',
                      maxWidth: '70%',
                      wordWrap: 'break-word'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        color: 'white',
                        lineHeight: '1.4'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Écris un message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'transform 0.2s'
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                📤 Envoyer
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
          <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
            <button style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>📖 Continue l'histoire</button>
            <p style={{ fontSize: '12px', color: '#888', margin: '12px 0 0 0' }}>Autres jeux à venir...</p>
          </div>
        )}
      </div>
    </div>
  );
}
