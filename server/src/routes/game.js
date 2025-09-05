const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Nation = require('../models/Nation');

// Create new game
router.post('/create', async (req, res) => {
  try {
    const { name, settings, hostId } = req.body;

    const game = new Game({
      name,
      settings,
      players: [{
        userId: hostId,
        isHost: true
      }]
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error creating game', error: error.message });
  }
});

// Join existing game
router.post('/:gameId/join', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.status !== 'waiting') {
      return res.status(400).json({ message: 'Game has already started' });
    }

    game.players.push({ userId });
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error joining game', error: error.message });
  }
});

// Start game
router.post('/:gameId/start', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { hostId } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const host = game.players.find(p => p.userId.toString() === hostId && p.isHost);
    if (!host) {
      return res.status(403).json({ message: 'Only host can start the game' });
    }

    game.status = 'active';
    game.currentTurn = 1;
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error starting game', error: error.message });
  }
});

// Get game state
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId)
      .populate('players.userId', 'username')
      .populate('players.nationId');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game', error: error.message });
  }
});

// Submit trade proposal
router.post('/:gameId/trade', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { fromNation, toNation, resources, terms } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.status !== 'active') {
      return res.status(400).json({ message: 'Game is not active' });
    }

    // Add trade event to game
    game.tradeEvents.push({
      type: 'proposal',
      description: `Trade proposal from ${fromNation} to ${toNation}`,
      impact: {
        economic: 0,
        diplomatic: 0
      }
    });

    await game.save();

    res.json({ message: 'Trade proposal submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting trade proposal', error: error.message });
  }
});

module.exports = router; 