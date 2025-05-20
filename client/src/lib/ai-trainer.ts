import { MessageEntry } from "@shared/schema";

// Helper functions for AI trainer functionality

/**
 * Extracts potential exercise list from AI message
 */
export function extractExercises(message: MessageEntry): string[] | null {
  if (message.role !== "assistant") return null;
  
  const content = message.content;
  
  // Check if content contains exercise-related keywords
  if (!content.match(/exercise|workout|routine|training/i)) return null;
  
  // Simple regex to find potential exercises 
  // This is a basic implementation - in production you'd use NLP or more sophisticated methods
  const exerciseMatches = content.match(/([A-Z][a-z]+ (?:[A-Z][a-z]+ )?(?:Squats|Press|Rows|Lunges|Plank|Curl|Extension|Raise|Fly|Push-ups|Pull-ups))/g);
  
  return exerciseMatches || null;
}

/**
 * Checks if message likely contains workout plan
 */
export function messageContainsWorkoutPlan(message: MessageEntry): boolean {
  if (message.role !== "assistant") return false;
  
  const content = message.content.toLowerCase();
  const exerciseCount = extractExercises(message)?.length || 0;
  
  // Look for workout-related keywords
  return (
    (content.includes("workout plan") || content.includes("routine") || content.includes("program")) &&
    (content.includes("sets") || content.includes("reps")) &&
    exerciseCount >= 3
  );
}

/**
 * Checks if message likely contains exercise form guidance
 */
export function messageContainsExerciseForm(message: MessageEntry): boolean {
  if (message.role !== "assistant") return false;
  
  const content = message.content.toLowerCase();
  
  // Look for form guidance keywords
  return (
    content.includes("form") && 
    (content.includes("exercise") || extractExercises(message) !== null) &&
    (
      content.includes("step") || 
      content.includes("position") || 
      content.includes("technique") ||
      content.includes("proper form")
    )
  );
}

/**
 * Checks if message likely contains progress data
 */
export function messageContainsProgressData(message: MessageEntry): boolean {
  if (message.role !== "assistant") return false;
  
  const content = message.content.toLowerCase();
  
  // Look for progress-related keywords
  return (
    (content.includes("progress") || content.includes("improvement")) &&
    (
      content.includes("increase") || 
      content.includes("growth") || 
      content.includes("%") || 
      content.includes("percent")
    )
  );
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffMs = now.getTime() - messageTime.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec} seconds ago`;
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  
  // Convert to hours
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  
  // Convert to days
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  
  // Convert to months
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
}
