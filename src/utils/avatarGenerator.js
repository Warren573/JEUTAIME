/**
 * Génère des options d'avatar cohérentes basées sur un nom
 * Le même nom générera toujours le même avatar
 */

// Fonction de hash simple pour convertir un string en nombre
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Fonction pour sélectionner aléatoirement dans un tableau basé sur un seed
function seededChoice(arr, seed) {
  return arr[seed % arr.length];
}

// Options disponibles pour avataaars
const skinColors = ['Light', 'Pale', 'Tanned', 'Brown', 'DarkBrown', 'Black'];
const hairColors = ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'];
const topTypes = [
  'ShortHairShortFlat',
  'ShortHairShortRound',
  'ShortHairShortWaved',
  'ShortHairDreads01',
  'ShortHairFrizzle',
  'ShortHairShaggyMullet',
  'ShortHairTheCaesar',
  'ShortHairTheCaesarSidePart',
  'LongHairBigHair',
  'LongHairBob',
  'LongHairBun',
  'LongHairCurly',
  'LongHairCurvy',
  'LongHairDreads',
  'LongHairFrida',
  'LongHairFro',
  'LongHairFroBand',
  'LongHairStraight',
  'LongHairStraight2',
  'LongHairStraightStrand'
];
const facialHairTypes = ['Blank', 'Blank', 'Blank', 'BeardMedium', 'BeardLight', 'BeardMagestic', 'MoustacheFancy', 'MoustacheMagnum'];
const clotheTypes = ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'];
const eyeTypes = ['Default', 'Happy', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'];
const eyebrowTypes = ['Default', 'DefaultNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'UnibrowNatural', 'UpDown', 'UpDownNatural'];
const mouthTypes = ['Default', 'Smile', 'Twinkle', 'Serious', 'Tongue', 'Grimace', 'Sad', 'ScreamOpen'];

/**
 * Génère des options d'avatar pour avataaars basées sur le nom et le genre
 * @param {string} name - Nom de la personne
 * @param {string} gender - 'M' ou 'F'
 * @returns {object} - Options pour le composant Avatar
 */
export function generateAvatarOptions(name, gender = 'M') {
  const seed = hashString(name);

  // Sélection cohérente basée sur le seed
  const skinColor = seededChoice(skinColors, seed);
  const hairColor = seededChoice(hairColors, seed + 1);
  const eyeType = seededChoice(eyeTypes, seed + 2);
  const eyebrowType = seededChoice(eyebrowTypes, seed + 3);
  const mouthType = seededChoice(mouthTypes, seed + 4);
  const clotheType = seededChoice(clotheTypes, seed + 5);

  // Cheveux adaptés au genre
  let topType;
  if (gender === 'F') {
    // Préférence cheveux longs pour les femmes
    const femaleHairTypes = topTypes.filter(t => t.includes('Long'));
    topType = seededChoice(femaleHairTypes.length > 0 ? femaleHairTypes : topTypes, seed + 6);
  } else {
    // Préférence cheveux courts pour les hommes
    const maleHairTypes = topTypes.filter(t => t.includes('Short'));
    topType = seededChoice(maleHairTypes.length > 0 ? maleHairTypes : topTypes, seed + 6);
  }

  // Barbe uniquement pour les hommes
  const facialHairType = gender === 'M'
    ? seededChoice(facialHairTypes, seed + 7)
    : 'Blank';

  return {
    avatarStyle: 'Circle',
    topType,
    accessoriesType: 'Blank',
    hairColor,
    facialHairType,
    clotheType,
    clotheColor: seededChoice(['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'], seed + 8),
    eyeType,
    eyebrowType,
    mouthType,
    skinColor
  };
}

/**
 * Génère un emoji par défaut basé sur le genre
 * @param {string} gender - 'M' ou 'F'
 * @returns {string} - Emoji
 */
export function getDefaultEmoji(gender) {
  return gender === 'F' ? '👩' : '👨';
}
