import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function WorkoutPlanCard() {
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  
  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        "/api/workouts",
        {
          name: "30-Minute Strength Routine",
          description: "Balanced routine for strength training",
          exercises: [
            { name: "Goblet Squats", sets: 3, reps: 12 },
            { name: "Push-ups", sets: 3, reps: 15 },
            { name: "Dumbbell Rows", sets: 3, reps: 12 },
            { name: "Lunges", sets: 2, reps: 10 },
            { name: "Plank", sets: 3, duration: 30 }
          ]
        }
      );
      return response.json();
    },
    onSuccess: () => {
      setSaved(true);
      toast({
        title: "Workout Saved",
        description: "Your workout has been saved to your profile",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save workout",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden mt-2 mb-2">
      <CardHeader className="bg-primary-dark text-white p-3">
        <CardTitle className="font-heading font-medium">30-Minute Strength Routine</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 mt-0.5">fitness_center</span>
            <div>
              <p className="font-medium">Goblet Squats</p>
              <p className="text-sm text-neutral-300">3 sets of 12 reps</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 mt-0.5">fitness_center</span>
            <div>
              <p className="font-medium">Push-ups</p>
              <p className="text-sm text-neutral-300">3 sets of 10-15 reps</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 mt-0.5">fitness_center</span>
            <div>
              <p className="font-medium">Dumbbell Rows</p>
              <p className="text-sm text-neutral-300">3 sets of 12 reps each arm</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 mt-0.5">fitness_center</span>
            <div>
              <p className="font-medium">Lunges</p>
              <p className="text-sm text-neutral-300">2 sets of 10 reps each leg</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 mt-0.5">fitness_center</span>
            <div>
              <p className="font-medium">Plank</p>
              <p className="text-sm text-neutral-300">3 sets of 30 seconds</p>
            </div>
          </li>
        </ul>
        <div className="flex justify-between mt-4">
          <Button 
            variant="ghost" 
            className="text-primary flex items-center text-sm"
            onClick={() => saveWorkoutMutation.mutate()}
            disabled={saved || saveWorkoutMutation.isPending}
          >
            <span className="material-icons text-sm mr-1">
              {saved ? "check" : "save"}
            </span>
            {saved ? "Saved" : "Save Workout"}
          </Button>
          <Button 
            variant="ghost"
            className="text-primary flex items-center text-sm"
          >
            <span className="material-icons text-sm mr-1">edit</span>
            Modify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
