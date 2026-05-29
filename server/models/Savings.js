const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalName: { type: String, required: true, trim: true },
  targetAmount: { type: Number, required: true, min: 0 },
  savedAmount: { type: Number, default: 0, min: 0 },
  deadline: { type: Date, default: null },
  icon: { type: String, default: '🎯' },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Savings', savingsSchema);
