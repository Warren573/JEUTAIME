import React, { useEffect } from 'react';

export default function CardGame({
  setGameScreen,
  cardSymbols,
  setCardSymbols,
  cardRevealed,
  setCardRevealed,
  cardGains,
  setCardGains,
  cardGameOver,
  setCardGameOver,
  cardMessage,
  setCardMessage
}) {
  const initCardGame = () => {
    const symbols = ["❤️", "❤️", "♣️", "♣️", "♠️", "♦️", "♦️", "♦️", "❤️", "♣️"];
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    setCardSymbols(shuffled);
    setCardRevealed(Array(10).fill(false));
    setCardGains(0);
    setCardGameOver(false);
    setCardMessage('Retourne une carte!');
  };

  const generateHint = (symbols) => {
    const row = Math.random() < 0.5 ? 0 : 1;
    const firstRow = symbols.slice(0, 5);
    const secondRow = symbols.slice(5, 10);
    const currentRow = row === 0 ? firstRow : secondRow;
    const rangeName = row === 0 ? "première" : "deuxième";

    const types = ["❤️", "♣️", "♠️", "♦️"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const found = currentRow.includes(randomType);

    if (found) {
      return `Indice: il y a un ${randomType} en ${rangeName} rangée.`;
    } else {
      return `Indice: pas de ${randomType} en ${rangeName} rangée.`;
    }
  };

  const revealCard = (index) => {
    if (cardRevealed[index] || cardGameOver) return;

    const newRevealed = [...cardRevealed];
    newRevealed[index] = true;
    setCardRevealed(newRevealed);

    const card = cardSymbols[index];
    let newGains = cardGains;
    let message = '';

    switch(card) {
      case "❤️":
        newGains += 15;
        message = 'Bravo! +15 pièces 💰';
        break;
      case "♣️":
        newGains = Math.floor(newGains / 2);
        message = 'Oups... tes gains sont divisés par deux 😬';
        break;
      case "♠️":
        newGains = 0;
        message = '💀 Pique trouvé! Tes gains disparaissent...';
        break;
      case "♦️":
        message = generateHint(cardSymbols);
        break;
      default:
        break;
    }

    setCardGains(newGains);
    setCardMessage(message);

    const allRevealed = newRevealed.every(rev => rev);
    if (allRevealed) {
      setCardGameOver(true);
      setCardMessage('Toutes les cartes sont retournées! Partie terminée. 🎉');
    }
  };

  const guessNoHearts = () => {
    if (cardGameOver) return;

    const allRevealed = Array(10).fill(true);
    setCardRevealed(allRevealed);

    const heartsLeft = cardSymbols.some((card, idx) => !cardRevealed[idx] && card === "❤️");

    if (heartsLeft) {
      setCardMessage('Raté 😔 Il restait des cœurs! Tu perds tout.');
      setCardGains(0);
    } else {
      const newGains = cardGains * 2;
      setCardGains(newGains);
      setCardMessage(`Bravo 🥳 Tu avais raison! Il n'y avait plus de cœurs! Tes gains sont doublés: ${newGains} pièces!`);
    }
    setCardGameOver(true);
  };

  useEffect(() => {
    if (cardSymbols.length === 0) {
      initCardGame();
    }
  }, []);

  return (
    <div>
      <button onClick={() => setGameScreen(null)} style={{ padding: '10px 20px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>← Retour</button>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>🎴 Jeu des Cartes</h2>
      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px' }}>
        <p style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px', color: '#ccc' }}>{cardMessage}</p>
        <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>💰 Gains: {cardGains} pièces</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {cardSymbols.map((symbol, idx) => (
            <button key={idx} onClick={() => revealCard(idx)} style={{ width: '60px', height: '80px', margin: '0 auto', background: cardRevealed[idx] ? 'white' : '#E91E63', border: 'none', borderRadius: '8px', fontSize: '28px', cursor: cardRevealed[idx] || cardGameOver ? 'default' : 'pointer', fontWeight: 'bold', opacity: cardRevealed[idx] || !cardGameOver ? 1 : 0.9 }}>
              {cardRevealed[idx] ? symbol : '❓'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={guessNoHearts} disabled={cardGameOver} style={{ padding: '12px 20px', background: cardGameOver ? '#666' : '#FFA500', border: 'none', color: '#000', borderRadius: '8px', cursor: cardGameOver ? 'default' : 'pointer', fontWeight: '600', fontSize: '13px' }}>
            Deviner qu'il n'y a plus de ❤️
          </button>
          <button onClick={() => { setCardSymbols([]); initCardGame(); }} style={{ padding: '12px 20px', background: '#E91E63', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            Rejouer
          </button>
        </div>
      </div>
    </div>
  );
}
