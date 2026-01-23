import React, { useState } from 'react';

export default function Games() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    desc: '',
    icon: '',
    difficulty: 'medium',
    minCoins: '',
    maxCoins: '',
    category: ''
  });

  // LES 6 JEUX RÉELS DE L'APP (correspondance exacte avec App.jsx)
  const games = [
    {
      id: 1,
      icon: '🏓',
      name: 'Pong',
      desc: 'Classique du jeu vidéo',
      plays: 9876,
      avgCoins: 25,
      minCoins: 10,
      maxCoins: 50,
      difficulty: 'easy',
      category: 'arcade',
      active: true,
      created: '01/09/2024'
    },
    {
      id: 2,
      icon: '🔨',
      name: 'Tape Taupe',
      desc: 'Réflexes et rapidité',
      plays: 12456,
      avgCoins: 38,
      minCoins: 15,
      maxCoins: 80,
      difficulty: 'easy',
      category: 'arcade',
      active: true,
      created: '01/09/2024'
    },
    {
      id: 3,
      icon: '🧱',
      name: 'Casse-Briques',
      desc: 'Détruire tous les blocs',
      plays: 4567,
      avgCoins: 32,
      minCoins: 15,
      maxCoins: 70,
      difficulty: 'medium',
      category: 'arcade',
      active: true,
      created: '10/09/2024'
    },
    {
      id: 4,
      icon: '❌',
      name: 'Morpion',
      desc: 'Stratégie contre IA',
      plays: 5432,
      avgCoins: 18,
      minCoins: 5,
      maxCoins: 40,
      difficulty: 'medium',
      category: 'puzzle',
      active: true,
      created: '01/09/2024'
    },
    {
      id: 5,
      icon: '🎴',
      name: 'Jeu des Cartes',
      desc: 'Mémoire et stratégie',
      plays: 8234,
      avgCoins: 52,
      minCoins: 25,
      maxCoins: 120,
      difficulty: 'hard',
      category: 'puzzle',
      active: true,
      created: '15/09/2024'
    },
    {
      id: 6,
      icon: '📖',
      name: 'StoryTime',
      desc: 'Histoire interactive',
      plays: 3456,
      avgCoins: 65,
      minCoins: 30,
      maxCoins: 150,
      difficulty: 'easy',
      category: 'story',
      active: true,
      created: '20/09/2024'
    }
  ];

  const handleCreateGame = () => {
    console.log('Créer jeu:', newGame);
    setShowCreateModal(false);
    setNewGame({ name: '', desc: '', icon: '', difficulty: 'medium', minCoins: '', maxCoins: '', category: '' });
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#E91E63';
      default: return '#666';
    }
  };

  const totalPlays = games.reduce((acc, g) => acc + g.plays, 0);
  const totalCoinsDistributed = games.reduce((acc, g) => acc + (g.plays * g.avgCoins), 0);

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Gestion des Jeux</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Créer et gérer les mini-jeux de l'application</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ➕ Nouveau Jeu
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Total jeux</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#9C27B0' }}>{games.length}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Actifs</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>{games.filter(g => g.active).length}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Parties jouées</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2196F3' }}>{totalPlays.toLocaleString()}</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Pièces distribuées</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFD700' }}>{totalCoinsDistributed.toLocaleString()}</div>
        </div>
      </div>

      {/* Games grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {games.map(game => (
          <div key={game.id} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px', border: '1px solid #333', position: 'relative' }}>
            {/* Status badge */}
            <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                background: game.active ? '#4CAF5022' : '#66666622',
                color: game.active ? '#4CAF50' : '#666'
              }}>
                {game.active ? '✓ Actif' : '✗ Inactif'}
              </span>
            </div>

            {/* Icon and title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ fontSize: '48px' }}>{game.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>{game.name}</h3>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{game.desc}</p>
              </div>
            </div>

            {/* Difficulty badge */}
            <div style={{ marginBottom: '15px' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                background: `${getDifficultyColor(game.difficulty)}22`,
                color: getDifficultyColor(game.difficulty),
                textTransform: 'capitalize'
              }}>
                🎯 {game.difficulty === 'easy' ? 'Facile' : game.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
              </span>
              <span style={{
                marginLeft: '8px',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                background: '#667eea22',
                color: '#667eea',
                textTransform: 'capitalize'
              }}>
                📁 {game.category}
              </span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#2196F3' }}>{game.plays.toLocaleString()}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>Parties jouées</div>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFD700' }}>{game.avgCoins}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>Moy. pièces</div>
              </div>
            </div>

            {/* Coin range */}
            <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '10px', marginBottom: '15px' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Récompenses</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFD700' }}>
                {game.minCoins} - {game.maxCoins} 🪙
              </div>
            </div>

            {/* Meta */}
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '15px' }}>
              Créé le {game.created}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#2196F3', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                ✏️ Modifier
              </button>
              <button style={{ flex: 1, padding: '10px', background: game.active ? '#FF9800' : '#4CAF50', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                {game.active ? '⏸️ Désactiver' : '▶️ Activer'}
              </button>
              <button style={{ padding: '10px 15px', background: '#dc3545', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '500px', border: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 20px 0' }}>Créer un nouveau Jeu</h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Nom du jeu
              </label>
              <input
                type="text"
                value={newGame.name}
                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                placeholder="Ex: Jeu du Memory"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Description
              </label>
              <input
                type="text"
                value={newGame.desc}
                onChange={(e) => setNewGame({ ...newGame, desc: e.target.value })}
                placeholder="Ex: Trouve les paires"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Icône (emoji)
              </label>
              <input
                type="text"
                value={newGame.icon}
                onChange={(e) => setNewGame({ ...newGame, icon: e.target.value })}
                placeholder="Ex: 🧠"
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Catégorie
              </label>
              <select
                value={newGame.category}
                onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="arcade">Arcade</option>
                <option value="puzzle">Puzzle</option>
                <option value="rpg">RPG</option>
                <option value="story">Histoire</option>
                <option value="strategy">Stratégie</option>
                <option value="action">Action</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                Difficulté
              </label>
              <select
                value={newGame.difficulty}
                onChange={(e) => setNewGame({ ...newGame, difficulty: e.target.value })}
                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Pièces min
                </label>
                <input
                  type="number"
                  value={newGame.minCoins}
                  onChange={(e) => setNewGame({ ...newGame, minCoins: e.target.value })}
                  placeholder="10"
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#ccc' }}>
                  Pièces max
                </label>
                <input
                  type="number"
                  value={newGame.maxCoins}
                  onChange={(e) => setNewGame({ ...newGame, maxCoins: e.target.value })}
                  placeholder="100"
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ flex: 1, padding: '12px', background: '#666', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateGame}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
