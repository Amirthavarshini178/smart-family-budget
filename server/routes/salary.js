const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find({ userId: req.user._id }).sort({ month: -1 });
    res.json({ success: true, salaries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { amount, month, source, note } = req.body;
    if (!amount || !month) return res.status(400).json({ success: false, message: 'Amount and month required.' });
    // Upsert: one salary per month per user
    const salary = await Salary.findOneAndUpdate(
      { userId: req.user._id, month },
      { amount, source: source || 'Salary', note: note || '' },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, salary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/current', async (req, res) => {
  try {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const salary = await Salary.findOne({ userId: req.user._id, month });
    res.json({ success: true, salary, month });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
