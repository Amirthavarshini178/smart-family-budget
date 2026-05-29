const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET all expenses for user
router.get('/', async (req, res) => {
  try {
    const { month, category } = req.query;
    let filter = { userId: req.user._id };
    if (category && category !== 'All') filter.category = category;
    if (month) {
      const [year, m] = month.split('-');
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json({ success: true, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    if (!title || !amount) return res.status(400).json({ success: false, message: 'Title and amount required.' });
    const expense = await Expense.create({
      userId: req.user._id,
      familyId: req.user.familyId,
      title, amount, category: category || 'Other',
      date: date || new Date(),
      note: note || '',
      addedBy: req.user.name
    });
    res.status(201).json({ success: true, expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found.' });
    res.json({ success: true, message: 'Expense deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET analytics summary
router.get('/analytics', async (req, res) => {
  try {
    const { month } = req.query;
    const [year, m] = (month || `${new Date().getFullYear()}-${new Date().getMonth() + 1}`).split('-');
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    const expenses = await Expense.find({ userId: req.user._id, date: { $gte: start, $lte: end } });
    const byCategory = {};
    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({ success: true, byCategory, total, count: expenses.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
