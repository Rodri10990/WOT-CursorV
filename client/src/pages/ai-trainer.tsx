import { useEffect, useState } from "react";
import ChatInterface from "@/components/workout/chat-interface";
import MessageInput from "@/components/workout/message-input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageEntry } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ConversationResponse {
  id: number;
  messages: MessageEntry[];
}

export default function AITrainer() {
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Fetch existing conversation or start a new one
  const { data: conversationData, isLoading } = useQuery<ConversationResponse>({
    queryKey: ["/api/trainer/conversation"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setIsTyping(true);
      const response = await apiRequest(
        "POST",
        "/api/trainer/message",
        {
          message,
          conversationId,
        }
      );
      return response.json();
    },
    onSuccess: (data) => {
      setIsTyping(false);
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/trainer/conversation"] });
    },
    onError: () => {
      setIsTyping(false);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (conversationData) {
      setConversationId(conversationData.id);
      setMessages(conversationData.messages || []);
    }
  }, [conversationData]);
  
  // Handle errors
  useEffect(() => {
    const handleError = () => {
      toast({
        title: "Connection error",
        description: "Please check your internet connection",
        variant: "destructive",
      });
    };
    window.addEventListener('offline', handleError);
    return () => window.removeEventListener('offline', handleError);
  }, [toast]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Add user message immediately to UI
    const userMessage: MessageEntry = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Trainer Info Section */}
      <div className="bg-white dark:bg-neutral-900 p-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center">
          <div className="mr-3 h-10 w-10 bg-accent rounded-full flex items-center justify-center">
            <span className="material-icons text-white text-lg">smart_toy</span>
          </div>
          <div>
            <h2 className="font-semibold text-base">AI Personal Trainer</h2>
            <p className="text-neutral-400 text-xs">Your fitness assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface 
        messages={messages} 
        isLoading={isLoading} 
        isTyping={isTyping} 
      />

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
