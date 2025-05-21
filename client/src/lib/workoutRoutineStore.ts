import { create } from 'zustand';

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

export const useRoutineStore = create<RoutineState>()((set, get) => ({
  routines: [
    {
      id: '1',
      name: 'Trial 1',
      description: 'A 3-day full body workout routine for beginners',
      days: [
        {
          id: 'day1',
          name: 'Day 1 - Push Day',
          description: 'Chest, shoulders, and triceps',
          exercises: [
            {
              name: 'Bench Press',
              sets: 3,
              reps: 10,
              rest: 90,
              notes: 'Keep elbows at a 45-degree angle'
            },
            {
              name: 'Push-ups',
              sets: 3,
              reps: 12,
              rest: 60
            },
            {
              name: 'Overhead Press',
              sets: 3,
              reps: 10,
              rest: 90
            },
            {
              name: 'Tricep Dips',
              sets: 3,
              reps: 12,
              rest: 60
            },
            {
              name: 'Lateral Raises',
              sets: 3,
              reps: 15,
              rest: 60
            }
          ],
          duration: 55
        },
        {
          id: 'day2',
          name: 'Day 2 - Pull Day',
          description: 'Back and biceps',
          exercises: [
            {
              name: 'Pull-ups',
              sets: 3,
              reps: 8,
              rest: 90,
              notes: 'Use assistance if needed'
            },
            {
              name: 'Bent-over Rows',
              sets: 3,
              reps: 10,
              rest: 90
            },
            {
              name: 'Lat Pulldowns',
              sets: 3,
              reps: 12,
              rest: 60
            },
            {
              name: 'Bicep Curls',
              sets: 3,
              reps: 12,
              rest: 60
            },
            {
              name: 'Face Pulls',
              sets: 3,
              reps: 15,
              rest: 60
            }
          ],
          duration: 58
        },
        {
          id: 'day3',
          name: 'Day 3 - Leg Day',
          description: 'Legs and core',
          exercises: [
            {
              name: 'Squats',
              sets: 3,
              reps: 10,
              rest: 120,
              notes: 'Keep weight in heels'
            },
            {
              name: 'Deadlifts',
              sets: 3,
              reps: 8,
              rest: 120,
              notes: 'Maintain neutral spine'
            },
            {
              name: 'Lunges',
              sets: 3,
              reps: 12,
              rest: 60
            },
            {
              name: 'Leg Press',
              sets: 3,
              reps: 12,
              rest: 90
            },
            {
              name: 'Planks',
              sets: 3,
              duration: 30,
              rest: 45
            },
            {
              name: 'Russian Twists',
              sets: 3,
              reps: 20,
              rest: 45
            }
          ],
          duration: 65
        }
      ],
      createdAt: '2023-05-15T10:00:00Z',
      updatedAt: '2023-05-15T10:00:00Z',
      lastPerformedDay: 'Day 2 - Pull Day',
      lastPerformedDate: 'yesterday',
      favorite: true
    }
  ],
  selectedRoutine: null,
  selectedDay: null,

  setSelectedRoutine: (routineId) => {
    const { routines } = get();
    if (!routineId) {
      set({ selectedRoutine: null, selectedDay: null });
      return;
    }
    
    const routine = routines.find(r => r.id === routineId) || null;
    set({ selectedRoutine: routine, selectedDay: null });
  },

  setSelectedDay: (dayId) => {
    const { selectedRoutine } = get();
    if (!dayId || !selectedRoutine) {
      set({ selectedDay: null });
      return;
    }
    
    const day = selectedRoutine.days.find(d => d.id === dayId) || null;
    set({ selectedDay: day });
  },

  toggleFavorite: (routineId) => {
    set(state => ({
      routines: state.routines.map(routine => 
        routine.id === routineId 
          ? { ...routine, favorite: !routine.favorite } 
          : routine
      )
    }));
  }
}));