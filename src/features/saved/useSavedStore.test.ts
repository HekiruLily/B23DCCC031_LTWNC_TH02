import { describe, it, expect, beforeEach } from 'vitest';
import { useSavedStore } from './useSavedStore';

describe('Store useSavedStore lưu trữ bài tập đã lưu', () => {
  beforeEach(() => {
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
  });

  it('khởi tạo với danh sách bài tập đã lưu rỗng', () => {
    expect(useSavedStore.getState().ids).toEqual([]);
  });

  it('thêm và bỏ lưu bài tập khi gọi hàm toggle', () => {
    const { toggle } = useSavedStore.getState();

    toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e1']);

    toggle('e2');
    expect(useSavedStore.getState().ids).toEqual(['e1', 'e2']);

    toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e2']);
  });

  it('lưu dữ liệu vào localStorage với key workout-saved', () => {
    const { toggle } = useSavedStore.getState();
    toggle('e1');
    toggle('e3');

    const stored = localStorage.getItem('workout-saved');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.ids).toEqual(['e1', 'e3']);
  });
});
