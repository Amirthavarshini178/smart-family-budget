const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, userId, password } = req.body;
    if (!name || !userId || !password)
      return res.status(400).json({ success: false, message: 'All fields required.' });
    const exists = await User.findOne({ userId });
    if (exists) return res.status(400).json({ success: false, message: 'User ID already taken.' });
    const familyId = `family_${userId}_${Date.now()}`;
    const user = await User.create({ name, userId, password, familyId });
    const token = signToken(user._id);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, userId: user.userId, familyId: user.familyId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(400).json({ success: false, message: 'All fields required.' });
    const user = await User.findOne({ userId });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid User ID or password.' });
    const token = signToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, userId: user.userId, familyId: user.familyId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: { id: req.user._id, name: req.user.name, userId: req.user.userId, familyId: req.user.familyId } });
});

module.exports = router;
