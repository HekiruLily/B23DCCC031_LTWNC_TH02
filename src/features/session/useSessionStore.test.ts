import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
  { id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 67 },
  { id: 'e3', name: 'Gập tạ đơn 1', trainer: 'Đức Anh', group: 'Tay', duration: 104 },
];

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('has initial default state', () => {
    const state = useSessionStore.getState();
    expect(state.queue).toEqual([]);
    expect(state.currentIndex).toBe(-1);
    expect(state.isRunning).toBe(false);
    expect(state.elapsed).toBe(0);
  });

  it('starts session properly with given exercises and startIndex', () => {
    const { startSession } = useSessionStore.getState();
    startSession(mockExercises, 1);

    const state = useSessionStore.getState();
    expect(state.queue).toHaveLength(3);
    expect(state.currentIndex).toBe(1);
    expect(state.isRunning).toBe(true);
    expect(state.elapsed).toBe(0);
  });

  it('toggles isRunning with toggleRun', () => {
    const { startSession, toggleRun } = useSessionStore.getState();
    startSession(mockExercises, 0);
    expect(useSessionStore.getState().isRunning).toBe(true);

    toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(false);

    toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(true);
  });

  it('navigates next and stops at the last exercise', () => {
    const { startSession, next } = useSessionStore.getState();
    startSession(mockExercises, 0);

    useSessionStore.setState({ elapsed: 15 });
    next();
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().elapsed).toBe(0);
    expect(useSessionStore.getState().isRunning).toBe(true);

    next();
    expect(useSessionStore.getState().currentIndex).toBe(2);
    expect(useSessionStore.getState().isRunning).toBe(true);

    
    next();
    expect(useSessionStore.getState().isRunning).toBe(false);
  });

  it('resets elapsed to 0 if elapsed > 3 when calling prev()', () => {
    const { startSession, prev } = useSessionStore.getState();
    startSession(mockExercises, 1);

    useSessionStore.setState({ elapsed: 10 });
    prev();
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('moves to previous exercise if elapsed <= 3 when calling prev()', () => {
    const { startSession, prev } = useSessionStore.getState();
    startSession(mockExercises, 1);

    useSessionStore.setState({ elapsed: 2 });
    prev();
    expect(useSessionStore.getState().currentIndex).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('stays at first exercise and resets elapsed to 0 when calling prev() at index 0', () => {
    const { startSession, prev } = useSessionStore.getState();
    startSession(mockExercises, 0);

    useSessionStore.setState({ elapsed: 2 });
    prev();
    expect(useSessionStore.getState().currentIndex).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('adds exercise to end of queue and ignores duplicates', () => {
    const { addToSession } = useSessionStore.getState();
    addToSession(mockExercises[0]);
    expect(useSessionStore.getState().queue).toHaveLength(1);

    addToSession(mockExercises[1]);
    expect(useSessionStore.getState().queue).toHaveLength(2);

    
    addToSession(mockExercises[0]);
    expect(useSessionStore.getState().queue).toHaveLength(2);
  });

  it('ticks elapsed by 1 second and automatically calls next() upon reaching duration', () => {
    const { startSession, tick } = useSessionStore.getState();
    startSession(mockExercises, 0); 

    tick();
    expect(useSessionStore.getState().elapsed).toBe(1);

    useSessionStore.setState({ elapsed: 29 });
    tick(); 
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });
});

