import { describe, it, expect } from 'vitest';
import { EXERCISES, generateExercises } from './exercises';

describe('Dữ liệu bài tập exercises', () => {
  it('generateExercises(10000) sinh ra đúng 10000 phần tử', () => {
    const list = generateExercises(10000);
    expect(list).toHaveLength(10000);
    expect(EXERCISES).toHaveLength(10000);
  });

  it('tất cả các bài tập đều có id duy nhất không bị trùng lặp', () => {
    const ids = EXERCISES.map((ex) => ex.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10000);
  });

  it('mọi bài tập đều có thời lượng duration nằm trong khoảng từ 30 đến 120 giây', () => {
    const allValid = EXERCISES.every(
      (ex) => ex.duration >= 30 && ex.duration <= 120
    );
    expect(allValid).toBe(true);
  });

  it('bài tập đầu tiên e1 khớp với thông tin mẫu: Đẩy tạ đơn 1, Minh Khang, Ngực, 30 giây', () => {
    expect(EXERCISES[0]).toEqual({
      id: 'e1',
      name: 'Đẩy tạ đơn 1',
      trainer: 'Minh Khang',
      group: 'Ngực',
      duration: 30,
    });
  });
});
