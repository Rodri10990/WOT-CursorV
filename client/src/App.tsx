import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AITrainer from "@/pages/ai-trainer";
import Dashboard from "@/pages/dashboard";
import Workouts from "@/pages/workouts";
import Progress from "@/pages/progress";
import Nutrition from "@/pages/nutrition";
import Settings from "@/pages/settings";
import TabBar from "@/components/layout/tab-bar";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={Dashboard} />
      <Route path="/ai-trainer" component={AITrainer} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/progress" component={Progress} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/settings" component={Settings} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col h-screen bg-neutral-100">
          <main className="flex-1 flex flex-col overflow-y-auto pb-16">
            <Router />
          </main>
          <TabBar />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
