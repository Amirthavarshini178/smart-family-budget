const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  familyId: { type: String, default: null },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ['Food', 'Shopping', 'Bills', 'Travel', 'Medical', 'Education', 'Other'],
    default: 'Other'
  },
  date: { type: Date, default: Date.now },
  note: { type: String, default: '' },
  addedBy: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
