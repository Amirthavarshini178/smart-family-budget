const express = require('express');
const router = express.Router();
const Split = require('../models/Split');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const splits = await Split.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, splits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, totalAmount, members } = req.body;
    if (!title || !totalAmount || !members || !members.length)
      return res.status(400).json({ success: false, message: 'Title, amount, and members required.' });
    const sharePerPerson = totalAmount / members.length;
    const membersWithShare = members.map(m => ({ name: m, share: sharePerPerson, paid: false }));
    const split = await Split.create({
      userId: req.user._id,
      familyId: req.user.familyId,
      title, totalAmount,
      members: membersWithShare
    });
    res.status(201).json({ success: true, split });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/member/:memberIndex', async (req, res) => {
  try {
    const split = await Split.findOne({ _id: req.params.id, userId: req.user._id });
    if (!split) return res.status(404).json({ success: false, message: 'Split not found.' });
    split.members[req.params.memberIndex].paid = req.body.paid;
    split.settled = split.members.every(m => m.paid);
    await split.save();
    res.json({ success: true, split });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Split.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Split deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
