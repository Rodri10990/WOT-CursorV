import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Workouts() {
  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Workouts</h1>
        <Button className="bg-primary">
          <span className="material-icons mr-2">add</span>
          Create Workout
        </Button>
      </div>
      
      <Tabs defaultValue="my-workouts">
        <TabsList className="mb-4">
          <TabsTrigger value="my-workouts">My Workouts</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-workouts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WorkoutCard 
              title="Upper Body Strength" 
              exercises={["Bench Press", "Shoulder Press", "Cable Rows", "Bicep Curls"]} 
              duration={45} 
              lastPerformed="2 days ago"
            />
            <WorkoutCard 
              title="Lower Body Day" 
              exercises={["Squats", "Deadlifts", "Lunges", "Calf Raises"]} 
              duration={50} 
              lastPerformed="yesterday"
            />
            <WorkoutCard 
              title="Core Conditioning" 
              exercises={["Planks", "Russian Twists", "Bicycle Crunches", "Leg Raises"]} 
              duration={30} 
              lastPerformed="5 days ago"
            />
            <WorkoutCard 
              title="HIIT Session" 
              exercises={["Burpees", "Mountain Climbers", "Jump Squats", "High Knees"]} 
              duration={25} 
              lastPerformed="1 week ago"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="suggested">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WorkoutCard 
              title="30-Min Full Body" 
              exercises={["Goblet Squats", "Push-ups", "Dumbbell Rows", "Lunges"]} 
              duration={30} 
              tag="AI Recommended"
            />
            <WorkoutCard 
              title="Mobility Focus" 
              exercises={["Dynamic Stretches", "Hip Openers", "Shoulder Mobility", "Ankle Mobility"]} 
              duration={35} 
              tag="Recovery"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="space-y-4">
            <WorkoutHistoryItem 
              title="Lower Body Day" 
              date="Yesterday" 
              duration={48} 
              completed={true}
            />
            <WorkoutHistoryItem 
              title="Upper Body Strength" 
              date="2 days ago" 
              duration={42} 
              completed={true}
            />
            <WorkoutHistoryItem 
              title="HIIT Session" 
              date="4 days ago" 
              duration={25} 
              completed={false}
            />
            <WorkoutHistoryItem 
              title="Core Conditioning" 
              date="5 days ago" 
              duration={32} 
              completed={true}
            />
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