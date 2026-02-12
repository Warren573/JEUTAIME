export const AVATAR_CATEGORIES = ['head', 'eyes', 'nose', 'mouth', 'hair', 'beard', 'accessories'];

export function createInitialAvatarSelection(manifest) {
  const categories = manifest?.categories || {};
  return {
    head: categories.head?.[0] || null,
    eyes: categories.eyes?.[0] || null,
    nose: categories.nose?.[0] || null,
    mouth: categories.mouth?.[0] || null,
    hair: categories.hair?.[0] || null,
    beard: null,
    accessories: null
  };
}

export function randomAvatarSelection(manifest) {
  const categories = manifest?.categories || {};
  const pick = (name) => {
    const options = categories[name] || [];
    if (!options.length) return null;
    return options[Math.floor(Math.random() * options.length)];
  };

  return {
    head: pick('head'),
    eyes: pick('eyes'),
    nose: pick('nose'),
    mouth: pick('mouth'),
    hair: pick('hair'),
    beard: Math.random() < 0.5 ? null : pick('beard'),
    accessories: Math.random() < 0.5 ? null : pick('accessories')
  };
}

export function serializeAvatarSelection(selection) {
  return JSON.stringify(selection);
}
