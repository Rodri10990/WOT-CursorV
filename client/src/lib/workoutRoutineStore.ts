import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  weight?: number;
  notes?: string;
  rest?: number;
}

export interface RoutineDay {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  duration: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  days: RoutineDay[];
  createdAt: string;
  updatedAt: string;
  lastPerformedDay?: string;
  lastPerformedDate?: string;
  favorite?: boolean;
}

interface RoutineState {
  routines: Routine[];
  selectedRoutine: Routine | null;
  selectedDay: RoutineDay | null;
  setSelectedRoutine: (routineId: string | null) => void;
  setSelectedDay: (dayId: string | null) => void;
  toggleFavorite: (routineId: string) => void;
}

// Create the Trial 1 routine with 3 days
const initialRoutines: Routine[] = [
  {
    id: 'trial1',
    name: 'Trial 1',
    description: '3-day split routine for beginners',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    days: [
      {
        id: 'day1',
        name: 'Day 1 - Push Day',
        description: 'Chest, shoulders and triceps',
        duration: 60,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8, rest: 90 },
          { name: 'Incline Dumbbell Press', sets: 3, reps: 10, rest: 60 },
          { name: 'Shoulder Press', sets: 3, reps: 10, rest: 60 },
          { name: 'Lateral Raises', sets: 3, reps: 12, rest: 45 },
          { name: 'Tricep Pushdowns', sets: 3, reps: 12, rest: 45 },
          { name: 'Overhead Tricep Extensions', sets: 3, reps: 12, rest: 45 }
        ]
      },
      {
        id: 'day2',
        name: 'Day 2 - Pull Day',
        description: 'Back and biceps',
        duration: 60,
        exercises: [
          { name: 'Pull-ups', sets: 4, reps: 8, rest: 90 },
          { name: 'Bent Over Rows', sets: 3, reps: 10, rest: 60 },
          { name: 'Lat Pulldowns', sets: 3, reps: 10, rest: 60 },
          { name: 'Face Pulls', sets: 3, reps: 15, rest: 45 },
          { name: 'Bicep Curls', sets: 3, reps: 12, rest: 45 },
          { name: 'Hammer Curls', sets: 3, reps: 12, rest: 45 }
        ]
      },
      {
        id: 'day3',
        name: 'Day 3 - Leg Day',
        description: 'Legs and core',
        duration: 60,
        exercises: [
          { name: 'Squats', sets: 4, reps: 8, rest: 90 },
          { name: 'Deadlifts', sets: 3, reps: 10, rest: 90 },
          { name: 'Lunges', sets: 3, reps: 10, rest: 60 },
          { name: 'Leg Press', sets: 3, reps: 12, rest: 60 },
          { name: 'Planks', sets: 3, duration: 60, rest: 45 },
          { name: 'Russian Twists', sets: 3, reps: 20, rest: 45 }
        ]
      }
    ]
  }
];

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      routines: initialRoutines,
      selectedRoutine: null,
      selectedDay: null,
      
      setSelectedRoutine: (routineId) => {
        set((state) => {
          if (!routineId) {
            return { selectedRoutine: null, selectedDay: null };
          }
          
          const routine = state.routines.find(r => r.id === routineId) || null;
          return { selectedRoutine: routine, selectedDay: null };
        });
      },
      
      setSelectedDay: (dayId) => {
        set((state) => {
          if (!dayId || !state.selectedRoutine) {
            return { selectedDay: null };
          }
          
          const day = state.selectedRoutine.days.find(d => d.id === dayId) || null;
          return { selectedDay: day };
        });
      },
      
      toggleFavorite: (routineId) => {
        set((state) => ({
          routines: state.routines.map(routine => 
            routine.id === routineId 
              ? { ...routine, favorite: !routine.favorite, updatedAt: new Date().toISOString() } 
              : routine
          ),
          selectedRoutine: state.selectedRoutine?.id === routineId
            ? { ...state.selectedRoutine, favorite: !state.selectedRoutine.favorite }
            : state.selectedRoutine
        }));
      }
    }),
    {
      name: 'routine-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);