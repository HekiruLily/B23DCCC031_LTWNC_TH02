import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders navbar brand and navigation links', async () => {
    render(<App />);

    expect(screen.getByText('Bấm Giờ Tập Luyện')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kho bài tập' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Đã lưu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Giáo án' })).toBeInTheDocument();

    // Bottom fixed session bar
    expect(screen.getByText('Chưa có bài tập nào đang diễn ra')).toBeInTheDocument();

    // Default route is LibraryPage
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Kho bài tập' })).toBeInTheDocument();
    });
  });

  it('navigates to "Đã lưu" and "Giáo án" pages', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click "Đã lưu"
    const savedLink = screen.getByRole('link', { name: 'Đã lưu' });
    await user.click(savedLink);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Bài tập đã lưu' })).toBeInTheDocument();
    });

    // Click "Giáo án"
    const routinesLink = screen.getByRole('link', { name: 'Giáo án' });
    await user.click(routinesLink);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Danh sách giáo án' })).toBeInTheDocument();
    });
  });

  it('toggles theme between dark and light', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeButton = screen.getByRole('button', { name: /Sáng|Tối/i });
    expect(themeButton).toHaveTextContent('☀️ Sáng');

    await user.click(themeButton);
    expect(themeButton).toHaveTextContent('🌙 Tối');
  });
});

