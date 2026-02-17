/**
 * TEST: Vérifie que différents userIds produisent des avatars différents
 */

// Simulation du seeded RNG
function createSeededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }

  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

function selectRandom(array, random) {
  if (!array || array.length === 0) return null;
  const index = Math.floor(random() * array.length);
  return array[index];
}

// Simuler les catégories du manifest
const manifest = {
  face: ['face_01', 'face_02', 'face_03'],
  eyes: ['eyes_01', 'eyes_02', 'eyes_03', 'eyes_04', 'eyes_05', 'eyes_06_glasses'],
  mouth: ['nose_01', 'nose_02', 'nose_03', 'mouth_01_smile', 'mouth_02', 'mouth_03', 'mouth_04', 'mouth_05', 'mouth_06']
};

function generateAvatarIdentity(userId) {
  const seed = `avatar_${userId}`;
  const random = createSeededRandom(seed);

  const faceAsset = selectRandom(manifest.face, random);
  const eyesAsset = selectRandom(manifest.eyes, random);
  const mouthAsset = selectRandom(manifest.mouth, random);

  return {
    seed,
    face: faceAsset,
    eyes: eyesAsset,
    mouth: mouthAsset
  };
}

// Test avec différents IDs
console.log('\n🧪 TEST: Génération d\'avatars pour différents userIds\n');
console.log('='.repeat(60));

const testIds = [1000, 1001, 1002, 1003, 1004, 1005, 1010, 1015, 1019];

testIds.forEach(id => {
  const avatar = generateAvatarIdentity(id);
  console.log(`\nID ${id}:`);
  console.log(`  Face: ${avatar.face}`);
  console.log(`  Eyes: ${avatar.eyes}`);
  console.log(`  Mouth: ${avatar.mouth}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n✅ Si tous les avatars ont les MÊMES assets, il y a un bug !');
console.log('❌ Si les avatars sont DIFFÉRENTS, le problème est ailleurs.\n');
