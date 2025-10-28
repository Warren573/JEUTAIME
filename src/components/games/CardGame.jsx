import React, { useEffect, useState } from 'react';
import { awardGameRewards, showRewardModal } from '../../utils/gameRewards';
import { getGameScores } from '../../config/gamesConfig';

export default function CardGame({ setGameScreen, currentUser, setUserCoins }) {
  const [cardSymbols, setCardSymbols] = useState([]);
  const [cardRevealed, setCardRevealed] = useState([]);
  const [cardGains, setCardGains] = useState(0);
  const [cardGameOver, setCardGameOver] = useState(false);
  const [cardMessage, setCardMessage] = useState('');

  // Stats
  const [totalGames, setTotalGames] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Charger les stats au démarrage
  useEffect(() => {
    if (currentUser) {
      const gameData = getGameScores(currentUser.email, 'CARD_GAME');
      if (gameData) {
        setTotalGames(gameData.totalPlays || 0);
        setTotalWins(gameData.wins || 0);
        setTotalCoinsEarned(gameData.totalCoinsEarned || 0);
        setBestScore(gameData.bestScore || 0);
      }
    }
  }, [currentUser]);

  const initCardGame = () => {
    const symbols = ["❤️", "❤️", "♣️", "♣️", "♠️", "♦️", "♦️", "♦️", "❤️", "♣️"];
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    setCardSymbols(shuffled);
    setCardRevealed(Array(10).fill(false));
    setCardGains(0);
    setCardGameOver(false);
    setCardMessage('Retourne une carte pour commencer ! 🎴');
  };

  useEffect(() => {
    if (cardSymbols.length === 0) {
      initCardGame();
    }
  }, []);

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
      return `💎 Indice: il y a un ${randomType} en ${rangeName} rangée.`;
    } else {
      return `💎 Indice: pas de ${randomType} en ${rangeName} rangée.`;
    }
  };

  const handleGameEnd = (finalGains, won) => {
    if (!currentUser) {
      return;
    }

    // Attribuer les récompenses
    const reward = awardGameRewards(currentUser.email, 'CARD_GAME', {
      won: won,
      amount: finalGains,
      score: finalGains
    });

    // Mettre à jour les stats
    setTotalGames(prev => prev + 1);
    if (won) {
      setTotalWins(prev => prev + 1);
    }
    setTotalCoinsEarned(prev => prev + (won ? finalGains : 0));
    if (finalGains > bestScore) {
      setBestScore(finalGains);
    }

    // Mettre à jour les pièces
    if (setUserCoins) {
      setUserCoins(reward.newCoins);
    }

    // Afficher le modal
    showRewardModal(reward);
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
        message = '✨ Cœur trouvé ! +15 pièces 💰';
        break;
      case "♣️":
        const oldGains = newGains;
        newGains = Math.floor(newGains / 2);
        message = `😬 Trèfle ! Tes gains passent de ${oldGains} à ${newGains} pièces...`;
        break;
      case "♠️":
        newGains = 0;
        message = '💀 Pique trouvé ! Game over... Tes gains disparaissent !';
        setCardGameOver(true);
        setTimeout(() => handleGameEnd(0, false), 500);
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
    if (allRevealed && card !== "♠️") {
      setCardGameOver(true);
      setCardMessage(`🎉 Toutes les cartes révélées ! Tu gagnes ${newGains} pièces !`);
      setTimeout(() => handleGameEnd(newGains, true), 500);
    }
  };

  const guessNoHearts = () => {
    if (cardGameOver) return;

    const allRevealed = Array(10).fill(true);
    setCardRevealed(allRevealed);

    const heartsLeft = cardSymbols.some((card, idx) => !cardRevealed[idx] && card === "❤️");

    if (heartsLeft) {
      setCardMessage('😔 Raté ! Il restait des cœurs... Tu perds tout.');
      setCardGains(0);
      setCardGameOver(true);
      setTimeout(() => handleGameEnd(0, false), 500);
    } else {
      const newGains = cardGains * 2;
      setCardGains(newGains);
      setCardMessage(`🥳 Bravo ! Plus de cœurs ! Tes gains sont doublés : ${newGains} pièces !`);
      setCardGameOver(true);
      setTimeout(() => handleGameEnd(newGains, true), 500);
    }
  };

  const handleCashOut = () => {
    if (cardGameOver || cardGains === 0) return;

    setCardGameOver(true);
    setCardMessage(`💰 Tu empoches ${cardGains} pièces ! Bien joué !`);
    setTimeout(() => handleGameEnd(cardGains, true), 500);
  };

  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <div>
      <button
        onClick={() => setGameScreen(null)}
        style={{
          padding: '10px 20px',
          background: '#1a1a1a',
          border: '1px solid #333',
          color: 'white',
          borderRadius: '10px',
          marginBottom: '20px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        ← Retour
      </button>

      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>🎴 Jeu des Cartes</h2>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Parties
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {totalGames}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Victoires
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {totalWins}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #FF9800, #F57C00)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Taux
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {winRate}%
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #E91E63, #C2185B)',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
            Record
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            {bestScore}
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '20px' }}>
        {/* Message et gains */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', margin: '0 0 8px 0', color: 'rgba(255,255,255,0.9)' }}>
            {cardMessage}
          </p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'white' }}>
            💰 {cardGains} pièces
          </p>
        </div>

        {/* Cartes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {cardSymbols.map((symbol, idx) => {
            const isRevealed = cardRevealed[idx];
            return (
              <button
                key={idx}
                onClick={() => revealCard(idx)}
                disabled={isRevealed || cardGameOver}
                style={{
                  aspectRatio: '3/4',
                  background: isRevealed
                    ? 'linear-gradient(135deg, #fff, #f0f0f0)'
                    : 'linear-gradient(135deg, #E91E63, #C2185B)',
                  border: isRevealed ? '3px solid #ddd' : 'none',
                  borderRadius: '10px',
                  fontSize: '32px',
                  cursor: isRevealed || cardGameOver ? 'default' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  boxShadow: isRevealed ? 'none' : '0 4px 10px rgba(233, 30, 99, 0.4)',
                  transform: isRevealed ? 'scale(1)' : 'scale(1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isRevealed && !cardGameOver) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isRevealed ? symbol : '❓'}
              </button>
            );
          })}
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleCashOut}
              disabled={cardGameOver || cardGains === 0}
              style={{
                flex: 1,
                padding: '15px 20px',
                background: cardGameOver || cardGains === 0
                  ? '#666'
                  : 'linear-gradient(135deg, #4CAF50, #388E3C)',
                border: 'none',
                color: 'white',
                borderRadius: '12px',
                cursor: cardGameOver || cardGains === 0 ? 'default' : 'pointer',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: cardGameOver || cardGains === 0
                  ? 'none'
                  : '0 4px 15px rgba(76, 175, 80, 0.4)'
              }}
            >
              💰 Empocher ({cardGains})
            </button>

            <button
              onClick={guessNoHearts}
              disabled={cardGameOver}
              style={{
                flex: 1,
                padding: '15px 20px',
                background: cardGameOver
                  ? '#666'
                  : 'linear-gradient(135deg, #FF9800, #F57C00)',
                border: 'none',
                color: 'white',
                borderRadius: '12px',
                cursor: cardGameOver ? 'default' : 'pointer',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: cardGameOver
                  ? 'none'
                  : '0 4px 15px rgba(255, 152, 0, 0.4)'
              }}
            >
              🎲 Plus de ❤️ ? (x2)
            </button>
          </div>

          <button
            onClick={() => { setCardSymbols([]); initCardGame(); }}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            🔄 Nouvelle partie
          </button>
        </div>

        {/* Règles */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#0a0a0a',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#aaa',
          lineHeight: '1.6'
        }}>
          <div style={{ fontWeight: '600', color: '#FFD700', marginBottom: '8px' }}>
            📖 Règles
          </div>
          ❤️ Cœur : +15 pièces<br />
          ♦️ Carreau : Indice gratuit<br />
          ♣️ Trèfle : Gains divisés par 2<br />
          ♠️ Pique : Game over, tu perds tout !<br />
          <br />
          💡 Stratégie : Empoche tes gains ou parie qu'il ne reste plus de cœurs pour doubler !<br />
          🏆 Badge à 500 pièces gagnées
        </div>
      </div>
    </div>
  );
}
