import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  RoutineProvider,
  useRoutines,
  useRoutineDispatch,
} from './RoutineContext';

describe('RoutineContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('throws an error if useRoutines is used outside RoutineProvider', () => {
    expect(() => renderHook(() => useRoutines())).toThrow(
      'useRoutines must be used within a RoutineProvider'
    );
  });

  it('throws an error if useRoutineDispatch is used outside RoutineProvider', () => {
    expect(() => renderHook(() => useRoutineDispatch())).toThrow(
      'useRoutineDispatch must be used within a RoutineProvider'
    );
  });

  it('initializes from localStorage and saves changes to localStorage', () => {
    const saved = [{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }];
    localStorage.setItem('workout-routines', JSON.stringify(saved));

    const { result } = renderHook(
      () => ({
        routines: useRoutines(),
        dispatch: useRoutineDispatch(),
      }),
      { wrapper: RoutineProvider }
    );

    expect(result.current.routines).toHaveLength(1);
    expect(result.current.routines[0].name).toBe('Ngày ngực');

    act(() => {
      result.current.dispatch({
        type: 'create',
        payload: { id: 'r2', name: 'Ngày chân' },
      });
    });

    expect(result.current.routines).toHaveLength(2);
    const updatedStorage = JSON.parse(
      localStorage.getItem('workout-routines')!
    );
    expect(updatedStorage).toHaveLength(2);
    expect(updatedStorage[1].name).toBe('Ngày chân');
  });
});

