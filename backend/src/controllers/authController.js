const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register - No auto-login, just create user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = await User.create({ 
      email, 
      password: hashedPassword 
    });

    // ✅ REMOVED: Automatic login - no token generation or cookie setting
    // User must now login manually

    res.status(201).json({
      message: 'User registered successfully! Please login.',
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password manually
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // ✅ FIXED: sameSite must be 'none' and secure must be true
    // for the cookie to work across different domains (Vercel <-> Railway)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  // ✅ FIXED: clearCookie options must match the options used when
  // the cookie was set, or the browser won't recognize it as the same cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ message: 'Logged out successfully' });
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// NEW: Update reading goal
exports.updateGoal = async (req, res) => {
  try {
    const { goal } = req.body;
    
    if (goal < 0) {
      return res.status(400).json({ message: 'Goal must be a positive number' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { readingGoal: goal },
      { new: true }
    ).select('-password');
    
    res.json({ 
      user, 
      message: 'Reading goal updated successfully!' 
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// NEW: Get goal progress
exports.getGoalProgress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const Book = require('../models/Book');
    
    const completedBooks = await Book.countDocuments({
      userId: req.userId,
      status: 'completed'
    });
    
    const goal = user.readingGoal || 12;
    const progress = Math.min(Math.round((completedBooks / goal) * 100), 100);
    
    res.json({
      goal,
      completed: completedBooks,
      progress,
      remaining: Math.max(goal - completedBooks, 0)
    });
  } catch (error) {
    console.error('Get goal progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};