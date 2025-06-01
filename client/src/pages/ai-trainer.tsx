// client/src/pages/ProactiveTrainer.tsx - Enhanced AI trainer with proactive suggestions

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Sparkles, 
  TrendingUp,
  Target,
  Calendar,
  Zap,
  Brain
} from 'lucide-react';

export function ProactiveTrainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPatterns, setUserPatterns] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    initializeProactiveAgent();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeProactiveAgent = async () => {
    // Load user patterns
    try {
      const patternsRes = await fetch(`/api/patterns/${userId}`);
      const patternsData = await patternsRes.json();
      setUserPatterns(patternsData.patterns);

      // Generate proactive greeting based on patterns
      const greeting = generateProactiveGreeting(patternsData.patterns);
      setMessages([{ role: 'assistant', content: greeting }]);

      // Generate quick action suggestions
      const quickActions = generateQuickActions(patternsData.patterns);
      setSuggestions(quickActions);
    } catch (error) {
      console.error('Error initializing:', error);
      setMessages([{ 
        role: 'assistant', 
        content: 'Hey there! I\'m your AI fitness trainer. How can I help you today?' 
      }]);
    }
  };

  const generateProactiveGreeting = (patterns) => {
    const hour = new Date().getHours();
    let timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    
    let greeting = `${timeGreeting}! 🌟\n\n`;
    
    // Personalized insights
    if (patterns.workoutFrequency === 'daily') {
      greeting += `Amazing consistency! You've been crushing it with daily workouts. `;
    } else if (patterns.workoutFrequency === 'occasional') {
      greeting += `I noticed it's been a while since your last workout. Ready to get back on track? `;
    }
    
    // Muscle group recommendation
    const leastWorked = findLeastWorkedMuscle(patterns.muscleGroupFocus);
    if (leastWorked) {
      greeting += `\n\nI've noticed you haven't worked on ${leastWorked} recently. `;
    }
    
    // Time-based suggestion
    if (hour >= 6 && hour <= 9) {
      greeting += `Perfect time for an energizing morning workout! `;
    } else if (hour >= 17 && hour <= 20) {
      greeting += `Great time to release the day's stress with some exercise! `;
    }
    
    greeting += '\n\nWhat would you like to focus on today?';
    
    return greeting;
  };

  const generateQuickActions = (patterns) => {
    const actions = [];
    
    // Based on last workout
    const muscleGroups = Object.keys(patterns.muscleGroupFocus || {});
    const leastWorked = findLeastWorkedMuscle(patterns.muscleGroupFocus);
    
    if (leastWorked) {
      actions.push({
        icon: <Target className="w-4 h-4" />,
        label: `${leastWorked} workout`,
        action: `Create a ${patterns.preferredDifficulty} ${leastWorked} workout for ${patterns.averageDuration} minutes`
      });
    }
    
    // Based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      actions.push({
        icon: <Zap className="w-4 h-4" />,
        label: 'Morning HIIT',
        action: 'Generate a 20-minute morning HIIT workout to boost my energy'
      });
    } else if (hour > 20) {
      actions.push({
        icon: <Sparkles className="w-4 h-4" />,
        label: 'Evening stretch',
        action: 'Create a relaxing evening stretch routine'
      });
    }
    
    // Progressive suggestion
    if (patterns.preferredDifficulty === 'beginner') {
      actions.push({
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Level up',
        action: 'Create an intermediate workout to challenge myself'
      });
    }
    
    // Weekly plan
    actions.push({
      icon: <Calendar className="w-4 h-4" />,
      label: 'Weekly plan',
      action: 'Design a balanced weekly workout plan for me'
    });
    
    return actions;
  };

  const findLeastWorkedMuscle = (muscleGroupFocus) => {
    if (!muscleGroupFocus) return null;
    
    const allMuscles = ['legs', 'chest', 'back', 'shoulders', 'arms', 'core'];
    const worked = Object.keys(muscleGroupFocus);
    const notWorked = allMuscles.filter(m => !worked.includes(m));
    
    if (notWorked.length > 0) return notWorked[0];
    
    // Find least frequently worked
    return Object.entries(muscleGroupFocus)
      .sort(([,a], [,b]) => a - b)[0]?.[0];
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMessage = messageText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Check if this is a workout request
      const isWorkoutRequest = userMessage.toLowerCase().match(
        /create|generate|make|design|build|plan.*workout|routine|exercise|training/
      );

      if (isWorkoutRequest) {
        // Add thinking indicator
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '🤔 Analyzing your request and personalizing based on your history...',
          thinking: true 
        }]);
      }

      const response = await fetch('/api/trainer/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          message: userMessage,
          userId,
          patterns: userPatterns // Include patterns for context
        })
      });

      const data = await response.json();
      
      // Remove thinking message
      setMessages(prev => prev.filter(m => !m.thinking));
      
      // Add actual response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);

      // If workout was generated, show success animation
      if (data.workoutGenerated) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'system',
            content: '✅ Workout saved to your library!',
            type: 'success'
          }]);
        }, 500);
      }

      // Update suggestions based on conversation
      if (data.newSuggestions) {
        setSuggestions(data.newSuggestions);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.filter(m => !m.thinking));
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`max-w-[80%] ${message.role === 'system' ? 'w-full' : ''}`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">AI Trainer</span>
                  <Brain className="w-4 h-4 text-primary/60" />
                </div>
              )}
              
              <Card className={`p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-white' 
                  : message.role === 'system'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </Card>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <Card className="p-3 bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">🧠</div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick action suggestions */}
      {suggestions.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Suggested actions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => sendMessage(suggestion.action)}
                className="text-xs"
              >
                {suggestion.icon}
                <span className="ml-1">{suggestion.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything about fitness..."
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={() => sendMessage()} 
            disabled={loading || !input.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Context indicator */}
        {userPatterns && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Brain className="w-3 h-3" />
            <span>
              AI personalized based on your {userPatterns.workoutFrequency} workout habits
            </span>
          </div>
        )}
      </div>
    </div>
  );
}