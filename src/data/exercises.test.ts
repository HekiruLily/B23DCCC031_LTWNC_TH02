import { describe, it, expect } from 'vitest';
import { EXERCISES, generateExercises, GROUPS } from './exercises';

describe('exercises data', () => {
  it('generates the specified count of exercises', () => {
    const customList = generateExercises(5);
    expect(customList).toHaveLength(5);
    expect(customList[0].id).toBe('e1');
  });

  it('contains exactly 10000 exercises in EXERCISES', () => {
    expect(EXERCISES).toHaveLength(10000);
  });

  it('matches expected predefined values for the first 3 exercises', () => {
    expect(EXERCISES[0]).toEqual({
      id: 'e1',
      name: 'Đẩy tạ đơn 1',
      trainer: 'Minh Khang',
      group: 'Ngực',
      duration: 30,
    });

    expect(EXERCISES[1]).toEqual({
      id: 'e2',
      name: 'Kéo tạ đơn 1',
      trainer: 'Phương Anh',
      group: 'Chân',
      duration: 67,
    });

    expect(EXERCISES[2]).toEqual({
      id: 'e3',
      name: 'Gập tạ đơn 1',
      trainer: 'Đức Anh',
      group: 'Tay',
      duration: 104,
    });
  });

  it('ensures all exercises have valid muscle groups and duration between 30 and 120 seconds', () => {
    for (let i = 0; i < 100; i++) {
      const ex = EXERCISES[i];
      expect(GROUPS).toContain(ex.group);
      expect(ex.duration).toBeGreaterThanOrEqual(30);
      expect(ex.duration).toBeLessThanOrEqual(120);
    }
  });
});

