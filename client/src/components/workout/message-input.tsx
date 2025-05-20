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
    <div className="bg-white border-t border-neutral-200 p-4">
      <form className="flex items-end" onSubmit={handleSubmit}>
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            className="w-full border border-neutral-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none"
            placeholder="Ask me anything about fitness or workouts..."
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            type="button" 
            className="absolute bottom-3 right-3 text-neutral-300"
            onClick={() => {
              // Voice input functionality would be implemented here
              // For now just a placeholder
            }}
          >
            <span className="material-icons">mic</span>
          </button>
        </div>
        <Button 
          type="submit" 
          className="ml-3 bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 p-0"
        >
          <span className="material-icons">send</span>
        </Button>
      </form>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          className="bg-neutral-100 hover:bg-neutral-200 rounded-full px-3 py-1 text-sm text-neutral-400"
          onClick={() => handleQuickPrompt("Create a workout plan")}
        >
          Create a workout plan
        </button>
        <button
          className="bg-neutral-100 hover:bg-neutral-200 rounded-full px-3 py-1 text-sm text-neutral-400"
          onClick={() => handleQuickPrompt("Check my form for")}
        >
          Check my form for...
        </button>
        <button
          className="bg-neutral-100 hover:bg-neutral-200 rounded-full px-3 py-1 text-sm text-neutral-400"
          onClick={() => handleQuickPrompt("What exercises target")}
        >
          What exercises target...
        </button>
        <button
          className="bg-neutral-100 hover:bg-neutral-200 rounded-full px-3 py-1 text-sm text-neutral-400"
          onClick={() => handleQuickPrompt("Track my progress")}
        >
          Track my progress
        </button>
      </div>
    </div>
  );
}
