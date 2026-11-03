import {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import type { ReactNode, Dispatch } from 'react';
import { routineReducer } from './routineReducer';
import type { Routine, RoutineAction } from './routineReducer';
import { withLogger } from './withLogger';

export const RoutineStateContext = createContext<Routine[] | undefined>(
  undefined
);
export const RoutineDispatchContext = createContext<
  Dispatch<RoutineAction> | undefined
>(undefined);

const STORAGE_KEY = 'workout-routines';

function getInitialRoutines(): Routine[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Routine[];
    }
  } catch (error) {
    console.error('Failed to parse routines from localStorage:', error);
  }
  return [];
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [routines, dispatch] = useReducer(
    withLogger(routineReducer),
    undefined,
    getInitialRoutines
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
    } catch (error) {
      console.error('Failed to save routines to localStorage:', error);
    }
  }, [routines]);

  return (
    <RoutineStateContext.Provider value={routines}>
      <RoutineDispatchContext.Provider value={dispatch}>
        {children}
      </RoutineDispatchContext.Provider>
    </RoutineStateContext.Provider>
  );
}

export function useRoutines(): Routine[] {
  const context = useContext(RoutineStateContext);
  if (context === undefined) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
}

export function useRoutineDispatch(): Dispatch<RoutineAction> {
  const context = useContext(RoutineDispatchContext);
  if (context === undefined) {
    throw new Error('useRoutineDispatch must be used within a RoutineProvider');
  }
  return context;
}

