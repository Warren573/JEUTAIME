import React, { useEffect, useState } from "react";
import { awardGameRewards, showRewardModal } from '../../utils/gameRewards';
import { getGameScores } from '../../config/gamesConfig';

// Empires d'Etheria - Intégré dans JeuTaime

// --- Mock data: board, events, artifacts ---
const INITIAL_BOARD = [
  { id: 0, type: "city", name: "Cité de Brumeciel", cost: 6, rent: 2 },
  { id: 1, type: "event" },
  { id: 2, type: "city", name: "Forge d'Obsidienne", cost: 12, rent: 5 },
  { id: 3, type: "artifact" },
  { id: 4, type: "city", name: "Tour des Arcanes", cost: 20, rent: 8 },
  { id: 5, type: "event" },
  { id: 6, type: "city", name: "Sanctuaire du Néant", cost: 30, rent: 12 },
  { id: 7, type: "portal" },
  { id: 8, type: "city", name: "Bastion d'Azur", cost: 8, rent: 3 },
  { id: 9, type: "event" },
  { id: 10, type: "city", name: "Bourg des Murmures", cost: 10, rent: 4 },
  { id: 11, type: "artifact" },
  { id: 12, type: "city", name: "Marais des Echos", cost: 9, rent: 4 },
  { id: 13, type: "event" },
  { id: 14, type: "city", name: "Motte de Givre", cost: 11, rent: 5 },
  { id: 15, type: "portal" },
  { id: 16, type: "city", name: "Cime des Sages", cost: 14, rent: 6 },
  { id: 17, type: "event" },
  { id: 18, type: "city", name: "Ruines d'Yl", cost: 16, rent: 7 },
  { id: 19, type: "artifact" },
  { id: 20, type: "city", name: "Val des Brumes", cost: 18, rent: 8 },
  { id: 21, type: "event" },
  { id: 22, type: "city", name: "Nid d'Oblivion", cost: 22, rent: 10 },
  { id: 23, type: "portal" }
];

const EVENT_CARDS = [
  { id: "e1", title: "Tempête d'Éther", description: "Tous les joueurs perdent 3 mana.", effect: (state, current) => {
      const players = state.players.map(p => ({ ...p, mana: Math.max(0, p.mana - 3) }));
      return { ...state, players };
  }},
  { id: "e2", title: "Trésor caché", description: "Vous trouvez 8 mana.", effect: (state, current) => {
      const players = state.players.map((p, i) => i === current ? { ...p, mana: p.mana + 8 } : p);
      return { ...state, players };
  }},
  { id: "e3", title: "Portail instable", description: "Échangez votre position avec un adversaire aléatoire.", effect: (state, current) => {
      const others = state.players.filter((_,i)=>i!==current);
      if (!others.length) return state;
      const rnd = others[Math.floor(Math.random()*others.length)];
      const players = state.players.map((p,i)=>{
        if(i===current) return {...p, pos: rnd.pos};
        if(p.pos===rnd.pos && i!==current) return {...p, pos: state.players[current].pos};
        return p;
      });
      return {...state, players};
  }},
  { id: "e4", title: "Invocation ratée", description: "Vous sautez votre prochain tour.", effect: (state, current) => {
      const players = state.players.map((p,i)=> i===current? {...p, skipNext:true}:p);
      return {...state, players};
  }},
  { id: "e5", title: "Bénédiction de la Tour", description: "Gagnez 5 mana.", effect: (state, current) => {
      const players = state.players.map((p,i)=> i===current? {...p, mana: p.mana+5}:p);
      return {...state, players};
  }}
];

const ARTIFACT_CARDS = [
  { id: "a1", title: "Amulette du Néant", description: "Ignorez le prochain tribut que vous auriez à payer.", apply: (player) => ({...player, artifactEffects: [...player.artifactEffects, {type:'ignoreTribut'}]}) },
  { id: "a2", title: "Bâton des Courants", description: "+1 au mouvement par tour (durée: permanent)", apply: (player) => ({...player, moveBonus: (player.moveBonus||0)+1}) },
  { id: "a3", title: "Gemme de Lien", description: "Quand vous payez un tribut, récupérez 1 mana.", apply: (player) => ({...player, artifactEffects: [...player.artifactEffects, {type:'refundOnTribut'}]}) }
];

// --- Utility helpers ---
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- Main component ---
export default function EmpiresEtheriaGame({ setGameScreen, currentUser, setUserCoins }) {
  const [board, setBoard] = useState(INITIAL_BOARD.map(c=> ({...c, owner: null})));
  const [eventDeck, setEventDeck] = useState(shuffleArray([...EVENT_CARDS]));
  const [artifactDeck, setArtifactDeck] = useState(shuffleArray([...ARTIFACT_CARDS]));

  const [players, setPlayers] = useState(()=> {
    return [
      { id: 0, name: 'Aelyr', color: '#667eea', mana: 30, pos: 0, artifacts: [], artifactEffects: [], moveBonus:0, skipNext:false },
      { id: 1, name: 'Thoren', color: '#10b981', mana: 30, pos: 0, artifacts: [], artifactEffects: [], moveBonus:0, skipNext:false }
    ];
  });

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [dice, setDice] = useState(null);
  const [message, setMessage] = useState('Bienvenue dans Empires d\'Étheria');
  const [modal, setModal] = useState(null);

  // Stats persistantes
  const [totalGames, setTotalGames] = useState(0);
  const [totalVictories, setTotalVictories] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [bestMana, setBestMana] = useState(0);

  // Charger les stats au démarrage
  useEffect(() => {
    if (currentUser) {
      const gameData = getGameScores(currentUser.email, 'EMPIRES_ETHERIA');
      if (gameData) {
        setTotalGames(gameData.totalPlays || 0);
        setTotalVictories(gameData.victories || 0);
        setTotalCoinsEarned(gameData.totalCoinsEarned || 0);
        setBestMana(gameData.bestScore || 0);
      }
    }
  }, [currentUser]);

  useEffect(()=>{
    const s = localStorage.getItem('empireStateV1');
    if(s){
      try{
        const parsed = JSON.parse(s);
        setPlayers(parsed.players);
        setBoard(parsed.board);
        setCurrentPlayer(parsed.currentPlayer);
      }
      catch(e){ /* ignore */ }
    }
  }, []);

  useEffect(()=>{
    localStorage.setItem('empireStateV1', JSON.stringify({players, board, currentPlayer}));
  }, [players, board, currentPlayer]);

  // --- Actions ---
  function shuffleArray(a){
    const arr = [...a];
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]]=[arr[j], arr[i]];
    }
    return arr;
  }

  function rollDice() {
    const p = players[currentPlayer];
    if(p.skipNext){
      setPlayers(players.map((pl,i)=> i===currentPlayer? {...pl, skipNext:false}:pl));
      setMessage(`${p.name} saute ce tour (invocation ratée).`);
      nextTurn();
      return;
    }
    const base = randInt(1,6);
    const total = base + (p.moveBonus||0);
    setDice(total);
    setMessage(`${p.name} lance le dé : ${base} (+${p.moveBonus||0}) → ${total}`);
    movePlayer(currentPlayer, total);
  }

  function movePlayer(playerIndex, steps){
    const p = players[playerIndex];
    const newPos = (p.pos + steps) % board.length;
    const updatedPlayers = players.map((pl,i)=> i===playerIndex? {...pl, pos: newPos}: pl);
    setPlayers(updatedPlayers);
    setTimeout(()=> handleLanding(playerIndex, newPos), 350);
  }

  function handleLanding(playerIndex, pos){
    const cell = board[pos];
    const player = players[playerIndex];
    if(!cell) return;
    if(cell.type === 'city'){
      if(cell.owner === null){
        setModal({type:'buy', payload:{playerIndex, pos, cell}});
      } else if(cell.owner !== playerIndex){
        const rent = cell.rent;
        const ignore = player.artifactEffects.some(a=>a.type==='ignoreTribut');
        if(ignore){
          setPlayers(players.map((pl,i)=> i===playerIndex? {...pl, artifactEffects: pl.artifactEffects.filter(a=>a.type!=='ignoreTribut')}:pl));
          setMessage(`${player.name} ignore le tribut grâce à son artefact.`);
          nextTurn();
          return;
        }
        const owner = players[cell.owner];
        const newPlayers = players.map((pl,i)=>{
          if(i===playerIndex) return {...pl, mana: Math.max(0, pl.mana - rent)};
          if(i===cell.owner) return {...pl, mana: pl.mana + rent};
          return pl;
        });
        setPlayers(newPlayers);
        setMessage(`${player.name} paie ${rent} mana à ${owner.name}.`);
        nextTurn();
      } else {
        setMessage(`${player.name} visite sa cité : ${cell.name}.`);
        nextTurn();
      }
    } else if(cell.type === 'event'){
      drawEvent(playerIndex);
    } else if(cell.type === 'artifact'){
      drawArtifact(playerIndex);
    } else if(cell.type === 'portal'){
      const gain = randInt(1,6);
      setPlayers(players.map((pl,i)=> i===playerIndex? {...pl, mana: pl.mana + gain}:pl));
      setMessage(`${player.name} gagne ${gain} mana via le portail.`);
      nextTurn();
    }
  }

  function drawEvent(playerIndex){
    if(eventDeck.length===0) setEventDeck(shuffleArray([...EVENT_CARDS]));
    const card = eventDeck[0];
    setEventDeck(eventDeck.slice(1));
    setModal({type:'event', payload:{card, playerIndex}});
  }

  function applyEvent(card, playerIndex){
    const newState = card.effect({players, board}, playerIndex);
    if(newState.players) setPlayers(newState.players);
    setModal(null);
    setMessage(`${players[playerIndex].name}: ${card.title}`);
    nextTurn();
  }

  function drawArtifact(playerIndex){
    if(artifactDeck.length===0) setArtifactDeck(shuffleArray([...ARTIFACT_CARDS]));
    const card = artifactDeck[0];
    setArtifactDeck(artifactDeck.slice(1));
    const newPlayers = players.map((p,i)=> i===playerIndex? {...p, artifacts: [...p.artifacts, card], ...card.apply(p)}:p);
    setPlayers(newPlayers);
    setMessage(`${players[playerIndex].name} obtient l'artefact : ${card.title}`);
    setModal({type:'artifact', payload:{card, playerIndex}});
    setTimeout(()=> { setModal(null); nextTurn(); }, 1200);
  }

  function buyCity(playerIndex, pos){
    const cell = board[pos];
    const player = players[playerIndex];
    if(cell.owner !== null) return;
    if(player.mana < cell.cost) {
      setMessage("Mana insuffisant pour acheter.");
      setModal(null);
      nextTurn();
      return;
    }
    const newPlayers = players.map((p,i)=> i===playerIndex? {...p, mana: p.mana - cell.cost}:p);
    setPlayers(newPlayers);
    setBoard(board.map(c=> c.id===cell.id? {...c, owner: playerIndex}: c));
    setMessage(`${player.name} achète ${cell.name} pour ${cell.cost} mana.`);
    setModal(null);
    checkVictory(playerIndex);
    nextTurn();
  }

  function passBuy(){
    setMessage(`${players[currentPlayer].name} laisse la cité.`);
    setModal(null);
    nextTurn();
  }

  function nextTurn(){
    const next = (currentPlayer + 1) % players.length;
    setCurrentPlayer(next);
    setDice(null);
  }

  function handleGameEnd(playerIndex) {
    if (!currentUser) return;

    const p = players[playerIndex];
    const finalMana = p.mana;

    // Attribuer les récompenses
    const reward = awardGameRewards(currentUser.email, 'EMPIRES_ETHERIA', {
      victory: true,
      mana: finalMana,
      score: finalMana
    });

    // Mettre à jour les stats
    setTotalGames(prev => prev + 1);
    setTotalVictories(prev => prev + 1);
    setTotalCoinsEarned(prev => prev + reward.coins);
    if (finalMana > bestMana) {
      setBestMana(finalMana);
    }

    // Mettre à jour les pièces
    if (setUserCoins) {
      setUserCoins(reward.newCoins);
    }

    // Sauvegarder victories pour le badge
    const scores = JSON.parse(localStorage.getItem('jeutaime_game_scores') || '{}');
    if (scores[currentUser.email] && scores[currentUser.email].EMPIRES_ETHERIA) {
      scores[currentUser.email].EMPIRES_ETHERIA.victories = (scores[currentUser.email].EMPIRES_ETHERIA.victories || 0) + 1;
      localStorage.setItem('jeutaime_game_scores', JSON.stringify(scores));
    }

    // Afficher le modal après victoire
    setTimeout(() => showRewardModal(reward), 1500);
  }

  function checkVictory(playerIndex){
    const p = players[playerIndex];
    const owned = board.filter(b => b.owner === playerIndex && b.type==='city');
    const legendary = owned.filter(o => o.cost >= 20).length;
    if(p.mana >= 100 || legendary >= 3){
      setModal({type:'victory', payload:{playerIndex}});
      handleGameEnd(playerIndex);
    }
  }

  function resetGame(){
    setBoard(INITIAL_BOARD.map(c=> ({...c, owner:null})));
    setPlayers(players.map(p=> ({...p, mana:30, pos:0, artifacts:[], artifactEffects:[], moveBonus:0, skipNext:false})).slice(0,2));
    setCurrentPlayer(0);
    setModal(null);
    setDice(null);
    setMessage('Nouvelle partie : Empires d\'Étheria');
  }

  const victoryRate = totalGames > 0 ? Math.round((totalVictories / totalGames) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0f172a, #000000)', padding: '20px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>🏰 Empires d'Étheria</h1>
          <button
            onClick={() => setGameScreen(null)}
            style={{
              padding: '10px 20px',
              background: '#1a1a1a',
              border: '1px solid #333',
              color: 'white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ← Retour
          </button>
        </header>

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
              {totalVictories}
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
              {victoryRate}%
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #E91E63, #C2185B)',
            borderRadius: '12px',
            padding: '12px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '3px' }}>
              Best Mana
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
              {bestMana}
            </div>
          </div>
        </div>

        <main>
          {/* Board */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              width: '520px',
              height: '520px',
              borderRadius: '50%',
              border: '4px solid #4c1d95',
              padding: '16px',
              background: 'linear-gradient(135deg, #0f172a, #4c1d95)',
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.5)'
            }}>
              {/* Cells */}
              {board.map((cell, idx)=>{
                const angle = (idx / board.length) * Math.PI * 2 - Math.PI/2;
                const r = 180;
                const cx = 250 + r * Math.cos(angle);
                const cy = 250 + r * Math.sin(angle);

                let bgColor = '#1e293b';
                if(cell.type === 'event') bgColor = '#b45309';
                if(cell.type === 'artifact') bgColor = '#7c3aed';
                if(cell.type === 'portal') bgColor = '#06b6d4';

                return (
                  <div key={cell.id} style={{
                    position: 'absolute',
                    left: cx-60,
                    top: cy-25,
                    width: '120px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      padding: '4px',
                      borderRadius: '6px',
                      background: bgColor,
                      opacity: 0.9,
                      border: '1px solid #374151',
                      fontSize: '11px'
                    }}>
                      <div style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cell.name || cell.type.toUpperCase()}
                      </div>
                      {cell.type==='city' && (
                        <div style={{ fontSize: '9px' }}>
                          Coût: {cell.cost} • Loyer: {cell.rent}
                        </div>
                      )}
                      {cell.owner !== null && (
                        <div style={{
                          marginTop: '4px',
                          height: '6px',
                          width: '100%',
                          borderRadius: '3px',
                          background: players[cell.owner].color
                        }}></div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Players tokens */}
              {players.map((p, i)=>{
                const angle = (p.pos / board.length) * Math.PI * 2 - Math.PI/2;
                const r = 120;
                const cx = 250 + r * Math.cos(angle);
                const cy = 250 + r * Math.sin(angle);
                return (
                  <div key={p.id} style={{
                    position: 'absolute',
                    left: cx-16,
                    top: cy-16,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    fontWeight: '700'
                  }} title={`${p.name} (${p.mana} mana)`}>
                    {p.name[0]}
                  </div>
                );
              })}
            </div>
          </div>

          {/* HUD */}
          <div style={{ width: '100%', display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div style={{
              flex: 1,
              minWidth: '300px',
              padding: '15px',
              background: '#1e293b',
              borderRadius: '12px',
              border: '1px solid #374151'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#9ca3af' }}>Tour</div>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{players[currentPlayer].name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#9ca3af' }}>Mana</div>
                  <div style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: '700' }}>
                    {players[currentPlayer].mana} 💎
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={rollDice}
                  disabled={dice!==null}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '8px',
                    background: dice === null ? '#4f46e5' : '#6b7280',
                    color: 'white',
                    border: 'none',
                    cursor: dice === null ? 'pointer' : 'default',
                    fontWeight: '600',
                    opacity: dice === null ? 1 : 0.5
                  }}
                >
                  Lancer le dé 🎲
                </button>
                <button
                  onClick={()=> setModal({type:'players'})}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '8px',
                    background: '#374151',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Joueurs
                </button>
                <button
                  onClick={()=> setModal({type:'board'})}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '8px',
                    background: '#374151',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Plateau
                </button>
              </div>

              <div style={{ marginTop: '15px', fontSize: '13px', color: '#9ca3af' }}>{message}</div>
            </div>

            <div style={{
              width: '240px',
              padding: '15px',
              background: '#1e293b',
              borderRadius: '12px',
              border: '1px solid #374151'
            }}>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Ressources & artefacts</div>
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '12px', color: '#e5e7eb' }}>Artefacts</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {players[currentPlayer].artifacts.length===0 && (
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Aucun artefact</div>
                  )}
                  {players[currentPlayer].artifacts.map(a=> (
                    <div key={a.id} style={{
                      padding: '6px 8px',
                      background: 'rgba(79, 70, 229, 0.3)',
                      borderRadius: '6px',
                      fontSize: '10px'
                    }}>
                      {a.title}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '15px', fontSize: '11px', color: '#6b7280' }}>
                Déplacements bonus: {players[currentPlayer].moveBonus||0}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              onClick={resetGame}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Reset
            </button>
          </div>

          {/* Info récompenses */}
          <div style={{
            marginTop: '25px',
            padding: '20px',
            background: 'rgba(103, 58, 183, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(103, 58, 183, 0.3)'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#BB86FC' }}>
              🏆 Conditions de victoire & récompenses
            </div>
            <div style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.6' }}>
              • <strong>Victoire :</strong> Atteindre 100 mana OU contrôler 3 villes légendaires (coût ≥ 20)<br />
              • <strong>Récompenses :</strong> Pièces basées sur le mana final + bonus victoire<br />
              • <strong>Badge "Empereur d'Étheria" :</strong> Débloqué à 5 victoires (150 points bonus)
            </div>
          </div>
        </main>

        {/* Modals */}
        {modal && modal.type === 'buy' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)'
            }} onClick={()=> setModal(null)}></div>
            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '400px',
              padding: '20px',
              background: '#0f172a',
              border: '1px solid #374151',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0' }}>
                Achat: {modal.payload.cell.name}
              </h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '10px' }}>
                Coût: {modal.payload.cell.cost} mana • Loyers: {modal.payload.cell.rent}
              </p>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={()=> buyCity(modal.payload.playerIndex, modal.payload.pos)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Acheter
                </button>
                <button
                  onClick={passBuy}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#374151',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Passer
                </button>
              </div>
            </div>
          </div>
        )}

        {modal && modal.type === 'event' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)'
            }}></div>
            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '400px',
              padding: '20px',
              background: '#0f172a',
              border: '1px solid #374151',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0' }}>
                Événement: {modal.payload.card.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '10px' }}>
                {modal.payload.card.description}
              </p>
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={()=> applyEvent(modal.payload.card, modal.payload.playerIndex)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        )}

        {modal && modal.type === 'artifact' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)'
            }} onClick={()=> setModal(null)}></div>
            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '400px',
              padding: '20px',
              background: '#0f172a',
              border: '1px solid #374151',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0' }}>
                Artefact: {modal.payload.card.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '10px' }}>
                {modal.payload.card.description}
              </p>
              <div style={{ marginTop: '15px', fontSize: '11px', color: '#6b7280' }}>
                (s'applique automatiquement)
              </div>
            </div>
          </div>
        )}

        {modal && modal.type === 'victory' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)'
            }}></div>
            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '500px',
              padding: '30px',
              background: 'linear-gradient(135deg, #ca8a04, #dc2626)',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '2px solid #854d0e'
            }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 15px 0' }}>🎉 Victoire !</h2>
              <p style={{ marginTop: '15px', fontSize: '16px' }}>
                {players[modal.payload.playerIndex].name} a remporté la partie en contrôlant les Empires d'Étheria.
              </p>
              <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={resetGame}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: 'white',
                    color: 'black',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  Recommencer
                </button>
              </div>
            </div>
          </div>
        )}

        {modal && modal.type === 'players' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)'
            }} onClick={()=> setModal(null)}></div>
            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '400px',
              padding: '20px',
              background: '#0f172a',
              border: '1px solid #374151',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 15px 0' }}>Joueurs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {players.map(p=> (
                  <div key={p.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                    background: '#1e293b',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: p.color
                      }}></div>
                      <div style={{ fontSize: '14px' }}>{p.name}</div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>Mana: {p.mana}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {modal && modal.type === 'board' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)'
            }} onClick={()=> setModal(null)}></div>
            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '700px',
              padding: '20px',
              background: '#0f172a',
              border: '1px solid #374151',
              borderRadius: '12px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 15px 0' }}>Plateau</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
              }}>
                {board.map(c=> (
                  <div key={c.id} style={{
                    padding: '10px',
                    background: '#1e293b',
                    borderRadius: '8px',
                    border: '1px solid #374151'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{c.name || c.type}</div>
                    {c.type==='city' && (
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                        Coût: {c.cost} • Loyer: {c.rent}
                      </div>
                    )}
                    {c.owner!==null && (
                      <div style={{ fontSize: '11px', marginTop: '4px' }}>
                        Propriétaire: {players[c.owner].name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <footer style={{ marginTop: '30px', fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>
          Empires d'Étheria — Un jeu de stratégie pour JeuTaime
        </footer>
      </div>
    </div>
  );
}
