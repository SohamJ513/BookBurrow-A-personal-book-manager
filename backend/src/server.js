// DNS FIX - Add this at the VERY TOP
const dns = require('node:dns').promises;
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();

// ✅ HEALTH CHECK - Add this FIRST
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app', 'https://*.railway.app'],
  credentials: true
}));

// Root route - for Railway health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'BookBurrow API is running!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});