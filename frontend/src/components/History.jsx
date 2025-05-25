import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

export default function History() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/games')
      .then(res => setGames(res.data))
      .catch(console.error);
  }, []);

  if (!games.length) {
    return (
      <div className="history-container">
        <h2>Game History</h2>
        <p className="loading">Loading history…</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Game History</h2>
      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>                       
              <th>Player</th>
              <th>Symbol</th>
              <th>Moves</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g, i) => (
              <tr key={g._id}>
                <td>{i + 1}</td>               
                <td>{g.playerName}</td>
                <td>{g.humanSymbol} vs {g.computerSymbol}</td>
                <td>
                  {g.moves.map((m, idx) =>
                    <span key={idx} className="move">
                      {m.player[0]}({m.symbol}@{m.index})
                    </span>
                  ).reduce((prev, curr) => [prev, ', ', curr])}
                </td>
                <td className={
                    g.winner === 'human'    ? 'win-human' :
                    g.winner === 'computer' ? 'win-computer' :
                                               'win-draw'
                  }>
                  {g.winner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
