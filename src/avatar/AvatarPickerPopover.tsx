import React from 'react';
import { getLayerPath } from './avatarManifest.ts';

export default function AvatarPickerPopover({
  isOpen,
  title,
  options,
  selected,
  allowNone = false,
  anchorRect,
  onPick,
  onClose,
  category
}) {
  if (!isOpen) return null;

  const top = anchorRect ? anchorRect.bottom + 10 : 120;
  const left = anchorRect ? Math.max(16, Math.min(anchorRect.left - 20, window.innerWidth - 320)) : 16;

  return (
    <>
      <div className="avatar-maker-overlay" onClick={onClose} />
      <div className="avatar-maker-popover" style={{ top, left }}>
        <div className="avatar-maker-popover-header">
          <strong>{title}</strong>
          <button className="avatar-maker-close" onClick={onClose}>✕</button>
        </div>
        <div className="avatar-maker-grid">
          {allowNone && (
            <button
              className={`avatar-maker-option ${selected === null ? 'active' : ''}`}
              onClick={() => onPick(null)}
            >
              <span style={{ fontSize: 18 }}>∅</span>
            </button>
          )}
          {options.map((id) => (
            <button
              key={id}
              className={`avatar-maker-option ${selected === id ? 'active' : ''}`}
              onClick={() => onPick(id)}
              title={id}
            >
              <img src={getLayerPath(category, id)} alt={id} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
