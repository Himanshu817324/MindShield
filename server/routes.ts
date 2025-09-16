import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from 'bcrypt';
import Stripe from "stripe";
import { storage } from "./storage";
import { authenticateToken, generateToken, type AuthenticatedRequest } from "./middleware/auth";
import { insertUserSchema, insertPermissionSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      const token = generateToken(user.id);
      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user.id);
      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Privacy footprint route
  app.get("/api/privacy", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const footprints = await storage.getUserPrivacyFootprint(req.userId!);
      
      if (footprints.length === 0) {
        // Return default privacy footprint if none exists
        const defaultFootprint = {
          google: 45,
          facebook: 25,
          instagram: 20,
          other: 10,
          score: 62
        };
        return res.json(defaultFootprint);
      }

      // Convert footprints to expected format
      const footprintData = footprints.reduce((acc, fp) => {
        acc[fp.platform.toLowerCase()] = fp.percentage;
        return acc;
      }, {} as any);

      // Calculate privacy score
      const totalData = Object.values(footprintData).reduce((sum: number, val: any) => sum + val, 0);
      const score = Math.max(0, Math.min(100, 100 - totalData));

      res.json({ ...footprintData, score });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Permission routes
  app.post("/api/permissions/grant", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const permissionData = insertPermissionSchema.parse(req.body);
      const permission = await storage.createPermission(req.userId!, permissionData);
      res.json(permission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/permissions/revoke", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { permissionId } = req.body;
      const permission = await storage.updatePermissionStatus(permissionId, "revoked");
      res.json(permission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/permissions", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const permissions = await storage.getUserPermissions(req.userId!);
      res.json(permissions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Earnings routes
  app.post("/api/earnings/calc", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { platforms, hours } = req.body;
      
      if (!platforms || !Array.isArray(platforms) || !hours) {
        return res.status(400).json({ message: "Platforms array and hours are required" });
      }

      // Calculate estimated earnings based on platforms and usage hours
      const baseRates = {
        google: 50,
        facebook: 40,
        instagram: 35,
        twitter: 30,
        linkedin: 45,
        youtube: 55
      };

      let totalEstimated = 0;
      platforms.forEach((platform: string) => {
        const rate = baseRates[platform.toLowerCase() as keyof typeof baseRates] || 25;
        totalEstimated += (rate * hours * 30) / 24; // Monthly calculation
      });

      res.json({ estimated: Math.round(totalEstimated) });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment route for withdrawals
  app.post("/api/earnings/pay", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency: "inr",
        metadata: {
          userId: req.userId!,
          type: "withdrawal"
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        checkoutUrl: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/checkout?payment_intent=${paymentIntent.id}`
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.get("/api/earnings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const earnings = await storage.getUserEarnings(req.userId!);
      
      const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
      const availableBalance = earnings
        .filter(e => e.status === 'completed')
        .reduce((sum, earning) => sum + earning.amount, 0);
      const pendingPayments = earnings
        .filter(e => e.status === 'pending')
        .reduce((sum, earning) => sum + earning.amount, 0);

      res.json({
        totalEarnings: totalEarnings / 100, // Convert from paise to rupees
        availableBalance: availableBalance / 100,
        pendingPayments: pendingPayments / 100,
        transactions: earnings.map(e => ({
          ...e,
          amount: e.amount / 100
        }))
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard data route
  app.get("/api/dashboard", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const [permissions, earnings, footprints] = await Promise.all([
        storage.getUserPermissions(req.userId!),
        storage.getUserEarnings(req.userId!),
        storage.getUserPrivacyFootprint(req.userId!)
      ]);

      const activePermissions = permissions.filter(p => p.status === 'active').length;
      const pendingPermissions = permissions.filter(p => p.status === 'pending').length;
      
      const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0) / 100;
      const thisWeekRequests = permissions.filter(p => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return p.createdAt && p.createdAt > weekAgo;
      }).length;

      const privacyScore = footprints.length > 0 
        ? Math.max(0, 100 - footprints.reduce((sum, f) => sum + f.percentage, 0))
        : 62;

      res.json({
        privacyScore,
        monthlyEarnings: totalEarnings,
        activePermissions,
        pendingPermissions,
        dataRequests: thisWeekRequests,
        permissions,
        footprints
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
