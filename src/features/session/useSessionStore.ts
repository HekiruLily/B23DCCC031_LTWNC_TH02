import { create } from 'zustand';
import type { Exercise } from '../../types';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,

  startSession: (exercises, startIndex) => {
    if (exercises.length === 0) {
      set({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
      return;
    }
    const safeIndex = Math.max(0, Math.min(startIndex, exercises.length - 1));
    set({
      queue: exercises,
      currentIndex: safeIndex,
      isRunning: true,
      elapsed: 0,
    });
  },

  toggleRun: () => {
    const { currentIndex, queue, isRunning } = get();
    if (currentIndex === -1) {
      if (queue.length > 0) {
        set({ currentIndex: 0, isRunning: true, elapsed: 0 });
      }
      return;
    }
    set({ isRunning: !isRunning });
  },

  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex >= queue.length - 1) {
      set({ isRunning: false });
    } else {
      set({
        currentIndex: currentIndex + 1,
        elapsed: 0,
      });
    }
  },

  prev: () => {
    const { elapsed, currentIndex } = get();
    if (elapsed > 3) {
      set({ elapsed: 0 });
    } else if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        elapsed: 0,
      });
    } else {
      set({ elapsed: 0 });
    }
  },

  addToSession: (exercise) => {
    const { queue } = get();
    if (queue.some((item) => item.id === exercise.id)) {
      return;
    }
    set({ queue: [...queue, exercise] });
  },

  tick: () => {
    const { isRunning, queue, currentIndex, elapsed } = get();
    if (!isRunning || currentIndex < 0 || currentIndex >= queue.length) {
      return;
    }
    const currentExercise = queue[currentIndex];
    const nextElapsed = elapsed + 1;
    if (nextElapsed >= currentExercise.duration) {
      get().next();
    } else {
      set({ elapsed: nextElapsed });
    }
  },
}));


export const selectCurrentExercise = (state: SessionState): Exercise | null =>
  state.currentIndex >= 0 && state.currentIndex < state.queue.length
    ? state.queue[state.currentIndex]
    : null;

export const selectIsRunning = (state: SessionState): boolean => state.isRunning;
export const selectQueueLength = (state: SessionState): number => state.queue.length;
export const selectElapsed = (state: SessionState): number => state.elapsed;
export const selectCurrentIndex = (state: SessionState): number => state.currentIndex;

