import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { getAIResponse, generateWorkoutPlan, getExerciseFormGuidance, extractRoutineData } from "./helpers/gemini";
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
      
      // Check if AI created a routine (temporarily disabled for debugging)
      const routineData = extractRoutineData(assistantMessage.content);
      let savedRoutine = null;
      
      // Temporarily disabled to stop automatic routine creation
      // if (routineData) {
      //   savedRoutine = await storage.saveAIRoutine(userId, routineData);
      //   console.log("AI created routine saved:", savedRoutine.name);
      // }
      
      // Add assistant message to conversation
      updatedMessages = [...updatedMessages, assistantMessage];
      
      // Update conversation in storage
      await storage.updateConversation(conversation.id, updatedMessages);
      
      // Response with assistant message and any additional data
      return res.json({
        message: assistantMessage,
        conversationId: conversation.id,
        routine: savedRoutine, // Include saved routine if created
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

  // Enhanced workout generation endpoint with auto-save functionality
  app.post("/api/generate-workout", async (req: Request, res: Response) => {
    try {
      const { userId = 1, preferences, duration, difficulty, equipment } = req.body;
      
      // Generate workout using Gemini AI
      const workout = await generateWorkoutWithAI({
        preferences,
        duration,
        difficulty,
        equipment
      });
      
      // Auto-save to library with metadata
      const smartTags = generateSmartTags({ preferences, difficulty, equipment, workout });
      const estimatedCalories = calculateEstimatedCalories(duration, difficulty);
      const muscleGroups = extractMuscleGroups(workout);
      
      const workoutDoc = {
        userId,
        name: workout.name || `${difficulty} ${duration}-min Workout`,
        description: workout.description || `AI-generated ${difficulty} workout`,
        exercises: workout.exercises || [],
        duration: parseInt(duration) || 30,
        difficulty: difficulty || 'intermediate',
        category: 'ai-generated',
        estimatedCalories,
        targetMuscleGroups: muscleGroups,
        tags: smartTags,
        createdBy: 'ai-agent',
        autoGenerated: true
      };
      
      // Save to database using existing storage
      const savedWorkout = await storage.createWorkout(workoutDoc);
      
      return res.json({
        success: true,
        workout: {
          id: savedWorkout.id,
          ...workout
        },
        message: 'Workout generated and automatically saved to your library',
        savedToLibrary: true
      });
      
    } catch (error) {
      console.error("Error generating workout:", error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate workout'
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

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate workout with AI
async function generateWorkoutWithAI({ preferences, duration, difficulty, equipment }: any) {
  try {
    // Use existing generateWorkoutPlan function from Gemini helper
    const workout = await generateWorkoutPlan(preferences || "general fitness", parseInt(duration) || 30);
    
    return {
      name: `${difficulty} ${duration}-min Workout`,
      description: `AI-generated ${difficulty} workout focusing on ${preferences}`,
      exercises: workout.exercises || [],
      duration: parseInt(duration) || 30,
      difficulty: difficulty || 'intermediate'
    };
  } catch (error) {
    console.error('Error generating workout with AI:', error);
    throw new Error('Failed to generate workout');
  }
}

// Smart tag generation for better organization
function generateSmartTags({ preferences, difficulty, equipment, workout }: any) {
  const tags = [];
  
  // Basic tags
  tags.push(difficulty?.toLowerCase() || 'intermediate');
  tags.push(`${workout.duration || 30}min`);
  
  // Equipment tags
  if (equipment && Array.isArray(equipment)) {
    equipment.forEach((item: string) => {
      if (item !== 'none') tags.push(item.toLowerCase());
    });
  }
  
  // Preference-based tags
  if (preferences) {
    if (preferences.includes('cardio')) tags.push('cardio');
    if (preferences.includes('strength')) tags.push('strength');
    if (preferences.includes('flexibility')) tags.push('flexibility');
  }
  
  // Auto-detect workout type from exercises
  const exerciseNames = JSON.stringify(workout).toLowerCase();
  if (exerciseNames.includes('squat') || exerciseNames.includes('lunge')) tags.push('legs');
  if (exerciseNames.includes('push-up') || exerciseNames.includes('bench')) tags.push('chest');
  if (exerciseNames.includes('plank') || exerciseNames.includes('crunch')) tags.push('core');
  
  return Array.from(new Set(tags)); // Remove duplicates
}

// Calculate estimated calories (basic formula)
function calculateEstimatedCalories(duration: string | number, difficulty: string) {
  const baseCaloriesPerMinute: { [key: string]: number } = {
    'beginner': 5,
    'intermediate': 8,
    'advanced': 11
  };
  
  const durationNum = typeof duration === 'string' ? parseInt(duration) : duration;
  return Math.round(durationNum * (baseCaloriesPerMinute[difficulty?.toLowerCase()] || 8));
}

// Extract muscle groups from workout
function extractMuscleGroups(workout: any) {
  const muscleGroups = new Set();
  
  const exerciseText = JSON.stringify(workout).toLowerCase();
  
  const muscleKeywords: { [key: string]: string[] } = {
    'chest': ['push-up', 'bench press', 'fly', 'chest'],
    'back': ['pull-up', 'row', 'lat', 'back'],
    'legs': ['squat', 'lunge', 'leg', 'calf', 'hamstring'],
    'shoulders': ['shoulder', 'overhead press', 'lateral raise'],
    'arms': ['bicep', 'tricep', 'curl', 'arm'],
    'core': ['plank', 'crunch', 'abs', 'core']
  };
  
  for (const [muscle, keywords] of Object.entries(muscleKeywords)) {
    if (keywords.some(keyword => exerciseText.includes(keyword))) {
      muscleGroups.add(muscle);
    }
  }
  
  return Array.from(muscleGroups);
}
