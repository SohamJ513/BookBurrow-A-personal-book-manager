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

// ✅ CORS MUST BE FIRST - Before any routes
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Cookie', 'Authorization']
}));

// ✅ FIX: Handle preflight requests manually (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Cookie, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).send();
  }
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ FAST HEALTH CHECK
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Root route
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

// 404 handler
app.use((req, res) => {
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
    console.log('🔍 MONGODB_URI exists?', uri ? 'Yes' : 'No');
    
    if (!uri) {
      console.error('❌ MONGODB_URI is not defined');
      return;
    }
    
    console.log('🔍 Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
  }
};

// Don't wait for DB connection to start server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});