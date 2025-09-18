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
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://mindshieldai.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

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
  console.log('⚠️  Stripe not configured - using mock data for payments');
  console.log('   To enable Stripe: Set STRIPE_SECRET_KEY environment variable');
}

// Mock data for development
const mockUsers = new Map();
const mockPermissions = new Map();
const mockEarnings = new Map();

// Load mock data from file on startup
import fs from 'fs';
import path from 'path';

const MOCK_DATA_FILE = path.join(process.cwd(), 'mock-data.json');

function loadMockData() {
  try {
    if (fs.existsSync(MOCK_DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(MOCK_DATA_FILE, 'utf8'));
      if (data.users) {
        Object.entries(data.users).forEach(([id, user]) => {
          mockUsers.set(id, user);
        });
      }
      console.log('✅ Loaded mock data from file');
    }
  } catch (error) {
    console.log('⚠️  Could not load mock data:', error.message);
  }
}

function saveMockData() {
  try {
    const data = {
      users: Object.fromEntries(mockUsers),
      permissions: Object.fromEntries(mockPermissions),
      earnings: Object.fromEntries(mockEarnings)
    };
    fs.writeFileSync(MOCK_DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('⚠️  Could not save mock data:', error.message);
  }
}

// Load data on startup
loadMockData();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Auth Debug:', {
    hasAuthHeader: !!authHeader,
    authHeader: authHeader,
    token: token ? token.substring(0, 20) + '...' : 'none'
  });

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mindshield-secret');
    console.log('✅ Token verified for user:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
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
      saveMockData(); // Save to file
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
    console.log('🔐 Login attempt - Request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('🔍 Looking for user with email:', email);

    // Find user
    let user;
    if (db) {
      user = await db.collection('users').findOne({ email });
      console.log('🔍 MongoDB user lookup result:', user ? 'Found' : 'Not found');
    } else {
      user = Array.from(mockUsers.values()).find(u => u.email === email);
      console.log('🔍 Mock user lookup result:', user ? 'Found' : 'Not found');
      console.log('🔍 Available mock users:', Array.from(mockUsers.values()).map(u => u.email));
    }

    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('🔍 User found, checking password...');
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔍 Password check result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
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
  const mockDashboard = {
    privacyScore: 62,
    monthlyEarnings: 1250, // ₹12.50
    activePermissions: 3,
    pendingPermissions: 1,
    dataRequests: 15,
    totalDataPoints: 150,
    permissions: [
      {
        id: 'perm_1',
        companyName: 'TechCorp Analytics',
        companyLogo: 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=TC',
        accessTypes: ['location', 'browsing_history'],
        monthlyPayment: 500, // ₹5.00
        status: 'active'
      },
      {
        id: 'perm_2',
        companyName: 'DataInsights Inc',
        companyLogo: 'https://via.placeholder.com/40x40/059669/FFFFFF?text=DI',
        accessTypes: ['demographics', 'purchase_history'],
        monthlyPayment: 750, // ₹7.50
        status: 'active'
      },
      {
        id: 'perm_3',
        companyName: 'Market Research Co',
        companyLogo: 'https://via.placeholder.com/40x40/DC2626/FFFFFF?text=MR',
        accessTypes: ['social_media', 'app_usage'],
        monthlyPayment: 300, // ₹3.00
        status: 'pending'
      }
    ]
  };
  
  console.log('📊 Mock dashboard data sent for user:', req.userId);
  res.json(mockDashboard);
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
  // Return mock earnings data for development
  const mockEarnings = {
    totalEarnings: 1250, // ₹12.50
    availableBalance: 850, // ₹8.50
    pendingPayments: 400, // ₹4.00
    monthlyEarnings: 1250,
    transactions: [
      {
        id: 'tx_1',
        amount: 500,
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 'tx_2',
        amount: 350,
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: 'tx_3',
        amount: 400,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ]
  };
  
  console.log('💰 Mock earnings data sent for user:', req.userId);
  res.json(mockEarnings);
});

app.post('/api/earnings/pay', authenticateToken, async (req, res) => {
  try {
    if (!stripe) {
      // Return mock payment data for development
      const { amount } = req.body;
      const mockClientSecret = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('💰 Mock payment created:', { amount, userId: req.userId });
      
      return res.json({
        clientSecret: mockClientSecret,
        message: 'Mock payment created (Stripe not configured)'
      });
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

// Catch-all handler for undefined routes
app.use('*', (req, res) => {
  console.log('❌ Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/dashboard',
      'GET /api/privacy',
      'GET /api/earnings',
      'POST /api/earnings/pay'
    ]
  });
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
