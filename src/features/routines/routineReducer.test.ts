import { describe, it, expect } from 'vitest';
import { routineReducer } from './routineReducer';
import type { Routine } from './routineReducer';

describe('routineReducer quản lý giáo án', () => {
  const initialRoutines: Routine[] = [
    { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] },
  ];

  it('tạo giáo án mới với id duy nhất và danh sách bài tập rỗng', () => {
    const action = {
      type: 'create' as const,
      payload: { id: 'r2', name: 'Ngày chân' },
    };
    const nextState = routineReducer(initialRoutines, action);

    expect(nextState).toHaveLength(2);
    expect(nextState[1]).toEqual({
      id: 'r2',
      name: 'Ngày chân',
      exerciseIds: [],
    });
  });

  it('addExercise thêm bài tập vào giáo án và không thêm trùng bài', () => {
    const actionAddE2 = {
      type: 'addExercise' as const,
      payload: { routineId: 'r1', exerciseId: 'e2' },
    };
    const stateWithE2 = routineReducer(initialRoutines, actionAddE2);
    expect(stateWithE2[0].exerciseIds).toEqual(['e1', 'e2']);

    const stateDuplicate = routineReducer(stateWithE2, actionAddE2);
    expect(stateDuplicate[0].exerciseIds).toEqual(['e1', 'e2']);
  });

  it('removeExercise xóa bài tập khỏi giáo án', () => {
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

  it('xóa giáo án không tồn tại thì state giữ nguyên (toEqual)', () => {
    const action = {
      type: 'remove' as const,
      payload: { id: 'non-existent-id' },
    };
    const nextState = routineReducer(initialRoutines, action);

    expect(nextState).toEqual(initialRoutines);
  });
});
