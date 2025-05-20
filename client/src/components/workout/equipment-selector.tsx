import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface EquipmentSelectorProps {
  onEquipmentChange: (selectedEquipment: string[]) => void;
}

const AVAILABLE_EQUIPMENT = [
  { id: "none", label: "No Equipment (Bodyweight)", icon: "fitness_center" },
  { id: "dumbbells", label: "Dumbbells", icon: "fitness_center" },
  { id: "kettlebell", label: "Kettlebell", icon: "fitness_center" },
  { id: "resistance bands", label: "Resistance Bands", icon: "extension" },
  { id: "barbell", label: "Barbell", icon: "fitness_center" },
  { id: "bench", label: "Bench", icon: "weekend" },
  { id: "pull-up bar", label: "Pull-up Bar", icon: "horizontal_rule" },
  { id: "yoga mat", label: "Yoga Mat", icon: "drag_handle" },
];

export default function EquipmentSelector({ onEquipmentChange }: EquipmentSelectorProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(["none"]);
  
  const toggleEquipment = (equipmentId: string) => {
    let newSelection: string[];
    
    if (equipmentId === "none") {
      // If "No Equipment" is selected, clear all other selections
      newSelection = selectedEquipment.includes("none") 
        ? [] // If "none" was already selected, unselect it
        : ["none"]; // Otherwise, select only "none"
    } else {
      // If any other equipment is selected, remove "none" from the selection
      if (selectedEquipment.includes(equipmentId)) {
        // If already selected, remove it
        newSelection = selectedEquipment.filter(item => item !== equipmentId);
      } else {
        // If not selected, add it and remove "none" if present
        newSelection = [...selectedEquipment.filter(item => item !== "none"), equipmentId];
      }
    }
    
    // If nothing is selected, default to "none"
    if (newSelection.length === 0) {
      newSelection = ["none"];
    }
    
    setSelectedEquipment(newSelection);
    onEquipmentChange(newSelection);
  };
  
  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 bg-white dark:bg-neutral-800 mb-3">
      <h3 className="text-sm font-medium mb-1">Available Equipment</h3>
      <ScrollArea className="h-20">
        <div className="flex flex-wrap gap-2 pb-1">
          {AVAILABLE_EQUIPMENT.map((equipment) => (
            <Badge
              key={equipment.id}
              variant={selectedEquipment.includes(equipment.id) ? "default" : "outline"}
              className={`cursor-pointer flex items-center gap-1 py-1 px-2 ${
                selectedEquipment.includes(equipment.id) 
                  ? "bg-primary hover:bg-primary/90" 
                  : "bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              }`}
              onClick={() => toggleEquipment(equipment.id)}
            >
              <span className="material-icons text-xs">{equipment.icon}</span>
              <span className="text-xs">{equipment.label}</span>
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}