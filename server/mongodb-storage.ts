import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';
import { 
  type User, type InsertUser, type Permission, type InsertPermission,
  type Earning, type InsertEarning, type PrivacyFootprint, type InsertPrivacyFootprint
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string, walletAddress?: string): Promise<User>;

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

export class MongoDBStorage implements IStorage {
  private client: MongoClient;
  private db: any;

  constructor(client: MongoClient) {
    this.client = client;
    this.db = client.db('MindShield');
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({ id });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({ email });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
            const id = randomUUID();
    const userData = {
      ...insertUser,
      id,
      createdAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      walletAddress: null
    };
    
    await this.db.collection('users').insertOne(userData);
    return userData;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string, walletAddress?: string): Promise<User> {
    const updateData: any = { 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId 
    };
    
    if (walletAddress) {
      updateData.walletAddress = walletAddress;
    }

    await this.db.collection('users').updateOne(
      { id: userId },
      { $set: updateData }
    );
    
    const updatedUser = await this.db.collection('users').findOne({ id: userId });
    return updatedUser;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    return await this.db.collection('permissions').find({ userId }).toArray();
  }

  async createPermission(userId: string, permission: InsertPermission): Promise<Permission> {
            const id = randomUUID();
    const permissionData = {
      ...permission,
      id,
      userId,
      status: 'pending',
      blockchainTxHash: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.db.collection('permissions').insertOne(permissionData);
    return permissionData;
  }

  async updatePermissionStatus(permissionId: string, status: string, txHash?: string): Promise<Permission> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (txHash) {
      updateData.blockchainTxHash = txHash;
    }

    await this.db.collection('permissions').updateOne(
      { id: permissionId },
      { $set: updateData }
    );
    
    const updatedPermission = await this.db.collection('permissions').findOne({ id: permissionId });
    return updatedPermission;
  }

  async getPermission(permissionId: string): Promise<Permission | undefined> {
    const permission = await this.db.collection('permissions').findOne({ id: permissionId });
    return permission || undefined;
  }

  async getUserEarnings(userId: string): Promise<Earning[]> {
    return await this.db.collection('earnings').find({ userId }).toArray();
  }

  async createEarning(userId: string, earning: InsertEarning): Promise<Earning> {
            const id = randomUUID();
    const earningData = {
      ...earning,
      id,
      userId,
      stripePaymentIntentId: null,
      blockchainTxHash: null,
      status: 'pending',
      createdAt: new Date()
    };
    
    await this.db.collection('earnings').insertOne(earningData);
    return earningData;
  }

  async updateEarningStatus(earningId: string, status: string, paymentIntentId?: string, txHash?: string): Promise<Earning> {
    const updateData: any = { status };
    
    if (paymentIntentId) {
      updateData.stripePaymentIntentId = paymentIntentId;
    }
    if (txHash) {
      updateData.blockchainTxHash = txHash;
    }

    await this.db.collection('earnings').updateOne(
      { id: earningId },
      { $set: updateData }
    );
    
    const updatedEarning = await this.db.collection('earnings').findOne({ id: earningId });
    return updatedEarning;
  }

  async getUserPrivacyFootprint(userId: string): Promise<PrivacyFootprint[]> {
    return await this.db.collection('privacyFootprints').find({ userId }).toArray();
  }

  async updatePrivacyFootprint(userId: string, footprints: InsertPrivacyFootprint[]): Promise<PrivacyFootprint[]> {
    // Delete existing footprints for user
    await this.db.collection('privacyFootprints').deleteMany({ userId });
    
    // Insert new footprints
    const newFootprints = footprints.map(f => ({
      ...f,
      id: require('crypto').randomUUID(),
      userId,
      lastUpdated: new Date()
    }));
    
    if (newFootprints.length > 0) {
      await this.db.collection('privacyFootprints').insertMany(newFootprints);
    }
    
    return newFootprints;
  }
}
