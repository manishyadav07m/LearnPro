const mongoose = require('mongoose');

const SyllabusSchema = new mongoose.Schema({
  fileName: String,
  extractedText: String,
  questions: {
    short: Array,
    medium: Array,
    long: Array,
    pyq: Array,
    faq: Array
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Syllabus', SyllabusSchema);