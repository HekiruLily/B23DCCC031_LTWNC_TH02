import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RoutinesPage from './RoutinesPage';
import { RoutineProvider } from './RoutineContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <RoutineProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </RoutineProvider>
  );
};

describe('RoutinesPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders empty state initially', () => {
    renderWithProviders(<RoutinesPage />);

    expect(screen.getByText('Chưa có giáo án nào. Hãy tạo giáo án đầu tiên của bạn!')).toBeInTheDocument();
  });

  it('shows error when routine name is empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const createBtn = screen.getByRole('button', { name: 'Tạo' });
    await user.click(createBtn);

    expect(screen.getByText('Tên giáo án không được để trống')).toBeInTheDocument();
  });

  it('creates a routine and prevents duplicate names (case-insensitive)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByPlaceholderText('Nhập tên giáo án...');
    const createBtn = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Ngày ngực');
    await user.click(createBtn);

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();

    await user.type(input, 'ngày NGỰC');
    await user.click(createBtn);

    expect(screen.getByText('Tên giáo án đã tồn tại')).toBeInTheDocument();
  });

  it('deletes a routine when clicking Xóa', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'workout-routines',
      JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }])
    );

    renderWithProviders(<RoutinesPage />);

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: 'Xóa' });
    await user.click(deleteBtn);

    expect(screen.queryByText('Ngày ngực')).not.toBeInTheDocument();
  });
});

