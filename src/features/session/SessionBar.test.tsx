import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionBar from './SessionBar';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
  { id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 67 },
  { id: 'e3', name: 'Gập tạ đơn 1', trainer: 'Đức Anh', group: 'Tay', duration: 104 },
];

describe('SessionBar', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders "Chưa bắt đầu buổi tập" when not started', () => {
    render(<SessionBar />);

    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 0 bài')).toBeInTheDocument();
  });

  it('renders active exercise and countdown when session is active', () => {
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

  it('ticks every second when running and updates countdown', () => {
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
  });

  it('pauses ticking when Tạm dừng is clicked and resumes when Bắt đầu is clicked', async () => {
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 1,
      isRunning: true,
      elapsed: 0,
    });

    render(<SessionBar />);

    
    act(() => {
      useSessionStore.getState().toggleRun();
    });
    expect(useSessionStore.getState().isRunning).toBe(false);

    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(useSessionStore.getState().elapsed).toBe(0);

    
    act(() => {
      useSessionStore.getState().toggleRun();
    });
    expect(useSessionStore.getState().isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(useSessionStore.getState().elapsed).toBe(2);
  });

  it('switches to next exercise when Sau button is clicked', async () => {
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
    expect(screen.getByText('Còn lại: 1:44')).toBeInTheDocument();
  });

  it('automatically advances to next exercise when time expires', () => {
    useSessionStore.setState({
      queue: mockExercises,
      currentIndex: 0, 
      isRunning: true,
      elapsed: 0,
    });

    render(<SessionBar />);

    expect(
      screen.getByText('Đang tập: Đẩy tạ đơn 1 – HLV Minh Khang')
    ).toBeInTheDocument();

    
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    
    expect(
      screen.getByText('Đang tập: Kéo tạ đơn 1 – HLV Phương Anh')
    ).toBeInTheDocument();
  });
});
