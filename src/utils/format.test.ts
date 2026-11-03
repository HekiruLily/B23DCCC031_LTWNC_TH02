import { describe, it, expect } from 'vitest';
import { formatDuration } from './format';

describe('Hàm formatDuration định dạng thời lượng giây sang phút:giây', () => {
  it('định dạng 0 giây thành "0:00"', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('định dạng 67 giây thành "1:07"', () => {
    expect(formatDuration(67)).toBe('1:07');
  });

  it('định dạng 120 giây thành "2:00"', () => {
    expect(formatDuration(120)).toBe('2:00');
  });

  it('định dạng 30 giây thành "0:30"', () => {
    expect(formatDuration(30)).toBe('0:30');
  });

  it('xử lý số âm an toàn trả về "0:00"', () => {
    expect(formatDuration(-5)).toBe('0:00');
  });
});
