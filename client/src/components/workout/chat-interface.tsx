import { useRef, useEffect, ReactNode } from "react";
import { MessageEntry } from "@shared/schema";
import WorkoutPlanCard from "./workout-plan-card";
import ExerciseFormCard from "./exercise-form-card";
import ProgressSummaryCard from "./progress-summary-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatInterfaceProps {
  messages: MessageEntry[];
  isLoading: boolean;
  isTyping: boolean;
  specialContent?: ReactNode;
}

export default function ChatInterface({ messages, isLoading, isTyping, specialContent }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatic scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, specialContent]);

  // Initial welcome message if no messages exist
  const welcomeMessage: MessageEntry = {
    role: "assistant",
    content: "Hello! I'm your AI workout assistant. I can help you create personalized workout plans, provide exercise form guidance, and track your progress. What would you like to do today?",
    timestamp: new Date().toISOString(),
  };

  // Determine if the message contains special card content
  const hasWorkoutPlan = (content: string) => content.includes("workout plan") || content.includes("routine");
  const hasExerciseForm = (content: string) => content.includes("form") && content.includes("exercise");
  const hasProgressData = (content: string) => content.includes("progress") || content.includes("improvement");

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <Skeleton className="h-20 w-3/4 mb-4 rounded-lg" />
        <Skeleton className="h-20 w-2/3 mb-4 ml-auto rounded-lg" />
        <Skeleton className="h-32 w-3/4 mb-4 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4" id="chat-messages">
      {/* Show welcome message if no messages */}
      {messages.length === 0 && (
        <div className="flex mb-4">
          <div className="h-8 w-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center mr-2">
            <span className="material-icons text-white text-sm">smart_toy</span>
          </div>
          <div className="max-w-[85%] bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none shadow-sm">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{welcomeMessage.content}</p>
          </div>
        </div>
      )}

      {/* Map through messages */}
      {messages.map((message, index) => {
        if (message.role === "user") {
          return (
            <div className="flex justify-end mb-4" key={index}>
              <div className="max-w-[85%] bg-primary text-white p-3 rounded-2xl rounded-br-none">
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          );
        } else if (message.role === "assistant") {
          return (
            <div className="flex mb-4" key={index}>
              <div className="h-8 w-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center mr-2">
                <span className="material-icons text-white text-sm">smart_toy</span>
              </div>
              <div className="max-w-[85%]">
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none shadow-sm mb-2">
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">{message.content}</p>
                </div>

                {/* Conditionally render special cards based on message content */}
                {hasWorkoutPlan(message.content) && (
                  <WorkoutPlanCard />
                )}

                {hasExerciseForm(message.content) && (
                  <ExerciseFormCard />
                )}

                {hasProgressData(message.content) && (
                  <ProgressSummaryCard />
                )}
              </div>
            </div>
          );
        }
        return null;
      })}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex mb-4">
          <div className="h-8 w-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center mr-2">
            <span className="material-icons text-white text-sm">smart_toy</span>
          </div>
          <div className="max-w-[85%] bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none shadow-sm">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      )}

      {/* This empty div helps with scrolling to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
}
