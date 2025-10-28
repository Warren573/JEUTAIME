import React from 'react';
import Avatar from 'avataaars';

// Composant pour afficher un avatar à partir d'une config
export default function UserAvatar({ avatarConfig, size = 200, style = {} }) {
  if (!avatarConfig) {
    // Avatar par défaut si pas de config
    avatarConfig = {
      avatarStyle: "Circle",
      topType: "ShortHairShortFlat",
      accessoriesType: "Blank",
      hairColor: "Brown",
      facialHairType: "Blank",
      clotheType: "Hoodie",
      eyeType: "Default",
      eyebrowType: "Default",
      mouthType: "Smile",
      skinColor: "Light",
    };
  }

  return (
    <div style={{ width: size, height: size, ...style }}>
      <Avatar
        style={{ width: '100%', height: '100%' }}
        {...avatarConfig}
      />
    </div>
  );
}

// Fonction pour générer une config d'avatar aléatoire basée sur le genre et l'ID
export function generateAvatarConfig(id, gender = 'M') {
  // Utiliser l'ID pour générer des combinaisons cohérentes
  const seed = id * 137; // Nombre premier pour meilleure distribution

  const hairTypes = gender === 'F' ? [
    'LongHairStraight',
    'LongHairCurly',
    'LongHairBob',
    'LongHairNotTooLong',
    'LongHairBun',
    'LongHairCurvy'
  ] : [
    'ShortHairShortFlat',
    'ShortHairShortWaved',
    'ShortHairShortRound',
    'ShortHairSides',
    'ShortHairTheCaesar'
  ];

  const hairColors = ['BrownDark', 'Brown', 'Blonde', 'BlondeGolden', 'Black', 'Red', 'Auburn'];
  const clotheTypes = ['BlazerShirt', 'Hoodie', 'CollarSweater', 'GraphicShirt', 'ShirtVNeck'];
  const eyeTypes = ['Default', 'Happy', 'Side', 'Squint', 'Wink'];
  const mouthTypes = ['Smile', 'Twinkle', 'Default'];
  const skinColors = ['Light', 'Pale', 'Tanned', 'Brown', 'DarkBrown'];
  const accessories = ['Blank', 'Prescription01', 'Round', 'Sunglasses', 'Wayfarers'];
  const facialHairTypes = gender === 'M' ? ['Blank', 'BeardLight', 'BeardMedium', 'MoustacheFancy'] : ['Blank'];

  return {
    avatarStyle: "Circle",
    topType: hairTypes[seed % hairTypes.length],
    accessoriesType: accessories[(seed * 2) % accessories.length],
    hairColor: hairColors[(seed * 3) % hairColors.length],
    facialHairType: facialHairTypes[(seed * 4) % facialHairTypes.length],
    clotheType: clotheTypes[(seed * 5) % clotheTypes.length],
    eyeType: eyeTypes[(seed * 6) % eyeTypes.length],
    eyebrowType: "Default",
    mouthType: mouthTypes[(seed * 7) % mouthTypes.length],
    skinColor: skinColors[(seed * 8) % skinColors.length],
  };
}

// Générer des configs pour les profils existants
export const profileAvatars = {
  0: generateAvatarConfig(0, 'M'), // Admin
  1: generateAvatarConfig(1, 'F'), // Sophie
  2: generateAvatarConfig(2, 'F'), // Emma
  3: generateAvatarConfig(3, 'F'), // Chloé
};
