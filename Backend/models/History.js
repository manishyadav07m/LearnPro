const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: { type: String, required: true },
  subject: { type: String, default: 'General' },
  questions: { type: Object, required: true }, // Stores the AI Q&A JSON
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);





