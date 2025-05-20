import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-heading font-bold mb-6">Welcome, Jamie</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Weekly Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3/4</div>
              <Progress value={75} className="w-2/3 h-2" />
            </div>
            <p className="text-xs text-neutral-300 mt-1">Next: Leg Day (Tomorrow)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Strength Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">+12%</div>
              <span className="material-icons text-primary">trending_up</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">7 days</div>
              <span className="material-icons text-accent">local_fire_department</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">Personal best: 14 days</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Workout */}
      <h2 className="text-xl font-heading font-semibold mb-4">Today's Workout</h2>
      <Card className="mb-6">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Upper Body Strength</CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <span className="material-icons mr-1 text-sm">play_arrow</span>
            Start
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span>Bench Press - 3x10</span>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span>Shoulder Press - 3x12</span>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span>Cable Rows - 3x15</span>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-primary mr-2 text-sm">fitness_center</span>
              <span>Bicep Curls - 3x12</span>
            </li>
          </ul>
          <div className="text-xs text-neutral-300 mt-4">Duration: ~45 minutes</div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <h2 className="text-xl font-heading font-semibold mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-neutral-100">
            <li className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Completed Lower Body Workout</p>
                <p className="text-xs text-neutral-300">Yesterday</p>
              </div>
              <span className="material-icons text-primary">done</span>
            </li>
            <li className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">New Personal Record: Deadlift</p>
                <p className="text-xs text-neutral-300">2 days ago</p>
              </div>
              <span className="material-icons text-accent">emoji_events</span>
            </li>
            <li className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Added New Workout Plan</p>
                <p className="text-xs text-neutral-300">3 days ago</p>
              </div>
              <span className="material-icons text-primary">add_circle</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}