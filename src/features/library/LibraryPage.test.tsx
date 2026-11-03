import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import LibraryPage from './LibraryPage';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';

describe('LibraryPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
    useSavedStore.setState({ ids: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initially renders "Tìm thấy 10000 bài tập" and only a limited number of rows in DOM', () => {
    render(<LibraryPage />);

    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    const renderedRows = screen.getAllByTestId(/^exercise-row-/);
    expect(renderedRows.length).toBeGreaterThan(0);
    expect(renderedRows.length).toBeLessThanOrEqual(20);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
  });

  it('debounces search by 300ms when typing "đẩy"', () => {
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'đẩy' } });

    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1250 bài tập')).toBeInTheDocument();
  });

  it('filters by muscle group "Vai" while keeping search "đẩy"', () => {
    render(<LibraryPage />);

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

  it('clears search, selects "Tất cả", types "đức anh" to find 1000 exercises by trainer', () => {
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    const groupSelect = screen.getByLabelText('Nhóm cơ');

    fireEvent.change(groupSelect, { target: { value: 'Tất cả' } });
    fireEvent.change(searchInput, { target: { value: 'đức anh' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1000 bài tập')).toBeInTheDocument();
  });

  it('displays "Không tìm thấy bài tập nào" when search has no matches like "xyz"', () => {
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'xyz' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Không tìm thấy bài tập nào')).toBeInTheDocument();
    expect(screen.queryByTestId(/^exercise-row-/)).not.toBeInTheDocument();
  });

  it('sorts alphabetically by name (Tên A–Z) with first row being "Bật chậm 1"', () => {
    render(<LibraryPage />);

    const sortSelect = screen.getByLabelText('Sắp xếp');
    fireEvent.change(sortSelect, { target: { value: 'name-asc' } });

    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
    expect(screen.getByText('Bật chậm 1')).toBeInTheDocument();
  });

  it('sorts by duration ascending (Thời lượng tăng dần)', () => {
    render(<LibraryPage />);

    const sortSelect = screen.getByLabelText('Sắp xếp');
    fireEvent.change(sortSelect, { target: { value: 'duration-asc' } });

    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
    const rows = screen.getAllByTestId(/^exercise-row-/);
    expect(rows.length).toBeGreaterThan(0);
    expect(screen.getAllByText('0:30').length).toBeGreaterThan(0);
  });

  it('starts session when clicking "Bắt đầu" at a row with current filtered/sorted list', () => {
    render(<LibraryPage />);

    
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

  it('starts session with filtered list when search is active and advances to next filtered exercise', () => {
    render(<LibraryPage />);

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

    
    session.next();
    const nextSession = useSessionStore.getState();
    expect(nextSession.currentIndex).toBe(1);
    expect(nextSession.queue[1].name).toContain('Đẩy');
  });

  it('adds exercise to session queue when clicking "+ Buổi tập"', () => {
    render(<LibraryPage />);

    const addBtns = screen.getAllByRole('button', { name: '+ Buổi tập' });
    fireEvent.click(addBtns[0]); 

    expect(useSessionStore.getState().queue).toHaveLength(1);
    expect(useSessionStore.getState().queue[0].id).toBe('e1');
  });

  it('toggles save status when clicking star button on a row', () => {
    render(<LibraryPage />);

    const starBtns = screen.getAllByRole('button', { name: 'Lưu bài tập' });
    fireEvent.click(starBtns[0]); 

    expect(useSavedStore.getState().ids).toEqual(['e1']);
  });
});
