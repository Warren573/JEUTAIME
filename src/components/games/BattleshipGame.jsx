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
      setMessage('🔥 Touché ! Navire ennemi en feu !');

      // Check if all opponent ships are sunk
      if (checkAllShipsSunk(opponentGrid, newShots)) {
        setWinner('player');
        setPhase('gameover');
        setMessage('🏆 VICTOIRE ! Toute la flotte ennemie a coulé ! ⚓');
        if (onGameEnd) onGameEnd('player', newScore);
        return;
      }
    } else {
      setMessage('🌊 Dans l\'eau ! Tire ailleurs...');
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
      setMessage(`🔥 Touché ! L'ennemi a détruit un de tes navires !`);

      // Check if all player ships are sunk
      if (checkAllShipsSunk(playerGrid, newShots)) {
        setWinner('opponent');
        setPhase('gameover');
        setMessage('💀 DÉFAITE ! Toute ta flotte a coulé... ⚓');
        if (onGameEnd) onGameEnd('opponent', newScore);
        return;
      }
    } else {
      setMessage('🌊 L\'ennemi a raté ! Ton tour !');
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
    let bgColor = '#E3F2FD'; // Eau claire par défaut
    let borderColor = '#90CAF9';
    let boxShadow = 'inset 0 0 0 1px rgba(33, 150, 243, 0.3)';

    if (phase === 'placement' && isPlayerGrid) {
      if (cellValue) {
        content = '🚢';
        bgColor = '#2196F3';
        borderColor = '#1976D2';
        boxShadow = '0 2px 4px rgba(33, 150, 243, 0.4)';
      } else {
        bgColor = '#B3E5FC';
      }

      // Preview
      if (hoveredCell && hoveredCell.row === row && hoveredCell.col === col) {
        const previewCells = getPreviewCells(row, col);
        const isValidPlacement = canPlaceShip(playerGrid, row, col, SHIPS[currentShipIndex].size, shipOrientation);

        if (previewCells.some(c => c.row === row && c.col === col)) {
          bgColor = isValidPlacement ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)';
          borderColor = isValidPlacement ? '#4CAF50' : '#F44336';
        }
      }
    } else if (phase === 'battle' || phase === 'gameover') {
      if (isPlayerGrid) {
        // Show player's ships and opponent hits
        if (shotValue === 'hit') {
          content = '🔥';
          bgColor = '#FF5722';
          borderColor = '#D84315';
          boxShadow = '0 0 12px rgba(255, 87, 34, 0.6), inset 0 0 8px rgba(0, 0, 0, 0.3)';
        } else if (shotValue === 'miss') {
          content = '🌊';
          bgColor = '#00BCD4';
          borderColor = '#0097A7';
        } else if (cellValue) {
          content = '🚢';
          bgColor = '#2196F3';
          borderColor = '#1976D2';
        }
      } else {
        // Show only hits and misses on opponent grid
        if (shotValue === 'hit') {
          content = '🔥';
          bgColor = '#FF5722';
          borderColor = '#D84315';
          boxShadow = '0 0 12px rgba(255, 87, 34, 0.6), inset 0 0 8px rgba(0, 0, 0, 0.3)';
        } else if (shotValue === 'miss') {
          content = '🌊';
          bgColor = '#00BCD4';
          borderColor = '#0097A7';
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
        onMouseEnter={(e) => {
          if (isPlayerGrid && phase === 'placement') {
            setHoveredCell({ row, col });
          }
          if (phase === 'battle' && !isPlayerGrid && isPlayerTurn && !shotValue) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.zIndex = '10';
          }
        }}
        onMouseLeave={(e) => {
          if (isPlayerGrid && phase === 'placement') {
            setHoveredCell(null);
          }
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.zIndex = '1';
        }}
        style={{
          width: '100%',
          aspectRatio: '1',
          background: bgColor,
          border: `2px solid ${borderColor}`,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: content ? '0.9rem' : '0',
          cursor: phase === 'battle' && !isPlayerGrid && isPlayerTurn && !shotValue ? 'crosshair' :
                  phase === 'placement' && isPlayerGrid ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          position: 'relative',
          boxShadow: boxShadow
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
      background: 'linear-gradient(180deg, rgba(13, 71, 161, 0.95) 0%, rgba(1, 87, 155, 0.95) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '10px',
      overflow: 'auto'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)',
        borderRadius: '20px',
        padding: '12px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '98vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        border: '4px solid #1976D2',
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
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            color: '#0D47A1',
            margin: '0 0 6px 0',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            ⚓ Bataille Navale ⚓
          </h2>
          <div style={{
            fontSize: '0.8rem',
            color: '#1565C0',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            {phase === 'placement' ? '📍 PLACEMENT DES NAVIRES' :
             phase === 'battle' ? '⚔️ COMBAT NAVAL' : '🏁 BATAILLE TERMINÉE'}
          </div>
          <div style={{
            padding: '8px 12px',
            background: phase === 'gameover' ?
              (winner === 'player' ? 'linear-gradient(135deg, #4CAF50, #2E7D32)' : 'linear-gradient(135deg, #F44336, #C62828)') :
              'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
            borderRadius: '12px',
            border: phase === 'gameover' ? 'none' : '2px solid #FF9800',
            color: phase === 'gameover' ? 'white' : '#E65100',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            boxShadow: phase === 'gameover' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 6px rgba(255,152,0,0.3)'
          }}>
            {message}
          </div>
        </div>

        {/* Placement controls */}
        {phase === 'placement' && (
          <div style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={toggleOrientation}
              style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.75rem',
                boxShadow: '0 2px 6px rgba(33,150,243,0.4)'
              }}
            >
              🔄 {shipOrientation === 'horizontal' ? '→' : '↓'}
            </button>
            <button
              onClick={resetShips}
              style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #F44336, #C62828)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.75rem',
                boxShadow: '0 2px 6px rgba(244,67,54,0.4)'
              }}
            >
              ↺ Reset
            </button>
          </div>
        )}

        {/* Ships to place */}
        {phase === 'placement' && (
          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {SHIPS.map((ship, index) => (
              <div
                key={ship.id}
                style={{
                  padding: '4px 6px',
                  background: index < currentShipIndex ? 'linear-gradient(135deg, #4CAF50, #2E7D32)' :
                             index === currentShipIndex ? 'linear-gradient(135deg, #FF9800, #F57C00)' :
                             '#E0E0E0',
                  borderRadius: '8px',
                  border: index === currentShipIndex ? '2px solid #FFA726' : 'none',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  minWidth: '65px',
                  color: index <= currentShipIndex ? 'white' : '#757575',
                  fontWeight: '600',
                  boxShadow: index === currentShipIndex ? '0 2px 8px rgba(255,152,0,0.5)' : 'none'
                }}
              >
                <div style={{ fontSize: '1rem' }}>{ship.emoji}</div>
                <div style={{ fontSize: '0.65rem' }}>{ship.size}×</div>
              </div>
            ))}
          </div>
        )}

        {/* Score */}
        {(phase === 'battle' || phase === 'gameover') && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '8px',
            background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
            borderRadius: '12px',
            border: '2px solid #FF9800',
            boxShadow: '0 2px 6px rgba(255,152,0,0.3)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#1976D2', fontWeight: '600' }}>
                {currentUser?.name || 'TOI'}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2196F3' }}>
                {score.player} 🔥
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', color: '#FF9800', fontWeight: 'bold' }}>VS</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#C62828', fontWeight: '600' }}>
                {opponent?.name || 'ENNEMI'}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#F44336' }}>
                {score.opponent} 🔥
              </div>
            </div>
          </div>
        )}

        {/* Grids */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '10px'
        }}>
          {/* Opponent grid (only in battle phase) - FIRST */}
          {(phase === 'battle' || phase === 'gameover') && (
            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                marginBottom: '4px',
                textAlign: 'center',
                color: '#C62828',
                letterSpacing: '0.5px'
              }}>
                🎯 FLOTTE ENNEMIE
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gap: '1px',
                background: '#C62828',
                padding: '3px',
                borderRadius: '8px',
                boxShadow: '0 3px 8px rgba(198,40,40,0.4)'
              }}>
                {opponentGrid.map((row, rowIndex) =>
                  row.map((_, colIndex) => renderCell(rowIndex, colIndex, false))
                )}
              </div>
            </div>
          )}

          {/* Player grid - SECOND */}
          {(phase === 'placement' || phase === 'battle' || phase === 'gameover') && (
            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                marginBottom: '4px',
                textAlign: 'center',
                color: '#0D47A1',
                letterSpacing: '0.5px'
              }}>
                {phase === 'placement' ? '📍 MES NAVIRES' : '🛡️ MA FLOTTE'}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gap: '1px',
                background: '#1976D2',
                padding: '3px',
                borderRadius: '8px',
                boxShadow: '0 3px 8px rgba(25,118,210,0.4)'
              }}>
                {playerGrid.map((row, rowIndex) =>
                  row.map((_, colIndex) => renderCell(rowIndex, colIndex, true))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          fontSize: '0.7rem',
          color: '#0D47A1',
          flexWrap: 'wrap',
          fontWeight: '600'
        }}>
          {(phase === 'battle' || phase === 'gameover') && (
            <>
              <div>🔥 = Touché</div>
              <div>🌊 = Raté</div>
              <div>🚢 = Navire</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
