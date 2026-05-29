const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  familyId: { type: String, default: null },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['personal', 'family', 'grocery', 'reminder', 'planning'], default: 'personal' },
  color: { type: String, default: '#ffffff' },
  addedBy: { type: String, default: '' },
  pinned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
