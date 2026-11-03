import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountdownBar } from './CountdownBar';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercise: Exercise = {
  id: 'e1',
  name: 'Đẩy tạ đơn 1',
  trainer: 'Minh Khang',
  group: 'Ngực',
  duration: 67,
};

describe('Component CountdownBar hiển thị đếm ngược và thanh tiến trình', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [mockExercise],
      currentIndex: 0,
      isRunning: true,
      elapsed: 0,
      isResting: false,
      restDuration: 10,
    });
  });

  it('hiển thị đúng thời gian còn lại định dạng phút:giây và tiến trình 0%', () => {
    render(<CountdownBar />);

    expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('cập nhật thời gian còn lại và phần trăm tiến trình khi elapsed thay đổi', () => {
    const { rerender } = render(<CountdownBar />);

    useSessionStore.setState({ elapsed: 5 });
    rerender(<CountdownBar />);

    expect(screen.getByText('Còn lại: 1:02')).toBeInTheDocument();
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '7');
  });

  it('hiển thị nhãn đếm ngược khi đang trong thời gian nghỉ ngơi', () => {
    useSessionStore.setState({ isResting: true, elapsed: 2 });
    render(<CountdownBar />);

    expect(screen.getByText('Nghỉ: Còn lại 0:08')).toBeInTheDocument();
  });
});
