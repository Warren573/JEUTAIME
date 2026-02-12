#!/bin/bash

# ========================================
# GENERATEUR AUTOMATIQUE D'ASSETS AVATAR
# ========================================
# Génère 30+ SVG minimalistes + manifest.json
# Style : noir & blanc, traits épais, type notion-avatar

set -e

ASSETS_DIR="/home/user/JEUTAIME/src/avatar/assets"

echo "🎨 Génération des assets avatar..."

# ========================================
# 1. FACES (3 variantes)
# ========================================

cat > "$ASSETS_DIR/face/face_01_round.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="180" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/face/face_02_oval.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <ellipse cx="256" cy="266" rx="170" ry="200" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/face/face_03_squareish.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect x="96" y="76" width="320" height="360" rx="60" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

# ========================================
# 2. EYES (6 variantes)
# ========================================

cat > "$ASSETS_DIR/eyes/eyes_01_dots.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="186" cy="220" r="12" fill="#111"/>
  <circle cx="326" cy="220" r="12" fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_02_soft.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <ellipse cx="186" cy="220" rx="18" ry="24" fill="#111"/>
  <ellipse cx="326" cy="220" rx="18" ry="24" fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_03_smile.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 166 220 Q 186 205 206 220" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
  <path d="M 306 220 Q 326 205 346 220" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_04_round.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="186" cy="220" r="20" fill="none" stroke="#111" stroke-width="14"/>
  <circle cx="186" cy="220" r="8" fill="#111"/>
  <circle cx="326" cy="220" r="20" fill="none" stroke="#111" stroke-width="14"/>
  <circle cx="326" cy="220" r="8" fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_05_angrylight.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <line x1="166" y1="210" x2="206" y2="220" stroke="#111" stroke-width="14" stroke-linecap="round"/>
  <line x1="346" y1="210" x2="306" y2="220" stroke="#111" stroke-width="14" stroke-linecap="round"/>
  <circle cx="186" cy="230" r="8" fill="#111"/>
  <circle cx="326" cy="230" r="8" fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_06_glasses.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect x="146" y="200" width="80" height="60" rx="10" fill="none" stroke="#111" stroke-width="14"/>
  <rect x="286" y="200" width="80" height="60" rx="10" fill="none" stroke="#111" stroke-width="14"/>
  <line x1="226" y1="230" x2="286" y2="230" stroke="#111" stroke-width="14"/>
</svg>
EOF

# ========================================
# 3. NOSES (3 variantes)
# ========================================

cat > "$ASSETS_DIR/mouth/nose_01_dot.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="280" r="6" fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/nose_02_curve.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 256 260 Q 266 280 256 290" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/nose_03_triangle.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 256 260 L 266 285 L 246 285 Z" fill="none" stroke="#111" stroke-width="10" stroke-linejoin="round"/>
</svg>
EOF

# ========================================
# 4. MOUTHS (6 variantes)
# ========================================

cat > "$ASSETS_DIR/mouth/mouth_01_smile.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 196 320 Q 256 360 316 320" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_02_neutral.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <line x1="206" y1="330" x2="306" y2="330" stroke="#111" stroke-width="12" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_03_grin.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 186 310 Q 256 350 326 310" fill="none" stroke="#111" stroke-width="16" stroke-linecap="round"/>
  <line x1="216" y1="328" x2="296" y2="328" stroke="#111" stroke-width="10" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_04_open.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <ellipse cx="256" cy="330" rx="40" ry="30" fill="none" stroke="#111" stroke-width="14"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_05_smirk.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 206 325 Q 236 340 286 320" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_06_bigsmile.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 176 310 Q 256 380 336 310" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round"/>
</svg>
EOF

# ========================================
# 5. HAIR BACK (6 variantes)
# ========================================

cat > "$ASSETS_DIR/hair/back/hair_back_01_buzz.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 100 200 Q 90 120 140 80 Q 200 50 256 50 Q 312 50 372 80 Q 422 120 412 200" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_02_short.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 80 220 Q 70 100 150 60 Q 200 40 256 40 Q 312 40 362 60 Q 442 100 432 220" fill="none" stroke="#111" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_03_side_sweep.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 70 240 Q 60 90 160 50 Q 220 30 280 40 Q 380 60 430 160 Q 440 200 430 240" fill="none" stroke="#111" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_04_parted.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 90 210 Q 80 110 150 60 Q 210 30 256 35 L 256 35 Q 302 30 362 60 Q 432 110 422 210" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="256" y1="35" x2="256" y2="120" stroke="#111" stroke-width="10"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_05_curly.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 70 240 Q 60 80 180 40 Q 220 30 256 35 Q 292 30 332 40 Q 452 80 442 240" fill="none" stroke="#111" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="120" cy="140" r="25" fill="none" stroke="#111" stroke-width="12"/>
  <circle cx="200" cy="80" r="20" fill="none" stroke="#111" stroke-width="10"/>
  <circle cx="312" cy="80" r="20" fill="none" stroke="#111" stroke-width="10"/>
  <circle cx="392" cy="140" r="25" fill="none" stroke="#111" stroke-width="12"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_06_afro_small.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="140" r="130" fill="none" stroke="#111" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

# ========================================
# 6. HAIR FRONT (6 variantes)
# ========================================

cat > "$ASSETS_DIR/hair/front/hair_front_01_buzz.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Minimal front hairline -->
  <path d="M 100 150 Q 120 130 150 120" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/>
  <path d="M 412 150 Q 392 130 362 120" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_02_short.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 90 170 Q 110 140 150 130 Q 200 120 256 125" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
  <path d="M 422 170 Q 402 140 362 130 Q 312 120 256 125" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_03_side_sweep.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 80 180 Q 100 110 180 90 Q 240 80 300 100 Q 340 120 360 160" fill="none" stroke="#111" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_04_parted.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 100 160 Q 130 120 190 110 L 246 115" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
  <path d="M 412 160 Q 382 120 322 110 L 266 115" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_05_curly.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="130" cy="150" r="18" fill="none" stroke="#111" stroke-width="10"/>
  <circle cx="190" cy="120" r="16" fill="none" stroke="#111" stroke-width="9"/>
  <circle cx="256" cy="110" r="18" fill="none" stroke="#111" stroke-width="10"/>
  <circle cx="322" cy="120" r="16" fill="none" stroke="#111" stroke-width="9"/>
  <circle cx="382" cy="150" r="18" fill="none" stroke="#111" stroke-width="10"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_06_afro_small.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Front part of afro (minimal) -->
  <path d="M 126 140 Q 150 100 200 85 Q 256 75 312 85 Q 362 100 386 140" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round"/>
</svg>
EOF

# ========================================
# 7. BEARDS (3 variantes)
# ========================================

cat > "$ASSETS_DIR/beard/beard_01_stubble.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="176" cy="360" r="2" fill="#111"/>
  <circle cx="196" cy="370" r="2" fill="#111"/>
  <circle cx="216" cy="375" r="2" fill="#111"/>
  <circle cx="236" cy="378" r="2" fill="#111"/>
  <circle cx="256" cy="380" r="2" fill="#111"/>
  <circle cx="276" cy="378" r="2" fill="#111"/>
  <circle cx="296" cy="375" r="2" fill="#111"/>
  <circle cx="316" cy="370" r="2" fill="#111"/>
  <circle cx="336" cy="360" r="2" fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/beard/beard_02_beard.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 160 350 Q 150 390 180 420 Q 220 445 256 445 Q 292 445 332 420 Q 362 390 352 350" fill="none" stroke="#111" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/beard/beard_03_goatee.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 236 360 Q 230 400 256 420 Q 282 400 276 360" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

# ========================================
# 8. ACCESSORIES (3 variantes)
# ========================================

cat > "$ASSETS_DIR/accessories/acc_01_earrings.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="100" cy="260" r="10" fill="none" stroke="#111" stroke-width="8"/>
  <circle cx="412" cy="260" r="10" fill="none" stroke="#111" stroke-width="8"/>
</svg>
EOF

cat > "$ASSETS_DIR/accessories/acc_02_hat.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <ellipse cx="256" cy="120" rx="150" ry="20" fill="none" stroke="#111" stroke-width="14"/>
  <rect x="186" y="50" width="140" height="70" rx="15" fill="none" stroke="#111" stroke-width="14"/>
</svg>
EOF

cat > "$ASSETS_DIR/accessories/acc_03_mustache.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M 176 310 Q 160 295 140 300 Q 120 310 130 320" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/>
  <path d="M 336 310 Q 352 295 372 300 Q 392 310 382 320" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/>
  <path d="M 176 310 Q 216 305 256 310 Q 296 305 336 310" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/>
</svg>
EOF

# ========================================
# 9. MANIFEST.JSON
# ========================================

cat > "$ASSETS_DIR/manifest.json" << 'EOF'
{
  "version": "avatar_v1_minimal",
  "size": 512,
  "face": [
    {
      "id": "face_01_round",
      "name": "Round",
      "path": "/src/avatar/assets/face/face_01_round.svg"
    },
    {
      "id": "face_02_oval",
      "name": "Oval",
      "path": "/src/avatar/assets/face/face_02_oval.svg"
    },
    {
      "id": "face_03_squareish",
      "name": "Squareish",
      "path": "/src/avatar/assets/face/face_03_squareish.svg"
    }
  ],
  "eyes": [
    {
      "id": "eyes_01_dots",
      "name": "Dots",
      "path": "/src/avatar/assets/eyes/eyes_01_dots.svg"
    },
    {
      "id": "eyes_02_soft",
      "name": "Soft",
      "path": "/src/avatar/assets/eyes/eyes_02_soft.svg"
    },
    {
      "id": "eyes_03_smile",
      "name": "Smile",
      "path": "/src/avatar/assets/eyes/eyes_03_smile.svg"
    },
    {
      "id": "eyes_04_round",
      "name": "Round",
      "path": "/src/avatar/assets/eyes/eyes_04_round.svg"
    },
    {
      "id": "eyes_05_angrylight",
      "name": "Angry Light",
      "path": "/src/avatar/assets/eyes/eyes_05_angrylight.svg"
    },
    {
      "id": "eyes_06_glasses",
      "name": "Glasses",
      "path": "/src/avatar/assets/eyes/eyes_06_glasses.svg"
    }
  ],
  "mouth": [
    {
      "id": "nose_01_dot",
      "name": "Dot Nose",
      "path": "/src/avatar/assets/mouth/nose_01_dot.svg"
    },
    {
      "id": "nose_02_curve",
      "name": "Curve Nose",
      "path": "/src/avatar/assets/mouth/nose_02_curve.svg"
    },
    {
      "id": "nose_03_triangle",
      "name": "Triangle Nose",
      "path": "/src/avatar/assets/mouth/nose_03_triangle.svg"
    },
    {
      "id": "mouth_01_smile",
      "name": "Smile",
      "path": "/src/avatar/assets/mouth/mouth_01_smile.svg"
    },
    {
      "id": "mouth_02_neutral",
      "name": "Neutral",
      "path": "/src/avatar/assets/mouth/mouth_02_neutral.svg"
    },
    {
      "id": "mouth_03_grin",
      "name": "Grin",
      "path": "/src/avatar/assets/mouth/mouth_03_grin.svg"
    },
    {
      "id": "mouth_04_open",
      "name": "Open",
      "path": "/src/avatar/assets/mouth/mouth_04_open.svg"
    },
    {
      "id": "mouth_05_smirk",
      "name": "Smirk",
      "path": "/src/avatar/assets/mouth/mouth_05_smirk.svg"
    },
    {
      "id": "mouth_06_bigsmile",
      "name": "Big Smile",
      "path": "/src/avatar/assets/mouth/mouth_06_bigsmile.svg"
    }
  ],
  "hairBack": [
    {
      "id": "hair_back_01_buzz",
      "name": "Buzz",
      "path": "/src/avatar/assets/hair/back/hair_back_01_buzz.svg"
    },
    {
      "id": "hair_back_02_short",
      "name": "Short",
      "path": "/src/avatar/assets/hair/back/hair_back_02_short.svg"
    },
    {
      "id": "hair_back_03_side_sweep",
      "name": "Side Sweep",
      "path": "/src/avatar/assets/hair/back/hair_back_03_side_sweep.svg"
    },
    {
      "id": "hair_back_04_parted",
      "name": "Parted",
      "path": "/src/avatar/assets/hair/back/hair_back_04_parted.svg"
    },
    {
      "id": "hair_back_05_curly",
      "name": "Curly",
      "path": "/src/avatar/assets/hair/back/hair_back_05_curly.svg"
    },
    {
      "id": "hair_back_06_afro_small",
      "name": "Afro Small",
      "path": "/src/avatar/assets/hair/back/hair_back_06_afro_small.svg"
    }
  ],
  "hairFront": [
    {
      "id": "hair_front_01_buzz",
      "name": "Buzz",
      "path": "/src/avatar/assets/hair/front/hair_front_01_buzz.svg"
    },
    {
      "id": "hair_front_02_short",
      "name": "Short",
      "path": "/src/avatar/assets/hair/front/hair_front_02_short.svg"
    },
    {
      "id": "hair_front_03_side_sweep",
      "name": "Side Sweep",
      "path": "/src/avatar/assets/hair/front/hair_front_03_side_sweep.svg"
    },
    {
      "id": "hair_front_04_parted",
      "name": "Parted",
      "path": "/src/avatar/assets/hair/front/hair_front_04_parted.svg"
    },
    {
      "id": "hair_front_05_curly",
      "name": "Curly",
      "path": "/src/avatar/assets/hair/front/hair_front_05_curly.svg"
    },
    {
      "id": "hair_front_06_afro_small",
      "name": "Afro Small",
      "path": "/src/avatar/assets/hair/front/hair_front_06_afro_small.svg"
    }
  ],
  "beard": [
    {
      "id": "beard_01_stubble",
      "name": "Stubble",
      "path": "/src/avatar/assets/beard/beard_01_stubble.svg"
    },
    {
      "id": "beard_02_beard",
      "name": "Beard",
      "path": "/src/avatar/assets/beard/beard_02_beard.svg"
    },
    {
      "id": "beard_03_goatee",
      "name": "Goatee",
      "path": "/src/avatar/assets/beard/beard_03_goatee.svg"
    }
  ],
  "accessory": [
    {
      "id": "acc_01_earrings",
      "name": "Earrings",
      "path": "/src/avatar/assets/accessories/acc_01_earrings.svg"
    },
    {
      "id": "acc_02_hat",
      "name": "Hat",
      "path": "/src/avatar/assets/accessories/acc_02_hat.svg"
    },
    {
      "id": "acc_03_mustache",
      "name": "Mustache",
      "path": "/src/avatar/assets/accessories/acc_03_mustache.svg"
    }
  ]
}
EOF

echo ""
echo "✅ TERMINÉ !"
echo ""
echo "📊 Assets générés :"
echo "  - 3 faces"
echo "  - 6 eyes"
echo "  - 3 noses + 6 mouths (dans /mouth)"
echo "  - 6 hairBack + 6 hairFront"
echo "  - 3 beards"
echo "  - 3 accessories"
echo "  - manifest.json complet"
echo ""
echo "Total: 36 fichiers SVG + manifest.json"
echo ""
