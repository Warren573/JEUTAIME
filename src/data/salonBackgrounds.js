export const SALON_BACKGROUNDS = [
  // — Aucun (fond par défaut beige)
  { id: 'default', label: 'Défaut', type: 'color', value: '#f7f3ef', thumb: '#f7f3ef' },

  // — Dégradés
  { id: 'sunset', label: 'Coucher de soleil', type: 'gradient', value: 'linear-gradient(160deg, #f9a825, #e91e63)', thumb: 'linear-gradient(160deg, #f9a825, #e91e63)' },
  { id: 'ocean', label: 'Océan', type: 'gradient', value: 'linear-gradient(160deg, #0288d1, #26c6da)', thumb: 'linear-gradient(160deg, #0288d1, #26c6da)' },
  { id: 'forest', label: 'Forêt', type: 'gradient', value: 'linear-gradient(160deg, #2e7d32, #a5d6a7)', thumb: 'linear-gradient(160deg, #2e7d32, #a5d6a7)' },
  { id: 'night', label: 'Nuit étoilée', type: 'gradient', value: 'linear-gradient(160deg, #1a237e, #311b92)', thumb: 'linear-gradient(160deg, #1a237e, #311b92)' },
  { id: 'rose', label: 'Rose', type: 'gradient', value: 'linear-gradient(160deg, #f48fb1, #ce93d8)', thumb: 'linear-gradient(160deg, #f48fb1, #ce93d8)' },
  { id: 'golden', label: 'Doré', type: 'gradient', value: 'linear-gradient(160deg, #f57f17, #ffd54f)', thumb: 'linear-gradient(160deg, #f57f17, #ffd54f)' },

  // — Photos (Unsplash)
  { id: 'photo_pool', label: 'Piscine', type: 'image', value: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=60' },
  { id: 'photo_beach', label: 'Plage', type: 'image', value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=60' },
  { id: 'photo_mountain', label: 'Montagne', type: 'image', value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=60' },
  { id: 'photo_city', label: 'Ville de nuit', type: 'image', value: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&q=60' },
  { id: 'photo_cafe', label: 'Café', type: 'image', value: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&q=60' },
  { id: 'photo_flowers', label: 'Fleurs', type: 'image', value: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=200&q=60' },
  { id: 'photo_space', label: 'Espace', type: 'image', value: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&q=60' },
  { id: 'photo_party', label: 'Fête', type: 'image', value: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=60' },
  { id: 'photo_bar', label: 'Bar', type: 'image', value: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=70', thumb: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=200&q=60' },
];

const BG_STORAGE_KEY = 'jeutaime_salon_bg';

export function getSalonBackground(salonId) {
  try {
    const stored = JSON.parse(localStorage.getItem(BG_STORAGE_KEY) || '{}');
    return stored[salonId] || null;
  } catch { return null; }
}

export function setSalonBackground(salonId, backgroundId) {
  try {
    const stored = JSON.parse(localStorage.getItem(BG_STORAGE_KEY) || '{}');
    stored[salonId] = backgroundId;
    localStorage.setItem(BG_STORAGE_KEY, JSON.stringify(stored));
  } catch {}
}

export function getBackgroundStyle(backgroundId) {
  const bg = SALON_BACKGROUNDS.find(b => b.id === backgroundId);
  if (!bg || bg.id === 'default') return { background: '#f7f3ef' };
  if (bg.type === 'image') return {
    backgroundImage: `url(${bg.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  return { background: bg.value };
}
