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

describe('RoutineDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('renders "Không tìm thấy giáo án" when ID is invalid', () => {
    renderWithProviders(['/routines/non-existent']);

    expect(screen.getByText('Không tìm thấy giáo án')).toBeInTheDocument();
  });

  it('renders routine title, exercises, and calculated total duration: 1 phút 37 giây', () => {
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

  it('starts session with all routine exercises when "Tập tất cả" is clicked', async () => {
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

  it('removes an exercise from routine when clicking Bỏ', async () => {
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

