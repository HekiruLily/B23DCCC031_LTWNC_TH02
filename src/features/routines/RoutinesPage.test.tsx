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

describe('Trang RoutinesPage quản lý danh sách giáo án', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('dùng userEvent: bấm Tạo khi ô trống thì thấy "Tên giáo án không được để trống"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const createBtn = screen.getByRole('button', { name: 'Tạo' });
    await user.click(createBtn);

    expect(screen.getByText('Tên giáo án không được để trống')).toBeInTheDocument();
  });

  it('dùng userEvent: nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByPlaceholderText('Nhập tên giáo án...');
    const createBtn = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Giáo án tăng cơ vai');
    await user.click(createBtn);

    expect(screen.getByText('Giáo án tăng cơ vai')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
  });

  it('báo lỗi "Tên giáo án đã tồn tại" khi tạo giáo án trùng tên không phân biệt hoa thường', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByPlaceholderText('Nhập tên giáo án...');
    const createBtn = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Ngày ngực');
    await user.click(createBtn);
    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();

    await user.type(input, 'ngày NGỰC');
    await user.click(createBtn);

    expect(screen.getByText('Tên giáo án đã tồn tại')).toBeInTheDocument();
  });

  it('xóa giáo án khi bấm nút Xóa', async () => {
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
