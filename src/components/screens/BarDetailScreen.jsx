import React, { useState, useEffect, useRef } from 'react';
import GiftSelector from '../gifts/GiftSelector';
import MagicEffect from '../effects/MagicEffect';
import MagicGiftsPanel from '../MagicGiftsPanel';
import Avatar from 'avataaars';
import BackButton from '../common/BackButton';
import { generateAvatarOptions } from '../../utils/avatarGenerator';
import {
  loadBarState,
  saveBarState,
  addStoryParagraph,
  saveBarMessage,
  loadBarMessages,
  updateBarTurn,
  completeStory
} from '../../utils/barsSystem';
import { sendMagicToSalon, sendGiftToUser, canAfford, deductCoins } from '../../utils/magic';

export default function BarDetailScreen({ salon, currentUser, setSelectedSalon }) {
  const [barTab, setBarTab] = useState('discuss');
  const messagesEndRef = useRef(null);

  // Système de cadeaux
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [magicEffect, setMagicEffect] = useState(null);
  const [giftReceiverEffect, setGiftReceiverEffect] = useState(null); // ID du membre qui reçoit un cadeau

  // Système Magie & Offrandes
  const [showMagicGiftsPanel, setShowMagicGiftsPanel] = useState(false);

  // Chat discussion - Charger depuis localStorage
  const [messages, setMessages] = useState(() => {
    const salonId = salon?.type || salon?.id || 'unknown';
    return loadBarMessages(salonId);
  });
  const [messageInput, setMessageInput] = useState('');

  // Système "Continuer l'histoire" - Charger depuis localStorage
  const [story, setStory] = useState(() => {
    const salonId = salon?.type || salon?.id || 'unknown';
    const barState = loadBarState(salonId);
    return barState?.story || [];
  });

  // Transformer les participants du salon en membres avec avatars + ajouter l'utilisateur
  const [members, setMembers] = useState(() => {
    const salonMembers = salon?.participants?.map((p, index) => ({
      id: index + 1,
      name: p.name,
      gender: p.gender,
      age: p.age,
      online: p.online,
      avatarOptions: generateAvatarOptions(p.name, p.gender),
      isPatron: false,
      skippedTurns: 0
    })) || [];

    // Ajouter l'utilisateur actuel
    const allMembers = [
      ...salonMembers,
      {
        id: salonMembers.length + 1,
        name: currentUser?.name || 'Vous',
        gender: currentUser?.gender || 'M',
        avatarOptions: currentUser?.avatarData || generateAvatarOptions(currentUser?.name || 'Vous', currentUser?.gender || 'M'),
        isPatron: true,
        skippedTurns: 0
      }
    ];

    return allMembers;
  });

  const [currentTurnIndex, setCurrentTurnIndex] = useState(() => {
    const salonId = salon?.type || salon?.id || 'unknown';
    const barState = loadBarState(salonId);
    return barState?.currentTurnIndex || 0;
  });
  const [newSentence, setNewSentence] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24h en secondes
  const [voteRestart, setVoteRestart] = useState({ voted: false, count: 0 });

  const currentPlayer = members[currentTurnIndex];
  const isMyTurn = currentPlayer?.name === (currentUser?.name || 'Vous');
  const isPatron = members.find(m => m.name === (currentUser?.name || 'Vous'))?.isPatron;

  // Scroll automatique pour le chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envoyer un message dans le chat
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const salonId = salon?.type || salon?.id || 'unknown';
    const newMessage = saveBarMessage(
      barId,
      currentUser?.email || 'guest',
      currentUser?.name || 'Vous',
      messageInput.trim()
    );

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          // Tour sauté - passer au suivant
          handleSkipTurn();
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTurnIndex]);

  const handleSkipTurn = () => {
    const updatedMembers = [...members];
    updatedMembers[currentTurnIndex].skippedTurns += 1;

    // Expulsion automatique après 2 tours sautés
    if (updatedMembers[currentTurnIndex].skippedTurns >= 2) {
      alert(`❌ ${updatedMembers[currentTurnIndex].name} a été expulsé(e) du salon (2 tours sautés)`);
      updatedMembers.splice(currentTurnIndex, 1);
      setMembers(updatedMembers);
    }

    // Passer au joueur suivant
    setCurrentTurnIndex((currentTurnIndex + 1) % updatedMembers.length);
  };

  const handleSubmitSentence = () => {
    if (newSentence.trim().length < 10) {
      alert('⚠️ Votre phrase doit faire au moins 10 caractères !');
      return;
    }

    const salonId = salon?.type || salon?.id || 'unknown';

    // Ajouter la phrase avec récompenses automatiques
    const newStoryEntry = addStoryParagraph(
      barId,
      currentUser?.email || 'guest',
      currentUser?.name || 'Vous',
      newSentence.trim()
    );

    // Mettre à jour l'affichage local
    const updatedStory = [...story, newStoryEntry];
    setStory(updatedStory);
    setNewSentence('');
    setTimeRemaining(24 * 60 * 60); // Reset timer

    // Alert des récompenses
    let rewardMsg = '✅ Phrase ajoutée ! +5 points +10 💰';

    // Vérifier si l'histoire est complétée (15 phrases)
    if (updatedStory.length === 15) {
      completeStory(barId, updatedStory);
      rewardMsg += '\n\n🎉 Histoire complétée ! Bonus : +50 points +100 💰\nL\'histoire a été sauvegardée dans l\'historique.';
    }

    if (currentUser?.email) {
      alert(rewardMsg);
    }

    // Passer au joueur suivant
    const nextTurnIndex = (currentTurnIndex + 1) % members.length;
    setCurrentTurnIndex(nextTurnIndex);
    updateBarTurn(salonId, nextTurnIndex, members);
  };

  const handleSaveToJournal = () => {
    if (story.length === 0) {
      alert('⚠️ L\'histoire est vide !');
      return;
    }

    const salonId = salon?.type || salon?.id || 'unknown';

    // Compléter l'histoire et récompenser les participants
    completeStory(barId, story);

    alert(`📔 Histoire complétée et sauvegardée dans l'historique !\n\n✨ Tous les participants ont reçu leurs récompenses bonus !\n+50 points +100 💰\n\nL'histoire contient ${story.length} phrase(s).`);

    // Réinitialiser l'histoire locale
    setStory([]);
  };

  const handleExpelMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    const reason = prompt(`Raison de l'expulsion de ${member.name} :`);

    if (reason && reason.trim().length > 10) {
      const updatedMembers = members.filter(m => m.id !== memberId);
      setMembers(updatedMembers);
      alert(`✅ ${member.name} a été expulsé(e) du salon.\nRaison: ${reason}`);
    } else if (reason) {
      alert('⚠️ La raison doit faire au moins 10 caractères.');
    }
  };

  const handleVoteRestart = () => {
    setVoteRestart({ voted: true, count: voteRestart.count + 1 });

    // Si unanimité (tous les membres restants votent)
    if (voteRestart.count + 1 >= members.length) {
      setStory([]);
      setVoteRestart({ voted: false, count: 0 });
      setCurrentTurnIndex(Math.floor(Math.random() * members.length));
      alert('🔄 L\'histoire a été redémarrée ! Nouveau tirage au sort...');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatChatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendGiftToMember = (member) => {
    setSelectedMember(member);
    setShowGiftSelector(true);
  };

  const handleGiftSent = (gift, coinsRemaining) => {
    // Afficher l'effet magique plein écran
    setMagicEffect(gift);

    // Afficher l'effet sur l'avatar du destinataire
    setGiftReceiverEffect(selectedMember?.id);

    // Retirer l'effet après 3 secondes
    setTimeout(() => {
      setGiftReceiverEffect(null);
    }, 3000);

    // Ajouter un message système dans le chat et sauvegarder
    const salonId = salon?.type || salon?.id || 'unknown';
    const giftMessage = saveBarMessage(
      barId,
      'system',
      'Système',
      `${currentUser?.name || 'Quelqu\'un'} a envoyé ${gift.giftEmoji} ${gift.giftName} à ${selectedMember?.name} !`,
      true,
      gift
    );

    setMessages([...messages, giftMessage]);

    // Fermer le sélecteur
    setShowGiftSelector(false);
    setSelectedMember(null);
  };

  // Handlers pour le système Magie & Offrandes
  const handleUseMagic = (magic) => {
    const salonId = salon?.type || salon?.id || 'unknown';
    const userId = currentUser?.id || currentUser?.email || 'user';

    // Envoyer la magie (placeholder)
    if (magic.type === 'salon') {
      sendMagicToSalon(magic.id, userId, salonId);
    } else {
      console.log('✨ Magie individuelle utilisée:', magic.name);
    }

    // Ajouter un message système dans le chat
    const magicMessage = saveBarMessage(
      salonId,
      'system',
      'Système',
      `✨ ${currentUser?.name || 'Quelqu\'un'} a utilisé ${magic.icon} ${magic.name} !`,
      true,
      { type: 'magic', magicData: magic }
    );

    setMessages([...messages, magicMessage]);

    // TODO: Déduire les pièces de l'utilisateur (nécessite state management global)
    alert(`✨ ${magic.name} activé ! (-${magic.cost} pièces)`);
  };

  const handleSendGift = (gift, recipient) => {
    const salonId = salon?.type || salon?.id || 'unknown';
    const userId = currentUser?.id || currentUser?.email || 'user';

    // Envoyer le cadeau (placeholder)
    sendGiftToUser(gift.id, userId, recipient.id, salonId);

    // Afficher l'effet sur l'avatar du destinataire
    setGiftReceiverEffect(recipient?.id);

    // Retirer l'effet après 3 secondes
    setTimeout(() => {
      setGiftReceiverEffect(null);
    }, 3000);

    // Ajouter un message système dans le chat
    const giftMessage = saveBarMessage(
      salonId,
      'system',
      'Système',
      `🎁 ${currentUser?.name || 'Quelqu\'un'} a envoyé ${gift.icon} ${gift.name} à ${recipient?.name} !`,
      true,
      { type: 'gift', giftData: gift }
    );

    setMessages([...messages, giftMessage]);

    // TODO: Déduire les pièces de l'utilisateur (nécessite state management global)
    alert(`🎁 ${gift.name} envoyé à ${recipient.name} ! (-${gift.cost} pièces)`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100dvh',
      overflowY: 'auto',
      paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
      background: 'var(--color-beige-light)',
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      <BackButton onClick={() => setSelectedSalon(null)} />

      {/* En-tête du salon */}
      <div style={{
        background: salon?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-md)',
        borderBottom: '4px solid rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>

          {/* Timer discret en haut à droite */}
          {barTab === 'story' && (
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'white', opacity: 0.9 }}>⏱️ {formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        <h1 style={{
          fontSize: '1.8rem',
          color: 'white',
          margin: '0 0 12px 0',
          fontWeight: '700'
        }}>
          {salon?.emoji} {salon?.name}
        </h1>

        {/* Membres du salon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '12px'
        }}>
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                background: barTab === 'story' && member.id === members[currentTurnIndex]?.id
                  ? 'rgba(255, 215, 0, 0.25)'
                  : 'rgba(255,255,255,0.15)',
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center',
                border: barTab === 'story' && member.id === members[currentTurnIndex]?.id ? '2px solid #FFD700' : 'none',
                transition: 'all 0.3s',
                position: 'relative'
              }}
            >
              {/* Avatar avec indicateur en ligne */}
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '6px'
              }}>
                {/* Effet de lueur magique si cadeau reçu */}
                {giftReceiverEffect === member.id && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0) 70%)',
                      animation: 'magicGlow 1.5s ease-in-out infinite',
                      zIndex: 0,
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,215,0,0.8)',
                      animation: 'magicRing 2s ease-out infinite',
                      zIndex: 0,
                      pointerEvents: 'none'
                    }} />
                  </>
                )}
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: giftReceiverEffect === member.id
                    ? '3px solid #FFD700'
                    : '3px solid rgba(255,255,255,0.3)',
                  boxShadow: giftReceiverEffect === member.id
                    ? '0 0 20px rgba(255,215,0,0.8), 0 4px 8px rgba(0,0,0,0.2)'
                    : '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Avatar
                    style={{ width: '100px', height: '100px' }}
                    {...member.avatarOptions}
                  />
                </div>
                {/* Indicateur en ligne */}
                {member.online !== false && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '14px',
                    height: '14px',
                    background: '#4CAF50',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 0 8px rgba(76, 175, 80, 0.6)',
                    zIndex: 2
                  }} />
                )}
              </div>

              {/* Styles pour les animations */}
              <style>{`
                @keyframes magicGlow {
                  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
                  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
                }
                @keyframes magicRing {
                  0% { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
                  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
                }
              `}</style>

              <div style={{ color: 'white', fontWeight: '600', fontSize: '0.75rem' }}>
                {member.name.length > 9 ? member.name.substring(0, 9) + '...' : member.name}
              </div>
              {member.isPatron && <div style={{ fontSize: '0.9rem', marginTop: '2px' }}>👑</div>}
              {barTab === 'story' && member.skippedTurns > 0 && (
                <div style={{ fontSize: '0.8rem', color: '#FFD700', marginTop: '2px' }}>⚠️{member.skippedTurns}</div>
              )}
              {/* Bouton envoyer cadeau - visible pour tous SAUF soi-même */}
              {barTab === 'discuss' && !member.isPatron && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendGiftToMember(member);
                  }}
                  style={{
                    marginTop: '6px',
                    padding: '4px 8px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255,215,0,0.4)',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255,215,0,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(255,215,0,0.4)';
                  }}
                >
                  🎁 Cadeau
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '15px'
        }}>
          <button
            onClick={() => setBarTab('discuss')}
            style={{
              flex: 1,
              padding: '10px',
              background: barTab === 'discuss'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(255,255,255,0.1)',
              border: barTab === 'discuss' ? '2px solid rgba(255,255,255,0.5)' : 'none',
              color: 'white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            💬 Discussion
          </button>
          <button
            onClick={() => setBarTab('story')}
            style={{
              flex: 1,
              padding: '10px',
              background: barTab === 'story'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(255,255,255,0.1)',
              border: barTab === 'story' ? '2px solid rgba(255,255,255,0.5)' : 'none',
              color: 'white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            📖 Continuer l'histoire
          </button>
        </div>

        {/* Bouton Magie & Offrandes */}
        <div style={{ marginTop: '12px' }}>
          <button
            onClick={() => setShowMagicGiftsPanel(true)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              color: '#000',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(255,215,0,0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 6px 16px rgba(255,215,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(255,215,0,0.4)';
            }}
          >
            ✨ Magie & Offrandes
          </button>
        </div>
      </div>

      {/* ONGLET DISCUSSION */}
      <div style={{ padding: 'var(--spacing-sm)' }}>
        {barTab === 'discuss' && (
          <div>
            {/* Zone de chat */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '15px',
              minHeight: '400px',
              maxHeight: '500px',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-sm)',
              border: '2px solid var(--color-brown-light)'
            }}>
              {messages.map((msg) => {
                const isOwnMessage = msg.username === (currentUser?.name || 'Vous');
                const isSystemMessage = msg.isSystem || msg.username === 'Système';

                // Style spécial pour les messages système avec cadeaux
                if (isSystemMessage && msg.giftData) {
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#000',
                        padding: '12px 20px',
                        borderRadius: '20px',
                        maxWidth: '85%',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(255,215,0,0.4)',
                        border: '2px solid rgba(255,255,255,0.5)',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                          {msg.giftData.giftEmoji}
                        </div>
                        {msg.text}
                        <div style={{ fontSize: '0.7rem', marginTop: '4px', opacity: 0.8 }}>
                          {formatChatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#888',
                      marginBottom: '4px',
                      paddingLeft: '8px',
                      paddingRight: '8px'
                    }}>
                      {msg.username} • {formatChatTime(msg.timestamp)}
                    </div>
                    <div style={{
                      background: isOwnMessage
                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                        : '#f0f0f0',
                      color: isOwnMessage ? 'white' : '#333',
                      padding: '10px 15px',
                      borderRadius: isOwnMessage ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      maxWidth: '75%',
                      wordWrap: 'break-word',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de chat */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Écris un message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#fff',
                  border: '2px solid var(--color-brown-light)',
                  borderRadius: '25px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                Envoyer
              </button>
            </div>

            {/* Pouvoirs du Patron (seulement en discussion) */}
            {isPatron && (
              <div style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '12px',
                padding: 'var(--spacing-md)',
                marginTop: 'var(--spacing-lg)',
                border: '2px solid #FFD700'
              }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  color: '#000',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  👑 Pouvoirs du Patron
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const memberId = prompt('ID du membre à expulser (1-4):');
                      if (memberId) handleExpelMember(parseInt(memberId));
                    }}
                    style={{
                      padding: '8px 14px',
                      background: '#E91E63',
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    👤 Expulser un membre
                  </button>
                  <button
                    onClick={() => alert('🔒 Fermeture/Réouverture du salon en développement')}
                    style={{
                      padding: '8px 14px',
                      background: '#000',
                      border: 'none',
                      color: '#FFD700',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    🔒 Fermer le salon
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ONGLET CONTINUER L'HISTOIRE */}
        {barTab === 'story' && (
          <div>
            {/* Indicateur de tour discret */}
            <div style={{
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: 'var(--spacing-md)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}>
              <span>Tour de {currentPlayer?.emoji} {currentPlayer?.name}</span>
            </div>

            {/* L'histoire en cours */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)',
              boxShadow: 'var(--shadow-sm)',
              border: '2px solid var(--color-brown-light)',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {story.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '30px' }}>
                  L'histoire n'a pas encore commencé...
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {story.map((sentence) => (
                    <div
                      key={sentence.id}
                      style={{
                        background: 'var(--color-beige-light)',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        borderLeft: '3px solid var(--color-gold)'
                      }}
                    >
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '4px',
                        fontWeight: '600'
                      }}>
                        {sentence.user}
                      </div>
                      <div style={{
                        fontSize: '0.95rem',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.5'
                      }}>
                        {sentence.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton sauvegarder */}
            {story.length > 0 && (
              <button
                onClick={handleSaveToJournal}
                style={{
                  width: '100%',
                  marginBottom: 'var(--spacing-md)',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                📔 Sauvegarder dans mon journal
              </button>
            )}

            {/* Zone d'écriture (si c'est votre tour) */}
            {isMyTurn && (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '2px solid #FFD700'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-brown-dark)',
                  marginBottom: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  ✍️ À toi de jouer !
                </div>
                <textarea
                  value={newSentence}
                  onChange={(e) => setNewSentence(e.target.value)}
                  placeholder="Ajoute ta phrase à l'histoire... (min. 10 caractères)"
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid var(--color-brown-light)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px'
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {newSentence.length} / 500
                  </span>
                  <button
                    onClick={handleSubmitSentence}
                    disabled={newSentence.trim().length < 10}
                    style={{
                      padding: '10px 20px',
                      background: newSentence.trim().length < 10
                        ? '#ccc'
                        : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '10px',
                      cursor: newSentence.trim().length < 10 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    Envoyer ✨
                  </button>
                </div>
              </div>
            )}

            {/* Vote pour redémarrer (si 1-2 personnes) */}
            {members.length <= 2 && story.length > 0 && (
              <div style={{
                background: '#fff3cd',
                borderRadius: '12px',
                padding: 'var(--spacing-md)',
                border: '2px solid #ffc107'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#856404',
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  🔄 Redémarrer l'histoire ?
                </div>
                <p style={{ fontSize: '0.85rem', color: '#856404', marginBottom: '10px' }}>
                  Vous n'êtes plus que {members.length}. Votez pour recommencer.
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={handleVoteRestart}
                    disabled={voteRestart.voted}
                    style={{
                      padding: '8px 16px',
                      background: voteRestart.voted ? '#ccc' : '#ffc107',
                      border: 'none',
                      color: voteRestart.voted ? '#666' : '#000',
                      borderRadius: '8px',
                      cursor: voteRestart.voted ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    {voteRestart.voted ? '✓ Voté' : 'Voter'}
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#856404', fontWeight: '600' }}>
                    {voteRestart.count}/{members.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gift Selector Modal */}
      {showGiftSelector && selectedMember && (
        <GiftSelector
          currentUser={currentUser}
          receiverId={selectedMember.name}
          onClose={() => {
            setShowGiftSelector(false);
            setSelectedMember(null);
          }}
          onGiftSent={handleGiftSent}
        />
      )}

      {/* Magic Effect Animation */}
      {magicEffect && (
        <MagicEffect
          gift={magicEffect}
          onComplete={() => setMagicEffect(null)}
        />
      )}

      {/* Panneau Magie & Offrandes */}
      {showMagicGiftsPanel && (
        <MagicGiftsPanel
          onClose={() => setShowMagicGiftsPanel(false)}
          currentUser={currentUser}
          salonMembers={members.filter(m => !m.isPatron)} // Exclure l'utilisateur actuel
          onUseMagic={handleUseMagic}
          onSendGift={handleSendGift}
        />
      )}
    </div>
  );
}
