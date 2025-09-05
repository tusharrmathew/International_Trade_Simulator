const express = require('express');
const router = express.Router();
const Nation = require('../models/Nation');

// Get all nations
router.get('/', async (req, res) => {
  try {
    const nations = await Nation.find();
    res.json(nations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nations', error: error.message });
  }
});

// Get nation by ID
router.get('/:id', async (req, res) => {
  try {
    const nation = await Nation.findById(req.params.id);
    if (!nation) {
      return res.status(404).json({ message: 'Nation not found' });
    }
    res.json(nation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nation', error: error.message });
  }
});

// Create new nation
router.post('/', async (req, res) => {
  try {
    const nation = new Nation(req.body);
    await nation.save();
    res.status(201).json(nation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating nation', error: error.message });
  }
});

// Update nation
router.put('/:id', async (req, res) => {
  try {
    const nation = await Nation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!nation) {
      return res.status(404).json({ message: 'Nation not found' });
    }
    res.json(nation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating nation', error: error.message });
  }
});

// Update trade policies
router.put('/:id/trade-policies', async (req, res) => {
  try {
    const { tariffRate, embargoes, freeTradeAgreements } = req.body;
    const nation = await Nation.findById(req.params.id);
    
    if (!nation) {
      return res.status(404).json({ message: 'Nation not found' });
    }

    nation.tradePolicies = {
      tariffRate: tariffRate || nation.tradePolicies.tariffRate,
      embargoes: embargoes || nation.tradePolicies.embargoes,
      freeTradeAgreements: freeTradeAgreements || nation.tradePolicies.freeTradeAgreements
    };

    await nation.save();
    res.json(nation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating trade policies', error: error.message });
  }
});

// Update resources
router.put('/:id/resources', async (req, res) => {
  try {
    const { resources } = req.body;
    const nation = await Nation.findById(req.params.id);
    
    if (!nation) {
      return res.status(404).json({ message: 'Nation not found' });
    }

    nation.resources = resources;
    await nation.save();
    res.json(nation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resources', error: error.message });
  }
});

// Calculate trade balance
router.get('/:id/trade-balance', async (req, res) => {
  try {
    const nation = await Nation.findById(req.params.id);
    if (!nation) {
      return res.status(404).json({ message: 'Nation not found' });
    }

    const tradeBalance = {
      exports: nation.tradeBalance.exports,
      imports: nation.tradeBalance.imports,
      balance: nation.tradeBalance.balance
    };

    res.json(tradeBalance);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating trade balance', error: error.message });
  }
});

module.exports = router; 