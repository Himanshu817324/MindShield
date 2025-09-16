import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const permissions = pgTable("permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  companyLogo: text("company_logo"),
  accessTypes: text("access_types").array().notNull(),
  monthlyPayment: integer("monthly_payment").notNull(), // in paise
  status: text("status").notNull().default("pending"), // pending, active, revoked
  blockchainTxHash: text("blockchain_tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const earnings = pgTable("earnings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  permissionId: varchar("permission_id").notNull().references(() => permissions.id),
  amount: integer("amount").notNull(), // in paise
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  blockchainTxHash: text("blockchain_tx_hash"),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const privacyFootprints = pgTable("privacy_footprints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(),
  percentage: integer("percentage").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  permissions: many(permissions),
  earnings: many(earnings),
  privacyFootprints: many(privacyFootprints),
}));

export const permissionsRelations = relations(permissions, ({ one, many }) => ({
  user: one(users, {
    fields: [permissions.userId],
    references: [users.id],
  }),
  earnings: many(earnings),
}));

export const earningsRelations = relations(earnings, ({ one }) => ({
  user: one(users, {
    fields: [earnings.userId],
    references: [users.id],
  }),
  permission: one(permissions, {
    fields: [earnings.permissionId],
    references: [permissions.id],
  }),
}));

export const privacyFootprintsRelations = relations(privacyFootprints, ({ one }) => ({
  user: one(users, {
    fields: [privacyFootprints.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  walletAddress: true,
});

export const insertPermissionSchema = createInsertSchema(permissions).pick({
  companyName: true,
  companyLogo: true,
  accessTypes: true,
  monthlyPayment: true,
});

export const insertEarningSchema = createInsertSchema(earnings).pick({
  permissionId: true,
  amount: true,
});

export const insertPrivacyFootprintSchema = createInsertSchema(privacyFootprints).pick({
  platform: true,
  percentage: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type Permission = typeof permissions.$inferSelect;
export type InsertEarning = z.infer<typeof insertEarningSchema>;
export type Earning = typeof earnings.$inferSelect;
export type InsertPrivacyFootprint = z.infer<typeof insertPrivacyFootprintSchema>;
export type PrivacyFootprint = typeof privacyFootprints.$inferSelect;
