// client/src/components/History.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function History() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/games')
      .then(res => setGames(res.data))
      .catch(console.error);
  }, []);

  if (!games.length) return <p>Loading history…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Game History</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Symbol</th>
            <th>Moves</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {games.map(g => (
            <tr key={g._id}>
              <td>{g.playerName}</td>
              <td>{g.humanSymbol} vs {g.computerSymbol}</td>
              <td>
                {g.moves.map(m => `${m.player[0]}(${m.symbol}@${m.index})`).join(', ')}
              </td>
              <td>{g.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
