import React, { useState, useEffect, useRef } from 'react';
import { awardPoints } from '../../utils/pointsSystem';
import { updateUserStats, addPointsToUser, triggerBotAutoReply, getUserById } from '../../utils/demoUsers';
import GiftSelector from '../gifts/GiftSelector';
import UserAvatar from '../avatar/UserAvatar';

export default function ChatScreen({ currentUser, matchedUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [letterCount, setLetterCount] = useState({ user: 0, matched: 0 });
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [userCoins, setUserCoins] = useState(currentUser?.coins || 0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversation();
  }, [currentUser, matchedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Écouter les réponses automatiques des bots
  useEffect(() => {
    const handleBotReply = (event) => {
      if (event.detail.botEmail === matchedUser.email) {
        loadConversation(); // Recharger la conversation pour afficher la réponse du bot
      }
    };

    window.addEventListener('bot-reply-received', handleBotReply);
    return () => window.removeEventListener('bot-reply-received', handleBotReply);
  }, [matchedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = () => {
    const conversations = JSON.parse(localStorage.getItem('jeutaime_conversations') || '{}');
    const convKey = getConversationKey(currentUser.email, matchedUser.id);
    const conversation = conversations[convKey] || { messages: [], letterCount: { user: 0, matched: 0 } };

    setMessages(conversation.messages || []);
    setLetterCount(conversation.letterCount || { user: 0, matched: 0 });
  };

  const getConversationKey = (userId, matchedId) => {
    // Créer une clé unique pour la conversation (ordre alphabétique pour cohérence)
    return [userId, matchedId].sort().join('_');
  };

  const saveConversation = (updatedMessages, updatedLetterCount) => {
    const conversations = JSON.parse(localStorage.getItem('jeutaime_conversations') || '{}');
    const convKey = getConversationKey(currentUser.email, matchedUser.id);

    conversations[convKey] = {
      messages: updatedMessages,
      letterCount: updatedLetterCount,
      lastUpdate: new Date().toISOString(),
      participants: {
        user: currentUser.email,
        matched: matchedUser.id
      }
    };

    localStorage.setItem('jeutaime_conversations', JSON.stringify(conversations));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Vérifier si c'est le tour de l'utilisateur (alternance)
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      alert('Attends que l\'autre personne réponde avant d\'envoyer une nouvelle lettre !');
      return;
    }

    const message = {
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedMessages = [...messages, message];
    const updatedLetterCount = {
      ...letterCount,
      user: letterCount.user + 1
    };

    setMessages(updatedMessages);
    setLetterCount(updatedLetterCount);
    setNewMessage('');

    saveConversation(updatedMessages, updatedLetterCount);

    // Award points for sending letter
    awardPoints(currentUser.email, 'LETTER_SENT');

    // Si c'est un bot, déclencher sa réponse automatique
    triggerBotAutoReply(matchedUser.id, currentUser.email, newMessage);

    // Vérifier badge romantic (20 lettres envoyées)
    if (updatedLetterCount.user >= 20) {
      checkAndAwardBadge(currentUser.email, 'romantic');
    }

    // Simulate response from matched user (for demo)
    setTimeout(() => {
      simulateMatchedUserResponse(updatedMessages, updatedLetterCount);
    }, 2000);
  };

  const simulateMatchedUserResponse = (currentMessages, currentLetterCount) => {
    const responses = [
      "Merci pour ton message ! 😊",
      "C'est très intéressant ce que tu dis !",
      "J'adore discuter avec toi 💕",
      "Parle-moi de toi, qu'est-ce que tu aimes faire ?",
      "Tu as l'air vraiment sympathique !",
      "On se comprend bien 🌟"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const responseMessage = {
      id: Date.now(),
      sender: 'matched',
      text: randomResponse,
      timestamp: new Date().toISOString(),
      read: true
    };

    const updatedMessages = [...currentMessages, responseMessage];
    const updatedLetterCount = {
      ...currentLetterCount,
      matched: currentLetterCount.matched + 1
    };

    setMessages(updatedMessages);
    setLetterCount(updatedLetterCount);

    saveConversation(updatedMessages, updatedLetterCount);

    // Award points for receiving letter
    awardPoints(currentUser.email, 'LETTER_RECEIVED');

    // Mettre à jour les stats du bot (si c'est un bot)
    if (matchedUser?.isBot && matchedUser?.email) {
      const currentBotStats = matchedUser.stats || { letters: 0, games: 0, bars: 0 };
      updateUserStats(matchedUser.email, {
        letters: currentBotStats.letters + 1
      });
      // Ajouter des points au bot aussi
      addPointsToUser(matchedUser.email, 5); // 5 points pour envoyer une lettre
    }
  };

  const isPhotoRevealed = () => {
    // Photo révélée si 10 lettres chacun OU si premium
    return (letterCount.user >= 10 && letterCount.matched >= 10) || currentUser.premium;
  };

  const getPhotoOpacity = () => {
    if (currentUser.premium) return 1;
    if (letterCount.user >= 10 && letterCount.matched >= 10) return 1;

    // Progressif : commence flou à 0.1, devient clair à 1
    const totalLetters = letterCount.user + letterCount.matched;
    const progress = Math.min(totalLetters / 20, 1);
    return 0.1 + (progress * 0.9);
  };

  const photoOpacity = getPhotoOpacity();
  const totalLetters = letterCount.user + letterCount.matched;
  const lettersRemaining = Math.max(0, 20 - totalLetters);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '0 0 20px 20px',
        marginBottom: '15px',
        boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
        position: 'relative'
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '40px',
            height: '40px',
            background: 'var(--color-cream)',
            border: '2px solid var(--color-brown-light)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '20px',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10
          }}
        >
          ←
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Avatar/Photo avec floutage progressif */}
          <div style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: `blur(${Math.max(0, 10 - (photoOpacity * 10))}px)`,
              opacity: photoOpacity
            }}>
              <UserAvatar user={matchedUser} size={60} emoji="😊" />
            </div>
            {!isPhotoRevealed() && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: `blur(${Math.max(0, 15 - (photoOpacity * 15))}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🔒
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 5px 0', color: 'white' }}>
              {matchedUser.name || matchedUser.pseudo}
            </h2>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
              💌 {letterCount.user} lettres envoyées · {letterCount.matched} reçues
            </div>
            {!isPhotoRevealed() && (
              <div style={{ fontSize: '12px', color: '#FFD700', marginTop: '5px', fontWeight: '600' }}>
                🔓 {lettersRemaining} lettres avant révélation
              </div>
            )}
            {isPhotoRevealed() && (
              <div style={{ fontSize: '12px', color: '#4CAF50', marginTop: '5px', fontWeight: '600' }}>
                ✨ Photo révélée !
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 20px',
        marginBottom: '15px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>💌</div>
            <p style={{ fontSize: '16px', color: '#999' }}>
              Début de votre correspondance
            </p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Envoyez la première lettre pour démarrer l'échange !
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            // Message système (cadeau)
            if (msg.sender === 'system') {
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '15px'
                  }}
                >
                  <div style={{
                    background: 'rgba(255, 152, 0, 0.2)',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 152, 0, 0.5)',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      margin: 0,
                      color: '#FFD700',
                      fontWeight: '600'
                    }}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            }

            // Message normal
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '15px'
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                    : '#1a1a1a',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  <p style={{
                    fontSize: '15px',
                    margin: '0 0 5px 0',
                    color: 'white',
                    lineHeight: '1.4'
                  }}>
                    {msg.text}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#666',
                    margin: 0,
                    textAlign: 'right'
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '15px 20px 20px 20px',
        background: '#0a0a0a',
        borderTop: '1px solid #333'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <button
            onClick={() => setShowGiftSelector(true)}
            style={{
              padding: '12px 15px',
              background: 'linear-gradient(135deg, #FF9800, #F57C00)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              height: '50px'
            }}
            title="Envoyer un cadeau"
          >
            🎁
          </button>

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écris ta lettre..."
            rows={3}
            style={{
              flex: 1,
              padding: '12px',
              background: '#1a1a1a',
              border: '2px solid #333',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              resize: 'none',
              fontFamily: '-apple-system, sans-serif'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            style={{
              padding: '12px 20px',
              background: newMessage.trim()
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : '#333',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '24px',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              height: '50px'
            }}
          >
            💌
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            {messages.length > 0 && messages[messages.length - 1]?.sender === 'user'
              ? '⏳ En attente de la réponse...'
              : '✍️ C\'est à ton tour d\'écrire'}
          </p>
          <p style={{ fontSize: '12px', color: '#FFD700', margin: 0, fontWeight: '600' }}>
            🪙 {userCoins}
          </p>
        </div>
      </div>

      {/* Gift Selector Modal */}
      {showGiftSelector && (
        <GiftSelector
          currentUser={{ ...currentUser, coins: userCoins }}
          receiverId={matchedUser.id}
          onClose={() => setShowGiftSelector(false)}
          onGiftSent={(gift, coinsRemaining) => {
            setUserCoins(coinsRemaining);
            // Optionally add a system message in the chat
            const giftMessage = {
              id: Date.now(),
              sender: 'system',
              text: `🎁 Tu as envoyé ${gift.giftEmoji} ${gift.giftName} !`,
              timestamp: new Date().toISOString(),
              type: 'gift'
            };
            const updatedMessages = [...messages, giftMessage];
            setMessages(updatedMessages);
            saveConversation(updatedMessages, letterCount);
          }}
        />
      )}
    </div>
  );
}
