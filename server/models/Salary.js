const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  month: { type: String, required: true }, // "2024-01"
  source: { type: String, default: 'Salary' },
  note: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);
