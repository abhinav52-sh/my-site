import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { THEMES } from '../../data/themes';
import { trackGameStart } from '../../utils/analytics';

// Tetromino Definitions
const TETROMINOES = {
  I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: '#00f0f0' },
  J: { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: '#f0a000' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: '#00f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: '#a000f0' },
  Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: '#f00000' },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

const TetrisGame = () => {
  const { osTheme } = useOS();
  const currentTheme = THEMES[osTheme] || THEMES.default;

  const [board, setBoard] = useState(createBoard());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const gameLoopRef = useRef();

  // Generate random piece
  const randomPiece = useCallback(() => {
    const keys = Object.keys(TETROMINOES);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return TETROMINOES[key];
  }, []);

  // Initialize Game
  const initGame = useCallback(() => {
    setBoard(createBoard());
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setPaused(false);
    const first = randomPiece();
    const second = randomPiece();
    setCurrentPiece(first);
    setNextPiece(second);
    setPos({ x: Math.floor(BOARD_WIDTH / 2) - Math.floor(first.shape[0].length / 2), y: 0 });
  }, [randomPiece]);

  useEffect(() => {
    initGame();
    // Track game start
    trackGameStart('Tetris');
  }, [initGame]);

  // Collision Detection
  const checkCollision = (piece, position, boardState) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const newX = x + position.x;
          const newY = y + position.y;

          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && boardState[newY][newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Lock Piece
  const lockPiece = () => {
    const newBoard = board.map(row => [...row]);

    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          if (y + pos.y >= 0) {
            newBoard[y + pos.y][x + pos.x] = currentPiece.color;
          }
        }
      });
    });

    // Check for cleared lines
    let linesCleared = 0;
    const finalBoard = newBoard.filter(row => {
      const full = row.every(cell => cell !== 0);
      if (full) linesCleared++;
      return !full;
    });

    while (finalBoard.length < BOARD_HEIGHT) {
      finalBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    setBoard(finalBoard);

    if (linesCleared > 0) {
      setScore(prev => prev + (linesCleared * 100 * level));
      if (score > level * 500) setLevel(prev => prev + 1);
    }

    // Spawn next piece
    const newPiece = nextPiece;
    const next = randomPiece();
    const newPos = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), y: 0 };

    if (checkCollision(newPiece, newPos, finalBoard)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setNextPiece(next);
      setPos(newPos);
    }
  };

  // Movement
  const move = (dir) => {
    if (gameOver || paused) return;
    const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
    if (!checkCollision(currentPiece, newPos, board)) {
      setPos(newPos);
    } else if (dir.y > 0) {
      lockPiece();
    }
  };

  const rotate = () => {
    if (gameOver || paused) return;
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );
    const rotatedPiece = { ...currentPiece, shape: rotatedShape };
    if (!checkCollision(rotatedPiece, pos, board)) {
      setCurrentPiece(rotatedPiece);
    }
  };

  const drop = () => {
    move({ x: 0, y: 1 });
  };

  // Game Loop
  useEffect(() => {
    if (gameOver || paused) return;
    const speed = Math.max(100, 1000 - (level * 100));
    gameLoopRef.current = setInterval(drop, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [pos, gameOver, paused, level, currentPiece]); // Dependencies crucial for closure

  // Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': move({ x: -1, y: 0 }); break;
        case 'ArrowRight': move({ x: 1, y: 0 }); break;
        case 'ArrowDown': drop(); break;
        case 'ArrowUp': rotate(); break;
        case 'p': setPaused(prev => !prev); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pos, currentPiece, board, gameOver, paused]);

  // Render Helpers
  const getCellColor = (x, y) => {
    // Check active piece
    if (currentPiece) {
      const pieceY = y - pos.y;
      const pieceX = x - pos.x;
      if (
        pieceY >= 0 && pieceY < currentPiece.shape.length &&
        pieceX >= 0 && pieceX < currentPiece.shape[0].length &&
        currentPiece.shape[pieceY][pieceX] !== 0
      ) {
        return currentPiece.color;
      }
    }
    // Check board
    return board[y][x] !== 0 ? board[y][x] : 'rgba(255,255,255,0.05)';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: 'transparent',
      color: currentTheme.text,
      fontFamily: "'Press Start 2P', monospace", // If available, else fallback
      padding: '20px'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>

        {/* Game Board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 25px)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 25px)`,
          gap: '1px',
          background: 'rgba(0,0,0,0.3)',
          border: `2px solid ${currentTheme.accent}`,
          padding: '5px'
        }}>
          {board.map((row, y) => row.map((_, x) => (
            <div key={`${x}-${y}`} style={{
              width: '25px',
              height: '25px',
              background: getCellColor(x, y),
              borderRadius: '2px',
              boxShadow: getCellColor(x, y) !== 'rgba(255,255,255,0.05)' ? 'inset 0 0 5px rgba(0,0,0,0.5)' : 'none'
            }} />
          )))}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '120px' }}>

          {/* Next Piece */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '15px',
            borderRadius: '8px',
            border: `1px solid ${currentTheme.accent}40`
          }}>
            <div style={{ fontSize: '12px', marginBottom: '10px', color: '#aaa' }}>NEXT</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(4, 15px)`,
              gridTemplateRows: `repeat(4, 15px)`,
              gap: '1px'
            }}>
              {nextPiece && Array(4).fill(0).map((_, y) => Array(4).fill(0).map((_, x) => {
                const hasBlock = nextPiece.shape[y] && nextPiece.shape[y][x];
                return (
                  <div key={`next-${x}-${y}`} style={{
                    width: '15px',
                    height: '15px',
                    background: hasBlock ? nextPiece.color : 'transparent'
                  }} />
                );
              }))}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '15px',
            borderRadius: '8px',
            border: `1px solid ${currentTheme.accent}40`
          }}>
            <div style={{ fontSize: '12px', color: '#aaa' }}>SCORE</div>
            <div style={{ fontSize: '20px', color: currentTheme.accent, marginBottom: '10px' }}>{score}</div>

            <div style={{ fontSize: '12px', color: '#aaa' }}>LEVEL</div>
            <div style={{ fontSize: '20px', color: '#fff' }}>{level}</div>
          </div>

          {/* Controls Info */}
          <div style={{ fontSize: '10px', color: '#888', lineHeight: '1.5' }}>
            ↑ Rotate<br />
            ← → Move<br />
            ↓ Drop<br />
            P Pause
          </div>

        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <h2 style={{ color: '#e74c3c', fontSize: '32px', marginBottom: '20px' }}>GAME OVER</h2>
          <div style={{ fontSize: '18px', marginBottom: '30px' }}>Score: {score}</div>
          <button
            onClick={initGame}
            style={{
              padding: '12px 24px',
              background: currentTheme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {/* Paused Overlay */}
      {paused && !gameOver && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <h2 style={{ color: '#fff', letterSpacing: '5px' }}>PAUSED</h2>
        </div>
      )}

    </div>
  );
};

export default TetrisGame;
