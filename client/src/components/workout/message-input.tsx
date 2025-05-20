import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-3">
      {/* Quick Prompts */}
      <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2 mb-2">
        <button
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full px-3 py-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
          onClick={() => handleQuickPrompt("Create a workout plan")}
        >
          Create a workout plan
        </button>
        <button
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full px-3 py-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
          onClick={() => handleQuickPrompt("Check my form for")}
        >
          Check my form for...
        </button>
        <button
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full px-3 py-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
          onClick={() => handleQuickPrompt("What exercises target")}
        >
          What exercises target...
        </button>
        <button
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full px-3 py-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
          onClick={() => handleQuickPrompt("Track my progress")}
        >
          Track my progress
        </button>
      </div>

      <form className="flex items-end" onSubmit={handleSubmit}>
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            className="w-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-2xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary resize-none text-sm"
            placeholder="Ask me anything about fitness..."
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            type="button" 
            className="absolute bottom-2 right-12 text-neutral-400 dark:text-neutral-500"
            onClick={() => {
              // Voice input functionality would be implemented here
              // For now just a placeholder
            }}
          >
            <span className="material-icons text-xl">mic</span>
          </button>
        </div>
        <Button 
          type="submit" 
          className="ml-2 bg-primary hover:bg-primary/90 text-white rounded-full h-9 w-9 flex items-center justify-center flex-shrink-0 p-0"
          disabled={!message.trim()}
        >
          <span className="material-icons">send</span>
        </Button>
      </form>
    </div>
  );
}
