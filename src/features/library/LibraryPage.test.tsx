import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import LibraryPage from './LibraryPage';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';
import { RoutineProvider } from '../routines/RoutineContext';

const renderWithRoutine = (ui: React.ReactElement) => {
  return render(<RoutineProvider>{ui}</RoutineProvider>);
};

describe('Trang LibraryPage kho 10.000 bài tập', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      isResting: false,
    });
    useSavedStore.setState({ ids: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ban đầu hiển thị "Tìm thấy 10000 bài tập" và chỉ có khoảng 10-15 dòng trong DOM', () => {
    renderWithRoutine(<LibraryPage />);

    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    const renderedRows = screen.getAllByTestId(/^exercise-row-/);
    expect(renderedRows.length).toBeGreaterThan(0);
    expect(renderedRows.length).toBeLessThanOrEqual(20);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
  });

  it('debounce tìm kiếm 300ms khi gõ "đẩy"', () => {
    renderWithRoutine(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'đẩy' } });

    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1250 bài tập')).toBeInTheDocument();
  });

  it('lọc theo nhóm cơ "Vai" trong khi vẫn giữ ô tìm kiếm là "đẩy"', () => {
    renderWithRoutine(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'đẩy' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Tìm thấy 1250 bài tập')).toBeInTheDocument();

    const groupSelect = screen.getByLabelText('Nhóm cơ');
    fireEvent.change(groupSelect, { target: { value: 'Vai' } });

    expect(screen.getByText('Tìm thấy 250 bài tập')).toBeInTheDocument();
  });

  it('xóa ô tìm kiếm, chọn "Tất cả", gõ "đức anh" để tìm 1000 bài tập theo huấn luyện viên', () => {
    renderWithRoutine(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    const groupSelect = screen.getByLabelText('Nhóm cơ');

    fireEvent.change(groupSelect, { target: { value: 'Tất cả' } });
    fireEvent.change(searchInput, { target: { value: 'đức anh' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1000 bài tập')).toBeInTheDocument();
  });

  it('hiển thị "Không tìm thấy bài tập nào" khi từ khóa không khớp như "xyz"', () => {
    renderWithRoutine(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'xyz' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Không tìm thấy bài tập nào')).toBeInTheDocument();
    expect(screen.queryByTestId(/^exercise-row-/)).not.toBeInTheDocument();
  });

  it('sắp xếp theo Tên A–Z với dòng đầu tiên là "Bật chậm 1"', () => {
    renderWithRoutine(<LibraryPage />);

    const sortSelect = screen.getByLabelText('Sắp xếp');
    fireEvent.change(sortSelect, { target: { value: 'name-asc' } });

    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
    expect(screen.getByText('Bật chậm 1')).toBeInTheDocument();
  });

  it('sắp xếp theo Thời lượng tăng dần', () => {
    renderWithRoutine(<LibraryPage />);

    const sortSelect = screen.getByLabelText('Sắp xếp');
    fireEvent.change(sortSelect, { target: { value: 'duration-asc' } });

    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
    const rows = screen.getAllByTestId(/^exercise-row-/);
    expect(rows.length).toBeGreaterThan(0);
    expect(screen.getAllByText('0:30').length).toBeGreaterThan(0);
  });

  it('bắt đầu buổi tập khi bấm "Bắt đầu" ở một dòng bài tập', () => {
    renderWithRoutine(<LibraryPage />);

    const e2Row = screen.getByTestId('exercise-row-e2');
    const startBtn = e2Row.querySelector('.btn-start');
    expect(startBtn).not.toBeNull();
    fireEvent.click(startBtn!);

    const session = useSessionStore.getState();
    expect(session.queue).toHaveLength(10000);
    expect(session.currentIndex).toBe(1);
    expect(session.isRunning).toBe(true);
    expect(session.queue[session.currentIndex].id).toBe('e2');
  });

  it('bắt đầu buổi tập với danh sách đã lọc khi đang tìm kiếm', () => {
    renderWithRoutine(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'đẩy' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    const startBtns = screen.getAllByRole('button', { name: 'Bắt đầu' });
    fireEvent.click(startBtns[0]);

    const session = useSessionStore.getState();
    expect(session.queue).toHaveLength(1250);
    expect(session.currentIndex).toBe(0);
    expect(session.isRunning).toBe(true);
    expect(session.queue[0].name).toContain('Đẩy');
  });

  it('thêm bài tập vào buổi tập khi bấm "+ Buổi tập"', () => {
    renderWithRoutine(<LibraryPage />);

    const addBtns = screen.getAllByRole('button', { name: '+ Buổi tập' });
    fireEvent.click(addBtns[0]);

    expect(useSessionStore.getState().queue).toHaveLength(1);
    expect(useSessionStore.getState().queue[0].id).toBe('e1');
  });

  it('thay đổi trạng thái lưu khi bấm vào nút ngôi sao', () => {
    renderWithRoutine(<LibraryPage />);

    const starBtns = screen.getAllByRole('button', { name: 'Lưu bài tập' });
    fireEvent.click(starBtns[0]);

    expect(useSavedStore.getState().ids).toEqual(['e1']);
  });

  it('khóa nút "+ Giáo án" khi chưa có giáo án và kích hoạt khi đã có giáo án', () => {
    const { unmount } = renderWithRoutine(<LibraryPage />);
    const routineSelect = screen.getByLabelText('Giáo án đang chọn');
    expect(routineSelect).toBeDisabled();

    const addRoutineBtns = screen.getAllByRole('button', { name: '+ Giáo án' });
    expect(addRoutineBtns[0]).toBeDisabled();
    unmount();

    localStorage.setItem(
      'workout-routines',
      JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }])
    );
    renderWithRoutine(<LibraryPage />);

    const enabledAddBtns = screen.getAllByRole('button', { name: '+ Giáo án' });
    expect(enabledAddBtns[0]).not.toBeDisabled();

    fireEvent.click(enabledAddBtns[0]);

    const stored = JSON.parse(localStorage.getItem('workout-routines')!);
    expect(stored[0].exerciseIds).toContain('e1');
  });
});
