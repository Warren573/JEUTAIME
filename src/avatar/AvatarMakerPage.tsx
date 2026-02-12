import React, { useEffect, useMemo, useState } from 'react';
import AvatarRenderer from './AvatarRenderer.tsx';
import AvatarPickerPopover from './AvatarPickerPopover.tsx';
import { loadAvatarManifest, getLayerPath } from './avatarManifest.ts';
import { createInitialAvatarSelection, randomAvatarSelection } from './avatarState.ts';
import './avatar-maker.css';

const CATEGORIES = [
  { key: 'head', icon: '🙂', label: 'Visage' },
  { key: 'eyes', icon: '👀', label: 'Yeux' },
  { key: 'nose', icon: '👃', label: 'Nez' },
  { key: 'mouth', icon: '👄', label: 'Bouche' },
  { key: 'hair', icon: '💇', label: 'Cheveux' },
  { key: 'beard', icon: '🧔', label: 'Barbe', optional: true },
  { key: 'accessories', icon: '🎩', label: 'Accessoires', optional: true }
];

const RENDER_ORDER = ['head', 'eyes', 'nose', 'mouth', 'hair', 'beard', 'accessories'];

async function buildComposedSvg(manifest, selection) {
  const fragments = [];
  for (const cat of RENDER_ORDER) {
    const id = selection[cat];
    if (!id) continue;
    const layer = await fetch(getLayerPath(cat, id)).then((r) => r.text());
    const cleaned = layer
      .replace(/<\?xml[^>]*>/g, '')
      .replace(/<!DOCTYPE[^>]*>/g, '')
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '');
    fragments.push(`<g data-layer="${cat}" data-id="${id}">${cleaned}</g>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${manifest.size}" height="${manifest.size}" viewBox="0 0 ${manifest.size} ${manifest.size}" fill="none">${fragments.join('')}</svg>`;
}

async function exportAvatarPng(manifest, selection) {
  const canvas = document.createElement('canvas');
  canvas.width = manifest.size;
  canvas.height = manifest.size;
  const ctx = canvas.getContext('2d');

  for (const cat of RENDER_ORDER) {
    const id = selection[cat];
    if (!id) continue;

    const rawSvg = await fetch(getLayerPath(cat, id)).then((r) => r.text());
    const blob = new Blob([rawSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const img = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = url;
    });

    ctx.drawImage(img, 0, 0, manifest.size, manifest.size);
    URL.revokeObjectURL(url);
  }

  const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const link = document.createElement('a');
  link.href = URL.createObjectURL(pngBlob);
  link.download = `avatar-${Date.now()}.png`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function AvatarMakerPage({ onBack }) {
  const [manifest, setManifest] = useState(null);
  const [selection, setSelection] = useState(null);
  const [picker, setPicker] = useState({ open: false, category: null, anchorRect: null });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadAvatarManifest()
      .then((m) => {
        setManifest(m);
        setSelection(createInitialAvatarSelection(m));
      })
      .catch(() => setFeedback('Erreur de chargement du manifest avatar.'));
  }, []);

  const categoryData = useMemo(
    () => CATEGORIES.find((c) => c.key === picker.category),
    [picker.category]
  );

  if (!manifest || !selection) {
    return <div style={{ padding: 24, color: '#fff' }}>Chargement Avatar Maker...</div>;
  }

  const openCategory = (event, category) => {
    setPicker({ open: true, category, anchorRect: event.currentTarget.getBoundingClientRect() });
  };

  const setOption = (id) => {
    setSelection((prev) => ({ ...prev, [picker.category]: id }));
    setPicker({ open: false, category: null, anchorRect: null });
  };

  const handleRandom = () => {
    setSelection(randomAvatarSelection(manifest));
    setFeedback('Avatar randomisé ✨');
  };

  const handleDownload = async () => {
    await exportAvatarPng(manifest, selection);
    setFeedback('PNG téléchargé ✅');
  };

  const handleCopySvg = async () => {
    const svgText = await buildComposedSvg(manifest, selection);
    await navigator.clipboard.writeText(svgText);
    setFeedback('SVG copié dans le presse-papiers 📋');
  };

  return (
    <div className="avatar-maker-page">
      <div className="avatar-maker-header">
        <button className="avatar-maker-round" onClick={onBack}>←</button>
        <h2>Avatar Maker</h2>
      </div>

      <div className="avatar-maker-preview-wrap">
        <AvatarRenderer selection={selection} size={280} />
      </div>

      <div className="avatar-maker-toolbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`avatar-maker-round ${picker.category === cat.key ? 'active' : ''}`}
            title={cat.label}
            onClick={(event) => openCategory(event, cat.key)}
          >
            <span>{cat.icon}</span>
          </button>
        ))}
      </div>

      <div className="avatar-maker-actions">
        <button className="avatar-maker-btn" onClick={handleRandom}>Aléatoire</button>
        <button className="avatar-maker-btn" onClick={handleDownload}>Télécharger</button>
        <button className="avatar-maker-btn" onClick={handleCopySvg}>Intégrer</button>
      </div>

      {feedback && <p className="avatar-maker-feedback">{feedback}</p>}

      <AvatarPickerPopover
        isOpen={picker.open}
        title={categoryData?.label || ''}
        category={picker.category}
        options={manifest.categories[picker.category] || []}
        selected={selection[picker.category]}
        allowNone={Boolean(categoryData?.optional)}
        anchorRect={picker.anchorRect}
        onPick={setOption}
        onClose={() => setPicker({ open: false, category: null, anchorRect: null })}
      />

    </div>
  );
}
