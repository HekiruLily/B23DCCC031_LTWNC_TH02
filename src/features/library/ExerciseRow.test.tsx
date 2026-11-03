import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseRow } from './ExerciseRow';
import type { Exercise } from '../../types';

const mockExercise: Exercise = {
  id: 'e1',
  name: 'Đẩy tạ đơn 1',
  trainer: 'Minh Khang',
  group: 'Ngực',
  duration: 67,
};

describe('ExerciseRow', () => {
  it('renders exercise information correctly with direct props', () => {
    render(
      <ExerciseRow
        index={0}
        exercise={mockExercise}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Minh Khang')).toBeInTheDocument();
    expect(screen.getByText('Ngực')).toBeInTheDocument();
    expect(screen.getByText('1:07')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lưu bài tập' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Buổi tập' })).toBeInTheDocument();
  });

  it('renders star button as ★ with aria-label="Bỏ lưu" when isSaved is true', () => {
    render(
      <ExerciseRow
        index={0}
        exercise={mockExercise}
        isSaved={true}
      />
    );

    const starBtn = screen.getByRole('button', { name: 'Bỏ lưu' });
    expect(starBtn).toBeInTheDocument();
    expect(starBtn).toHaveTextContent('★');
  });

  it('renders exercise information correctly via data prop (react-window style)', () => {
    render(
      <ExerciseRow
        index={0}
        data={{
          items: [mockExercise],
        }}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
  });

  it('triggers action callbacks when buttons are clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const onSave = vi.fn();
    const onAddToSession = vi.fn();

    render(
      <ExerciseRow
        index={4}
        exercise={mockExercise}
        onStart={onStart}
        onSave={onSave}
        onAddToSession={onAddToSession}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Bắt đầu' }));
    expect(onStart).toHaveBeenCalledWith(mockExercise);

    await user.click(screen.getByRole('button', { name: 'Lưu bài tập' }));
    expect(onSave).toHaveBeenCalledWith(mockExercise);

    await user.click(screen.getByRole('button', { name: '+ Buổi tập' }));
    expect(onAddToSession).toHaveBeenCalledWith(mockExercise);
  });
});
