import { MessageEntry } from "@shared/schema";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const SYSTEM_MESSAGE: MessageEntry = {
  role: "system",
  content: `You are a friendly, knowledgeable fitness buddy who can create custom workout routines. You chat casually like a gym friend who knows their stuff.

Key personality traits:
- Casual and friendly tone (use "hey", "awesome", "nice!")
- Share personal insights like a workout partner would
- Ask follow-up questions to keep the conversation going
- Give practical, actionable advice
- Be encouraging but realistic
- Use emojis occasionally but don't overdo it

SPECIAL ABILITY: When someone asks you to create a workout routine, generate a complete routine with this EXACT JSON structure at the end of your response:

**ROUTINE_DATA_START**
{
  "name": "Routine Name",
  "description": "Brief description",
  "days": [
    {
      "name": "Day 1 Name (e.g., Push Day)",
      "description": "What this day focuses on",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": 12,
          "weight": 0,
          "rest": 60,
          "notes": "Form tips and guidance"
        }
      ],
      "duration": 45
    }
  ]
}
**ROUTINE_DATA_END**

Always include the markers ROUTINE_DATA_START and ROUTINE_DATA_END around the JSON when creating routines. Be conversational before the JSON, then provide the structured data.

Topics you excel at:
- Workout routines and exercise selection
- Form tips and technique advice
- Nutrition guidance
- Recovery and rest recommendations
- Motivation and goal setting
- Equipment alternatives`,
  timestamp: new Date().toISOString(),
};

// Function to extract routine data from AI response
export function extractRoutineData(content: string): any | null {
  const startMarker = "**ROUTINE_DATA_START**";
  const endMarker = "**ROUTINE_DATA_END**";
  
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    return null;
  }
  
  const jsonString = content.substring(startIndex + startMarker.length, endIndex).trim();
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing routine JSON:", error);
    return null;
  }
}

export async function getAIResponse(messages: MessageEntry[]): Promise<MessageEntry> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found");
    }

    // Format messages for Gemini API
    const geminiMessages = [SYSTEM_MESSAGE, ...messages].map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response from Gemini API");
    }

    const content = data.candidates[0].content.parts[0].text;

    return {
      role: "assistant",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error("Error getting Gemini response:", error);
    
    // Return a friendly fallback response
    return {
      role: "assistant",
      content: "Hey! I'm having a bit of trouble connecting right now. What's up with your workout today? I can still help you out! 💪",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function generateWorkoutPlan(userGoals: string, timeConstraint: number): Promise<any> {
  const prompt = `Create a workout plan for someone with these goals: ${userGoals}. They have ${timeConstraint} minutes available. Make it practical and achievable.`;
  
  const messages: MessageEntry[] = [
    {
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    }
  ];

  const response = await getAIResponse(messages);
  
  return {
    plan: response.content,
    duration: timeConstraint,
    exercises: []
  };
}

export async function getExerciseFormGuidance(exerciseName: string): Promise<any> {
  const prompt = `Give me detailed form tips for ${exerciseName}. Include proper technique, common mistakes to avoid, and any beginner modifications.`;
  
  const messages: MessageEntry[] = [
    {
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    }
  ];

  const response = await getAIResponse(messages);
  
  return {
    exercise: exerciseName,
    guidance: response.content,
    tips: []
  };
}