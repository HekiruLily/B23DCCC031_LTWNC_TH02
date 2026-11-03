import { describe, it, expect } from 'vitest';
import { routineReducer } from './routineReducer';
import type { Routine } from './routineReducer';

describe('routineReducer', () => {
  const initialRoutines: Routine[] = [
    { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] },
  ];

  it('creates a new routine with unique ID and empty exerciseIds', () => {
    const action = { type: 'create' as const, payload: { id: 'r2', name: 'Ngày chân' } };
    const nextState = routineReducer(initialRoutines, action);

    expect(nextState).toHaveLength(2);
    expect(nextState[1]).toEqual({
      id: 'r2',
      name: 'Ngày chân',
      exerciseIds: [],
    });
    // Immutability
    expect(nextState).not.toBe(initialRoutines);
  });

  it('renames an existing routine', () => {
    const action = {
      type: 'rename' as const,
      payload: { id: 'r1', name: 'Ngày ngực nâng cao' },
    };
    const nextState = routineReducer(initialRoutines, action);

    expect(nextState[0].name).toBe('Ngày ngực nâng cao');
  });

  it('removes a routine by id', () => {
    const action = { type: 'remove' as const, payload: { id: 'r1' } };
    const nextState = routineReducer(initialRoutines, action);

    expect(nextState).toHaveLength(0);
  });

  it('adds an exercise to routine without duplicating', () => {
    const actionAddE2 = {
      type: 'addExercise' as const,
      payload: { routineId: 'r1', exerciseId: 'e2' },
    };
    const stateWithE2 = routineReducer(initialRoutines, actionAddE2);
    expect(stateWithE2[0].exerciseIds).toEqual(['e1', 'e2']);

    // Attempt to add e2 again
    const stateDuplicate = routineReducer(stateWithE2, actionAddE2);
    expect(stateDuplicate[0].exerciseIds).toEqual(['e1', 'e2']);
  });

  it('removes an exercise from a routine', () => {
    const stateWithTwo: Routine[] = [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
    ];
    const action = {
      type: 'removeExercise' as const,
      payload: { routineId: 'r1', exerciseId: 'e1' },
    };
    const nextState = routineReducer(stateWithTwo, action);

    expect(nextState[0].exerciseIds).toEqual(['e2']);
  });
});

