import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import LibraryPage from './LibraryPage';

describe('LibraryPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
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
});
