import React, { useState, useEffect } from 'react';

const GRID_SIZE = 10;
const SHIPS = [
  { id: 'carrier', name: 'Porte-avions', size: 5, emoji: '🚢' },
  { id: 'battleship', name: 'Cuirassé', size: 4, emoji: '⛴️' },
  { id: 'cruiser', name: 'Croiseur', size: 3, emoji: '🛥️' },
  { id: 'submarine', name: 'Sous-marin', size: 3, emoji: '🚤' },
  { id: 'destroyer', name: 'Destroyer', size: 2, emoji: '⛵' }
];

export default function BattleshipGame({ currentUser, opponent, onClose, onGameEnd }) {
  const [phase, setPhase] = useState('placement'); // 'placement', 'battle', 'gameover'
  const [playerGrid, setPlayerGrid] = useState(createEmptyGrid());
  const [opponentGrid, setOpponentGrid] = useState(createEmptyGrid());
  const [playerShots, setPlayerShots] = useState(createEmptyGrid());
  const [opponentShots, setOpponentShots] = useState(createEmptyGrid());
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [shipOrientation, setShipOrientation] = useState('horizontal'); // 'horizontal' or 'vertical'
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [message, setMessage] = useState('Place tes navires sur la grille');
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [hoveredCell, setHoveredCell] = useState(null);
  const [winner, setWinner] = useState(null);

  function createEmptyGrid() {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  }

  // Initialize opponent grid with random ship placement
  useEffect(() => {
    if (phase === 'battle' && opponentGrid.every(row => row.every(cell => cell === null))) {
      const grid = createEmptyGrid();
      SHIPS.forEach(ship => {
        let placed = false;
        while (!placed) {
          const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
          const row = Math.floor(Math.random() * GRID_SIZE);
          const col = Math.floor(Math.random() * GRID_SIZE);
          if (canPlaceShip(grid, row, col, ship.size, orientation)) {
            placeShipOnGrid(grid, row, col, ship.size, orientation, ship.id);
            placed = true;
          }
        }
      });
      setOpponentGrid(grid);
    }
  }, [phase]);

  function canPlaceShip(grid, row, col, size, orientation) {
    if (orientation === 'horizontal') {
      if (col + size > GRID_SIZE) return false;
      for (let i = 0; i < size; i++) {
        if (grid[row][col + i] !== null) return false;
        // Check adjacent cells
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const newRow = row + dr;
            const newCol = col + i + dc;
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
              if (grid[newRow][newCol] !== null) return false;
            }
          }
        }
      }
    } else {
      if (row + size > GRID_SIZE) return false;
      for (let i = 0; i < size; i++) {
        if (grid[row + i][col] !== null) return false;
        // Check adjacent cells
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const newRow = row + i + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
              if (grid[newRow][newCol] !== null) return false;
            }
          }
        }
      }
    }
    return true;
  }

  function placeShipOnGrid(grid, row, col, size, orientation, shipId) {
    if (orientation === 'horizontal') {
      for (let i = 0; i < size; i++) {
        grid[row][col + i] = shipId;
      }
    } else {
      for (let i = 0; i < size; i++) {
        grid[row + i][col] = shipId;
      }
    }
  }

  function handleCellClick(row, col) {
    if (phase === 'placement') {
      handleShipPlacement(row, col);
    } else if (phase === 'battle' && isPlayerTurn) {
      handleAttack(row, col);
    }
  }

  function handleShipPlacement(row, col) {
    const ship = SHIPS[currentShipIndex];
    const newGrid = playerGrid.map(r => [...r]);

    if (canPlaceShip(newGrid, row, col, ship.size, shipOrientation)) {
      placeShipOnGrid(newGrid, row, col, ship.size, shipOrientation, ship.id);
      setPlayerGrid(newGrid);

      if (currentShipIndex < SHIPS.length - 1) {
        setCurrentShipIndex(currentShipIndex + 1);
        setMessage(`Place ton ${SHIPS[currentShipIndex + 1].name} (${SHIPS[currentShipIndex + 1].size} cases)`);
      } else {
        setPhase('battle');
        setMessage('À toi de jouer ! Clique pour attaquer');
      }
    } else {
      setMessage('❌ Position invalide ! Essaie ailleurs');
      setTimeout(() => {
        setMessage(`Place ton ${ship.name} (${ship.size} cases)`);
      }, 1500);
    }
  }

  function handleAttack(row, col) {
    if (playerShots[row][col] !== null) {
      setMessage('⚠️ Tu as déjà tiré ici !');
      return;
    }

    const newShots = playerShots.map(r => [...r]);
    const hit = opponentGrid[row][col] !== null;
    newShots[row][col] = hit ? 'hit' : 'miss';
    setPlayerShots(newShots);

    if (hit) {
      const newScore = { ...score, player: score.player + 1 };
      setScore(newScore);
      setMessage('💥 Touché !');

      // Check if all opponent ships are sunk
      if (checkAllShipsSunk(opponentGrid, newShots)) {
        setWinner('player');
        setPhase('gameover');
        setMessage('🏆 VICTOIRE ! Tous les navires ennemis coulés !');
        if (onGameEnd) onGameEnd('player', newScore);
        return;
      }
    } else {
      setMessage('💦 Plouf ! Raté...');
    }

    // Opponent turn after a delay
    setIsPlayerTurn(false);
    setTimeout(() => opponentAttack(), 1500);
  }

  function opponentAttack() {
    let row, col;
    let validShot = false;

    // AI: Random shooting
    while (!validShot) {
      row = Math.floor(Math.random() * GRID_SIZE);
      col = Math.floor(Math.random() * GRID_SIZE);
      if (opponentShots[row][col] === null) {
        validShot = true;
      }
    }

    const newShots = opponentShots.map(r => [...r]);
    const hit = playerGrid[row][col] !== null;
    newShots[row][col] = hit ? 'hit' : 'miss';
    setOpponentShots(newShots);

    if (hit) {
      const newScore = { ...score, opponent: score.opponent + 1 };
      setScore(newScore);
      setMessage(`💥 L'adversaire t'a touché en ${String.fromCharCode(65 + row)}${col + 1} !`);

      // Check if all player ships are sunk
      if (checkAllShipsSunk(playerGrid, newShots)) {
        setWinner('opponent');
        setPhase('gameover');
        setMessage('😞 DÉFAITE ! Tous tes navires ont coulé...');
        if (onGameEnd) onGameEnd('opponent', newScore);
        return;
      }
    } else {
      setMessage('💦 L\'adversaire a raté son tir !');
    }

    setTimeout(() => {
      setIsPlayerTurn(true);
      setMessage('À toi de jouer !');
    }, 1500);
  }

  function checkAllShipsSunk(grid, shots) {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] !== null && shots[row][col] !== 'hit') {
          return false;
        }
      }
    }
    return true;
  }

  function toggleOrientation() {
    setShipOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  }

  function resetShips() {
    setPlayerGrid(createEmptyGrid());
    setCurrentShipIndex(0);
    setMessage(`Place ton ${SHIPS[0].name} (${SHIPS[0].size} cases)`);
  }

  function getPreviewCells(row, col) {
    if (phase !== 'placement') return [];
    const ship = SHIPS[currentShipIndex];
    const cells = [];

    if (shipOrientation === 'horizontal') {
      for (let i = 0; i < ship.size; i++) {
        if (col + i < GRID_SIZE) {
          cells.push({ row, col: col + i });
        }
      }
    } else {
      for (let i = 0; i < ship.size; i++) {
        if (row + i < GRID_SIZE) {
          cells.push({ row: row + i, col });
        }
      }
    }

    return cells;
  }

  function renderCell(row, col, isPlayerGrid) {
    const grid = isPlayerGrid ? playerGrid : opponentGrid;
    const shots = isPlayerGrid ? opponentShots : playerShots;
    const cellValue = grid[row][col];
    const shotValue = shots[row][col];

    let content = '';
    let bgColor = 'var(--color-beige-light)';
    let borderColor = 'var(--color-brown-light)';

    if (phase === 'placement' && isPlayerGrid) {
      if (cellValue) {
        const ship = SHIPS.find(s => s.id === cellValue);
        content = ship?.emoji || '🟦';
        bgColor = '#3498DB';
      }

      // Preview
      if (hoveredCell && hoveredCell.row === row && hoveredCell.col === col) {
        const previewCells = getPreviewCells(row, col);
        const isValidPlacement = canPlaceShip(playerGrid, row, col, SHIPS[currentShipIndex].size, shipOrientation);

        if (previewCells.some(c => c.row === row && c.col === col)) {
          bgColor = isValidPlacement ? 'rgba(52, 152, 219, 0.3)' : 'rgba(231, 76, 60, 0.3)';
        }
      }
    } else if (phase === 'battle' || phase === 'gameover') {
      if (isPlayerGrid) {
        // Show player's ships and opponent hits
        if (cellValue) {
          const ship = SHIPS.find(s => s.id === cellValue);
          content = ship?.emoji || '🟦';
          bgColor = shotValue === 'hit' ? '#E74C3C' : '#3498DB';
        }
        if (shotValue === 'miss') {
          content = '💦';
          bgColor = '#95A5A6';
        }
      } else {
        // Show only hits and misses on opponent grid
        if (shotValue === 'hit') {
          content = '💥';
          bgColor = '#E74C3C';
        } else if (shotValue === 'miss') {
          content = '💦';
          bgColor = '#95A5A6';
        }
      }
    }

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => {
          if (phase === 'placement' && isPlayerGrid) {
            handleCellClick(row, col);
          } else if (phase === 'battle' && !isPlayerGrid) {
            handleCellClick(row, col);
          }
        }}
        onMouseEnter={() => isPlayerGrid && phase === 'placement' && setHoveredCell({ row, col })}
        onMouseLeave={() => isPlayerGrid && phase === 'placement' && setHoveredCell(null)}
        style={{
          width: '100%',
          aspectRatio: '1',
          background: bgColor,
          border: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          cursor: phase === 'battle' && !isPlayerGrid && isPlayerTurn && !shotValue ? 'crosshair' :
                  phase === 'placement' && isPlayerGrid ? 'pointer' : 'default',
          transition: 'all 0.2s',
          position: 'relative'
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 'var(--spacing-md)',
      overflow: 'auto'
    }}>
      <div style={{
        background: 'var(--color-cream)',
        borderRadius: 'var(--border-radius-xl)',
        padding: 'var(--spacing-lg)',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '95vh',
        overflow: 'auto',
        boxShadow: 'var(--shadow-xl)',
        border: '4px solid var(--color-brown-dark)',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#E74C3C',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            zIndex: 1
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--spacing-xs) 0'
          }}>
            ⚓ Bataille Navale
          </h2>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            fontWeight: '600',
            marginBottom: 'var(--spacing-xs)'
          }}>
            {phase === 'placement' ? '📍 Phase de placement' :
             phase === 'battle' ? '⚔️ En combat' : '🏁 Partie terminée'}
          </div>
          <div style={{
            padding: 'var(--spacing-sm)',
            background: phase === 'gameover' ?
              (winner === 'player' ? '#4CAF50' : '#E74C3C') :
              'var(--color-beige-light)',
            borderRadius: 'var(--border-radius-md)',
            border: '2px solid var(--color-brown-light)',
            color: phase === 'gameover' ? 'white' : 'var(--color-text-primary)',
            fontWeight: 'bold'
          }}>
            {message}
          </div>
        </div>

        {/* Placement controls */}
        {phase === 'placement' && (
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-md)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={toggleOrientation}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'linear-gradient(135deg, #3498DB, #2980B9)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              🔄 Rotation ({shipOrientation === 'horizontal' ? 'Horizontal' : 'Vertical'})
            </button>
            <button
              onClick={resetShips}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              🔄 Recommencer
            </button>
          </div>
        )}

        {/* Ships to place */}
        {phase === 'placement' && (
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-md)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {SHIPS.map((ship, index) => (
              <div
                key={ship.id}
                style={{
                  padding: 'var(--spacing-xs)',
                  background: index < currentShipIndex ? '#4CAF50' :
                             index === currentShipIndex ? '#3498DB' :
                             'var(--color-beige-light)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid var(--color-brown-light)',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  minWidth: '80px',
                  color: index <= currentShipIndex ? 'white' : 'var(--color-text-primary)'
                }}
              >
                <div>{ship.emoji}</div>
                <div style={{ fontWeight: '600', fontSize: '0.7rem' }}>{ship.name}</div>
                <div style={{ fontSize: '0.7rem' }}>{ship.size} cases</div>
              </div>
            ))}
          </div>
        )}

        {/* Score */}
        {(phase === 'battle' || phase === 'gameover') && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: 'var(--spacing-md)',
            padding: 'var(--spacing-sm)',
            background: 'var(--color-beige-light)',
            borderRadius: 'var(--border-radius-md)',
            border: '2px solid var(--color-brown-light)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {currentUser?.name || 'Toi'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
                {score.player} 💥
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', color: 'var(--color-text-light)' }}>VS</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {opponent?.name || 'Adversaire'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#E74C3C' }}>
                {score.opponent} 💥
              </div>
            </div>
          </div>
        )}

        {/* Grids */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: phase === 'placement' ? '1fr' : '1fr 1fr',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}>
          {/* Player grid */}
          {(phase === 'placement' || phase === 'battle' || phase === 'gameover') && (
            <div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-xs)',
                textAlign: 'center',
                color: 'var(--color-text-primary)'
              }}>
                {phase === 'placement' ? '📍 Place tes navires' : '🛡️ Ta flotte'}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gap: '2px',
                background: 'var(--color-brown-dark)',
                padding: '2px',
                borderRadius: 'var(--border-radius-md)'
              }}>
                {playerGrid.map((row, rowIndex) =>
                  row.map((_, colIndex) => renderCell(rowIndex, colIndex, true))
                )}
              </div>
            </div>
          )}

          {/* Opponent grid (only in battle phase) */}
          {(phase === 'battle' || phase === 'gameover') && (
            <div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-xs)',
                textAlign: 'center',
                color: 'var(--color-text-primary)'
              }}>
                🎯 Flotte ennemie
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gap: '2px',
                background: 'var(--color-brown-dark)',
                padding: '2px',
                borderRadius: 'var(--border-radius-md)'
              }}>
                {opponentGrid.map((row, rowIndex) =>
                  row.map((_, colIndex) => renderCell(rowIndex, colIndex, false))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          justifyContent: 'center',
          fontSize: '0.8rem',
          color: 'var(--color-text-secondary)',
          flexWrap: 'wrap'
        }}>
          {(phase === 'battle' || phase === 'gameover') && (
            <>
              <div>💥 = Touché</div>
              <div>💦 = Raté</div>
              <div>🟦 = Navire</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
