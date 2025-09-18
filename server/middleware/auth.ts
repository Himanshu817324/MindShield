import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'mindshield-super-secret-key-2024';
console.log('🔍 JWT Secret check:', { 
  hasJwtSecret: !!process.env.JWT_SECRET,
  hasSessionSecret: !!process.env.SESSION_SECRET,
  jwtSecretLength: process.env.JWT_SECRET?.length || 0,
  sessionSecretLength: process.env.SESSION_SECRET?.length || 0,
  usingDefault: !process.env.JWT_SECRET && !process.env.SESSION_SECRET
});

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId?: string;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔍 Auth Debug:', {
    hasAuthHeader: !!authHeader,
    tokenLength: token?.length || 0,
    path: req.path,
    method: req.method
  });

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔍 Token decoded:', { userId: decoded.userId, exp: decoded.exp });
    
    const user = await storage.getUser(decoded.userId);
    console.log('🔍 User found:', { userId: user?.id, email: user?.email });
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    req.userId = user.id;
    console.log('✅ Authentication successful');
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
