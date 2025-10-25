import React from 'react';

export default function HeroLoveQuest({
  setGameScreen,
  heroPlayer,
  setHeroPlayer,
  heroMessage,
  setHeroMessage,
  heroGridSize,
  heroGameOver,
  setHeroGameOver,
  heroVictory,
  setHeroVictory,
  setUserCoins,
  rnd
}) {
  const heroObstacles = [
    { name: "💬 Silence Glaçant", diff: 6, type:"charm", desc:"Un silence embarrassant s'installe...", reward: 10 },
    { name: "🤡 Blague Ratée", diff: 7, type:"humor", desc:"Ta blague tombe à plat...", reward: 15 },
    { name: "🧠 Question Piège", diff: 6, type:"wit", desc:"Une question complexe te surprend...", reward: 12 },
    { name: "😱 Moment Gênant", diff: 8, type:"courage", desc:"Un moment ultra gênant arrive...", reward: 20 },
    { name: "💘 Compliment Raté", diff: 7, type:"charm", desc:"Ton compliment sonne faux...", reward: 15 },
    { name: "🎭 Situation Absurde", diff: 9, type:"humor", desc:"Une situation absurde se présente...", reward: 25 },
    { name: "🔮 Énigme Mystique", diff: 10, type:"wit", desc:"Une énigme te bloque le passage...", reward: 30 },
    { name: "💪 Défi du Courage", diff: 8, type:"courage", desc:"Tu dois prouver ton courage...", reward: 20 },
    { name: "👑 BOSS: Rendez-vous Décisif", diff: 12, type:"charm", desc:"LE rendez-vous de ta vie!", reward: 100 }
  ];

  const heroMove = (dx, dy) => {
    const nx = Math.max(0, Math.min(heroGridSize-1, heroPlayer.pos.x+dx));
    const ny = Math.max(0, Math.min(heroGridSize-1, heroPlayer.pos.y+dy));
    setHeroPlayer(p => ({...p, pos:{x:nx,y:ny}}));
    if(nx === heroGridSize-1 && ny === heroGridSize-1){ heroEncounter(nx, ny, true); return; }
    if(Math.random() < 0.45){ heroEncounter(nx, ny, false); }
    else { setHeroMessage('🚶 Tu explores (' + nx + ',' + ny + '). Rien pour l\'instant...'); }
  };

  const heroEncounter = (x, y, isBoss) => {
    const obstacle = isBoss ? heroObstacles[8] : heroObstacles[Math.floor(Math.random() * 8)];
    const stat = obstacle.type === 'charm' ? heroPlayer.charm : obstacle.type === 'wit' ? heroPlayer.wit : obstacle.type === 'humor' ? heroPlayer.humor : heroPlayer.courage;
    const statName = obstacle.type === 'charm' ? 'Charme' : obstacle.type === 'wit' ? 'Esprit' : obstacle.type === 'humor' ? 'Humour' : 'Courage';
    const roll = rnd();
    const total = roll + stat;

    if(total >= obstacle.diff){
      const coinReward = obstacle.reward;
      setHeroPlayer(p => ({...p, coinsEarned: p.coinsEarned + coinReward, monstersDefeated: p.monstersDefeated + 1}));
      setUserCoins(c => c + coinReward);
      if(isBoss){
        setHeroVictory(true);
        setHeroMessage('🎉 VICTOIRE ÉPIQUE! ' + obstacle.name + '\n\n✅ Réussi! (🎲' + roll + ' + ' + statName + ' ' + stat + ' = ' + total + '/' + obstacle.diff + ')\n\n🏆 +' + coinReward + ' 🪙\n💕 Tu as conquis son cœur!');
      } else {
        setHeroMessage('✨ ' + obstacle.name + '\n' + obstacle.desc + '\n\n✅ Réussi! (🎲' + roll + ' + ' + statName + ' ' + stat + ' = ' + total + '/' + obstacle.diff + ')\n\n💰 +' + coinReward + ' 🪙');
      }
    } else {
      const loss = 2;
      const newConfidence = heroPlayer.confidence - loss;
      if(newConfidence <= 0){
        setHeroGameOver(true);
        setHeroMessage('💔 GAME OVER!\n\n' + obstacle.name + '\n❌ Échec (🎲' + roll + ' + ' + statName + ' ' + stat + ' = ' + total + '/' + obstacle.diff + ')\n\n😢 Tu as perdu toute confiance...');
      } else {
        setHeroPlayer(p => ({...p, confidence: newConfidence}));
        setHeroMessage('⚠️ ' + obstacle.name + '\n' + obstacle.desc + '\n\n❌ Échec (🎲' + roll + ' + ' + statName + ' ' + stat + ' = ' + total + '/' + obstacle.diff + ')\n\n💔 -' + loss + ' Confiance (' + newConfidence + ' restant)');
      }
    }
  };

  const heroReset = () => {
    setHeroPlayer({ name: "Aventurier·e", pos: {x:0,y:0}, charm: 2, wit: 1, humor: 2, courage: 2, confidence: 10, coinsEarned: 0, monstersDefeated: 0 });
    setHeroMessage("🎮 Nouvelle aventure commence !");
    setHeroGameOver(false);
    setHeroVictory(false);
  };

  const renderGrid = () => {
    const cells = [];
    for(let i = 0; i < heroGridSize * heroGridSize; i++){
      const x = i % heroGridSize;
      const y = Math.floor(i / heroGridSize);
      const isPlayer = heroPlayer.pos.x === x && heroPlayer.pos.y === y;
      const isBoss = x === heroGridSize-1 && y === heroGridSize-1;
      const isStart = x === 0 && y === 0;
      cells.push(
        <div key={i} style={{ width: 55, height: 55, border: '2px solid #444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isPlayer ? 'linear-gradient(135deg, #4CAF50, #45a049)' : isBoss ? 'linear-gradient(135deg, #E91E63, #C2185B)' : isStart ? 'linear-gradient(135deg, #2196F3, #1976D2)' : '#2a2a2a', fontSize: isPlayer || isBoss ? '28px' : '10px', color: isPlayer || isBoss || isStart ? 'white' : '#666', fontWeight: 'bold', boxShadow: isPlayer ? '0 0 15px rgba(76, 175, 80, 0.6)' : isBoss ? '0 0 15px rgba(233, 30, 99, 0.6)' : 'none', transition: 'all 0.3s' }}>
          {isPlayer ? '😊' : isBoss ? '💕' : isStart ? '🏠' : x + ',' + y}
        </div>
      );
    }
    return cells;
  };

  return (
    <div style={{padding: '15px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <h2 style={{margin: 0, fontSize: '20px'}}>🎮 HeroLove Quest</h2>
        <button onClick={() => setGameScreen(null)} style={{background: '#E91E63', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'}}>← Retour</button>
      </div>

      <div style={{background: 'linear-gradient(135deg, #FF6B9D, #C2185B)', padding: '12px', borderRadius: '12px', marginBottom: '15px', color: 'white', fontSize: '12px', lineHeight: '1.5'}}>
        🎯 <strong>Mission:</strong> Atteins le coin bas-droite (💕) pour le rendez-vous décisif!<br/>
        ⚔️ Surmonte les obstacles avec tes stats!<br/>
        💰 Gagne des pièces en réussissant!
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(' + heroGridSize + ', 55px)', gap: '3px', background: '#1a1a1a', padding: '8px', borderRadius: '12px', border: '2px solid #333', marginBottom: '12px'}}>
        {renderGrid()}
      </div>

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '15px'}}>
        <button onClick={() => heroMove(0, -1)} disabled={heroGameOver || heroVictory} style={{padding: '12px 25px', background: 'linear-gradient(135deg, #4CAF50, #45a049)', border: 'none', color: 'white', borderRadius: '10px', cursor: heroGameOver || heroVictory ? 'not-allowed' : 'pointer', fontSize: '18px', fontWeight: 'bold', opacity: heroGameOver || heroVictory ? 0.5 : 1}}>↑</button>
        <div style={{display: 'flex', gap: '6px'}}>
          <button onClick={() => heroMove(-1, 0)} disabled={heroGameOver || heroVictory} style={{padding: '12px 25px', background: 'linear-gradient(135deg, #4CAF50, #45a049)', border: 'none', color: 'white', borderRadius: '10px', cursor: heroGameOver || heroVictory ? 'not-allowed' : 'pointer', fontSize: '18px', fontWeight: 'bold', opacity: heroGameOver || heroVictory ? 0.5 : 1}}>←</button>
          <button onClick={() => heroMove(1, 0)} disabled={heroGameOver || heroVictory} style={{padding: '12px 25px', background: 'linear-gradient(135deg, #4CAF50, #45a049)', border: 'none', color: 'white', borderRadius: '10px', cursor: heroGameOver || heroVictory ? 'not-allowed' : 'pointer', fontSize: '18px', fontWeight: 'bold', opacity: heroGameOver || heroVictory ? 0.5 : 1}}>→</button>
        </div>
        <button onClick={() => heroMove(0, 1)} disabled={heroGameOver || heroVictory} style={{padding: '12px 25px', background: 'linear-gradient(135deg, #4CAF50, #45a049)', border: 'none', color: 'white', borderRadius: '10px', cursor: heroGameOver || heroVictory ? 'not-allowed' : 'pointer', fontSize: '18px', fontWeight: 'bold', opacity: heroGameOver || heroVictory ? 0.5 : 1}}>↓</button>
      </div>

      {(heroGameOver || heroVictory) && (
        <button onClick={heroReset} style={{width: '100%', padding: '12px', background: 'linear-gradient(135deg, #2196F3, #1976D2)', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginBottom: '15px'}}>🔄 Nouvelle Partie</button>
      )}

      <div style={{background: '#1a1a1a', padding: '15px', borderRadius: '12px', border: '2px solid #333', marginBottom: '15px'}}>
        <h3 style={{margin: '0 0 12px 0', fontSize: '16px', color: '#E91E63'}}>👤 {heroPlayer.name}</h3>
        <div style={{marginBottom: '10px', padding: '8px', background: '#2a2a2a', borderRadius: '8px', fontSize: '13px'}}>📍 Position: ({heroPlayer.pos.x}, {heroPlayer.pos.y})</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px', fontSize: '12px'}}>
          <div style={{padding: '8px', background: '#2a2a2a', borderRadius: '8px'}}><div style={{color: '#888'}}>💘 Charme</div><div style={{fontSize: '18px', fontWeight: 'bold', color: '#E91E63'}}>{heroPlayer.charm}</div></div>
          <div style={{padding: '8px', background: '#2a2a2a', borderRadius: '8px'}}><div style={{color: '#888'}}>🧠 Esprit</div><div style={{fontSize: '18px', fontWeight: 'bold', color: '#2196F3'}}>{heroPlayer.wit}</div></div>
          <div style={{padding: '8px', background: '#2a2a2a', borderRadius: '8px'}}><div style={{color: '#888'}}>😄 Humour</div><div style={{fontSize: '18px', fontWeight: 'bold', color: '#FF9800'}}>{heroPlayer.humor}</div></div>
          <div style={{padding: '8px', background: '#2a2a2a', borderRadius: '8px'}}><div style={{color: '#888'}}>💪 Courage</div><div style={{fontSize: '18px', fontWeight: 'bold', color: '#4CAF50'}}>{heroPlayer.courage}</div></div>
        </div>
        <div style={{padding: '12px', background: heroPlayer.confidence <= 3 ? '#d32f2f' : '#2a2a2a', borderRadius: '8px', marginBottom: '10px'}}>
          <div style={{fontSize: '11px', color: '#888', marginBottom: '4px'}}>❤️ Confiance</div>
          <div style={{fontSize: '20px', fontWeight: 'bold', color: heroPlayer.confidence <= 3 ? 'white' : '#4CAF50'}}>{heroPlayer.confidence}/10</div>
          <div style={{marginTop: '6px', height: '6px', background: '#0a0a0a', borderRadius: '3px', overflow: 'hidden'}}>
            <div style={{height: '100%', width: (heroPlayer.confidence * 10) + '%', background: heroPlayer.confidence <= 3 ? '#f44336' : '#4CAF50', transition: 'width 0.3s'}}></div>
          </div>
        </div>
        <div style={{padding: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', borderRadius: '8px', marginBottom: '10px', textAlign: 'center'}}>
          <div style={{fontSize: '11px', color: '#000', marginBottom: '4px', fontWeight: 'bold'}}>💰 Pièces Gagnées</div>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#000'}}>{heroPlayer.coinsEarned} 🪙</div>
        </div>
        <div style={{padding: '10px', background: '#2a2a2a', borderRadius: '8px', fontSize: '13px'}}>
          <div style={{color: '#888', marginBottom: '4px'}}>🏆 Statistiques</div>
          <div>⚔️ Défis vaincus: {heroPlayer.monstersDefeated}</div>
        </div>
      </div>

      <div style={{padding: '15px', background: heroVictory ? 'linear-gradient(135deg, #4CAF50, #45a049)' : heroGameOver ? 'linear-gradient(135deg, #f44336, #d32f2f)' : 'linear-gradient(135deg, #2196F3, #1976D2)', borderRadius: '12px', border: '3px solid ' + (heroVictory ? '#4CAF50' : heroGameOver ? '#f44336' : '#2196F3'), color: 'white', whiteSpace: 'pre-line', fontSize: '13px', lineHeight: '1.5'}}>
        {heroMessage}
      </div>
    </div>
  );
}
