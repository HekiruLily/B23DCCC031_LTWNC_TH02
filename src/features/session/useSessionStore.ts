import { create } from 'zustand';
import type { Exercise } from '../../types';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  isResting: boolean;
  restDuration: number;
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
  isResting: false,
  restDuration: 10, 

  startSession: (exercises, startIndex) => {
    if (exercises.length === 0) {
      set({
        queue: [],
        currentIndex: -1,
        isRunning: false,
        elapsed: 0,
        isResting: false,
      });
      return;
    }
    const safeIndex = Math.max(0, Math.min(startIndex, exercises.length - 1));
    set({
      queue: exercises,
      currentIndex: safeIndex,
      isRunning: true,
      elapsed: 0,
      isResting: false,
    });
  },

  toggleRun: () => {
    const { currentIndex, queue, isRunning } = get();
    if (currentIndex === -1) {
      if (queue.length > 0) {
        set({ currentIndex: 0, isRunning: true, elapsed: 0, isResting: false });
      }
      return;
    }
    set({ isRunning: !isRunning });
  },

  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex >= queue.length - 1) {
      set({ isRunning: false, isResting: false });
    } else {
      set({
        currentIndex: currentIndex + 1,
        elapsed: 0,
        isResting: false,
      });
    }
  },

  prev: () => {
    const { elapsed, currentIndex, isResting } = get();
    if (isResting) {
      set({ isResting: false, elapsed: 0 });
      return;
    }

    if (elapsed > 3) {
      set({ elapsed: 0 });
    } else if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        elapsed: 0,
        isResting: false,
      });
    } else {
      set({ elapsed: 0, isResting: false });
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
    const { isRunning, queue, currentIndex, elapsed, isResting, restDuration } = get();
    if (!isRunning || currentIndex < 0 || currentIndex >= queue.length) {
      return;
    }

    if (isResting) {
      const nextRestElapsed = elapsed + 1;
      if (nextRestElapsed >= restDuration) {
        if (currentIndex < queue.length - 1) {
          set({
            isResting: false,
            currentIndex: currentIndex + 1,
            elapsed: 0,
          });
        } else {
          set({ isResting: false, isRunning: false, elapsed: 0 });
        }
      } else {
        set({ elapsed: nextRestElapsed });
      }
      return;
    }

    const currentExercise = queue[currentIndex];
    const nextElapsed = elapsed + 1;
    if (nextElapsed >= currentExercise.duration) {
      if (currentIndex < queue.length - 1) {
        set({ isResting: true, elapsed: 0 });
      } else {
        get().next();
      }
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
export const selectIsResting = (state: SessionState): boolean => state.isResting;
export const selectRestDuration = (state: SessionState): number => state.restDuration;
