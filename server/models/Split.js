const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  familyId: { type: String, default: null },
  title: { type: String, required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  members: [{
    name: { type: String, required: true },
    share: { type: Number, required: true },
    paid: { type: Boolean, default: false }
  }],
  date: { type: Date, default: Date.now },
  settled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Split', splitSchema);
