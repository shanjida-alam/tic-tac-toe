const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  player: { type: String, enum: ['human','computer'], required: true },
  index:  { type: Number, required: true },
  symbol: { type: String, enum: ['X','O'], required: true }
}, { _id: false });

const gameSchema = new mongoose.Schema({
  playerName:     { type: String, required: true },
  humanSymbol:    { type: String, enum: ['X','O'], required: true },
  computerSymbol: { type: String, enum: ['X','O'], required: true },
  moves:          { type: [moveSchema], required: true },
  winner:         { type: String, enum: ['human','computer','draw'], required: true }
}, {
  timestamps: false   // no createdAt/updatedAt
});

module.exports = mongoose.model('Game', gameSchema);
