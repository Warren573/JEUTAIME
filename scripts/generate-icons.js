// Script pour générer les icônes PWA
// Pour l'instant, on utilise des SVG temporaires

const fs = require('fs');
const path = require('path');

// Créer les icônes SVG temporaires
const iconSizes = [192, 512];

iconSizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.2}"/>
  <text x="${size / 2}" y="${size * 0.7}" font-size="${size * 0.5}" text-anchor="middle" fill="white">💕</text>
</svg>`;

  const outputPath = path.join(__dirname, '..', 'public', `icon-${size}.svg`);
  fs.writeFileSync(outputPath, svg);
  console.log(`✅ Icône ${size}x${size} créée`);
});

console.log('🎉 Toutes les icônes ont été générées !');
