// server/routes.ts - Fixed workout generation endpoint with Gemini and auto-save

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { getAIResponse, generateWorkoutPlan, getExerciseFormGuidance, extractRoutineData } from "./helpers/gemini";
import { MessageEntry } from "@shared/schema";
import { db } from "./db";
import { workouts } from "@shared/schema";

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
          content: "Hey! Good to see you here. What's going on today?",
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

  // Enhanced AI trainer message handler to detect workout generation requests
  app.post("/api/trainer/message", async (req: Request, res: Response) => {
    try {
      const { message, conversationId } = messageRequestSchema.parse(req.body);
      
      // In a real app, we'd use the authenticated user's ID
      const userId = 1;
      
      // Check if user is asking for a workout
      const isWorkoutRequest = message.toLowerCase().match(
        /create|generate|make|design|give me|build|suggest.*workout|routine|exercise|training/
      );
      
      if (isWorkoutRequest) {
        // Extract parameters from the message
        const duration = extractDuration(message) || 30;
        const difficulty = extractDifficulty(message) || 'intermediate';
        const preferences = extractPreferences(message);
        
        // Generate and auto-save workout
        try {
          const workoutData = await generateWorkoutWithAI({
            userId,
            preferences,
            duration,
            difficulty
          });
          
          if (workoutData.success) {
            // Return AI response with workout confirmation
            return res.json({
              message: {
                role: "assistant",
                content: `I've created a ${duration}-minute ${difficulty} workout for you! "${workoutData.workout.name}" has been automatically saved to your library. 

Here's what I've prepared:
- Warm-up: ${workoutData.workout.metadata?.exercises?.warmup?.length || 0} exercises
- Main workout: ${workoutData.workout.metadata?.exercises?.main?.length || 0} exercises  
- Cool-down: ${workoutData.workout.metadata?.exercises?.cooldown?.length || 0} exercises

Estimated calories burn: ${workoutData.workout.estimatedCalories} cal

Would you like me to walk you through the exercises, or would you prefer to start the workout now?`,
                timestamp: new Date().toISOString(),
              },
              conversationId: conversationId || 1,
              workoutGenerated: true,
              workoutId: workoutData.workout.id
            });
          }
        } catch (workoutError) {
          console.error('Workout generation failed:', workoutError);
          // Fall through to regular AI conversation
        }
      }
      
      // Regular AI conversation flow
      let conversation = conversationId 
        ? await storage.getConversation(conversationId) 
        : await storage.getLatestConversation(userId);
      
      if (!conversation) {
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
      
      // Response with assistant message
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
      const { goals, timeConstraint, equipment } = req.body;
      
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

  // Generate workout with Gemini and auto-save to database
  app.post('/api/generate-workout', async (req: Request, res: Response) => {
    try {
      const { userId = 1, preferences, duration, difficulty } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Generate workout using Gemini
      const prompt = `Generate a ${duration}-minute ${difficulty} fitness workout routine.
      User preferences: ${preferences || 'general fitness'}
      
      Return ONLY valid JSON in this exact format, no other text:
      {
        "name": "Workout name",
        "description": "Brief description",
        "duration": ${duration},
        "difficulty": "${difficulty}",
        "warmup": [
          {
            "name": "Exercise name",
            "duration": "seconds",
            "instructions": "How to perform"
          }
        ],
        "main": [
          {
            "name": "Exercise name",
            "sets": number,
            "reps": "number or time",
            "rest": "seconds",
            "instructions": "How to perform"
          }
        ],
        "cooldown": [
          {
            "name": "Exercise name",
            "duration": "seconds",
            "instructions": "How to perform"
          }
        ]
      }`;

      const geminiResponse = await generateWorkoutPlan(preferences || "general fitness", parseInt(duration) || 30);
      
      // Prepare workout for database with enhanced metadata
      const workoutToSave = {
        userId,
        name: geminiResponse.name || `${difficulty} ${duration}-min Workout`,
        description: geminiResponse.description || `AI-generated ${difficulty} workout`,
        duration: parseInt(duration) || 30,
        difficulty: difficulty || 'intermediate',
        category: 'ai-generated',
        createdBy: 'ai-agent',
        autoGenerated: true,
        exercises: geminiResponse,
        tags: generateTags(geminiResponse, preferences, difficulty),
        estimatedCalories: calculateCalories(parseInt(duration) || 30, difficulty),
        targetMuscleGroups: extractMuscleGroups(geminiResponse),
      };

      // Save to database using existing storage
      const savedWorkout = await storage.createWorkout(workoutToSave);

      if (!savedWorkout) {
        throw new Error('Failed to save workout to database');
      }

      console.log('Workout auto-saved:', savedWorkout.id);

      // Return success response
      res.json({
        success: true,
        workout: {
          id: savedWorkout.id,
          ...savedWorkout,
          exercises: geminiResponse // Include the structured exercise data
        },
        message: 'Workout generated and automatically saved to your library',
        savedToLibrary: true
      });

    } catch (error) {
      console.error('Error in generate-workout:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate workout'
      });
    }
  });

  // Original workouts API for manual workout creation
  app.post("/api/workouts", async (req: Request, res: Response) => {
    try {
      const workoutData = req.body;
      const savedWorkout = await storage.createWorkout(workoutData);
      return res.json({ success: true, workout: savedWorkout });
    } catch (error) {
      console.error("Error saving workout:", error);
      return res.status(500).json({ message: "Failed to save workout" });
    }
  });

  // GET workouts endpoint
  app.get("/api/workouts", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In real app, get from auth
      const userWorkouts = await storage.getUserWorkouts(userId);
      return res.json(userWorkouts);
    } catch (error) {
      console.error("Error getting workouts:", error);
      return res.status(500).json({ message: "Failed to get workouts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Enhanced workout generation with Gemini AI
async function generateWorkoutWithAI({ userId, preferences, duration, difficulty }: any) {
  try {
    const prompt = `Generate a ${duration}-minute ${difficulty} fitness workout routine.
    User preferences: ${preferences || 'general fitness'}
    
    Return a workout with structured exercises including warmup, main workout, and cooldown.`;

    const geminiResponse = await generateWorkoutPlan(preferences || "general fitness", parseInt(duration) || 30);
    
    // Prepare workout for database with enhanced metadata
    const workoutToSave = {
      userId,
      name: geminiResponse.name || `${difficulty} ${duration}-min Workout`,
      description: geminiResponse.description || `AI-generated ${difficulty} workout`,
      duration: parseInt(duration) || 30,
      difficulty: difficulty || 'intermediate',
      category: 'ai-generated',
      createdBy: 'ai-agent',
      autoGenerated: true,
      exercises: geminiResponse,
      tags: generateTags(geminiResponse, preferences, difficulty),
      estimatedCalories: calculateCalories(parseInt(duration) || 30, difficulty),
      targetMuscleGroups: extractMuscleGroups(geminiResponse),
    };

    // Save to database using existing storage
    const savedWorkout = await storage.createWorkout(workoutToSave);

    return {
      success: true,
      workout: {
        id: savedWorkout.id,
        ...savedWorkout,
        metadata: {
          exercises: geminiResponse
        }
      }
    };
  } catch (error) {
    console.error('Error generating workout with AI:', error);
    throw error;
  }
}

// Helper functions
function generateTags(workoutData: any, preferences: string, difficulty: string): string[] {
  const tags = new Set<string>();
  
  // Basic tags
  tags.add(difficulty.toLowerCase());
  if (workoutData.duration) tags.add(`${workoutData.duration}min`);
  
  // Extract from preferences
  if (preferences) {
    const prefLower = preferences.toLowerCase();
    if (prefLower.includes('cardio')) tags.add('cardio');
    if (prefLower.includes('strength')) tags.add('strength');
    if (prefLower.includes('flexibility')) tags.add('flexibility');
    if (prefLower.includes('hiit')) tags.add('hiit');
  }
  
  // Extract from exercises
  const exerciseText = JSON.stringify(workoutData).toLowerCase();
  
  // Auto-detect workout types
  if (exerciseText.includes('squat') || exerciseText.includes('lunge')) tags.add('legs');
  if (exerciseText.includes('push') || exerciseText.includes('press')) tags.add('upper-body');
  if (exerciseText.includes('plank') || exerciseText.includes('core')) tags.add('core');
  if (exerciseText.includes('run') || exerciseText.includes('jump')) tags.add('cardio');
  
  return Array.from(tags);
}

function calculateCalories(duration: number, difficulty: string): number {
  const caloriesPerMinute = {
    'beginner': 5,
    'intermediate': 8,
    'advanced': 11
  };
  
  const rate = caloriesPerMinute[difficulty.toLowerCase()] || 8;
  return Math.round(duration * rate);
}

function extractMuscleGroups(workoutData: any): string[] {
  const muscleGroups = new Set<string>();
  const exerciseText = JSON.stringify(workoutData).toLowerCase();
  
  const muscleKeywords = {
    'chest': ['push-up', 'bench', 'fly', 'chest'],
    'back': ['pull-up', 'row', 'lat', 'back'],
    'legs': ['squat', 'lunge', 'leg', 'calf', 'quad', 'hamstring'],
    'shoulders': ['shoulder', 'overhead', 'lateral', 'delt'],
    'arms': ['bicep', 'tricep', 'curl', 'arm'],
    'core': ['plank', 'crunch', 'abs', 'core', 'oblique'],
    'glutes': ['glute', 'hip', 'bridge']
  };
  
  for (const [muscle, keywords] of Object.entries(muscleKeywords)) {
    if (keywords.some(keyword => exerciseText.includes(keyword))) {
      muscleGroups.add(muscle);
    }
  }
  
  return Array.from(muscleGroups);
}

// Helper functions for parameter extraction
function extractDuration(message: string): number | null {
  const match = message.match(/(\d+)\s*(?:minute|min)/i);
  return match ? parseInt(match[1]) : null;
}

function extractDifficulty(message: string): string {
  if (/beginner|easy|simple/i.test(message)) return 'beginner';
  if (/advanced|hard|challenging/i.test(message)) return 'advanced';
  return 'intermediate';
}

function extractPreferences(message: string): string {
  const preferences = [];
  if (/cardio/i.test(message)) preferences.push('cardio');
  if (/strength/i.test(message)) preferences.push('strength');
  if (/flexibility|stretch/i.test(message)) preferences.push('flexibility');
  if (/hiit/i.test(message)) preferences.push('hiit');
  if (/yoga/i.test(message)) preferences.push('yoga');
  return preferences.join(', ') || 'general fitness';
}
