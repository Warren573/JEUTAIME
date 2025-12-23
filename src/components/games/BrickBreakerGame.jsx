import React, { useState, useEffect, useRef } from 'react';
import { awardPoints, checkAndAwardBadge } from '../../utils/pointsSystem';
import ScreenHeader from '../common/ScreenHeader';

export default function BrickBreakerGame({ setGameScreen, currentUser, setUserCoins }) {
  const canvasRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const animationFrameRef = useRef(null);

  // Game config - Reduced for mobile
  const CANVAS_WIDTH = 340;
  const CANVAS_HEIGHT = 280;
  const PADDLE_WIDTH = 60;
  const PADDLE_HEIGHT = 10;
  const BALL_RADIUS = 5;
  const BRICK_ROWS = 5;
  const BRICK_COLS = 8;
  const BRICK_WIDTH = 38;
  const BRICK_HEIGHT = 15;
  const BRICK_PADDING = 3;
  const BRICK_OFFSET_TOP = 30;
  const BRICK_OFFSET_LEFT = 7;

  // Game state refs
  const gameStateRef = useRef({
    paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 30,
    ballDX: 3,
    ballDY: -3,
    bricks: [],
    rightPressed: false,
    leftPressed: false,
    score: 0,
    lives: 3,
    hasAwarded: false
  });

  // Initialize bricks
  useEffect(() => {
    const bricks = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      bricks[r] = [];
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks[r][c] = { x: 0, y: 0, status: 1 };
      }
    }
    gameStateRef.current.bricks = bricks;
  }, []);

  // Touch control handler
  const handleTouchMove = (e) => {
    if (!gameRunning) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;

    // Map touch position to paddle position (340px width, 60px paddle)
    const scaledTouchX = touchX / (rect.width / CANVAS_WIDTH);
    const newPaddleX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, scaledTouchX - PADDLE_WIDTH / 2));
    gameStateRef.current.paddleX = newPaddleX;
  };

  // Keyboard controls
  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        gameStateRef.current.rightPressed = true;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        gameStateRef.current.leftPressed = true;
      }
    };

    const keyUpHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        gameStateRef.current.rightPressed = false;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        gameStateRef.current.leftPressed = false;
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  // Award rewards when game is won
  useEffect(() => {
    if (gameWon && currentUser && !gameStateRef.current.hasAwarded) {
      gameStateRef.current.hasAwarded = true;

      const gamesStats = JSON.parse(localStorage.getItem('jeutaime_games_stats') || '{}');
      const userEmail = currentUser.email;

      if (!gamesStats[userEmail]) {
        gamesStats[userEmail] = { gamesWon: 0, gamesLost: 0 };
      }

      gamesStats[userEmail].gamesWon++;

      // Award points
      awardPoints(userEmail, 'GAME_WON');

      // Award coins based on score
      const coinReward = Math.floor(score / 10) + 50;
      setUserCoins(c => c + coinReward);

      // Update user coins in localStorage
      const users = JSON.parse(localStorage.getItem('jeutaime_users') || '[]');
      const userIndex = users.findIndex(u => u.email === userEmail);
      if (userIndex !== -1) {
        users[userIndex].coins = (users[userIndex].coins || 0) + coinReward;
        localStorage.setItem('jeutaime_users', JSON.stringify(users));
        const currentUserData = JSON.parse(localStorage.getItem('jeutaime_current_user'));
        if (currentUserData && currentUserData.email === userEmail) {
          currentUserData.coins = users[userIndex].coins;
          localStorage.setItem('jeutaime_current_user', JSON.stringify(currentUserData));
        }
      }

      // Check for GAMER badge (10 wins)
      if (gamesStats[userEmail].gamesWon >= 10) {
        checkAndAwardBadge(userEmail, 'gamer');
      }

      localStorage.setItem('jeutaime_games_stats', JSON.stringify(gamesStats));
      console.log(`🧱 Victoire au Casse-Brique ! +50 pts, +${coinReward} 🪙`);
    }
  }, [gameWon, currentUser, score, setUserCoins]);

  // Draw functions
  const drawBall = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#E91E63';
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx, x) => {
    ctx.beginPath();
    ctx.roundRect(x, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT, 5);
    ctx.fillStyle = '#2196F3';
    ctx.fill();
    ctx.closePath();
  };

  const drawBricks = (ctx, bricks) => {
    const colors = ['#FF6B9D', '#C44569', '#F8B500', '#4ECDC4', '#45B7D1'];

    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        if (bricks[r][c].status === 1) {
          const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
          const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
          bricks[r][c].x = brickX;
          bricks[r][c].y = brickY;

          ctx.beginPath();
          ctx.roundRect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT, 3);
          ctx.fillStyle = colors[r % colors.length];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };

  const drawScore = (ctx, score) => {
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${score}`, 10, 20);
  };

  const drawLives = (ctx, lives) => {
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Vies: ${lives}`, CANVAS_WIDTH - 70, 20);
  };

  const collisionDetection = () => {
    const state = gameStateRef.current;

    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        const brick = state.bricks[r][c];
        if (brick.status === 1) {
          if (
            state.ballX > brick.x &&
            state.ballX < brick.x + BRICK_WIDTH &&
            state.ballY > brick.y &&
            state.ballY < brick.y + BRICK_HEIGHT
          ) {
            state.ballDY = -state.ballDY;
            brick.status = 0;
            state.score += 10;
            setScore(state.score);

            // Check if all bricks are destroyed
            let allBricksDestroyed = true;
            for (let r2 = 0; r2 < BRICK_ROWS; r2++) {
              for (let c2 = 0; c2 < BRICK_COLS; c2++) {
                if (state.bricks[r2][c2].status === 1) {
                  allBricksDestroyed = false;
                  break;
                }
              }
              if (!allBricksDestroyed) break;
            }

            if (allBricksDestroyed) {
              setGameWon(true);
              setGameRunning(false);
            }
          }
        }
      }
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw game elements
    drawBricks(ctx, state.bricks);
    drawBall(ctx, state.ballX, state.ballY);
    drawPaddle(ctx, state.paddleX);
    drawScore(ctx, state.score);
    drawLives(ctx, state.lives);

    // Collision detection
    collisionDetection();

    // Ball collision with walls
    if (state.ballX + state.ballDX > CANVAS_WIDTH - BALL_RADIUS || state.ballX + state.ballDX < BALL_RADIUS) {
      state.ballDX = -state.ballDX;
    }
    if (state.ballY + state.ballDY < BALL_RADIUS) {
      state.ballDY = -state.ballDY;
    } else if (state.ballY + state.ballDY > CANVAS_HEIGHT - BALL_RADIUS - 10) {
      // Check paddle collision
      if (state.ballX > state.paddleX && state.ballX < state.paddleX + PADDLE_WIDTH) {
        state.ballDY = -state.ballDY;

        // Add angle based on where ball hits paddle
        const hitPos = (state.ballX - state.paddleX) / PADDLE_WIDTH;
        state.ballDX = (hitPos - 0.5) * 6;
      } else {
        // Ball missed paddle
        state.lives--;
        setLives(state.lives);

        if (state.lives === 0) {
          setGameOver(true);
          setGameRunning(false);
        } else {
          // Reset ball position
          state.ballX = CANVAS_WIDTH / 2;
          state.ballY = CANVAS_HEIGHT - 30;
          state.ballDX = 3;
          state.ballDY = -3;
          state.paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
        }
      }
    }

    // Move ball
    state.ballX += state.ballDX;
    state.ballY += state.ballDY;

    // Move paddle
    if (state.rightPressed && state.paddleX < CANVAS_WIDTH - PADDLE_WIDTH) {
      state.paddleX += 6;
    } else if (state.leftPressed && state.paddleX > 0) {
      state.paddleX -= 6;
    }

    if (gameRunning) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }
  };

  useEffect(() => {
    if (gameRunning) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameRunning]);

  const startGame = () => {
    // Reset game state
    const bricks = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      bricks[r] = [];
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks[r][c] = { x: 0, y: 0, status: 1 };
      }
    }

    gameStateRef.current = {
      paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT - 30,
      ballDX: 3,
      ballDY: -3,
      bricks: bricks,
      rightPressed: false,
      leftPressed: false,
      score: 0,
      lives: 3,
      hasAwarded: false
    };

    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setGameRunning(true);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      maxHeight: '100dvh',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
      background: 'var(--color-beige-light)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <ScreenHeader
        icon="🧱"
        title="Casse Brique"
        subtitle="Détruis toutes les briques avec la balle !"
        onBack={() => setGameScreen(null)}
      />

      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '0 var(--spacing-md) var(--spacing-md) var(--spacing-md)'
      }}>
      <div style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
        <div style={{ marginBottom: '15px', color: '#888' }}>
          {!gameRunning && !gameOver && !gameWon && (
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>
              👆 Glisse ton doigt sur l'écran pour déplacer la raquette
            </p>
          )}
        </div>

        <div style={{
          background: '#0a0a0a',
          borderRadius: '10px',
          padding: '10px',
          display: 'inline-block',
          marginBottom: '20px',
          maxWidth: '100%'
        }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onTouchMove={handleTouchMove}
            style={{ display: 'block', borderRadius: '8px', maxWidth: '100%', height: 'auto', touchAction: 'none' }}
          />
        </div>

        {gameWon && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '24px', color: '#4CAF50', marginBottom: '10px' }}>
              🎉 Victoire !
            </h3>
            <p style={{ color: '#888' }}>
              Score final: {score} points
            </p>
          </div>
        )}

        {gameOver && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '24px', color: '#E91E63', marginBottom: '10px' }}>
              💔 Game Over
            </h3>
            <p style={{ color: '#888' }}>
              Score: {score} points
            </p>
          </div>
        )}

        <button
          onClick={startGame}
          disabled={gameRunning}
          style={{
            padding: '12px 24px',
            background: gameRunning ? '#555' : 'linear-gradient(135deg, #E91E63, #C2185B)',
            border: 'none',
            color: 'white',
            borderRadius: '10px',
            cursor: gameRunning ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          {gameRunning ? '🎮 Jeu en cours...' : gameWon || gameOver ? '🔄 Rejouer' : '▶️ Démarrer'}
        </button>
      </div>
      </div>
    </div>
  );
}
