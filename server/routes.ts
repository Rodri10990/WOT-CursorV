import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { getAIResponse, generateWorkoutPlan, getExerciseFormGuidance } from "./helpers/openai";
import { MessageEntry } from "@shared/schema";

const messageRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.number().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Trainer routes
  app.get("/api/trainer/conversation", async (req: Request, res: Response) => {
    try {
      // In a real app, we would use the user's ID from authentication
      // For now, we'll use a demo user ID
      const userId = 1;
      const conversation = await storage.getLatestConversation(userId);
      
      if (!conversation) {
        // If no conversation exists, create a new one with default welcome message
        const welcomeMessage: MessageEntry = {
          role: "assistant",
          content: "Hello! I'm your AI workout assistant. I can help you create personalized workout plans, provide exercise form guidance, and track your progress. What would you like to do today?",
          timestamp: new Date().toISOString(),
        };
        
        const newConversation = await storage.createConversation(userId, [welcomeMessage]);
        return res.json(newConversation);
      }
      
      return res.json(conversation);
    } catch (error) {
      console.error("Error getting conversation:", error);
      return res.status(500).json({ message: "Failed to get conversation" });
    }
  });

  app.post("/api/trainer/message", async (req: Request, res: Response) => {
    try {
      const { message, conversationId } = messageRequestSchema.parse(req.body);
      
      // In a real app, we'd use the authenticated user's ID
      const userId = 1;
      
      // Get or create conversation
      let conversation = conversationId 
        ? await storage.getConversation(conversationId) 
        : await storage.getLatestConversation(userId);
      
      if (!conversation) {
        // Create new conversation if none exists
        conversation = await storage.createConversation(userId, []);
      }
      
      // Add user message to conversation
      const userMessage: MessageEntry = {
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      
      // Get assistant response
      let updatedMessages = [...conversation.messages, userMessage];
      const assistantMessage = await getAIResponse(updatedMessages);
      
      // Add assistant message to conversation
      updatedMessages = [...updatedMessages, assistantMessage];
      
      // Update conversation in storage
      await storage.updateConversation(conversation.id, updatedMessages);
      
      // Response with assistant message and any additional data
      return res.json({
        message: assistantMessage,
        conversationId: conversation.id,
      });
    } catch (error) {
      console.error("Error processing message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Workout generation endpoint
  app.post("/api/trainer/generate-workout", async (req: Request, res: Response) => {
    try {
      const { goals, timeConstraint } = req.body;
      
      if (!goals || !timeConstraint) {
        return res.status(400).json({ message: "Goals and time constraint are required" });
      }
      
      const workoutPlan = await generateWorkoutPlan(goals, timeConstraint);
      return res.json(workoutPlan);
    } catch (error) {
      console.error("Error generating workout:", error);
      return res.status(500).json({ message: "Failed to generate workout plan" });
    }
  });

  // Exercise form guidance endpoint
  app.get("/api/trainer/exercise-form/:exerciseName", async (req: Request, res: Response) => {
    try {
      const { exerciseName } = req.params;
      
      if (!exerciseName) {
        return res.status(400).json({ message: "Exercise name is required" });
      }
      
      const formGuidance = await getExerciseFormGuidance(exerciseName);
      return res.json(formGuidance);
    } catch (error) {
      console.error("Error getting exercise form guidance:", error);
      return res.status(500).json({ message: "Failed to get exercise form guidance" });
    }
  });

  // Mock workouts API for development (would be replaced with real workout storage)
  app.post("/api/workouts", async (req: Request, res: Response) => {
    try {
      // In a real app, this would save to the database
      return res.json({ success: true, id: Math.floor(Math.random() * 1000) });
    } catch (error) {
      console.error("Error saving workout:", error);
      return res.status(500).json({ message: "Failed to save workout" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
