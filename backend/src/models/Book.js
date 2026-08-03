const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['want-to-read', 'reading', 'completed'],
    default: 'want-to-read'
  },
  // NEW: Reading progress fields
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalPages: {
    type: Number,
    min: 0,
    default: 0
  },
  currentPage: {
    type: Number,
    min: 0,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);