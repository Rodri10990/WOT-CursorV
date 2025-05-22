import { useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRoutineStore } from "@/lib/workoutRoutineStore";

export default function DayDetail() {
  const [, params] = useRoute("/routine/:routineId/day/:dayId");
  const [, setLocation] = useLocation();
  const { routines, selectedRoutine, setSelectedRoutine, selectedDay, setSelectedDay } = useRoutineStore();
  
  useEffect(() => {
    if (params?.routineId) {
      setSelectedRoutine(params.routineId);
      if (params?.dayId) {
        setSelectedDay(params.dayId);
      }
    }
    
    return () => {
      // Clean up on unmount
      setSelectedRoutine(null);
      setSelectedDay(null);
    };
  }, [params?.routineId, params?.dayId, setSelectedRoutine, setSelectedDay]);
  
  if (!selectedRoutine || !selectedDay) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-neutral-500 mb-4">Workout day not found</p>
        <Button onClick={() => setLocation("/workouts")}>
          Back to Workouts
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 -ml-3" 
          onClick={() => setLocation(`/routine/${selectedRoutine.id}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back
        </Button>
        <h1 className="text-xl font-bold">{selectedDay.name}</h1>
      </div>
      
      <p className="text-sm text-neutral-500 mb-4">
        {selectedDay.description}
      </p>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 mr-1">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="text-neutral-500">{selectedDay.duration} minutes</span>
        </div>
        
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          size="sm"
          onClick={() => {
            // Start the workout session
            const startTime = new Date().toLocaleTimeString();
            alert(`🏋️ Workout Started at ${startTime}!\n\nYour ${selectedDay.name} workout is now active.\nEstimated duration: ${selectedDay.duration} minutes\n\nGood luck and stay focused!`);
          }}
        >
          Start Workout
        </Button>
      </div>
      
      <h2 className="text-lg font-semibold mb-3">Exercises</h2>
      
      <div className="space-y-3">
        {selectedDay.exercises.map((exercise, index) => (
          <Card key={index} className="bg-white dark:bg-neutral-800">
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium">{exercise.name}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 text-xs">
                {exercise.sets && exercise.reps && (
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded py-1 px-2">
                    {exercise.sets} × {exercise.reps}
                  </div>
                )}
                
                {exercise.duration && (
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded py-1 px-2">
                    {exercise.duration} sec
                  </div>
                )}
                
                {exercise.rest && (
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded py-1 px-2">
                    Rest: {exercise.rest} sec
                  </div>
                )}
              </div>
              
              {exercise.notes && (
                <p className="text-xs text-neutral-500 mt-2 italic">
                  {exercise.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}