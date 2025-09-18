import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { MongoClient } from 'mongodb';
import ws from "ws";
import { randomUUID } from 'crypto';
import * as schema from "../shared/schema";

// Check if we have a MongoDB URL
const isMongoDB = process.env.DATABASE_URL?.includes('mongodb');
const isDevelopment = process.env.NODE_ENV === 'development';

let db: any;
let mongoClient: MongoClient | null = null;

function initializeDatabase() {
  if (isMongoDB) {
    // Use MongoDB with simple MongoDB driver (no Drizzle ORM for now)
    console.log('🍃 Using MongoDB database');
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set for MongoDB connection");
    }

    mongoClient = new MongoClient(process.env.DATABASE_URL);
    
    // Connect to MongoDB
    mongoClient.connect().then(() => {
      console.log('✅ Connected to MongoDB');
    }).catch(console.error);
  
    const mongoDb = mongoClient.db('MindShield');
    
    // Create a simple database interface for MongoDB that matches Drizzle ORM interface
    db = {
      select: () => ({
        from: (collection: string) => ({
          where: (query: any) => {
            // Convert Drizzle query to MongoDB query
            if (query && typeof query === 'object' && query._) {
              // Handle Drizzle's eq() function
              const field = Object.keys(query)[0];
              const value = query[field];
              return mongoDb.collection(collection).find({ [field]: value }).toArray();
            }
            return mongoDb.collection(collection).find(query || {}).toArray();
          }
        })
      }),
      insert: () => ({
        values: (data: any) => ({
          returning: () => {
            // Generate a unique ID for MongoDB
            const id = randomUUID();
            const dataWithId = { ...data, id, createdAt: new Date() };
            return mongoDb.collection('users').insertOne(dataWithId).then(result => [dataWithId]);
          }
        })
      }),
      update: () => ({
        set: (data: any) => ({
          where: (query: any) => ({
            returning: () => {
              // Convert Drizzle query to MongoDB query
              let mongoQuery = {};
              if (query && typeof query === 'object' && query._) {
                const field = Object.keys(query)[0];
                const value = query[field];
                mongoQuery = { [field]: value };
              } else {
                mongoQuery = query || {};
              }
              
              const updateData = { ...data, updatedAt: new Date() };
              return mongoDb.collection('users').updateOne(mongoQuery, { $set: updateData }).then(result => {
                // Return the updated document
                return mongoDb.collection('users').findOne(mongoQuery).then(updatedDoc => [updatedDoc]);
              });
            }
          })
        })
      }),
      delete: () => ({
        where: (query: any) => {
          // Convert Drizzle query to MongoDB query
          let mongoQuery = {};
          if (query && typeof query === 'object' && query._) {
            const field = Object.keys(query)[0];
            const value = query[field];
            mongoQuery = { [field]: value };
          } else {
            mongoQuery = query || {};
          }
          return mongoDb.collection('users').deleteOne(mongoQuery);
        }
      })
    };
  } else if (isDevelopment) {
    // Mock database for development - store data in memory
    console.log('🔧 Using mock database for development');
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔧 isDevelopment:', isDevelopment);
    
    // In-memory storage for development
    const mockData = {
      users: new Map(),
      permissions: new Map(),
      earnings: new Map(),
      privacyFootprints: new Map()
    };

    // Add a test user for development
    const testUser = {
      id: 'test-user-id',
      username: 'testuser',
      email: 'test@example.com',
      password: '$2b$10$BYdn9VCs2Zn.94u6G4Tt1eqZpn71NgNPylPUKtjfSyEJfYdONFx.O', // password
      createdAt: new Date(),
      walletAddress: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    mockData.users.set('test-user-id', testUser);
    mockData.users.set('test@example.com', testUser); // Index by email for quick lookup

    // Create a mock database object
    const mockDb = {
      select: () => ({
        from: (table: string) => ({
          where: (query: any) => {
            console.log('🔍 Mock DB where called with table:', table);
            console.log('🔍 Mock DB query type:', typeof query);
            console.log('🔍 Mock DB query has queryChunks:', !!query?.queryChunks);
            if (table === 'users') {
              // Handle Drizzle's eq() function - it returns an object with queryChunks
              if (query && typeof query === 'object' && query.queryChunks) {
                // Extract field and value from queryChunks
                const chunks = query.queryChunks;
                console.log('🔍 Mock DB Query Debug:', { chunks, field: chunks[1], value: chunks[3] });
                if (chunks.length >= 4) {
                  const field = chunks[1]; // The field name
                  const value = chunks[3]; // The value
                  
                  if (field === 'id') {
                    const user = mockData.users.get(value);
                    console.log('🔍 Mock DB ID lookup:', { value, found: !!user });
                    return Promise.resolve(user ? [user] : []);
                  } else if (field === 'email') {
                    const user = mockData.users.get(value);
                    console.log('🔍 Mock DB Email lookup:', { value, found: !!user });
                    return Promise.resolve(user ? [user] : []);
                  }
                }
              } else {
                console.log('🔍 Mock DB Query not handled:', query);
              }
              return Promise.resolve([]);
            }
            return Promise.resolve([]);
          }
        })
      }),
      insert: () => ({
        values: (data: any) => ({
          returning: () => {
            const id = randomUUID();
            const userData = { ...data, id, createdAt: new Date() };
            mockData.users.set(id, userData);
            if (data.email) {
              mockData.users.set(data.email, userData); // Index by email
            }
            return Promise.resolve([userData]);
          }
        })
      }),
      update: () => ({
        set: (data: any) => ({
          where: (query: any) => ({
            returning: () => {
              if (query && typeof query === 'object' && query.queryChunks) {
                const chunks = query.queryChunks;
                if (chunks.length >= 4) {
                  const field = chunks[1];
                  const value = chunks[3];
                  
                  if (field === 'id') {
                    const existingUser = mockData.users.get(value);
                    if (existingUser) {
                      const updatedUser = { ...existingUser, ...data, updatedAt: new Date() };
                      mockData.users.set(value, updatedUser);
                      if (existingUser.email) {
                        mockData.users.set(existingUser.email, updatedUser);
                      }
                      return Promise.resolve([updatedUser]);
                    }
                  }
                }
              }
              return Promise.resolve([]);
            }
          })
        })
      }),
      delete: () => ({
        where: (query: any) => {
          if (query && typeof query === 'object' && query.queryChunks) {
            const chunks = query.queryChunks;
            if (chunks.length >= 4) {
              const field = chunks[1];
              const value = chunks[3];
              if (field === 'id') {
                const user = mockData.users.get(value);
                if (user) {
                  mockData.users.delete(value);
                  if (user.email) {
                    mockData.users.delete(user.email);
                  }
                }
              }
            }
          }
          return Promise.resolve();
        }
      })
    };

    db = mockDb;
    console.log('🔧 Mock database assigned:', typeof db);
    console.log('🔧 Mock database select method:', typeof db.select);
  } else {
    // Use Neon for production
    neonConfig.webSocketConstructor = ws;

    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
      );
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
  }
}

// Initialize database on module load
initializeDatabase();

export { db };