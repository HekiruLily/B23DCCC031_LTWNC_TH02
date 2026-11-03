import { describe, it, expect, vi } from 'vitest';
import { withLogger } from './withLogger';

describe('withLogger middleware', () => {
  it('returns next state from reducer and logs in DEV mode', () => {
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

