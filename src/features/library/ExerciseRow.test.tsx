import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseRow } from './ExerciseRow';
import type { Exercise } from '../../types';

const mockExercise30s: Exercise = {
  id: 'e1',
  name: 'Đẩy tạ đơn 1',
  trainer: 'Minh Khang',
  group: 'Ngực',
  duration: 30,
};

describe('Component ExerciseRow dòng bài tập', () => {
  it('hiển thị tên bài tập và "0:30"', () => {
    render(<ExerciseRow index={0} exercise={mockExercise30s} />);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });

  it('bấm nút Bắt đầu (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài tập', async () => {
    const user = userEvent.setup();
    const mockStart = vi.fn();

    render(
      <ExerciseRow
        index={0}
        exercise={mockExercise30s}
        onStart={mockStart}
      />
    );

    const startBtn = screen.getByRole('button', { name: 'Bắt đầu' });
    await user.click(startBtn);

    expect(mockStart).toHaveBeenCalledTimes(1);
    expect(mockStart).toHaveBeenCalledWith(mockExercise30s);
  });

  it('hiển thị huy hiệu nhóm cơ, tên huấn luyện viên và số thứ tự chính xác', () => {
    render(<ExerciseRow index={5} exercise={mockExercise30s} />);

    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Minh Khang')).toBeInTheDocument();
    expect(screen.getByText('Ngực')).toBeInTheDocument();
  });

  it('đổi icon ngôi sao sang ★ và aria-label "Bỏ lưu" khi bài tập đã được lưu', () => {
    render(<ExerciseRow index={0} exercise={mockExercise30s} isSaved={true} />);

    const starBtn = screen.getByRole('button', { name: 'Bỏ lưu' });
    expect(starBtn).toBeInTheDocument();
    expect(starBtn).toHaveTextContent('★');
  });

  it('khóa nút "+ Giáo án" khi isAddToRoutineDisabled là true', () => {
    render(
      <ExerciseRow
        index={0}
        exercise={mockExercise30s}
        isAddToRoutineDisabled={true}
      />
    );

    const addRoutineBtn = screen.getByRole('button', { name: '+ Giáo án' });
    expect(addRoutineBtn).toBeDisabled();
  });
});
