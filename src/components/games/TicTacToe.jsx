import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('tictactoeScores');
    return saved ? JSON.parse(saved) : { X: 0, O: 0, draws: 0 };
  });

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner || !isXNext) return; // Player can only play when it's X's turn

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      updateScores(result.winner);
      return;
    }

    // Check for draw
    if (newBoard.every(cell => cell !== null)) {
      setWinner('draw');
      updateScores('draw');
      return;
    }

    // AI move after short delay
    setTimeout(() => makeAIMove(newBoard), 500);
  };

  const makeAIMove = (currentBoard) => {
    const emptyIndices = currentBoard
      .map((cell, idx) => cell === null ? idx : null)
      .filter(idx => idx !== null);

    if (emptyIndices.length === 0) return;

    // Try to win
    for (let idx of emptyIndices) {
      const testBoard = [...currentBoard];
      testBoard[idx] = 'O';
      if (checkWinner(testBoard)?.winner === 'O') {
        makeMove(idx, currentBoard);
        return;
      }
    }

    // Block player from winning
    for (let idx of emptyIndices) {
      const testBoard = [...currentBoard];
      testBoard[idx] = 'X';
      if (checkWinner(testBoard)?.winner === 'X') {
        makeMove(idx, currentBoard);
        return;
      }
    }

    // Take center if available
    if (emptyIndices.includes(4)) {
      makeMove(4, currentBoard);
      return;
    }

    // Take corner
    const corners = [0, 2, 6, 8].filter(idx => emptyIndices.includes(idx));
    if (corners.length > 0) {
      makeMove(corners[Math.floor(Math.random() * corners.length)], currentBoard);
      return;
    }

    // Take any available space
    makeMove(emptyIndices[Math.floor(Math.random() * emptyIndices.length)], currentBoard);
  };

  const makeMove = (index, currentBoard) => {
    const newBoard = [...currentBoard];
    newBoard[index] = 'O';
    setBoard(newBoard);
    setIsXNext(true);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      updateScores(result.winner);
      return;
    }

    // Check for draw
    if (newBoard.every(cell => cell !== null)) {
      setWinner('draw');
      updateScores('draw');
    }
  };

  const updateScores = (result) => {
    const newScores = { ...scores };
    if (result === 'draw') {
      newScores.draws++;
    } else {
      newScores[result]++;
    }
    setScores(newScores);
    localStorage.setItem('tictactoeScores', JSON.stringify(newScores));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const resetScores = () => {
    const newScores = { X: 0, O: 0, draws: 0 };
    setScores(newScores);
    localStorage.setItem('tictactoeScores', JSON.stringify(newScores));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      height: '100%',
      color: '#fff'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>Tic-Tac-Toe</h2>

      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <div>You (X): <span style={{ fontWeight: 'bold', color: '#3daee9' }}>{scores.X}</span></div>
        <div>AI (O): <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>{scores.O}</span></div>
        <div>Draws: <span style={{ fontWeight: 'bold', color: '#f1c40f' }}>{scores.draws}</span></div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 100px)',
        gridTemplateRows: 'repeat(3, 100px)',
        gap: '8px',
        marginBottom: '20px',
        background: 'rgba(0,0,0,0.2)',
        padding: '8px',
        borderRadius: '12px'
      }}>
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            style={{
              background: winningLine.includes(index)
                ? 'rgba(46, 204, 113, 0.3)'
                : 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '48px',
              fontWeight: 'bold',
              cursor: cell || winner || !isXNext ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: cell === 'X' ? '#3daee9' : '#e74c3c',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => {
              if (!cell && !winner && isXNext) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!winningLine.includes(index)) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              }
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {cell}
          </div>
        ))}
      </div>

      {winner && (
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '15px 30px',
          borderRadius: '8px',
          marginBottom: '15px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {winner === 'draw' ? "It's a Draw! 🤝" :
            winner === 'X' ? "You Win! 🎉" : "AI Wins! 🤖"}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={resetGame} style={buttonStyle}>New Game</button>
        <button onClick={resetScores} style={{ ...buttonStyle, background: '#e74c3c' }}>
          Reset Scores
        </button>
      </div>

      <div style={{ fontSize: '12px', opacity: 0.9, textAlign: 'center' }}>
        {!winner && isXNext && "Your turn (X)"}
        {!winner && !isXNext && "AI is thinking..."}
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

export default TicTacToe;
