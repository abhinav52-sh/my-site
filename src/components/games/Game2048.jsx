import React, { useState, useEffect, useCallback } from 'react';

const Game2048 = () => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('2048HighScore') || '0');
  });
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'won', 'lost'
  const [hasWon, setHasWon] = useState(false);

  const initializeGrid = () => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewTile(newGrid);
    addNewTile(newGrid);
    return newGrid;
  };

  const addNewTile = (grid) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) emptyCells.push({ i, j });
      }
    }
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const startGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameState('playing');
    setHasWon(false);
  };

  const move = useCallback((direction) => {
    if (gameState !== 'playing') return;

    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const moveLeft = (row) => {
      const filtered = row.filter(val => val !== 0);
      const merged = [];
      let skip = false;

      for (let i = 0; i < filtered.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          skip = true;
          moved = true;

          // Check for win
          if (filtered[i] * 2 === 2048 && !hasWon) {
            setHasWon(true);
            setGameState('won');
          }
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < 4) merged.push(0);
      return merged;
    };

    const rotate = (grid) => {
      const rotated = Array(4).fill(null).map(() => Array(4).fill(0));
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          rotated[j][3 - i] = grid[i][j];
        }
      }
      return rotated;
    };

    let workingGrid = newGrid;

    // Rotate grid to make all moves equivalent to left
    if (direction === 'up') {
      workingGrid = rotate(rotate(rotate(workingGrid)));
    } else if (direction === 'right') {
      workingGrid = rotate(rotate(workingGrid));
    } else if (direction === 'down') {
      workingGrid = rotate(workingGrid);
    }

    // Move left
    const movedGrid = workingGrid.map(row => {
      const newRow = moveLeft(row);
      if (JSON.stringify(newRow) !== JSON.stringify(row)) moved = true;
      return newRow;
    });

    // Rotate back
    if (direction === 'up') {
      workingGrid = rotate(movedGrid);
    } else if (direction === 'right') {
      workingGrid = rotate(rotate(movedGrid));
    } else if (direction === 'down') {
      workingGrid = rotate(rotate(rotate(movedGrid)));
    } else {
      workingGrid = movedGrid;
    }

    if (moved) {
      addNewTile(workingGrid);
      setGrid(workingGrid);
      setScore(newScore);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('2048HighScore', newScore.toString());
      }

      // Check if game is lost
      if (!canMove(workingGrid)) {
        setGameState('lost');
      }
    }
  }, [grid, score, gameState, hasWon, highScore]);

  const canMove = (grid) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return true;
      }
    }

    // Check for adjacent equal tiles
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j < 3 && grid[i][j] === grid[i][j + 1]) return true;
        if (i < 3 && grid[i][j] === grid[i + 1][j]) return true;
      }
    }

    return false;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      e.preventDefault();
      const key = e.key;

      if (key === 'ArrowLeft') move('left');
      else if (key === 'ArrowRight') move('right');
      else if (key === 'ArrowUp') move('up');
      else if (key === 'ArrowDown') move('down');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, gameState]);

  const getTileColor = (value) => {
    const colors = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[value] || '#3c3a32';
  };

  const getTileTextColor = (value) => {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: 'transparent',
      height: '100%',
      color: 'var(--os-theme-text)'
    }}>
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '30px',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        <div>Score: <span style={{ color: 'var(--os-theme-accent)' }}>{score}</span></div>
        <div>Best: <span style={{ color: '#f1c40f' }}>{highScore}</span></div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 80px)',
        gridTemplateRows: 'repeat(4, 80px)',
        gap: '10px',
        background: 'var(--os-theme-card-bg)',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        {grid.length > 0 && grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                background: getTileColor(cell),
                color: getTileTextColor(cell),
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: cell >= 1000 ? '24px' : '32px',
                fontWeight: 'bold',
                transition: 'all 0.15s ease-in-out'
              }}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {gameState === 'ready' && (
          <button onClick={startGame} style={buttonStyle}>New Game</button>
        )}
        {gameState === 'playing' && (
          <button onClick={startGame} style={buttonStyle}>Restart</button>
        )}
        {gameState === 'won' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#2ecc71', marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
              You Win! 🎉
            </div>
            <button onClick={startGame} style={buttonStyle}>Play Again</button>
          </div>
        )}
        {gameState === 'lost' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#e74c3c', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
              Game Over!
            </div>
            <button onClick={startGame} style={buttonStyle}>Try Again</button>
          </div>
        )}
      </div>

      <div style={{ fontSize: '12px', color: '#776e65', textAlign: 'center' }}>
        Use Arrow Keys to move tiles<br />
        Join tiles to reach 2048!
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  background: 'var(--os-theme-accent)',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px'
};

export default Game2048;
