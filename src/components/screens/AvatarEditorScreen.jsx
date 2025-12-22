import React, { useState } from 'react';
import Avatar from 'avataaars';

export default function AvatarEditorScreen({ currentUser, setCurrentUser, onClose }) {
  // Options d'avatar
  const [avatarOptions, setAvatarOptions] = useState({
    avatarStyle: 'Circle',
    topType: currentUser?.avatarConfig?.topType || 'ShortHairShortFlat',
    accessoriesType: currentUser?.avatarConfig?.accessoriesType || 'Blank',
    hairColor: currentUser?.avatarConfig?.hairColor || 'BrownDark',
    facialHairType: currentUser?.avatarConfig?.facialHairType || 'Blank',
    clotheType: currentUser?.avatarConfig?.clotheType || 'BlazerShirt',
    clotheColor: currentUser?.avatarConfig?.clotheColor || 'Black',
    eyeType: currentUser?.avatarConfig?.eyeType || 'Default',
    eyebrowType: currentUser?.avatarConfig?.eyebrowType || 'Default',
    mouthType: currentUser?.avatarConfig?.mouthType || 'Smile',
    skinColor: currentUser?.avatarConfig?.skinColor || 'Light'
  });

  // Options disponibles
  const options = {
    topType: [
      { value: 'NoHair', label: 'Chauve' },
      { value: 'Eyepatch', label: 'Cache-œil' },
      { value: 'Hat', label: 'Chapeau' },
      { value: 'Hijab', label: 'Hijab' },
      { value: 'Turban', label: 'Turban' },
      { value: 'WinterHat1', label: 'Bonnet 1' },
      { value: 'WinterHat2', label: 'Bonnet 2' },
      { value: 'WinterHat3', label: 'Bonnet 3' },
      { value: 'WinterHat4', label: 'Bonnet 4' },
      { value: 'LongHairBigHair', label: 'Cheveux longs volumineux' },
      { value: 'LongHairBob', label: 'Cheveux longs carré' },
      { value: 'LongHairBun', label: 'Chignon' },
      { value: 'LongHairCurly', label: 'Cheveux longs bouclés' },
      { value: 'LongHairCurvy', label: 'Cheveux longs ondulés' },
      { value: 'LongHairDreads', label: 'Dreadlocks' },
      { value: 'LongHairFrida', label: 'Style Frida' },
      { value: 'LongHairFro', label: 'Afro long' },
      { value: 'LongHairFroBand', label: 'Afro avec bandeau' },
      { value: 'LongHairNotTooLong', label: 'Cheveux mi-longs' },
      { value: 'LongHairShavedSides', label: 'Côtés rasés' },
      { value: 'LongHairMiaWallace', label: 'Style Mia Wallace' },
      { value: 'LongHairStraight', label: 'Cheveux longs raides' },
      { value: 'LongHairStraight2', label: 'Cheveux longs raides 2' },
      { value: 'LongHairStraightStrand', label: 'Mèche longue' },
      { value: 'ShortHairDreads01', label: 'Dreadlocks courts' },
      { value: 'ShortHairDreads02', label: 'Dreadlocks courts 2' },
      { value: 'ShortHairFrizzle', label: 'Cheveux courts frisés' },
      { value: 'ShortHairShaggyMullet', label: 'Mulet' },
      { value: 'ShortHairShortCurly', label: 'Cheveux courts bouclés' },
      { value: 'ShortHairShortFlat', label: 'Cheveux courts plats' },
      { value: 'ShortHairShortRound', label: 'Cheveux courts ronds' },
      { value: 'ShortHairShortWaved', label: 'Cheveux courts ondulés' },
      { value: 'ShortHairSides', label: 'Côtés courts' },
      { value: 'ShortHairTheCaesar', label: 'Le César' },
      { value: 'ShortHairTheCaesarSidePart', label: 'César avec raie' }
    ],
    hairColor: [
      { value: 'Auburn', label: 'Auburn' },
      { value: 'Black', label: 'Noir' },
      { value: 'Blonde', label: 'Blond' },
      { value: 'BlondeGolden', label: 'Blond doré' },
      { value: 'Brown', label: 'Brun' },
      { value: 'BrownDark', label: 'Brun foncé' },
      { value: 'PastelPink', label: 'Rose pastel' },
      { value: 'Platinum', label: 'Platine' },
      { value: 'Red', label: 'Roux' },
      { value: 'SilverGray', label: 'Gris argenté' }
    ],
    facialHairType: [
      { value: 'Blank', label: 'Aucune' },
      { value: 'BeardMedium', label: 'Barbe moyenne' },
      { value: 'BeardLight', label: 'Barbe légère' },
      { value: 'BeardMagestic', label: 'Barbe majestueuse' },
      { value: 'MoustacheFancy', label: 'Moustache élégante' },
      { value: 'MoustacheMagnum', label: 'Moustache Magnum' }
    ],
    clotheType: [
      { value: 'BlazerShirt', label: 'Blazer' },
      { value: 'BlazerSweater', label: 'Blazer pull' },
      { value: 'CollarSweater', label: 'Pull col' },
      { value: 'GraphicShirt', label: 'T-shirt graphique' },
      { value: 'Hoodie', label: 'Sweat à capuche' },
      { value: 'Overall', label: 'Salopette' },
      { value: 'ShirtCrewNeck', label: 'T-shirt col rond' },
      { value: 'ShirtScoopNeck', label: 'T-shirt col V' },
      { value: 'ShirtVNeck', label: 'T-shirt col V profond' }
    ],
    clotheColor: [
      { value: 'Black', label: 'Noir' },
      { value: 'Blue01', label: 'Bleu 1' },
      { value: 'Blue02', label: 'Bleu 2' },
      { value: 'Blue03', label: 'Bleu 3' },
      { value: 'Gray01', label: 'Gris 1' },
      { value: 'Gray02', label: 'Gris 2' },
      { value: 'Heather', label: 'Chiné' },
      { value: 'PastelBlue', label: 'Bleu pastel' },
      { value: 'PastelGreen', label: 'Vert pastel' },
      { value: 'PastelOrange', label: 'Orange pastel' },
      { value: 'PastelRed', label: 'Rouge pastel' },
      { value: 'PastelYellow', label: 'Jaune pastel' },
      { value: 'Pink', label: 'Rose' },
      { value: 'Red', label: 'Rouge' },
      { value: 'White', label: 'Blanc' }
    ],
    eyeType: [
      { value: 'Close', label: 'Fermés' },
      { value: 'Cry', label: 'Pleure' },
      { value: 'Default', label: 'Défaut' },
      { value: 'Dizzy', label: 'Étourdi' },
      { value: 'EyeRoll', label: 'Levés au ciel' },
      { value: 'Happy', label: 'Heureux' },
      { value: 'Hearts', label: 'Cœurs' },
      { value: 'Side', label: 'Sur le côté' },
      { value: 'Squint', label: 'Plissés' },
      { value: 'Surprised', label: 'Surpris' },
      { value: 'Wink', label: 'Clin d\'œil' },
      { value: 'WinkWacky', label: 'Clin d\'œil fou' }
    ],
    eyebrowType: [
      { value: 'Angry', label: 'Fâché' },
      { value: 'AngryNatural', label: 'Fâché naturel' },
      { value: 'Default', label: 'Défaut' },
      { value: 'DefaultNatural', label: 'Défaut naturel' },
      { value: 'FlatNatural', label: 'Plat naturel' },
      { value: 'RaisedExcited', label: 'Excité' },
      { value: 'RaisedExcitedNatural', label: 'Excité naturel' },
      { value: 'SadConcerned', label: 'Triste' },
      { value: 'SadConcernedNatural', label: 'Triste naturel' },
      { value: 'UnibrowNatural', label: 'Monosourcil' },
      { value: 'UpDown', label: 'Haut-bas' },
      { value: 'UpDownNatural', label: 'Haut-bas naturel' }
    ],
    mouthType: [
      { value: 'Concerned', label: 'Inquiet' },
      { value: 'Default', label: 'Défaut' },
      { value: 'Disbelief', label: 'Incrédule' },
      { value: 'Eating', label: 'Mange' },
      { value: 'Grimace', label: 'Grimace' },
      { value: 'Sad', label: 'Triste' },
      { value: 'ScreamOpen', label: 'Cri ouvert' },
      { value: 'Serious', label: 'Sérieux' },
      { value: 'Smile', label: 'Sourire' },
      { value: 'Tongue', label: 'Langue' },
      { value: 'Twinkle', label: 'Malicieux' },
      { value: 'Vomit', label: 'Vomit' }
    ],
    skinColor: [
      { value: 'Tanned', label: 'Bronzé' },
      { value: 'Yellow', label: 'Jaune' },
      { value: 'Pale', label: 'Pâle' },
      { value: 'Light', label: 'Clair' },
      { value: 'Brown', label: 'Brun' },
      { value: 'DarkBrown', label: 'Brun foncé' },
      { value: 'Black', label: 'Noir' }
    ],
    accessoriesType: [
      { value: 'Blank', label: 'Aucun' },
      { value: 'Kurt', label: 'Lunettes Kurt' },
      { value: 'Prescription01', label: 'Lunettes 1' },
      { value: 'Prescription02', label: 'Lunettes 2' },
      { value: 'Round', label: 'Rondes' },
      { value: 'Sunglasses', label: 'Lunettes de soleil' },
      { value: 'Wayfarers', label: 'Wayfarers' }
    ]
  };

  const handleChange = (category, value) => {
    setAvatarOptions(prev => ({ ...prev, [category]: value }));
  };

  const handleSave = () => {
    // Sauvegarder dans localStorage
    const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
      users[userIndex].avatarConfig = avatarOptions;
      localStorage.setItem('jeutaime_users', JSON.stringify(users));
      setCurrentUser({ ...currentUser, avatarConfig: avatarOptions });
      alert('✅ Avatar sauvegardé !');
      onClose();
    }
  };

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
      {/* Header */}
      <div style={{
        background: 'var(--color-cream)',
        borderBottom: '4px double var(--color-brown-dark)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          textAlign: 'center',
          margin: '0 0 var(--spacing-xs) 0',
          color: 'var(--color-brown-dark)',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          🎨 Éditeur d'Avatar
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          margin: 0
        }}>
          Personnalise ton avatar
        </p>
      </div>

      <div style={{ padding: '0 var(--spacing-md)' }}>
        {/* Aperçu de l'avatar */}
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          textAlign: 'center',
          border: '3px solid var(--color-gold)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            margin: '0 0 var(--spacing-md) 0',
            color: 'var(--color-text-primary)'
          }}>
            Aperçu
          </h2>
          <div style={{
            width: '200px',
            height: '200px',
            margin: '0 auto',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid var(--color-gold)',
            background: 'white'
          }}>
            <Avatar
              style={{ width: '200px', height: '200px' }}
              {...avatarOptions}
            />
          </div>
        </div>

        {/* Sélecteurs */}
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '2px solid var(--color-brown)',
          boxShadow: 'var(--shadow-md)'
        }}>
          {Object.entries(options).map(([category, categoryOptions]) => (
            <div key={category} style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{
                display: 'block',
                fontWeight: '700',
                fontSize: '1rem',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--color-brown-dark)',
                textTransform: 'capitalize'
              }}>
                {category === 'topType' && '💇 Coiffure'}
                {category === 'hairColor' && '🎨 Couleur cheveux'}
                {category === 'facialHairType' && '🧔 Barbe'}
                {category === 'clotheType' && '👔 Vêtements'}
                {category === 'clotheColor' && '🎨 Couleur vêtements'}
                {category === 'eyeType' && '👁️ Yeux'}
                {category === 'eyebrowType' && '✨ Sourcils'}
                {category === 'mouthType' && '👄 Bouche'}
                {category === 'skinColor' && '🧑 Teint'}
                {category === 'accessoriesType' && '👓 Accessoires'}
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 'var(--spacing-xs)'
              }}>
                {categoryOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleChange(category, option.value)}
                    style={{
                      padding: '10px',
                      background: avatarOptions[category] === option.value
                        ? 'var(--color-gold)'
                        : 'white',
                      border: avatarOptions[category] === option.value
                        ? '2px solid var(--color-brown-dark)'
                        : '2px solid var(--color-brown-light)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: avatarOptions[category] === option.value ? '700' : '500',
                      color: 'var(--color-text-primary)',
                      transition: 'all 0.2s',
                      minHeight: '48px'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton Sauvegarder */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
            border: '3px solid var(--color-brown-dark)',
            borderRadius: '12px',
            color: 'var(--color-brown-dark)',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            marginBottom: 'var(--spacing-lg)',
            minHeight: '56px'
          }}
        >
          💾 Sauvegarder mon avatar
        </button>
      </div>
    </div>
  );
}
