import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { useSessionStore } from './features/session/useSessionStore';
import { useSavedStore } from './features/saved/useSavedStore';

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('renders navbar brand and navigation links', async () => {
    render(<App />);

    expect(screen.getByText('Bấm Giờ Tập Luyện')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kho bài tập' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Đã lưu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Giáo án' })).toBeInTheDocument();

    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Kho bài tập' })).toBeInTheDocument();
    });
  });

  it('navigates to "Đã lưu" and "Giáo án" pages', async () => {
    const user = userEvent.setup();
    render(<App />);

    const savedLink = screen.getByRole('link', { name: 'Đã lưu' });
    await user.click(savedLink);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Bài tập đã lưu' })).toBeInTheDocument();
    });

    const routinesLink = screen.getByRole('link', { name: 'Giáo án' });
    await user.click(routinesLink);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Danh sách giáo án' })).toBeInTheDocument();
    });
  });

  it('persists saved exercises and displays them on /saved page', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('exercise-row-e1')).toBeInTheDocument();
    });

    const e1Row = screen.getByTestId('exercise-row-e1');
    const saveE1Btn = e1Row.querySelector('.btn-save');
    expect(saveE1Btn).not.toBeNull();
    await user.click(saveE1Btn!);

    const e3Row = screen.getByTestId('exercise-row-e3');
    const saveE3Btn = e3Row.querySelector('.btn-save');
    expect(saveE3Btn).not.toBeNull();
    await user.click(saveE3Btn!);

    const savedInStorage = localStorage.getItem('workout-saved');
    expect(savedInStorage).not.toBeNull();
    expect(JSON.parse(savedInStorage!).state.ids).toEqual(['e1', 'e3']);

    const savedLink = screen.getByRole('link', { name: 'Đã lưu' });
    await user.click(savedLink);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Bài tập đã lưu' })).toBeInTheDocument();
      expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
      expect(screen.getByText('Gập tạ đơn 1')).toBeInTheDocument();
    });
  });

  it('toggles theme between dark and light with Giao diện sáng / Giao diện tối button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeButton = screen.getByRole('button', { name: /Giao diện/i });
    expect(themeButton).toHaveTextContent('Giao diện sáng');

    await user.click(themeButton);
    expect(themeButton).toHaveTextContent('Giao diện tối');

    await user.click(themeButton);
    expect(themeButton).toHaveTextContent('Giao diện sáng');
  });
});
