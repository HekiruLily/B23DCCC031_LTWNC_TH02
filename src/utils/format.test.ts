import { describe, it, expect } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('formats 0 seconds correctly', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('formats 30 seconds correctly', () => {
    expect(formatDuration(30)).toBe('0:30');
  });

  it('formats 67 seconds correctly', () => {
    expect(formatDuration(67)).toBe('1:07');
  });

  it('formats exact minutes correctly', () => {
    expect(formatDuration(120)).toBe('2:00');
    expect(formatDuration(600)).toBe('10:00');
  });

  it('handles negative or fractional numbers safely', () => {
    expect(formatDuration(-10)).toBe('0:00');
    expect(formatDuration(65.8)).toBe('1:05');
  });
});

