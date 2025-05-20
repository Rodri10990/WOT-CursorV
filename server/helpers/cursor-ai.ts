import axios from 'axios';
import { MessageEntry } from "@shared/schema";

// System message that guides the AI on how to respond
const SYSTEM_MESSAGE: MessageEntry = {
  role: "system",
  content: `You are an AI personal trainer with expertise in exercise science, fitness, and nutrition. Your goal is to provide personalized workout guidance, exercise form instructions, and progress tracking for users.

  Important guidelines:
  - Provide evidence-based fitness advice that's scientifically accurate
  - Consider the user's fitness level and goals when making recommendations
  - Explain exercises in clear, step-by-step instructions
  - Focus on proper form and safety
  - Provide realistic and sustainable workout plans
  - Be motivating and supportive
  - Avoid giving medical advice
  
  When the user asks about:
  - Workouts: Suggest balanced routines with specific exercises, sets, reps and durations
  - Exercise form: Explain proper technique with step-by-step guidance
  - Progress tracking: Reference the user's past workouts data and analyze improvements

  Keep your responses concise but informative.`,
  timestamp: new Date().toISOString(),
};

// Function to get AI response using Cursor's built-in AI
export async function getAIResponse(messages: MessageEntry[]): Promise<MessageEntry> {
  try {
    // Use mock responses instead of making actual API calls
    return getMockResponse(messages[messages.length - 1]);
  } catch (error) {
    console.error("Error getting AI response:", error);
    
    // Return a mock response on error
    return getMockResponse(messages[messages.length - 1]);
  }
}

// Function to generate mock responses for testing
function getMockResponse(lastMessage: MessageEntry): MessageEntry {
  const userMessage = lastMessage.content.toLowerCase();
  let responseContent = "";
  
  // Generate different responses based on user input patterns
  if (userMessage.includes("workout plan") || userMessage.includes("routine")) {
    responseContent = "Here's a 30-minute strength workout plan perfect for busy individuals:\n\n" +
      "1. Warm-up (5 minutes): Light cardio and dynamic stretches\n" +
      "2. Main Circuit (20 minutes, 3 rounds):\n" +
      "   - Goblet Squats: 12 reps\n" +
      "   - Push-ups: 10-15 reps (modify as needed)\n" +
      "   - Dumbbell Rows: 12 reps per arm\n" +
      "   - Lunges: 10 reps per leg\n" +
      "   - Plank: 30 seconds\n" +
      "3. Cool-down (5 minutes): Static stretching\n\n" +
      "This balanced routine works all major muscle groups and can be done 3 times per week.";
  } 
  else if (userMessage.includes("form") && (userMessage.includes("squat") || userMessage.includes("deadlift") || userMessage.includes("bench") || userMessage.includes("exercise"))) {
    responseContent = "Proper form is crucial for both effectiveness and injury prevention. Here's a breakdown for a basic squat:\n\n" +
      "Key Form Points:\n" +
      "1. Start with feet shoulder-width apart, toes slightly pointed outward\n" +
      "2. Keep your chest up and core engaged\n" +
      "3. Push your hips back and bend your knees simultaneously\n" +
      "4. Lower until thighs are parallel to ground (or as low as comfortable with good form)\n" +
      "5. Keep weight in mid-foot and heels, not toes\n" +
      "6. Ensure knees track over toes (don't cave inward)\n" +
      "7. Push through heels to return to standing\n\n" +
      "Common mistakes include rounding the back, letting knees cave inward, or rising onto toes.";
  } 
  else if (userMessage.includes("progress") || userMessage.includes("tracking")) {
    responseContent = "Tracking your progress is essential for long-term success. Based on your recent workouts, here's a summary of your strength gains:\n\n" +
      "- Overall strength increase: 12% in the last 30 days\n" +
      "- Squat: Improved from 135 lbs to 155 lbs (+15%)\n" +
      "- Bench Press: Improved from 110 lbs to 130 lbs (+18%)\n" +
      "- Deadlift: Improved from 160 lbs to 175 lbs (+9%)\n\n" +
      "Your consistency has been excellent at 82% (14 out of 17 planned sessions completed). Keep up the great work!";
  } 
  else if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("hey")) {
    responseContent = "Hello! I'm your AI workout assistant. I can help you create personalized workout plans, provide exercise form guidance, and track your progress. What would you like help with today?";
  } 
  else {
    responseContent = "I'm here to help with your fitness journey. I can create personalized workout plans, provide form guidance for exercises, or help track your progress. What specific fitness topic would you like to explore?";
  }
  
  return {
    role: "assistant",
    content: responseContent,
    timestamp: new Date().toISOString(),
  };
}

export async function generateWorkoutPlan(userGoals: string, timeConstraint: number): Promise<any> {
  try {
    // Return a predefined workout plan
    return {
      name: `${timeConstraint}-Minute ${userGoals.includes("strength") ? "Strength" : "Full-Body"} Workout`,
      description: `A balanced routine for ${userGoals.includes("beginner") ? "beginners" : "all fitness levels"}`,
      duration: timeConstraint,
      exercises: [
        { name: "Goblet Squats", sets: 3, reps: 12 },
        { name: "Push-ups", sets: 3, reps: 15 },
        { name: "Dumbbell Rows", sets: 3, reps: 12 },
        { name: "Lunges", sets: 2, reps: 10 },
        { name: "Plank", sets: 3, duration: 30 }
      ]
    };
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan");
  }
}

export async function getExerciseFormGuidance(exerciseName: string): Promise<any> {
  try {
    // Return predefined exercise form guidance based on exercise name
    const exerciseGuides: Record<string, any> = {
      "squat": {
        exerciseName: "Squat",
        steps: [
          "Stand with feet shoulder-width apart, toes slightly pointed outward",
          "Keep your chest up and core engaged",
          "Push your hips back and bend your knees simultaneously",
          "Lower until thighs are parallel to ground (or as low as comfortable with good form)",
          "Push through heels to return to standing"
        ],
        keyPoints: [
          "Keep weight in mid-foot and heels, not toes",
          "Maintain a neutral spine throughout the movement",
          "Knees should track over toes, not caving inward",
          "Brace your core throughout the exercise"
        ],
        commonMistakes: [
          "Letting the knees cave inward",
          "Rounding the lower back",
          "Lifting heels off the ground",
          "Not reaching proper depth"
        ],
        beginnerModifications: [
          "Use a chair or bench to squat to",
          "Reduce weight or use bodyweight only",
          "Decrease range of motion until flexibility improves",
          "Hold onto a stable surface for balance"
        ]
      },
      "pushup": {
        exerciseName: "Push-up",
        steps: [
          "Start in a high plank position with hands slightly wider than shoulder-width",
          "Keep your body in a straight line from head to heels",
          "Lower your chest toward the ground by bending your elbows",
          "Keep elbows at a 45-degree angle to your body",
          "Push back up to the starting position"
        ],
        keyPoints: [
          "Maintain a rigid plank throughout the movement",
          "Keep your core engaged and glutes tight",
          "Don't let your hips sag or pike up",
          "Breathe out as you push up"
        ],
        commonMistakes: [
          "Flaring elbows too wide",
          "Letting the hips sag",
          "Not going deep enough",
          "Holding your breath"
        ],
        beginnerModifications: [
          "Perform on knees instead of toes",
          "Use an elevated surface like a counter or wall",
          "Decrease range of motion",
          "Increase rest between sets"
        ]
      },
      "plank": {
        exerciseName: "Plank",
        steps: [
          "Place forearms on the ground with elbows under shoulders",
          "Extend legs back with toes on the ground",
          "Create a straight line from head to heels",
          "Hold the position while breathing normally",
          "Keep your gaze slightly in front of your hands"
        ],
        keyPoints: [
          "Engage your core by drawing your navel toward your spine",
          "Keep your glutes and quads tight",
          "Maintain neutral alignment in your neck and spine",
          "Distribute weight evenly between forearms and toes"
        ],
        commonMistakes: [
          "Letting the hips sag",
          "Raising the hips too high",
          "Holding your breath",
          "Dropping the head or looking up"
        ],
        beginnerModifications: [
          "Hold the position for shorter periods (10-15 seconds)",
          "Perform on knees instead of toes",
          "Place hands on an elevated surface",
          "Take breaks between shorter holds"
        ]
      }
    };
    
    // Normalize the exercise name for matching
    const normalizedName = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Find the closest match
    let bestMatch = "squat"; // Default to squat if no match found
    for (const key of Object.keys(exerciseGuides)) {
      if (normalizedName.includes(key)) {
        bestMatch = key;
        break;
      }
    }
    
    return exerciseGuides[bestMatch];
  } catch (error) {
    console.error("Error getting exercise form guidance:", error);
    throw new Error("Failed to get exercise form guidance");
  }
}