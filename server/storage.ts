import { 
  users, permissions, earnings, privacyFootprints,
  type User, type InsertUser, type Permission, type InsertPermission,
  type Earning, type InsertEarning, type PrivacyFootprint, type InsertPrivacyFootprint
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId 
      })
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

export const storage = new DatabaseStorage();
