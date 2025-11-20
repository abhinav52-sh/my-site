import React, { useState, useEffect, useRef } from 'react';

const MazeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'won'
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [bestTimes, setBestTimes] = useState(() => {
    const saved = localStorage.getItem('mazeBestTimes');
    return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null };
  });

  const gameRef = useRef({
    maze: [],
    player: { x: 1, y: 1 },
    exit: { x: 0, y: 0 },
    cellSize: 30,
    rows: 15,
    cols: 15
  });

  const getDifficultySize = (diff) => {
    if (diff === 'easy') return { rows: 10, cols: 10 };
    if (diff === 'medium') return { rows: 15, cols: 15 };
    return { rows: 20, cols: 20 };
  };

  const generateMaze = (rows, cols) => {
    // Initialize grid with all walls
    const maze = Array(rows).fill(null).map(() => Array(cols).fill(1));

    // Recursive backtracking maze generation
    const carve = (x, y) => {
      const directions = [
        [0, -1], [1, 0], [0, 1], [-1, 0]
      ].sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && maze[ny][nx] === 1) {
          maze[y + dy][x + dx] = 0;
          maze[ny][nx] = 0;
          carve(nx, ny);
        }
      }
    };

    maze[1][1] = 0;
    carve(1, 1);

    // Set exit
    maze[rows - 2][cols - 2] = 0;

    return maze;
  };

  const startGame = () => {
    const { rows, cols } = getDifficultySize(difficulty);
    const maze = generateMaze(rows, cols);

    gameRef.current = {
      maze,
      player: { x: 1, y: 1 },
      exit: { x: cols - 2, y: rows - 2 },
      cellSize: difficulty === 'hard' ? 20 : difficulty === 'medium' ? 30 : 40,
      rows,
      cols
    };

    setMoves(0);
    setTime(0);
    setGameState('playing');
    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    const width = game.cols * game.cellSize;
    const height = game.rows * game.cellSize;
    canvas.width = width;
    canvas.height = height;

    // Clear
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw maze
    for (let y = 0; y < game.rows; y++) {
      for (let x = 0; x < game.cols; x++) {
        if (game.maze[y][x] === 1) {
          ctx.fillStyle = '#444';
          ctx.fillRect(x * game.cellSize, y * game.cellSize, game.cellSize, game.cellSize);
        } else {
          ctx.fillStyle = '#222';
          ctx.fillRect(x * game.cellSize, y * game.cellSize, game.cellSize, game.cellSize);
        }
      }
    }

    // Draw exit
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(
      game.exit.x * game.cellSize + 2,
      game.exit.y * game.cellSize + 2,
      game.cellSize - 4,
      game.cellSize - 4
    );

    // Draw player
    ctx.fillStyle = '#3daee9';
    ctx.beginPath();
    ctx.arc(
      game.player.x * game.cellSize + game.cellSize / 2,
      game.player.y * game.cellSize + game.cellSize / 2,
      game.cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  const movePlayer = (dx, dy) => {
    if (gameState !== 'playing') return;

    const game = gameRef.current;
    const newX = game.player.x + dx;
    const newY = game.player.y + dy;

    // Check bounds and walls
    if (
      newX >= 0 && newX < game.cols &&
      newY >= 0 && newY < game.rows &&
      game.maze[newY][newX] === 0
    ) {
      game.player.x = newX;
      game.player.y = newY;
      setMoves(m => m + 1);
      draw();

      // Check if reached exit
      if (newX === game.exit.x && newY === game.exit.y) {
        setGameState('won');

        // Update best time
        if (bestTimes[difficulty] === null || time < bestTimes[difficulty]) {
          const newBestTimes = { ...bestTimes, [difficulty]: time };
          setBestTimes(newBestTimes);
          localStorage.setItem('mazeBestTimes', JSON.stringify(newBestTimes));
        }
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      e.preventDefault();
      const key = e.key;

      if (key === 'ArrowUp') movePlayer(0, -1);
      else if (key === 'ArrowDown') movePlayer(0, 1);
      else if (key === 'ArrowLeft') movePlayer(-1, 0);
      else if (key === 'ArrowRight') movePlayer(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      draw();
    }
  }, [gameState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      height: '100%',
      color: '#fff',
      overflowY: 'auto'
    }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: '24px' }}>Maze Runner</h2>

      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '15px',
        fontSize: '14px'
      }}>
        <div>Time: <span style={{ fontWeight: 'bold', color: '#3daee9' }}>{formatTime(time)}</span></div>
        <div>Moves: <span style={{ fontWeight: 'bold', color: '#f1c40f' }}>{moves}</span></div>
        {bestTimes[difficulty] && (
          <div>Best: <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
            {formatTime(bestTimes[difficulty])}
          </span></div>
        )}
      </div>

      {gameState === 'ready' && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '10px', fontSize: '14px' }}>Select Difficulty:</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                style={{
                  ...buttonStyle,
                  background: difficulty === diff ? '#3daee9' : '#555',
                  textTransform: 'capitalize'
                }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          border: '3px solid #fff',
          borderRadius: '8px',
          marginBottom: '15px',
          maxWidth: '100%',
          height: 'auto'
        }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {gameState === 'ready' && (
          <button onClick={startGame} style={buttonStyle}>Start Game</button>
        )}
        {gameState === 'playing' && (
          <button onClick={startGame} style={buttonStyle}>New Maze</button>
        )}
        {gameState === 'won' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              color: '#2ecc71',
              marginBottom: '10px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              🎉 You Escaped! 🎉
            </div>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>
              Time: {formatTime(time)} | Moves: {moves}
            </div>
            <button onClick={startGame} style={buttonStyle}>Play Again</button>
          </div>
        )}
      </div>

      <div style={{ fontSize: '12px', opacity: 0.9, textAlign: 'center' }}>
        Use Arrow Keys to navigate • Reach the green exit<br />
        🔵 Player • 🟢 Exit
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  background: '#3daee9',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px'
};

export default MazeGame;
