// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TicTacToe from './components/TicTacToe';
import History   from './components/History';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10 }}>
        <Link to="/">Play</Link> | <Link to="/history">History</Link>
      </nav>
      <Routes>
        <Route path="/" element={<TicTacToe />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}