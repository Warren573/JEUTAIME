# 📱 Stratégie d'Uniformisation Mobile - JEUTAIME

## 🎯 Objectif
Rendre l'application 100% native-like sur tous les supports (iOS, Android, PWA) sans débordement, hauteur incorrecte ou problèmes de scroll.

---

## 📊 État Actuel - Problèmes Identifiés

### ❌ Écrans NON uniformisés (besoin de correction)
```
✗ AvatarEditorScreen.jsx     → height: 100vh, paddingBottom: 100px
✗ BadgesScreen.jsx            → height: 100vh, paddingBottom: 80px
✗ EspacePersoScreen.jsx       → height: 100vh, paddingBottom: 80px
✗ HomeScreen.jsx              → height: 100vh, paddingBottom: 80px
✗ RankingScreen.jsx           → height: 100vh, paddingBottom: 100px
✗ MemoriesScreen.jsx          → height: 100vh, paddingBottom: 80px
✗ BarDetailScreen.jsx         → (à vérifier)
✗ ChatScreen.jsx              → (à vérifier)
✗ LettersScreen.jsx           → (à vérifier)
```

### ✅ Écrans DÉJÀ uniformisés (référence)
```
✓ EspacePersoScreenSimple.jsx → 100dvh + safe-area-inset
✓ ProfilesScreen.jsx          → 100dvh + safe-area-inset
✓ JournalScreen.jsx           → 100dvh + safe-area-inset
✓ ReferralScreen.jsx          → 100dvh + safe-area-inset
✓ SettingsScreen.jsx          → 100dvh + safe-area-inset
✓ SocialScreen.jsx            → Layout fixe spécial
✓ BarsScreen.jsx              → Container interne (height: 100%)
```

---

## 🏗️ Architecture Standard

### 1️⃣ **ÉCRANS PRINCIPAUX** (Navigation de base)
Écrans accessibles depuis la barre de navigation en bas.

**Pattern à utiliser:**
```jsx
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
  {/* Contenu scrollable */}
</div>
```

**Fichiers concernés:**
- ✓ EspacePersoScreenSimple.jsx (Accueil)
- ✓ ProfilesScreen.jsx (Découverte)
- ✓ SettingsScreen.jsx (Paramètres)
- ✓ JournalScreen.jsx (via SettingsScreen)
- ✓ ReferralScreen.jsx (via SettingsScreen)

---

### 2️⃣ **ÉCRANS SECONDAIRES** (Navigation depuis écrans principaux)
Écrans accessibles via boutons, pas la navigation principale.

**Pattern à utiliser:**
```jsx
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
  <BackButton onClick={handleBack} />
  {/* Contenu scrollable */}
</div>
```

**Fichiers concernés:**
- ❌ BadgesScreen.jsx
- ❌ HomeScreen.jsx
- ❌ RankingScreen.jsx (aussi appelé dans SocialScreen)
- ❌ AvatarEditorScreen.jsx
- ❌ MemoriesScreen.jsx

---

### 3️⃣ **ÉCRANS CONTAINERS** (Layout fixe sans scroll principal)
Écrans qui contiennent des tabs ou des sous-sections avec scroll indépendant.

**Pattern à utiliser:**
```jsx
<div style={{
  height: '100dvh',
  overflow: 'hidden',
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',
  background: 'var(--color-beige-light)',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box'
}}>
  {/* Header fixe */}
  <div style={{ flexShrink: 0 }}>...</div>

  {/* Contenu scrollable */}
  <div style={{ flex: 1, overflow: 'auto' }}>...</div>
</div>
```

**Fichiers concernés:**
- ✓ SocialScreen.jsx (4 tabs: Salons, Ranking, Jeux, Adoption)

---

### 4️⃣ **ÉCRANS INTERNES** (Appelés DANS un container)
Écrans affichés à l'intérieur d'autres écrans (pas de gestion de viewport propre).

**Pattern à utiliser:**
```jsx
<div style={{
  height: '100%',
  overflow: 'auto',
  background: 'var(--color-beige-light)'
}}>
  {/* Contenu qui remplit le parent */}
</div>
```

**Fichiers concernés:**
- ✓ BarsScreen.jsx (appelé dans SocialScreen)
- ❓ AdoptionScreen.jsx (appelé dans SocialScreen - à vérifier)
- ❓ RankingScreen.jsx (aussi appelé dans SocialScreen - double usage!)

---

### 5️⃣ **ÉCRANS MODAL/OVERLAY**
Écrans en plein écran qui overlay tout (chat, détail bar, etc.)

**Pattern à utiliser:**
```jsx
<div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: '100dvh',
  overflow: 'hidden',
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  background: 'var(--color-beige-light)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000
}}>
  <BackButton onClick={handleBack} />
  {/* Contenu */}
</div>
```

**Fichiers concernés:**
- ❌ ChatScreen.jsx
- ❌ BarDetailScreen.jsx

---

### 6️⃣ **JEUX** (Expérience immersive)
Écrans de jeux avec layout propre.

**Pattern actuel (déjà bon):**
```jsx
<div style={{
  height: '100dvh',
  overflow: 'hidden',
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
  background: 'var(--color-beige-light)',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box'
}}>
  <BackButton onClick={() => setGameScreen(null)} />
  <div style={{ flex: 1, overflow: 'auto', padding: 'var(--spacing-md)' }}>
    {/* Jeu */}
  </div>
</div>
```

**Fichiers concernés:**
- ✓ WhackAMoleGame.jsx
- ✓ PongGame.jsx
- ✓ BrickBreakerGame.jsx
- ✓ MorpionGame.jsx
- ✓ StoryTimeGame.jsx
- ✓ CardGame.jsx

---

## 🔧 Plan d'Action - Uniformisation

### Phase 1: Écrans Secondaires Simples (Priorité 1)
```bash
✗ BadgesScreen.jsx
✗ HomeScreen.jsx
✗ AvatarEditorScreen.jsx
✗ MemoriesScreen.jsx
```
**Action:** Appliquer le pattern "Écrans Secondaires" avec BackButton

---

### Phase 2: Écrans avec Double Usage (Priorité 2)
```bash
✗ RankingScreen.jsx → Utilisé seul ET dans SocialScreen
✗ AdoptionScreen.jsx → Utilisé dans SocialScreen
```
**Action:** Créer une prop `isEmbedded` pour gérer les deux modes:
```jsx
export default function RankingScreen({ isEmbedded = false, onBack }) {
  if (isEmbedded) {
    // Pattern "Écrans Internes" (height: 100%)
    return <div style={{ height: '100%', overflow: 'auto' }}>...</div>;
  }

  // Pattern "Écrans Secondaires" (100dvh + safe-area)
  return <div style={{ minHeight: '100dvh', ... }}>...</div>;
}
```

---

### Phase 3: Écrans Modal/Overlay (Priorité 3)
```bash
✗ ChatScreen.jsx
✗ BarDetailScreen.jsx
✗ LettersScreen.jsx (vérifier si container ou écran normal)
```
**Action:** Appliquer le pattern "Écrans Modal" avec position fixed

---

### Phase 4: Vérification et Tests (Priorité 4)
- Tester sur iOS (notch iPhone)
- Tester sur Android (barre de navigation)
- Tester en PWA (fullscreen)
- Vérifier tous les débordements

---

## 📝 Checklist par Écran

### Pour chaque écran à corriger:
- [ ] Identifier le type d'écran (1-6 ci-dessus)
- [ ] Appliquer le bon pattern
- [ ] Remplacer `100vh` → `100dvh`
- [ ] Ajouter `paddingTop: 'env(safe-area-inset-top)'`
- [ ] Ajouter `paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))'`
- [ ] Ajouter `BackButton` si nécessaire
- [ ] Ajouter `display: 'flex', flexDirection: 'column'`
- [ ] Ajouter `boxSizing: 'border-box'` si layout fixe
- [ ] Tester le scroll
- [ ] Tester sur mobile (via DevTools)

---

## 🎨 Valeurs Standard à Utiliser

```js
// Hauteur viewport
minHeight: '100dvh'  // Dynamic viewport (prend en compte les barres mobiles)
maxHeight: '100dvh'

// Safe area (caméra, notch, barre de navigation)
paddingTop: 'env(safe-area-inset-top)'
paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))'
// 70px = hauteur navigation, + safe-area pour les téléphones

// Layout fixe (pas de scroll principal)
height: '100dvh'
overflow: 'hidden'
paddingBottom: 'calc(60px + env(safe-area-inset-bottom))' // Moins de padding
boxSizing: 'border-box'

// Écran interne (dans un container)
height: '100%'
overflow: 'auto'
```

---

## ⚠️ Erreurs Courantes à Éviter

❌ **NE PAS FAIRE:**
```jsx
height: '100vh'                    // N'inclut pas les barres mobiles
paddingBottom: '80px'              // Valeur fixe, pas de safe-area
minHeight: '100vh'                 // Ancienne version
position: 'absolute'               // Sauf si vraiment nécessaire
```

✅ **À FAIRE:**
```jsx
minHeight: '100dvh'
maxHeight: '100dvh'
paddingTop: 'env(safe-area-inset-top)'
paddingBottom: 'max(80px, calc(70px + env(safe-area-inset-bottom)))'
display: 'flex'
flexDirection: 'column'
```

---

## 🚀 Prochaines Étapes

1. **Commencer par les écrans simples** (BadgesScreen, HomeScreen, etc.)
2. **Tester immédiatement** après chaque changement
3. **Commit par type d'écran** pour faciliter le rollback si besoin
4. **Documenter les cas spéciaux** s'il y en a

---

## 📱 Testing Checklist

Après uniformisation, tester:
- [ ] iPhone avec notch (safe-area-top)
- [ ] Android avec barre de navigation (safe-area-bottom)
- [ ] Rotation paysage/portrait
- [ ] PWA en mode fullscreen
- [ ] Scroll fluide sans débordement
- [ ] Navigation entre écrans sans saut
- [ ] BackButton visible et fonctionnel
- [ ] Pas de double scroll
- [ ] Contenu ne passe pas sous la navigation

---

**Date:** 2025-01-22
**Version:** 1.0
**Status:** 🟡 En cours - 7/17 écrans uniformisés
