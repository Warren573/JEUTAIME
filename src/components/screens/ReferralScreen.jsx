import React, { useState } from 'react';
import ScreenHeader from '../common/ScreenHeader';

export default function ReferralScreen({ currentUser }) {
  const [referralCode] = useState('JEUTAIME2024');
  const [referredFriends] = useState(3);
  const [coinsEarned] = useState(1500);
  const [monthlyLimit] = useState(50);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      alert(`✅ Code copié !\n\n📋 Code ${referralCode} copié dans votre presse-papiers.\n\nPartagez-le avec vos amis !`);
    }).catch(() => {
      alert(`📋 Votre code : ${referralCode}\n\nCopiez-le manuellement pour le partager !`);
    });
  };

  const shareReferralLink = () => {
    const link = `https://jeutaime.app/invite/${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Rejoins-moi sur JeuTaime !',
        text: `Découvre JeuTaime, l'app de rencontres anti-superficielle 💕 Utilise mon code ${referralCode} pour 200 pièces offertes !`,
        url: link
      }).catch(() => {
        fallbackShare(link);
      });
    } else {
      fallbackShare(link);
    }
  };

  const fallbackShare = (link) => {
    alert(`📤 Partagez ce lien :\n\n${link}\n\n💰 Vos amis recevront 200 pièces avec votre code !`);
  };

  const progressPercentage = (referredFriends / monthlyLimit) * 100;

  return (
    <div style={{
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ScreenHeader
        icon="🤝"
        title="Parrainage"
        subtitle="Invitez vos amis et gagnez des récompenses"
      />

      {/* Carte d'explication */}
      <div style={{ padding: '0 var(--spacing-sm)' }}>
        <div style={{
          background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: 'none',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            color: 'white',
            margin: '0 0 var(--spacing-md) 0',
            fontSize: '1.4rem',
            fontWeight: '700'
          }}>
            💰 Gagnez des pièces ensemble !
          </h3>
          <p style={{
            color: 'rgba(255,255,255,0.95)',
            margin: '15px 0',
            lineHeight: '1.5',
            fontSize: '0.95rem'
          }}>
            Invitez vos amis et recevez <strong>500 pièces</strong> quand ils certifient leur photo et envoient leur 1ère lettre !
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.95)',
            margin: 0,
            lineHeight: '1.5',
            fontSize: '0.95rem'
          }}>
            Vos amis reçoivent <strong>200 pièces</strong> à la certification + <strong>300 pièces</strong> après leur 1ère activité.
          </p>
        </div>

        {/* Code de parrainage */}
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '2px solid var(--color-brown)',
          boxShadow: 'var(--shadow-md)',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--spacing-md) 0',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            🎟️ Votre code de parrainage
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '15px 0',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              value={referralCode}
              readOnly
              style={{
                flex: '1 1 200px',
                minWidth: '200px',
                background: 'var(--color-beige-light)',
                border: '3px solid var(--color-romantic)',
                padding: '15px',
                borderRadius: '12px',
                color: 'var(--color-text-primary)',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={copyReferralCode}
              style={{
                padding: '15px 25px',
                background: 'var(--color-gold)',
                border: '2px solid var(--color-gold-dark)',
                borderRadius: '12px',
                color: 'var(--color-brown-dark)',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              📋 Copier
            </button>
          </div>
          <button
            onClick={shareReferralLink}
            style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, var(--color-romantic), var(--color-romantic-dark))',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            📤 Partager le lien
          </button>
        </div>

        {/* Statistiques */}
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '2px solid var(--color-brown)',
          boxShadow: 'var(--shadow-md)',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--spacing-md) 0',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            📊 Vos statistiques
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            <div style={{
              background: 'var(--color-beige-light)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid var(--color-tan)',
              boxSizing: 'border-box'
            }}>
              <div style={{
                fontSize: '2.5rem',
                color: '#4CAF50',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                {referredFriends}
              </div>
              <div style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem'
              }}>
                Amis invités
              </div>
            </div>
            <div style={{
              background: 'var(--color-beige-light)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid var(--color-tan)',
              boxSizing: 'border-box'
            }}>
              <div style={{
                fontSize: '2.5rem',
                color: 'var(--color-gold)',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                {coinsEarned}
              </div>
              <div style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem'
              }}>
                Pièces gagnées
              </div>
            </div>
          </div>
        </div>

        {/* Limite mensuelle */}
        <div style={{
          background: 'rgba(255, 152, 0, 0.1)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          border: '2px solid #FF9800',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            color: '#FF9800',
            margin: '0 0 var(--spacing-sm) 0',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            ⚠️ Limite mensuelle
          </h3>
          <p style={{
            color: 'var(--color-text-primary)',
            margin: '10px 0',
            fontSize: '0.95rem'
          }}>
            Vous avez parrainé <strong>{referredFriends}/{monthlyLimit}</strong> personnes ce mois-ci.
          </p>
          <div style={{
            background: 'var(--color-beige-light)',
            borderRadius: '12px',
            height: '12px',
            marginTop: '15px',
            overflow: 'hidden',
            border: '1px solid var(--color-tan)'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
              width: `${progressPercentage}%`,
              height: '100%',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
