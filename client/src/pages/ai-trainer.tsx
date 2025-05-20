import { useEffect, useState } from "react";
import ChatInterface from "@/components/workout/chat-interface";
import MessageInput from "@/components/workout/message-input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageEntry } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AITrainer() {
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Fetch existing conversation or start a new one
  const { data: conversationData, isLoading } = useQuery({
    queryKey: ["/api/trainer/conversation"],
    onError: () => {
      toast({
        title: "Failed to load conversation",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    },
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
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 h-12 w-12 bg-accent rounded-full flex items-center justify-center">
            <span className="material-icons text-white">smart_toy</span>
          </div>
          <div>
            <h2 className="font-heading font-semibold text-lg">AI Personal Trainer</h2>
            <p className="text-neutral-300 text-sm">Your personalized workout assistant</p>
          </div>
          <div className="ml-auto">
            <button className="text-primary flex items-center text-sm">
              <span className="material-icons text-sm mr-1">info</span>
              About
            </button>
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
