import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/lib/userStore";

export default function Dashboard() {
  const { name, weight, weightUnit, bodyFat } = useUserStore();
  
  // Extract first name for welcome message
  const firstName = name.split(' ')[0];
  
  return (
    <div className="p-4 pb-6">
      <div className="pt-2 pb-4">
        <h1 className="text-2xl font-bold">Welcome, {firstName}</h1>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardHeader className="pb-1 p-3">
            <CardTitle className="text-sm font-medium">Weekly Workouts</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">3/4</div>
              <Progress value={75} className="w-1/2 h-2" />
            </div>
            <p className="text-xs text-neutral-400 mt-1">Next: Leg Day</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-1 p-3">
            <CardTitle className="text-sm font-medium">Strength</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">+12%</div>
              <span className="material-icons text-primary">trending_up</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-1 p-3">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">7 days</div>
              <span className="material-icons text-accent">local_fire_department</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Best: 14 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-1 p-3">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">1,845</div>
              <span className="material-icons text-orange-500">restaurant</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Goal: 2,000</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Workout */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Today's Workout</h2>
        <Button variant="outline" size="sm" className="h-8 text-xs px-2">
          <span className="material-icons mr-1 text-sm">add</span>
          Add
        </Button>
      </div>
      
      <Card className="mb-5">
        <CardHeader className="p-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Upper Body Strength</CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <span className="material-icons mr-1 text-sm">play_arrow</span>
            Start
          </Button>
        </CardHeader>
        <CardContent className="p-3">
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span className="text-sm">Bench Press - 3×10</span>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span className="text-sm">Shoulder Press - 3×12</span>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span className="text-sm">Cable Rows - 3×15</span>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span className="text-sm">Bicep Curls - 3×12</span>
            </li>
          </ul>
          <div className="text-xs text-neutral-400 mt-3 flex items-center">
            <span className="material-icons text-neutral-400 mr-1 text-sm">schedule</span>
            45 minutes
          </div>
        </CardContent>
      </Card>
      
      {/* Progress Section */}
      <h2 className="text-lg font-semibold mb-3">Your Progress</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="p-3 bg-gradient-to-r from-blue-500 to-blue-600">
            <CardTitle className="text-sm font-medium text-white">Weight</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">{weight} {weightUnit}</div>
              <div className="flex items-center text-green-500">
                <span className="material-icons text-sm">arrow_downward</span>
                <span className="text-xs">2.5 {weightUnit}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-3 bg-gradient-to-r from-purple-500 to-purple-600">
            <CardTitle className="text-sm font-medium text-white">Body Fat</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">{bodyFat}%</div>
              <div className="flex items-center text-green-500">
                <span className="material-icons text-sm">arrow_downward</span>
                <span className="text-xs">1.2%</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-neutral-100">
            <li className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Completed Lower Body</p>
                <p className="text-xs text-neutral-400">Yesterday</p>
              </div>
              <span className="material-icons text-primary text-xl">done</span>
            </li>
            <li className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">New PR: Deadlift</p>
                <p className="text-xs text-neutral-400">2 days ago</p>
              </div>
              <span className="material-icons text-accent text-xl">emoji_events</span>
            </li>
            <li className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Added Workout Plan</p>
                <p className="text-xs text-neutral-400">3 days ago</p>
              </div>
              <span className="material-icons text-primary text-xl">add_circle</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}