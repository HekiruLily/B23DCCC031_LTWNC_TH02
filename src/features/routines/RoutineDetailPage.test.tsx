import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RoutineDetailPage from './RoutineDetailPage';
import { RoutineProvider } from './RoutineContext';
import { useSessionStore } from '../session/useSessionStore';

const renderWithProviders = (initialEntries = ['/routines/r1']) => {
  return render(
    <RoutineProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/routines/:id" element={<RoutineDetailPage />} />
        </Routes>
      </MemoryRouter>
    </RoutineProvider>
  );
};

describe('Trang RoutineDetailPage chi tiết giáo án', () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      isResting: false,
    });
  });

  it('hiển thị thông báo "Không tìm thấy giáo án" khi ID không hợp lệ', () => {
    renderWithProviders(['/routines/non-existent']);

    expect(screen.getByText('Không tìm thấy giáo án')).toBeInTheDocument();
  });

  it('hiển thị tên giáo án, danh sách bài tập và tính đúng tổng thời gian: 1 phút 37 giây', () => {
    localStorage.setItem(
      'workout-routines',
      JSON.stringify([
        { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
      ])
    );

    renderWithProviders(['/routines/r1']);

    expect(screen.getByRole('heading', { level: 1, name: 'Ngày ngực' })).toBeInTheDocument();
    expect(screen.getByText(/Tổng thời gian: 1 phút 37 giây/)).toBeInTheDocument();
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
  });

  it('bắt đầu buổi tập với tất cả bài tập trong giáo án khi bấm "Tập tất cả"', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'workout-routines',
      JSON.stringify([
        { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
      ])
    );

    renderWithProviders(['/routines/r1']);

    const startAllBtn = screen.getByRole('button', { name: /Tập tất cả/i });
    await user.click(startAllBtn);

    const session = useSessionStore.getState();
    expect(session.queue).toHaveLength(2);
    expect(session.currentIndex).toBe(0);
    expect(session.isRunning).toBe(true);
    expect(session.queue[0].id).toBe('e1');
  });

  it('xóa bài tập khỏi giáo án khi bấm nút Bỏ', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'workout-routines',
      JSON.stringify([
        { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
      ])
    );

    renderWithProviders(['/routines/r1']);

    const removeBtns = screen.getAllByRole('button', { name: 'Bỏ' });
    await user.click(removeBtns[0]); 

    expect(screen.queryByText('Đẩy tạ đơn 1')).not.toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText(/Tổng thời gian: 1 phút 7 giây/)).toBeInTheDocument();
  });
});
