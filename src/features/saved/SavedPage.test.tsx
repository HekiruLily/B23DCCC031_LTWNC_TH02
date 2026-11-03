import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SavedPage from './SavedPage';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';

describe('SavedPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('renders "Bạn chưa lưu bài tập nào" when list is empty', () => {
    render(<SavedPage />);

    expect(screen.getByText('Bạn chưa lưu bài tập nào')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Tập tất cả/i })).not.toBeInTheDocument();
  });

  it('renders saved exercises and starts session when clicking "Tập tất cả"', async () => {
    const user = userEvent.setup();
    useSavedStore.setState({ ids: ['e1', 'e2'] });

    render(<SavedPage />);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();

    const startAllBtn = screen.getByRole('button', { name: /Tập tất cả/i });
    expect(startAllBtn).toBeInTheDocument();

    await user.click(startAllBtn);

    const session = useSessionStore.getState();
    expect(session.queue).toHaveLength(2);
    expect(session.currentIndex).toBe(0);
    expect(session.isRunning).toBe(true);
  });

  it('unsaves an exercise when star button is clicked', async () => {
    const user = userEvent.setup();
    useSavedStore.setState({ ids: ['e1'] });

    render(<SavedPage />);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();

    const unsaveBtn = screen.getByRole('button', { name: 'Bỏ lưu' });
    await user.click(unsaveBtn);

    expect(useSavedStore.getState().ids).toEqual([]);
    expect(screen.getByText('Bạn chưa lưu bài tập nào')).toBeInTheDocument();
  });
});

