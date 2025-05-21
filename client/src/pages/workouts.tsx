import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkoutStore, type Workout, type Exercise } from "@/lib/workoutStore";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Workouts() {
  const { workouts, history, toggleFavorite } = useWorkoutStore();
  const [filter, setFilter] = useState<string>('all');
  
  // Filter workouts for my-workouts tab
  const myWorkouts = workouts.filter(workout => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return workout.favorite;
    return workout.category === filter;
  });
  
  // Filter for suggested workouts tab
  const suggestedWorkouts = workouts.filter(workout => 
    workout.level === 'beginner' || 
    workout.category === 'full-body' || 
    workout.title.includes('30-Min')
  );
  
  const handleFavoriteToggle = (id: string) => {
    toggleFavorite(id);
  };
  
  return (
    <div className="p-4 pb-20">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <Button className="bg-primary text-sm">
          <span className="material-icons mr-1 text-sm">add</span>
          Create
        </Button>
      </div>
      
      <Tabs defaultValue="my-workouts">
        <TabsList className="mb-4 w-full overflow-x-auto hide-scrollbar">
          <TabsTrigger value="my-workouts">My Workouts</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-workouts">
          <div className="mb-4 pb-2 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2">
              <Badge 
                onClick={() => setFilter('all')}
                className={`cursor-pointer ${filter === 'all' ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300'}`}
              >
                All
              </Badge>
              <Badge 
                onClick={() => setFilter('favorites')}
                className={`cursor-pointer ${filter === 'favorites' ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300'}`}
              >
                Favorites
              </Badge>
              <Badge 
                onClick={() => setFilter('strength')}
                className={`cursor-pointer ${filter === 'strength' ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300'}`}
              >
                Strength
              </Badge>
              <Badge 
                onClick={() => setFilter('cardio')}
                className={`cursor-pointer ${filter === 'cardio' ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300'}`}
              >
                Cardio
              </Badge>
              <Badge 
                onClick={() => setFilter('hiit')}
                className={`cursor-pointer ${filter === 'hiit' ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300'}`}
              >
                HIIT
              </Badge>
              <Badge 
                onClick={() => setFilter('flexibility')}
                className={`cursor-pointer ${filter === 'flexibility' ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300'}`}
              >
                Mobility
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myWorkouts.map(workout => (
              <EnhancedWorkoutCard 
                key={workout.id}
                workout={workout}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="suggested">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedWorkouts.map(workout => (
              <EnhancedWorkoutCard 
                key={workout.id}
                workout={workout}
                onFavoriteToggle={handleFavoriteToggle}
                tag={workout.level === 'beginner' ? 'Beginner Friendly' : 'Recommended'}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="space-y-3">
            {history.map(entry => (
              <WorkoutHistoryItem 
                key={entry.id}
                title={entry.title}
                date={entry.date}
                duration={entry.duration}
                completed={entry.completed}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkoutCard({ title, exercises, duration, lastPerformed, tag }: { 
  title: string;
  exercises: string[];
  duration: number;
  lastPerformed?: string;
  tag?: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-medium">{title}</CardTitle>
          {tag && (
            <span className="text-xs bg-primary-light text-white px-2 py-1 rounded-full">
              {tag}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 mb-3">
          {exercises.map((exercise, index) => (
            <li key={index} className="flex items-center text-sm">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span>{exercise}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <div className="text-xs text-neutral-300">
            {duration} minutes
          </div>
          {lastPerformed && (
            <div className="text-xs text-neutral-300">
              Last: {lastPerformed}
            </div>
          )}
        </div>
        <div className="flex space-x-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <span className="material-icons mr-1 text-sm">edit</span>
            Edit
          </Button>
          <Button className="flex-1 bg-primary">
            <span className="material-icons mr-1 text-sm">play_arrow</span>
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EnhancedWorkoutCard({ workout, onFavoriteToggle, tag }: { 
  workout: Workout;
  onFavoriteToggle: (id: string) => void;
  tag?: string;
}) {
  // Extract display values
  const exerciseNames = workout.exercises.map(ex => ex.name);
  
  // Format equipment list for display
  const equipmentText = workout.equipment && workout.equipment.length > 0 
    ? workout.equipment.join(', ')
    : 'No equipment';

  return (
    <Card className="h-full bg-white dark:bg-neutral-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-md font-medium">{workout.title}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 p-0" 
                onClick={() => onFavoriteToggle(workout.id)}
              >
                <span className="material-icons text-lg text-yellow-500">
                  {workout.favorite ? 'star' : 'star_border'}
                </span>
              </Button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">{workout.description}</p>
          </div>
          
          {tag && (
            <Badge className="ml-2 bg-primary text-white">
              {tag}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs bg-neutral-100 dark:bg-neutral-700">
            {workout.level}
          </Badge>
          <Badge variant="outline" className="text-xs bg-neutral-100 dark:bg-neutral-700">
            {workout.category}
          </Badge>
        </div>
        
        <ul className="space-y-1 mb-3">
          {exerciseNames.slice(0, 4).map((exercise, index) => (
            <li key={index} className="flex items-center text-sm">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span>{exercise}</span>
            </li>
          ))}
          {workout.exercises.length > 4 && (
            <li className="text-xs text-neutral-500">
              +{workout.exercises.length - 4} more exercises
            </li>
          )}
        </ul>
        
        <div className="flex items-center text-xs text-neutral-500 mb-3">
          <div className="mr-2">
            <span className="material-icons text-neutral-400 mr-1 text-sm align-text-bottom">schedule</span>
            {workout.duration} min
          </div>
          <div className="mr-2">
            <span className="material-icons text-neutral-400 mr-1 text-sm align-text-bottom">fitness_center</span>
            {equipmentText}
          </div>
        </div>
        
        {workout.lastPerformed && (
          <div className="text-xs text-neutral-500 mb-3">
            Last performed: {workout.lastPerformed}
          </div>
        )}
        
        <div className="flex space-x-2 mt-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs py-1">
            <span className="material-icons mr-1 text-sm">visibility</span>
            Details
          </Button>
          <Button className="flex-1 bg-primary text-xs py-1">
            <span className="material-icons mr-1 text-sm">play_arrow</span>
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkoutHistoryItem({ title, date, duration, completed }: {
  title: string;
  date: string;
  duration: number;
  completed: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <span className={`material-icons mr-3 ${completed ? 'text-primary' : 'text-neutral-300'}`}>
            {completed ? 'check_circle' : 'cancel'}
          </span>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-neutral-300">{date} • {duration} minutes</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <span className="material-icons text-sm">visibility</span>
        </Button>
      </CardContent>
    </Card>
  );
}