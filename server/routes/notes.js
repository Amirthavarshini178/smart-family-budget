const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ pinned: -1, createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, type, color, pinned } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content required.' });
    const note = await Note.create({
      userId: req.user._id,
      familyId: req.user.familyId,
      title, content, type: type || 'personal',
      color: color || '#ffffff',
      addedBy: req.user.name,
      pinned: pinned || false
    });
    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
