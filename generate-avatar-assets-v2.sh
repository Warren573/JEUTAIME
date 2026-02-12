#!/bin/bash

# ========================================
# GENERATEUR AVATAR V2 - SVG DÉTAILLÉS
# ========================================
# Version améliorée avec têtes à oreilles, lunettes détaillées, etc.
# Inspiré du script PowerShell original

set -e

ASSETS_DIR="/home/user/JEUTAIME/src/avatar/assets"

echo "🎨 Génération des assets avatar V2 (détaillés)..."

# ========================================
# 1. FACES (3 variantes avec oreilles)
# ========================================

cat > "$ASSETS_DIR/face/face_01_round.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="256" cy="250" rx="135" ry="160" fill="#fff"/>
    <path d="M150 268 C120 260, 120 220, 150 210" fill="none"/>
    <path d="M362 268 C392 260, 392 220, 362 210" fill="none"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/face/face_02_oval.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="256" cy="255" rx="120" ry="170" fill="#fff"/>
    <path d="M155 280 C130 270, 130 230, 155 220" fill="none"/>
    <path d="M357 280 C382 270, 382 230, 357 220" fill="none"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/face/face_03_squareish.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">
    <path d="M170 140
             C150 170, 140 210, 140 260
             C140 360, 190 420, 256 420
             C322 420, 372 360, 372 260
             C372 210, 362 170, 342 140
             C320 120, 292 110, 256 110
             C220 110, 192 120, 170 140 Z" fill="#fff"/>
    <path d="M150 278 C122 270, 122 235, 150 225" fill="none"/>
    <path d="M362 278 C390 270, 390 235, 362 225" fill="none"/>
  </g>
</svg>
EOF

# ========================================
# 2. EYES (6 variantes améliorées)
# ========================================

cat > "$ASSETS_DIR/eyes/eyes_01_dots.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g fill="#111">
    <circle cx="210" cy="240" r="12"/>
    <circle cx="302" cy="240" r="12"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_02_soft.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M185 240 C200 225, 220 225, 235 240"/>
    <path d="M277 240 C292 225, 312 225, 327 240"/>
    <circle cx="210" cy="244" r="6" fill="#111" stroke="none"/>
    <circle cx="302" cy="244" r="6" fill="#111" stroke="none"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_03_smile.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="18" stroke-linecap="round" fill="none">
    <path d="M185 240 C205 255, 225 255, 245 240"/>
    <path d="M267 240 C287 255, 307 255, 327 240"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_04_round.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="210" cy="240" r="20"/>
    <circle cx="302" cy="240" r="20"/>
    <circle cx="210" cy="242" r="8" fill="#111" stroke="none"/>
    <circle cx="302" cy="242" r="8" fill="#111" stroke="none"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_05_angrylight.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="18" stroke-linecap="round" fill="none">
    <path d="M175 225 L240 235"/>
    <path d="M272 235 L337 225"/>
    <circle cx="210" cy="245" r="10" fill="#111" stroke="none"/>
    <circle cx="302" cy="245" r="10" fill="#111" stroke="none"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/eyes/eyes_06_glasses.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <rect x="165" y="220" width="85" height="55" rx="18"/>
    <rect x="262" y="220" width="85" height="55" rx="18"/>
    <path d="M250 248 L262 248"/>
    <path d="M155 235 C145 235, 135 240, 125 250"/>
    <path d="M357 235 C367 235, 377 240, 387 250"/>
    <circle cx="210" cy="248" r="7" fill="#111" stroke="none"/>
    <circle cx="304" cy="248" r="7" fill="#111" stroke="none"/>
  </g>
</svg>
EOF

# ========================================
# 3. NOSES (3 variantes)
# ========================================

cat > "$ASSETS_DIR/mouth/nose_01_dot.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="285" r="6" fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/nose_02_curve.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M252 270 C245 290, 245 300, 258 305" stroke="#111" stroke-width="18" stroke-linecap="round" fill="none"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/nose_03_triangle.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M256 265 L245 300 L267 300 Z" stroke="#111" stroke-width="18" stroke-linejoin="round" fill="none"/>
</svg>
EOF

# ========================================
# 4. MOUTHS (6 variantes)
# ========================================

cat > "$ASSETS_DIR/mouth/mouth_01_smile.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M215 335 C240 360, 272 360, 297 335" stroke="#111" stroke-width="18" stroke-linecap="round" fill="none"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_02_neutral.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M220 345 L292 345" stroke="#111" stroke-width="18" stroke-linecap="round" fill="none"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_03_grin.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M220 340 C240 350, 272 350, 292 340" stroke="#111" stroke-width="18" stroke-linecap="round" fill="none"/>
  <path d="M235 350 C250 360, 262 360, 277 350" stroke="#111" stroke-width="12" stroke-linecap="round" fill="none"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_04_open.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <ellipse cx="256" cy="350" rx="26" ry="18" stroke="#111" stroke-width="18" fill="none"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_05_smirk.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M220 345 C250 335, 275 335, 292 350" stroke="#111" stroke-width="18" stroke-linecap="round" fill="none"/>
</svg>
EOF

cat > "$ASSETS_DIR/mouth/mouth_06_bigsmile.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M205 335 C235 375, 277 375, 307 335" stroke="#111" stroke-width="18" stroke-linecap="round" fill="none"/>
</svg>
EOF

# ========================================
# 5. HAIR BACK (6 variantes détaillées)
# ========================================

cat > "$ASSETS_DIR/hair/back/hair_back_01_buzz.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M170 170 C195 130, 317 130, 342 170" stroke="#111" stroke-width="18" stroke-linecap="round" fill="none"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_02_short.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M165 190 C185 135, 332 135, 347 190
           C332 175, 300 165, 256 165
           C212 165, 180 175, 165 190 Z"
        fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_03_side_sweep.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M160 190 C185 135, 332 135, 352 190
           C320 170, 285 165, 250 175
           C220 185, 195 195, 175 205
           C165 210, 160 200, 160 190 Z"
        fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_04_parted.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M165 190 C185 135, 332 135, 347 190
           C325 178, 300 170, 275 170
           C250 170, 225 178, 205 190
           C185 202, 170 205, 165 190 Z"
        fill="#111"/>
  <path d="M250 150 C255 165, 265 185, 280 200" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_05_curly.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g fill="#111">
    <circle cx="190" cy="175" r="22"/><circle cx="220" cy="160" r="22"/><circle cx="252" cy="155" r="22"/>
    <circle cx="284" cy="160" r="22"/><circle cx="316" cy="175" r="22"/><circle cx="338" cy="200" r="22"/>
    <circle cx="175" cy="200" r="22"/><circle cx="210" cy="200" r="22"/><circle cx="290" cy="200" r="22"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/hair/back/hair_back_06_afro_small.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M150 210
           C150 140, 215 120, 256 120
           C297 120, 362 140, 362 210
           C362 255, 330 265, 256 265
           C182 265, 150 255, 150 210 Z"
        fill="#111"/>
</svg>
EOF

# ========================================
# 6. HAIR FRONT (6 variantes)
# ========================================

cat > "$ASSETS_DIR/hair/front/hair_front_01_buzz.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Minimal front hairline -->
  <path d="M175 155 Q 200 145, 225 145" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/>
  <path d="M337 155 Q 312 145, 287 145" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_02_short.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M180 165 C200 145, 230 140, 256 140
           C282 140, 312 145, 332 165"
        fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_03_side_sweep.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M175 175 C195 145, 240 135, 280 145
           C310 155, 330 170, 340 185"
        fill="none" stroke="#111" stroke-width="16" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_04_parted.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M180 165 C200 145, 230 140, 250 142"
        fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
  <path d="M332 165 C312 145, 282 140, 262 142"
        fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_05_curly.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="195" cy="165" r="14" fill="#111"/>
  <circle cx="225" cy="155" r="14" fill="#111"/>
  <circle cx="256" cy="150" r="14" fill="#111"/>
  <circle cx="287" cy="155" r="14" fill="#111"/>
  <circle cx="317" cy="165" r="14" fill="#111"/>
</svg>
EOF

cat > "$ASSETS_DIR/hair/front/hair_front_06_afro_small.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Front part of afro -->
  <path d="M160 180 Q 200 140, 256 135
           Q 312 140, 352 180"
        fill="none" stroke="#111" stroke-width="18" stroke-linecap="round"/>
</svg>
EOF

# ========================================
# 7. BEARDS (3 variantes détaillées)
# ========================================

cat > "$ASSETS_DIR/beard/beard_01_stubble.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M190 340 C205 385, 230 410, 256 410
           C282 410, 307 385, 322 340"
        stroke="#111" stroke-width="18" stroke-linecap="round" fill="none" opacity="0.65"/>
</svg>
EOF

cat > "$ASSETS_DIR/beard/beard_02_beard.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M185 330 C185 415, 215 445, 256 445
           C297 445, 327 415, 327 330
           C305 360, 285 372, 256 372
           C227 372, 207 360, 185 330 Z"
        fill="#111" opacity="0.9"/>
</svg>
EOF

cat > "$ASSETS_DIR/beard/beard_03_goatee.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M238 360 C240 410, 272 410, 274 360
           C270 380, 242 380, 238 360 Z"
        fill="#111" opacity="0.9"/>
</svg>
EOF

# ========================================
# 8. ACCESSORIES (3 variantes détaillées)
# ========================================

cat > "$ASSETS_DIR/accessories/acc_01_earrings.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="16" stroke-linecap="round" fill="none">
    <circle cx="150" cy="285" r="18"/>
    <circle cx="362" cy="285" r="18"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/accessories/acc_02_hat.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="#111" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M165 200 C190 150, 322 150, 347 200"/>
    <path d="M145 210 L367 210"/>
  </g>
</svg>
EOF

cat > "$ASSETS_DIR/accessories/acc_03_mustache.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M210 318 C230 300, 250 300, 256 315
           C262 300, 282 300, 302 318"
        stroke="#111" stroke-width="18" stroke-linecap="round" fill="none"/>
</svg>
EOF

echo ""
echo "✅ TERMINÉ ! Assets V2 (détaillés) générés !"
echo ""
echo "📊 Améliorations :"
echo "  - Têtes avec oreilles détaillées"
echo "  - Lunettes avec branches"
echo "  - Cheveux remplis (curly, afro, short)"
echo "  - Barbes avec opacity pour effet réaliste"
echo ""
