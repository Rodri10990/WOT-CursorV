import { Link, useRoute } from "wouter";

export default function TabBar() {
  const isActive = (path: string) => {
    const [match] = useRoute(path);
    return match;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">home</span>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          href="/workouts"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/workouts") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">fitness_center</span>
          <span className="text-xs mt-1">Workouts</span>
        </Link>
        
        <Link
          href="/ai-trainer"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/ai-trainer") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">smart_toy</span>
          <span className="text-xs mt-1">AI Trainer</span>
        </Link>
        
        <Link
          href="/nutrition"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/nutrition") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">restaurant</span>
          <span className="text-xs mt-1">Nutrition</span>
        </Link>
        
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/settings") ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="material-icons text-2xl">settings</span>
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
}