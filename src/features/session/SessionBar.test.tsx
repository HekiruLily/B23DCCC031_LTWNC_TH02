import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionBar from './SessionBar';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
  { id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 67 },
  { id: 'e3', name: 'Gập tạ đơn 1', trainer: 'Đức Anh', group: 'Tay', duration: 104 },
];

describe('Component SessionBar thanh đồng hồ buổi tập cố định', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      isResting: false,
      restDuration: 10,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hiển thị "Chưa bắt đầu buổi tập" khi chưa có bài tập nào diễn ra', () => {
    render(<SessionBar />);

    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 0 bài')).toBeInTheDocument();
  });

  it('hiển thị thông tin bài tập hiện tại và thời gian đếm ngược khi buổi tập đang chạy', () => {
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 1,
      isRunning: true,
      elapsed: 0,
    });

    render(<SessionBar />);

    expect(
      screen.getByText('Đang tập: Kéo tạ đơn 1 – HLV Phương Anh')
    ).toBeInTheDocument();
    expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 3 bài')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tạm dừng' })).toBeInTheDocument();
  });

  it('đồng hồ nhảy giây mỗi 1000ms khi đang chạy và dừng khi bấm Tạm dừng', () => {
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 1,
      isRunning: true,
      elapsed: 0,
    });

    render(<SessionBar />);
    expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Còn lại: 1:02')).toBeInTheDocument();

    act(() => {
      useSessionStore.getState().toggleRun();
    });
    expect(useSessionStore.getState().isRunning).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(useSessionStore.getState().elapsed).toBe(5);
  });

  it('chuyển sang bài tiếp theo khi bấm nút Sau', async () => {
    const user = userEvent.setup();
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 1,
      isRunning: true,
      elapsed: 10,
    });

    render(<SessionBar />);

    const nextBtn = screen.getByRole('button', { name: 'Sau' });
    await user.click(nextBtn);

    expect(
      screen.getByText('Đang tập: Gập tạ đơn 1 – HLV Đức Anh')
    ).toBeInTheDocument();
  });

  it('hết bài tập thì hiển thị trạng thái Nghỉ ngơi trước khi sang bài tiếp theo', () => {
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 0, 
      isRunning: true,
      elapsed: 29,
    });

    render(<SessionBar />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(
      screen.getByText(/Nghỉ ngơi – Chuẩn bị: Kéo tạ đơn 1/)
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(
      screen.getByText('Đang tập: Kéo tạ đơn 1 – HLV Phương Anh')
    ).toBeInTheDocument();
  });

  it('nhấn phím Space để Bắt đầu/Tạm dừng và bỏ qua khi đang gõ trong ô nhập', () => {
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 0,
      isRunning: true,
      elapsed: 0,
    });

    render(
      <div>
        <input data-testid="test-input" />
        <SessionBar />
      </div>
    );

    fireEvent.keyDown(window, { code: 'Space' });
    expect(useSessionStore.getState().isRunning).toBe(false);

    fireEvent.keyDown(window, { code: 'Space' });
    expect(useSessionStore.getState().isRunning).toBe(true);

    const input = screen.getByTestId('test-input');
    fireEvent.keyDown(input, { code: 'Space' });
    expect(useSessionStore.getState().isRunning).toBe(true);
  });
});
