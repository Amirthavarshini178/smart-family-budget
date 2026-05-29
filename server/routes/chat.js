const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:familyId', async (req, res) => {
  try {
    const messages = await Chat.find({ familyId: req.params.familyId }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required.' });
    const chat = await Chat.create({
      familyId: req.user.familyId,
      senderId: req.user._id,
      senderName: req.user.name,
      message,
      type: type || 'text'
    });
    res.status(201).json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
