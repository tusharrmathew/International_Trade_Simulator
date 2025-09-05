const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Game = require('../models/Game');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const isHost = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const isHost = game.players.some(
      player => player.userId.toString() === req.user._id.toString() && player.isHost
    );

    if (!isHost) {
      return res.status(403).json({ message: 'Only the host can perform this action' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking host status', error: error.message });
  }
};

const isPlayer = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const isPlayer = game.players.some(
      player => player.userId.toString() === req.user._id.toString()
    );

    if (!isPlayer) {
      return res.status(403).json({ message: 'You are not a player in this game' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking player status', error: error.message });
  }
};

module.exports = {
  auth,
  isHost,
  isPlayer
}; 