import React, { useState, useEffect, useRef } from 'react';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0');
  });

  const gameRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    gridSize: 20,
    tileSize: 20
  });

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const game = gameRef.current;
      game.direction = game.nextDirection;

      const head = { ...game.snake[0] };
      head.x += game.direction.x;
      head.y += game.direction.y;

      // Check collisions
      if (
        head.x < 0 || head.x >= game.gridSize ||
        head.y < 0 || head.y >= game.gridSize ||
        game.snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameState('gameOver');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        return;
      }

      game.snake.unshift(head);

      // Check food
      if (head.x === game.food.x && head.y === game.food.y) {
        setScore(s => s + 10);
        game.food = {
          x: Math.floor(Math.random() * game.gridSize),
          y: Math.floor(Math.random() * game.gridSize)
        };
      } else {
        game.snake.pop();
      }

      draw();
    }, 150);

    return () => clearInterval(interval);
  }, [gameState, score, highScore]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#111';
    for (let i = 0; i <= game.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * game.tileSize, 0);
      ctx.lineTo(i * game.tileSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * game.tileSize);
      ctx.lineTo(canvas.width, i * game.tileSize);
      ctx.stroke();
    }

    // Snake
    game.snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#3daee9' : '#2a8bb8';
      ctx.fillRect(
        segment.x * game.tileSize + 1,
        segment.y * game.tileSize + 1,
        game.tileSize - 2,
        game.tileSize - 2
      );
    });

    // Food
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(
      game.food.x * game.tileSize + 2,
      game.food.y * game.tileSize + 2,
      game.tileSize - 4,
      game.tileSize - 4
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      const game = gameRef.current;
      const key = e.key;

      if (key === 'ArrowUp' && game.direction.y === 0) {
        game.nextDirection = { x: 0, y: -1 };
      } else if (key === 'ArrowDown' && game.direction.y === 0) {
        game.nextDirection = { x: 0, y: 1 };
      } else if (key === 'ArrowLeft' && game.direction.x === 0) {
        game.nextDirection = { x: -1, y: 0 };
      } else if (key === 'ArrowRight' && game.direction.x === 0) {
        game.nextDirection = { x: 1, y: 0 };
      } else if (key === ' ') {
        e.preventDefault();
        setGameState('paused');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    gameRef.current = {
      snake: [{ x: 10, y: 10 }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: 15, y: 15 },
      gridSize: 20,
      tileSize: 20
    };
    setScore(0);
    setGameState('playing');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', background: 'transparent', height: '100%', color: 'var(--os-theme-text)' }}>
      <div style={{ marginBottom: '15px', display: 'flex', gap: '20px', fontSize: '14px' }}>
        <div>Score: <span style={{ color: 'var(--os-theme-accent)', fontWeight: 'bold' }}>{score}</span></div>
        <div>High Score: <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>{highScore}</span></div>
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '2px solid #333', borderRadius: '4px', background: 'rgba(0,0,0,0.5)' }}
      />

      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        {gameState === 'ready' && (
          <button onClick={startGame} style={buttonStyle}>Start Game</button>
        )}
        {gameState === 'playing' && (
          <button onClick={() => setGameState('paused')} style={buttonStyle}>Pause</button>
        )}
        {gameState === 'paused' && (
          <>
            <button onClick={() => setGameState('playing')} style={buttonStyle}>Resume</button>
            <button onClick={startGame} style={buttonStyle}>Restart</button>
          </>
        )}
        {gameState === 'gameOver' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#e74c3c', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>Game Over!</div>
            <button onClick={startGame} style={buttonStyle}>Play Again</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        Use Arrow Keys to move • Space to pause
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '8px 16px',
  background: 'var(--os-theme-accent)',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px'
};

export default SnakeGame;
