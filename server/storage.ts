import { users, type User, type InsertUser, AiConversation, InsertAiConversation, MessageEntry } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, AiConversation>;
  currentUserId: number;
  currentConversationId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
    
    // Add a demo user
    this.createUser({
      username: "demo",
      password: "password",
      name: "Jamie Smith",
      plan: "Premium",
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // AI Conversation methods
  async getConversation(id: number): Promise<AiConversation | undefined> {
    return this.conversations.get(id);
  }
  
  async getLatestConversation(userId: number): Promise<AiConversation | undefined> {
    // Find the most recent conversation for the user
    const userConversations = Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    return userConversations.length > 0 ? userConversations[0] : undefined;
  }
  
  async createConversation(userId: number, messages: MessageEntry[]): Promise<AiConversation> {
    const id = this.currentConversationId++;
    const now = new Date().toISOString();
    
    const conversation: AiConversation = {
      id,
      userId,
      messages,
      createdAt: now,
      updatedAt: now,
    };
    
    this.conversations.set(id, conversation);
    return conversation;
  }
  
  async updateConversation(id: number, messages: MessageEntry[]): Promise<AiConversation> {
    const conversation = this.conversations.get(id);
    
    if (!conversation) {
      throw new Error(`Conversation with ID ${id} not found`);
    }
    
    const updatedConversation: AiConversation = {
      ...conversation,
      messages,
      updatedAt: new Date().toISOString(),
    };
    
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
}

export const storage = new MemStorage();
