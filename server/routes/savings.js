const express = require('express');
const router = express.Router();
const Savings = require('../models/Savings');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const goals = await Savings.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, goals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { goalName, targetAmount, savedAmount, deadline, icon } = req.body;
    if (!goalName || !targetAmount) return res.status(400).json({ success: false, message: 'Goal name and target required.' });
    const goal = await Savings.create({ userId: req.user._id, goalName, targetAmount, savedAmount: savedAmount || 0, deadline, icon: icon || '🎯' });
    res.status(201).json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { savedAmount, completed } = req.body;
    const goal = await Savings.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { savedAmount, completed },
      { new: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found.' });
    res.json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Savings.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Goal deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
