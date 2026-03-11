import React, { useState, useEffect, useRef } from 'react';
import OffrandesPanel from '../../../components/offrandes/OffrandesPanel';
import { startAutoCleanup } from '../../../engine/effectEngine.js';
import UserAvatar from '../../avatar/UserAvatar';
import {
  loadBarState,
  saveBarState,
  addStoryParagraph,
  saveBarMessage,
  loadBarMessages,
  updateBarTurn,
  completeStory
} from '../../utils/barsSystem';
import { applyTheme } from '../../engine/ThemeEngine';
import { getSalonBackground, getBackgroundStyle } from '../../data/salonBackgrounds';
import SalonBackgroundPicker from '../salon/SalonBackgroundPicker';

export default function BarDetailScreen({ salon, currentUser, setSelectedSalon }) {
  const [barTab, setBarTab] = useState('discuss');
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);
  const [giftReceiverEffect, setGiftReceiverEffect] = useState(null);
  const [showOffrandesPanel, setShowOffrandesPanel] = useState(false);
  const [offrandesPanelTab, setOffrandesPanelTab] = useState('offrandes');
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [currentBgId, setCurrentBgId] = useState(null);

  const salonId = salon?.id || salon?.type || 'default';
  const themeStyles = applyTheme(salonId, {
    ...(salon?.gradient || salon?.bgGradient ? { bgGradient: salon.gradient || salon.bgGradient } : {})
  });

  const [messages, setMessages] = useState(() => {
    const sid = salon?.type || salon?.id || 'unknown';
    return loadBarMessages(sid);
  });
  const [messageInput, setMessageInput] = useState('');

  const [story, setStory] = useState(() => {
    const sid = salon?.type || salon?.id || 'unknown';
    const barState = loadBarState(sid);
    return barState?.story || [];
  });

  const [members, setMembers] = useState(() => {
    const salonMembers = salon?.participants?.map((p, index) => ({
      id: index + 1,
      name: p.name,
      gender: p.gender,
      age: p.age,
      online: p.online,
      isPatron: false,
      skippedTurns: 0
    })) || [];
    return [
      ...salonMembers,
      {
        id: salonMembers.length + 1,
        name: currentUser?.name || 'Vous',
        gender: currentUser?.gender || 'M',
        isPatron: true,
        skippedTurns: 0
      }
    ];
  });

  const [currentTurnIndex, setCurrentTurnIndex] = useState(() => {
    const sid = salon?.type || salon?.id || 'unknown';
    const barState = loadBarState(sid);
    return barState?.currentTurnIndex || 0;
  });
  const [newSentence, setNewSentence] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60);
  const [voteRestart, setVoteRestart] = useState({ voted: false, count: 0 });

  const currentPlayer = members[currentTurnIndex];
  const isMyTurn = currentPlayer?.name === (currentUser?.name || 'Vous');
  const isPatron = members.find(m => m.name === (currentUser?.name || 'Vous'))?.isPatron;

  useEffect(() => {
    setCurrentBgId(getSalonBackground(salonId));
  }, [salonId]);

  useEffect(() => { startAutoCleanup(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      if (containerRef.current) {
        containerRef.current.style.top = `${vv.offsetTop}px`;
        containerRef.current.style.height = `${vv.height}px`;
      }
      const isOpen = vv.height < window.innerHeight * 0.75;
      setKeyboardOpen(isOpen);
      if (isOpen) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'instant' }), 100);
    };
    vv.addEventListener('resize', update);
    return () => vv.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) { handleSkipTurn(); return 24 * 60 * 60; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTurnIndex]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    const sid = salon?.type || salon?.id || 'unknown';
    const newMessage = saveBarMessage(
      sid,
      currentUser?.email || 'guest',
      currentUser?.name || 'Vous',
      messageInput.trim()
    );
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleSkipTurn = () => {
    const updatedMembers = [...members];
    updatedMembers[currentTurnIndex].skippedTurns += 1;
    if (updatedMembers[currentTurnIndex].skippedTurns >= 2) {
      alert(`❌ ${updatedMembers[currentTurnIndex].name} a été expulsé(e) du salon (2 tours sautés)`);
      updatedMembers.splice(currentTurnIndex, 1);
      setMembers(updatedMembers);
    }
    setCurrentTurnIndex((currentTurnIndex + 1) % updatedMembers.length);
  };

  const handleSubmitSentence = () => {
    if (newSentence.trim().length < 10) { alert('⚠️ Votre phrase doit faire au moins 10 caractères !'); return; }
    const sid = salon?.type || salon?.id || 'unknown';
    const newStoryEntry = addStoryParagraph(sid, currentUser?.email || 'guest', currentUser?.name || 'Vous', newSentence.trim());
    const updatedStory = [...story, newStoryEntry];
    setStory(updatedStory);
    setNewSentence('');
    setTimeRemaining(24 * 60 * 60);
    let rewardMsg = '✅ Phrase ajoutée ! +5 points +10 💰';
    if (updatedStory.length === 15) {
      completeStory(sid, updatedStory);
      rewardMsg += '\n\n🎉 Histoire complétée ! Bonus : +50 points +100 💰';
    }
    if (currentUser?.email) alert(rewardMsg);
    const nextTurnIndex = (currentTurnIndex + 1) % members.length;
    setCurrentTurnIndex(nextTurnIndex);
    updateBarTurn(sid, nextTurnIndex, members);
  };

  const handleSaveToJournal = () => {
    if (story.length === 0) { alert('⚠️ L\'histoire est vide !'); return; }
    const sid = salon?.type || salon?.id || 'unknown';
    completeStory(sid, story);
    alert(`📔 Histoire sauvegardée !\n✨ Tous les participants ont reçu leurs récompenses !\n+50 points +100 💰\n\n${story.length} phrase(s).`);
    setStory([]);
  };

  const handleExpelMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    const reason = prompt(`Raison de l'expulsion de ${member.name} :`);
    if (reason && reason.trim().length > 10) {
      setMembers(members.filter(m => m.id !== memberId));
      alert(`✅ ${member.name} a été expulsé(e).\nRaison: ${reason}`);
    } else if (reason) {
      alert('⚠️ La raison doit faire au moins 10 caractères.');
    }
  };

  const handleVoteRestart = () => {
    setVoteRestart({ voted: true, count: voteRestart.count + 1 });
    if (voteRestart.count + 1 >= members.length) {
      setStory([]);
      setVoteRestart({ voted: false, count: 0 });
      setCurrentTurnIndex(Math.floor(Math.random() * members.length));
      alert('🔄 L\'histoire a été redémarrée !');
    }
  };

  const handleSendGiftToMember = (member) => {
    setSelectedMember(member);
    setOffrandesPanelTab('offrandes');
    setShowOffrandesPanel(true);
  };

  const recentSalonEvents = useRef(new Map());
  const handleSalonMessage = (text) => {
    const now = Date.now();
    // Déduplique : ignore le même texte envoyé dans la même seconde
    if (recentSalonEvents.current.get(text) > now - 1000) return;
    recentSalonEvents.current.set(text, now);
    const sid = salon?.type || salon?.id || 'unknown';
    const msg = saveBarMessage(sid, 'system', 'Système', text, true, { type: 'offrande' });
    setMessages(prev => {
      // Double protection : évite les doublons dans le state
      if (prev.some(m => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const formatChatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const gradient = salon?.gradient || salon?.bgGradient || 'linear-gradient(160deg, #667eea, #764ba2)';

  const bottomTabs = [
    { id: 'discuss', icon: '💬', label: 'Discussion' },
    { id: 'story',   icon: '📖', label: 'Histoire' },
    { id: 'magic',   icon: '✨', label: 'Magie' },
    { id: 'members', icon: '👥', label: 'Membres' },
  ];

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f7f3ef',
      overflow: 'hidden'
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background: gradient,
        paddingTop: 'env(safe-area-inset-top)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px'
        }}>
          <button
            onClick={() => setSelectedSalon(null)}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.2)',
              color: 'white', fontSize: '18px', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0
            }}
          >←</button>
          <div style={{ flex: 1, color: 'white', fontWeight: '700', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {salon?.emoji} {salon?.name}
          </div>
          {barTab === 'story' && (
            <div style={{
              background: 'rgba(255,255,255,0.2)', borderRadius: '16px',
              padding: '4px 10px', color: 'white', fontSize: '0.75rem', flexShrink: 0
            }}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
        </div>

        {/* Membres en bande horizontale - cachée quand clavier ouvert */}
        {!keyboardOpen && <div style={{
          display: 'flex',
          justifyContent: members.length <= 6 ? 'space-around' : 'flex-start',
          overflowX: members.length > 6 ? 'auto' : 'visible',
          padding: '4px 8px 10px',
          scrollbarWidth: 'none'
        }}>
          {members.map((member) => (
            <div key={member.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {giftReceiverEffect === member.id && (
                  <div style={{
                    position: 'absolute', inset: '-6px', borderRadius: '50%',
                    border: '2px solid #FFD700',
                    boxShadow: '0 0 12px rgba(255,215,0,0.8)',
                    animation: 'pulse 1s ease-in-out infinite',
                    zIndex: 0
                  }} />
                )}
                <style>{`
                  @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
                  ::-webkit-scrollbar { display: none }
                `}</style>
                <UserAvatar
                  user={member}
                  size={44}
                  style={{
                    border: barTab === 'story' && member.id === members[currentTurnIndex]?.id
                      ? '2px solid #FFD700'
                      : member.isPatron ? '2px solid rgba(255,215,0,0.7)' : '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '50%',
                    position: 'relative', zIndex: 1
                  }}
                />
                {member.online !== false && (
                  <div style={{
                    position: 'absolute', bottom: '1px', right: '1px',
                    width: '10px', height: '10px', background: '#4CAF50',
                    borderRadius: '50%', border: '2px solid white', zIndex: 2
                  }} />
                )}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.6rem', fontWeight: '600' }}>
                {member.name.length > 7 ? member.name.substring(0, 7) + '…' : member.name}
                {member.isPatron ? ' 👑' : ''}
              </div>
            </div>
          ))}
        </div>}
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TAB : DISCUSSION */}
        {barTab === 'discuss' && (
          <>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', ...getBackgroundStyle(currentBgId) }}>
              <div style={{ flex: 1 }} />
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map((msg) => {
                const isOwn = msg.username === (currentUser?.name || 'Vous');
                const isSystem = msg.isSystem || msg.username === 'Système';
                if (isSystem) {
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
                      <div style={{
                        background: 'rgba(194,24,91,0.08)',
                        border: '1px solid rgba(194,24,91,0.18)',
                        color: '#9C1B4B', padding: '5px 14px', borderRadius: '20px',
                        maxWidth: '88%', textAlign: 'center', fontSize: '0.78rem', fontWeight: '600',
                        lineHeight: 1.4,
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                    <div style={{ fontSize: '0.65rem', color: '#999', marginBottom: '2px', padding: '0 6px' }}>
                      {msg.username} • {formatChatTime(msg.timestamp)}
                    </div>
                    <div style={{
                      background: isOwn ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white',
                      color: isOwn ? 'white' : '#333',
                      padding: '9px 14px',
                      borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      maxWidth: '78%', wordWrap: 'break-word', fontSize: '0.88rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)', lineHeight: '1.4'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Pouvoirs patron */}
            {isPatron && !keyboardOpen && (
              <div style={{
                background: 'rgba(255,193,7,0.15)',
                borderTop: '1px solid rgba(255,193,7,0.3)',
                padding: '5px 10px', display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#856404', flexShrink: 0 }}>👑</span>
                <button
                  onClick={() => { const id = prompt('ID du membre à expulser (1-4):'); if (id) handleExpelMember(parseInt(id)); }}
                  style={{ padding: '3px 8px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', flexShrink: 0 }}
                >Expulser</button>
                <button
                  onClick={() => alert('🔒 Fermeture du salon en développement')}
                  style={{ padding: '3px 8px', background: '#333', border: 'none', color: '#FFD700', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', flexShrink: 0 }}
                >🔒 Fermer</button>
                <button
                  onClick={() => setShowBgPicker(true)}
                  style={{ padding: '3px 8px', background: '#667eea', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', flexShrink: 0, marginLeft: 'auto' }}
                >🖼️ Fond</button>
              </div>
            )}

            {/* Input chat */}
            <div style={{
              display: 'flex', gap: '8px', padding: '10px 12px',
              background: 'white', borderTop: '1px solid #eee', flexShrink: 0
            }}>
              <input
                type="text"
                placeholder="Écris un message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}

                style={{
                  flex: 1, padding: '10px 14px',
                  border: '1.5px solid #ddd', borderRadius: '22px',
                  fontSize: '16px', outline: 'none', background: '#f5f5f5'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none', color: 'white', fontSize: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0
                }}
              >➤</button>
            </div>
          </>
        )}

        {/* TAB : HISTOIRE */}
        {barTab === 'story' && (
          <>
            {/* Indicateur de tour */}
            <div style={{
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              padding: '10px 16px', color: 'white', textAlign: 'center',
              fontSize: '0.88rem', fontWeight: '600', flexShrink: 0
            }}>
              Tour de {currentPlayer?.name}
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {story.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '40px 20px' }}>
                  L'histoire n'a pas encore commencé...
                </p>
              ) : (
                story.map((sentence) => (
                  <div key={sentence.id} style={{
                    background: 'white', padding: '10px 12px', borderRadius: '10px',
                    borderLeft: '3px solid #FFD700', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px', fontWeight: '600' }}>{sentence.user}</div>
                    <div style={{ fontSize: '0.9rem', color: '#333', lineHeight: '1.5' }}>{sentence.text}</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '10px 12px', background: 'white', borderTop: '1px solid #eee', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {story.length > 0 && (
                <button onClick={handleSaveToJournal} style={{
                  width: '100%', padding: '9px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none', color: 'white', borderRadius: '10px',
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
                }}>
                  📔 Sauvegarder dans mon journal
                </button>
              )}

              {isMyTurn && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <textarea
                    value={newSentence}
                    onChange={(e) => setNewSentence(e.target.value)}
                    placeholder="✍️ À toi ! Ajoute ta phrase... (min. 10 caractères)"
                    style={{
                      flex: 1, padding: '10px', borderRadius: '10px',
                      border: '2px solid #FFD700', fontSize: '0.88rem',
                      fontFamily: 'inherit', resize: 'none', height: '70px',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{newSentence.length}/500</span>
                    <button
                      onClick={handleSubmitSentence}
                      disabled={newSentence.trim().length < 10}
                      style={{
                        padding: '10px 16px',
                        background: newSentence.trim().length < 10 ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                        border: 'none', color: 'white', borderRadius: '10px',
                        cursor: newSentence.trim().length < 10 ? 'not-allowed' : 'pointer',
                        fontWeight: '600', fontSize: '0.85rem'
                      }}
                    >
                      Envoyer ✨
                    </button>
                  </div>
                </div>
              )}

              {members.length <= 2 && story.length > 0 && (
                <div style={{
                  background: '#fff3cd', borderRadius: '10px', padding: '10px',
                  border: '1.5px solid #ffc107', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#856404', fontWeight: '600' }}>
                    🔄 Redémarrer ? ({voteRestart.count}/{members.length})
                  </span>
                  <button
                    onClick={handleVoteRestart}
                    disabled={voteRestart.voted}
                    style={{
                      padding: '6px 12px', background: voteRestart.voted ? '#ccc' : '#ffc107',
                      border: 'none', color: voteRestart.voted ? '#666' : '#000',
                      borderRadius: '8px', cursor: voteRestart.voted ? 'not-allowed' : 'pointer',
                      fontWeight: '600', fontSize: '0.8rem'
                    }}
                  >
                    {voteRestart.voted ? '✓ Voté' : 'Voter'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB : MEMBRES */}
        {barTab === 'members' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {members.map((member) => (
              <div key={member.id} style={{
                background: 'white', borderRadius: '14px', padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: member.isPatron ? '2px solid #FFD700' : '2px solid transparent'
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <UserAvatar user={member} size={72} style={{ border: '2px solid #eee', borderRadius: '50%' }} />
                  {member.online !== false && (
                    <div style={{
                      position: 'absolute', bottom: '1px', right: '1px',
                      width: '12px', height: '12px', background: '#4CAF50',
                      borderRadius: '50%', border: '2px solid white'
                    }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#333' }}>
                    {member.name} {member.isPatron ? '👑' : ''}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>
                    {member.online !== false ? '🟢 En ligne' : '⚫ Hors ligne'}
                    {member.age ? ` • ${member.age} ans` : ''}
                  </div>
                </div>
                {!member.isPatron && (
                  <button
                    onClick={() => handleSendGiftToMember(member)}
                    style={{
                      padding: '8px 14px', background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      border: 'none', borderRadius: '10px', color: '#000',
                      fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(255,215,0,0.4)', flexShrink: 0
                    }}
                  >
                    🎁 Cadeau
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── BARRE D'ONGLETS EN BAS ── (cachée si clavier ouvert) */}
      {!keyboardOpen && <div style={{
        display: 'flex',
        background: 'white',
        borderTop: '1px solid #eee',
        paddingBottom: 'env(safe-area-inset-bottom)',
        flexShrink: 0,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)'
      }}>
        {bottomTabs.map((tab) => {
          const isActive = barTab === tab.id;
          const accentColor = '#C2185B';
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'magic') {
                  setOffrandesPanelTab('pouvoirs');
                  setSelectedMember(null);
                  setShowOffrandesPanel(true);
                } else {
                  setBarTab(tab.id);
                }
              }}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '8px 4px 10px',
                background: 'none', border: 'none', cursor: 'pointer',
                position: 'relative'
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute', top: 0, left: '20%', right: '20%',
                  height: '2px', background: accentColor, borderRadius: '0 0 2px 2px'
                }} />
              )}
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{tab.icon}</span>
              <span style={{
                fontSize: '0.58rem', marginTop: '3px', fontWeight: isActive ? '700' : '500',
                color: isActive ? accentColor : '#888'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>}

      {/* ── MODALES ── */}
      {showOffrandesPanel && (
        <OffrandesPanel
          onClose={() => { setShowOffrandesPanel(false); setSelectedMember(null); }}
          currentUser={currentUser}
          salonMembers={selectedMember ? [selectedMember] : members.filter(m => !m.isPatron)}
          salonTag={salon?.tag || salon?.type || 'global'}
          initialTab={offrandesPanelTab}
          onSalonMessage={handleSalonMessage}
        />
      )}

      {showBgPicker && (
        <SalonBackgroundPicker
          salonId={salonId}
          currentBgId={currentBgId}
          onSelect={setCurrentBgId}
          onClose={() => setShowBgPicker(false)}
        />
      )}
    </div>
  );
}
