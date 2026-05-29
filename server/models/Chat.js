const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  familyId: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true, trim: true },
  type: { type: String, enum: ['text', 'expense', 'reminder'], default: 'text' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
