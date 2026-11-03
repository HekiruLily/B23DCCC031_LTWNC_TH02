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

describe('CountdownBar', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [mockExercise],
      currentIndex: 0,
      isRunning: true,
      elapsed: 0,
    });
  });

  it('renders remaining time formatted properly and initial 0% progress', () => {
    render(<CountdownBar />);

    expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('updates remaining time and progress bar percentage when elapsed changes', () => {
    const { rerender } = render(<CountdownBar />);

    useSessionStore.setState({ elapsed: 5 });
    rerender(<CountdownBar />);

    
    expect(screen.getByText('Còn lại: 1:02')).toBeInTheDocument();
    const progress = screen.getByRole('progressbar');
    
    expect(progress).toHaveAttribute('aria-valuenow', '7');
  });
});

