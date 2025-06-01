// client/src/pages/SmartLibrary.tsx - Enhanced library with intelligence

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Search,
  Filter,
  Archive,
  Clock,
  Flame,
  Dumbbell,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

export function SmartLibrary() {
  const [workouts, setWorkouts] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [organizing, setOrganizing] = useState(false);
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load workouts
      const workoutsRes = await fetch('/api/workouts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const workoutsData = await workoutsRes.json();
      setWorkouts(workoutsData);

      // Load recommendations
      const recsRes = await fetch(`/api/recommendations/${userId}`);
      const recsData = await recsRes.json();
      setRecommendations(recsData.recommendations);

      // Load patterns
      const patternsRes = await fetch(`/api/patterns/${userId}`);
      const patternsData = await patternsRes.json();
      setPatterns(patternsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizeLibrary = async () => {
    setOrganizing(true);
    try {
      const res = await fetch(`/api/organize-library/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`✨ Library organized! ${data.archived} old workouts archived.`);
        loadData(); // Reload to see changes
      }
    } catch (error) {
      console.error('Error organizing:', error);
    } finally {
      setOrganizing(false);
    }
  };

  const smartSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch('/api/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, query: searchQuery })
      });
      const data = await res.json();
      
      if (data.success) {
        setWorkouts(data.results);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const filterWorkoutsByTab = () => {
    if (activeTab === 'all') return workouts;
    
    return workouts.filter(workout => {
      const categories = workout.metadata?.categories;
      
      switch (activeTab) {
        case 'strength':
          return categories?.primary === 'strength-training';
        case 'cardio':
          return categories?.primary === 'cardio';
        case 'hiit':
          return categories?.primary === 'hiit';
        case 'flexibility':
          return categories?.primary === 'flexibility';
        case 'archived':
          return workout.metadata?.archived === true;
        default:
          return true;
      }
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'strength-training': return <Dumbbell className="w-4 h-4" />;
      case 'cardio': return <Flame className="w-4 h-4" />;
      case 'hiit': return <TrendingUp className="w-4 h-4" />;
      case 'flexibility': return <Sparkles className="w-4 h-4" />;
      default: return <Dumbbell className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading your smart library...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* AI Recommendations Card */}
      {recommendations?.nextWorkout && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              {recommendations.nextWorkout.reasoning}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{recommendations.nextWorkout.recommendation}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">
                    {recommendations.nextWorkout.duration} min
                  </Badge>
                  <Badge variant="secondary">
                    {recommendations.nextWorkout.difficulty}
                  </Badge>
                </div>
              </div>
              <Button size="sm">
                Generate This
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Bar */}
      {patterns?.insights && patterns.insights.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {patterns.insights.map((insight, index) => (
            <Badge
              key={index}
              variant={insight.type === 'positive' ? 'default' : 'secondary'}
              className="whitespace-nowrap"
            >
              <span className="mr-1">{insight.icon}</span>
              {insight.message}
            </Badge>
          ))}
        </div>
      )}

      {/* Search and Organize */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Smart search: 'leg day', '30 min cardio', 'beginner friendly'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && smartSearch()}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={organizeLibrary}
          disabled={organizing}
        >
          <Archive className="w-4 h-4 mr-2" />
          {organizing ? 'Organizing...' : 'Auto-Organize'}
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="hiit">HIIT</TabsTrigger>
          <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {filterWorkoutsByTab().map((workout) => (
            <Card key={workout.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {workout.metadata?.categories && getCategoryIcon(workout.metadata.categories.primary)}
                      {workout.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge className={getDifficultyColor(workout.difficulty)}>
                      {workout.difficulty}
                    </Badge>
                    {workout.metadata?.categories?.intensity && (
                      <Badge variant="outline" className="text-xs">
                        {workout.metadata.categories.intensity} intensity
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Flame className="w-4 h-4" />
                    <span>{workout.estimatedCalories} cal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{workout.analytics?.timesCompleted || 0}x</span>
                  </div>
                </div>

                {/* Category badges */}
                {workout.metadata?.categories && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {workout.metadata.categories.primary}
                    </Badge>
                    {workout.metadata.categories.equipment?.map((eq, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {eq}
                      </Badge>
                    ))}
                    {workout.metadata.categories.timeOfDay && (
                      <Badge variant="outline" className="text-xs">
                        Best for {workout.metadata.categories.timeOfDay}
                      </Badge>
                    )}
                  </div>
                )}

                {/* AI-generated indicator */}
                {workout.autoGenerated && (
                  <div className="flex items-center gap-2 text-xs text-primary mb-3">
                    <Sparkles className="w-3 h-3" />
                    AI personalized for you
                  </div>
                )}

                <Button 
                  className="w-full"
                  onClick={() => startWorkout(workout)}
                >
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          ))}

          {filterWorkoutsByTab().length === 0 && (
            <Card className="p-8 text-center">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {activeTab === 'archived' 
                  ? 'No archived workouts yet. Old unused workouts will appear here.'
                  : `No ${activeTab} workouts yet. Ask your AI trainer to create one!`}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Weekly Plan Preview */}
      {recommendations?.weeklyPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Weekly Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {recommendations.weeklyPlan.map((day, index) => (
                <div key={index} className="text-xs">
                  <p className="font-semibold">{day.day.slice(0, 3)}</p>
                  <div className={`mt-1 p-1 rounded ${
                    day.type === 'rest' ? 'bg-gray-100' : 'bg-primary/10'
                  }`}>
                    {day.type === 'rest' ? '😴' : '💪'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function
function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'beginner': return 'bg-green-500';
    case 'intermediate': return 'bg-yellow-500';
    case 'advanced': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function startWorkout(workout: any) {
  // Navigate to workout player
  window.location.href = `/workout/${workout.id}`;
}