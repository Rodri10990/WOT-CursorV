import { users, type User, type InsertUser, AiConversation, InsertAiConversation, MessageEntry, aiConversations } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // AI Conversation methods
  getConversation(id: number): Promise<AiConversation | undefined>;
  getLatestConversation(userId: number): Promise<AiConversation | undefined>;
  createConversation(userId: number, messages: MessageEntry[]): Promise<AiConversation>;
  updateConversation(id: number, messages: MessageEntry[]): Promise<AiConversation>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // AI Conversation methods
  async getConversation(id: number): Promise<AiConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.id, id));
    
    return conversation;
  }
  
  async getLatestConversation(userId: number): Promise<AiConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.updatedAt))
      .limit(1);
    
    return conversation;
  }
  
  async createConversation(userId: number, messages: MessageEntry[]): Promise<AiConversation> {
    const now = new Date();
    
    const [conversation] = await db
      .insert(aiConversations)
      .values({
        userId,
        messages,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    
    return conversation;
  }
  
  async updateConversation(id: number, messages: MessageEntry[]): Promise<AiConversation> {
    const [updatedConversation] = await db
      .update(aiConversations)
      .set({
        messages,
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, id))
      .returning();
    
    if (!updatedConversation) {
      throw new Error(`Conversation with ID ${id} not found`);
    }
    
    return updatedConversation;
  }
}

// Comment out the MemStorage and use DatabaseStorage instead
// export class MemStorage implements IStorage { ... }

export const storage = new DatabaseStorage();
