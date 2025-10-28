import React, { useState, useEffect } from 'react';
import { enrichedProfiles } from '../../data/appData';
import ChatScreen from './ChatScreen';

export default function LettersScreen({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showGifts, setShowGifts] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [currentUser]);

  const loadConversations = () => {
    // Charger les matchs depuis localStorage
    const matches = JSON.parse(localStorage.getItem('jeutaime_matches') || '{}');
    const userMatches = matches[currentUser?.email] || [];

    // Charger les conversations
    const convos = JSON.parse(localStorage.getItem('jeutaime_conversations') || '{}');

    // Créer une liste de conversations avec infos
    const conversationsList = userMatches.map(match => {
      // Trouver le profil correspondant
      const matchedProfile = enrichedProfiles.find(p => p.id === match.userId) || {
        id: match.userId,
        name: match.userName,
        bio: 'Profil inconnu'
      };

      // Trouver la conversation
      const convKey = getConversationKey(currentUser.email, match.userId);
      const convo = convos[convKey] || { messages: [], letterCount: { user: 0, matched: 0 } };

      const lastMessage = convo.messages[convo.messages.length - 1];

      return {
        matchedUser: matchedProfile,
        lastMessage: lastMessage ? lastMessage.text : 'Commencez la conversation...',
        lastTimestamp: lastMessage ? lastMessage.timestamp : match.date,
        letterCount: convo.letterCount,
        unread: lastMessage && lastMessage.sender === 'matched' && !lastMessage.read
      };
    });

    // Trier par date de dernier message
    conversationsList.sort((a, b) =>
      new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
    );

    setConversations(conversationsList);
  };

  const getConversationKey = (userId, matchedId) => {
    return [userId, matchedId].sort().join('_');
  };

  const getTimeDiff = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}j`;
  };

  const handleOpenConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackFromChat = () => {
    setSelectedConversation(null);
    loadConversations(); // Recharger pour mettre à jour
  };

  if (selectedConversation) {
    return (
      <ChatScreen
        currentUser={currentUser}
        matchedUser={selectedConversation.matchedUser}
        onBack={handleBackFromChat}
      />
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '25px', fontWeight: '600' }}>💌 Mes Lettres</h1>

      {conversations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#1a1a1a',
          borderRadius: '20px'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>💌</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
            Aucune conversation
          </h3>
          <p style={{ fontSize: '14px', color: '#999', lineHeight: '1.6' }}>
            Envoie des sourires et réussis des matchs<br />
            pour commencer des conversations !
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: '25px' }}>
          {conversations.map((convo, index) => {
            const isPhotoRevealed = (convo.letterCount.user >= 10 && convo.letterCount.matched >= 10) || currentUser.premium;
            const totalLetters = convo.letterCount.user + convo.letterCount.matched;
            const progress = Math.min((totalLetters / 20) * 100, 100);

            return (
              <div
                key={index}
                onClick={() => handleOpenConversation(convo)}
                style={{
                  background: convo.unread
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))'
                    : '#1a1a1a',
                  borderRadius: '15px',
                  padding: '15px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  border: convo.unread ? '2px solid #667eea' : 'none',
                  transition: 'transform 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Barre de progression */}
                {!isPhotoRevealed && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '3px',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    transition: 'width 0.3s'
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {/* Avatar */}
                  <div style={{
                    position: 'relative',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      filter: isPhotoRevealed ? 'none' : `blur(${Math.max(0, 10 - (progress / 10))}px)`
                    }}>
                      👤
                    </div>
                    {!isPhotoRevealed && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        background: '#FFD700',
                        borderRadius: '50%',
                        padding: '4px',
                        fontSize: '12px'
                      }}>
                        🔒
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        margin: 0,
                        fontWeight: '600',
                        color: convo.unread ? '#667eea' : 'white'
                      }}>
                        {convo.matchedUser.name || convo.matchedUser.pseudo}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#666', flexShrink: 0 }}>
                        {getTimeDiff(convo.lastTimestamp)}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '13px',
                      color: '#aaa',
                      margin: '0 0 5px 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {convo.lastMessage}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#666' }}>
                        💌 {convo.letterCount.user + convo.letterCount.matched} lettres
                      </span>
                      {!isPhotoRevealed && (
                        <span style={{ fontSize: '11px', color: '#FFD700', fontWeight: '600' }}>
                          {20 - totalLetters} pour dévoiler
                        </span>
                      )}
                      {isPhotoRevealed && (
                        <span style={{ fontSize: '11px', color: '#4CAF50', fontWeight: '600' }}>
                          ✨ Photo révélée
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section Offrandes */}
      <button
        onClick={() => setShowGifts(!showGifts)}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
          padding: '15px',
          borderRadius: '15px',
          marginTop: '25px',
          marginBottom: '20px',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: '600' }}>
          ✨ Envoyer de la Magie {showGifts ? '▼' : '▶'}
        </h3>
        <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
          Envoie des cadeaux magiques à tes correspondants !
        </p>
      </button>

      {showGifts && (
        <>
          <h3 style={{ fontSize: '14px', marginBottom: '15px', fontWeight: '600', color: '#aaa' }}>
            🎁 Offrandes disponibles
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌹</div>
              <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '600' }}>Rose</h3>
              <p style={{ fontSize: '12px', color: '#E91E63', margin: '0 0 8px 0', fontWeight: 'bold' }}>30 🪙</p>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🧪</div>
              <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '600' }}>Philtre</h3>
              <p style={{ fontSize: '12px', color: '#9C27B0', margin: '0 0 8px 0', fontWeight: 'bold' }}>50 🪙</p>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>💐</div>
              <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '600' }}>Bouquet</h3>
              <p style={{ fontSize: '12px', color: '#FF9800', margin: '0 0 8px 0', fontWeight: 'bold' }}>75 🪙</p>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍷</div>
              <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '600' }}>Verre de vin</h3>
              <p style={{ fontSize: '12px', color: '#2196F3', margin: '0 0 8px 0', fontWeight: 'bold' }}>100 🪙</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', gridColumn: '1 / -1', border: '3px solid #FFD700' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>💎</div>
              <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', fontWeight: '700', color: '#000' }}>Diamant Éternel</h3>
              <p style={{ fontSize: '14px', color: '#000', margin: '0 0 8px 0', fontWeight: 'bold' }}>500 🪙</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
