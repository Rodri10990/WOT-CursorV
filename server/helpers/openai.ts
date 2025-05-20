import OpenAI from "openai";
import { MessageEntry } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || (process.env.OPENAI_API_KEY_ENV_VAR ? process.env[process.env.OPENAI_API_KEY_ENV_VAR] : undefined) || "sk-default_key" 
});

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

export async function getAIResponse(messages: MessageEntry[]): Promise<MessageEntry> {
  try {
    // Prepare conversation with system message and user messages
    const conversationMessages = [
      { role: SYSTEM_MESSAGE.role, content: SYSTEM_MESSAGE.content },
      ...messages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: conversationMessages as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Get the assistant's response
    const assistantResponse = response.choices[0].message.content || "I'm sorry, I couldn't generate a response at this time.";

    // Return formatted message
    return {
      role: "assistant",
      content: assistantResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error getting AI response:", error);
    
    // Return fallback response
    return {
      role: "assistant", 
      content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function generateWorkoutPlan(userGoals: string, timeConstraint: number): Promise<any> {
  try {
    const prompt = `Create a workout plan with the following parameters:
    - User goals: ${userGoals}
    - Time constraint: ${timeConstraint} minutes
    
    Return the response as a JSON object with the following structure:
    {
      "name": "Workout name",
      "description": "Brief description",
      "duration": duration in minutes,
      "exercises": [
        {
          "name": "Exercise name",
          "sets": number of sets,
          "reps": number of reps,
          "duration": duration in seconds (if applicable),
          "notes": "Any specific instructions"
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_MESSAGE.content },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan");
  }
}

export async function getExerciseFormGuidance(exerciseName: string): Promise<any> {
  try {
    const prompt = `Provide detailed form guidance for ${exerciseName}. Include:
    1. Step-by-step instructions
    2. Common form mistakes to avoid
    3. Key points to focus on for proper form
    4. Modifications for beginners
    
    Return the response as a JSON object with the following structure:
    {
      "exerciseName": "Name of exercise",
      "steps": ["Step 1", "Step 2", "Step 3"...],
      "keyPoints": ["Key point 1", "Key point 2"...],
      "commonMistakes": ["Mistake 1", "Mistake 2"...],
      "beginnerModifications": ["Modification 1", "Modification 2"...]
    }`;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_MESSAGE.content },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error getting exercise form guidance:", error);
    throw new Error("Failed to get exercise form guidance");
  }
}
