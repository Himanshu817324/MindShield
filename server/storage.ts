import { 
  users, permissions, earnings, privacyFootprints,
  type User, type InsertUser, type Permission, type InsertPermission,
  type Earning, type InsertEarning, type PrivacyFootprint, type InsertPrivacyFootprint
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { MongoDBStorage } from "./mongodb-storage";
import { MongoClient } from "mongodb";
import { randomUUID } from 'crypto';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;

  // Permission operations
  getUserPermissions(userId: string): Promise<Permission[]>;
  createPermission(userId: string, permission: InsertPermission): Promise<Permission>;
  updatePermissionStatus(permissionId: string, status: string, txHash?: string): Promise<Permission>;
  getPermission(permissionId: string): Promise<Permission | undefined>;

  // Earnings operations
  getUserEarnings(userId: string): Promise<Earning[]>;
  createEarning(userId: string, earning: InsertEarning): Promise<Earning>;
  updateEarningStatus(earningId: string, status: string, paymentIntentId?: string, txHash?: string): Promise<Earning>;

  // Privacy footprint operations
  getUserPrivacyFootprint(userId: string): Promise<PrivacyFootprint[]>;
  updatePrivacyFootprint(userId: string, footprints: InsertPrivacyFootprint[]): Promise<PrivacyFootprint[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log('🔍 DatabaseStorage.getUserByEmail called with:', email);
    console.log('🔍 Database type:', typeof db);
    console.log('🔍 Database select method:', typeof db.select);
    const [user] = await db.select().from(users).where(eq(users.email, email));
    console.log('🔍 Database query result:', user);
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string, walletAddress?: string): Promise<User> {
    const updateData: any = { 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId 
    };
    
    if (walletAddress) {
      updateData.walletAddress = walletAddress;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    return await db.select().from(permissions).where(eq(permissions.userId, userId));
  }

  async createPermission(userId: string, permission: InsertPermission): Promise<Permission> {
    const [newPermission] = await db
      .insert(permissions)
      .values({ ...permission, userId })
      .returning();
    return newPermission;
  }

  async updatePermissionStatus(permissionId: string, status: string, txHash?: string): Promise<Permission> {
    const updateData: any = { status, updatedAt: new Date() };
    if (txHash) updateData.blockchainTxHash = txHash;

    const [permission] = await db
      .update(permissions)
      .set(updateData)
      .where(eq(permissions.id, permissionId))
      .returning();
    return permission;
  }

  async getPermission(permissionId: string): Promise<Permission | undefined> {
    const [permission] = await db.select().from(permissions).where(eq(permissions.id, permissionId));
    return permission || undefined;
  }

  async getUserEarnings(userId: string): Promise<Earning[]> {
    return await db.select().from(earnings).where(eq(earnings.userId, userId));
  }

  async createEarning(userId: string, earning: InsertEarning): Promise<Earning> {
    const [newEarning] = await db
      .insert(earnings)
      .values({ ...earning, userId })
      .returning();
    return newEarning;
  }

  async updateEarningStatus(earningId: string, status: string, paymentIntentId?: string, txHash?: string): Promise<Earning> {
    const updateData: any = { status };
    if (paymentIntentId) updateData.stripePaymentIntentId = paymentIntentId;
    if (txHash) updateData.blockchainTxHash = txHash;

    const [earning] = await db
      .update(earnings)
      .set(updateData)
      .where(eq(earnings.id, earningId))
      .returning();
    return earning;
  }

  async getUserPrivacyFootprint(userId: string): Promise<PrivacyFootprint[]> {
    return await db.select().from(privacyFootprints).where(eq(privacyFootprints.userId, userId));
  }

  async updatePrivacyFootprint(userId: string, footprints: InsertPrivacyFootprint[]): Promise<PrivacyFootprint[]> {
    // Delete existing footprints for user
    await db.delete(privacyFootprints).where(eq(privacyFootprints.userId, userId));
    
    // Insert new footprints
    const newFootprints = await db
      .insert(privacyFootprints)
      .values(footprints.map(f => ({ ...f, userId })))
      .returning();
    
    return newFootprints;
  }
}

// Mock storage for development mode
export class MockStorage implements IStorage {
  private mockData = {
    users: new Map<string, User>(),
    permissions: new Map<string, Permission>(),
    earnings: new Map<string, Earning>(),
    privacyFootprints: new Map<string, PrivacyFootprint>()
  };

  async getUser(id: string): Promise<User | undefined> {
    return this.mockData.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log('🔍 MockStorage.getUserByEmail called with:', email);
    console.log('🔍 MockStorage users count:', this.mockData.users.size);
    console.log('🔍 MockStorage users:', Array.from(this.mockData.users.values()).map(u => ({ id: u.id, email: u.email, username: u.username })));
    
    for (const user of this.mockData.users.values()) {
      if (user.email === email) {
        console.log('✅ MockStorage found user:', { id: user.id, email: user.email, username: user.username });
        return user;
      }
    }
    console.log('❌ MockStorage user not found for email:', email);
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      walletAddress: null
    };
    this.mockData.users.set(id, user);
    console.log('✅ MockStorage user created:', { id: user.id, email: user.email, username: user.username });
    console.log('🔍 MockStorage total users after creation:', this.mockData.users.size);
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string, walletAddress?: string): Promise<User> {
    const user = this.mockData.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = {
      ...user,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      walletAddress: walletAddress || user.walletAddress
    };
    this.mockData.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    return Array.from(this.mockData.permissions.values()).filter(p => p.userId === userId);
  }

  async createPermission(userId: string, permission: InsertPermission): Promise<Permission> {
    const id = randomUUID();
    const newPermission: Permission = {
      ...permission,
      id,
      userId,
      status: 'pending',
      blockchainTxHash: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockData.permissions.set(id, newPermission);
    return newPermission;
  }

  async updatePermissionStatus(permissionId: string, status: string, txHash?: string): Promise<Permission> {
    const permission = this.mockData.permissions.get(permissionId);
    if (!permission) throw new Error('Permission not found');
    
    const updatedPermission = {
      ...permission,
      status,
      blockchainTxHash: txHash || permission.blockchainTxHash,
      updatedAt: new Date()
    };
    this.mockData.permissions.set(permissionId, updatedPermission);
    return updatedPermission;
  }

  async getPermission(permissionId: string): Promise<Permission | undefined> {
    return this.mockData.permissions.get(permissionId);
  }

  async getUserEarnings(userId: string): Promise<Earning[]> {
    return Array.from(this.mockData.earnings.values()).filter(e => e.userId === userId);
  }

  async createEarning(userId: string, earning: InsertEarning): Promise<Earning> {
    const id = randomUUID();
    const newEarning: Earning = {
      ...earning,
      id,
      userId,
      stripePaymentIntentId: null,
      blockchainTxHash: null,
      status: 'pending',
      createdAt: new Date()
    };
    this.mockData.earnings.set(id, newEarning);
    return newEarning;
  }

  async updateEarningStatus(earningId: string, status: string, paymentIntentId?: string, txHash?: string): Promise<Earning> {
    const earning = this.mockData.earnings.get(earningId);
    if (!earning) throw new Error('Earning not found');
    
    const updatedEarning = {
      ...earning,
      status,
      stripePaymentIntentId: paymentIntentId || earning.stripePaymentIntentId,
      blockchainTxHash: txHash || earning.blockchainTxHash
    };
    this.mockData.earnings.set(earningId, updatedEarning);
    return updatedEarning;
  }

  async getUserPrivacyFootprint(userId: string): Promise<PrivacyFootprint[]> {
    return Array.from(this.mockData.privacyFootprints.values()).filter(f => f.userId === userId);
  }

  async updatePrivacyFootprint(userId: string, footprints: InsertPrivacyFootprint[]): Promise<PrivacyFootprint[]> {
    // Remove existing footprints for user
    for (const [id, footprint] of this.mockData.privacyFootprints.entries()) {
      if (footprint.userId === userId) {
        this.mockData.privacyFootprints.delete(id);
      }
    }
    
    // Add new footprints
    const newFootprints: PrivacyFootprint[] = footprints.map(f => ({
      ...f,
      id: randomUUID(),
      userId,
      lastUpdated: new Date()
    }));
    
    newFootprints.forEach(footprint => {
      this.mockData.privacyFootprints.set(footprint.id, footprint);
    });
    
    return newFootprints;
  }
}

// Check if we should use MongoDB
const isMongoDB = process.env.DATABASE_URL?.includes('mongodb');
const isDevelopment = process.env.NODE_ENV === 'development';
let mongoClient: MongoClient | null = null;

if (isMongoDB) {
  mongoClient = new MongoClient(process.env.DATABASE_URL!);
  mongoClient.connect().then(() => {
    console.log('✅ MongoDB connected for storage');
  }).catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
  });
}

// Use MongoDB if configured, MockStorage in development, otherwise DatabaseStorage
export const storage = isMongoDB && mongoClient 
  ? new MongoDBStorage(mongoClient)
  : isDevelopment 
    ? new MockStorage()
    : new DatabaseStorage();
