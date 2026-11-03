import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
  { id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 67 },
  { id: 'e3', name: 'Gập tạ đơn 1', trainer: 'Đức Anh', group: 'Tay', duration: 104 },
];

describe('useSessionStore quản lý buổi tập', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      isResting: false,
      restDuration: 10,
    });
  });

  it('startSession đặt đúng bài và khởi động buổi tập', () => {
    const { startSession } = useSessionStore.getState();
    startSession(mockExercises, 1);

    const state = useSessionStore.getState();
    expect(state.queue).toHaveLength(3);
    expect(state.currentIndex).toBe(1);
    expect(state.queue[state.currentIndex].id).toBe('e2');
    expect(state.isRunning).toBe(true);
    expect(state.elapsed).toBe(0);
    expect(state.isResting).toBe(false);
  });

  it('hết bài tập thì đếm nghỉ 10 giây rồi mới tự động sang bài sau', () => {
    const { startSession, tick } = useSessionStore.getState();
    startSession(mockExercises, 0); 

    useSessionStore.setState({ elapsed: 29 });
    tick(); 
    expect(useSessionStore.getState().isResting).toBe(true);
    expect(useSessionStore.getState().elapsed).toBe(0);
    expect(useSessionStore.getState().currentIndex).toBe(0);

    for (let i = 0; i < 9; i++) {
      tick();
    }
    expect(useSessionStore.getState().isResting).toBe(true);
    expect(useSessionStore.getState().elapsed).toBe(9);

    tick();
    expect(useSessionStore.getState().isResting).toBe(false);
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().queue[1].id).toBe('e2');
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('next ở bài cuối thì isRunning là false', () => {
    const { startSession, next } = useSessionStore.getState();
    startSession(mockExercises, 2);
    expect(useSessionStore.getState().isRunning).toBe(true);
    next();
    expect(useSessionStore.getState().isRunning).toBe(false);
    expect(useSessionStore.getState().isResting).toBe(false);
  });

  it('toggleRun chuyển đổi giữa trạng thái chạy và tạm dừng', () => {
    const { startSession, toggleRun } = useSessionStore.getState();
    startSession(mockExercises, 0);
    expect(useSessionStore.getState().isRunning).toBe(true);

    toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(false);

    toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(true);
  });

  it('prev khi đã tập quá 3 giây thì chỉ đặt lại bài hiện tại về 0', () => {
    const { startSession, prev } = useSessionStore.getState();
    startSession(mockExercises, 1);

    useSessionStore.setState({ elapsed: 5 });
    prev();
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('prev khi tập dưới 3 giây thì lùi về bài trước', () => {
    const { startSession, prev } = useSessionStore.getState();
    startSession(mockExercises, 1);

    useSessionStore.setState({ elapsed: 2 });
    prev();
    expect(useSessionStore.getState().currentIndex).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('addToSession thêm bài tập vào cuối danh sách và bỏ qua nếu trùng', () => {
    const { addToSession } = useSessionStore.getState();
    addToSession(mockExercises[0]);
    expect(useSessionStore.getState().queue).toHaveLength(1);

    addToSession(mockExercises[1]);
    expect(useSessionStore.getState().queue).toHaveLength(2);

    addToSession(mockExercises[0]);
    expect(useSessionStore.getState().queue).toHaveLength(2);
  });
});
