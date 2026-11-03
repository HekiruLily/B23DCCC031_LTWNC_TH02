import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('Hook generic useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderHook + vi.useFakeTimers(): đổi giá trị, trước 300ms vẫn là giá trị cũ, sau vi.advanceTimersByTime(300) là giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'giá trị cũ', delay: 300 } }
    );

    expect(result.current).toBe('giá trị cũ');

    rerender({ value: 'giá trị mới', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('giá trị cũ');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('giá trị mới');
  });

  it('hủy bỏ bộ đếm thời gian trước đó nếu giá trị liên tục thay đổi trước khi hết 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'lần 1', delay: 300 } }
    );

    rerender({ value: 'lần 2', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('lần 1');

    rerender({ value: 'lần 3', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('lần 1');

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('lần 3');
  });
});
