import React, { useState } from 'react';
import axios from 'axios';
import './TicTacToe.css';

const initialBoard = Array(9).fill(null);

// returns { winner: 'X'|'O'|'draw'|null, line: [i,j,k] }
const calculateWinner = (b) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (let [a, c, d] of lines) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return { winner: b[a], line: [a, c, d] };
    }
  }
  if (b.every(x => x !== null)) {
    return { winner: 'draw', line: [] };
  }
  return { winner: null, line: [] };
};

// Minimax for optimal AI
const minimax = (board, isMax, aiSym, huSym) => {
  const { winner } = calculateWinner(board);
  if (winner === aiSym) return { score: 1 };
  if (winner === huSym) return { score: -1 };
  if (winner === 'draw') return { score: 0 };

  const moves = [];
  board.forEach((cell, idx) => {
    if (!cell) {
      const b2 = [...board];
      b2[idx] = isMax ? aiSym : huSym;
      const { score } = minimax(b2, !isMax, aiSym, huSym);
      moves.push({ idx, score });
    }
  });

  return isMax
    ? moves.reduce((best, m) => m.score > best.score ? m : best)
    : moves.reduce((best, m) => m.score < best.score ? m : best);
};

export default function TicTacToe() {
  const [name, setName]       = useState('');
  const [huSym, setHuSym]     = useState('X');
  const [aiSym, setAiSym]     = useState('O');
  const [board, setBoard]     = useState(initialBoard);
  const [moves, setMoves]     = useState([]);
  const [winner, setWinner]   = useState(null);
  const [winLine, setWinLine] = useState([]);
  const [started, setStarted] = useState(false);

  const startGame = () => {
    if (!name.trim()) return alert('Enter your name');
    setAiSym(huSym === 'X' ? 'O' : 'X');
    setStarted(true);
  };

  const handleClick = idx => {
    if (!started || board[idx] || winner) return;

    // Human move
    const b1 = [...board];
    b1[idx] = huSym;
    setMoves(m => [...m, { player: 'human', index: idx, symbol: huSym }]);
    setBoard(b1);

    const { winner: w1, line: l1 } = calculateWinner(b1);
    if (w1) return finish(w1, l1);

    // AI move
    const { idx: aiIdx } = minimax(b1, true, aiSym, huSym);
    const b2 = [...b1];
    b2[aiIdx] = aiSym;
    setMoves(m => [...m, { player: 'computer', index: aiIdx, symbol: aiSym }]);
    setBoard(b2);

    const { winner: w2, line: l2 } = calculateWinner(b2);
    if (w2) finish(w2, l2);
  };

  const finish = (win, line = []) => {
    setWinner(win);
    setWinLine(line);

    const payload = {
      playerName:     name,
      humanSymbol:    huSym,
      computerSymbol: aiSym,
      moves,
      winner: win === 'draw' ? 'draw' : (win === huSym ? 'human' : 'computer')
    };

    axios.post('http://localhost:5000/api/games', payload)
      .then(() => console.log('Game saved'))
      .catch(e => console.error(e));
  };

  const reset = () => {
    setBoard(initialBoard);
    setMoves([]);
    setWinner(null);
    setWinLine([]);
    setStarted(false);
  };

  return (
    <div className="tictactoe-container">
      {!started ? (
        <div className="setup">
          <h2>Player setup</h2>
          <input
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="symbol-selection">
            <label>
              <input
                type="radio"
                checked={huSym === 'X'}
                onChange={() => setHuSym('X')}
              />
              X
            </label>
            <label>
              <input
                type="radio"
                checked={huSym === 'O'}
                onChange={() => setHuSym('O')}
              />
              O
            </label>
          </div>
          <button onClick={startGame}>Start</button>
        </div>
      ) : (
        <div>
          <h2>{name} ({huSym}) vs Computer ({aiSym})</h2>
          <div className="game-board">
            {board.map((cell, i) => (
              <div
                key={i}
                className={`cell ${winLine.includes(i) ? 'winning' : ''}`}
                onClick={() => handleClick(i)}
              >
                {cell}
              </div>
            ))}
          </div>
          {winner && (
            <div className="winner">
              <h3 className="game-status">
                {winner === 'draw'
                  ? "It's a draw!"
                  : winner === 'human'
                    ? 'You win!'
                    : 'Computer wins!'}
              </h3>
              <button onClick={reset}>Play Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
