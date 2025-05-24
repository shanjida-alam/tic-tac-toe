const express = require('express');
const Game    = require('../models/Game');
const router  = express.Router();

// POST /api/games — save a finished game
router.post('/', async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/games — list all games
router.get('/', async (req, res) => {
  const games = await Game.find();
  res.json(games);
});

module.exports = router;
