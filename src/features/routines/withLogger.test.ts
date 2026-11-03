import { describe, it, expect, vi } from 'vitest';
import { withLogger } from './withLogger';

describe('Middleware withLogger ghi log cho reducer', () => {
  it('trả về state mới từ reducer gốc và ghi log tên action cùng state trước/sau trong môi trường DEV', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const mockReducer = (state: number, action: { type: string }) => {
      if (action.type === 'increment') return state + 1;
      return state;
    };

    const enhancedReducer = withLogger(mockReducer);
    const result = enhancedReducer(10, { type: 'increment' });

    expect(result).toBe(11);
    if (import.meta.env.DEV) {
      expect(consoleSpy).toHaveBeenCalledWith('increment', 10, 11);
    }

    consoleSpy.mockRestore();
  });
});
