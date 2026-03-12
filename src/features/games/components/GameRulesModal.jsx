import React from 'react';

const RULES = {
  reactivity: {
    icon: '⚡',
    title: 'Tape Taupe',
    mode: 'Solo',
    objective: 'Tape le plus de taupes possible en 30 secondes !',
    rules: [
      'Une grille de 16 trous apparaît (4×4).',
      'Des taupes surgissent aléatoirement — jusqu\'à 2 en même temps.',
      'Tape une taupe avant qu\'elle disparaisse pour marquer 1 point.',
      'Cliquer sur un trou vide met fin à la partie immédiatement.',
      'Les taupes apparaissent de plus en plus vite au fil des points.',
    ],
    rewards: ['+2 points et +5 pièces par taupe touchée'],
    tip: 'Ne clique jamais à côté ! Mieux vaut laisser passer une taupe que de cliquer à vide.',
  },
  pong: {
    icon: '🎮',
    title: 'Pong',
    mode: '2 joueurs (vs IA)',
    objective: 'Premier à marquer 5 points gagne !',
    rules: [
      'Tu contrôles la raquette de gauche.',
      'L\'IA contrôle la raquette de droite.',
      'Renvoie la balle sans la laisser passer ta raquette.',
      'Chaque échange accélère légèrement la balle (max ×3).',
      'Un point est marqué quand la balle dépasse une raquette.',
    ],
    controls: [
      { device: 'Clavier', action: 'Flèches ↑ ↓ pour déplacer ta raquette' },
      { device: 'Mobile', action: 'Glisse le doigt verticalement' },
    ],
    rewards: ['+20 points et +50 pièces pour une victoire', 'Badge Guerrier après 5 victoires'],
    tip: 'Frappe la balle avec le bord de ta raquette pour lui donner de l\'angle.',
  },
  brickbreaker: {
    icon: '🧱',
    title: 'Casse Brique',
    mode: 'Solo',
    objective: 'Détruis toutes les briques sans perdre toutes tes vies !',
    rules: [
      '40 briques disposées en 5 rangées de 8.',
      'Déplace ta raquette en bas pour renvoyer la balle.',
      'Chaque brique détruite = 10 points.',
      'Tu disposes de 3 vies — tu en perds une si la balle touche le bas.',
      'Détruis toutes les briques pour gagner la partie.',
    ],
    controls: [
      { device: 'Clavier', action: 'Flèches ← → pour déplacer la raquette' },
      { device: 'Mobile', action: 'Glisse le doigt horizontalement' },
    ],
    rewards: ['+50 pièces de base + 1 pièce par brique détruite', 'Badge Gamer après 10 victoires'],
    tip: 'Frappe la balle avec le coin de la raquette pour atteindre les angles difficiles.',
  },
  morpion: {
    icon: '⭕',
    title: 'Morpion',
    mode: '2 joueurs (vs IA)',
    objective: 'Aligne 3 symboles identiques pour gagner !',
    rules: [
      'Tu joues les ✕, l\'IA joue les ○.',
      'Clique sur une case vide pour y placer ton symbole.',
      'L\'IA répond automatiquement après ton tour.',
      'Aligne 3 symboles en ligne, colonne ou diagonale pour gagner.',
      'Si toutes les cases sont remplies sans alignement : match nul.',
    ],
    rewards: ['+50 points et +25 pièces pour une victoire', 'Badge Gamer après 10 victoires'],
    tip: 'Commence par le centre ou les coins pour maximiser tes chances.',
  },
  storytime: {
    icon: '📖',
    title: "Continue l'histoire",
    mode: 'Solo, 2 joueurs ou multijoueurs',
    objective: 'Écris une histoire à plusieurs, une phrase à la fois !',
    rules: [
      "L'histoire commence par « Il était une fois… »",
      'Chaque joueur ajoute une phrase à son tour.',
      'Les phrases s\'enchaînent pour former une histoire commune.',
      'Pas de limite de temps ni de tours — l\'histoire peut durer indéfiniment.',
      "Sois créatif et suis le fil de l'histoire des autres joueurs !",
    ],
    rewards: ['Le plaisir de créer ensemble — sans limite !'],
    tip: "Relis les dernières phrases avant d'écrire pour garder une cohérence.",
  },
  cards: {
    icon: '🎴',
    title: 'Jeu des Cartes',
    mode: 'Solo',
    objective: 'Révèle des cartes et accumule un maximum de pièces !',
    rules: [
      '10 cartes sont posées face cachée en 2 rangées de 5.',
      'Retourne une carte à la fois pour découvrir ce qu\'elle contient :',
      '❤️ Cœur (×3) : +15 pièces',
      '♣️ Trèfle (×2) : tes gains actuels sont divisés par 2',
      '♠️ Pique (×1) : tu perds toutes tes pièces accumulées',
      '♦️ Carreau (×4) : un indice te révèle une information sur les cartes restantes',
      'Après chaque carte, tu peux arrêter et encaisser tes gains.',
      'Option finale : parier que tous les cœurs ont été retournés — doublant tes gains si vrai, les perdant tous si faux.',
    ],
    rewards: ['Tes pièces finales = tes gains encaissés', 'Tes points gagnés = le même montant en points'],
    tip: 'Arrête-toi tôt si tu as de bons gains — le Pique peut tout effacer en un clic !',
  },
};

export default function GameRulesModal({ gameId, onClose, onPlay }) {
  const rules = RULES[gameId];
  if (!rules) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-bg, #fff8f0)',
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px 20px 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* Handle bar */}
        <div style={{ width: '40px', height: '4px', background: 'var(--color-brown-light, #d4b89a)', borderRadius: '2px', margin: '0 auto 20px' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{rules.icon}</div>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: 'var(--color-text-primary, #3d2b1f)' }}>{rules.title}</h2>
          <span style={{
            display: 'inline-block', background: 'var(--color-cream, #fdf0e0)',
            border: '1px solid var(--color-brown-light, #d4b89a)',
            borderRadius: '20px', padding: '3px 12px',
            fontSize: '11px', color: 'var(--color-text-secondary, #8b6f5e)', fontWeight: '500',
          }}>{rules.mode}</span>
        </div>

        {/* Objectif */}
        <div style={{
          background: 'linear-gradient(135deg, #fff3e0, #fce4ec)',
          borderRadius: '14px', padding: '14px 16px', marginBottom: '16px',
          border: '1px solid #f8bbd0',
        }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#ad1457', textAlign: 'center' }}>
            🎯 {rules.objective}
          </p>
        </div>

        {/* Règles */}
        <Section title="Règles">
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rules.rules.map((r, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--color-text-primary, #3d2b1f)', lineHeight: '1.5' }}>{r}</li>
            ))}
          </ol>
        </Section>

        {/* Contrôles */}
        {rules.controls && (
          <Section title="Contrôles">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rules.controls.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{
                    background: 'var(--color-brown-light, #d4b89a)', color: '#fff',
                    borderRadius: '8px', padding: '2px 8px', fontSize: '11px',
                    fontWeight: '600', flexShrink: 0, marginTop: '1px',
                  }}>{c.device}</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-primary, #3d2b1f)', lineHeight: '1.5' }}>{c.action}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Récompenses */}
        <Section title="Récompenses">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {rules.rewards.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🪙</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-primary, #3d2b1f)', lineHeight: '1.5' }}>{r}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Astuce */}
        {rules.tip && (
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
            borderRadius: '14px', padding: '14px 16px', marginBottom: '20px',
            border: '1px solid #c8e6c9',
          }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#2e7d32', lineHeight: '1.5' }}>
              <strong>Astuce :</strong> {rules.tip}
            </p>
          </div>
        )}

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '13px', borderRadius: '14px',
              border: '2px solid var(--color-brown-light, #d4b89a)',
              background: 'transparent', cursor: 'pointer',
              fontSize: '14px', fontWeight: '600',
              color: 'var(--color-text-secondary, #8b6f5e)',
            }}
          >Fermer</button>
          <button
            onClick={onPlay}
            style={{
              flex: 2, padding: '13px', borderRadius: '14px',
              border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #e91e63, #c2185b)',
              fontSize: '14px', fontWeight: '700', color: '#fff',
            }}
          >Jouer</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{
        margin: '0 0 10px', fontSize: '12px', fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: '0.8px',
        color: 'var(--color-text-secondary, #8b6f5e)',
      }}>{title}</h3>
      <div style={{
        background: 'var(--color-cream, #fdf0e0)',
        borderRadius: '12px', padding: '12px 14px',
        border: '1px solid var(--color-brown-light, #d4b89a)',
      }}>
        {children}
      </div>
    </div>
  );
}
