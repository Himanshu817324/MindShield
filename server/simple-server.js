// Simple Express server for deployment
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import Stripe from 'stripe';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
let mongoClient;
let db;

async function connectToMongoDB() {
  try {
    if (process.env.DATABASE_URL?.includes('mongodb')) {
      mongoClient = new MongoClient(process.env.DATABASE_URL);
      await mongoClient.connect();
      db = mongoClient.db('MindShield');
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('⚠️  No MongoDB URL provided, using mock data');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

// Initialize Stripe
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });
  console.log('✅ Stripe configured');
} else {
  console.log('⚠️  Stripe not configured');
}

// Mock data for development
const mockUsers = new Map();
const mockPermissions = new Map();
const mockEarnings = new Map();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mindshield-secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    let existingUser;
    if (db) {
      existingUser = await db.collection('users').findOne({ email });
    } else {
      existingUser = Array.from(mockUsers.values()).find(u => u.email === email);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      walletAddress: null
    };

    if (db) {
      await db.collection('users').insertOne(user);
    } else {
      mockUsers.set(user.id, user);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'mindshield-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'User created successfully',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    let user;
    if (db) {
      user = await db.collection('users').findOne({ email });
    } else {
      user = Array.from(mockUsers.values()).find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'mindshield-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected routes
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({
    privacyScore: 62,
    monthlyEarnings: 0,
    activePermissions: 0,
    totalDataPoints: 150
  });
});

app.get('/api/privacy', authenticateToken, (req, res) => {
  res.json({
    google: 45,
    facebook: 25,
    instagram: 20,
    other: 10
  });
});

app.get('/api/earnings', authenticateToken, (req, res) => {
  res.json({
    totalEarnings: 0,
    availableBalance: 0,
    pendingPayments: 0,
    monthlyEarnings: 0
  });
});

app.post('/api/earnings/pay', authenticateToken, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ message: 'Stripe not configured' });
    }

    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 2000, // $20.00
      currency: 'usd',
      metadata: {
        userId: req.userId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Payment failed' });
  }
});

// Start server
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);
