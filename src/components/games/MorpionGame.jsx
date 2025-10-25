import React from 'react';

export default function MorpionGame({ setGameScreen, morpionBoard, setMorpionBoard, morpionTurn, setMorpionTurn }) {
  const calculateWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleMorpionClick = (index) => {
    if (morpionBoard[index] || calculateWinner(morpionBoard)) return;
    const newBoard = morpionBoard.slice();
    newBoard[index] = morpionTurn;
    setMorpionBoard(newBoard);
    setMorpionTurn(morpionTurn === 'X' ? 'O' : 'X');
  };

  const winner = calculateWinner(morpionBoard);

  return (
    <div>
      <button onClick={() => setGameScreen(null)} style={{ padding: '10px 20px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>← Retour</button>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>⭕ Morpion</h2>
      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', marginBottom: '20px', fontWeight: '600' }}>Joueur: {morpionTurn}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '5px', margin: '0 auto 30px', width: 'fit-content' }}>
          {morpionBoard.map((val, idx) => (
            <button key={idx} onClick={() => handleMorpionClick(idx)} style={{ width: '80px', height: '80px', fontSize: '32px', background: '#0a0a0a', border: '2px solid #333', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: val === 'X' ? '#E91E63' : '#2196F3' }}>
              {val}
            </button>
          ))}
        </div>
        {winner && <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Gagnant: {winner}!</p>}
        <button onClick={() => { setMorpionBoard(Array(9).fill(null)); setMorpionTurn('X'); }} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #E91E63, #C2185B)', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Nouvelle partie</button>
      </div>
    </div>
  );
}
