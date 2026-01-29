const express = require('express');
const router = express.Router();
const History = require('../models/History');

// SAVE History (Called after AI generates questions)
router.post('/save', async (req, res) => {
  try {
    const { userId, topic, subject, questions } = req.body;
    const newHistory = new History({ userId, topic, subject, questions });
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// GET History (Called when Dashboard loads)
router.get('/:userId', async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE History Item
router.delete('/:id', async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ message: 'History item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;

