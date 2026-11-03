export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}

export type RoutineAction =
  | { type: 'create'; payload: { id?: string; name: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'addExercise'; payload: { routineId: string; exerciseId: string } }
  | { type: 'removeExercise'; payload: { routineId: string; exerciseId: string } };

export function routineReducer(
  state: Routine[],
  action: RoutineAction
): Routine[] {
  switch (action.type) {
    case 'create': {
      const trimmedName = action.payload.name.trim();
      const newRoutine: Routine = {
        id:
          action.payload.id ??
          `r-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: trimmedName,
        exerciseIds: [],
      };
      return [...state, newRoutine];
    }

    case 'rename': {
      const trimmedName = action.payload.name.trim();
      return state.map((routine) =>
        routine.id === action.payload.id
          ? { ...routine, name: trimmedName }
          : routine
      );
    }

    case 'remove': {
      return state.filter((routine) => routine.id !== action.payload.id);
    }

    case 'addExercise': {
      const { routineId, exerciseId } = action.payload;
      return state.map((routine) => {
        if (routine.id !== routineId) {
          return routine;
        }
        if (routine.exerciseIds.includes(exerciseId)) {
          return routine; 
        }
        return {
          ...routine,
          exerciseIds: [...routine.exerciseIds, exerciseId],
        };
      });
    }

    case 'removeExercise': {
      const { routineId, exerciseId } = action.payload;
      return state.map((routine) => {
        if (routine.id !== routineId) {
          return routine;
        }
        return {
          ...routine,
          exerciseIds: routine.exerciseIds.filter((id) => id !== exerciseId),
        };
      });
    }

    default:
      return state;
  }
}

