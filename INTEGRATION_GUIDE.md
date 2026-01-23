# 📘 Guide d'Intégration - Architecture Contenu & Effets

Ce guide explique comment intégrer progressivement les 3 moteurs dans l'UI existante **sans casser l'app**.

## 🎯 Principe : Non-destructif & progressif

- ✅ Les moteurs **coexistent** avec le code existant
- ✅ Migration **progressive** composant par composant
- ✅ **Aucun breaking change**

---

## 1️⃣ ContentRegistry - Remplacer les imports directs

### ❌ Avant (import direct)
```javascript
import { salons } from '../data/appData';
import { allGifts } from '../data/magicGifts';
```

### ✅ Après (via ContentRegistry)
```javascript
import { getSalons, getOfferings } from '../engine/ContentRegistry';

// Dans le composant
const salons = getSalons(); // Retourne les salons actifs seulement
const offerings = getOfferings(); // Unifie toutes les sources
```

### Avantages
- Possibilité d'activer/désactiver du contenu depuis l'admin
- Ajouter du contenu custom sans modifier les fichiers data
- Backend-ready (facile de remplacer par API calls)

---

## 2️⃣ EffectEngine - Ajouter des effets visuels

### Exemple 1 : Invisibilité
```javascript
import { activateInvisibility, hasActiveEffect } from '../engine/EffectEngine';

// Activer l'invisibilité
function handleInvisibilitySpell() {
  activateInvisibility(currentUser.email, 3600000); // 1h
  alert('Tu es invisible pendant 1h !');
}

// Dans le rendu Avatar
function Avatar({ userId }) {
  const isInvisible = hasActiveEffect(userId, 'avatar_visibility');

  return (
    <div style={{ opacity: isInvisible ? 0.3 : 1, transition: 'opacity 0.3s' }}>
      {/* Avatar content */}
    </div>
  );
}
```

### Exemple 2 : Badge temporaire
```javascript
import { activateProfileBadge, getEffectsByType } from '../engine/EffectEngine';

// Activer un badge BOOST
activateProfileBadge(userId, {
  text: 'BOOST',
  color: '#FF9800',
  icon: '🚀'
}, 1800000); // 30 min

// Afficher le badge
function ProfileHeader({ userId }) {
  const badges = getEffectsByType('profile_badge', userId);

  return (
    <div>
      {badges.map(badge => (
        <span key={badge.id} style={{
          background: badge.data.color,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {badge.data.icon} {badge.data.text}
        </span>
      ))}
    </div>
  );
}
```

### Exemple 3 : Transformation texte
```javascript
import { activateTextTransform, applyTextTransform } from '../engine/EffectEngine';

// Activer texte inversé
activateTextTransform(userId, 'reverse', 300000); // 5 min

// Afficher le texte transformé
function Message({ text, authorId }) {
  const displayText = applyTextTransform(text, authorId);

  return <div>{displayText}</div>;
}
```

---

## 3️⃣ ThemeEngine - Thèmes responsives

### Intégration dans BarDetailScreen (salon)

```javascript
import { applyTheme, isMobile } from '../engine/ThemeEngine';
import { useEffect, useState } from 'react';

function BarDetailScreen({ salon }) {
  const [themeCSS, setThemeCSS] = useState({});

  useEffect(() => {
    // Appliquer le thème du salon
    const theme = applyTheme(salon.id);
    setThemeCSS(theme);
  }, [salon.id]);

  return (
    <div style={{
      ...themeCSS,
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Contenu du salon */}
    </div>
  );
}
```

### Thème avec overlay temporaire

```javascript
import { applyTheme, addOverlay } from '../engine/ThemeEngine';

function NightModeSalon({ salonId }) {
  const theme = applyTheme(salonId);
  const nightOverlay = addOverlay({
    color: 'rgba(0, 0, 50, 0.6)',
    opacity: 0.7
  });

  return (
    <div style={theme}>
      <div style={nightOverlay}></div>
      {/* Contenu */}
    </div>
  );
}
```

---

## 4️⃣ Intégration dans App.jsx (auto-cleanup)

Ajouter dans `App.jsx` au montage :

```javascript
import { startAutoCleanup } from './engine/EffectEngine';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Lance le nettoyage automatique des effets expirés
    const cleanup = startAutoCleanup();
    return cleanup;
  }, []);

  // Reste du code...
}
```

---

## 5️⃣ Migration progressive - Ordre recommandé

### Phase 1 : Backend invisible (fait ✅)
- [x] ContentRegistry créé
- [x] EffectEngine créé
- [x] ThemeEngine créé

### Phase 2 : Salons & Thèmes
1. Intégrer ThemeEngine dans `BarDetailScreen`
2. Ajouter transitions douces entre salons
3. Tester sur mobile (petit écran, notch)

### Phase 3 : Offrandes & Pouvoirs
1. Remplacer imports directs par ContentRegistry
2. Tester que tout fonctionne pareil

### Phase 4 : Effets visuels
1. Ajouter AvatarEffectsLayer (overlay sur avatar)
2. Implémenter badges temporaires
3. Implémenter transformations texte

### Phase 5 : Admin panel
1. UI pour activer/désactiver contenu
2. UI pour voir effets actifs
3. UI pour créer salons custom

---

## ⚠️ Règles d'or

1. **Ne jamais modifier les données source**
   - Les effets sont affichage-only
   - Transformations texte = display only

2. **Transitions douces obligatoires**
   ```css
   transition: opacity 0.3s ease, transform 0.3s ease;
   ```

3. **Mobile-first**
   - Tester sur iPhone SE (375px)
   - Tester sur iPad (768px)
   - Vérifier safe-area (notch)

4. **Performance**
   - Pas de background-attachment:fixed sur mobile
   - Images optimisées selon taille écran
   - Cleanup automatique des effets expirés

---

## 🧪 Tests

### Test 1 : ContentRegistry
```javascript
import { getOfferings, getSalons } from './engine/ContentRegistry';

console.log('Offerings:', getOfferings());
console.log('Salons:', getSalons());
```

### Test 2 : EffectEngine
```javascript
import { activateInvisibility, getUserActiveEffects } from './engine/EffectEngine';

activateInvisibility('test@test.com', 5000);
setTimeout(() => {
  console.log('Effects:', getUserActiveEffects('test@test.com'));
}, 1000);
```

### Test 3 : ThemeEngine
```javascript
import { applyTheme, isMobile } from './engine/ThemeEngine';

const theme = applyTheme(1); // Salon Piscine
console.log('Theme:', theme);
console.log('Is mobile:', isMobile());
```

---

## 📱 Checklist Mobile

- [ ] Tester sur iPhone SE (375px)
- [ ] Tester sur iPhone 12 Pro (390px)
- [ ] Tester sur iPad Mini (768px)
- [ ] Tester sur iPad Pro (1024px)
- [ ] Vérifier notch (safe-area)
- [ ] Vérifier rotation (portrait/landscape)
- [ ] Vérifier scroll fluide
- [ ] Vérifier pas de reflow brutal
- [ ] Vérifier transitions douces

---

## 🚀 Prochaines étapes

1. Créer `AvatarEffectsLayer` component
2. Intégrer ThemeEngine dans salons
3. Tests mobile complets
4. Admin UI pour gérer contenu
