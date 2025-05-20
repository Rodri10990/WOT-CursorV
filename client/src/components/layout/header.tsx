import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-primary text-white py-3 px-4 shadow-md z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            className="md:hidden text-white p-0 h-8 w-8" 
            onClick={onMenuClick}
          >
            <span className="material-icons">menu</span>
          </Button>
          <h1 className="text-lg font-heading font-bold">WorkoutTracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="relative p-0 h-8 w-8 text-white">
            <span className="material-icons">notifications</span>
            <Badge className="absolute -top-1 -right-1 bg-secondary text-white text-xs h-4 w-4 flex items-center justify-center p-0">
              3
            </Badge>
          </Button>
          <div className="h-8 w-8 rounded-full bg-primary-dark flex items-center justify-center">
            <span className="text-sm text-white font-medium">JS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
