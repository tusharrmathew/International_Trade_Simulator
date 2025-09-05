const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nation'
  },
  score: Number,
  isHost: Boolean
});

const TradeEventSchema = new mongoose.Schema({
  type: String,
  description: String,
  impact: {
    economic: Number,
    diplomatic: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'cancelled'],
    default: 'waiting'
  },
  players: [PlayerSchema],
  currentTurn: Number,
  maxTurns: Number,
  turnDuration: Number,
  tradeEvents: [TradeEventSchema],
  settings: {
    difficulty: String,
    mode: String,
    startingYear: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
GameSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Game', GameSchema); 