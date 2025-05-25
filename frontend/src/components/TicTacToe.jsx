// frontend/src/components/TicTacToe.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './TicTacToe.css';

const initialBoard = Array(9).fill(null);

// Calculate winner and winning line
const calculateWinner = b => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (let [a,c,d] of lines) {
    if (b[a] && b[a]===b[c] && b[a]===b[d]) {
      return { winner: b[a], line: [a,c,d] };
    }
  }
  if (b.every(x=>x!==null)) return { winner:'draw', line:[] };
  return { winner:null, line:[] };
};

// Minimax: human maximizes (score +1), computer minimizes (score -1)
const minimax = (board, isHumanTurn, huSym, aiSym) => {
  const { winner } = calculateWinner(board);
  if (winner === huSym) return { score: 1 };
  if (winner === aiSym) return { score: -1 };
  if (winner === 'draw') return { score: 0 };

  const moves = [];
  board.forEach((cell, idx) => {
    if (!cell) {
      const b2 = [...board];
      // if it's human's turn, we simulate human move; else computer move
      b2[idx] = isHumanTurn ? huSym : aiSym;
      const { score } = minimax(b2, !isHumanTurn, huSym, aiSym);
      moves.push({ idx, score });
    }
  });

  // choose the move with max score on human’s turn, or min score on computer’s
  return isHumanTurn
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

    // 1) Human move (maximizer)
    const b1 = [...board];
    b1[idx] = huSym;
    setBoard(b1);
    setMoves(m => [...m, { player: 'human', index: idx, symbol: huSym }]);

    const { winner: w1, line: l1 } = calculateWinner(b1);
    if (w1) return finish(w1, l1);

    // 2) Computer move (minimizer)
    // note: we pass false to minimax → computer’s turn
    const { idx: aiIdx } = minimax(b1, false, huSym, aiSym);
    const b2 = [...b1];
    b2[aiIdx] = aiSym;
    setBoard(b2);
    setMoves(m => [...m, { player: 'computer', index: aiIdx, symbol: aiSym }]);

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
      winner: win === 'draw'
                ? 'draw'
                : (win === huSym ? 'human' : 'computer')
    };
    axios.post('/api/games', payload)
      .catch(e => console.error('Save error:', e));
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
        <>
          <h1 className="header">Welcome to Tic-Tac-Toe!</h1>
          <div className="setup-card">
            <input
              className="input-field"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div className="symbol-selection">
              <label>
                <input
                  type="radio"
                  checked={huSym==='X'}
                  onChange={()=>setHuSym('X')}
                /> X
              </label>
              <label>
                <input
                  type="radio"
                  checked={huSym==='O'}
                  onChange={()=>setHuSym('O')}
                /> O
              </label>
            </div>
            <button className="start-btn" onClick={startGame}>
              Start
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="matchup">
            {name} ({huSym}) vs Computer ({aiSym})
          </h2>

          <div className="game-board">
            {board.map((cell,i) => (
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
                {winner==='draw'
                  ? "It's a draw!"
                  : winner==='human'
                    ? 'You win!'
                    : 'Computer wins!'}
              </h3>
              <button className="reset-btn" onClick={reset}>
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
