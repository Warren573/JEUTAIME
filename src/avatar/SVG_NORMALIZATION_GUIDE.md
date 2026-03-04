# SVG Asset Normalization Guide

## Problem Statement

The avatar system audit identified centering issues caused by **unnormalized SVG assets**. While the CSS rendering contract is correct (absolute positioning with `object-fit: contain` and `object-position: center`), inconsistent SVG internal structure can cause visual misalignment.

## Root Cause

SVG centering issues arise from:

1. **Inconsistent viewBox definitions** - Different assets using different viewBox dimensions
2. **Internal margins** - SVG content not centered within its viewBox
3. **Stroke overflow** - Strokes extending beyond intended bounds without proper padding
4. **Inconsistent coordinate systems** - Some assets using transforms, others not

## Current State

Based on manifest analysis:
- **ViewBox standard:** 512x512px (defined in manifest.json)
- **Stroke width:** 12-20px (thick lines, notion-avatar style)
- **Stroke properties:** `stroke-linecap="round"`, `stroke-linejoin="round"`
- **Color:** Black (#111)
- **Total assets:** 36 SVG files across 6 categories

## Normalization Strategy

### 1. ViewBox Standardization

**Action:** Ensure all SVGs use identical viewBox
```xml
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
```

**Validation script:**
```bash
# Find all SVGs without standard viewBox
grep -L 'viewBox="0 0 512 512"' public/avatar_v1/layers/**/*.svg
```

### 2. Content Centering

**Action:** Verify content is geometrically centered

**Approach:**
- Calculate bounding box of all paths/shapes
- Ensure equal margins on all sides
- Account for stroke width (stroke extends outward)

**Example calculation:**
```
If stroke-width = 16px:
- Visual bounds need 8px padding on each side
- Content area: 512 - (8*2) = 496px
- Center point: 256, 256
```

### 3. Stroke Handling

**Action:** Ensure strokes don't cause overflow

**Techniques:**
- Use `vector-effect="non-scaling-stroke"` for consistent rendering
- Add explicit padding in viewBox if needed
- Consider using `stroke-width` relative to viewBox (e.g., 3% = ~15px at 512px)

### 4. Coordinate System Normalization

**Action:** Remove unnecessary transforms, use raw coordinates

**Bad (transforms):**
```xml
<g transform="translate(50, 50) scale(1.2)">
  <path d="M 0,0 L 100,100" />
</g>
```

**Good (normalized coordinates):**
```xml
<path d="M 60,60 L 180,180" />
```

## Implementation Plan

### Phase 1: Audit (Manual)

For each SVG category:
1. Open in editor (Inkscape, Figma, or text editor)
2. Check viewBox: `viewBox="0 0 512 512"`
3. Measure content bounds (use editor's measure tool)
4. Calculate center offset: `(256 - centerX, 256 - centerY)`
5. Document issues in spreadsheet

**Template:**
```
| File | Current Center | Offset X | Offset Y | Action |
|------|---------------|----------|----------|--------|
| hair_01_buzz.svg | (256, 240) | 0 | +16 | Shift down 16px |
```

### Phase 2: Batch Correction (Script)

**Python script example:**
```python
from xml.etree import ElementTree as ET

def normalize_svg(filepath):
    tree = ET.parse(filepath)
    root = tree.getroot()

    # 1. Standardize viewBox
    root.set('viewBox', '0 0 512 512')

    # 2. Calculate content bounds
    # (requires path parsing - complex)

    # 3. Apply centering transform
    # ...

    tree.write(filepath)
```

### Phase 3: Validation

**Automated tests:**
1. ViewBox validation (regex check)
2. Stroke width consistency check
3. Visual regression test (render all avatars, compare to reference)

**Manual QA:**
1. Render test grid: all combinations visible on single screen
2. Check alignment at multiple sizes (32px, 64px, 128px, 256px)
3. Verify on mobile devices (iOS Safari, Android Chrome)

## Slot-Specific Corrections

If full SVG normalization is not feasible, use **slot transforms** in `AvatarRenderer.jsx`:

```javascript
const SLOT_TRANSFORMS = {
  hair: { translate: [0, -5], scale: 1.0 },   // Hair slightly high
  face: { translate: [0, 0], scale: 1.0 },    // Centered
  eyes: { translate: [0, 2], scale: 0.95 },   // Eyes slightly low
  mouth: { translate: [0, 5], scale: 0.9 },   // Mouth lower
  beard: { translate: [0, 8], scale: 1.0 },   // Beard at bottom
  accessory: { translate: [0, 0], scale: 1.0 }
};
```

**Calibration process:**
1. Render reference avatar at 512px
2. Overlay grid/guides
3. Measure pixel offset for each layer
4. Convert to transform values
5. Test at multiple sizes

## Quick Fixes (Per-Category)

### Hair Assets
**Common issue:** Top-heavy (extends high, not centered vertically)
**Fix:** Shift content down ~10-20px or apply negative Y transform

### Eyes Assets
**Common issue:** Positioned too high on face
**Fix:** Shift down ~5-10px

### Mouth/Nose Assets
**Common issue:** Too close to eyes
**Fix:** Shift down ~10-15px

### Beard Assets
**Common issue:** Floating above chin
**Fix:** Shift down ~15-20px

### Accessories (Earrings, Hat, Mustache)
**Common issue:** Variable positioning (hat too high, earrings offset)
**Fix:** Individual calibration per asset

## Testing Checklist

After normalization:

- [ ] All SVGs have viewBox="0 0 512 512"
- [ ] No SVG has internal transforms
- [ ] Visual center matches geometric center (±5px tolerance)
- [ ] Strokes don't cause overflow at any size
- [ ] Rendering looks good at: 32px, 48px, 64px, 96px, 128px, 200px, 256px
- [ ] Avatar appears centered in circular containers
- [ ] Avatar appears centered in square containers
- [ ] Layers align correctly when stacked
- [ ] No visual gaps between layers (e.g., hair and face)

## Maintenance

**Future asset additions:**
1. Use template SVG with standard viewBox
2. Design content centered at (256, 256)
3. Account for stroke width in bounds
4. Validate with test render before commit

**Tools to consider:**
- SVGO (automated optimization)
- svg-path-editor (manual path editing)
- Inkscape (visual centering guides)
- Figma (design with constraints)

## References

- Current manifest: `/src/avatar/assets/manifest.json`
- Renderer contract: `/src/avatar/AvatarRenderer.jsx` (lines 1-20)
- Slot transforms: `/src/avatar/AvatarRenderer.jsx` SLOT_TRANSFORMS constant
- Asset directory: `/public/avatar_v1/layers/`

## Status

**Current implementation:** Slot transforms set to neutral (no corrections applied)
**Recommended next step:** Phase 1 audit to identify specific offsets needed
**Long-term goal:** Fully normalized SVGs with no transform corrections required
