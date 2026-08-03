const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // NEW: Reading goal
  readingGoal: {
    type: Number,
    default: 12,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);