// DNS FIX - Add this at the VERY TOP
const dns = require('node:dns').promises;
dns.setServers(['8.8.8.8', '1.1.1.1']);

// ✅ Add crypto import - needed for JWT and bcrypt
const crypto = require('crypto');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();

// ✅ HEALTH CHECK - Add this FIRST (before any middleware)
app.get('/health', (req, res) => {
  console.log('✅ Health check called');
  res.status(200).send('OK');
});

// Root route
app.get('/', (req, res) => {
  console.log('✅ Root route called');
  res.json({ 
    message: 'BookBurrow API is running!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  console.log('✅ Test route called');
  res.json({ message: 'Backend is working!' });
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app', 'https://*.railway.app'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// 404 handler - must be last
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔍 Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Use PORT from environment variable (Railway sets this)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});